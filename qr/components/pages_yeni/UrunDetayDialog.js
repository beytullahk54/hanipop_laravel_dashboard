import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from "@mui/material/Typography";
import Image from 'next/image'
import {Slide} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import CloseIcon from '@mui/icons-material/Close';
import "@fontsource/montserrat-alternates"

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function MaxWidthDialog({seciliDil,firma,urunDetayClose,urunDetayOpen,showUrunDetay,selectedUrun}) {




    let jsUrunAciklama = null;
    try {
        jsUrunAciklama = selectedUrun?.urun_aciklama[props.seciliDil];
    } catch (hata) {

    }
    return (
        <React.Fragment>
            <Dialog
                fullScreen
                TransitionComponent={Transition}
                open={showUrunDetay}
                onClose={()=>urunDetayClose()}
            >

                <AppBar sx={{ position: 'relative',bgcolor:firma.firma_arkaplan_renk }} >
                    <Toolbar>
                        <Typography sx={{ ml: 2, flex: 1 }} style={{fontFamily: "Montserrat Alternates"}} variant="h6" component="div">
                            {selectedUrun?.urun_adi!=null?selectedUrun?.urun_adi[seciliDil]:""}
                        </Typography>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={()=>urunDetayClose()}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <DialogContent sx={{display:"block"}}>
                    <DialogContentText  sx={{textAlign:"center"}} height={selectedUrun?.urun_gorsel  && selectedUrun.urun_gorsel != "undefined" ?300:0} >
                        {selectedUrun?.urun_gorsel  && selectedUrun.urun_gorsel != "undefined" ?
                            <img
                                style={{width:"100%"}}
                                src={selectedUrun && selectedUrun.urun_gorsel != "undefined" && selectedUrun.urun_gorsel != "null" ? "https://menu.hanipop.com/" + selectedUrun.urun_gorsel : "https://diner.imgix.net/foods/d0ac8549-af7e-4279-b409-b2cd07a14e6a.jpeg?auto=compress&h=280"}
                                alt={selectedUrun.urun_adi[seciliDil]}
                            />
                            :
                            null
                        }
                    </DialogContentText>
                    <DialogContentText sx={{flexGrow:"1",paddingX:"20px" ,marginTop:"20px",display:"block",flexDirection:"column",justifyContent:"space-between"}}>
                        { jsUrunAciklama != null && jsUrunAciklama !== "null"  && jsUrunAciklama !== "<p>null</p>" ?
                            <Typography style={{fontFamily: "Montserrat Alternates"}} variant="subtitle1" color="text.secondary" component="div"
                                        dangerouslySetInnerHTML={{__html: jsUrunAciklama!=null ?jsUrunAciklama:""}}
                            />:<Typography variant="subtitle1" color="text.secondary" component="div"
                            />
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Typography sx={{textAlign:"left",display:"block", fontSize:"50px",paddingLeft:"30px"}} style={{fontFamily: "Montserrat Alternates"}} variant="subtitle1" color="text.secondary" component="div">
                        {selectedUrun?.urun_fiyati}₺
                    </Typography>

                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
