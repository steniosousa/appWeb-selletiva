import AuthContext from "src/contexto/AuthContext"
import { Avatar, Button, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import * as React from 'react';

export default function Card({ item, press }) {
    const { language } = React.useContext(AuthContext)

    return (
        <ListItem style={{ cursor: "pointer", display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} onClick={() => press(item)}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >

                <ListItemAvatar>
                    <Avatar style={{ background: "#add8e6" }}>
                    </Avatar>
                </ListItemAvatar>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <ListItemText >
                        {language ? `${language.Destinatário}: ${item.destination.nome}` : `Destinatário: ${item.destination.nome}`}
                    </ListItemText>
                    <span style={{ color: 'grey' }}>{item.destination.address.district} - {item.destination.address.street} Nº {item.destination.address.number}</span>
                </div>
            </div>
            <Button variant={"contained"} color={"primary"} style={{ height: 30, color: 'white' }}>
                {language ? language.Acessar : "Abrir"}
            </Button>

        </ListItem>
    )
}