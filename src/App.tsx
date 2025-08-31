import { useState, useEffect } from 'react';
import { IrysLinktree, LinktreeData, SocialLink, PRESET_THEMES, Link as LinkInterface, generateId, createEmptyLink, createEmptySocialLink } from './lib/irys-minimal';
import { ConnectWallet } from './components/ConnectWallet';
import { LinktreeDisplay } from './components/LinktreeDisplay';
import { AdminDashboard } from './components/AdminDashboard';
import { TextEditor } from './components/TextEditor';
import { ProfilePage } from './components/ProfilePage';
import ThreeBackground from './components/ThreeBackground';
import './animations.css';
import { 
  Plus, Edit3, Save, X, Instagram, Twitter, Linkedin, Youtube, Github, Globe, Eye, Settings, Copy, Check, ExternalLink, FileText, User, Wallet, ChevronDown
} from 'lucide-react';

function App() {
  const [linktreeData, setLinktreeData] = useState<LinktreeData>({
    username: 'irys',
    displayName: 'Irys Network',
    bio: '🌐 The Programmable Data Layer for Web3 | Permanent, Scalable, and Decentralized Data Storage Solutions | Building the Future of Data Permanence',
    avatar: 'https://pbs.twimg.com/profile_images/1598693298764165120/8cCXobQh_400x400.jpg',
    contactInfo: {
      email: 'hello@irys.xyz',
      website: 'https://irys.xyz'
    },
    location: {
      city: 'Global',
      country: 'Worldwide'
    },
    links: [
      {
        id: generateId(),
        title: '🌍 Official Website',
        url: 'https://irys.xyz',
        active: true,
        order: 0,
        clicks: 1247,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: '📚 Documentation Hub',
        url: 'https://docs.irys.xyz',
        active: true,
        order: 1,
        clicks: 892,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: '🚀 Developer SDK & Tools',
        url: 'https://docs.irys.xyz/developer-docs/irys-sdk',
        active: true,
        order: 2,
        clicks: 634,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: '💡 Use Cases & Examples',
        url: 'https://docs.irys.xyz/overview/use-cases',
        active: true,
        order: 3,
        clicks: 456,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: '🔧 API Reference',
        url: 'https://docs.irys.xyz/developer-docs/api',
        active: true,
        order: 4,
        clicks: 321,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: '📖 Blog & Updates',
        url: 'https://irys.xyz/blog',
        active: true,
        order: 5,
        clicks: 789,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: '💬 Join Discord Community',
        url: 'https://discord.gg/irys',
        active: true,
        order: 6,
        clicks: 567,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: '🎯 Careers at Irys',
        url: 'https://irys.xyz/careers',
        active: true,
        order: 7,
        clicks: 234,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: '🏗️ Irys Explorer',
        url: 'https://devnet.irys.xyz',
        active: true,
        order: 8,
        clicks: 445,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: '📊 Network Status',
        url: 'https://status.irys.xyz',
        active: true,
        order: 9,
        clicks: 178,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: '🎓 Learning Resources',
        url: 'https://docs.irys.xyz/learn',
        active: true,
        order: 10,
        clicks: 356,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: '🔐 Security & Audits',
        url: 'https://irys.xyz/security',
        active: true,
        order: 11,
        clicks: 123,
        createdAt: new Date().toISOString()
      }
    ],
    socialLinks: [
      {
        platform: 'twitter',
        url: 'https://twitter.com/irys_xyz'
      },
      {
        platform: 'github',
        url: 'https://github.com/irys-xyz'
      },
      {
        platform: 'linkedin',
        url: 'https://linkedin.com/company/irys-xyz'
      },
      {
        platform: 'youtube',
        url: 'https://youtube.com/@irys_xyz'
      }
    ],
    theme: PRESET_THEMES.irys,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'linktree' | 'admin' | 'text-editor' | 'profile'>('linktree');
  const [savedTransactionId, setSavedTransactionId] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const irysLinktree = new IrysLinktree();

  useEffect(() => {
    initializeIrys();
  }, []);

  const initializeIrys = async () => {
    try {
      setIsLoading(true);
      await irysLinktree.initialize();
      
      const balance = await irysLinktree.getBalance();
      setBalance(balance);
    } catch (error) {
      console.error('Failed to initialize Irys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!linktreeData.username.trim()) {
      alert('Please enter a username');
      return;
    }

    setIsLoading(true);
    try {
      const result = await irysLinktree.uploadLinktree(linktreeData);
      console.log('Linktree saved:', result);
      setSavedTransactionId(typeof result === 'string' ? result : (result as { id: string }).id);
      setShowSuccessMessage(true);
      setIsEditing(false);
      
      // Hide success message after 10 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
    } catch (error) {
      console.error('Error saving linktree:', error);
      alert('Failed to save linktree. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addLink = () => {
    const newLink = createEmptyLink();
    newLink.order = linktreeData.links.length;
    setLinktreeData(prev => ({
      ...prev,
      links: [...prev.links, newLink]
    }));
  };

  const updateLink = (index: number, field: keyof LinkInterface, value: string | boolean | number) => {
    setLinktreeData(prev => ({
      ...prev,
      links: prev.links.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeLink = (index: number) => {
    setLinktreeData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const addSocialLink = () => {
    const newSocialLink = createEmptySocialLink();
    setLinktreeData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newSocialLink]
    }));
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    setLinktreeData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeSocialLink = (index: number) => {
    setLinktreeData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram size={20} />;
      case 'twitter': return <Twitter size={20} />;
      case 'linkedin': return <Linkedin size={20} />;
      case 'youtube': return <Youtube size={20} />;
      case 'github': return <Github size={20} />;
      default: return <Globe size={20} />;
    }
  };

  const loadLinktree = async () => {
    if (!transactionId) return;
    
    try {
      setIsLoading(true);
      const data = await irysLinktree.getLinktree(transactionId);
      if (data) {
        setLinktreeData(data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to load linktree:', error);
      alert('Failed to load linktree. Please check the transaction ID.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuSelect = (menu: string) => {
    setActiveTab(menu as any);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 relative">
      {/* 3D Background */}
      <ThreeBackground />
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌿</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Irys Linktree</h1>
              </div>
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
                <span>•</span>
                <span>Decentralized</span>
                <span>•</span>
                <span>Minimalist</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Network Selector */}
              <button className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 hover:border-gray-400 transition-colors flex items-center gap-2">
                <span>Irys Testnet</span>
                <ChevronDown size={14} />
              </button>
              
              {/* Wallet Connection */}
              <ConnectWallet 
                onWalletConnected={(address) => {
                  console.log('Wallet connected:', address);
                  setIsWalletConnected(true);
                  // Reinitialize Irys with connected wallet
                  initializeIrys();
                }}
                onWalletDisconnected={() => {
                  console.log('Wallet disconnected');
                  setIsWalletConnected(false);
                  setBalance('0');
                }}
                onMenuSelect={handleMenuSelect}
                className=""
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Transaction ID Display */}
        {transactionId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 text-sm font-medium">
                  <strong>Transaction ID:</strong> {transactionId}
                </p>
                <a
                  href={`https://devnet.irys.xyz/${transactionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 text-sm underline"
                >
                  View on Irys Explorer →
                </a>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(transactionId)}
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm"
              >
                Copy ID
              </button>
            </div>
          </div>
        )}

        {/* Load Linktree Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Load Existing Linktree</h3>
          <div className="space-y-3">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter Transaction ID or Arweave URL"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="flex-1 bg-gray-50 text-gray-900 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={loadLinktree}
                disabled={isLoading || !transactionId.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white disabled:opacity-50 flex items-center gap-2 button-press hover-lift disabled:hover:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </>
                ) : (
                  'Load'
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Enter a transaction ID (e.g., "abc123...") or full Arweave URL to load an existing Linktree from the blockchain.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && savedTransactionId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mx-4 mt-4 success-slide-down">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-800">
                  Linktree berhasil disimpan ke blockchain!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p className="mb-2">Linktree Anda sekarang tersedia secara permanen di Arweave blockchain:</p>
                  <div className="bg-white rounded border border-green-200 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-2">
                        <p className="text-xs text-gray-500 mb-1">Transaction ID:</p>
                        <p className="font-mono text-sm break-all">{savedTransactionId}</p>
                        <p className="text-xs text-gray-500 mt-1">Arweave URL:</p>
                        <p className="font-mono text-sm break-all">https://arweave.net/{savedTransactionId}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => copyToClipboard(`https://arweave.net/${savedTransactionId}`)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1 button-press hover-lift"
                        >
                          {copiedUrl ? <Check size={12} /> : <Copy size={12} />}
                          {copiedUrl ? 'Copied!' : 'Copy'}
                        </button>
                        <a
                          href={`https://arweave.net/${savedTransactionId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                        >
                          <ExternalLink size={12} />
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="flex-shrink-0 text-green-400 hover:text-green-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Main Content - Show different content based on active tab */}
        <div className="transition-all duration-300 ease-in-out">
          {activeTab === 'linktree' && (
            <div className="w-full animate-fade-in">
              <LinktreeDisplay data={linktreeData} />
            </div>
          )}
          
          {activeTab === 'admin' && (
             <div className="w-full animate-fade-in">
               <AdminDashboard 
                 data={linktreeData}
                 onDataChange={setLinktreeData}
                 onSave={handleSave}
                 isLoading={isLoading}
               />
             </div>
          )}
          
          {activeTab === 'text-editor' && (
            <div className="w-full animate-fade-in">
              <TextEditor 
                data={linktreeData}
                onDataChange={setLinktreeData}
                onSave={handleSave}
              />
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div className="w-full animate-fade-in">
              <ProfilePage 
                linktreeData={linktreeData}
                onDataChange={setLinktreeData}
                onSave={handleSave}
              />
            </div>
          )}
          
          {activeTab === 'preview' && (
            <div className="w-full animate-fade-in">
              <LinktreeDisplay data={linktreeData} />
            </div>
          )}
          
          {activeTab === 'editor' && (
            <div className="w-full animate-fade-in">
              <AdminDashboard 
                data={linktreeData}
                onDataChange={setLinktreeData}
                onSave={handleSave}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;