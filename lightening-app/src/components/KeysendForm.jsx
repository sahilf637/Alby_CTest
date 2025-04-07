import React, { useState } from 'react';
import { SatsFiatConverter } from './SatsFiatConverter';

const KeysendForm = ({ webln }) => {
  const [pubkey, setPubkey] = useState('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleKeysend = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setResult(null);

    try {
      if (!webln.keysend) {
        throw new Error('Keysend is not supported by your wallet');
      }

      const response = await webln.keysend({
        destination: pubkey,
        amount: parseInt(amount, 10),
        customRecords: {
          // 696969 is a commonly used TLV record type for keysend
          '696969': Buffer.from('WebLN Demo App').toString('hex')
        }
      });

      setResult({
        success: true,
        message: 'Keysend successful!',
        data: response
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Keysend failed: ${error.message}`
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="keysend-form">
      <h2>Keysend Payment</h2>
      
      <form onSubmit={handleKeysend}>
        <div className="form-group">
          <label htmlFor="pubkey">Recipient Public Key</label>
          <input
            type="text"
            id="pubkey"
            value={pubkey}
            onChange={(e) => setPubkey(e.target.value)}
            placeholder="03abc..."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="keysendAmount">Amount (sats)</label>
          <SatsFiatConverter 
            satsValue={amount}
            onSatsChange={setAmount}
          />
        </div>

        <button 
          type="submit" 
          className="primary-button"
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Keysend'}
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

export default KeysendForm;