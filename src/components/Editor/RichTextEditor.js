import React, { useMemo, useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SuggestionList from './SuggestionList';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full bg-gray-50 animate-pulse rounded-lg" />
});

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Enter content...',
  height = '200px',
  className = ""
}) {
  const quillRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [templates, setTemplates] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/quick-responses");
      const data = await res.json();
      if (data.success) setTemplates(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const suggestionRef = useRef(null);
  const showMenuRef = useRef(false);
  const queryRef = useRef("");

  // Update refs when state changes
  useEffect(() => {
    showMenuRef.current = showMenu;
  }, [showMenu]);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      ['clean'],
    ],
    keyboard: {
      bindings: {
        // We'll handle slash trigger in handleEditorChange for better reliability
        escape: {
          key: 27,
          handler: function() {
            if (showMenuRef.current) {
              setShowMenu(false);
              return false;
            }
            return true;
          }
        },
        up: {
          key: 38,
          handler: function() {
            if (showMenuRef.current && suggestionRef.current) {
               suggestionRef.current.onKeyDown({ event: { key: 'ArrowUp' } });
               return false;
            }
            return true;
          }
        },
        down: {
          key: 40,
          handler: function() {
            if (showMenuRef.current && suggestionRef.current) {
               suggestionRef.current.onKeyDown({ event: { key: 'ArrowDown' } });
               return false;
            }
            return true;
          }
        },
        enter: {
          key: 13,
          handler: function() {
            if (showMenuRef.current && suggestionRef.current) {
               suggestionRef.current.onKeyDown({ event: { key: 'Enter' } });
               return false;
            }
            return true;
          }
        }
      }
    }
  }), []); // Stable modules

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const handleSelect = (template) => {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();
    if (range) {
      // Find the slash index
      const textBefore = quill.getText(0, range.index);
      const slashIndex = textBefore.lastIndexOf('/');
      if (slashIndex !== -1) {
          // Remove the slash and everything after it (the query)
          quill.deleteText(slashIndex, range.index - slashIndex);
          // Insert template content
          quill.clipboard.dangerouslyPasteHTML(slashIndex, template.content);
      }
    }
    setShowMenu(false);
  };

  const handleEditorChange = (content, delta, source, editor) => {
    onChange(content);
    
    // Use a small delay to ensure Quill's selection is fully updated
    setTimeout(() => {
      if (!quillRef.current) return;
      const quill = quillRef.current.getEditor();
      if (!quill) return;

      const range = quill.getSelection();
      if (range) {
        const textBefore = quill.getText(0, range.index);
        const slashIndex = textBefore.lastIndexOf('/');
        
        if (slashIndex !== -1) {
          const textAfterSlash = textBefore.substring(slashIndex + 1);
          const charBeforeSlash = slashIndex > 0 ? textBefore[slashIndex - 1] : ' ';
          
          // Trigger menu if slash is preceded by whitespace or is start of line
          const isPotentialTrigger = charBeforeSlash === ' ' || charBeforeSlash === '\n' || charBeforeSlash === '\t' || slashIndex === 0;
          
          if (isPotentialTrigger && !textAfterSlash.includes(' ')) {
            try {
              const bounds = quill.getBounds(slashIndex);
              const editorBounds = quill.container.getBoundingClientRect();
              
              if (bounds && editorBounds) {
                setMenuPos({
                  top: bounds.top + editorBounds.top + 25,
                  left: bounds.left + editorBounds.left
                });

                if (!showMenuRef.current) {
                  setShowMenu(true);
                }
                setQuery(textAfterSlash);
              }
            } catch (e) {
              console.warn("Failed to calculate menu position:", e);
            }
          } else {
            if (showMenuRef.current) setShowMenu(false);
          }
        } else {
          if (showMenuRef.current) setShowMenu(false);
        }
      } else if (showMenuRef.current) {
        setShowMenu(false);
      }
    }, 0);
  };




  return (
    <div className={`rich-text-editor relative ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleEditorChange}
        modules={modules}
        placeholder={placeholder}
        style={{ height, marginBottom: '50px' }}
      />
      
      {showMenu && (
        <div 
          className="fixed z-[9999]"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          <SuggestionList 
            ref={suggestionRef}
            items={filteredTemplates} 
            command={handleSelect}
          />
        </div>
      )}


      <style jsx global>{`
        .rich-text-editor .ql-container {
          font-family: inherit;
          font-size: 14px;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background: #f8fafc;
        }
        .rich-text-editor .ql-editor {
          min-height: 100px;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}


