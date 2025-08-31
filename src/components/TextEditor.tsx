import React, { useState, useRef, useCallback } from 'react';
import { Bold, Italic, Underline, Image, Save, Eye, FileText, Upload } from 'lucide-react';
import { LinktreeData } from '../lib/irys-minimal';

interface TextEditorProps {
  initialContent?: string;
  onSave?: (content: string, isDraft: boolean) => void;
  onPreview?: (content: string) => void;
  className?: string;
  data?: LinktreeData;
  onDataChange?: React.Dispatch<React.SetStateAction<LinktreeData>>;
}

interface Article {
  id: string;
  title: string;
  content: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  initialContent = '',
  onSave,
  onPreview,
  className = ''
}) => {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  const handleBold = () => executeCommand('bold');
  const handleItalic = () => executeCommand('italic');
  const handleUnderline = () => executeCommand('underline');

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        executeCommand('insertImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleSave = async (isDraft: boolean) => {
    if (!title.trim()) {
      alert('Mohon masukkan judul artikel');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi saving
      onSave?.(content, isDraft);
      
      // Simpan ke localStorage untuk demo
      const articles = JSON.parse(localStorage.getItem('articles') || '[]');
      const newArticle: Article = {
        id: Date.now().toString(),
        title,
        content,
        isDraft,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      articles.push(newArticle);
      localStorage.setItem('articles', JSON.stringify(articles));
      
      alert(isDraft ? 'Draft berhasil disimpan!' : 'Artikel berhasil dipublikasikan!');
    } catch (error) {
      alert('Gagal menyimpan artikel');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode);
    onPreview?.(content);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText size={20} />
            Editor Teks
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreview}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                isPreviewMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye size={16} />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? 'Menyimpan...' : 'Simpan Draft'}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Upload size={16} />
              {isSaving ? 'Mempublikasi...' : 'Publikasikan'}
            </button>
          </div>
        </div>
      </div>

      {/* Title Input */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Masukkan judul artikel..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xl font-semibold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
        />
      </div>

      {!isPreviewMode ? (
        <>
          {/* Toolbar */}
          <div className="border-b border-gray-200 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
                <button
                  onClick={handleBold}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Bold (Ctrl+B)"
                >
                  <Bold size={16} />
                </button>
                <button
                  onClick={handleItalic}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Italic (Ctrl+I)"
                >
                  <Italic size={16} />
                </button>
                <button
                  onClick={handleUnderline}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Underline (Ctrl+U)"
                >
                  <Underline size={16} />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleImageUpload}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Sisipkan Gambar"
                >
                  <Image size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="p-4">
            <div
              ref={editorRef}
              contentEditable
              onInput={handleContentChange}
              className="min-h-[400px] w-full outline-none text-gray-900 leading-relaxed"
              style={{
                fontSize: '16px',
                lineHeight: '1.6'
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      ) : (
        /* Preview Mode */
        <div className="p-6">
          <div className="max-w-none prose prose-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{title || 'Judul Artikel'}</h1>
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content || '<p className="text-gray-400">Konten akan muncul di sini...</p>' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};