import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useIrysRainbowKit } from '../lib/irysRainbowKit';
import { LinktreeEditor } from './LinktreeEditor';
import { 
  Wallet, Database, Upload, Download, Coins, CheckCircle, AlertCircle, 
  FileText, Image, Video, Music, Archive, Zap, Globe, Settings,
  TrendingUp, Clock, DollarSign, Shield, Cpu, Edit
} from 'lucide-react';

export const IrysDemo: React.FC = () => {
  const {
    initializeIrys,
    uploadData,
    uploadFile,
    uploadProgrammableData,
    uploadBatch,
    getData,
    getBalance,
    fundAccount,
    estimateUploadCost,
    getUploadHistory,
    clearUploadHistory,
    isInitialized,
    walletAddress,
    isConnected
  } = useIrysRainbowKit();

  const [uploadText, setUploadText] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [retrievedData, setRetrievedData] = useState('');
  const [balance, setBalance] = useState('0');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);
  const [estimatedCost, setEstimatedCost] = useState('0');
  const [programmableDataEnabled, setProgrammableDataEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'upload' | 'retrieve' | 'files' | 'analytics' | 'editor'>('upload');

  useEffect(() => {
    if (isConnected && isInitialized) {
      loadBalance();
      loadUploadHistory();
    }
  }, [isConnected, isInitialized]);

  const loadBalance = async () => {
    try {
      const bal = await getBalance();
      setBalance(bal);
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  const loadUploadHistory = async () => {
    try {
      const history = await getUploadHistory();
      setUploadHistory(history);
    } catch (error) {
      console.error('Failed to load upload history:', error);
    }
  };

  const handleInitialize = async () => {
    try {
      setStatus('loading');
      setStatusMessage('Initializing Irys with Programmable Data support...');
      await initializeIrys();
      setStatus('success');
      setStatusMessage('Irys initialized successfully with enhanced features!');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setStatusMessage(`Failed to initialize: ${error.message}`);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleUpload = async () => {
    if (!uploadText.trim()) return;
    
    try {
      setStatus('loading');
      setStatusMessage('Uploading to Irys with Programmable Data...');
      
      const result = await uploadData(uploadText, [
        { name: 'Type', value: 'demo' },
        { name: 'Timestamp', value: new Date().toISOString() },
        { name: 'Features', value: 'programmable-data,compression,analytics' }
      ], programmableDataEnabled);
      
      setTransactionId(result.transactionId);
      setStatus('success');
      setStatusMessage(`Data uploaded successfully! Cost: ${result.cost} ETH`);
      setTimeout(() => setStatus('idle'), 3000);
      
      // Refresh upload history
      await loadUploadHistory();
    } catch (error) {
      setStatus('error');
      setStatusMessage(`Upload failed: ${error.message}`);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      setStatus('loading');
      setStatusMessage(`Uploading ${selectedFiles.length} file(s) to Irys...`);
      
      if (selectedFiles.length === 1) {
        const result = await uploadFile(selectedFiles[0], [
          { name: 'Type', value: 'file-upload' },
          { name: 'Timestamp', value: new Date().toISOString() }
        ]);
        setTransactionId(result.transactionId);
        setStatus('success');
        setStatusMessage(`File uploaded successfully! Cost: ${result.cost} ETH`);
      } else {
        const results = await uploadBatch(selectedFiles, [
          { name: 'Type', value: 'batch-upload' },
          { name: 'Timestamp', value: new Date().toISOString() }
        ]);
        setTransactionId(results[0]?.transactionId || '');
        setStatus('success');
        setStatusMessage(`${results.length} files uploaded successfully!`);
      }
      
      setTimeout(() => setStatus('idle'), 3000);
      setSelectedFiles([]);
      await loadUploadHistory();
    } catch (error) {
      setStatus('error');
      setStatusMessage(`File upload failed: ${error.message}`);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleProgrammableDataUpload = async () => {
    if (!uploadText.trim()) return;
    
    try {
      setStatus('loading');
      setStatusMessage('Uploading Programmable Data to Irys...');
      
      const result = await uploadProgrammableData(uploadText, [
        { name: 'Type', value: 'programmable-data' },
        { name: 'Smart-Contract-Ready', value: 'true' },
        { name: 'Timestamp', value: new Date().toISOString() }
      ]);
      
      setTransactionId(result.transactionId);
      setStatus('success');
      setStatusMessage(`Programmable Data uploaded successfully! Cost: ${result.cost} ETH`);
      setTimeout(() => setStatus('idle'), 3000);
      
      await loadUploadHistory();
    } catch (error) {
      setStatus('error');
      setStatusMessage(`Programmable Data upload failed: ${error.message}`);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleRetrieve = async () => {
    if (!transactionId.trim()) return;
    
    try {
      setStatus('loading');
      setStatusMessage('Retrieving from Irys...');
      const data = await getData(transactionId);
      if (data) {
        setRetrievedData(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
        setStatus('success');
        setStatusMessage('Data retrieved successfully!');
      } else {
        setStatus('error');
        setStatusMessage('No data found for this transaction ID');
      }
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setStatusMessage(`Retrieval failed: ${error.message}`);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleGetBalance = async () => {
    try {
      setStatus('loading');
      setStatusMessage('Getting balance...');
      const bal = await getBalance();
      setBalance(bal);
      setStatus('success');
      setStatusMessage(`Balance: ${bal} ETH`);
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setStatusMessage(`Failed to get balance: ${error.message}`);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleFund = async () => {
    try {
      setStatus('loading');
      setStatusMessage('Funding account...');
      await fundAccount('0.01');
      await handleGetBalance();
      setStatus('success');
      setStatusMessage('Account funded successfully!');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setStatusMessage(`Funding failed: ${error.message}`);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleEstimateCost = async () => {
    if (!uploadText.trim()) return;
    
    try {
      const cost = await estimateUploadCost(uploadText.length);
      setEstimatedCost(cost);
    } catch (error) {
      console.error('Failed to estimate cost:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (fileType.startsWith('audio/')) return <Music className="w-4 h-4" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Irys + RainbowKit Enhanced Demo</h2>
        <p className="text-gray-600">Test decentralized storage with Irys Programmable Data and advanced features</p>
      </div>

      {/* Status Bar */}
      {status !== 'idle' && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          status === 'success' ? 'bg-green-100 text-green-800' :
          status === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {status === 'loading' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>}
          {status === 'success' && <CheckCircle className="w-4 h-4" />}
          {status === 'error' && <AlertCircle className="w-4 h-4" />}
          <span className="font-medium">{statusMessage}</span>
        </div>
      )}

      {/* Wallet Connection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Wallet Connection</h4>
          <Wallet className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              {isConnected ? 'Wallet Connected' : 'Connect your wallet to use Irys'}
            </p>
            {isConnected && walletAddress && (
              <p className="text-sm text-gray-500 font-mono">
                {formatAddress(walletAddress)}
              </p>
            )}
          </div>
          <ConnectButton />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'upload', label: 'Upload', icon: Upload },
            { id: 'retrieve', label: 'Retrieve', icon: Download },
            { id: 'files', label: 'File Upload', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'editor', label: 'Linktree Editor', icon: Edit }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Text Upload */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold text-gray-900">Text Upload</h4>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data to Upload
                  </label>
                  <textarea
                    value={uploadText}
                    onChange={(e) => setUploadText(e.target.value)}
                    placeholder="Enter text to upload to Irys..."
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!isConnected}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="programmableData"
                    checked={programmableDataEnabled}
                    onChange={(e) => setProgrammableDataEnabled(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="programmableData" className="text-sm text-gray-700">
                    Enable Programmable Data
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleEstimateCost}
                    disabled={!isConnected || !uploadText.trim()}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    Estimate Cost
                  </button>
                  {estimatedCost !== '0' && (
                    <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm">
                      ~{estimatedCost} ETH
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleUpload}
                    disabled={!isConnected || !uploadText.trim() || status === 'loading'}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    Upload to Irys
                  </button>
                  <button
                    onClick={handleProgrammableDataUpload}
                    disabled={!isConnected || !uploadText.trim() || status === 'loading'}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    title="Upload as Programmable Data for smart contract integration"
                  >
                    <Cpu className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Features Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold text-gray-900">Enhanced Features</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                    <Cpu className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-purple-900">Programmable Data</p>
                      <p className="text-xs text-purple-700">Smart contract compatible storage</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Archive className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Compression</p>
                      <p className="text-xs text-blue-700">Automatic data compression</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <Shield className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Fault Tolerance</p>
                      <p className="text-xs text-green-700">High availability & integrity</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                    <Globe className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">Global Network</p>
                      <p className="text-xs text-orange-700">Decentralized storage network</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'retrieve' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Download className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold text-gray-900">Retrieve from Irys</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={handleRetrieve}
                disabled={!transactionId.trim() || status === 'loading'}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Retrieve Data
              </button>

              {retrievedData && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retrieved Data
                  </label>
                  <textarea
                    value={retrievedData}
                    readOnly
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-green-500" />
              <h4 className="font-semibold text-gray-900">File Upload</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Files
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isConnected}
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      {getFileIcon(file.type)}
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={handleFileUpload}
                disabled={selectedFiles.length === 0 || status === 'loading' || !isConnected}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Upload {selectedFiles.length > 0 ? `${selectedFiles.length} File(s)` : 'Files'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <h4 className="font-semibold text-gray-900">Upload Analytics</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 mb-1">Total Uploads</p>
                <p className="text-2xl font-bold text-blue-900">{uploadHistory.length}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 mb-1">Total Cost</p>
                <p className="text-2xl font-bold text-green-900">
                  {uploadHistory.reduce((sum, item) => sum + parseFloat(item.cost), 0).toFixed(4)} ETH
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 mb-1">Total Size</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatFileSize(uploadHistory.reduce((sum, item) => sum + item.size, 0))}
                </p>
              </div>
            </div>

            {uploadHistory.length > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-700">Recent Uploads</p>
                  <button
                    onClick={clearUploadHistory}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear History
                  </button>
                </div>
                {uploadHistory.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.transactionId.slice(0, 10)}...
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{item.cost} ETH</p>
                      <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No upload history available</p>
            )}
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Linktree Editor</h3>
              <p className="opacity-90">Create and customize your Linktree with drag-and-drop functionality.</p>
            </div>
            
            <LinktreeEditor
              onSave={(data) => {
                console.log('Linktree data saved:', data);
              }}
              onUpload={async (data) => {
                if (!isInitialized) {
                  throw new Error('Irys not initialized');
                }
                
                const dataString = JSON.stringify(data);
                const result = await uploadData(dataString, [
                  { name: 'Content-Type', value: 'application/json' },
                  { name: 'App-Name', value: 'IrysLinktree' },
                  { name: 'Data-Type', value: 'linktree' },
                  { name: 'Username', value: data.username || 'anonymous' }
                ]);
                
                return result.transactionId;
              }}
              className="bg-white rounded-lg border border-gray-200"
            />
          </div>
        )}
      </div>

      {/* Balance and Funding */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-purple-500" />
          <h4 className="font-semibold text-gray-900">Irys Account Management</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Current Balance</p>
            <p className="text-2xl font-bold text-purple-600">{parseFloat(balance).toFixed(4)} ETH</p>
          </div>
          
          <button
            onClick={handleGetBalance}
            disabled={!isConnected || status === 'loading'}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            Refresh Balance
          </button>
          
          <button
            onClick={handleFund}
            disabled={!isConnected || status === 'loading'}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Coins className="w-4 h-4" />
            Fund Account (0.01 ETH)
          </button>

          <button
            onClick={handleInitialize}
            disabled={!isConnected || status === 'loading'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Initialize Irys
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6 mt-6">
        <h4 className="font-semibold text-blue-900 mb-3">How to Use Enhanced Features</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
          <li>Connect your wallet using the ConnectButton above</li>
          <li>Make sure you have some Sepolia testnet ETH in your wallet</li>
          <li>Fund your Irys account with the "Fund Account" button</li>
          <li>Try different upload types: Text, Files, or Programmable Data</li>
          <li>Use the Analytics tab to track your uploads and costs</li>
          <li>Your data is now permanently stored on the decentralized Irys network!</li>
        </ol>
        
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>New Features:</strong> Programmable Data support, file uploads, batch processing, 
            cost estimation, upload analytics, and enhanced metadata tracking.
          </p>
        </div>
      </div>
    </div>
  );
};