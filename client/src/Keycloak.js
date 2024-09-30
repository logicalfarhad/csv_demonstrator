import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
 url: process.env.REACT_APP_KEYCLOAK_URL,
 realm: process.env.REACT_APP_KEYCLOAK_REALM,
 clientId: process.env.REACT_APP_KEYCLOAK_CLIENTID,
 enableLogging: true,
 checkLoginIframe: false,
});

export default keycloak;
