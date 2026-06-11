import ReactDOM from 'react-dom/client';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import App from './App';
import keycloak from './keycloak';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider authClient={keycloak}>
    <App />
  </ReactKeycloakProvider>
);