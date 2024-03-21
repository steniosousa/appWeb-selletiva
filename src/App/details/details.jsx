import { useLocation } from "react-router-dom";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Header from "../components/header";
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Webcam from 'react-webcam';
import Api from "src/api/service";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthContext from "src/contexto/AuthContext";
import { useState } from "react";
import { useEffect } from "react";

export default function DetailsApp() {
    const style = {
        position: "absolute",
        width: "100%",
        height: "auto",
        display: 'flex',
        flexDirection: 'column',
        border: "none"
    };
    const location = useLocation();
    let clear = location.state;
    const navigate = useNavigate()
    const [facingMode, setFacingMode] = React.useState('environment');
    const [charge, setCharge] = React.useState('')
    const [descharge, setDescharge] = React.useState('')
    const [document, setDocument] = React.useState('')
    const { operator } = React.useContext(AuthContext)
    const [isLoading, setIsLoading] = React.useState(false)
    const [Unidade, setUnidade] = useState('')
    const [peso, setPeso] = useState('')
    const [tipo, setTipo] = useState('')
    const webcamRef = React.useRef(null);
    const [typeDocs, setTypeDocs] = useState([])
    const [type, setType] = React.useState('')
    const [open, setOpen] = React.useState(false);
    const currentImages = localStorage.getItem(clear.id);
    const [idDocument, setIdDocument] = useState('')
    function handleOpenModal(TypeEvidence) {
        setType(TypeEvidence)
        setOpen(true)
    }
    ;
    const handleClose = () => setOpen(false);

    async function capture(TypeEvidence) {
        if (isLoading) return
        if (!TypeEvidence) return
        const imageSrc = await webcamRef.current.getScreenshot();


        if (currentImages) {
            const currentEvidences = JSON.parse(currentImages)
            navigator.geolocation.getCurrentPosition(sucess);
            function sucess(position) {
                const alredyExist = currentEvidences.find((item) => TypeEvidence === item.type)
                if (alredyExist) return
                currentEvidences.push({ "type": TypeEvidence, date: `${new Date()}`, name: imageSrc, location: { lat: position.coords.latitude, lng: position.coords.longitude } })
                localStorage.setItem(clear.id, JSON.stringify(currentEvidences))
            }
        } else {
            navigator.geolocation.getCurrentPosition(sucess);
            function sucess(position) {
                localStorage.setItem(clear.id, JSON.stringify([{ "type": TypeEvidence, date: `${new Date()}`, name: imageSrc, location: { lat: position.coords.latitude, lng: position.coords.longitude } }]))
            }
        }

        if (TypeEvidence === "charge") {
            setCharge(imageSrc)
        } else if (TypeEvidence === "descharge") {
            setDescharge(imageSrc)
        } else {
            setDocument(imageSrc)
        }

        setOpen(false)
    }

    function getEvidences() {
        const jsonCurrentImages = JSON.parse(currentImages)
        console.log(jsonCurrentImages)
        if (!jsonCurrentImages) return
        jsonCurrentImages.forEach((item) => {
            if (item.type === "charge") {
                setCharge(item.name)
            }
            else if (item.type === "descharge") {
                setDescharge(item.name)
            }
            else {
                setDocument(item.name)
            }

        })

    }

    const handleCameraSwitch = () => {
        setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
    };

    async function getDatas() {
        if (!operator) {
            setIsLoading(false)
            return
        }
        const auth_key = operator.auth_key
        try {
            const { data } = await Api.get('/getTiposDocs', {
                headers: {
                    authorization: auth_key,
                },
            });
            setTypeDocs(data)
        } catch (error) {
        }

    }

    async function deleteImage(TypeEvidence) {
        const confirm = await Swal.fire({
            icon: 'info',
            title: "Deseja deletar a evidência",
            showDenyButton: false,
            showCancelButton: true,
            showConfirmButton: true,
            denyButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar'
        })
        if (!confirm.isConfirmed) return
        const jsonCurrentImages = JSON.parse(currentImages)
        if (!jsonCurrentImages) return
        delete jsonCurrentImages[TypeEvidence]
        const filter = jsonCurrentImages.filter((item) => item.type !== TypeEvidence)
        localStorage.setItem(clear.id, JSON.stringify(filter));

        if (TypeEvidence === "charge") {
            setCharge('')
        }
        else if (TypeEvidence === "descharge") {
            setDescharge('')
        }
        else {
            setDocument('')
        }

    }


    async function uploadDatas() {
        if (isLoading) return
        setIsLoading(true)
        const jsonCurrentImages = JSON.parse(currentImages)

        const objctSend = {
            chargeEvidence: jsonCurrentImages.find((item) => item.type === "charge"),
            dischargeEvidence: jsonCurrentImages.find((item) => item.type === "descharge"),
            documentEvidence: jsonCurrentImages.find((item) => item.type === "document"),
            document: {
                documentTypeId: tipo,
                unit: Unidade,
                number: idDocument,
                weight: peso,

            },
            historicoEstoqueId: clear.id,
            s3: false,
        };
        if (!objctSend.chargeEvidence || !objctSend.dischargeEvidence || !objctSend.documentEvidence || !objctSend.document || !objctSend.historicoEstoqueId) {
            await Swal.fire({
                icon: 'info',
                title: "Preencha todos os campos",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'ok'
            })
            setIsLoading(false)

            return
        }
        const auth_key = operator.auth_key
        try {
            await Api.post('/', objctSend, {
                headers: {
                    authorization: auth_key,
                },
            });
            await Swal.fire({
                icon: 'success',
                title: "Envio bem sucedido",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'ok'
            })
            setIsLoading(false)

            navigate('/app/home')
        } catch (error) {
            await Swal.fire({
                icon: 'erro',
                title: "Erro ao enviar evidências",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }
        setIsLoading(false)
    }

    useEffect(() => {
        getDatas()
        getEvidences()
    }, [])

    return (
        <>
            <Header />
            <div style={{ margin: 5 }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 }}>
                    <FormControl sx={{ minWidth: '55%' }}>
                        <TextField id="outlined-basic" label="Nº Documento" variant="outlined" onChange={(e) => setIdDocument(e.target.value)} />
                    </FormControl>
                    <FormControl sx={{ minWidth: '40%' }}>
                        <InputLabel id="demo-simple-select-label">Tipo:</InputLabel>
                        <Select
                            onChange={(e) => setTipo(e.target.value)}
                            value={tipo}
                        >
                            {typeDocs.map((item) => {
                                return (
                                    <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 }}>
                    <FormControl sx={{ minWidth: '55%' }}>
                        <TextField id="outlined-basic" label="Peso: " variant="outlined" value={peso} onChange={(e) => setPeso(e.target.value)} />
                    </FormControl>
                    <FormControl sx={{ minWidth: '40%' }}>
                        <InputLabel id="demo-simple-select-label">Unidade:</InputLabel>
                        <Select
                            label="Unidade"
                            onChange={(e) => setUnidade(e.target.value)}
                            value={Unidade}
                        >
                            <MenuItem value={"UN"} >UN</MenuItem>
                            <MenuItem value={"L"} >L</MenuItem>
                            <MenuItem value={"KG"} >KG</MenuItem>
                        </Select>
                    </FormControl>


                </div>
            </div>


            <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'space-around', alignItems: 'center', marginTop: 50, gap: 20, marginBottom: 20 }}>
                {charge ? (
                    <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }} onClick={() => deleteImage('charge')}>
                        <span>- CARGA - </span>
                        <img src={charge} alt="img" width="90%" height="auto" style={{ borderRadius: 5 }} />
                        <span style={{ color: 'grey' }}>Click sobre a foto para deletá-la</span>
                    </div>
                ) : (
                    <div onClick={() => handleOpenModal("charge")} style={{ background: '#add8e6', borderRadius: 10, height: 100, width: 90, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Avatar >
                            <CameraAltIcon />
                        </Avatar>
                    </div>
                )}
                {descharge ? (
                    <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center', marginTop: 20 }} onClick={() => deleteImage('descharge')}>
                        <span>- DESCARGA - </span>
                        <img src={descharge} alt="img" width="90%" height="auto" style={{ borderRadius: 5 }} />
                        <span style={{ color: 'grey' }}>Click sobre a foto para deletá-la</span>

                    </div>
                ) : (
                    <div onClick={() => handleOpenModal("descharge")} style={{ background: '#add8e6', borderRadius: 10, height: 100, width: 90, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Avatar >

                            <CameraAltIcon />
                        </Avatar>
                    </div>
                )}
                {document ? (
                    <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center', marginTop: 20, marginBottom: 20 }} onClick={() => deleteImage('document')}>
                        <span>- DOCUMENTO - </span>
                        <img src={document} alt="img" width="90%" height="auto" style={{ borderRadius: 5 }} />
                        <span style={{ color: 'grey' }}>Click sobre a foto para deletá-la</span>

                    </div>
                ) : (
                    <div onClick={() => handleOpenModal("document")} style={{ display: "flex", flexDirection: 'column', alignItems: 'center', background: '#add8e6', borderRadius: 10, height: 100, width: 90, justifyContent: 'center' }}>
                        <Avatar >
                            <CameraAltIcon />
                        </Avatar>
                    </div>
                )}
            </div>
            <Button variant={isLoading ? "outlined" : "contained"} color="primary" style={{ width: '80%', marginLeft: '10%' }} onClick={uploadDatas}>
                {isLoading ? (<CircularProgress style={{ color: 'white' }} />) : (
                    <span>
                        Enviar
                    </span>
                )}
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Webcam
                        videoConstraints={{ facingMode }}
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                    />
                    <button onClick={handleCameraSwitch}>Alterar câmera</button>

                    <button onClick={() => capture(type)} style={{ border: "none", marginTop: 10, background: 'transparent', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        {isLoading ? (
                            <Avatar>
                                <CircularProgress />
                            </Avatar>
                        ) : (
                            <Avatar>
                                <CameraAltIcon />
                            </Avatar>
                        )}
                    </button>
                </Box>
            </Modal>
        </>

    )
}