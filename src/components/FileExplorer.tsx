'use client';

import { useState } from 'react';
import { FileText, Folder, Plus, Trash2, Edit3, Check, X } from 'lucide-react';

interface FileExplorerProps {
  files: Record<string, string>;
  activeFile: string;
  onFileSelect: (filename: string) => void;
  onFileUpdate: (filename: string, content: string) => void;
}

export function FileExplorer({ files, activeFile, onFileSelect, onFileUpdate }: FileExplorerProps) {
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [editingFile, setEditingFile] = useState<string | null>(null);

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return <FileText className="w-4 h-4" />;
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const filename = newFileName.includes('.') ? newFileName : `${newFileName}.js`;
      onFileUpdate(filename, '// New file\n');
      setNewFileName('');
      setIsCreatingFile(false);
    }
  };

  const handleDeleteFile = (filename: string) => {
    if (Object.keys(files).length > 1) {
      const newFiles = { ...files };
      delete newFiles[filename];
      // Update all files except the deleted one
      Object.keys(newFiles).forEach(key => {
        onFileUpdate(key, newFiles[key]);
      });
      // Select the first remaining file
      const remainingFiles = Object.keys(newFiles);
      if (remainingFiles.length > 0) {
        onFileSelect(remainingFiles[0]);
      }
    }
  };

  const handleRenameFile = (oldName: string, newName: string) => {
    if (newName.trim() && newName !== oldName) {
      const content = files[oldName];
      const newFiles = { ...files };
      delete newFiles[oldName];
      newFiles[newName] = content;
      
      // Update all files
      Object.keys(newFiles).forEach(key => {
        onFileUpdate(key, newFiles[key]);
      });
      
      onFileSelect(newName);
      setEditingFile(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Files
          </h3>
          <button
            onClick={() => setIsCreatingFile(true)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className="p-2 space-y-1">
          {Object.keys(files).map((filename) => (
            <div
              key={filename}
              className={`group flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                activeFile === filename ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''
              }`}
            >
              {editingFile === filename ? (
                <div className="flex items-center gap-1 flex-1">
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleRenameFile(filename, newFileName);
                      } else if (e.key === 'Escape') {
                        setEditingFile(null);
                        setNewFileName('');
                      }
                    }}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    autoFocus
                  />
                  <button
                    onClick={() => handleRenameFile(filename, newFileName)}
                    className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                  >
                    <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingFile(null);
                      setNewFileName('');
                    }}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                  >
                    <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              ) : (
                <>
                  {getFileIcon(filename)}
                  <button
                    onClick={() => onFileSelect(filename)}
                    className="flex-1 text-left text-sm truncate"
                  >
                    {filename}
                  </button>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingFile(filename);
                        setNewFileName(filename);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Edit3 className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </button>
                    {Object.keys(files).length > 1 && (
                      <button
                        onClick={() => handleDeleteFile(filename)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                      >
                        <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create File Input */}
      {isCreatingFile && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFile();
                } else if (e.key === 'Escape') {
                  setIsCreatingFile(false);
                  setNewFileName('');
                }
              }}
              placeholder="filename.js"
              className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              autoFocus
            />
            <button
              onClick={handleCreateFile}
              className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded"
            >
              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
            </button>
            <button
              onClick={() => {
                setIsCreatingFile(false);
                setNewFileName('');
              }}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
            >
              <X className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
