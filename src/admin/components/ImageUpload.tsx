import { useState, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface ImageUploadProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  label?: string;
}

function ImageUpload({ currentImage, onImageUploaded, label = 'Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    await uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const uploadFile = async (file: File) => {
    setError('');
    setUploading(true);

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('cms_token');
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        setPreview(data.url);
        onImageUploaded(data.url);
      } else {
        setError(data.error || 'Upload failed');
        setPreview(currentImage || '');
      }
    } catch (err) {
      setError('Network error during upload');
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <label>{label}</label>

      <div
        className="upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: '#f9f9f9',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {preview ? (
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                objectFit: 'contain',
                borderRadius: '4px',
              }}
            />
            {uploading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}>
                Uploading...
              </div>
            )}
          </div>
        ) : (
          <div>
            <p>📁 Click or drag image here</p>
            <p style={{ fontSize: '14px', color: '#666' }}>Max 5MB</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {error && (
        <div style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {preview && !uploading && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            fontSize: '14px',
          }}
        >
          Change Image
        </button>
      )}
    </div>
  );
}

export default ImageUpload;
