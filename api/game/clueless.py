import json
import random
from typing import Dict, List, Tuple

class Clueless:
    # TODO suggestion logic, available movement options
    # TODO give connection manager to clueless class

    def __init__(self, *args, **kwargs):
        self.rooms = [
            'study', 'hall', 'lounge', 'library', 'billiard', 'dining',
            'conservatory', 'ballroom', 'kitchen'
        ]
        self.suspects = [
            'colonel_mustard', 'miss_scarlet', 'professor_plum', 'mr_green',
            'mrs_white', 'mrs_peacock'
        ]
        self.weapons = [
            'rope', 'lead_pipe', 'knife', 'wrench', 'candlestick', 'revolver'
        ]
        self.cards = self.suspects + self.weapons + self.rooms

        self.hallways = [
            'study_hall', 'hall_lounge', 'lounge_dining', 'dining_kitchen',
            'kitchen_ballroom', 'ballroom_conservatory',
            'conservatory_library', 'library_study', 'hall_billiard',
            'dining_billiard', 'ballroom_billiard', 'library_billiard'
        ]
        self.secret_passages = ['study_kitchen', 'lounge_conservatory']

        # players dict holds client_id: character assignments
        self.players = {}
        self.state = self.initialize_board(self.players)
    

    def jsonify(self):
        return json.dumps(self.state)


    def get_game_state(self):
        return self.state


    def initialize_board(self, players: Dict) -> Dict:
        """ Places characters in starting locations, generates scenario, 
        distributes cards """

        # data structs are just placeholders; can/should be changed
        state = {
            'suspect_locations': {},  # dict of suspect: room/hallway loc
            'concealed_scenario': {},
            'player_cards': {},  # dict of client id: player's card list 
            'visible_cards': [],  # list of cards shown to all players
            'turn_order': [],  # player turn order
            'current_turn': (),  # whose turn is it? (client id, charname)
            'suggestion': {}  # holds current suggestion players must disprove
        }
        # starting locations
        state['suspect_locations'] = {
            'miss_scarlet': 'hall_lounge',
            'professor_plum': 'library_study',
            'mr_green': 'ballroom_conservatory',
            'mrs_white': 'kitchen_ballroom',
            'mrs_peacock': 'conservatory_library',
            'colonel_mustard': ' lounge_dining',
        }
        # randomly generated case file cards
        state['concealed_scenario'] = self.create_scenario()

        # shuffle and distribute cards to players
        state['player_cards'], state['visible_cards'] = self.distribute_cards()

        # set turn order for the game
        state['turn_order'] = self.generate_turn_order()


        # get client id of first player to move
        for client_id, token in self.players.items():
            if state['turn_order'][0] == token:
                break
        state['current_turn'] = (client_id, state['turn_order'][0])
        
        return state


    def create_scenario(self) -> Dict[str, str]:
        """ Selects a random weapon, suspect, and room to populate the case file

        Returns:
            A dictionary of the form {'suspect': name of suspect,
                                      'room': name of room,
                                      'weapon': name of weapon}
        """

        # picks a random weapon, suspect, room to store in case envelope
        suspect = random.choice(self.suspects)
        room = random.choice(self.rooms)
        weapon = random.choice(self.weapons)

        keys = ['suspect', 'room', 'weapon']
        values = [suspect, room, weapon]

        return dict(zip(keys, values))


    def distribute_cards(self) -> Tuple:
        """ Shuffles and evenly distributes cards amongst players
        
        Returns:
            A dict containing {client_id: [cards]} pairs for each individual
              player and a list of extra cards to be displayed to all players"""

        # ensure case file has been filled
        assert self.state.concealed_scenario 

        # determine cards to be distributed
        to_be_distributed = set(self.cards).difference(
                            set(concealed_scenario.values())
        )
        to_be_distributed = list(to_be_distributed)
        random.shuffle(to_be_distributed)
        
        # determine how many cards each player gets
        n_cards = len(to_be_distributed)
        n_players = len(self.players)
        n = n_cards // n_players

        # distribute 
        split = [to_be_distributed[i:i + n] for i in range(0, n_cards, n)]
        player_cards = dict(zip(self.players.keys(), split[:-1]))
        visible_cards = split[-1]

        return player_cards, visible_cards


    def generate_turn_order(self) -> List:
        """ Clue rules state Miss scarlet moves first, and then play proceeds
        clockwise """

        # if miss scarlet isn't a chosen player token
        player_tokens = list(self.players.values())

        token_order = [
            'miss_scarlet',
            'colonel_mustard',
            'mrs_white',
            'mr_green',
            'mrs_peacock',
            'professor_plum',
        ]
        for token in token_order:
            if token in player_tokens:
                break
        turn_order = [token]

        # no concept of clockwise in UI currently, so randomize for now
        random.shuffle(player_tokens)
        for player_token in player_tokens:
            if player_token != token: # first player already chosen
                turn_order.append(player_token)

        assert len(player_tokens) == len(turn_order) # future unit test 

        return turn_order


    def get_next_player(self) -> Tuple:
        """ Returns the next token to move and their client ID. 
        Note: does not update the game state, expected to be handled by caller.
        """
        # get current player token
        current_player = self.state.current_turn[1]
        idx = self.state.turn_order.index('current_player')
        
        # get next player token
        try:
            next_player = self.state.turn_order[idx + 1]
        except IndexError:
            next_player = self.state.turn_order[0]
        
        # get client id associated with next player
        for client_id, token in self.players.items():
            if next_player == token:
                break
        
        return next_player, client_id


    def allowed_moves(self, player):
        # returns list of allowed moves
        pass


    def verify_accusation(self, accusation: Dict[str, str]) -> bool:
        """ Checks if a player's accusation is correct
        
        Args:
            accusation: A dictionary of the form 
                            {'suspect': name of suspect,
                            'room': name of room,
                            'weapon': name of weapon}
        Returns:
            An indication of whether or not accusation matches the cards in the
              concealed case file
        """

        return accusation == self.state.concealed_scenario
