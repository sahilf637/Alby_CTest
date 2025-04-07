import React, { useState, useEffect, useRef } from 'react';

const ScrollPayment = ({ webln }) => {
  const [enabled, setEnabled] = useState(false);
  const [stats, setStats] = useState({
    totalPaid: 0,
    scrollEvents: 0,
    lastPayment: null
  });
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef(null);
  const scrollAreaRef = useRef(null);

  // Handle scroll events
  useEffect(() => {
    if (!enabled || !scrollAreaRef.current) return;

    const handleScroll = () => {
      setStats(prev => ({
        ...prev,
        scrollEvents: prev.scrollEvents + 1
      }));

      // Debounce the payment to avoid too many payments
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        makeScrollPayment();
      }, 500);
    };

    const scrollArea = scrollAreaRef.current;
    scrollArea.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener('scroll', handleScroll);
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [enabled, webln]);

  const makeScrollPayment = async () => {
    if (loading || !webln) return;
    
    setLoading(true);
    
    try {
      // Mock recipient for demo - in a real app, this would be your node's info
      const invoice = await webln.makeInvoice({
        amount: 1,
        defaultMemo: 'Scroll payment - 1 sat'
      });
      
      await webln.sendPayment(invoice.paymentRequest);
      
      setStats(prev => ({
        ...prev,
        totalPaid: prev.totalPaid + 1,
        lastPayment: new Date().toLocaleTimeString()
      }));
    } catch (error) {
      console.error('Scroll payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleScrollPayment = () => {
    setEnabled(prev => !prev);
  };

  return (
    <div className="scroll-payment">
      <h2>Auto-Pay on Scroll</h2>
      
      <div className="toggle-container">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={enabled}
            onChange={toggleScrollPayment}
          />
          <span className="toggle-slider"></span>
        </label>
        <span>{enabled ? 'Enabled' : 'Disabled'}</span>
      </div>
      
      {enabled && (
        <>
          <div className="stats">
            <div>Scroll events: {stats.scrollEvents}</div>
            <div>Sats paid: {stats.totalPaid}</div>
            {stats.lastPayment && <div>Last payment: {stats.lastPayment}</div>}
          </div>
          
          <div 
            ref={scrollAreaRef}
            className="scroll-area"
          >
            <div className="scroll-content">
              <h3>Scroll to Pay</h3>
              <p>Each scroll event will trigger a 1 sat payment after a short delay.</p>
              <p>Keep scrolling to generate more payments!</p>
              <div className="spacing"></div>
              <p>The payment is debounced to prevent too many rapid payments.</p>
              <div className="spacing"></div>
              <p>In a real application, these payments could go to content creators or website owners.</p>
              <div className="spacing"></div>
              <p>This is a demonstration of value-for-attention microeconomics.</p>
              <div className="spacing"></div>
              <p>Keep scrolling...</p>
              <div className="spacing"></div>
              <p>Almost there...</p>
              <div className="spacing"></div>
              <p>One more scroll!</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScrollPayment;