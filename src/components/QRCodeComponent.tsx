'use client';

import { useState } from 'react';

interface QRCodeComponentProps {
  value: string;
  size?: number;
  downloadable?: boolean;
}

export default function QRCodeComponent({ value, size = 200, downloadable = true }: QRCodeComponentProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Simple QR code generation using a placeholder service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;

  const handleDownload = async () => {
    if (!downloadable) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-code-${value.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
        <img
          src={qrCodeUrl}
          alt={`QR Code for ${value}`}
          className="block"
          width={size}
          height={size}
        />
      </div>
      
      {downloadable && (
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download QR Code</span>
            </>
          )}
        </button>
      )}
      
      <div className="text-center">
        <p className="text-sm text-gray-600 font-mono break-all max-w-xs">
          {value}
        </p>
      </div>
    </div>
  );
}
