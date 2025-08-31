import React from 'react';
import { Instagram, Twitter, Linkedin, Youtube, Github, Globe, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { LinktreeData } from '../lib/irys';

interface LinktreeViewerProps {
  data: LinktreeData;
  onLinkClick?: (linkId: string) => void;
}

export const LinktreeViewer: React.FC<LinktreeViewerProps> = ({ data, onLinkClick }) => {
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

  // Generate CSS for background patterns
  const getBackgroundPatternCSS = (pattern: string) => {
    switch (pattern) {
      case 'dots':
        return 'radial-gradient(circle, #ffffff 1px, transparent 1px)';
      case 'grid':
        return 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)';
      case 'waves':
        return 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)';
      case 'circles':
        return 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)';
      case 'triangles':
        return 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%)';
      case 'hexagons':
        return 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)';
      default:
        return 'none';
    }
  };

  const handleLinkClick = (link: any) => {
    // Increment click count (in a real app, this would be saved to backend)
    if (onLinkClick) {
      onLinkClick(link.id);
    }
  };

  // Filter and sort active links
  const activeLinks = data.links
    .filter(link => link.active && link.title && link.url)
    .sort((a, b) => a.order - b.order);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        fontFamily: data.theme.fontFamily,
        backgroundColor: data.theme.backgroundColor,
        color: data.theme.textColor,
        backgroundImage: getBackgroundPatternCSS(data.theme.backgroundPattern || 'none'),
        backgroundSize: data.theme.backgroundPattern !== 'none' ? '20px 20px' : 'auto'
      }}
    >
      <div 
        className="w-full max-w-md mx-auto"
        style={{
          borderRadius: `${data.theme.borderRadius}px`,
          padding: `${data.theme.spacing}px`
        }}
      >
        {/* Cover Image */}
        {data.coverImage && (
          <div className="mb-6">
            <img
              src={data.coverImage}
              alt="Cover"
              className="w-full h-32 object-cover rounded-lg shadow-lg"
              style={{ borderRadius: `${data.theme.borderRadius}px` }}
            />
          </div>
        )}

        {/* Profile Section */}
        <div className="text-center mb-8">
          {data.avatar && (
            <img
              src={data.avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
            />
          )}
          
          <h1 className="text-2xl font-bold mb-2">
            {data.displayName || 'Your Name'}
          </h1>
          
          <p className="text-gray-600 mb-2">
            @{data.username || 'username'}
          </p>
          
          {data.bio && (
            <p className="text-gray-700 text-sm mb-4">{data.bio}</p>
          )}

          {/* Contact Info */}
          {(data.contactInfo.email || data.contactInfo.phone || data.contactInfo.website) && (
            <div className="text-sm text-gray-600 mb-4 space-y-1">
              {data.contactInfo.email && (
                <div className="flex items-center justify-center gap-2">
                  <Mail size={14} />
                  {data.contactInfo.email}
                </div>
              )}
              {data.contactInfo.phone && (
                <div className="flex items-center justify-center gap-2">
                  <Phone size={14} />
                  {data.contactInfo.phone}
                </div>
              )}
              {data.contactInfo.website && (
                <div className="flex items-center justify-center gap-2">
                  <Globe size={14} />
                  {data.contactInfo.website}
                </div>
              )}
            </div>
          )}

          {/* Location */}
          {(data.location.city || data.location.country) && (
            <div className="text-sm text-gray-600 mb-4 flex items-center justify-center gap-2">
              <MapPin size={14} />
              {[data.location.city, data.location.country].filter(Boolean).join(', ')}
            </div>
          )}

          {/* Timezone */}
          {data.location.timezone && (
            <div className="text-sm text-gray-600 mb-4 flex items-center justify-center gap-2">
              <Clock size={14} />
              {data.location.timezone}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3 mb-8">
          {activeLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link)}
              className="block w-full text-center py-3 px-4 rounded-lg transition-all hover:opacity-80 hover:scale-105"
              style={{
                backgroundColor: data.theme.primaryColor,
                color: '#ffffff',
                borderRadius: `${data.theme.borderRadius}px`,
                marginBottom: `${data.theme.spacing}px`
              }}
            >
              {link.customIcon ? (
                <img src={link.customIcon} alt="" className="w-4 h-4 inline mr-2" />
              ) : null}
              {link.title}
            </a>
          ))}
        </div>

        {/* Social Links */}
        {data.socialLinks.filter(social => social.platform && social.url).length > 0 && (
          <div className="flex justify-center gap-4">
            {data.socialLinks
              .filter(social => social.platform && social.url)
              .map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:scale-110"
                  style={{ color: data.theme.primaryColor }}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
          </div>
        )}

        {/* Custom CSS */}
        {data.theme.customCSS && (
          <style>{data.theme.customCSS}</style>
        )}
      </div>
    </div>
  );
}; 