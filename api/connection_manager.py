import json
from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    def has_existing_connection(self, uuid):
        return True if uuid in self.active_connections else False

    async def connect(self, uuid: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[uuid] = websocket

    def disconnect(self, uuid: str):
        self.active_connections.pop(uuid)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: json):
        for connection in self.active_connections.values():
            await connection.send_json(message)

    def get_connections(self):
        return self.active_connections
