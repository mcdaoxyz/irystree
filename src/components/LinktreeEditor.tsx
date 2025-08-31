import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  Plus, Trash2, GripVertical, Eye, EyeOff, Save, Upload, Download,
  Palette, Settings, User, Link as LinkIcon, Image as ImageIcon,
  Globe, Instagram, Twitter, Linkedin, Youtube, Github, Mail,
  Phone, MapPin, Clock, Copy, Check, RefreshCw, Sparkles
} from 'lucide-react';
import { LinktreeData, Link, SocialLink, Theme, PRESET_THEMES, createEmptyLink, createEmptySocialLink, createEmptyLinktreeData, generateId, IrysLinktree } from '../lib/irys-minimal';
import { LinktreeDisplay } from './LinktreeDisplay';

interface LinktreeEditorProps {
  initialData?: LinktreeData;
  onSave?: (data: LinktreeData) => void;
  onUpload?: (data: LinktreeData) => Promise<string>;
  className?: string;
}

const DEFAULT_LINKTREE_DATA: LinktreeData = createEmptyLinktreeData();

const SOCIAL_PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'github', label: 'GitHub', icon: Github },
  { value: 'website', label: 'Website', icon: Globe }
];

const BACKGROUND_PATTERNS = [
  { value: 'none', label: 'None' },
  { value: 'dots', label: 'Dots' },
  { value: 'grid', label: 'Grid' },
  { value: 'waves', label: 'Waves' },
  { value: 'circles', label: 'Circles' },
  { value: 'triangles', label: 'Triangles' },
  { value: 'hexagons', label: 'Hexagons' }
];

const FONT_FAMILIES = [
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Lato, sans-serif', label: 'Lato' },
  { value: 'Playfair Display, serif', label: 'Playfair Display' },
  { value: 'Merriweather, serif', label: 'Merriweather' }
];

export const LinktreeEditor: React.FC<LinktreeEditorProps> = ({
  initialData,
  onSave,
  onUpload,
  className = ''
}) => {
  const [data, setData] = useState<LinktreeData>(initialData || DEFAULT_LINKTREE_DATA);
  const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'social' | 'theme' | 'preview'>('profile');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copiedText, setCopiedText] = useState('');
  const [irysInstance, setIrysInstance] = useState<IrysLinktree | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Irys
  useEffect(() => {
    const initIrys = async () => {
      try {
        const irys = new IrysLinktree();
        await irys.initialize();
        setIrysInstance(irys);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Irys:', error);
      }
    };

    initIrys();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSave) {
        onSave(data);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [data, onSave]);

  const updateData = useCallback((updates: Partial<LinktreeData>) => {
    setData(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const updateTheme = useCallback((themeUpdates: Partial<Theme>) => {
    setData(prev => ({
      ...prev,
      theme: { ...prev.theme, ...themeUpdates },
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const addLink = useCallback(() => {
    const newLink = createEmptyLink();
    newLink.order = data.links.length;
    setData(prev => ({
      ...prev,
      links: [...prev.links, newLink],
      updatedAt: new Date().toISOString()
    }));
  }, [data.links.length]);

  const updateLink = useCallback((linkId: string, updates: Partial<Link>) => {
    setData(prev => ({
      ...prev,
      links: prev.links.map(link => 
        link.id === linkId ? { ...link, ...updates } : link
      ),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const deleteLink = useCallback((linkId: string) => {
    setData(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== linkId),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const addSocialLink = useCallback(() => {
    const newSocialLink = createEmptySocialLink();
    setData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newSocialLink],
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const updateSocialLink = useCallback((index: number, updates: Partial<SocialLink>) => {
    setData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((social, i) => 
        i === index ? { ...social, ...updates } : social
      ),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const deleteSocialLink = useCallback((index: number) => {
    setData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(data.links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setData(prev => ({
      ...prev,
      links: updatedItems,
      updatedAt: new Date().toISOString()
    }));
  }, [data.links]);

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(data);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async () => {
    if (!irysInstance && !onUpload) return;
    
    setIsUploading(true);
    try {
      let transactionId: string;
      
      if (onUpload) {
        transactionId = await onUpload(data);
      } else if (irysInstance) {
        transactionId = await irysInstance.uploadLinktree(data);
      } else {
        throw new Error('No upload method available');
      }
      
      setSaveStatus('success');
      setCopiedText(transactionId);
      
      // Copy transaction ID to clipboard
      await copyToClipboard(transactionId);
      
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadFromIrys = async (transactionId: string) => {
    if (!irysInstance) return;
    
    try {
      const loadedData = await irysInstance.getLinktree(transactionId);
      if (loadedData) {
        setData(loadedData);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a temporary URL for preview
    const tempUrl = URL.createObjectURL(file);
    
    if (type === 'avatar') {
      updateData({ avatar: tempUrl });
    } else {
      updateData({ coverImage: tempUrl });
    }

    // In a real implementation, you would upload the file to a storage service
    // and get back a permanent URL to store in the data
    // For now, we're just using the temporary URL for demonstration
  };

  if (isPreviewMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsPreviewMode(false)}
            className="px-4 py-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Edit Mode
          </button>
        </div>
        <LinktreeDisplay data={data} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900">Linktree Editor</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPreviewMode(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              
              {onSave && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              )}
              
              {onUpload && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {isUploading ? 'Uploading...' : 'Upload to Irys'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {saveStatus !== 'idle' && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          saveStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {saveStatus === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span className="font-medium">
            {saveStatus === 'success' ? 'Saved successfully!' : 'Save failed!'}
          </span>
          {copiedText && saveStatus === 'success' && (
            <span className="text-xs text-green-600">ID: {copiedText.slice(0, 8)}...</span>
          )}
        </div>
      )}

      {!isInitialized && (
        <div className="fixed top-20 left-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 bg-yellow-100 text-yellow-800">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="font-medium">Initializing Irys...</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Panel */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'links', label: 'Links', icon: LinkIcon },
                  { id: 'social', label: 'Social', icon: Globe },
                  { id: 'theme', label: 'Theme', icon: Palette }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    {/* Load from Irys */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-900 mb-2">Load from Irys</h3>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter transaction ID"
                          className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleLoadFromIrys((e.target as HTMLInputElement).value);
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.querySelector('input[placeholder="Enter transaction ID"]') as HTMLInputElement;
                            if (input?.value) {
                              handleLoadFromIrys(input.value);
                            }
                          }}
                          disabled={!isInitialized}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          Load
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={data.username}
                        onChange={(e) => updateData({ username: e.target.value })}
                        placeholder="your-username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={data.displayName}
                        onChange={(e) => updateData({ displayName: e.target.value })}
                        placeholder="Your Display Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={data.bio}
                        onChange={(e) => updateData({ bio: e.target.value })}
                        placeholder="Tell people about yourself..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avatar
                      </label>
                      <div className="flex items-center gap-4">
                        {data.avatar && (
                          <img
                            src={data.avatar}
                            alt="Avatar"
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          />
                        )}
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'avatar')}
                            className="hidden"
                            id="avatar-upload"
                          />
                          <label
                            htmlFor="avatar-upload"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            <ImageIcon className="w-4 h-4" />
                            Upload Avatar
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image
                      </label>
                      <div className="flex items-center gap-4">
                        {data.coverImage && (
                          <img
                            src={data.coverImage}
                            alt="Cover"
                            className="w-24 h-16 rounded object-cover border-2 border-gray-200"
                          />
                        )}
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'cover')}
                            className="hidden"
                            id="cover-upload"
                          />
                          <label
                            htmlFor="cover-upload"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            <ImageIcon className="w-4 h-4" />
                            Upload Cover
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Info
                      </label>
                      <input
                        type="text"
                        value={data.contactInfo?.email || ''}
                        onChange={(e) => updateData({ 
                          contactInfo: { 
                            ...data.contactInfo, 
                            email: e.target.value 
                          } 
                        })}
                        placeholder="contact@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={data.location?.city || ''}
                        onChange={(e) => updateData({ 
                          location: { 
                            ...data.location, 
                            city: e.target.value 
                          } 
                        })}
                        placeholder="City, Country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Links Tab */}
                {activeTab === 'links' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Manage Links</h3>
                      <button
                        onClick={addLink}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Link
                      </button>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="links">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-3"
                          >
                            {data.links.map((link, index) => (
                              <Draggable key={link.id} draggableId={link.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all ${
                                      snapshot.isDragging ? 'shadow-lg' : ''
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div
                                        {...provided.dragHandleProps}
                                        className="mt-2 text-gray-400 hover:text-gray-600 cursor-grab"
                                      >
                                        <GripVertical className="w-5 h-5" />
                                      </div>
                                      
                                      <div className="flex-1 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <div className="flex gap-2">
                                            <input
                                              type="text"
                                              value={link.title}
                                              onChange={(e) => updateLink(link.id, { title: e.target.value })}
                                              placeholder="Link title"
                                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                            <input
                                              type="text"
                                              value={link.customIcon || ''}
                                              onChange={(e) => updateLink(link.id, { customIcon: e.target.value })}
                                              placeholder="🔗"
                                              title="Custom icon (emoji or text)"
                                              className="w-16 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center"
                                            />
                                          </div>
                                          <input
                                            type="url"
                                            value={link.url}
                                            onChange={(e) => updateLink(link.id, { url: e.target.value })}
                                            placeholder="https://example.com"
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                          />
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                          <label className="flex items-center gap-2">
                                            <input
                                              type="checkbox"
                                              checked={link.active}
                                              onChange={(e) => updateLink(link.id, { active: e.target.checked })}
                                              className="rounded"
                                            />
                                            <span className="text-sm text-gray-700">Active</span>
                                          </label>
                                          
                                          {link.clicks > 0 && (
                                            <span className="text-sm text-gray-500">
                                              {link.clicks} clicks
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <button
                                        onClick={() => deleteLink(link.id)}
                                        className="mt-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>

                    {data.links.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <LinkIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No links yet. Add your first link to get started!</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Social Tab */}
                {activeTab === 'social' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
                      <button
                        onClick={addSocialLink}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Social
                      </button>
                    </div>

                    <div className="space-y-3">
                      {data.socialLinks.map((social, index) => {
                        const platform = SOCIAL_PLATFORMS.find(p => p.value === social.platform);
                        const Icon = platform?.icon || Globe;
                        
                        return (
                          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 text-gray-500" />
                              
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <select
                                  value={social.platform}
                                  onChange={(e) => updateSocialLink(index, { platform: e.target.value })}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                  <option value="">Select platform</option>
                                  {SOCIAL_PLATFORMS.map((platform) => (
                                    <option key={platform.value} value={platform.value}>
                                      {platform.label}
                                    </option>
                                  ))}
                                </select>
                                
                                <input
                                  type="url"
                                  value={social.url}
                                  onChange={(e) => updateSocialLink(index, { url: e.target.value })}
                                  placeholder="https://..."
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                              </div>
                              
                              <button
                                onClick={() => deleteSocialLink(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {data.socialLinks.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No social links yet. Add your social media profiles!</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Theme Tab */}
                {activeTab === 'theme' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Customize Theme</h3>
                    
                    {/* Preset Themes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Preset Themes
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(PRESET_THEMES).map(([key, theme]) => (
                          <button
                            key={key}
                            onClick={() => updateTheme(theme)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              data.theme.name === theme.name
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div
                              className="w-full h-8 rounded mb-2"
                              style={{ backgroundColor: theme.primaryColor }}
                            />
                            <div className="text-sm font-medium text-gray-900">{theme.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Customization */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={data.theme.primaryColor}
                            onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <input
                            type="text"
                            value={data.theme.primaryColor}
                            onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Background Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={data.theme.backgroundColor}
                            onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <input
                            type="text"
                            value={data.theme.backgroundColor}
                            onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Text Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={data.theme.textColor}
                            onChange={(e) => updateTheme({ textColor: e.target.value })}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <input
                            type="text"
                            value={data.theme.textColor}
                            onChange={(e) => updateTheme({ textColor: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Border Radius
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="24"
                          value={data.theme.borderRadius}
                          onChange={(e) => updateTheme({ borderRadius: parseInt(e.target.value) })}
                          className="w-full"
                        />
                        <div className="text-sm text-gray-500 mt-1">{data.theme.borderRadius}px</div>
                      </div>
                    </div>

                    {/* Advanced Options */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Font Family
                        </label>
                        <select
                          value={data.theme.fontFamily || 'Inter, sans-serif'}
                          onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {FONT_FAMILIES.map((font) => (
                            <option key={font.value} value={font.value}>
                              {font.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Background Pattern
                        </label>
                        <select
                          value={data.theme.backgroundPattern || 'none'}
                          onChange={(e) => updateTheme({ backgroundPattern: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {BACKGROUND_PATTERNS.map((pattern) => (
                            <option key={pattern.value} value={pattern.value}>
                              {pattern.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Spacing
                        </label>
                        <select
                          value={data.theme.spacing || 16}
                          onChange={(e) => updateTheme({ spacing: parseInt(e.target.value) || 16 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value={12}>Compact</option>
                          <option value={16}>Normal</option>
                          <option value={20}>Relaxed</option>
                        </select>
                      </div>
                    </div>

                    {/* Custom CSS */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom CSS
                      </label>
                      <textarea
                        value={data.theme.customCSS || ''}
                        onChange={(e) => updateTheme({ customCSS: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={4}
                        placeholder="/* Add your custom CSS here */"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Live Preview</h3>
                  <button
                    onClick={() => setIsPreviewMode(true)}
                    className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Full Preview
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-[9/16] max-h-96 overflow-hidden">
                    <div className="scale-50 origin-top-left w-[200%] h-[200%]">
                      <LinktreeDisplay data={data} className="min-h-full" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-500 space-y-1">
                  <div>Links: {data.links.filter(l => l.active).length}</div>
                  <div>Social: {data.socialLinks.filter(s => s.platform && s.url).length}</div>
                  <div>Theme: {data.theme.name}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};