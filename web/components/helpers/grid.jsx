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
                    className={styles[getToken('mrs_peacock')]}
                ></div>


                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 50,
                }}
                    className={styles[getToken('mr_green')]}
                ></div>
                {/* End example*/}

            </Grid >

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_hall.jpg"}
                />
            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_lounge.jpg"}
                />
            </Grid>




            {/* hallways */}
            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_v.jpg"}
                />
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
            </Grid>


            {/* mid row */}
            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_library.jpg"}
                />
            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_billiard.jpg"}
                />

            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
            </Grid>


            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_dining.jpg"}
                />
            </Grid>



            {/* hallways */}
            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_v.jpg"}
                />
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
            </Grid>



            {/* bottom row */}
            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_conservatory.jpg"}
                />
            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_ball.jpg"}
                />

            </Grid>

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/hall_h.jpg"}
                />
            </Grid>


            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_kitchen.jpg"}
                />
            </Grid>


        </Grid >
    );
}