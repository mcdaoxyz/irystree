import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletTest() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Wallet Connection Test</h1>
      <p className="mb-4">Click the button below to test the wallet connection modal:</p>
      
      <ConnectButton />
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          <li>Click the "Connect Wallet" button above</li>
          <li>A modal should appear with wallet options</li>
          <li>You should see MetaMask, Rainbow, Coinbase Wallet, and WalletConnect</li>
          <li>The modal should have a "Learn More" link at the bottom</li>
        </ul>
      </div>
    </div>
  );
}

export default WalletTest; 