"use client";

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

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const baseBtn =
    'p-2 border rounded hover:bg-gray-100 transition duration-150 text-sm flex items-center justify-center w-9 h-9';

  const activeBtn = 'bg-black text-white';

  const headingLevels = [1, 2, 3, 4, 5, 6];

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
          className={`${baseBtn} ${editor.isActive('heading', { level }) ? activeBtn : ''}`}
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
        className={`${baseBtn} ${editor.isActive('bulletList') ? activeBtn : ''}`}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${baseBtn} ${editor.isActive('orderedList') ? activeBtn : ''}`}
        title="Numbered List"
      >
        <ListOrdered size={18} />
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
        className="prose min-h-[300px] w-full border p-4 rounded bg-white focus:outline-none"
      />
    </div>
  );
};

export default Tiptap; 