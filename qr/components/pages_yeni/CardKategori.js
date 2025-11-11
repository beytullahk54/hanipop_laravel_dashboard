import * as React from 'react';
import Card from "@mui/material/Card";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import CardMedia from "@mui/material/CardMedia";

const CardKategori = (props) => {

    return (
        <>
            <Card  item onClick={props.onClick} >

                <ImageList rowHeight={280} cols={1}>
                    <ImageListItem sx={{overflow:"hidden",objectFit: "contain"}}>

                        <img
                            src={props.image?"https://menu.hanipop.com/" +props.image:"/qrArkaplan.jpg"}
                            srcSet={props.image?"https://menu.hanipop.com/" +props.image:"/qrArkaplan.jpg"}
                            alt={props.title[props.seciliDil]}
                            loading="lazy"
                        />

                        <ImageListItemBar
                            title={props.title[props.seciliDil]}

                        />
                    </ImageListItem>
                </ImageList>

            </Card>
        </>
    );
}

export default CardKategori;
