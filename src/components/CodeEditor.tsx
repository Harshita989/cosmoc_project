// 'use client';

// import { useState } from 'react';
// import { Editor } from '@monaco-editor/react';
// import { FileText, Save, Play } from 'lucide-react';

// interface CodeEditorProps {
//   filename: string;
//   content: string;
//   onChange: (content: string) => void;
// }

// export function CodeEditor({ filename, content, onChange }: CodeEditorProps) {
//   const [isEditorReady, setIsEditorReady] = useState(false);

//   const getLanguageFromFilename = (filename: string) => {
//     const ext = filename.split('.').pop()?.toLowerCase();
//     switch (ext) {
//       case 'js':
//       case 'jsx':
//         return 'javascript';
//       case 'ts':
//       case 'tsx':
//         return 'typescript';
//       case 'py':
//         return 'python';
//       case 'java':
//         return 'java';
//       case 'cpp':
//       case 'cc':
//         return 'cpp';
//       case 'c':
//         return 'c';
//       case 'css':
//         return 'css';
//       case 'html':
//         return 'html';
//       case 'json':
//         return 'json';
//       case 'md':
//         return 'markdown';
//       default:
//         return 'plaintext';
//     }
//   };

//   const handleEditorDidMount = () => {
//     setIsEditorReady(true);
//   };

//   return (
//     <div className="flex flex-col h-full">
//       {/* Editor Header */}
//       <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center gap-2">
//           <FileText className="w-4 h-4 text-gray-500" />
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             {filename}
//           </span>
//         </div>
//         <div className="flex items-center gap-2">
//           <button className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
//             <Save className="w-3 h-3" />
//             Saved
//           </button>
//           <button className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
//             <Play className="w-3 h-3" />
//             Run
//           </button>
//         </div>
//       </div>

//       {/* Monaco Editor */}
//       <div className="flex-1">
//         <Editor
//           height="100%"
//           language={getLanguageFromFilename(filename)}
//           value={content}
//           onChange={(value) => onChange(value || '')}
//           onMount={handleEditorDidMount}
//           theme="vs-dark"
//           options={{
//             fontSize: 14,
//             lineNumbers: 'on',
//             roundedSelection: false,
//             scrollBeyondLastLine: false,
//             automaticLayout: true,
//             minimap: { enabled: false },
//             wordWrap: 'on',
//             tabSize: 2,
//             insertSpaces: true,
//             renderWhitespace: 'selection',
//             cursorBlinking: 'smooth',
//             cursorSmoothCaretAnimation: 'on',
//             smoothScrolling: true,
//             contextmenu: true,
//             mouseWheelZoom: true,
//             suggest: {
//               showKeywords: true,
//               showSnippets: true,
//             },
//             quickSuggestions: {
//               other: true,
//               comments: false,
//               strings: true,
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// }



'use client';

import { useState, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { FileText, Save, Play, X } from 'lucide-react';

interface CodeEditorProps {
  filename: string;
  content: string;
  onChange: (content: string) => void;
}

export function CodeEditor({ filename, content, onChange }: CodeEditorProps) {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [output, setOutput] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getLanguageFromFilename = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
      case 'cc':
        return 'cpp';
      case 'c':
        return 'c';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  const handleEditorDidMount = () => {
    setIsEditorReady(true);
  };

  const handleRun = () => {
    const lang = getLanguageFromFilename(filename);
    setShowOutput(true);

    if (lang === 'html') {
      // Render HTML in iframe
      const iframe = iframeRef.current;
      if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(content);
          doc.close();
        }
      }
      setOutput('');
    } else if (lang === 'javascript') {
      // Run JS and capture console output
      try {
        const logs: string[] = [];
        const customConsole = {
          log: (...args: any[]) => logs.push(args.join(' ')),
          error: (...args: any[]) => logs.push('Error: ' + args.join(' ')),
        };
        const func = new Function('console', content);
        func(customConsole);
        setOutput(logs.join('\n') || '✅ Code ran successfully (no output)');
      } catch (err: any) {
        setOutput('❌ Error: ' + err.message);
      }
    } else {
      setOutput('⚠️ Run currently supports only JavaScript and HTML files.');
    }
  };

  return (
    <div className="flex h-full transition-all">
      {/* Left: Editor Section */}
      <div
        className={`flex flex-col ${
          showOutput ? 'w-1/2' : 'w-full'
        } transition-all duration-300`}
      >
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {filename}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
              <Save className="w-3 h-3" />
              Saved
            </button>
            <button
              onClick={handleRun}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              <Play className="w-3 h-3" />
              Run
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            language={getLanguageFromFilename(filename)}
            value={content}
            onChange={(value) => onChange(value || '')}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              minimap: { enabled: false },
              wordWrap: 'on',
              tabSize: 2,
              insertSpaces: true,
              renderWhitespace: 'selection',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              contextmenu: true,
              mouseWheelZoom: true,
              suggest: {
                showKeywords: true,
                showSnippets: true,
              },
              quickSuggestions: {
                other: true,
                comments: false,
                strings: true,
              },
            }}
          />
        </div>
      </div>

      {/* Right: Output / Preview Panel */}
      {showOutput && (
        <div className="w-1/2 border-l border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 relative">
          {/* Close button */}
          <button
            onClick={() => setShowOutput(false)}
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
            Close
          </button>

          {/* Output content */}
          <div className="h-full p-3 overflow-auto">
            {getLanguageFromFilename(filename) === 'html' ? (
              <iframe
                ref={iframeRef}
                className="w-full h-full bg-white rounded"
                title="output"
              />
            ) : (
              <pre className="text-sm text-green-500 whitespace-pre-wrap">
                {output}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
