import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { processPlacementFiles } from '../services/gemini';
import { DashboardData, PlacementRecord } from '../types';

interface FileUploadProps {
  onDataExtracted: (data: DashboardData) => void;
  compact?: boolean;
  existingRecords?: PlacementRecord[];
}

export function FileUpload({ onDataExtracted, compact = false, existingRecords = [] }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      const fileData = await Promise.all(
        files.map(async (file) => {
          return new Promise<{ data: string; mimeType: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ data: reader.result as string, mimeType: file.type });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      const data = await processPlacementFiles(fileData, existingRecords);
      onDataExtracted(data);
      setFiles([]);
    } catch (err) {
      console.error(err);
      setError("Failed to process files. Please try again with clearer documents.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (compact) {
    return (
      <div className="relative">
        <div {...getRootProps()} className="flex items-center gap-2 px-6 py-3 bg-[#8A4FFF] text-white rounded-full hover:bg-[#7A3EEF] transition-colors cursor-pointer shadow-sm">
          <input {...getInputProps()} />
          <span className="text-sm font-bold">
            {files.length > 0 ? `${files.length} files selected` : "Upload new files"}
          </span>
        </div>
        
        {files.length > 0 && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-[100]">
            <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-[10px] text-gray-600 truncate max-w-[180px]">{file.name}</span>
                  <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-gray-600"><X size={12} /></button>
                </div>
              ))}
            </div>
            <button
              onClick={handleUpload}
              disabled={isProcessing}
              className="w-full py-2 bg-[#FFC837] text-[#111111] rounded-full text-xs font-bold hover:bg-[#FACC15] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
              {isProcessing ? "Analyzing..." : "Analyze Now"}
            </button>
            {error && <p className="text-[10px] text-red-600 mt-2">{error}</p>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Ingest Placement Data</h2>
        <p className="text-sm text-gray-500">Upload PDFs, Excel sheets, or images of placement reports.</p>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-10 transition-all cursor-pointer flex flex-col items-center justify-center gap-3",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        )}
      >
        <input {...getInputProps()} />
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <Upload size={24} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">
            {isDragActive ? "Drop files here" : "Click or drag to upload new files"}
          </p>
          <p className="text-xs text-gray-500 mt-1">PDF, XLSX, CSV, PNG, JPG</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Selected Files ({files.length})</h3>
            <button
              onClick={() => setFiles([])}
              className="text-xs text-red-600 hover:underline"
            >
              Clear All
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText size={16} className="text-gray-400 shrink-0" />
                  <span className="text-xs text-gray-600 truncate">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          
          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
              {error}
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={isProcessing}
            className={cn(
              "w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
              isProcessing 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing with Gemini...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Analyze Data
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
