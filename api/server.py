# from typing import Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from connection_manager import ConnectionManager
from uuid import UUID, uuid4
import json
from typing import Optional
from game.clueless import Clueless, GamePhase

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
connection_manager = ConnectionManager()
games_by_id = {}

### uncomment to test server
# connection_manager.id_to_char = {
#    str(uuid4()): 'miss_scarlet',
#    str(uuid4()): 'professor_plum'
#    }
# games_by_id['test'] = Clueless(connection_manager)
# games_by_id['test'].initialize_board()
# test_acc = json.loads('{"suspect": "professor_plum", "weapon": "lead_pipe","room": "ballroom"}')
#####


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/new_game")
def create_game():
    id = uuid4()
    # Bug here: it is reusing the same class somehow instead of generating
    # a new instance
    game = Clueless(connection_manager)
    games_by_id[id] = game
    return id


@app.websocket("/ws/{game_uuid}/{client_uuid}")
async def websocket_connection(websocket: WebSocket, game_uuid: str,
                               client_uuid: str):
    if UUID(game_uuid) in games_by_id:
        game = games_by_id[UUID(game_uuid)]

        if connection_manager.has_existing_connection(client_uuid):
            # this username already exists in game, prevent connection
            await websocket.close(code=409)
            return

        await connection_manager.connect(client_uuid, websocket)
        # Successfully connected websocket!

        try:
            while True:
                message = game.get_state()
                clientSuspect = message["assignments"].get(client_uuid, "")
                print(message)
                message["type"] = "state"
                await connection_manager.broadcast(message)
                data = await websocket.receive_json()
                print("wow got message")
                print(data)

                # ignore message without 'type' key
                # all messages must have a type
                if "type" in data:

                    # Chat messages
                    if (data["type"] == "chat"):
                        # chat messages are forwarded to everyone
                        await connection_manager.broadcast(data)

                    # Start game
                    elif (data["type"] == "start"):
                        game.initialize_board()

                    # Character select assignments
                    elif (data["type"] == "select_character"):
                        connection_manager.assign_character(
                            client_uuid, data["character_token"])

                    # Player move
                    elif (data["type"] == "move"):
                        # Validate turn order
                        if (message["current_turn"] == clientSuspect):
                            game.move(data["suspect"], data["location"])

                            ### uncomment to see turn error message on a valid turn
                            # await connection_manager.send_personal_message(
                            #    json.dumps({"type": "turn_error"}), websocket)
                            ###
                        else:
                            await connection_manager.send_personal_message(
                                json.dumps({"type": "turn_error"}), websocket)

                    # Player accusation
                    elif (data["type"] == "accusation"):
                        # Validate turn order
                        if (message["current_turn"] == clientSuspect):
                            data.pop("type")
                            game.make_accusation(clientSuspect, data)
                        else:
                            await connection_manager.send_personal_message(
                                json.dumps({"type": "turn_error"}), websocket)

                    # start suggestion
                    elif (data["type"] == "suggestion"):
                        # Validate turn order
                        if (message["current_turn"] == clientSuspect):
                            # Handle suggestion 
                            game.initiate_suggestion(clientSuspect, data["suggestion"])
                            validCards = game.getValidcards(data["next_to_disprove"], data["suggestion"])
                            await connection_manager.broadcast(
                                json.dumps({"type": "validCards", "cards":  json.dumps(validCards)}), websocket)
                        else:
                            await connection_manager.send_personal_message(
                                json.dumps({"type": "turn_error"}), websocket)
                    

                    elif (data["type"] == "disprove_suggestion"):
                        game.disprove_suggestion(clientSuspect, data.get("card", None))
                        newState = game.get_state()

                        # the suggestion is still going
                        if(newState.game_phase == GamePhase.SUGGESTION.value):
                            await connection_manager.broadcast(
                                json.dumps({"type": "validCards", "cards":  json.dumps(validCards)}), websocket)

                    # Suggestion cycle
                    # front end caller should update suggestion_actor as cycle continues
                    # break when full circle msg is sent
                    # counter suggestion
                    elif (data["type"] == "next_to_disprove"):
                        # check gamestate for current players cards
                        # send websocket message that conatins any cards that match the suggestion
                        validCards = game.getValidcards(data["next_to_disprove"], data["suggestion"])
                        await connection_manager.send_personal_message(
                                json.dumps({"type": "validCards", "cards":  json.dumps(validCards)}), websocket)

                        next_up = game.next_to_disprove(data["suggestion_actor"])
                        # has every player attempted to disprove?
                        if next_up == message["suggestion_starter"]:
                            await connection_manager.send_personal_message(
                                json.dumps({"type": "full_circle"}), websocket)

                    # End suggestion
                    elif (data["type"] == "end_suggestion"):
                        game.terminate_suggestion()

                    # End turn
                    elif (data["type"] == "end_turn"):
                        game.rotate_next_player(clientSuspect, False)

                    # handle other types of messages
                    # pick character
                    # move
                    # accusation
                    # etc

        except WebSocketDisconnect:
            connection_manager.disconnect(client_uuid)
            await connection_manager.broadcast(
                json.dumps({"disconnect": client_uuid}))
    else:
        # this game doesn't exist
        await websocket.close(code=404)
