
import * as React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Paper, Button, Menu, MenuItem, Fade } from '@mui/material'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Link as LinkScroll, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import GridViewIcon from '@mui/icons-material/GridView';
import { useEffect } from "react";
import axios from "axios";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import "@fontsource/montserrat-alternates"
import Link from "next/link"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

/*function ElevationScroll(props) {
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

    window: PropTypes.func,
};*/

const Header = (props) => {

    const router = useRouter();
    const { query } = useRouter();
    //const [kategori, setKategori] = React.useState([]);
    //const [firma, setFirma] = React.useState([]);
    const change = (value) => {
        router.push("kategori?kategori_id=" + value + '&restoran=' + query.restoran)
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    /*const headers = {
        "Content-Type": "application/json"
    };
    useEffect(() => {

        const cardList = {};
        const fetchPost = async () => {

            if(query.restoran)
            {
                let response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/urunGetir`,{
                    kategori_id:query.kategori_id,
                    restoran:query.restoran
                }, { headers }).then(res=>{

                    setKategori(res.data.kategoriler)
                    setFirma(res.data.firma)
                });
            }else{

                /*let response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/urunGetir`,{
                    kategori_id:"11"
                }, { headers }).then(res=>{
                    setData(res.data)
                });
            }

        };
        fetchPost();
    }, [query.restoran]);*/
    return (
        <>
            <CssBaseline />
            {/*<ElevationScroll {...props}>*/}
            <AppBar sx={{ bgcolor: props.firma.firma_arkaplan_renk }}>
                <Toolbar>
                    <Grid container spacing={2} height={130}>
                        <Grid item xs={3}>
                            <Link href={(props.temaUrl ? props.temaUrl : "") + "/?url=" + query.restoran} style={{ wordSpacing: "2" }}>
                                <GridViewIcon sx={{ color: "white", fontSize: 55, verticalAlign: "middle", display: "block", marginTop: "20px" }}></GridViewIcon>
                                <span style={{ wordSpacing: "3", fontSize: 9, fontFamily: "Montserrat Alternates" }}>ANA MENÜ</span>
                            </Link>
                        </Grid>
                        <Grid item xs={5} sx={{ verticalAlign: "middle" }}>
                            {props.firma && props.firma.firma_logo &&
                                <CardMedia
                                    component="img"
                                    sx={{ height: 100, borderRadius: 5, padding: 1, objectFit: "contain", margin: "0 auto" }}

                                    image={"https://menu.hanipop.com/" + props.firma.firma_logo}
                                    alt={props.urun_aciklama}
                                />
                            }
                            {props.firma && props.firma.firma_logo === null &&
                                <Typography variant="h5" component="div" sx={{ paddingTop: 3 }} >
                                    {props.firma.firma_adi}
                                </Typography>
                            }
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: "right" }}>


                            {query.restoran == "kodlooper-cafe" &&

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

                            {query.restoran != "kodlooper-cafe" &&
                                <>
                                    <IconButton
                                    >
                                        <MenuIcon sx={{ color: "white", fontSize: 55, verticalAlign: "middle", height: "80px" }}

                                            id="fade-button"
                                            aria-controls={open ? 'fade-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={handleClick}
                                        ></MenuIcon>
                                    </IconButton>
                                    <Menu
                                        id="fade-menu"
                                        MenuListProps={{
                                            'aria-labelledby': 'fade-button',
                                        }}
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        TransitionComponent={Fade}
                                    >
                                        <Link href="/about"><a>About</a></Link>
                                        <Link href={(props.temaUrl ? props.temaUrl : "") + "/hakkimizda?restoran=" + query.restoran}><MenuItem onClick={handleClose}>Hakkımızda</MenuItem></Link>
                                        <Link href={(props.temaUrl ? props.temaUrl : "") + "/misyonumuz?restoran=" + query.restoran}><MenuItem onClick={handleClose}>Misyonumuz</MenuItem></Link>
                                        <Link href={(props.temaUrl ? props.temaUrl : "") + "/vizyonumuz?restoran=" + query.restoran}><MenuItem onClick={handleClose}>Vizyonumuz</MenuItem></Link>
                                        <Link href={(props.temaUrl ? props.temaUrl : "") + "/bizdenkareler?restoran=" + query.restoran}><MenuItem onClick={handleClose}>Bizden Kareler</MenuItem></Link>
                                        <Link href={(props.temaUrl ? props.temaUrl : "") + "/subeler?restoran=" + query.restoran}><MenuItem onClick={handleClose}>Şubeler</MenuItem></Link>
                                    </Menu>
                                </>
                            }

                        </Grid>
                    </Grid>

                </Toolbar>
                <Tabs
                    variant="scrollable"
                    textColor="white"
                    indicatorColor="secondary"
                    scrollButtons={false}
                    aria-label="scrollable prevent tabs example"
                >

                    {props.kategori.map(res => {
                        let jsKategoriAdi = null;
                        try {
                            jsKategoriAdi = JSON.parse(res.kategori_adi)[props.seciliDil];
                        } catch (hata) {

                        }
                        return (
                            <Element name={"h" + res.id} id={"h" + res.id}>
                                <Box sx={{ bgcolor: '#ffffff96', color: 'black', margin: 1, borderRadius: 2 }}>
                                    {/* <LinkScroll to={res.id} spy={true} smooth={true} offset={-170} duration={500} delay={1000}>
                                        <Tab style={{ height: 60, fontWeight: 900, fontFamily: "Montserrat Alternates" }} label={jsKategoriAdi ? jsKategoriAdi.length > 15 ? jsKategoriAdi.slice(0, 14) + "..." : jsKategoriAdi.slice(0, 15) : ""}
                                        ///onClick={function () {change(res.id)}}
                                        />
                                    </LinkScroll> */}
                                    <LinkScroll to={res.id} spy={true} smooth={true} offset={-170} duration={500} delay={1000}>
                                        <Link href={(props.temaUrl ? props.temaUrl : "") + "/kategori?kategori_id=" + res.id + '&restoran=' + query.restoran}>
                                            <Tab style={{ height: 60, fontWeight: 900, fontFamily: "Montserrat Alternates" }} label={jsKategoriAdi ? jsKategoriAdi.length > 15 ? jsKategoriAdi.slice(0, 14) + "..." : jsKategoriAdi.slice(0, 15) : ""}
                                            />
                                        </Link>
                                    </LinkScroll>
                                </Box>
                            </Element>
                        )
                    })}


                </Tabs>
            </AppBar>
            {/*</ElevationScroll>*/}
            <Toolbar />
        </>
    )
}
export default Header;
