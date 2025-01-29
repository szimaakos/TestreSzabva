import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./AuthModal.css";

interface AuthModalProps {
  activeTab: "register" | "login";
  onClose: () => void;
  onTabChange: (tab: "register" | "login") => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  activeTab,
  onClose,
  onTabChange,
}) => {
  const handleLoginSuccess = (credentialResponse: any) => {
    console.log("Google Login Sikeres:", credentialResponse);
    const token = credentialResponse.credential;
    // Token küldése a backendnek validálásra
    fetch("http://your-backend.com/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Backend válasz:", data))
      .catch((err) => console.error("Hiba:", err));
  };

  const handleLoginFailure = () => {
    console.error("Google Login Sikertelen");
  };

  return (
    <GoogleOAuthProvider clientId="810242813298-6kf804qftpjom2fvc0gh4e2mvpe3fm6l.apps.googleusercontent.com">
      <div className="modal-overlay" onClick={onClose}>
        {/* Megakadályozzuk, hogy a modal tartalmára kattintva bezáródjon */}
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Fejléc: tab-gombok + bezáró ikon (X) már kint */}
          <div className="modal-header">
            <button
              className={activeTab === "register" ? "active" : ""}
              onClick={() => onTabChange("register")}
            >
              Regisztráció
            </button>
            <button
              className={activeTab === "login" ? "active" : ""}
              onClick={() => onTabChange("login")}
            >
              Bejelentkezés
            </button>
          </div>

          {/* Ide tesszük ki a bezáró gombot (X) teljesen, abszolút pozicionálva */}
          <span className="close-button" onClick={onClose}>
            &times;
          </span>

          <div className="modal-body">
            {/* REGISZTRÁCIÓS FÜL */}
            {activeTab === "register" && (
              <div className="tab-content tab-register">
                <h2>Csatlakozz a TestreSzabva közösséghez!</h2>
                <div className="social-login">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                  />
                  <button className="social-button facebook">
                    Folytatás Facebook-al
                  </button>
                </div>
                <p className="separator">vagy lépj be e-mail címmel</p>

                <label>E-mail cím</label>
                <input type="email" placeholder="E-mail címed" />
                <label>Jelszó</label>
                <input type="password" placeholder="Jelszó" />

                <div className="newsletter">
                  <input type="checkbox" id="newsletter" />
                  <label htmlFor="newsletter">
                    Szeretnék hírlevelet kapni a legújabb étrendekről és
                    receptekről
                  </label>
                </div>

                <button className="submit-button">Regisztráció</button>
                <p className="info-text">
                  A regisztrációval elfogadod a{" "}
                  <a href="#felhasznalasi">felhasználási feltételeket</a> és az{" "}
                  <a href="#adatvedelmi">adatvédelmi szabályzatot</a>.
                </p>
              </div>
            )}

            {/* BEJELENTKEZÉSI FÜL */}
            {activeTab === "login" && (
              <div className="tab-content tab-login">
                <h2>Bejelentkezés</h2>
                <div className="social-login">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                  />
                  <button className="social-button facebook">
                    Folytatás Facebook-al
                  </button>
                </div>
                <p className="separator">vagy lépj be e-mail címmel</p>

                <label>E-mail cím</label>
                <input type="email" placeholder="E-mail címed" />
                <label>Jelszó</label>
                <input type="password" placeholder="Jelszó" />
                <button className="submit-button">Bejelentkezés</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default AuthModal;
