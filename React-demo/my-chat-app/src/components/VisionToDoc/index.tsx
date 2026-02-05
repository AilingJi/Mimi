import React, { useRef, useState } from 'react';
import './VisionToDoc.css';
import { useExportToDoc } from './useExportToDoc';

const VisionToDoc: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const handleExport = useExportToDoc();

  const onExport = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await handleExport(containerRef.current);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="export-btn" onClick={onExport} disabled={loading}>
        {loading ? <span className="spinner" /> : 'Export'}
      </button>
      <div className="vision-doc-container" ref={containerRef}>
        <h2>Vision To Doc</h2>        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Sample Image" style={{width: '200px', borderRadius: '8px'}} />
        <p>Rich content display with colorful elements.</p>
      </div>
    </>
  );
};

export default VisionToDoc;
