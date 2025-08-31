import React, { useState, useEffect } from 'react';
import { 
  Instagram, Twitter, Linkedin, Youtube, Github, Globe, 
  ExternalLink, Copy, Share2, Heart, Eye, Calendar,
  MapPin, Clock, Mail, Phone, Sparkles
} from 'lucide-react';
import { LinktreeData } from '../lib/irys-minimal';

interface LinktreeDisplayProps {
  data: LinktreeData;
  onLinkClick?: (linkId: string) => void;
  className?: string;
}

export const LinktreeDisplay: React.FC<LinktreeDisplayProps> = ({ 
  data, 
  onLinkClick,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getSocialIcon = (platform: string) => {
    const iconProps = { size: 24, className: 'transition-transform hover:scale-110' };
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram {...iconProps} />;
      case 'twitter': return <Twitter {...iconProps} />;
      case 'linkedin': return <Linkedin {...iconProps} />;
      case 'youtube': return <Youtube {...iconProps} />;
      case 'github': return <Github {...iconProps} />;
      default: return <Globe {...iconProps} />;
    }
  };

  const handleLinkClick = (link: any) => {
    if (onLinkClick) {
      onLinkClick(link.id);
    }
  };

  const copyToClipboard = async (text: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(linkId);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.displayName} - Linktree`,
          text: data.bio,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyToClipboard(window.location.href, 'profile');
    }
  };

  // Filter and sort active links
  const activeLinks = data.links
    .filter(link => link.active && link.title && link.url)
    .sort((a, b) => a.order - b.order);

  const activeSocialLinks = data.socialLinks.filter(social => social.platform && social.url);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 ${className}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div 
          className={`w-full max-w-md mx-auto transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* Header with Share Button */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="text-yellow-400" size={20} />
                <span className="text-white/80 text-sm font-medium">On-Chain Profile</span>
              </div>
              <button
                onClick={shareProfile}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Share Profile"
              >
                <Share2 className="text-white" size={18} />
              </button>
            </div>

            {/* Profile Section */}
            <div className="text-center mb-8">
              {data.avatar && (
                <div className="relative mb-6">
                  <img
                    src={data.avatar}
                    alt="Profile"
                    className="w-28 h-28 rounded-full mx-auto border-4 border-white/30 shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
              
              <h1 className="text-3xl font-bold text-white mb-2">
                {data.displayName || 'Your Name'}
              </h1>
              
              <p className="text-white/70 mb-1 text-lg">
                @{data.username || 'username'}
              </p>
              
              {data.bio && (
                <p className="text-white/80 text-sm leading-relaxed mb-4 px-2">
                  {data.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex justify-center gap-6 mb-6">
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{activeLinks.length}</div>
                  <div className="text-white/60 text-xs">Links</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">
                    {activeLinks.reduce((sum, link) => sum + link.clicks, 0)}
                  </div>
                  <div className="text-white/60 text-xs">Clicks</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{activeSocialLinks.length}</div>
                  <div className="text-white/60 text-xs">Social</div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4 mb-8">
              {activeLinks.map((link, index) => (
                <div
                  key={link.id}
                  className={`transition-all duration-300 transform ${
                    isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div
                    className="group relative"
                    onMouseEnter={() => setHoveredLink(link.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleLinkClick(link)}
                      className="block w-full text-center py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-white font-medium text-left">{link.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {link.clicks > 0 && (
                            <span className="text-white/60 text-xs flex items-center gap-1">
                              <Eye size={12} />
                              {link.clicks}
                            </span>
                          )}
                          <ExternalLink 
                            className={`text-white/60 transition-transform ${
                              hoveredLink === link.id ? 'scale-110' : ''
                            }`} 
                            size={16} 
                          />
                        </div>
                      </div>
                    </a>
                    
                    {/* Copy button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        copyToClipboard(link.url, link.id);
                      }}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 ${
                        copiedLink === link.id ? 'bg-green-500/20' : ''
                      }`}
                      title="Copy Link"
                    >
                      <Copy 
                        className={`${copiedLink === link.id ? 'text-green-400' : 'text-white'}`} 
                        size={12} 
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            {activeSocialLinks.length > 0 && (
              <div className="border-t border-white/20 pt-6">
                <div className="flex justify-center gap-6">
                  {activeSocialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 border border-white/20 hover:border-white/40 ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                      }`}
                      style={{ transitionDelay: `${(activeLinks.length + index) * 100}ms` }}
                    >
                      <div className="text-white">
                        {getSocialIcon(social.platform)}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center justify-center gap-2 text-white/60 text-xs">
                <Calendar size={12} />
                <span>Created {new Date(data.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-center gap-1 mt-2">
                <span className="text-white/40 text-xs">Powered by</span>
                <span className="text-purple-400 text-xs font-semibold">Irys</span>
                <Heart className="text-red-400" size={12} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `
      }} />
    </div>
  );
};

export default LinktreeDisplay;