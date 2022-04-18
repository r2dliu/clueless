import json
from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}
        self.id_to_char: dict[str, str] = {}

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

    def assign_character(self, uuid, character: str):
        """ Assigns clue character to a player """
        if character not in self.id_to_char.values():
            self.id_to_char[uuid] = character
            return True
        else:
            return False

    def get_players(self):
        """ Returns list of current players' selected characters """
        return list(self.id_to_char.values())

    def get_assignments(self):
        return self.id_to_char
