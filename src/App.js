import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';

import { baselightTheme } from "./theme/DefaultColors";
import { useContext, useEffect } from 'react';
import AuthContext from './contexto/AuthContext';
import { useNavigate } from "react-router-dom";
function App() {
  const routing = useRoutes(Router);
  const theme = baselightTheme;
  const {  setOperator } = useContext(AuthContext)
  const navigate = useNavigate();
  useEffect(() => {
    const app = localStorage.getItem("userApp")

    const currentUrl = window.location.pathname;
    if(currentUrl.includes("/resetPass/")){
      return
    }
    if (app) {
      setOperator(JSON.parse(app))
      navigate('/app/home')
    } else {
      navigate('/app/login')
    }
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {routing}
    </ThemeProvider>
  );
}

export default App;
