import React from 'react';
import Head from 'next/head';

const ItalyanTema = () => {
  return (
    <>
      <Head>
        <title>İtalyan İşi</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Bowlby+One&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Bowlby+One&family=M+PLUS+Code+Latin:wght@100..700&family=Noto+Sans+Mono:wght@100..900&display=swap" rel="stylesheet"/>
      </Head>
      <div className="row anaCerceve" style={{ textAlign: 'center' }}>
        <div className="col-md-12 col-xs-12" style={{ padding: '20px' }}>
          <div>
            <h1
              style={{
                color: '#353434',
                fontSize: '33px',
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 700,
                fontStyle: 'normal',
              }}
            >
              QR MENÜ
            </h1>
          </div>
        </div>
        <div className="col-md-6 col-xs-12" style={{ padding: '30px' }}>
          <div className="logoCerceve">
            <a href="/kategori?kategori_id=666&restoran=break-serdivan-avm">
              <img
                style={{ width: '55%' }}
                src="/images/break-qr.png"
                alt="Tatlı ya da kahvelerimiz"
                />
              <br />
              {/*<b style={{ color: '#323232',fontSize:'40px' }} className='bowlby-one-regular'>
                BREAK
              </b><br/>*/}
              <b style={{ color: '#323232',fontSize:'23px' }} className='m-plus-code-latin'>
                {/*Tatlı ya da kahvelerimizi<br /> denemek ister misiniz?*/}
                TATLI KAHVE
              </b>
            </a>
          </div>
        </div>
        <div className="col-md-6 col-xs-12" style={{ padding: '30px' }}>
          <div className="logoCerceve">
            <a href="/kategori?kategori_id=157&restoran=italyan-isi-serdivan-avm#157">
              <img
                src="https://static.wixstatic.com/media/57d31d_b9d731114ec241f8ae11bf990255477f~mv2.png"
                alt="Pizza ve yemek çeşitlerimiz"
                style={{ width: '60%' }}
              />
              <br />
              <b>
                <span style={{ color: '#016d33',fontSize:'25px' }} className='m-plus-code-latin'>AÇSAN TIKLA</span>
                {/*<span style={{ color: '#e81a29' }}>Pizza ve yemek çeşitlerimizi</span> <br />
                <span style={{ color: '#016d33' }}>denemek ister misiniz?</span>*/}
              </b>
            </a>
          </div>
        </div>
      </div>
      <style jsx>{`
        .logoCerceve {
          border: 1px solid #d4d4d4;
          box-shadow: 0px 5px 5px -2px rgba(0, 0, 0, 0.35);
          border-radius: 8px;
          width: 100%;
          padding: 10px;
          max-width: 600px;
          min-height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logoCerceve img {
          width: 65%;
        }
        a {
          text-decoration: none !important;
        }
        .anaCerceve {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 90vh;
        }
        .bowlby-one-regular {
          font-family: "Bowlby One", sans-serif;
          font-weight: 400;
          font-style: normal;
        }
        .m-plus-code-latin {
          font-family: "M PLUS Code Latin", monospace;
        }
        
      `}</style>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossOrigin="anonymous"
      ></script>
    </>
  );
};

export default ItalyanTema;
