import React from 'react';
import LobbyForm from '../components/LobbyForm';
import Nav from '../components/Nav';
import WidthLimiter from '../components/WidthLimiter';

function LobbyDetail() {
    // TODO
    // Check if this is a new lobby or if an id is in the url
    // If its new or if (there is an ID and owner of the lobby is the logged in user) -> display form
    return (
        <React.Fragment>
            <Nav></Nav>
            <WidthLimiter>
                <LobbyForm></LobbyForm>
            </WidthLimiter>
        </React.Fragment>
    );
}

export default LobbyDetail;
