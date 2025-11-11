import HeaderHome from "./header/HeaderHome";
import React from "react";

const SurenizDoldu = (props) => {

    return (
      <>

          <main>
              <HeaderHome  firma={props.firma}></HeaderHome>
              <div style={{margin:"5%"}}>Sisteminiz askıya alınmıştır.</div>
          </main>

      </>
    );
}
export default SurenizDoldu