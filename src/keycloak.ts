import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'whiteboard-realm',
  clientId: 'react-whiteboard',
});

export default keycloak;
