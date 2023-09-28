import React from 'react';
import Top from './Top';
import Hero from './Hero';
import ButtonsWrapper from './ButtonsWrapper';


function Header(props) {
    return (
        <>
            <Top />
            <Hero />
            <ButtonsWrapper {...props} />
        </>
    )
}

export default React.memo(Header);
