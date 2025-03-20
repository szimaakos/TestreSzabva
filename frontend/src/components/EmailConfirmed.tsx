import React from "react";
import { Link } from "react-router-dom";

const EmailConfirmed = () => {
  return (
    <div className="email-confirmed-container">
      <div className="email-confirmed-content">
        <h1>E-mail cím megerősítve!</h1>
        <p>Köszönjük, hogy megerősítetted az e-mail címedet.</p>
        <p>Most már bejelentkezhetsz a TestreSzabva alkalmazásba.</p>
        <Link to="/" className="login-link">
          Tovább a bejelentkezéshez
        </Link>
      </div>
    </div>
  );
};

export default EmailConfirmed;