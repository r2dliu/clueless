import random
import json
import copy
from enum import Enum
from typing import Dict, List, Tuple
from connection_manager import ConnectionManager


class GamePhase(Enum):
    NOT_STARTED = 0
    IN_PROGRESS = 1
    COMPLETED = 2
    ENDED = 3  # Everyone failed their accusations

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
            "selectable_cards": {},  # cards that players can suggest/accuse
            "turn_order": [],  # player turn order
            "suggestion": {},  # holds current suggestion players must disprove
            "suggestion_starter": '',
            "suggestion_order": [], # suggestion order
            "suggestion_disproval_card": '', # the card that disproved the suggestion
            "suggestion_valid_cards": [], # valid cards to disprove current suggestion
            "is_active_suggestion": False,
            "next_to_disprove": '', # next suspect to disprove suggestion
            "current_turn": "miss_scarlet",  # player token
            "winner": {},  # holds the winner of the game
            "previous_move": {},  # holds the previous move for minimal demo
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
            if current_loc == "study":
                allowed_moves.append("kitchen")
            elif current_loc == "kitchen":
                allowed_moves.append("study")
            elif current_loc == "lounge":
                allowed_moves.append("conservatory")
            elif current_loc == "conservatory":
                allowed_moves.append("lounge")

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

        # front-end Cards.jsx uses cards_to_display only -- not separately displaying visible + player cards
        self.state["cards_to_display"] = {}
        for k, v in self.state["player_cards"].items():
            self.state["cards_to_display"][k] = self.state["player_cards"][
                k] + self.state["visible_cards"]

        # Build lists of cards for suggestion/accusation
        self.state["selectable_cards"]["rooms"] = list(
            set(self.rooms).difference(set(self.state["visible_cards"])))
        self.state["selectable_cards"]["suspects"] = list(
            set(self.suspects).difference(set(self.state["visible_cards"])))
        self.state["selectable_cards"]["weapons"] = list(
            set(self.weapons).difference(set(self.state["visible_cards"])))

        # set turn order for the game
        self.state["turn_order"] = self.generate_turn_order()

        # set suggestion order for the game -- copy at start ensures
        # we include players who make incorrect accusations
        self.state["suggestion_order"] = copy.deepcopy(
            self.state["turn_order"])

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

    def distribute_cards(self) -> Tuple:
        """
        Shuffles and evenly distributes cards amongst players

        Returns:
            A dict containing {player: [cards]} pairs for each individual
                player and a list of extra cards to be displayed to all players
        """
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

    def rotate_next_player(self, player: str, justAccused: bool) -> str:
        self.state["previous_move"] = player + " ended_turn"

        if justAccused:
            self.state[
                "previous_move"] = player + " made an incorrect accusation! They are out of the game!"

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
            self.state["winner"] = player
            self.state["game_phase"] = GamePhase.COMPLETED.value
        else:
            self.rotate_next_player(player, True)
            self.state["turn_order"].remove(player)

        # End the game if all players are removed from turn order
        if not self.state["turn_order"]:
            self.state["game_phase"] = GamePhase.ENDED.value

    def move(self, player: str, location: str) -> Dict:
        if location in self.allowed_moves(player):
            self.state["previous_move"] = player + " moved to " + location
            self.state["suspect_locations"][player] = location
            #self.rotate_next_player(player)
        # else:
        # todo return error?

    def initiate_suggestion(self, player: str, suggestion: dict):
        self.state["suggestion_starter"] = player
        self.state["suggestion_disproval_card"] = ''
        self.state["is_active_suggestion"] = True
        self.state["suggestion"] = suggestion
        self.state["suspect_locations"][suggestion["suspect"]] = suggestion["room"]
        nextPlayerToDisprove = self.next_to_disprove(player)
        self.state["suggestion_valid_cards"] = self.get_valid_cards(nextPlayerToDisprove, suggestion)

        
    def get_valid_cards(self, player: str, suggestion: dict) -> List:
        playersCards = set(self.state['player_cards'][player])

        suggestionCards = set(suggestion.values())
        overlap = playersCards.intersection(suggestionCards)
        return list(overlap)

    def disprove_suggestion(self, player, card) -> Dict:
        # TODO validate answer - tbh we probably don't need to worry about this for the project
        # if(card != "none" and card not in self.get_valid_cards(player)):
        #     print("cheater cheater pumpkin eater, you lose")

        # suggestion was disproven, advance the game
        if(card != "none"):
            self.state["suggestion_disproval_card"] = card
            self.terminate_suggestion()
            # current player's turn is over, move turns
            self.rotate_next_player(self.state["current_turn"], False)
        # player passed
        else:
            self.next_to_disprove(player)
            nextPlayerToDisprove = self.next_to_disprove(player)
            self.state["suggestion_valid_cards"] = self.get_valid_cards(nextPlayerToDisprove, self.state["suggestion"])

    def terminate_suggestion(self):
        self.state["suggestion"] = {}
        self.state["is_active_suggestion"] = False
        return 

    def next_to_disprove(self, player: str) -> str:
        """ Updates game state with next character up to disprove suggestion """
        idx = self.state["suggestion_order"].index(player)

        # get next player token
        try:
            next_player = self.state["suggestion_order"][idx + 1]
        except IndexError:
            next_player = self.state["suggestion_order"][0]

        self.state['next_to_disprove'] = next_player

        return next_player