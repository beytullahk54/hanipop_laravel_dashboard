import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';

//const languages = [{"dil_adi":'Türkçe',"dil_kodu":"tr"},{"dil_adi": 'İngilizce',"dil_kodu":"en"}];
const languages = [{"dil_adi":'Türkçe',"dil_kodu":"tr"}];

function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        if(selectedValue == null) {
            onClose("tr")
        }else {
            onClose(selectedValue);
        }
    };

    const handleListItemClick = (value) => {
        onClose(value.dil_kodu)
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{props.title}</DialogTitle>
            <List sx={{ pt: 0 }}>
                {props.diller.map((email) => (
                    <ListItem disableGutters>
                        <ListItemButton onClick={() => handleListItemClick(email)} key={email.dil_kodu}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={email.dil_adi} />
                        </ListItemButton>
                    </ListItem>
                ))}

            </List>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export default function SimpleDialogDemo(props) {
    const [selectedValue, setSelectedValue] = React.useState(languages[1]);
    console.log()
    const handleClose = (value) => {
        props.setDialogOpen(false);
        props.setSeciliDil(value)
        setSelectedValue(value);
        sessionStorage.setItem("dil",value)
    };


    return (
        <div>
            <SimpleDialog
                diller={JSON.parse(props.firma.dil)}
                selectedValue={selectedValue}
                title={props.title}
                open={props.dialogOpen}
                onClose={handleClose}
            />
        </div>
    );
}
