import React from 'react'
import {
    Grid,
    Box,
    CardMedia,
    Typography, //remove later
} from "@mui/material";


/* This function takes in current suspect locations (dict) and places character tokens on the board
    If not occupied: render image at location i with image i
    If occupied by player: render image i and token(s) at location i

 TODO: Grid items should be generated with with a map, not explicitly like below
    Need: enum for files (or label files 0-24), enum for token colors ? 
*/
export default function BoardGrid(suspectLocs) {

    // Grid is 5 x 5
    // TODO: loop over grid from top left to bottom right, display room/hall image + any token in room
    return (
        <Grid container spacing={0} columns={10} width={'75%'}>

            {/* top row */}
            < Grid container item xs={2} >

                <Grid
                    sx={{
                        position: 'relative'
                    }}> {/* this is a grid within the top left room */}
                    <CardMedia
                        component={"img"}
                        src={"/static/board/room_study.jpg"}
                    />

                    {/* Example of displaying more than one token per room
                        TODO: replace with token images, not text */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                        }}
                    >
                        <Typography variant="h5">Mr Green</Typography>
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 10,
                            left: 0,
                            width: '100%',
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                        }}
                    >
                        <Typography variant="h5">Mrs White</Typography>
                    </Box>

                </Grid>

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