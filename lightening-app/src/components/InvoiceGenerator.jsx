import React, { useState } from 'react';
import { SatsFiatConverter } from './SatsFiatConverter';

const InvoiceGenerator = ({ webln }) => {
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateInvoice = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setError(null);
    setInvoice(null);

    try {
      const response = await webln.makeInvoice({
        amount: parseInt(amount, 10),
        defaultMemo: memo || 'WebLN Demo Invoice'
      });

      setInvoice(response);
    } catch (err) {
      setError(`Failed to generate invoice: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Invoice copied to clipboard!');
  };

  return (
    <div className="invoice-generator">
      <h2>Generate Invoice</h2>
      
      <form onSubmit={generateInvoice}>
        <div className="form-group">
          <label htmlFor="invoiceAmount">Amount (sats)</label>
          <SatsFiatConverter 
            satsValue={amount}
            onSatsChange={setAmount}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="memo">Memo (optional)</label>
          <input
            type="text"
            id="memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Payment for..."
          />
        </div>

        <button 
          type="submit" 
          className="primary-button"
          disabled={generating}
        >
          {generating ? 'Generating...' : 'Generate Invoice'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {invoice && (
        <div className="invoice-result">
          <h3>Invoice Generated</h3>
          
          {invoice.paymentRequest && (
            <>
              <div className="invoice-display">
                <textarea
                  readOnly
                  value={invoice.paymentRequest}
                />
              </div>
              
              <button 
                className="secondary-button"
                onClick={() => copyToClipboard(invoice.paymentRequest)}
              >
                Copy Invoice
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;