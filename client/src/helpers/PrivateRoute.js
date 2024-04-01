import { useKeycloak } from "@react-keycloak/web";
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { keycloak } = useKeycloak();
console.log(keycloak)
  // Check if keycloak object exists before accessing its properties
  const isLoggedIn = keycloak && keycloak.authenticated;
   console.log(isLoggedIn)
  return isLoggedIn ? children : <Navigate to="/" />;
};

export default PrivateRoute;