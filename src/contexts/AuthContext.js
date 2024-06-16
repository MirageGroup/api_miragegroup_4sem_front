import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState} from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState('')
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
    
  const setToken = (newToken) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      axios.get(`${backendUrl}/user/getprofile`, {
        headers: {
            "Authorization": "Bearer " + token
        }
      }).then((response) => {
        if(response){
            setUser(response.data)
            localStorage.setItem('token',token);
        }else{
            localStorage.removeItem('token')
        }
      })
    } else {
      localStorage.removeItem('token')
    }
  }, [token, setUser]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      user,
      setUser
    }),
    [token, user]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;