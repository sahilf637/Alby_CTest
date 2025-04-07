import React, { useState, useEffect } from 'react';

export const SatsFiatConverter = ({ satsValue, onSatsChange }) => {
  const [fiatValue, setFiatValue] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0.0004); // 1 sat = $0.0004 USD (example rate)
  
  // In a real app, you would fetch the current exchange rate
  useEffect(() => {
    // Mock fetching exchange rate - in a real app, use an API
    const fetchExchangeRate = async () => {
      try {
        // This would be replaced with an actual API call
        // const response = await fetch('https://api.example.com/btc-usd');
        // const data = await response.json();
        // setExchangeRate(data.satsToUsd);
        
        // For demo, we'll use a fixed rate
        setExchangeRate(0.0004); // $0.0004 per sat
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
      }
    };
    
    fetchExchangeRate();
  }, []);
  
  // Update fiat value when sats value changes
  useEffect(() => {
    if (satsValue) {
      const calculatedFiat = (parseFloat(satsValue) * exchangeRate).toFixed(2);
      setFiatValue(calculatedFiat);
    } else {
      setFiatValue('');
    }
  }, [satsValue, exchangeRate]);
  
  // Update sats value when fiat value changes
  const handleFiatChange = (e) => {
    const newFiatValue = e.target.value;
    setFiatValue(newFiatValue);
    
    if (newFiatValue) {
      const calculatedSats = Math.round(parseFloat(newFiatValue) / exchangeRate);
      onSatsChange(calculatedSats.toString());
    } else {
      onSatsChange('');
    }
  };
  
  // Update fiat when sats change
  const handleSatsChange = (e) => {
    const newSatsValue = e.target.value;
    onSatsChange(newSatsValue);
  };
  
  return (
    <div className="converter-input">
      <div className="input-group">
        <input
          type="number"
          value={satsValue}
          onChange={handleSatsChange}
          placeholder="0"
          min="0"
          className="sats-input"
        />
        <span className="input-label">sats</span>
      </div>
      
      <div className="equals-sign">=</div>
      
      <div className="input-group">
        <span className="input-label">$</span>
        <input
          type="number"
          value={fiatValue}
          onChange={handleFiatChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="fiat-input"
        />
      </div>
    </div>
  );
};