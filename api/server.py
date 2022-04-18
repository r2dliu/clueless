# from typing import Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from connection_manager import ConnectionManager
from uuid import UUID, uuid4
import json
from typing import Optional
from game.clueless import Clueless

app = FastAPI()
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
                    if (data["type"] == "chat"):
                        # chat messages are forwarded to everyone
                        await connection_manager.broadcast(data)
                    elif (data["type"] == "start"):
                        game.initialize_board()
                    elif (data["type"] == "select_character"):
                        connection_manager.assign_character(
                            client_uuid, data["character_token"])
                    elif (data["type"] == "move"):
                        game.move(data["suspect"], data["location"])
                    elif (data["type"] == "accusation"):
                        data.pop("type")
                        game.make_accusation(clientSuspect, data)
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
