import Tooltip from "@mui/material/Tooltip";
import {Fab} from "@mui/material";
import Language from "@mui/icons-material/Language";
import React from "react";

const Dil = (props) => {
    const openDil=()=>{
        props.setDialogOpen(true)
    }

    return (
        <>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"/>

            <a
              onClick={()=>openDil()}>
                <Tooltip title="Dil" placement="left-start">
                    <Fab sx={{
                        bottom: 128,
                        right: 16,
                        position: 'fixed',
                    }}
                         style={{background:"darkcyan",color:"white"}} variant="extended" aria-label="add">

                        <Language />
                    </Fab>
                </Tooltip>
            </a>

        </>

    );

}

export default Dil
