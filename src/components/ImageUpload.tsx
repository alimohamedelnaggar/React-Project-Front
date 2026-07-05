import { useState, useRef, useCallback } from 'react';
import { Upload, X, Link, ImageIcon, Loader } from 'lucide-react';
import api from '../api/axios';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showUrl, setShowUrl] = useState(!!value && !value.startsWith('data:') && value.startsWith('http'));
  const [preview, setPreview] = useState(value || null);
  const [uploading, setUploading] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/admin/meals/upload', formData);
      onChange(res.data.data);
    } catch {
      setPreview(null);
      onChange('');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
  }, [handleFile]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const file = e.clipboardData.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
  }, [handleFile]);

  const clear = () => {
    setPreview(null);
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
        Image
      </label>

      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setShowUrl(false)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            !showUrl
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
              : 'bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload
        </button>
        <button
          type="button"
          onClick={() => setShowUrl(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            showUrl
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
              : 'bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
          }`}
        >
          <Link className="w-3.5 h-3.5" /> URL
        </button>
      </div>

      {showUrl ? (
        <input
          type="url"
          value={value}
          onChange={(e) => { onChange(e.target.value); setPreview(e.target.value || null); }}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 input-focus text-sm"
        />
      ) : (
          <div
            onDrop={uploading ? undefined : handleDrop}
            onPaste={uploading ? undefined : handlePaste}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => { if (!uploading) inputRef.current?.click(); }}
          className="relative cursor-pointer group"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center justify-center h-40 rounded-lg border-2 border-dashed border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10">
              <Loader className="w-8 h-8 text-orange-500 animate-spin mb-2" />
              <p className="text-sm text-orange-600 dark:text-orange-400">Uploading image...</p>
            </div>
          ) : preview && !showUrl ? (
            <div className="relative rounded-lg overflow-hidden border border-stone-300 dark:border-stone-600">
              <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clear(); }}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 rounded-lg border-2 border-dashed border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800/50 group-hover:border-orange-400 dark:group-hover:border-orange-500 transition-colors">
              <ImageIcon className="w-8 h-8 text-stone-300 dark:text-stone-500 mb-2" />
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
