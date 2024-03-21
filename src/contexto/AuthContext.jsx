import { createContext, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
  const [operator, setOperator] = useState(null)
  const navigate = useNavigate();


  async function LoginApp(key) {
    try {
      let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json"
      }

      let bodyContent = JSON.stringify({
        "key": key
      });

      let reqOptions = {
        url: "http://sistema.selletiva.com.br/serverapp/auth",
        method: "POST",
        headers: headersList,
        data: bodyContent,
      }

      let { data } = await axios.request(reqOptions);
      setOperator(data)
      localStorage.setItem('userApp', JSON.stringify(data));
      navigate('/app/home')
    } catch (error) {
      console.log(error)
      await Swal.fire({
        icon: 'error',
        title: "Hash inválido",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }
  }

  function LogoutApp() {
    localStorage.removeItem('userApp');
    navigate('/app/login')
  }
  return (
    <AuthContext.Provider value={{ LoginApp, setOperator, operator, LogoutApp }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;