import { Button, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Api from "src/api/service";
import AuthContext from "src/contexto/AuthContext";
import Swal from "sweetalert2";
import Header from "../components/header";
import Card from "./Components/Card";

export default function DescarteHome() {
    const [isLoading, setIsLoading] = useState(false)
    const { operator, language } = useContext(AuthContext)
    const [solicitations, setSolicitations] = useState([])
    const navigate = useNavigate()


    async function getSolicitations() {
        if (isLoading) return
        setIsLoading(true)
        if (!operator) {
            setIsLoading(false)
            return
        }
        const auth_key = operator.auth_key

        try {
            const { data } = await Api.get('/', {
                headers: {
                    Authorization: auth_key,
                },
                params: { onlyPendingDestination: 'true' },
            });
            setSolicitations(data)
        }
        catch {
            await Swal.fire({
                icon: 'error',
                title: "Não foi possível recuperar solicitações",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }
        setIsLoading(false)
    }


    function discardLocationDetails(item) {
        navigate('/app/discardDetails', { state: item })
    }

    useEffect(() => {
        if (!operator) return

        getSolicitations()
    }, [operator])


    return (
        <>
            <Header />
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                {!solicitations.length ? (
                    isLoading ? (
                        <div style={{ width: '100%', alignItems: 'center' }}>
                            <CircularProgress />
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
                            <span >{language ? language.SemSolicitações : "Nenhuma solicitação vigente no momento"}</span>
                            <Button onClick={() => getSolicitations()}>Atualizar</Button>
                        </div>

                    )

                ) :
                    solicitations.map((item) => {
                        return (
                            <Card item={item} key={item.id} press={discardLocationDetails} />

                        )
                    })
                }

            </div>


        </>
    )
}