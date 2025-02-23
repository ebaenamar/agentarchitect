import { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, ShareIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface ExportOptionsProps {
  diagram: string;
  tools: Array<{
    component: string;
    suggestions: string[];
  }>;
}

export default function ExportOptions({ diagram, tools }: ExportOptionsProps) {
  const [showCopied, setShowCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const handleDownloadSVG = async () => {
    const svgElement = document.querySelector('.mermaid svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ai-architecture.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleCopyToClipboard = async () => {
    const content = {
      diagram,
      tools,
      exportedAt: new Date().toISOString(),
    };
    
    await navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'AI System Architecture',
        text: 'Check out this AI system architecture',
        url: window.location.href,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center mt-8">
      <button
        onClick={handleDownloadSVG}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
        Download SVG
      </button>
      
      <button
        onClick={handleCopyToClipboard}
        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
        {showCopied ? 'Copied!' : 'Copy JSON'}
      </button>

      {canShare && (
        <button
          onClick={handleShare}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <ShareIcon className="w-5 h-5 mr-2" />
          Share
        </button>
      )}
    </div>
  );
}
