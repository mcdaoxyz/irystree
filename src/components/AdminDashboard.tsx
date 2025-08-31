import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Link2, Eye, TrendingUp, Settings, 
  Plus, Edit3, Trash2, Copy, ExternalLink, Search,
  Calendar, Globe, Smartphone, Monitor, Tablet,
  DollarSign, Target, MousePointer, Clock,
  Bell, Download, Upload, Share2, QrCode,
  Palette, Layout, Type, Image, Video,
  Mail, Phone, MapPin, Instagram, Twitter,
  Linkedin, Youtube, Github, Facebook,
  ChevronDown, ChevronRight, Filter, SortAsc,
  MoreHorizontal, Star, Heart, MessageCircle,
  Zap, Shield, Crown, Gift, Bookmark,
  ArrowUpRight, ArrowDownRight, Minus, X,
  CreditCard
} from 'lucide-react';
import { LinktreeData, Link as LinkInterface } from '../lib/irys-minimal';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { MonetizationDashboard } from './MonetizationDashboard';
import { QRCodeGenerator } from './QRCodeGenerator';

interface AdminDashboardProps {
  data: LinktreeData;
  onDataChange: (data: LinktreeData) => void;
  onSave: () => void;
  isLoading: boolean;
}

interface DashboardStats {
  totalViews: number;
  totalClicks: number;
  clickRate: number;
  topLink: string;
  recentGrowth: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  data,
  onDataChange,
  onSave,
  isLoading
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'links' | 'appearance' | 'analytics' | 'settings' | 'monetization'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [linkFilter, setLinkFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkInterface | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('7d');

  // Mock analytics data - in real implementation, this would come from blockchain
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalViews: 12847,
    totalClicks: 3421,
    clickRate: 26.6,
    topLink: data.links[0]?.title || 'Official Website',
    recentGrowth: 12.5
  });

  const filteredLinks = data.links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = linkFilter === 'all' || 
                         (linkFilter === 'active' && link.active) ||
                         (linkFilter === 'inactive' && !link.active);
    return matchesSearch && matchesFilter;
  });

  const addNewLink = () => {
    const newLink: LinkInterface = {
      id: Date.now().toString(),
      title: '',
      url: '',
      active: true,
      order: data.links.length,
      clicks: 0,
      analytics: {
        clicks: 0,
        uniqueClicks: 0,
        clicksByDate: {},
        referrers: [],
        conversionRate: 0
      },
      customization: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderRadius: 8
      },
      createdAt: new Date().toISOString()
    };
    
    onDataChange({
      ...data,
      links: [...data.links, newLink]
    });
    setEditingLink(newLink);
    setShowLinkModal(true);
  };

  const updateLink = (linkId: string, updates: Partial<LinkInterface>) => {
    const updatedLinks = data.links.map(link => 
      link.id === linkId ? { ...link, ...updates, updatedAt: new Date().toISOString() } : link
    );
    onDataChange({ ...data, links: updatedLinks });
  };

  const deleteLink = (linkId: string) => {
    const updatedLinks = data.links.filter(link => link.id !== linkId);
    onDataChange({ ...data, links: updatedLinks });
  };

  const duplicateLink = (link: LinkInterface) => {
    const duplicatedLink = {
      ...link,
      id: Date.now().toString(),
      title: `${link.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onDataChange({
      ...data,
      links: [...data.links, duplicatedLink]
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {data.displayName}!</h1>
            <p className="text-purple-100">Here's how your Linktree is performing</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{dashboardStats.totalViews.toLocaleString()}</div>
            <div className="text-purple-100">Total Views</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalClicks.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <MousePointer className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">+{dashboardStats.recentGrowth}%</span>
            <span className="text-gray-500 text-sm ml-1">vs last week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Click Rate</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.clickRate}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">+2.1%</span>
            <span className="text-gray-500 text-sm ml-1">vs last week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Links</p>
              <p className="text-2xl font-bold text-gray-900">{data.links.filter(l => l.active).length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Link2 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-gray-500 text-sm">of {data.links.length} total</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Top Performer</p>
              <p className="text-lg font-bold text-gray-900 truncate">{dashboardStats.topLink}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-gray-500 text-sm">Most clicked link</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={addNewLink}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Plus className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-600">Add Link</span>
          </button>
          
          <button
            onClick={() => setActiveSection('appearance')}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Palette className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-600">Customize</span>
          </button>
          
          <button
            onClick={() => setShowQRCode(true)}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <QrCode className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-600">QR Code</span>
          </button>
          
          <button
            onClick={() => setActiveSection('analytics')}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <BarChart3 className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-600">Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <MousePointer className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New click on "Official Website"</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Profile viewed from Twitter</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <Link2 className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Link "Documentation" updated</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLinks = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Links</h2>
          <p className="text-gray-500">Manage your links and track their performance</p>
        </div>
        <button
          onClick={addNewLink}
          className="mt-4 sm:mt-0 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Link
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={linkFilter}
            onChange={(e) => setLinkFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Links</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Links List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredLinks.length === 0 ? (
          <div className="text-center py-12">
            <Link2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No links found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first link</p>
            <button
              onClick={addNewLink}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Link
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLinks.map((link, index) => (
              <div key={link.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${link.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {link.title || 'Untitled Link'}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">{link.url}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MousePointer className="h-3 w-3" />
                        {link.clicks || 0} clicks
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {((link.clicks || 0) / Math.max(dashboardStats.totalViews, 1) * 100).toFixed(1)}% CTR
                      </span>
                      <span>Updated {new Date(link.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingLink(link);
                        setShowLinkModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => duplicateLink(link)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => window.open(link.url, '_blank')}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    
                    <div className="relative">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Appearance</h2>
        <p className="text-gray-500">Customize how your Linktree looks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customization Panel */}
        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                <div className="flex items-center gap-4">
                  {data.avatar && (
                    <img src={data.avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                  )}
                  <div className="flex-1">
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={data.avatar || ''}
                      onChange={(e) => onDataChange({ ...data, avatar: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                <input
                  type="text"
                  value={data.displayName}
                  onChange={(e) => onDataChange({ ...data, displayName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={data.bio}
                  onChange={(e) => onDataChange({ ...data, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Theme */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {/* Theme previews would go here */}
              <div className="aspect-square bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg cursor-pointer border-2 border-purple-500">
                <div className="p-2 text-white text-xs">Purple</div>
              </div>
              <div className="aspect-square bg-gradient-to-br from-pink-500 to-red-500 rounded-lg cursor-pointer border-2 border-transparent hover:border-gray-300">
                <div className="p-2 text-white text-xs">Pink</div>
              </div>
              <div className="aspect-square bg-gradient-to-br from-green-500 to-teal-500 rounded-lg cursor-pointer border-2 border-transparent hover:border-gray-300">
                <div className="p-2 text-white text-xs">Green</div>
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Background</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={data.theme.backgroundColor}
                    onChange={(e) => onDataChange({
                      ...data,
                      theme: { ...data.theme, backgroundColor: e.target.value }
                    })}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={data.theme.backgroundColor}
                    onChange={(e) => onDataChange({
                      ...data,
                      theme: { ...data.theme, backgroundColor: e.target.value }
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="sticky top-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
            <div className="bg-gray-100 rounded-lg p-4">
              <div 
                className="bg-white rounded-lg p-6 shadow-lg max-w-sm mx-auto"
                style={{
                  backgroundColor: data.theme.backgroundColor,
                  color: data.theme.textColor
                }}
              >
                {/* Profile Section */}
                <div className="text-center mb-6">
                  {data.avatar && (
                    <img
                      src={data.avatar}
                      alt="Profile"
                      className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover"
                    />
                  )}
                  <h1 className="text-xl font-bold mb-2">
                    {data.displayName || 'Your Name'}
                  </h1>
                  <p className="text-gray-400 mb-2">
                    @{data.username || 'username'}
                  </p>
                  {data.bio && (
                    <p className="text-gray-300 text-sm mb-4">{data.bio}</p>
                  )}
                </div>

                {/* Links Preview */}
                <div className="space-y-3 mb-6">
                  {data.links
                    .filter(link => link.active && link.title)
                    .slice(0, 3)
                    .map((link) => (
                      <div
                        key={link.id}
                        className="w-full text-center py-3 px-4 rounded-lg"
                        style={{
                          backgroundColor: data.theme.primaryColor,
                          color: '#ffffff'
                        }}
                      >
                        {link.title}
                      </div>
                    ))}
                  {data.links.filter(link => link.active && link.title).length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Link2 className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Your links will appear here</p>
                    </div>
                  )}
                </div>

                {/* Social Links Preview */}
                {data.socialLinks.filter(social => social.platform && social.url).length > 0 && (
                  <div className="flex justify-center gap-4">
                    {data.socialLinks
                      .filter(social => social.platform && social.url)
                      .slice(0, 4)
                      .map((social, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: data.theme.primaryColor }}
                        >
                          <span className="text-white text-xs">📱</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <AnalyticsDashboard
      data={data}
      dateRange={selectedDateRange}
      onDateRangeChange={setSelectedDateRange}
    />
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={data.username}
                  onChange={(e) => onDataChange({ ...data, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              {/* Contact Info */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={data.contactInfo?.email || ''}
                      onChange={(e) => onDataChange({
                        ...data,
                        contactInfo: { ...data.contactInfo, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Settings Placeholder */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
                <div className="text-center py-8">
                  <p className="text-gray-500">Settings functionality coming soon...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
            <div className="space-y-4">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonetization = () => (
    <MonetizationDashboard
      data={data}
      onDataChange={onDataChange}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌿</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Irys Linktree Admin</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={onSave}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Save to Blockchain
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveSection('overview')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === 'overview'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  Overview
                </button>
                
                <button
                  onClick={() => setActiveSection('links')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === 'links'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Link2 className="h-5 w-5" />
                  Links
                </button>
                
                <button
                  onClick={() => setActiveSection('appearance')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === 'appearance'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Palette className="h-5 w-5" />
                  Appearance
                </button>
                
                <button
                  onClick={() => setActiveSection('analytics')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === 'analytics'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp className="h-5 w-5" />
                  Analytics
                </button>
                
                <button
                  onClick={() => setActiveSection('monetization')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === 'monetization'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <DollarSign className="h-5 w-5" />
                  Monetization
                </button>
                
                <button
                  onClick={() => setActiveSection('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === 'settings'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === 'overview' && renderOverview()}
            {activeSection === 'links' && renderLinks()}
            {activeSection === 'appearance' && renderAppearance()}
            {activeSection === 'analytics' && renderAnalytics()}
            {activeSection === 'monetization' && renderMonetization()}
            {activeSection === 'settings' && renderSettings()}
          </div>
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && editingLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingLink.title ? 'Edit Link' : 'Add Link'}
              </h3>
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setEditingLink(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editingLink.title}
                  onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter link title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <input
                  type="url"
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Active</p>
                  <p className="text-xs text-gray-500">Show this link on your profile</p>
                </div>
                <button
                  onClick={() => setEditingLink({ ...editingLink, active: !editingLink.active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    editingLink.active ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      editingLink.active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  updateLink(editingLink.id, editingLink);
                  setShowLinkModal(false);
                  setEditingLink(null);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Save
              </button>
              
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setEditingLink(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              
              {editingLink.title && (
                <button
                  onClick={() => {
                    deleteLink(editingLink.id);
                    setShowLinkModal(false);
                    setEditingLink(null);
                  }}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
              <button
                onClick={() => setShowQRCode(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-8 mb-4">
                <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
                  <QrCode className="h-16 w-16 text-gray-400" />
                  <div className="absolute text-xs text-gray-500 mt-20">QR Code Preview</div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Share your Linktree with this QR code
              </p>
              
              <div className="flex gap-3">
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </button>
                
                <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};