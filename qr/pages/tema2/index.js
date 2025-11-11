import React, { useEffect, useMemo, useState } from 'react'
import HeaderHome from "../../components/pages_yeni/header/HeaderHome"
import CardList from '../../components/pages_yeni/Kategoriler'
import MusteriBildirim from "../../components/pages_yeni/MusteriBildirim";
import axios from "axios";
import { useRouter } from "next/router";
import SurenizDoldu from "../../components/pages_yeni/SurenizDoldu";
import LoadingComponent from "../../components/pages_yeni/loading";
import Whatsapp from "../../components/pages_yeni/Whatsapp";
import Dil from "../../components/pages_yeni/Dil";
import SimpleDialogDemo from "../../components/Dialog/dialog1";
import Button from "@mui/material/Button";

//kategoriGetir?kategori=yekpare-cafe
const PagesYeni = (props) => {

    const [isLoading, setIsLoading] = useState(true)
    const [kalanGun, setKalanGun] = useState(1)
    const [datas, setDatas] = useState([])
    const [firma, setFirma] = useState([])
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [seciliDil, setSeciliDil] = useState("tr")
    const { query } = useRouter();

    useEffect(() => {
        const dilKontrol = sessionStorage.getItem("dil")
        if (dilKontrol == null) {
            setDialogOpen(true)
        } else {
            setSeciliDil(dilKontrol)
        }
    }, [])

    useEffect(() => {
        const headers = {
            "Content-Type": "application/json"
        };
        const fetchPost = async () => {
            function getDifferenceInDays(date1, date2) {
                const diffInMs = Math.abs(date2 - date1);
                return diffInMs / (1000 * 60 * 60 * 24);
            }

            if (query.url) {
                let response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/kategoriGetir`, {
                    kategori: query.url
                }, { headers }).then(res => {
                    if (res.data) {

                        let date1 = new Date()
                        let date2 = new Date(res.data.firma.hizmetBitisTarihi)
                        setKalanGun(Math.floor((date2 - date1) / (1000 * 3600 * 24)))
                        setDatas(res.data.kategori)
                        setFirma(res.data.firma)


                        setIsLoading(false);

                    }
                });
            }
        };
        fetchPost();
    }, [query.url]);

    return (
        <>
            {isLoading &&
                <>
                    <LoadingComponent firma={firma} />
                </>
            }
            {!isLoading &&
                <>

                    {kalanGun > 0 &&
                        <>

                            <main>
                                <HeaderHome firma={firma} temaUrl={"tema2"} ></HeaderHome>
                                <SimpleDialogDemo firma={firma} seciliDil={seciliDil} setSeciliDil={setSeciliDil} title={"Dil Seçiniz"} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen}></SimpleDialogDemo>
                                <CardList seciliDil={seciliDil} setSeciliDil={setSeciliDil} datas={datas} temaUrl={"tema2"} />
                                <MusteriBildirim firma={firma}> </MusteriBildirim>
                                <Dil setDialogOpen={setDialogOpen} firma={firma}></Dil>

                                {query.url == "kodlooper-cafe" &&
                                    <Whatsapp firma={firma}></Whatsapp>
                                }
                            </main>
                        </>
                    }

                    {kalanGun <= 0 &&
                        <>
                            <SurenizDoldu firma={firma}></SurenizDoldu>
                        </>
                    }
                </>
            }


        </>
    )
}

export default PagesYeni;
