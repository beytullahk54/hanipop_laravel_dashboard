import '../styles/globals.css'

import * as React from 'react';
import {useEffect, useState} from "react";
import Router from 'next/router';
import LoadingComponent  from "../components/pages_yeni/loading"


export default function App({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };
    const handleComplete = () => {
      setIsLoading(false);
    };
    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleComplete);
    Router.events.on("routeChangeError", handleComplete);
  }, [Router]);

    return(
        <>
          {isLoading &&
              <>
                <LoadingComponent></LoadingComponent>
              </>
          }
          {!isLoading &&
              <Component {...pageProps} />
          }

        </>
    )


}
