import React, { useContext } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    Button,
    Stack,
    Grid,
    Card,
    CircularProgress,
    FormLabel,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';
import { useState } from 'react';
import Swal from 'sweetalert2';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import PageContainer from 'src/components/container/PageContainer';
import AuthContext from 'src/contexto/AuthContext';
import { useEffect } from 'react';
import axios from 'axios';
import Api from 'src/api/service';

const LoginApp = ({ subtitle }) => {
    const [key, setKey] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { LoginApp, setLanguage, language } = useContext(AuthContext)
    const [app, setApp] = useState('')
    async function handleLogin() {
        setIsLoading(true)
        if (isLoading) return
        if (!key || !app) {
            await Swal.fire({
                icon: 'error',
                title: "Preencha todos os campos",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Ok'
            })
            setIsLoading(false)
            return
        }
        LoginApp(key)
        setIsLoading(false)
    }

    async function getLangueg() {
        navigator.geolocation.getCurrentPosition(async (position) => {
            if (!position) return
            try {
                const { data } = await axios.get("http://nominatim.openstreetmap.org/reverse?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&format=json")
                if (data.address.country === "Chile") {
                    try {
                        const { data } = await Api.get('/linguages', {
                            headers: {
                                Authorization: "435F57X",
                            },
                        });
                        setLanguage(data["es-cl"][0])
                    } catch (error) {
                        console.log(error)
                    }
                } else if (data.address.country === "Canadá") {
                    try {
                        const { data } = await Api.get('/linguages', {
                            headers: {
                                Authorization: "435F57X",
                            },
                        });
                        setLanguage(data["en-us"][0])
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    return
                }

            } catch (error) {
                console.log(error);

            }

        });
    }
    useEffect(() => {
        getLangueg()
    }, [])


    return (
        <PageContainer title="Login" description="this is Login page" >
            <Box
                sx={{
                    position: 'relative',
                    '&:before': {
                        content: '""',
                        backgroundSize: '400% 400%',
                        animation: 'gradient 15s ease infinite',
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        opacity: '0.3',
                    },
                }}
            >
                <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        lg={4}
                        xl={3}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}>
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <img src={"https://sistema.selletiva.com.br/images/logo.svg"} height={70} style={{ marginBottom: 40 }} alt="Img LOGO" />
                            </Box>
                            <>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="female"
                                        name="radio-buttons-group"
                                        style={{ display: 'flex', flexDirection: 'row' }}
                                        onChange={(e) => setApp(e.target.value)}
                                    >
                                        <FormControlLabel value="Coleta" control={<Radio />} label="Coleta" />
                                        <FormControlLabel value="Descarte" control={<Radio />} label="Descarte" />
                                    </RadioGroup>
                                </FormControl>
                                <Stack>
                                    <Box>
                                        <Typography variant="subtitle1"
                                            fontWeight={600} component="label" htmlFor='username' mb="5px">{language ? language.CódigoDeAcesso : "Código de acceso"}</Typography>
                                        <CustomTextField id="username" variant="outlined" fullWidth onChange={(e) => setKey(e.target.value)} />
                                    </Box>

                                    <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                                        <FormGroup>
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                onClick={() => window.location.href = "https://sistema.selletiva.com.br/auth"}
                                            >
                                                Acessar plataforma web
                                            </Button>
                                        </FormGroup>
                                    </Stack>
                                </Stack>
                                <Box>
                                    {isLoading ? (
                                        <Button
                                            color="secondary"
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                        >
                                            <CircularProgress />
                                        </Button>
                                    ) : (

                                        <Button
                                            color="primary"
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            onClick={handleLogin}
                                        >
                                            {language ? language.Acessar : "Acessar    "}
                                        </Button>
                                    )}
                                </Box>
                                {subtitle}
                            </>
                            <p style={{ color: 'grey', marginTop: 20, opacity: 0.5 }}>Version: 2.0.0</p>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>

    )
}

export default LoginApp;
