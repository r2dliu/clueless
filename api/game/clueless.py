class Clueless:
    # TODO add game logic

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

    def initialize_board(self, players):
        """ Places characters in starting locations, generates sceanario, 
        distributes cards """

        # data structs are just placeholders; can/should be changed
        state = {
            'suspect_locations': {},  # dict of suspect: room/hallway loc
            'concealed_scenario': {},
            'player_cards': {},  # dict of player: player's card list 
            'visible_cards': [],  # list of cards shown to all players
            'turn_order': [],  # player turn order
            'current_turn': 0,  # whose turn is it
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

        # player cards (call distribute_cards())
        state['player_cards'] = self.distribute_cards()

        # start turn order with miss scarlet
        state['turn_order'] = self.generate_turn_order()

        # todo: visible_cards, current_turn, suggestion

        return state

    def get_game_state(self):
        return self.state

    def create_scenario(self):
        # picks a random weapon, suspect, room to store in case envelope
        return 'case file'

    def distribute_cards(self):
        # randomly distribute cards
        return 'cards distributed'

    def generate_turn_order(self):
        # randomly picks player move order (todo)
        return [
            'miss_scarlet',
            'professor_plum',
            'mr_green',
            'mrs_white',
            'mrs_peacock',
            'colonel_mustard',
        ]

    def get_next_player(self, current_player):
        # returns next player to move
        pass

    def allowed_moves(self, player):
        # returns list of allowed moves
        pass

    def verify_accusation(self, accusation):
        # returns
        pass
