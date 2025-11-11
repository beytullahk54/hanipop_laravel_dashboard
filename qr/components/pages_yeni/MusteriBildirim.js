import React, {useEffect, useState} from 'react'
import {Button, Fab, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import AddCommentIcon from '@mui/icons-material/AddComment';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MusteriBildirim = (props) => {
    const [open, setOpen] = React.useState(false);
    const [mesaj, setMesaj] = React.useState("");
    const [select, setSelect] = React.useState("");


    const handleClose = () => {
        setOpen(false);
    };

    function mesajModal(){
        setOpen(true);
    }

    const save = () =>{
        axios.post('https://menu.hanipop.com/gorus-bildir', {
            bildirim_baslik:select,
            bildirim_aciklama:mesaj,
            //masa_no:this.masa_no,
            masa_no:null,
            firma_id:39
        }).then(res=>{
            setOpen(false);
            toast("Görüşünüz bize ulaştı. Teşekkür ederiz.")
        })
    }

    return (
        <>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Bizimle ilgili deneyiminiz</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Sizlere daha iyi hizmet sunabilmemiz için istek ve şikayetlerinize önem veriyoruz. Lütfen bizimle paylaşın.
                    </DialogContentText>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Talep Türünüz</InputLabel>
                        <Select
                            value={select}
                            onChange={(e)=>setSelect(e.target.value)}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Age"
                        >
                            <MenuItem value={"istek"}>İstek</MenuItem>
                            <MenuItem value={"sikayet"}>Şikayet</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        value={mesaj}
                        onChange={(e)=>setMesaj(e.target.value)}
                        label="Görüşleriniz"
                        type="email"
                        rows={10}
                        multiline
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Kapat</Button>
                    <Button onClick={save}>Kaydet</Button>
                </DialogActions>
            </Dialog>
            <Tooltip title="Kafe deneyimin nasıldı" placement="left-start">
                <Fab sx={{
                    bottom: 66,
                    right: 16,
                    position: 'fixed',
                }}
                    onClick={mesajModal}
                     style={{background:props.firma.firma_arkaplan_renk,color:"white"}} variant="extended" aria-label="add">
                    <AddCommentIcon />
                </Fab>
            </Tooltip>

            <ToastContainer />
        </>
    )
}

export default  MusteriBildirim
