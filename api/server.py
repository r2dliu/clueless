# from typing import Optional

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from connection_manager import ConnectionManager
app = FastAPI()
connection_manager = ConnectionManager()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.websocket("/ws/{uuid}")
async def websocket_connection(websocket: WebSocket, uuid: str):
    if (connection_manager.has_existing_connection(uuid)):
        raise HTTPException(
            status_code=409,
            detail="Websocket client with this UUID already exists")

    await connection_manager.connect(uuid, websocket)

    try:
        while True:
            data = await websocket.receive_text()
            await connection_manager.send_personal_message(
                f"You wrote: {data}", websocket)
            await connection_manager.broadcast(
                f"Client #{uuid} says: {data}")
    except WebSocketDisconnect:
        connection_manager.disconnect(uuid)
        await connection_manager.broadcast(
            f"Client #{uuid} left the chat")
