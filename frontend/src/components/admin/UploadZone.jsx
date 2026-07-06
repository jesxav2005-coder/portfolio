import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, Trash2, Play } from 'lucide-react';

export const UploadZone = ({ 
  title, 
  accept, 
  maxSizeText, 
  currentFileUrl, 
  fileType, // 'photo' | 'video' | 'pdf'
  onUpload,
  onDelete
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const resolvedFileUrl = currentFileUrl 
    ? (currentFileUrl.startsWith('http') ? currentFileUrl : `${baseUrl}${currentFileUrl}`) 
    : '';

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    if (currentFileUrl) {
      const confirmReplace = window.confirm(
        `Are you sure you want to replace the current ${fileType}? This action will overwrite the existing file.`
      );
      if (!confirmReplace) return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(10); // start indicator

    // Simulate progress while executing actual upload callback
    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 100);

    try {
      const formData = new FormData();
      // Use parameter key appropriate to backend endpoints
      const fieldName = fileType === 'photo' ? 'photo' : fileType === 'video' ? 'video' : 'resume';
      formData.append(fieldName, file);

      await onUpload(formData);
      
      setUploadProgress(100);
      clearInterval(interval);
    } catch (err) {
      clearInterval(interval);
      setError(err.response?.data?.error || 'Failed to upload file. Check constraints.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col transition-colors duration-300">
      <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-4">{title}</h3>

      {/* Preview Zone if File Exists */}
      {currentFileUrl && !isUploading && (
        <div className="mb-4 p-4 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 rounded-xl flex flex-col items-center">
          {fileType === 'photo' && (
            <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-indigo-500">
              <img src={resolvedFileUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          {fileType === 'video' && (
            <div className="w-full max-w-[280px] aspect-video mb-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-black">
              <video src={resolvedFileUrl} controls className="w-full h-full object-cover" />
            </div>
          )}

          {fileType === 'pdf' && (
            <div className="flex items-center gap-3 mb-3 p-3 bg-red-50 dark:bg-red-950/20 text-red-650 rounded-xl">
              <FileText className="w-8 h-8" />
              <div className="text-left">
                <span className="block text-xs font-semibold text-slate-450">Resume uploaded</span>
                <a 
                  href={resolvedFileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs hover:underline font-bold text-red-600 dark:text-red-400"
                >
                  View current PDF
                </a>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={triggerFileInput}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-350 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-red-50 text-red-650 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      {(!currentFileUrl || isUploading) && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`flex-grow border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 min-h-[160px] ${
            dragActive 
              ? 'border-indigo-600 bg-indigo-50/25 dark:bg-indigo-950/10' 
              : 'border-slate-300 hover:border-indigo-500 dark:border-slate-700'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="w-full space-y-3">
              <Upload className="w-8 h-8 text-indigo-500 animate-bounce mx-auto" />
              <span className="text-xs font-semibold text-slate-500">Uploading... {uploadProgress}%</span>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-xs mx-auto">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-150" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-slate-400 mb-3" />
              <p className="text-sm font-semibold text-slate-650 dark:text-slate-300">
                Drag and drop your file here, or <span className="text-indigo-600 dark:text-indigo-400">browse</span>
              </p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 block">
                {maxSizeText} ({accept})
              </span>
            </>
          )}
        </div>
      )}

      {/* Status messages */}
      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
export default UploadZone;
