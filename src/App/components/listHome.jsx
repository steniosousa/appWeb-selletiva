import { Avatar, Button, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import * as React from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
export default function ListHome({ datas, onPress }) {
    return (
        <ListItem style={{  cursor: "pointer", display:'flex', flexDirection:'row', justifyContent:'space-between' }} onClick={() => onPress(datas)}>
           <div style={{   display:'flex', flexDirection:'row', justifyContent:'space-between' }} >

            <ListItemAvatar>
                <Avatar style={{ background: "#add8e6" }}>
                    <CameraAltIcon />
                </Avatar>
            </ListItemAvatar>
            <div style={{display:'flex', flexDirection:'column'}}> 
                <ListItemText primary={`${datas.destination.nome}`}  />
                <span style={{color:'grey'}}>{datas.destination.address.district} - {datas.destination.address.street} Nº {datas.destination.address.number}</span>
            </div>
           </div>
                    <Button onClick={() => onPress(datas)} variant={"contained" } color={datas.status === 'ASSUMIDO' ? "primary" : "secondary"} style={{ height: 30, color:'white' }}>
                        Abrir
                    </Button>

        </ListItem>
    );
}