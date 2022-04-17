from server import *
import random 
import json
import copy

random.seed(0)

def test_complete_game():
    """ Tests calling clueless functions from server to play complete game """

    # start 2 player game
    connection_manager.id_to_char = {
        str(uuid4()): 'mr_green',
        str(uuid4()): 'professor_plum'
    }
    game = games_by_id['test'] = Clueless(connection_manager)
    games_by_id['test'].initialize_board()
    solution = game.state['concealed_scenario']
    
    turn_order = game.state['turn_order']
    assert turn_order == ['mr_green', 'professor_plum']

    pre_turn_state = copy.deepcopy(game.state)
    # turn one: can only move to hallway
    correct_moves = [game.first_moves[player] for player in turn_order]
    for idx, player in enumerate(turn_order):
        assert len(game.allowed_moves(player)) == 1
        assert correct_moves[idx] == json.loads(get_allowed_moves('test',player))[0]
        # update game state
        new_state = copy.deepcopy(game.state)
        new_state['suspect_locations'][player] = json.loads(get_allowed_moves('test',player))[0]
        update_state('test', json.dumps(new_state))
    # check game state was updated
    assert game.state != pre_turn_state

    pre_turn_state = copy.deepcopy(game.state)
    # turn two: move + suggestions
    correct_moves = [['ballroom', 'conservatory'], ['library', 'study']]
    for idx, player in enumerate(turn_order):
        # make move
        import pdb; pdb.set_trace()
        legal_moves = json.loads(get_allowed_moves('test', player))
        assert legal_moves == correct_moves[idx]
        new_state = copy.deepcopy(game.state)
        new_state['suspect_locations'][player] = game.allowed_moves(player)[0]
        update_state('test', json.dumps(new_state))
        # make suggestion
        # TODO

    # check game state was updated
    assert game.state != pre_turn_state
    # turn three: first player makes successful accusation and ends game
    for idx, player in enumerate(turn_order):
        if not idx:
            result = verify_accusation('test', json.dumps(solution))
            if result: 
                break
    assert json.loads(result)

