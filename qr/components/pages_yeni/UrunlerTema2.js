import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import CardUrun from "./CardUrun";
import { useRouter } from "next/router";
import { Breadcrumbs, Chip, emphasize } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "@fontsource/nova-mono";
import "@fontsource/montserrat-alternates";
import Scroll, {
    Link,
    Element,
    Events,
    animateScroll as scroll,
    scrollSpy,
    scroller,
} from "react-scroll";
import UrunDetayDialog from "../../components/pages_yeni/UrunDetayDialog";
import Typography from "@mui/material/Typography";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        "&:hover, &:focus": {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        "&:active": {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
}); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

const Urunler = (props) => {
    const theme = useTheme();
    const { query } = useRouter();

    const headers = {
        "Content-Type": "application/json",
    };

    const [showUrunDetay, setShowUrunDetay] = React.useState(false);

    const [selectedUrun, setSelectedUrun] = React.useState(null);

    const urunDetayOpen = (props) => {
        console.log(props);
        setShowUrunDetay(true);
        setSelectedUrun(props);
    };

    const urunDetayClose = () => {
        setShowUrunDetay(false);
    };

    return (
        <>
            <Breadcrumbs aria-label="breadcrumb" sx={{ marginTop: 9 }}>
                <Link href={"/pages_yeni"}>
                    <StyledBreadcrumb
                        href="#"
                        label="Anasayfa"
                        icon={<HomeIcon fontSize="small" />}
                    />
                </Link>
                {/* props.kategori.length>0 &&
                    <StyledBreadcrumb component="a" href="#" label={props.kategori.find(kategori=>kategori.id==query.kategori_id).kategori_adi} />
                */}
            </Breadcrumbs>
            <Element>
                <Typography
                    variant="h4"
                    style={{
                        fontFamily: "Montserrat Alternates",
                        textAlign: "center",
                        margin: "30px",
                        padding: 10,
                        border: "1px solid " + props.firma.firma_arkaplan_renk,
                        borderRadius: 15,
                    }}
                >
                    {props.hasKategoriler.kategori_adi[props.seciliDil]}
                </Typography>
            </Element>
            {props.hasUrunler.map((res2) => {
                return (

                    <>
                        {res2.urun_vitrin != "gizle" &&
                            <CardUrun
                                yeni_aktif = "0"
                                seciliDil={props.seciliDil}
                                setSeciliDil={props.setSeciliDil}
                                firma={props.firma}
                                urunDetayOpen={urunDetayOpen}
                                urunDetayClose={urunDetayClose}
                                urun_id={res2.id}
                                urun_adi={res2.urun_adi}
                                para_birimi={props.firma.firma_para_birimi}
                                urun_aciklama={res2.urun_aciklama}
                                urun_gorsel={res2.urun_gorsel}
                                urun_fiyati={res2.urun_fiyati}
                                created_at={res2.created_at}
                                urun_kategori_baslik={""}
                                sefin_tavsiyesi={res2.sefin_tavsiyesi}
                                kategori={res2}
                            />
                        }
                    </>
                );
            })}
            <UrunDetayDialog
                seciliDil={props.seciliDil}
                firma={props.firma}
                selectedUrun={selectedUrun}
                urunDetayClose={urunDetayClose}
                showUrunDetay={showUrunDetay}
                urunDetayOpen={urunDetayOpen}
            />
        </>
    );
};

export default Urunler;
