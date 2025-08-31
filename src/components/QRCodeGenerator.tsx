import React, { useEffect, useRef } from 'react';
import { Download, Share2, Copy } from 'lucide-react';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
  title?: string;
  onClose?: () => void;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  url,
  size = 256,
  title = 'QR Code',
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQRCode();
  }, [url, size]);

  const generateQRCode = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Simple QR code pattern (placeholder)
    // In a real implementation, you would use a QR code library like qrcode.js
    const moduleSize = size / 25;
    ctx.fillStyle = '#000000';

    // Create a simple pattern that looks like a QR code
    const pattern = [
      [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,1,1,0,1,1,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
      [1,0,1,1,0,1,1,1,1,0,1,1,0,1,1,1,0,1,0,1,1],
      [0,1,0,1,1,0,0,0,0,1,1,0,1,0,0,0,1,0,1,0,0],
      [1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1],
      [0,0,0,1,1,0,0,0,0,1,0,1,0,0,0,1,1,0,0,0,0],
      [1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1],
      [0,0,0,0,0,0,0,0,1,1,0,1,0,0,1,0,0,1,0,0,0],
      [1,1,1,1,1,1,1,0,0,1,1,0,1,0,0,1,1,0,1,1,1],
      [1,0,0,0,0,0,1,0,1,0,1,1,0,1,1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,0,1,0,1,1,0,0,1,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,0,0,0,1,0,0,0,1,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,1,1,1,0,1,1,1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,0,0,1,0,1,0,1,0,1,1,1,1,1,1]
    ];

    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        if (pattern[row][col] === 1) {
          ctx.fillRect(
            col * moduleSize + (size - pattern[0].length * moduleSize) / 2,
            row * moduleSize + (size - pattern.length * moduleSize) / 2,
            moduleSize,
            moduleSize
          );
        }
      }
    }
  };

  const downloadQRCode = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-qr-code.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const shareQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((blob) => {
          resolve(blob!);
        });
      });

      if (navigator.share) {
        const file = new File([blob], 'qr-code.png', { type: 'image/png' });
        await navigator.share({
          title: title,
          text: `Check out my Linktree: ${url}`,
          files: [file]
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(url);
        alert('URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing QR code:', error);
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('URL copied to clipboard!');
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
      }
    }
  };

  const copyURL = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard!');
    } catch (error) {
      console.error('Error copying URL:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <canvas
            ref={canvasRef}
            className="mx-auto border border-gray-200 rounded"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        
        <p className="text-sm text-gray-600 mb-4 break-all">
          {url}
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={downloadQRCode}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          
          <button
            onClick={shareQRCode}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          
          <button
            onClick={copyURL}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg flex items-center justify-center transition-colors"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 w-full text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};