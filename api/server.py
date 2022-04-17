# from typing import Optional

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
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
    games_by_id[id] = Clueless(connection_manager)
    return id, json.dumps(games_by_id[id].get_game_state())


# FIXME: Had trouble with {id} part of route so just having
# it return the game state of the only game we have running
# to test board
# @app.get("/start_game/{id}")
# def start_game(id: str):
@app.get("/start_game")
def start_game():
    # start game and return initial state
    try:
        # return json.dumps(games_by_id[id].initialize_board())
        return json.dumps(games_by_id[0].initialize_board())
    except KeyError:
        # game wasn't created?
        # games_by_id[id] = Clueless(connection_manager)
        # return json.dumps(games_by_id[id].initialize_board())
        games_by_id[0] = Clueless(connection_manager)
        return json.dumps(games_by_id[0].initialize_board())


@app.get("/get_connections")
def get_connections(id: str):
    return json.dumps(games_by_id[id].get_connections())


@app.get("/get_state/")
def get_state(id: str):
    # query clueless for current state
    return json.dumps(games_by_id[id].get_game_state())


@app.put("/update_state")
def update_state(id: str, state: str):
    # updates global game state with client's changes and returns new state
    games_by_id[id].state = json.loads(state)
    return games_by_id[id].get_game_state()


@app.get("/allowed_moves")
def get_allowed_moves(id: str, player: str):
    # return list of allowed moves for a given player
    return json.dumps(games_by_id[id].allowed_moves(player))


@app.get("/verify_accusation")
def verify_accusation(id: str, accusation: str):
    # check if client's accusation is correct
    return json.dumps(games_by_id[id].verify_accusation(accusation))


@app.websocket("/ws/{game_uuid}/{client_uuid}")
async def websocket_connection(websocket: WebSocket, game_uuid: str,
                               client_uuid: str):
    if UUID(game_uuid) in games_by_id:
        if connection_manager.has_existing_connection(client_uuid):
            # this username already exists in game, prevent connection
            await websocket.close(code=409)
            return

        await connection_manager.connect(client_uuid, websocket)

        try:
            while True:
                data = await websocket.receive_json()
                print("wow got message")
                print(data)
                await connection_manager.broadcast(data)

                if ("token" in data.keys()):
                    status = connection_manager.assign_character(data['clientId'], data['token'])
                    if status:
                        print(f"assigned player {data['clientId']} to token {data['token']}")
                    else:
                        print("todo token already claimed, grey out button or something")
                    print(connection_manager.get_players())

        except WebSocketDisconnect:
            connection_manager.disconnect(client_uuid)
            await connection_manager.broadcast(
                json.dumps({"disconnect": client_uuid}))
    else:
        # this game doesn't exist
        await websocket.close(code=404)
