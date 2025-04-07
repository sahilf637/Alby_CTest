import React, { useState, useEffect } from 'react';
import { useWebln } from './hooks/useWebln';
import PaymentForm from './components/PaymentForm';
import KeysendForm from './components/KeysendForm';
import WalletInfo from './components/WalletInfo';
import InvoiceGenerator from './components/InvoiceGenerator';
import ScrollPayment from './components/ScrollPayment';
import QRCodeScanner from './components/QRCodeScanner';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const { webln, weblnEnabled, enableWebln } = useWebln();

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <header>
        <h1>⚡ Lightning Web App</h1>
        <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </header>

      <main>
        {!weblnEnabled ? (
          <div className="connect-webln">
            <p>Connect to your Lightning wallet to use this app</p>
            <button onClick={enableWebln} className="primary-button">Connect WebLN</button>
          </div>
        ) : (
          <>
            <div className="card-grid">
              <div className="card">    <div>    <div></div></div>
                <WalletInfo webln={webln} />
              </div>
              
              <div className="card">
                <PaymentForm webln={webln} />
              </div>
              
              <div className="card">
                <KeysendForm webln={webln} />
              </div>
              
              <div className="card">
                <InvoiceGenerator webln={webln} />
              </div>
              
              <div className="card">
                <ScrollPayment webln={webln} />
              </div>
              
              <div className="card">
                <QRCodeScanner webln={webln} />
              </div>
            </div>
          </>
        )}
      </main>
      
      <footer>
        <p>WebLN Integration Demo | {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;