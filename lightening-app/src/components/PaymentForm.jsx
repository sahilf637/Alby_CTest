import React, { useState } from 'react';
import { SatsFiatConverter } from './SatsFiatConverter';

const PaymentForm = ({ webln }) => {
  const [invoice, setInvoice] = useState('');
  const [amount, setAmount] = useState('');
  const [lnAddress, setLnAddress] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('invoice');

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setResult(null);

    try {
      let response;
      
      if (paymentMethod === 'invoice') {
        response = await webln.sendPayment(invoice);
      } else {
        if (!lnAddress) {
          throw new Error('Lightning address is required');
        }

        if (!amount || isNaN(amount) || amount <= 0) {
          throw new Error('Valid amount is required');
        }

        // For ln address, we'd typically need a backend service to resolve it
        // This is simplified for the demo
        const resolved = await resolveLnAddress(lnAddress);
        response = await webln.sendPayment(resolved);
      }

      setResult({
        success: true,
        message: 'Payment successful!',
        data: response
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Payment failed: ${error.message}`
      });
    } finally {
      setProcessing(false);
    }
  };

  // Simplified mock function - in a real app this would call a backend service
  const resolveLnAddress = async (address) => {
    // This is a placeholder - in a real app, you would resolve the ln address 
    // to get an invoice from a backend service
    throw new Error('LN Address resolution requires a backend service');
  };

  return (
    <div className="payment-form">
      <h2>Send Payment</h2>
      
      <div className="tabs">
        <button 
          className={paymentMethod === 'invoice' ? 'active' : ''} 
          onClick={() => setPaymentMethod('invoice')}
        >
          Invoice
        </button>
        <button 
          className={paymentMethod === 'lnaddress' ? 'active' : ''} 
          onClick={() => setPaymentMethod('lnaddress')}
        >
          LN Address
        </button>
      </div>

      <form onSubmit={handlePayment}>
        {paymentMethod === 'invoice' ? (
          <div className="form-group">
            <label htmlFor="invoice">Lightning Invoice</label>
            <textarea
              id="invoice"
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              placeholder="lnbc..."
              required
            />
          </div>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="lnAddress">Lightning Address</label>
              <input
                type="text"
                id="lnAddress"
                value={lnAddress}
                onChange={(e) => setLnAddress(e.target.value)}
                placeholder="user@domain.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount (sats)</label>
              <SatsFiatConverter 
                satsValue={amount}
                onSatsChange={setAmount}
              />
            </div>
          </>
        )}

        <button 
          type="submit" 
          className="primary-button"
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Pay'}
        </button>
      </form>

      {result && (
        <div className={`result ${result.success ? 'success' : 'error'}`}>
          <p>{result.message}</p>
          {result.data && (
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentForm;