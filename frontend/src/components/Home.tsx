import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";

// Képeket megtartjuk
import weeklyschedule from "./schedule.jpeg";
import ingredientbook from "./egg.jpeg";
import communityhealth from "./community.jpeg";

// A CSS-ben NINCS max-width, 
// és figyelünk, hogy ne lógjunk túl horizontálisan.
import "./Home.css";

type HomeProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
};

const Home: React.FC<HomeProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  // AuthModal megnyitás
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"register" | "login">("register");

  // Mobilmenü
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ha nincs bejelentkezve, modált nyitunk
  const checkLoginOrRegister = (callback: () => void) => {
    if (!isLoggedIn) {
      setActiveTab("register");
      setIsModalOpen(true);
    } else {
      callback();
    }
  };

  const openRegister = () => {
    setActiveTab("register");
    setIsModalOpen(true);
  };

  const openLogin = () => {
    setActiveTab("login");
    setIsModalOpen(true);
  };

  return (
    <div className="home-container">
      {/* ===== HEADER ===== */}
      <header className="home-header">
        <div className="header-inner">
          {/* Animált logó */}
          <div className="logo animated-logo">TestreSzabva</div>

          <nav className={`header-links ${isMobileMenuOpen ? "open" : ""}`}>
            <a href="#heti-etrend" onClick={() => setIsMobileMenuOpen(false)}>
              Heti Étrend
            </a>
            <a href="#receptek" onClick={() => setIsMobileMenuOpen(false)}>
              Receptek
            </a>
            <a href="#kapcsolat" onClick={() => setIsMobileMenuOpen(false)}>
              Kapcsolat
            </a>
            <button
              className="header-button outline"
              onClick={() => {
                openRegister();
                setIsMobileMenuOpen(false);
              }}
            >
              Regisztráció
            </button>
            <button
              className="header-button filled"
              onClick={() => {
                openLogin();
                setIsMobileMenuOpen(false);
              }}
            >
              Bejelentkezés
            </button>
          </nav>

          {/* Hamburger ikon mobilon */}
          <div
            className="hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Formáld át az életed a TestreSzabva programmal!</h1>
            <p>
              A személyre szabott heti étrendjeink és receptjeink segítségével
              könnyedén követheted az egészséges életmódot, és támogatjuk a
              céljaid elérését.
            </p>
            <button className="cta-button" onClick={openRegister}>
              Próbáld ki most
            </button>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">Kép helye</div>
          </div>
        </div>
      </section>

      {/* ===== Hogyan működik? ===== */}
      <section className="how-section" id="heti-etrend">
        <h2>Hogyan működik a TestreSzabva?</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Töltsd ki a kérdőívet</h3>
            <p>
              Írd be adataid (magasság, súly, célok, preferenciák), hogy
              személyre szabottan állíthassuk össze az étrendedet.
            </p>
            <button
              className="step-button"
              onClick={() => checkLoginOrRegister(() => navigate("/onboarding"))}
            >
              Kérdőív kitöltése
            </button>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Állítsd össze a menüdet</h3>
            <p>
              Válogass a különböző receptekből, és generálj bevásárlólistát, hogy
              mindig tudd, mit kell venned.
            </p>
            <button
              className="step-button"
              onClick={() => checkLoginOrRegister(() => navigate("/weekly-menu"))}
            >
              Menü összeállítás
            </button>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Kövesd a haladást</h3>
            <p>
              Monitorozd a fejlődésed, oszd meg sikereidet, és kérj tanácsot a
              közösségtől.
            </p>
            <button
              className="step-button"
              onClick={() => checkLoginOrRegister(() => navigate("/progress"))}
            >
              Haladás követése
            </button>
          </div>
        </div>
      </section>

      {/* ===== Fő funkciók (3 kép) ===== */}
      <section className="features-section" id="receptek">
        <h2>A TestreSzabva fő funkciói</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-image">
              <img
                src={weeklyschedule}
                alt="Heti Étrend"
                className="feature-image"
              />
            </div>
            <h3>Személyre szabott heti menü</h3>
            <p>
              Légy a saját tested szakértője! Kérdőívünkkel céljaidhoz igazított
              menüt állítunk össze.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-image">
              <img
                src={ingredientbook}
                alt="Receptgyűjtemény"
                className="feature-image"
              />
            </div>
            <h3>Receptgyűjtemény</h3>
            <p>
              Édes és sós finomságok, egészséges desszertek és főételek – a
              választék határtalan!
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-image">
              <img
                src={communityhealth}
                alt="Közösség"
                className="feature-image"
              />
            </div>
            <h3>Aktív közösség</h3>
            <p>
              Csatlakozz hozzánk, kérj tanácsot, ossz meg tippeket – mindenki
              segíti egymást!
            </p>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>Vélemények</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-text">
              „A TestreSzabva heti menüjével végre sikerült úgy diétáznom, hogy
              közben finomakat eszem és nem éhezem!”
            </p>
            <p className="testimonial-author">– Mariann, 29 éves</p>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">
              „Nekem a receptek adtak hatalmas segítséget. Egyszerűen
              elkészíthető, egészséges ételek – imádom!”
            </p>
            <p className="testimonial-author">– Balázs, 34 éves</p>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">
              „Közösség és motiváció – ezekre volt a legnagyobb szükségem, és a
              TestreSzabva mindenben támogatott.”
            </p>
            <p className="testimonial-author">– Anikó, 42 éves</p>
          </div>
        </div>
      </section>

      {/* ======== CTA, csatlakozz most! (új) ======== */}
      <section className="cta-join-section" id="kapcsolat">
        <h2>Csatlakozz a TestreSzabvához még ma!</h2>
        <p>
          Lépj kapcsolatba velünk, vagy regisztrálj és alakítsd ki a saját
          egészséges életmódodat. Nem vagy egyedül: itt a támogatás minden
          lépésnél!
        </p>
        <button className="cta-button" onClick={openRegister}>
          Ingyenes regisztráció
        </button>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="home-footer" id="kapcsolat">
        <div className="footer-content">
          <p>© 2025 TestreSzabva – Minden jog fenntartva.</p>
        </div>
      </footer>

      {/* ===== AuthModal ===== */}
      {isModalOpen && (
        <AuthModal
          activeTab={activeTab}
          onClose={() => setIsModalOpen(false)}
          onTabChange={(tab) => setActiveTab(tab)}
        />
      )}
    </div>
  );
};

export default Home;
