# from typing import Optional

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from connection_manager import ConnectionManager
from uuid import UUID, uuid4
import json
from game.clueless import Clueless

app = FastAPI()
connection_manager = ConnectionManager()
games_by_id = {}


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/new_game")
def create_game():
    id = uuid4()
    games_by_id[id] = Clueless(connection_manager)
    return id


@app.get("/start_game/{id}")
def start_game(id: str):
    try:
        return games_by_id[id].initialize_board()
    except KeyError:
        # game wasn't created?
        games_by_id[id] = Clueless(connection_manager)
        return games_by_id[id].initialize_board()



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
        except WebSocketDisconnect:
            connection_manager.disconnect(client_uuid)
            await connection_manager.broadcast(
                json.dumps({"disconnect": client_uuid}))
    else:
        # this game doesn't exist
        await websocket.close(code=404)
