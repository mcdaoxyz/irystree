import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { isMetaMaskInstalled, switchNetwork } from '../lib/rainbowkit-config';

export const useWallet = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);

  useEffect(() => {
    setIsMetaMaskAvailable(isMetaMaskInstalled());
  }, []);

  const switchToIrysNetwork = async () => {
    try {
      await switchNetwork('0x4f6'); // Hex chain ID for 1270
    } catch (error) {
      console.error('Error switching to Irys network:', error);
    }
  };

  return {
    address,
    isConnected,
    balance,
    isMetaMaskAvailable,
    switchToIrysNetwork,
  };
}; 