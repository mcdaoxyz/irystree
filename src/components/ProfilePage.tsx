import React, { useState, useEffect } from 'react';
import { User, Edit3, Calendar, Eye, Heart, MessageCircle, BookOpen, Users, Award, Camera, Save, X } from 'lucide-react';
import { LinktreeData } from '../lib/irys-minimal';

interface Article {
  id: string;
  title: string;
  content: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  views?: number;
  likes?: number;
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  joinDate: string;
  location?: string;
  website?: string;
  followers: number;
  following: number;
}

interface ProfilePageProps {
  className?: string;
  linktreeData?: LinktreeData;
  onDataChange?: React.Dispatch<React.SetStateAction<LinktreeData>>;
  onSave?: () => Promise<void>;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ className = '' }) => {
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    bio: 'Penulis konten digital yang passionate tentang teknologi dan inovasi. Suka berbagi pengalaman dan pengetahuan melalui tulisan.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=200&fit=crop',
    joinDate: '2023-01-15',
    location: 'Jakarta, Indonesia',
    website: 'https://johndoe.dev',
    followers: 1247,
    following: 342
  });

  const [articles, setArticles] = useState<Article[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');

  useEffect(() => {
    // Load articles from localStorage
    const savedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
    const articlesWithStats = savedArticles.map((article: Article) => ({
      ...article,
      views: Math.floor(Math.random() * 1000) + 50,
      likes: Math.floor(Math.random() * 100) + 5
    }));
    setArticles(articlesWithStats);
  }, []);

  const publishedArticles = articles.filter(article => !article.isDraft);
  const draftArticles = articles.filter(article => article.isDraft);
  const totalViews = publishedArticles.reduce((sum, article) => sum + (article.views || 0), 0);
  const totalLikes = publishedArticles.reduce((sum, article) => sum + (article.likes || 0), 0);

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditForm(profile);
  };

  const handleSaveProfile = () => {
    setProfile(editForm);
    setIsEditing(false);
    // Simpan ke localStorage untuk demo
    localStorage.setItem('userProfile', JSON.stringify(editForm));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(profile);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-purple-500 to-blue-600">
        {profile.coverImage && (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      {/* Profile Header */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg bg-white"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors">
                  <Camera size={16} />
                </button>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              {!isEditing ? (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile.name}</h1>
                  <p className="text-gray-600">@{profile.username}</p>
                  {profile.bio && (
                    <p className="text-gray-700 mt-2 leading-relaxed">{profile.bio}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                    {profile.location && (
                      <span className="flex items-center gap-1">
                        📍 {profile.location}
                      </span>
                    )}
                    {profile.website && (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                        🌐 {profile.website.replace('https://', '')}
                      </a>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      Bergabung {formatDate(profile.joinDate)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="space-y-3 mt-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full text-2xl font-bold bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Nama lengkap"
                  />
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Username"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 h-20 resize-none"
                    placeholder="Bio"
                  />
                  <input
                    type="text"
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Lokasi"
                  />
                  <input
                    type="url"
                    value={editForm.website || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Website"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 sm:mt-0">
            {!isEditing ? (
              <button
                onClick={handleEditProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit3 size={16} />
                Edit Profil
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save size={16} />
                  Simpan
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <X size={16} />
                  Batal
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{publishedArticles.length}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <BookOpen size={14} />
              Artikel
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Eye size={14} />
              Views
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{profile.followers.toLocaleString()}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Users size={14} />
              Pengikut
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalLikes.toLocaleString()}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Heart size={14} />
              Likes
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="border-t border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('published')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'published'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Artikel Terpublikasi ({publishedArticles.length})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'drafts'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Draft ({draftArticles.length})
          </button>
        </div>
      </div>

      {/* Articles List */}
      <div className="p-6">
        {activeTab === 'published' && (
          <div className="space-y-4">
            {publishedArticles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Belum ada artikel yang dipublikasikan</p>
              </div>
            ) : (
              publishedArticles.map((article) => (
                <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{truncateContent(article.content)}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {article.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={14} />
                        {article.likes}
                      </span>
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'drafts' && (
          <div className="space-y-4">
            {draftArticles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Edit3 size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Belum ada draft artikel</p>
              </div>
            ) : (
              draftArticles.map((article) => (
                <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{truncateContent(article.content)}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Disimpan {formatDate(article.updatedAt)}</span>
                      </div>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Draft
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};