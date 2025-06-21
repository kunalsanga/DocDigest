"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  setFile: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ setFile }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFile(file);
      setFileName(file.name);
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 backdrop-blur-sm
      ${isDragActive 
        ? 'border-blue-400 bg-blue-500/20 shadow-2xl transform scale-105' 
        : 'border-white/30 hover:border-white/50 hover:bg-white/5 hover:shadow-xl'
      }`}
    >
      <input {...getInputProps()} />
      {fileName ? (
        <div className="space-y-2">
          <p className="text-white font-medium text-lg">{fileName}</p>
          <p className="text-white/60 text-sm">Click to change file</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-4xl mb-2">📄</div>
          <p className="text-white/90 font-medium text-lg">
            {isDragActive
              ? 'Drop your file here...'
              : 'Drag & drop a PDF or DOCX file here'}
          </p>
          <p className="text-white/60 text-sm">or click to browse</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 