import React from 'react';
import LobbyForm from '../components/LobbyForm';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';

function LobbyNew() {
    return (
        <React.Fragment>
            <Nav></Nav>
            <WidthLimiter>
                <LobbyForm></LobbyForm>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default LobbyNew;
