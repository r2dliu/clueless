import React from 'react'
import {
    Grid,
    CardMedia,

} from "@mui/material";
import getToken from "@/components/helpers/token";
import styles from "@/components/Canvas/Board/Board.module.scss";
/* This function takes in current suspect locations (dict) and places character tokens on the board
    If not occupied: render image at location i with image i
    If occupied by player(s): render image i and token(s) at location i

 TODO: Grid items should be generated with a map, not explicitly like below
    Need: enum for files (or label files 0-24)?
*/
export default function BoardGrid(suspectLocs) {

    //map of suspects to their token name
    var suspect_tokens = {
        'colonel_mustard' : 'colonelMustard',
        'miss_scarlet' : 'missScarlet',
        'professor_plum' : 'professorPlum',
        'mr_green' : 'mrGreen',
        'mrs_white' : 'mrsWhite',
        'mrs_peacock' : 'mrsPeacock',
    }

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
        "ball": "",
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
    for (var suspect in suspectLocs)
    {
        room_tokens[suspectLocs[suspect]] = suspect_tokens[suspect];
    }

    console.log(room_tokens)
    //TODOs:
    //1. Suspects need to be assigned a start location thats an actual location,
    //Wasn't sure if we were doing that yet or just had the colonel_mustard_start
    //placeholders in clueless.py or if they corresponded to actual locations somewhere.
    //2. Looking at the console in a browser shows that the room tokens arent being assigned to anything. Not sure if this function
    //is not being called correctly, or often enough, or if I am misunderstanding how to assign values to dictionary keys in js
    //on lines 54-57
    //P.S. I have no idea what I am doing. 



    // Grid is 5 x 5
    // TODO: loop over grid from top left to bottom right, display room/hall image + any token in room
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

                {/* Hardcoded example of displaying more than one token per room*/}
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["study"])]}
                ></div>

            </Grid >

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken("study_hall")]}
                ></div>
                
            </Grid>

            <Grid item xs={2}>
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

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken("hall_lounge")]}
                ></div>
            </Grid>

            <Grid item xs={2}>
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
            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_v.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["library_study"])]}
                ></div>
            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/blank.jpg"}
                />
            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_v.jpg"}
                />
                 <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["hall_billiard"])]}
                ></div>
            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/blank.jpg"}
                />
            </Grid>


            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_v.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["lounge_dining"])]}
                ></div>
            </Grid>


            {/* mid row */}
            <Grid item xs={2}>
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

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["library_billiard"])]}
                ></div>
            </Grid>

            <Grid item xs={2}>
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

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["dining_billiard"])]}
                ></div>
            </Grid>


            <Grid item xs={2}>
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
            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_v.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["conservatory_library"])]}
                ></div>
            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/blank.jpg"}
                />
                
            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_v.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["ballroom_billiard"])]}
                ></div>
            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/blank.jpg"}
                />
            </Grid>


            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_v.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["dining_billiard"])]}
                ></div>
            </Grid>



            {/* bottom row */}
            <Grid item xs={2}>
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

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["ballroom_conservatory"])]}
                ></div>
            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_ball.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["ball"])]}
                ></div>

            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 70,
                }}
                    className={styles[getToken(room_tokens["kitchen_ballroom"])]}
                ></div>
            </Grid>


            <Grid item xs={2}>
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