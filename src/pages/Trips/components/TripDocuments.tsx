import { useState, useRef, useEffect } from 'react';
import {
  Folder, FileText, Upload, Plus, Trash, Edit, Eye, Download, Search, X, ShieldAlert
} from 'lucide-react';
import './TripDocuments.css';

interface DocumentFile {
  id: string;
  name: string;
  category: 'Bookings' | 'Tickets' | 'Passports' | 'Visas' | 'Other';
  fileSize: string;
  uploadedAt: string;
  type: string;
}

interface TripDocumentsProps {
  tripId: string;
}

export default function TripDocuments({ tripId }: TripDocumentsProps) {
  const [activeFolder, setActiveFolder] = useState<'Bookings' | 'Tickets' | 'Passports' | 'Visas' | 'Other'>('Bookings');
  const [documents, setDocuments] = useState<DocumentFile[]>(() => {
    const saved = localStorage.getItem(`trip_docs_${tripId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'doc-1',
        name: 'Hotel Booking Voucher.pdf',
        category: 'Bookings',
        fileSize: '342 KB',
        uploadedAt: '2026-03-10',
        type: 'application/pdf'
      },
      {
        id: 'doc-2',
        name: 'Flight Ticket.pdf',
        category: 'Tickets',
        fileSize: '1.2 MB',
        uploadedAt: '2026-03-12',
        type: 'application/pdf'
      },
      {
        id: 'doc-3',
        name: 'My Passport.pdf',
        category: 'Passports',
        fileSize: '2.4 MB',
        uploadedAt: '2026-02-28',
        type: 'application/pdf'
      }
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [previewDoc, setPreviewDoc] = useState<DocumentFile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(`trip_docs_${tripId}`, JSON.stringify(documents));
  }, [documents, tripId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    setUploadFileName(file.name);
    setUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newDoc: DocumentFile = {
              id: Date.now().toString(),
              name: file.name,
              category: activeFolder,
              fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              uploadedAt: new Date().toISOString().split('T')[0],
              type: file.type || 'application/octet-stream'
            };
            setDocuments((prevDocs) => [...prevDocs, newDoc]);
            setUploading(false);
            setUploadFileName('');
            setUploadProgress(0);
          }, 400);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleStartRename = (doc: DocumentFile) => {
    setEditingId(doc.id);
    setEditName(doc.name);
  };

  const handleSaveRename = (id: string) => {
    if (!editName.trim()) return;
    setDocuments(
      documents.map((doc) =>
        doc.id === id ? { ...doc, name: editName.endsWith('.pdf') || editName.includes('.') ? editName : `${editName}.pdf` } : doc
      )
    );
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };

  const handleDownload = (doc: DocumentFile) => {
    // Simulated file download
    const element = document.createElement('a');
    const file = new Blob([`Simulated download for: ${doc.name}\nSize: ${doc.fileSize}\nUploaded: ${doc.uploadedAt}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = doc.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = doc.category === activeFolder;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getFolderCount = (cat: string) => {
    return documents.filter((d) => d.category === cat).length;
  };

  return (
    <div className="trip-documents">
      <div className="documents-layout">
        {/* Left Sidebar - Folders list */}
        <div className="folders-card glass">
          <h3>Secure Vault</h3>
          <div className="folders-list">
            {(['Bookings', 'Tickets', 'Passports', 'Visas', 'Other'] as const).map((folder) => (
              <button
                key={folder}
                className={`folder-btn ${activeFolder === folder ? 'active' : ''}`}
                onClick={() => {
                  setActiveFolder(folder);
                  setEditingId(null);
                }}
              >
                <div className="folder-info">
                  <Folder size={16} />
                  <span>{folder}</span>
                </div>
                <span className="folder-count">{getFolderCount(folder)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right - Documents explorer */}
        <div className="explorer-area">
          <div className="explorer-header">
            <div className="explorer-title">
              <h2>{activeFolder} Folder</h2>
              <p>Securely store and preview travel credentials</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto" style={{ flexWrap: 'wrap' }}>
              <div className="search-wrap" style={{ flex: 1, minWidth: '200px' }}>
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.875rem' }}
                />
              </div>
              <button className="btn-brand" onClick={triggerFileInput}>
                <Upload size={16} /> Upload File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden-file-input"
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              />
            </div>
          </div>

          {/* Upload Progress Area */}
          {uploading && (
            <div className="upload-progress-box glass-strong animate-fade-in">
              <div className="progress-header">
                <span>Uploading {uploadFileName}...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="bar-bg" style={{ height: '6px' }}>
                <div className="bar-fill" style={{ width: `${uploadProgress}%`, background: 'var(--brand-accent)' }} />
              </div>
            </div>
          )}

          {/* Drag & Drop Upload Zone */}
          <div className="upload-dropzone" onClick={triggerFileInput}>
            <div className="upload-icon-wrap">
              <Upload size={32} />
            </div>
            <p>Drag and drop documents here or click to browse</p>
            <span>Supports PDF, Word, Images up to 10MB (Simulated encryption)</span>
          </div>

          {/* Documents Grid */}
          <div className="documents-grid">
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => (
                <div key={doc.id} className="document-card glass">
                  <div className="doc-icon-row">
                    <div className="doc-icon-container">
                      <FileText size={20} />
                    </div>
                  </div>

                  <div className="doc-meta-wrap">
                    {editingId === doc.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => handleSaveRename(doc.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(doc.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="inline-edit-input"
                        autoFocus
                      />
                    ) : (
                      <h4 className="doc-name" onDoubleClick={() => handleStartRename(doc)}>
                        {doc.name}
                      </h4>
                    )}
                    <div className="doc-details">
                      <span>Size: {doc.fileSize}</span>
                      <span>Uploaded: {doc.uploadedAt}</span>
                    </div>
                  </div>

                  <div className="doc-actions-row">
                    <button className="icon-btn" onClick={() => setPreviewDoc(doc)} title="View Document">
                      <Eye size={14} />
                    </button>
                    <button className="icon-btn" onClick={() => handleDownload(doc)} title="Download File">
                      <Download size={14} />
                    </button>
                    <button className="icon-btn" onClick={() => handleStartRename(doc)} title="Rename">
                      <Edit size={14} />
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(doc.id)} title="Delete">
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass text-center" style={{ gridColumn: '1 / -1', padding: 'var(--space-12) 0' }}>
                <Folder size={36} className="text-tertiary" style={{ marginBottom: 'var(--space-2)' }} />
                <h4>No documents found</h4>
                <p className="text-secondary text-sm">Upload tickets, vouchers, or identification papers for quick access during your trip.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewDoc(null)}>
          <div className="preview-modal-content glass-strong" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>Preview: {previewDoc.name}</h3>
              <button className="btn-close-modal" onClick={() => setPreviewDoc(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="preview-body">
              {/* Conditional rendering of beautiful mock templates based on file name or folder */}
              {previewDoc.name.toLowerCase().includes('passport') ? (
                <div className="passport-mock">
                  <div className="passport-header-mock">
                    <span className="passport-title">Passport</span>
                    <span className="passport-nation">Republic of Wanderlust</span>
                  </div>
                  <div className="passport-details-mock">
                    <div className="passport-photo-mock">
                      <Plus size={28} />
                    </div>
                    <div className="passport-grid-fields">
                      <div className="passport-field">
                        <label>Surname</label>
                        <span>EXPLORER</span>
                      </div>
                      <div className="passport-field">
                        <label>Given Names</label>
                        <span>HAPPY TRAVELER</span>
                      </div>
                      <div className="passport-field">
                        <label>Passport No.</label>
                        <span>WL876402</span>
                      </div>
                      <div className="passport-field">
                        <label>Nationality</label>
                        <span>WANDERER</span>
                      </div>
                      <div className="passport-field">
                        <label>Date of Birth</label>
                        <span>15 APR 1995</span>
                      </div>
                      <div className="passport-field">
                        <label>Expiry Date</label>
                        <span>24 OCT 2032</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.625rem', opacity: 0.5, letterSpacing: '2px' }}>
                    P&lt;WNDEXPLORER&lt;&lt;HAPPY&lt;TRAVELER&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                  </div>
                </div>
              ) : previewDoc.name.toLowerCase().includes('ticket') ? (
                <div className="ticket-mock">
                  <div className="ticket-header-mock">
                    <span>BOARDING PASS</span>
                    <span>FLIGHT CO.</span>
                  </div>
                  <div className="ticket-destinations">
                    <div>
                      <span className="ticket-code">HND</span>
                      <p style={{ fontSize: '0.6875rem', opacity: 0.8 }}>Tokyo Haneda</p>
                    </div>
                    <div className="ticket-separator">
                      ✈
                    </div>
                    <div>
                      <span className="ticket-code">CDG</span>
                      <p style={{ fontSize: '0.6875rem', opacity: 0.8 }}>Paris Charles de Gaulle</p>
                    </div>
                  </div>
                  <div className="ticket-grid-fields">
                    <div className="ticket-field">
                      <label>Passenger</label>
                      <span>H. Traveler</span>
                    </div>
                    <div className="ticket-field">
                      <label>Flight</label>
                      <span>FC 282</span>
                    </div>
                    <div className="ticket-field">
                      <label>Seat</label>
                      <span>18K</span>
                    </div>
                    <div className="ticket-field">
                      <label>Gate</label>
                      <span>A12</span>
                    </div>
                  </div>
                </div>
              ) : previewDoc.name.toLowerCase().includes('voucher') ? (
                <div className="voucher-mock">
                  <div className="voucher-header">
                    <h4>HOTEL BOOKING VOUCHER</h4>
                    <span className="badge badge-success">Confirmed</span>
                  </div>
                  <div className="voucher-grid">
                    <div className="voucher-field">
                      <label>Hotel</label>
                      <span>Grand Sakura Hotel, Kyoto</span>
                    </div>
                    <div className="voucher-field">
                      <label>Confirmation Code</label>
                      <span>GSH-98374-KY</span>
                    </div>
                    <div className="voucher-field">
                      <label>Check In</label>
                      <span>2026-03-28</span>
                    </div>
                    <div className="voucher-field">
                      <label>Check Out</label>
                      <span>2026-04-01</span>
                    </div>
                    <div className="voucher-field">
                      <label>Guests</label>
                      <span>2 Adults</span>
                    </div>
                    <div className="voucher-field">
                      <label>Room Type</label>
                      <span>Deluxe Tatami Suite</span>
                    </div>
                  </div>
                  <div className="voucher-barcode">
                    <div className="barcode-lines" />
                    <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>*GSH98374KY*</span>
                  </div>
                </div>
              ) : (
                <div className="glass text-center" style={{ padding: 'var(--space-10) var(--space-6)', width: '100%', maxWidth: '400px' }}>
                  <ShieldAlert size={48} style={{ color: 'var(--brand-primary)', marginBottom: 'var(--space-4)' }} />
                  <h4>Simulated Encryption Lock</h4>
                  <p className="text-secondary text-sm" style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                    This document ({previewDoc.name}) is fully encrypted with AES-256 for travel vault protection.
                  </p>
                  <button className="btn-brand" onClick={() => handleDownload(previewDoc)}>
                    <Download size={14} /> Download to Decrypt
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
