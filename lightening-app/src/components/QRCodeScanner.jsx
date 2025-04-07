import React, { useState, useRef } from 'react';
import QrScanner from 'qr-scanner'; // You would need to install this package

const QRCodeScanner = ({ webln }) => {
  const [scanning, setScanning] = useState(false);
  const [invoice, setInvoice] = useState('');
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  const startScanner = async () => {
    setScanning(true);
    setError(null);
    
    try {
      if (!videoRef.current) return;
      
      scannerRef.current = new QrScanner(
        videoRef.current,
        result => {
          handleScan(result.data);
          stopScanner();
        },
        { returnDetailedScanResult: true }
      );
      
      await scannerRef.current.start();
    } catch (err) {
      setError(`Failed to start camera: ${err.message}`);
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const handleScan = async (data) => {
    if (!data) return;
    
    setInvoice(data);
    
    // Check if it's a Lightning invoice
    if (data.startsWith('lnbc')) {
      try {
        const response = await webln.sendPayment(data);
        setPayment({
          success: true,
          data: response
        });
      } catch (err) {
        setError(`Payment failed: ${err.message}`);
      }
    } else {
      setError('Invalid Lightning invoice format');
    }
  };

  return (
    <div className="qr-scanner">
      <h2>QR Code Scanner</h2>
      
      {!scanning ? (
        <button 
          onClick={startScanner} 
          className="primary-button"
        >
          Scan QR Code
        </button>
      ) : (
        <>
          <div className="video-container">
            <video ref={videoRef} />
          </div>
          <button 
            onClick={stopScanner} 
            className="secondary-button"
          >
            Cancel
          </button>
        </>
      )}
      
      {error && <p className="error">{error}</p>}
      
      {invoice && !scanning && (
        <div className="scan-result">
          <h3>Scanned Invoice</h3>
          <div className="invoice-display">
            <textarea 
              readOnly 
              value={invoice} 
            />
          </div>
        </div>
      )}
      
      {payment && (
        <div className="payment-result success">
          <h3>Payment Successful!</h3>
          <pre>{JSON.stringify(payment.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;