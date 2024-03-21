import { Button, CircularProgress } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import AuthContext from "src/contexto/AuthContext";
import Header from "../components/header";
import CardCollets from "./Components/Card";

export default function ColetaHome() {
    const [isLoading, setIsLoading] = useState(false)
    const { operator, language } = useContext(AuthContext)
    const [solicitations, setSolicitations] = useState([])
    const navigate = useNavigate()


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

                            <span >TELA EM CONSTRUÇÃO</span>

                            <Button >Atualizar</Button>
                        </div>

                    )

                ) :
                    solicitations.map((item) => {
                        return (
                            <CardCollets key={item.id} />

                        )
                    })
                }

            </div>


        </>
    )
}