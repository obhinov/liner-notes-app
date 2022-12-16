// ----- Imports -----
import React from 'react';

import LoginPage from './LoginPage'
import CreditsPage from './CreditsPage'

// ----- Main Function -----
export default function AppNav() {
  const auth_code = new URLSearchParams(window.location.search).get("code");

  return (
    <div className="AppNav">
      {auth_code ? <CreditsPage spotify_auth_code={auth_code}/>:<LoginPage/>}
    </div>
  );
}