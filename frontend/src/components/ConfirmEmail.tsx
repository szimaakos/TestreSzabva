import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ConfirmEmail = () => {
  const [status, setStatus] = useState('confirming');
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const confirmEmail = async () => {
      // Get userId and token from URL params
      const searchParams = new URLSearchParams(location.search);
      const userId = searchParams.get('userId');
      const token = searchParams.get('token');
      
      if (!userId || !token) {
        setStatus('error');
        return;
      }
      
      try {
        const response = await fetch('http://localhost:5162/api/Felhasznalo/ConfirmEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, token })
        });
        
        if (response.ok) {
          setStatus('success');
          // Redirect to login after a short delay
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error confirming email:', error);
        setStatus('error');
      }
    };
    
    confirmEmail();
  }, [location, navigate]);
  
  return (
    <div className="confirm-email-container">
      {status === 'confirming' && <p>E-mail cím megerősítése folyamatban...</p>}
      {status === 'success' && (
        <div>
          <h2>E-mail cím sikeresen megerősítve!</h2>
          <p>Átirányítás a bejelentkezéshez...</p>
        </div>
      )}
      {status === 'error' && (
        <div>
          <h2>Hiba történt!</h2>
          <p>Az e-mail cím megerősítése sikertelen volt. Kérjük, próbálja újra, vagy vegye fel a kapcsolatot az ügyfélszolgálattal.</p>
        </div>
      )}
    </div>
  );
};

export default ConfirmEmail;