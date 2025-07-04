'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
} from 'lucide-react';
import Image from '@tiptap/extension-image';

const MenuBar = ({ editor }) => {
  // Image input ref for file picker (move to top, before any return)
  const imageInputRef = React.useRef();

  if (!editor) return null;

  const baseBtn =
    'p-2 border rounded hover:bg-gray-100 transition duration-150 text-sm flex items-center justify-center w-9 h-9';

  const activeBtn = 'bg-black text-white';

  const headingLevels = [1, 2, 3, 4, 5, 6];

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);
      // Reset input so same file can be selected again
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${baseBtn} ${editor.isActive('bold') ? activeBtn : ''}`}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${baseBtn} ${editor.isActive('italic') ? activeBtn : ''}`}
        title="Italic"
      >
        <Italic size={18} />
      </button>

      {headingLevels.map((level) => (
        <button
          type="button"
          key={level}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level }).run()
          }
          className={`${baseBtn} ${editor.isActive('heading', { level }) ? activeBtn : ''
            }`}
          title={`Heading ${level}`}
        >
          {level === 1 ? (
            <Heading1 size={18} />
          ) : level === 2 ? (
            <Heading2 size={18} />
          ) : (
            `H${level}`
          )}
        </button>
      ))}

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${baseBtn} ${editor.isActive('bulletList') ? activeBtn : ''
          }`}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${baseBtn} ${editor.isActive('orderedList') ? activeBtn : ''
          }`}
        title="Numbered List"
      >
        <ListOrdered size={18} />
      </button>

      {/* Image upload button */}
      <button
        type="button"
        onClick={handleImageClick}
        className={baseBtn}
        title="Insert Image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-1.5A2.25 2.25 0 015.25 15h13.5a2.25 2.25 0 012.25 2.25v1.5" />
        </svg>
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </button>

    </div>
  );
};

const Tiptap = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Image,
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  return (
    <div className="p-4 border rounded bg-gray-50">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose"
      />
      <pre>{editor?.getHTML()}</pre>
    </div>
  );
};




export default Tiptap;

