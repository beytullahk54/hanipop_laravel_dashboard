import Tooltip from "@mui/material/Tooltip";
import {Fab} from "@mui/material";
import WhatsApp from "@mui/icons-material/WhatsApp";
import React from "react";

const Whatsapp = (props) => {
    return (
        <>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"/>

            <a href="https://api.whatsapp.com/send/?phone=908503461402&text=Merhabalar%2C+size+nas%C4%B1l+yard%C4%B1mc%C4%B1+olabiliriz.&type=phone_number&app_absent=0"
               target="_blank">
                <Tooltip title="Whatsapp" placement="left-start">
                    <Fab sx={{
                        bottom: 190,
                        right: 16,
                        position: 'fixed',
                    }}
                         style={{background:"green",color:"white"}} variant="extended" aria-label="add">

                        <WhatsApp />
                    </Fab>
                </Tooltip>
            </a>

        </>

    );

}

export default Whatsapp
