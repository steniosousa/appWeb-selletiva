import { createContext, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Api from "src/api/service";


const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
  const [operator, setOperator] = useState(null)
  const [language, setLanguage] = useState(null)
  const [app, setApp] = useState(null)
  const navigate = useNavigate();


  async function LoginApp(key) {
    try {
      const { data } = await Api.post('/auth', {
        key,
      })
      setOperator(data.success)
      localStorage.setItem('userApp', JSON.stringify(data.success));
      navigate('/app/home')
    } catch (error) {
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
    localStorage.clear();
    navigate('/app/login')
  }
  return (
    <AuthContext.Provider value={{ LoginApp, setOperator, operator, LogoutApp, setLanguage, language, setApp, app }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;