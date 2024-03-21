import React, { useContext } from 'react';
import AuthContext from 'src/contexto/AuthContext';
import ColetaHome from '../Collect/Home';
import DescarteHome from '../Discard/Home';

function InitialPage() {
    const { app } = useContext(AuthContext)

    return (
        <>
            {app === "Coleta" ? <ColetaHome /> : <DescarteHome />}
        </>
    );
}

export default InitialPage;
