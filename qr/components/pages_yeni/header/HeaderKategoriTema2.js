import React from 'react';
import { useRouter } from "next/router";
import { AppBar, Toolbar, Typography, CssBaseline, IconButton, Grid, Box, CardMedia, Menu, MenuItem, Fade, Link,Tabs,Tab } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import GridViewIcon from '@mui/icons-material/GridView';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Link as LinkScroll, Element } from 'react-scroll';


const tabStyle = {
  height: 60,
  fontWeight: 900,
  fontFamily: "Montserrat Alternates",
};

function getShortName(fullName) {
  return fullName && fullName.length > 15 ? `${fullName.slice(0, 14)}...` : fullName;
}

const HeaderKategoriTema2 = (props) => {
  const router = useRouter();
  const { query } = router;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <>
      <CssBaseline />
      <AppBar sx={{ bgcolor: props.firma.firma_arkaplan_renk }}>
        <Toolbar>
            <Grid container spacing={2} height={130}>
                <Grid item xs={3}>
                    <Link href={(props.temaUrl ? props.temaUrl : "") + "/?url=" + query.restoran} style={{ wordSpacing: "2",textDecoration:"none" }}>
                        <GridViewIcon sx={{ color: "white", fontSize: 55, verticalAlign: "middle", display: "block", marginTop: "20px" }}></GridViewIcon>
                        <span style={{ color: "white",textDecoration:"none",wordSpacing: "3", fontSize: 9, fontFamily: "Montserrat Alternates" }}>ANA MENÜ</span>
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
                                <Link sx={{textDecoration:"none"}} href={(props.temaUrl ? props.temaUrl : "") + "/hakkimizda?restoran=" + query.restoran}><MenuItem onClick={handleClose}>Hakkımızda</MenuItem></Link>
                                <Link sx={{textDecoration:"none"}} href={(props.temaUrl ? props.temaUrl : "") + "/misyonumuz?restoran=" + query.restoran}><MenuItem onClick={handleClose}>Misyonumuz</MenuItem></Link>
                                <Link sx={{textDecoration:"none"}} href={(props.temaUrl ? props.temaUrl : "") + "/vizyonumuz?restoran=" + query.restoran}><MenuItem onClick={handleClose}>Vizyonumuz</MenuItem></Link>
                                <Link sx={{textDecoration:"none"}} href={(props.temaUrl ? props.temaUrl : "") + "/bizdenkareler?restoran=" + query.restoran}><MenuItem onClick={handleClose}>Bizden Kareler</MenuItem></Link>
                                <Link sx={{textDecoration:"none"}} href={(props.temaUrl ? props.temaUrl : "") + "/subeler?restoran=" + query.restoran}><MenuItem onClick={handleClose}>Şubeler</MenuItem></Link>
                            </Menu>
                        </>
                    }

                </Grid>
            </Grid>
        </Toolbar>
        <Tabs variant="scrollable" textColor="white" indicatorColor="secondary" scrollButtons={false} aria-label="scrollable prevent tabs example">
          {props.kategori.map(res => {
            let jsKategoriAdi = null;
            try {
              jsKategoriAdi = res.kategori_adi[props.seciliDil];
              console.log(res.id)
            } catch (hata) {
              console.error("Kategori adı parse edilirken hata oluştu:", hata);
            }
            return (
              
                <Element key={res.id} name={"h" + res.id} id={"h" + res.id}>
                  <Link href={"/tema2/kategori?kategori_id="+res.id+"&restoran="+query.restoran} style={{ wordSpacing: "2" }}>
                    <Box sx={{ bgcolor: '#ffffff96', color: 'black', margin: 1, borderRadius: 2 }}>
                        <Tab style={tabStyle} label={getShortName(jsKategoriAdi)} />
                    </Box>
                  </Link>
                </Element>
            )
          })}
        </Tabs>
      </AppBar>
      <Toolbar />
    </>
  );
}

export default HeaderKategoriTema2;
