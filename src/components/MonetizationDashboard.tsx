import React, { useState, useEffect } from 'react';
import {
  DollarSign, CreditCard, Gift, TrendingUp, Plus, Edit3, Trash2,
  ExternalLink, Copy, Check, Settings, Users, Calendar,
  PieChart, BarChart3, Wallet, Link as LinkIcon, Target,
  ArrowUpRight, ArrowDownRight, Eye, EyeOff, Save, X,
  Shield, Coins, Zap, Lock, Unlock, Star, Crown, Gem,
  TrendingDown, RefreshCw, AlertCircle, CheckCircle, Clock, Percent
} from 'lucide-react';
import { LinktreeData, PaymentLink, DonationSettings, AffiliateLink } from '../lib/irys-minimal';

interface MonetizationDashboardProps {
  data: LinktreeData;
  onDataChange: (data: LinktreeData) => void;
}

interface NFTGate {
  id: string;
  name: string;
  contractAddress: string;
  tokenId?: string;
  minTokens: number;
  network: string;
  gatedLinks: string[];
  isActive: boolean;
  holders: number;
}

interface TokenSubscription {
  id: string;
  name: string;
  tokenAddress: string;
  pricePerMonth: number;
  currency: string;
  benefits: string[];
  subscribers: number;
  revenue: number;
  isActive: boolean;
}

interface DeFiPool {
  id: string;
  name: string;
  protocol: string;
  tokenPair: string;
  apy: number;
  tvl: number;
  userStaked: number;
  rewards: number;
  isActive: boolean;
}

interface CryptoPayment {
  id: string;
  name: string;
  walletAddress: string;
  supportedTokens: string[];
  qrCode: string;
  amount?: number;
  currency: string;
  isActive: boolean;
}

interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  averageTransaction: number;
  conversionRate: number;
}

export const MonetizationDashboard: React.FC<MonetizationDashboardProps> = ({
  data,
  onDataChange
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'nft' | 'subscriptions' | 'defi' | 'donations' | 'affiliates'>('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentLink | null>(null);
  const [editingAffiliate, setEditingAffiliate] = useState<AffiliateLink | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [nftGates, setNftGates] = useState<NFTGate[]>([
    {
      id: '1',
      name: 'Premium Content Access',
      contractAddress: '0x1234...5678',
      minTokens: 1,
      network: 'Ethereum',
      gatedLinks: ['Premium Blog', 'Exclusive Discord'],
      isActive: true,
      holders: 156
    },
    {
      id: '2',
      name: 'VIP Member Benefits',
      contractAddress: '0x9876...5432',
      minTokens: 5,
      network: 'Polygon',
      gatedLinks: ['VIP Chat', 'Early Access'],
      isActive: true,
      holders: 43
    }
  ]);
  const [tokenSubscriptions, setTokenSubscriptions] = useState<TokenSubscription[]>([
    {
      id: '1',
      name: 'Monthly Premium',
      tokenAddress: '0xabcd...efgh',
      pricePerMonth: 10,
      currency: 'USDC',
      benefits: ['Ad-free content', 'Priority support', 'Exclusive updates'],
      subscribers: 234,
      revenue: 2340,
      isActive: true
    },
    {
      id: '2',
      name: 'Creator Tier',
      tokenAddress: '0xijkl...mnop',
      pricePerMonth: 25,
      currency: 'ETH',
      benefits: ['All premium features', '1-on-1 calls', 'Custom content'],
      subscribers: 67,
      revenue: 1675,
      isActive: true
    }
  ]);
  const [defiPools, setDefiPools] = useState<DeFiPool[]>([
    {
      id: '1',
      name: 'Creator Token Pool',
      protocol: 'Uniswap V3',
      tokenPair: 'CREATOR/ETH',
      apy: 24.5,
      tvl: 125000,
      userStaked: 5000,
      rewards: 156.78,
      isActive: true
    },
    {
      id: '2',
      name: 'Yield Farm',
      protocol: 'SushiSwap',
      tokenPair: 'CREATOR/USDC',
      apy: 18.2,
      tvl: 89000,
      userStaked: 2500,
      rewards: 89.45,
      isActive: true
    }
  ]);
  const [cryptoPayments, setCryptoPayments] = useState<CryptoPayment[]>([
    {
      id: '1',
      name: 'Multi-Token Wallet',
      walletAddress: '0x742d35Cc6634C0532925a3b8D',
      supportedTokens: ['ETH', 'USDC', 'USDT', 'DAI'],
      qrCode: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=',
      currency: 'ETH',
      isActive: true
    }
  ]);

  // Mock payment stats - in real implementation, this would come from blockchain
  const paymentStats: PaymentStats = {
    totalRevenue: 12847.50,
    totalTransactions: 342,
    averageTransaction: 37.58,
    conversionRate: 2.8
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addPaymentLink = () => {
    const newPayment: PaymentLink = {
      id: Date.now().toString(),
      title: 'New Payment Link',
      url: '',
      amount: 0,
      currency: 'USD',
      description: '',
      active: true,
      createdAt: new Date().toISOString(),
      analytics: {
        clicks: 0,
        conversions: 0,
        revenue: 0
      }
    };
    
    const updatedData = {
      ...data,
      monetization: {
        ...data.monetization,
        paymentLinks: [...(data.monetization?.paymentLinks || []), newPayment]
      }
    };
    
    onDataChange(updatedData);
    setEditingPayment(newPayment);
    setShowPaymentModal(true);
  };

  const updatePaymentLink = (payment: PaymentLink) => {
    const updatedData = {
      ...data,
      monetization: {
        ...data.monetization,
        paymentLinks: data.monetization?.paymentLinks?.map(p => 
          p.id === payment.id ? payment : p
        ) || []
      }
    };
    
    onDataChange(updatedData);
  };

  const deletePaymentLink = (id: string) => {
    const updatedData = {
      ...data,
      monetization: {
        ...data.monetization,
        paymentLinks: data.monetization?.paymentLinks?.filter(p => p.id !== id) || []
      }
    };
    
    onDataChange(updatedData);
  };

  const addAffiliateLink = () => {
    const newAffiliate: AffiliateLink = {
      id: Date.now().toString(),
      title: 'New Affiliate Link',
      url: '',
      originalUrl: '',
      affiliateUrl: '',
      commission: 0,
      active: true,
      createdAt: new Date().toISOString(),
      analytics: {
        clicks: 0,
        conversions: 0,
        earnings: 0
      }
    };
    
    const updatedData = {
      ...data,
      monetization: {
        ...data.monetization,
        affiliateLinks: [...(data.monetization?.affiliateLinks || []), newAffiliate]
      }
    };
    
    onDataChange(updatedData);
    setEditingAffiliate(newAffiliate);
    setShowAffiliateModal(true);
  };

  const updateAffiliateLink = (affiliate: AffiliateLink) => {
    const updatedData = {
      ...data,
      monetization: {
        ...data.monetization,
        affiliateLinks: data.monetization?.affiliateLinks?.map(a => 
          a.id === affiliate.id ? affiliate : a
        ) || []
      }
    };
    
    onDataChange(updatedData);
  };

  const deleteAffiliateLink = (id: string) => {
    const updatedData = {
      ...data,
      monetization: {
        ...data.monetization,
        affiliateLinks: data.monetization?.affiliateLinks?.filter(a => a.id !== id) || []
      }
    };
    
    onDataChange(updatedData);
  };

  const updateDonationSettings = (settings: DonationSettings) => {
    const updatedData = {
      ...data,
      monetization: {
        ...data.monetization,
        donationSettings: settings
      }
    };
    
    onDataChange(updatedData);
  };

  const PaymentLinkModal = () => {
    if (!showPaymentModal || !editingPayment) return null;

    const [formData, setFormData] = useState(editingPayment);

    const handleSave = () => {
      updatePaymentLink(formData);
      setShowPaymentModal(false);
      setEditingPayment(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Edit Payment Link</h3>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="ETH">ETH</option>
                  <option value="BTC">BTC</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="payment-active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="payment-active" className="text-sm text-gray-700">Active</label>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AffiliateModal = () => {
    if (!showAffiliateModal || !editingAffiliate) return null;

    const [formData, setFormData] = useState(editingAffiliate);

    const handleSave = () => {
      updateAffiliateLink(formData);
      setShowAffiliateModal(false);
      setEditingAffiliate(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Edit Affiliate Link</h3>
            <button
              onClick={() => setShowAffiliateModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original URL</label>
              <input
                type="url"
                value={formData.originalUrl}
                onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Affiliate URL</label>
              <input
                type="url"
                value={formData.affiliateUrl}
                onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission (%)</label>
              <input
                type="number"
                value={formData.commission}
                onChange={(e) => setFormData({ ...formData, commission: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="affiliate-active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="affiliate-active" className="text-sm text-gray-700">Active</label>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setShowAffiliateModal(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Monetization</h2>
          <p className="text-gray-500">Manage your revenue streams and track earnings</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'payments', label: 'Payment Links', icon: CreditCard },
            { id: 'nft', label: 'NFT Gates', icon: Shield },
            { id: 'subscriptions', label: 'Token Subscriptions', icon: Crown },
            { id: 'defi', label: 'DeFi Pools', icon: Coins },
            { id: 'donations', label: 'Donations', icon: Gift },
            { id: 'affiliates', label: 'Affiliate Links', icon: Target }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Revenue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${paymentStats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm font-medium">+23.1%</span>
                <span className="text-gray-500 text-sm ml-1">vs last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">NFT Holders</p>
                  <p className="text-2xl font-bold text-gray-900">{nftGates.reduce((sum, gate) => sum + gate.holders, 0)}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm font-medium">+8.2%</span>
                <span className="text-gray-500 text-sm ml-1">this week</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{tokenSubscriptions.reduce((sum, sub) => sum + sub.subscribers, 0)}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Crown className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm font-medium">+15.3%</span>
                <span className="text-gray-500 text-sm ml-1">this month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">DeFi Rewards</p>
                  <p className="text-2xl font-bold text-gray-900">${defiPools.reduce((sum, pool) => sum + pool.rewards, 0).toFixed(2)}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Coins className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm font-medium">+22.1%</span>
                <span className="text-gray-500 text-sm ml-1">APY avg</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{paymentStats.conversionRate}%</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-red-500 text-sm font-medium">-2.1%</span>
                <span className="text-gray-500 text-sm ml-1">vs last month</span>
              </div>
            </div>
          </div>

          {/* Revenue Chart Placeholder */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <PieChart className="h-12 w-12 mx-auto mb-2" />
                <p>Revenue chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Links Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Payment Links</h3>
            <button
              onClick={addPaymentLink}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Payment Link
            </button>
          </div>

          <div className="grid gap-4">
            {data.monetization?.paymentLinks?.map((payment) => (
              <div key={payment.id} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-medium text-gray-900">{payment.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{payment.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-2xl font-bold text-purple-600">
                        {payment.amount} {payment.currency}
                      </span>
                      <div className="text-sm text-gray-500">
                        {payment.analytics?.clicks || 0} clicks • {payment.analytics?.conversions || 0} conversions
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(`${window.location.origin}/pay/${payment.id}`, payment.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy payment link"
                    >
                      {copiedId === payment.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingPayment(payment);
                        setShowPaymentModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deletePaymentLink(payment.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-12 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">No payment links yet</p>
                <p className="text-sm">Create your first payment link to start accepting payments</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Donations Tab */}
      {activeTab === 'donations' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Donation Settings</h3>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Enable Donations</h4>
                  <p className="text-gray-500 text-sm">Allow visitors to make donations to support your work</p>
                </div>
                <input
                  type="checkbox"
                  checked={data.monetization?.donationSettings?.enabled || false}
                  onChange={(e) => updateDonationSettings({
                    ...data.monetization?.donationSettings,
                    enabled: e.target.checked,
                    title: data.monetization?.donationSettings?.title || 'Support Me',
                    description: data.monetization?.donationSettings?.description || 'Help support my work',
                    suggestedAmounts: data.monetization?.donationSettings?.suggestedAmounts || [5, 10, 25, 50]
                  })}
                  className="w-5 h-5 text-purple-600"
                />
              </div>
              
              {data.monetization?.donationSettings?.enabled && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Donation Title</label>
                    <input
                      type="text"
                      value={data.monetization?.donationSettings?.title || ''}
                      onChange={(e) => updateDonationSettings({
                        ...data.monetization?.donationSettings,
                        enabled: true,
                        title: e.target.value,
                        description: data.monetization?.donationSettings?.description || '',
                        suggestedAmounts: data.monetization?.donationSettings?.suggestedAmounts || []
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={data.monetization?.donationSettings?.description || ''}
                      onChange={(e) => updateDonationSettings({
                        ...data.monetization?.donationSettings,
                        enabled: true,
                        title: data.monetization?.donationSettings?.title || '',
                        description: e.target.value,
                        suggestedAmounts: data.monetization?.donationSettings?.suggestedAmounts || []
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Suggested Amounts ($)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[5, 10, 25, 50].map((amount, index) => (
                        <input
                          key={index}
                          type="number"
                          value={data.monetization?.donationSettings?.suggestedAmounts?.[index] || amount}
                          onChange={(e) => {
                            const amounts = [...(data.monetization?.donationSettings?.suggestedAmounts || [5, 10, 25, 50])];
                            amounts[index] = parseInt(e.target.value) || 0;
                            updateDonationSettings({
                              ...data.monetization?.donationSettings,
                              enabled: true,
                              title: data.monetization?.donationSettings?.title || '',
                              description: data.monetization?.donationSettings?.description || '',
                              suggestedAmounts: amounts
                            });
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NFT Gates Tab */}
      {activeTab === 'nft' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">NFT Token Gates</h3>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="h-4 w-4" />
              Create NFT Gate
            </button>
          </div>

          <div className="grid gap-4">
            {nftGates.map((gate) => (
              <div key={gate.id} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-medium text-gray-900">{gate.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        gate.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {gate.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{gate.contractAddress}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-sm text-gray-600">
                        Min tokens: <span className="font-medium">{gate.minTokens}</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        Network: <span className="font-medium">{gate.network}</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        Holders: <span className="font-medium">{gate.holders}</span>
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Gated content: </span>
                      {gate.gatedLinks.map((link, index) => (
                        <span key={index} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-2">
                          {link}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Token Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Token Subscriptions</h3>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="h-4 w-4" />
              Create Subscription
            </button>
          </div>

          <div className="grid gap-4">
            {tokenSubscriptions.map((subscription) => (
              <div key={subscription.id} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-medium text-gray-900">{subscription.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {subscription.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{subscription.tokenAddress}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-lg font-bold text-purple-600">
                        {subscription.pricePerMonth} {subscription.currency}/month
                      </span>
                      <span className="text-sm text-gray-600">
                        {subscription.subscribers} subscribers
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        ${subscription.revenue} revenue
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Benefits: </span>
                      {subscription.benefits.map((benefit, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DeFi Pools Tab */}
      {activeTab === 'defi' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">DeFi Liquidity Pools</h3>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="h-4 w-4" />
              Create Pool
            </button>
          </div>

          <div className="grid gap-4">
            {defiPools.map((pool) => (
              <div key={pool.id} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-medium text-gray-900">{pool.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pool.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pool.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{pool.protocol} • {pool.tokenPair}</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                      <div>
                        <span className="text-xs text-gray-500">APY</span>
                        <p className="text-lg font-bold text-green-600">{pool.apy}%</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">TVL</span>
                        <p className="text-lg font-bold text-gray-900">${pool.tvl.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Your Stake</span>
                        <p className="text-lg font-bold text-purple-600">${pool.userStaked.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Rewards</span>
                        <p className="text-lg font-bold text-yellow-600">${pool.rewards}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Zap className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Affiliate Links Tab */}
      {activeTab === 'affiliates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Affiliate Links</h3>
            <button
              onClick={addAffiliateLink}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Affiliate Link
            </button>
          </div>

          <div className="grid gap-4">
            {data.monetization?.affiliateLinks?.map((affiliate) => (
              <div key={affiliate.id} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-medium text-gray-900">{affiliate.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        affiliate.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {affiliate.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1 truncate">{affiliate.originalUrl}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-lg font-bold text-green-600">
                        {affiliate.commission}% commission
                      </span>
                      <div className="text-sm text-gray-500">
                        {affiliate.analytics?.clicks || 0} clicks • ${affiliate.analytics?.earnings || 0} earned
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(affiliate.affiliateUrl, affiliate.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy affiliate link"
                    >
                      {copiedId === affiliate.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingAffiliate(affiliate);
                        setShowAffiliateModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteAffiliateLink(affiliate.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-12 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">No affiliate links yet</p>
                <p className="text-sm">Add affiliate links to earn commissions from referrals</p>
              </div>
            )}
          </div>

          {/* Crypto Payment Widget */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Crypto Payment Options</h4>
            {cryptoPayments.map((payment) => (
              <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">{payment.name}</h5>
                    <p className="text-sm text-gray-500 font-mono">{payment.walletAddress}</p>
                    <div className="flex gap-2 mt-2">
                      {payment.supportedTokens.map((token) => (
                        <span key={token} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {token}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(payment.walletAddress, payment.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {copiedId === payment.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <PaymentLinkModal />
      <AffiliateModal />
    </div>
  );
};