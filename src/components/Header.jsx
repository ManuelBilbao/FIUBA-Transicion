import React from 'react';

function Header() {
    return (
        <>
            <div style={{ backgroundColor: "#0095db", display: "flex", justifyContent: "flex-end", alignItems: "flex-start" }}>
                <img
                    src={process.env.PUBLIC_URL + "/fiuba-white-logo.png"}
                    alt={"logo FIUBA"}
                    style={{ width: 200, display: "block", padding: 10 }}
                />
            </div>
            {/* <div>
            <img 
                src={process.env.PUBLIC_URL + "/banner_principal.png"}
                alt="logo FIUBA"   
                style={{width:"100%", display:"block"}}
            />
        </div> */}
            <div style={{ position: "relative", textAlign: "center", color: "white",}}>
                <img src={process.env.PUBLIC_URL + "/banner_recortado.png"} alt="banner" style={{ width: "100%", display: "block" }} />
                <div style={{ position: "absolute", top: "50%", left: "50%", transform:"translate(-50%, -50%)"}}>
                    <h1 style={{fontWeight:"bold"}}>
                        Calculadora Plan 2023
                    </h1>
                    <h2 style={{fontWeight:"bold"}}>
                        Ing. en Informática
                    </h2>
                </div>
            </div>
        </>
    )
}

export default React.memo(Header);
