
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Paper, Button } from '@mui/material'
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/router'
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import IconButton from "@mui/material/IconButton";

function ElevationScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

const HeaderHome = (props) => {


    const { query } = useRouter();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>

            <CssBaseline />
            <ElevationScroll {...props}>
                <AppBar sx={{ bgcolor: props.firma.firma_arkaplan_renk }}>
                    <Toolbar >

                        <Grid container spacing={2} height={130}>
                            <Grid item xs={3}>
                            </Grid>

                            <Grid item xs={5} sx={{ verticalAlign: "middle" }}>
                                <Link href={(props.temaUrl ? props.temaUrl : "") + "/?url=" + query.url}>
                                    {props.firma && props.firma.firma_logo &&
                                        <CardMedia
                                            component="img"
                                            sx={{ height: 100, borderRadius: 5, padding: 1, objectFit: "contain", margin: "0 auto" }}

                                            image={"https://menu.hanipop.com/" + props.firma.firma_logo}

                                        />
                                    }
                                    {props.firma && props.firma.firma_logo === null &&
                                        <Typography variant="h6" component="div" sx={{ padding: 4 }}>
                                            {props.firma.firma_adi}
                                        </Typography>
                                    }
                                </Link>
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: "right" }}>
                                {query.url == "kodlooper-cafe" &&

                                    <Link href={"https://hanipop.com#ucretsiz-dene"} target={"_blank"} style={{ wordSpacing: "2" }}>

                                        <IconButton

                                        >
                                            <ShoppingBagIcon sx={{
                                                color: "white",
                                                fontSize: 55,
                                                verticalAlign: "middle",
                                                display: "block",
                                                marginTop: "10px",
                                            }}></ShoppingBagIcon>

                                        </IconButton>

                                        <span style={{
                                            display: "block",
                                            fontSize: 9,
                                            fontFamily: "Montserrat Alternates"
                                        }}>ÜCRETSİZ DENE</span>
                                    </Link>
                                }
                            </Grid>
                        </Grid>
                    </Toolbar>


                </AppBar>
            </ElevationScroll>
            <Toolbar />
        </>
    )
}

function Item(props) {
    return (
        <Paper>
            <h2>{props.item.name}</h2>
            <p>{props.item.description}</p>

        </Paper>
    )
}
export default HeaderHome;