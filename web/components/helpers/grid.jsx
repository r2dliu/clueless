import React, { useContext } from "react";
import {
    Grid,
    CardMedia,

} from "@mui/material";
import getToken from "@/components/helpers/token";
import styles from "@/components/Canvas/Board/Board.module.scss";
import { GameContext } from "@/components/helpers/GameContext";

/* This function takes in current suspect locations (dict) and places character tokens on the board
    If not occupied: render image at location i with image i
    If occupied by player(s): render image i and token(s) at location i

 TODO: Grid items should be generated with map, not explicitly like below
 TODO: handle suspect start locations (just off board)
*/
export default function BoardGrid() {
    const { gameIdContext, clientIdContext, gameStateContext, websocket } =
        useContext(GameContext);
    const [gameState, setGameState] = gameStateContext;
    const suspectLocs = gameState?.suspect_locations;

    //Create dictionary of tokens
    var room_tokens = {
        "kitchen": "",
        "study": "",
        "hall": "",
        "lounge": "",
        "library": "",
        "billiard": "",
        "dining": "",
        "conservatory": "",
        "ballroom": "",
        "study_hall": "",
        "lounge_dining": "",
        "hall_lounge": "",
        "dining_kitchen": "",
        "kitchen_ballroom": "",
        "ballroom_conservatory": "",
        "conservatory_library": "",
        "library_study": "",
        "hall_billiard": "",
        "dining_billiard": "",
        "ballroom_billiard": "",
        "library_billiard": "",
    }

    //assign suspect token to corresponding location in room_tokens dictionary
    for (var suspect in suspectLocs) { room_tokens[suspectLocs[suspect]] = suspect; }

    // Grid is 5 x 5
    return (
        <Grid container spacing={0} columns={10} width={'75%'}>

            {/* top row */}
            < Grid item xs={2}
                sx={{
                    position: 'relative'
                }} >

                <CardMedia
                    component={"img"}
                    src={"/static/board/room_study.jpg"}
                />

                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["study"])]}
                ></div>
            </Grid >

            <Grid item xs={2}
                sx={{
                    position: 'relative'
                }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 64,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["study_hall"])]}
                ></div>

            </Grid>

            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_hall.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}

                    className={styles[getToken(room_tokens["hall"])]}
                ></div>
            </Grid>

            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 64,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["hall_lounge"])]}
                ></div>
            </Grid>

            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_lounge.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["lounge"])]}
                ></div>
            </Grid>




            {/* hallways */}
            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_v.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 64,
                }}
                    className={styles[getToken(room_tokens["library_study"])]}
                ></div>
            </Grid>

            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/blank.jpg"}
                />
            </Grid>

            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_v.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 64,
                }}
                    className={styles[getToken(room_tokens["hall_billiard"])]}
                ></div>
            </Grid>

            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/blank.jpg"}
                />
            </Grid>


            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_v.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 64,
                }}
                    className={styles[getToken(room_tokens["lounge_dining"])]}
                ></div>
            </Grid>


            {/* mid row */}
            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_library.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["library"])]}
                ></div>
            </Grid>

            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 64,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["library_billiard"])]}
                ></div>
            </Grid>

            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_billiard.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["billiard"])]}
                ></div>

            </Grid>

            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 64,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["dining_billiard"])]}
                ></div>
            </Grid>


            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_dining.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["dining"])]}
                ></div>
            </Grid>



            {/* hallways */}
            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_v.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 64,
                }}
                    className={styles[getToken(room_tokens["conservatory_library"])]}
                ></div>
            </Grid>

            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/blank.jpg"}
                />

            </Grid>

            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_v.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 64,
                }}
                    className={styles[getToken(room_tokens["ballroom_billiard"])]}
                ></div>
            </Grid>

            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/blank.jpg"}
                />
            </Grid>


            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_v.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 64,
                }}
                    className={styles[getToken(room_tokens["dining_kitchen"])]}
                ></div>
            </Grid>



            {/* bottom row */}
            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_conservatory.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["conservatory"])]}
                ></div>
            </Grid>

            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 64,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["ballroom_conservatory"])]}
                ></div>
            </Grid>

            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_ball.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["ballroom"])]}
                ></div>

            </Grid>

            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 64,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["kitchen_ballroom"])]}
                ></div>
            </Grid>


            <Grid item xs={2} sx={{
                position: 'relative'
            }} >
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_kitchen.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["kitchen"])]}
                ></div>
            </Grid>


        </Grid >
    );
}