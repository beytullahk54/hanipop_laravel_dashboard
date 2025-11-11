import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Avatar from '@mui/material/Avatar';
import Stack from "@mui/material/Stack";
import FaceIcon from '@mui/icons-material/Face';
import GradeIcon from '@mui/icons-material/Grade';
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import "@fontsource/montserrat-alternates";
import { Paper } from "@mui/material";

const CardUrun = (props) => {
    const theme = useTheme();

    const urunDetayiGoster = (props) => {
        props.urunDetayOpen({
            urun_adi: props.urun_adi,
            urun_gorsel: props.urun_gorsel,
            urun_aciklama: props.urun_aciklama,
            urun_fiyati: props.urun_fiyati,
        });
    };

    function getDifferenceInDays(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60 * 60 * 24);
    }

    let jsUrunAdi = null;
    try {
        jsUrunAdi = props.urun_adi[props.seciliDil];
    } catch (hata) {
        console.log(hata)
    }
    let jsUrunAciklama = null;
    try {
        jsUrunAciklama = props.urun_aciklama;
    } catch (hata) {

    }

    function countQuotes(word) {
        var count = 0;

        for (var i = 0; i < word.length; i++) {
            if (word[i] === '"') {
                count++;
            }
        }

        return count;
    }

    return (
        <Card
            sx={{ display: "flex", marginTop: 1, cursor: "pointer" }}
            onClick={() => urunDetayiGoster(props)}
        >
            {props.urun_gorsel &&
                props.urun_gorsel != "undefined" &&
                props.urun_gorsel != "null" && (
                    <CardMedia
                        component="img"
                        sx={{
                            width: 131,
                            borderRadius: 5,
                            padding: 0,
                            objectFit: "contain",
                        }}
                        image={
                            props.urun_gorsel &&
                                props.urun_gorsel != "undefined" &&
                                props.urun_gorsel != "null"
                                ? "https://menu.hanipop.com/" + props.urun_gorsel
                                : "https://diner.imgix.net/foods/d0ac8549-af7e-4279-b409-b2cd07a14e6a.jpeg?auto=compress&h=280"
                        }
                        alt={jsUrunAciklama ? jsUrunAciklama[props.seciliDil] : ""}
                    />
                )}
            {!props.urun_gorsel && (
                <>
                    {props.firma.firma_logo2 && (
                        <>
                            <CardMedia
                                component="img"
                                sx={{
                                    width: 111,
                                    borderRadius: 5,
                                    padding: 1,
                                    objectFit: "contain",
                                }}
                                image={"https://menu.hanipop.com/" + props.firma.firma_logo2}
                                alt={jsUrunAciklama ? jsUrunAciklama[props.seciliDil] : ""}
                            />
                        </>
                    )}
                </>
            )}

            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography
                        component="title2"
                        style={{ fontFamily: "Montserrat Alternates" }}
                        variant="h6"
                    >
                        {jsUrunAdi}

                    </Typography>

                    {props.urun_aciklama !== "null" &&
                        props.urun_aciklama !== null &&
                        props.urun_aciklama !== "<p>null</p>" && (
                            <Typography
                                variant="subtitle2"
                                style={{ fontFamily: "Montserrat Alternates" }}
                                color="text.secondary"
                                component="div"
                                dangerouslySetInnerHTML={{ __html: jsUrunAciklama ? jsUrunAciklama[props.seciliDil] : "" }}
                            />
                        )}
                    {props.yeni_aktif == "1" && getDifferenceInDays(new Date(), new Date(props.created_at)) <= 20 &&
                        <>
                            <Chip sx={{
                                marginBottom: "10px",
                                marginTop: "10px"

                            }} icon={<GradeIcon />} label="Yeni" color="success" />
                        </>
                    }
                    {props.sefin_tavsiyesi == "1" &&
                        <>
                            <Box sx={{}}>
                                <Stack direction="row" spacing={1}>
                                    <Chip avatar={<Avatar alt="" src="/images/chefAvatar.jpg"> </Avatar>}
                                        color="warning" label="Şefin Tavsiyesi" />
                                </Stack>
                            </Box>
                        </>
                    }
                    <Typography
                        marginTop="5px"
                        variant="subtitle1"
                        color="text.secondary"
                        component="div"
                        fontSize={20}
                        dangerouslySetInnerHTML={{ __html: props.para_birimi + props.urun_fiyati }}
                    />
                    {props.urun_kategori_baslik != "null" && (
                        <Typography
                            marginTop="5px"
                            fontSize={11}
                            variant="subtitle6"
                            color="text.secondary"
                            component="div"
                        >
                            {props.urun_kategori_baslik}
                        </Typography>
                    )}
                </CardContent>
                <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 0 }}>
                    <IconButton aria-label="previous"></IconButton>
                    <IconButton aria-label="play/pause"></IconButton>
                    <IconButton aria-label="next"></IconButton>
                </Box>
            </Box>
        </Card>
    );
};

export default CardUrun;
