import React, { useState, useEffect } from 'react';

const WalletInfo = ({ webln }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      if (!webln) return;
      
      try {
        const result = await webln.getInfo();
        setInfo(result);
      } catch (err) {
        setError(`Failed to get wallet info: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [webln]);

  const refreshInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await webln.getInfo();
      setInfo(result);
    } catch (err) {
      setError(`Failed to get wallet info: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="wallet-info">
        <h2>Wallet Info</h2>
        <p>Loading wallet information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wallet-info">
        <h2>Wallet Info</h2>
        <p className="error">{error}</p>
        <button onClick={refreshInfo} className="secondary-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="wallet-info">
      <h2>Wallet Info</h2>
      
      <div className="info-grid">
        {info?.node?.alias && (
          <div className="info-item">
            <span className="label">Alias:</span>
            <span className="value">{info.node.alias}</span>
          </div>
        )}
        
        {info?.node?.pubkey && (
          <div className="info-item">
            <span className="label">Pubkey:</span>
            <span className="value truncate">{info.node.pubkey}</span>
          </div>
        )}
        
        {info?.methods && (
          <div className="info-item">
            <span className="label">Supported Methods:</span>
            <span className="value">{info.methods.join(', ')}</span>
          </div>
        )}
      </div>
      
      <button onClick={refreshInfo} className="secondary-button refresh-button">
        Refresh
      </button>
    </div>
  );
};

export default WalletInfo;