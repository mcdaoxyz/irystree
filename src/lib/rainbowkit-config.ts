import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains';
import { defineChain } from 'viem';

// Define Irys Testnet chain
export const irysTestnet = defineChain({
  id: 1270,
  name: 'Irys Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IRYS',
    symbol: 'IRYS',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.irys.xyz/v1/execution-rpc'],
    },
    public: {
      http: ['https://testnet-rpc.irys.xyz/v1/execution-rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Irys Explorer',
      url: 'https://explorer.irys.xyz',
    },
  },
  testnet: true,
});

// RainbowKit configuration following the Medium article approach
export const rainbowkitConfig = getDefaultConfig({
  appName: 'Irys Linktree',
  projectId: process.env.VITE_WALLETCONNECT_PROJECT_ID || '2f5a2129b3b8c8b8f8f8f8f8f8f8f8f8f8',
  chains: [
    irysTestnet,
    mainnet,
    sepolia,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
  ],
  ssr: false,
});

// Enhanced wallet connection utilities
export const getConnectedAddress = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts[0] || null;
    } catch (error) {
      console.error('Error getting connected address:', error);
      return null;
    }
  }
  return null;
};

export const connectWallet = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0] || null;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
    }
  }
  return null;
};

export const disconnectWallet = async () => {
  // Note: Most wallets don't support programmatic disconnection
  // This is typically handled by the wallet itself
  console.log('Wallet disconnection requested');
};

// Check if wallet is connected
export const isWalletConnected = async (): Promise<boolean> => {
  const address = await getConnectedAddress();
  return !!address;
};

// Get wallet balance
export const getWalletBalance = async (address: string): Promise<string> => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      // Convert from wei to ETH
      return (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return '0';
    }
  }
  return '0';
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  if (typeof window !== 'undefined') {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  }
  return false;
};

// Switch to specific network
export const switchNetwork = async (chainId: string) => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error: any) {
      // If the network doesn't exist, add it
      if (error.code === 4902) {
        await addNetwork(chainId);
      }
    }
  }
};

// Add network to MetaMask
export const addNetwork = async (chainId: string) => {
  if (typeof window !== 'undefined' && window.ethereum) {
    const networkConfig = {
      chainId,
      chainName: 'Irys Testnet',
      nativeCurrency: {
        name: 'IRYS',
        symbol: 'IRYS',
        decimals: 18,
      },
      rpcUrls: ['https://testnet-rpc.irys.xyz/v1/execution-rpc'],
      blockExplorerUrls: ['https://explorer.irys.xyz'],
    };

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig],
      });
    } catch (error) {
      console.error('Error adding network:', error);
    }
  }
};