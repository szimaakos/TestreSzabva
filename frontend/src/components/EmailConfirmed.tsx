import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import "./EmailConfirmed.css";

const EmailConfirmed = () => {
  return (
    <div className="email-confirmed-container">
      <div className="email-confirmed-content">
        <div className="success-icon">
          <CheckCircle size={64} />
        </div>
        <h1>E-mail cím megerősítve!</h1>
        <p className="success-message">Köszönjük, hogy megerősítetted az e-mail címedet.</p>
        <p>Most már bejelentkezhetsz a TestreSzabva alkalmazásba és élvezheted az összes funkciót.</p>
        <Link to="/" className="login-link">
          Tovább a bejelentkezéshez
        </Link>
      </div>
    </div>
  );
};

export default EmailConfirmed;