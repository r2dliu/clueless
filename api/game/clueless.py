import random
import json
from enum import Enum
from typing import Dict, List, Tuple
from connection_manager import ConnectionManager


class GamePhase(Enum):
    NOT_STARTED = 0
    IN_PROGRESS = 1
    COMPLETED = 2


class Clueless:
    # TODO suggestion logic, available movement options

    def __init__(self, connection_manager):

        self.connection_manager = connection_manager

        self.rooms = [
            "study",
            "hall",
            "lounge",
            "library",
            "billiard",
            "dining",
            "conservatory",
            "ballroom",
            "kitchen",
        ]
        self.suspects = [
            "colonel_mustard",
            "miss_scarlet",
            "professor_plum",
            "mr_green",
            "mrs_white",
            "mrs_peacock",
        ]
        self.weapons = [
            "rope",
            "lead_pipe",
            "knife",
            "wrench",
            "candlestick",
            "revolver",
        ]
        self.cards = self.suspects + self.weapons + self.rooms

        self.hallways = [
            "study_hall",
            "hall_lounge",
            "lounge_dining",
            "dining_kitchen",
            "kitchen_ballroom",
            "ballroom_conservatory",
            "conservatory_library",
            "library_study",
            "hall_billiard",
            "dining_billiard",
            "ballroom_billiard",
            "library_billiard",
        ]
        self.secret_passages = ["study_kitchen", "lounge_conservatory"]

        self.starting_locations = [
            "scarlet_start",
            "plum_start",
            "green_start",
            "white_start",
            "peacock_start",
            "mustard_start",
        ]
        self.first_moves = {
            "miss_scarlet": "hall_lounge",
            "professor_plum": "library_study",
            "mr_green": "ballroom_conservatory",
            "mrs_white": "kitchen_ballroom",
            "mrs_peacock": "conservatory_library",
            "colonel_mustard": "lounge_dining",
        }

        self.players = connection_manager.get_players()

        self.state = {  # data structs are just placeholders
            "game_phase":
            GamePhase.NOT_STARTED.value,  # determines what view players see
            "suspect_locations": {},  # dict of suspect: room/hallway loc
            "concealed_scenario": {},
            "player_cards": {},  # dict of player: player's card list
            "visible_cards": [],  # list of cards shown to all players
            "turn_order": [],  # player turn order
            "current_turn": "miss_scarlet",  # player token
            "suggestion": {},  # holds current suggestion players must disprove
        }

    def get_game_state(self):
        # return json.dumps(self.state)
        return self.state

    def allowed_moves(self, player: str) -> List:
        """Determines locations player may move their token

        Args:
            player: current player's token (i.e. 'professor_plum')

        Returns:
            A list of allowed locations
        """
        allowed_moves = []

        # get current token location
        current_loc = self.state["suspect_locations"][player]

        # if first time through turn rotation, can only move into a hallway
        if "start" in current_loc:
            allowed_moves = [self.first_moves[player]]

        # if in hallway, can move into either adjacent room
        elif current_loc in self.hallways:
            allowed_moves = current_loc.split("_")

        # if in room
        else:
            # could use a secret passage
            for passage in self.secret_passages:
                if current_loc in passage:
                    allowed_moves.append(passage)

            # could stay in room (if moved to current room by opponent)
            # TODO track if token was moved by a suggestion since player's last
            # turn, or pass into this function, depends where handled

            # could move to an unblocked hallway
            for hallway in self.hallways:
                if (current_loc in hallway and hallway
                        not in self.state["suspect_locations"].values()):
                    allowed_moves.append(hallway)

        return allowed_moves

    def get_state(self):
        # also returns connetion manager info
        state = self.state
        state["assignments"] = self.connection_manager.get_assignments()
        moves = {}
        for player in self.players:
            moves[player] = self.allowed_moves(player)
        state["allowed_moves"] = moves
        return state

    def get_connections(self):
        return self.players

    def initialize_board(self) -> Dict:
        """Places characters in starting locations, generates scenario,
        distributes cards"""

        # self.players must be filled before board is initialized
        players = self.connection_manager.get_players()
        if len(players) == 0:
            self.state = {"you screwed up": "no players in init_board()"}
            return self.state

        self.players = players

        # starting locations
        self.state["suspect_locations"] = dict(
            zip(self.first_moves.keys(), self.starting_locations))

        # randomly generated case file cards
        self.state["concealed_scenario"] = self.create_scenario()

        # shuffle and distribute cards to players
        (
            self.state["player_cards"],
            self.state["visible_cards"],
        ) = self.distribute_cards()

        # set turn order for the game
        self.state["turn_order"] = self.generate_turn_order()

        # get first player to move
        for token in self.players:
            if self.state["turn_order"][0] == token:
                break
        self.state["current_turn"] = self.state["turn_order"][0]
        self.state["game_phase"] = GamePhase.IN_PROGRESS.value
        return self.state

    def create_scenario(self) -> Dict[str, str]:
        """Selects a random weapon, suspect, and room to populate the case file

        Returns:
            A dictionary of the form {'suspect': name of suspect,
                                      'room': name of room,
                                      'weapon': name of weapon}
        """

        # picks a random weapon, suspect, room to store in case envelope
        suspect = random.choice(self.suspects)
        room = random.choice(self.rooms)
        weapon = random.choice(self.weapons)

        keys = ["suspect", "room", "weapon"]
        values = [suspect, room, weapon]

        return dict(zip(keys, values))

    """
    Shuffles and evenly distributes cards amongst players

    Returns:
        A dict containing {player: [cards]} pairs for each individual
            player and a list of extra cards to be displayed to all players
    """

    def distribute_cards(self) -> Tuple:

        # ensure case file has been filled
        assert self.state["concealed_scenario"]

        # determine cards to be distributed
        to_be_distributed = set(self.cards).difference(
            set(self.state["concealed_scenario"].values()))
        to_be_distributed = list(to_be_distributed)
        random.shuffle(to_be_distributed)

        # determine how many cards each player gets
        n_cards = len(to_be_distributed)
        n_players = len(self.players)
        n = n_cards // n_players

        # distribute
        if not n_cards % n_players:  # no extra cards
            split = [to_be_distributed[i:i + n] for i in range(0, n_cards, n)]
            player_cards = dict(zip(self.players, split))
            visible_cards = []
        else:
            split = [to_be_distributed[i:i + n] for i in range(0, n_cards, n)]
            player_cards = dict(zip(self.players, split[:-1]))
            visible_cards = split[-1]

        return player_cards, visible_cards

    def generate_turn_order(self) -> List:
        """Clue rules state Miss scarlet moves first, and then play proceeds
        clockwise"""

        # if miss scarlet isn't a chosen player token.
        player_tokens = self.players[:]

        token_order = [
            "miss_scarlet",
            "colonel_mustard",
            "mrs_white",
            "mr_green",
            "mrs_peacock",
            "professor_plum",
        ]
        for token in token_order:
            if token in player_tokens:
                break
        turn_order = [token]

        # no concept of clockwise in UI currently, so randomize for now
        random.shuffle(player_tokens)
        for player_token in player_tokens:
            if player_token != token:  # first player already chosen
                turn_order.append(player_token)

        assert len(player_tokens) == len(turn_order)  # future unit test

        return turn_order

    def get_next_player(self, player: str) -> Tuple:
        """Returns the next token to move.
        Note: does not update the game state, expected to be handled by caller.
        This function is also used to determine next player up to disprove a
        suggestion.

        Args:
            player: current player's token (i.e. 'professor_plum')
        """

        idx = self.state["turn_order"].index(player)

        # get next player token
        try:
            next_player = self.state["turn_order"][idx + 1]
        except IndexError:
            next_player = self.state["turn_order"][0]

        return next_player

    def rotate_next_player(self, player: str) -> str:
        self.state["current_turn"] = self.get_next_player(player)
        return self.state["current_turn"]

    def make_accusation(self, player: str, accusation: dict) -> bool:
        """
        Args:
            accusation: A dictionary of the form
                            {'suspect': name of suspect,
                            'room': name of room,
                            'weapon': name of weapon}
        Returns:
            An indication of whether or not accusation matches the cards in the
              concealed case file
        """
        if (accusation == self.state["concealed_scenario"]):
            self.state["game_phase"] = GamePhase.COMPLETED.value
        else:
            self.rotate_next_player(player)
            self.state["turn_order"].remove(player)

    def move(self, player: str, location: str) -> Dict:
        if location in self.allowed_moves(player):
            self.state["suspect_locations"][player] = location
            self.rotate_next_player(player)
        # else:
        # todo return error?
