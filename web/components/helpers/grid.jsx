import React from 'react'
import {
    Grid,
    CardMedia,
} from "@mui/material";


// TODO: this function should take player locations, render tokens
// over images
// Grid items should be generated with with a map, not explicitly like below
// If not occupied: render image at location i with image i
// If occupied by player: render image i and token(s) at location i
export default function BoardGrid() {

    // Grid is 5 x 5
    return (
        <Grid container spacing={0} columns={10} width={'75%'}>

            {/* top row */}

            <Grid item xs={2}>
                <CardMedia
                    component={"img"}
                    src={"/static/board/room_study.jpg"}
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