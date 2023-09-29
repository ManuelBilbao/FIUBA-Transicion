import React from 'react';
import Hero from './Hero';
import ButtonsWrapper from './ButtonsWrapper';


function Header(props) {
    return (
        <>
            <Hero />
            <ButtonsWrapper {...props} />
        </>
    )
}

export default React.memo(Header);
