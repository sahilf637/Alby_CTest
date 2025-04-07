import { useState, useEffect } from 'react';

export function useWebln() {
  const [webln, setWebln] = useState(null);
  const [weblnEnabled, setWeblnEnabled] = useState(false);

  useEffect(() => {
    const checkWebln = async () => {
      if (typeof window.webln !== 'undefined') {
        try {
          await window.webln.enable();
          setWebln(window.webln);
          setWeblnEnabled(true);
        } catch (error) {
          console.error('Error enabling WebLN:', error);
        }
      }
    };

    checkWebln();
  }, []);

  const enableWebln = async () => {
    if (typeof window.webln !== 'undefined') {
      try {
        await window.webln.enable();
        setWebln(window.webln);
        setWeblnEnabled(true);
      } catch (error) {
        console.error('Error enabling WebLN:', error);
        alert('Failed to connect to WebLN provider. Make sure you have a compatible wallet extension installed.');
      }
    } else {
      alert('WebLN is not available. Please install a compatible Lightning wallet extension.');
    }
  };

  return { webln, weblnEnabled, enableWebln };
}