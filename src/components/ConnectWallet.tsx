import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { Wallet, WalletIcon, ChevronDown, Copy, ExternalLink, AlertCircle, CheckCircle, Download, Settings, User, FileText, Edit3 } from 'lucide-react';
import { isMetaMaskInstalled, switchNetwork, addNetwork } from '../lib/rainbowkit-config';
import './ConnectWallet.css';

interface ConnectWalletProps {
  onWalletConnected?: (address: string) => void;
  onWalletDisconnected?: () => void;
  onMenuSelect?: (menu: string) => void;
  className?: string;
}

export function ConnectWallet({ 
  onWalletConnected, 
  onWalletDisconnected, 
  onMenuSelect,
  className = '' 
}: ConnectWalletProps) {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);
  const [showMetaMaskPrompt, setShowMetaMaskPrompt] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Check if MetaMask is installed
  useEffect(() => {
    if (!isMetaMaskInstalled()) {
      setShowMetaMaskPrompt(true);
    }
  }, []);

  // Notify parent component when wallet connection changes
  useEffect(() => {
    if (isConnected && address && onWalletConnected) {
      onWalletConnected(address);
    } else if (!isConnected && onWalletDisconnected) {
      onWalletDisconnected();
    }
  }, [isConnected, address, onWalletConnected, onWalletDisconnected]);

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy address:', error);
      }
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleSwitchToIrysNetwork = async () => {
    try {
      await switchNetwork('0x4f6'); // Hex chain ID for 1270
    } catch (error) {
      console.error('Error switching network:', error);
    }
  };

  const installMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  const handleMenuSelect = (menu: string) => {
    setShowMenu(false);
    if (onMenuSelect) {
      onMenuSelect(menu);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.wallet-dropdown-container')) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className={`flex items-center ${className}`}>
      {/* MetaMask Installation Prompt */}
      {showMetaMaskPrompt && !isConnected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                MetaMask Required
              </h3>
              <p className="text-gray-600 mb-6">
                To use this dApp, you need to install MetaMask wallet extension.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={installMetaMask}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Install MetaMask
                </button>
                <button
                  onClick={() => setShowMetaMaskPrompt(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConnectButton.Custom>
        {({
          account,
          chain: rainbowChain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            rainbowChain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="wallet-connect-button"
                    >
                      <WalletIcon size={20} />
                      Connect Wallet
                    </button>
                  );
                }

                if (rainbowChain.unsupported) {
                  return (
                    <div className="flex items-center gap-3">
                    <button
                      onClick={openChainModal}
                      type="button"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200"
                      >
                        <AlertCircle size={16} />
                        Wrong Network
                      </button>
                      <button
                        onClick={() => disconnect()}
                        type="button"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                      >
                        Disconnect
                    </button>
                    </div>
                  );
                }

                return (
                  <div className="flex items-center gap-3">
                    {/* Chain Selector */}
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="chain-selector"
                    >
                      {rainbowChain.hasIcon && (
                        <div className="chain-icon">
                          {rainbowChain.iconUrl && (
                            <img
                              alt={rainbowChain.name ?? 'Chain icon'}
                              src={rainbowChain.iconUrl}
                            />
                          )}
                        </div>
                      )}
                      <span className="font-medium">{rainbowChain.name}</span>
                      <ChevronDown size={14} />
                    </button>

                    {/* Account Button with Enhanced Dropdown */}
                    <div className="relative wallet-dropdown-container">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                      type="button"
                        className="wallet-connect-button"
                    >
                      <Wallet size={16} />
                      <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">
                            {formatAddress(account.address)}
                        </span>
                        {balance && (
                            <span className="text-xs opacity-90">
                            {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                          </span>
                        )}
                      </div>
                        <ChevronDown size={14} />
                      </button>

                      {/* Enhanced Menu Dropdown */}
                      {showMenu && (
                        <div className="account-dropdown show">
                          <div className="account-dropdown-header">
                            <span className="text-sm font-medium text-gray-900">Menu</span>
                            <CheckCircle size={16} className="text-green-500" />
                          </div>
                          
                          <div className="account-dropdown-content">
                            <div className="account-info">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">Address</span>
                                <button
                                  onClick={copyAddress}
                                  className="text-purple-600 hover:text-purple-700 transition-colors"
                                >
                                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                                </button>
                              </div>
                              <p className="account-address">
                                {formatAddress(account.address)}
                              </p>
                            </div>

                            {balance && (
                              <div className="account-info">
                                <span className="text-xs text-gray-600">Balance</span>
                                <p className="account-balance">
                                  {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                                </p>
                              </div>
                            )}

                            <div className="account-actions">
                              {/* Menu Options */}
                              <button
                                onClick={() => handleMenuSelect('editor')}
                                className="account-action-button"
                              >
                                <Settings size={14} />
                                Editor
                              </button>
                              
                              <button
                                onClick={() => handleMenuSelect('text-editor')}
                                className="account-action-button"
                              >
                                <FileText size={14} />
                                Text Editor
                              </button>
                              
                              <button
                                onClick={() => handleMenuSelect('profile')}
                                className="account-action-button"
                              >
                                <User size={14} />
                                Profile
                              </button>
                              
                              <button
                                onClick={() => handleMenuSelect('preview')}
                                className="account-action-button"
                              >
                                <Edit3 size={14} />
                                Preview
                              </button>
                              
                              <button
                                onClick={() => handleMenuSelect('admin')}
                                className="account-action-button"
                              >
                                <Settings size={14} />
                                Admin
                              </button>

                              <hr className="my-2 border-gray-200" />
                              
                              <button
                                onClick={() => window.open(`https://explorer.irys.xyz/address/${account.address}`, '_blank')}
                                className="account-action-button"
                              >
                                <ExternalLink size={14} />
                                View on Explorer
                              </button>
                              
                              {rainbowChain.id !== 1270 && (
                                <button
                                  onClick={handleSwitchToIrysNetwork}
                                  className="account-action-button"
                                >
                                  <AlertCircle size={14} />
                                  Switch to Irys Network
                                </button>
                              )}
                              
                              <button
                                onClick={() => disconnect()}
                                className="account-action-button danger"
                              >
                                <Wallet size={14} />
                                Disconnect
                    </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}

// Compact version for smaller spaces
export function ConnectWalletCompact({ 
  onWalletConnected, 
  onWalletDisconnected, 
  className = '' 
}: ConnectWalletProps) {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address && onWalletConnected) {
      onWalletConnected(address);
    } else if (!isConnected && onWalletDisconnected) {
      onWalletDisconnected();
    }
  }, [isConnected, address, onWalletConnected, onWalletDisconnected]);

  return (
    <div className={className}>
      <ConnectButton 
        showBalance={false}
        chainStatus="icon"
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
      />
    </div>
  );
}

export default ConnectWallet;