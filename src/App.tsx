import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import Whiteboard from './components/Whiteboard';

const App: React.FC = () => {
  const { keycloak, initialized } = useKeycloak();

  // Show a loading spinner while Keycloak figures out if the user is logged in
  if (!initialized) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column bg-light p-0">
      {/* Navigation Header */}
      <header className="navbar navbar-dark bg-dark shadow-sm px-4 py-3 d-flex justify-content-between">
        <span className="navbar-brand mb-0 h1 fw-bold">
          🎨 Real-Time Smart Whiteboard
        </span>
        {/* Only show logout if authenticated */}
        {keycloak.authenticated && (
          <button onClick={() => keycloak.logout()} className="btn btn-outline-light btn-sm">
            Logout
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        {!keycloak.authenticated ? (
          // UNAUTHENTICATED: Show Login Screen
          <div className="text-center p-5 bg-white rounded shadow-sm border" style={{ maxWidth: '500px' }}>
            <h1 className="h3 mb-3 fw-bold text-dark">Welcome to your Session</h1>
            <p className="text-secondary mb-4">
              Securely authenticate via Keycloak to access the live collaborative canvas and predictive ML model.
            </p>
            <button 
              onClick={() => keycloak.login()} 
              className="btn btn-primary btn-lg w-100 fw-semibold shadow-sm"
            >
              Log In to Whiteboard
            </button>
          </div>
        ) : (
          // AUTHENTICATED: Render the Smart Canvas
          <div className="w-100 h-100 d-flex flex-column">
            <Whiteboard />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;