'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] max-w-none',
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-3 flex flex-wrap gap-2 bg-gray-50">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1.5 rounded transition ${
              editor.isActive('bold')
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1.5 rounded transition ${
              editor.isActive('italic')
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-3 py-1.5 rounded transition ${
              editor.isActive('underline')
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-3 py-1.5 rounded transition ${
              editor.isActive('strike')
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1.5 rounded transition ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Heading 1"
          >
            H1
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1.5 rounded transition ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Heading 2"
          >
            H2
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1.5 rounded transition ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Heading 3"
          >
            H3
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`px-3 py-1.5 rounded transition ${
              editor.isActive('paragraph')
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Paragraph"
          >
            P
          </button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1.5 rounded transition ${
              editor.isActive('bulletList')
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Bullet List"
          >
            • List
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1.5 rounded transition ${
              editor.isActive('orderedList')
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Numbered List"
          >
            1. List
          </button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-3 py-1.5 rounded transition ${
              editor.isActive({ textAlign: 'left' })
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Align Left"
          >
            ⬅️
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-3 py-1.5 rounded transition ${
              editor.isActive({ textAlign: 'center' })
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Align Center"
          >
            ↔️
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-3 py-1.5 rounded transition ${
              editor.isActive({ textAlign: 'right' })
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Align Right"
          >
            ➡️
          </button>
        </div>

        {/* Links & Images */}
        <div className="flex gap-1 border-r pr-2">
          <button
            type="button"
            onClick={addLink}
            className={`px-3 py-1.5 rounded transition ${
              editor.isActive('link')
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Add Link"
          >
            🔗 Link
          </button>

          {editor.isActive('link') && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="px-3 py-1.5 rounded bg-red-100 border border-red-300 hover:bg-red-200 transition"
              title="Remove Link"
            >
              🔗✖️
            </button>
          )}

          <button
            type="button"
            onClick={addImage}
            className="px-3 py-1.5 rounded bg-white border border-gray-300 hover:bg-gray-100 transition"
            title="Add Image"
          >
            🖼️ Image
          </button>
        </div>

        {/* Block Elements */}
        <div className="flex gap-1 border-r pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-3 py-1.5 rounded transition ${
              editor.isActive('blockquote')
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Quote"
          >
            " Quote
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="px-3 py-1.5 rounded bg-white border border-gray-300 hover:bg-gray-100 transition"
            title="Horizontal Line"
          >
            ― Line
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="px-3 py-1.5 rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Undo (Ctrl+Z)"
          >
            ↶
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="px-3 py-1.5 rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Redo (Ctrl+Y)"
          >
            ↷
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
      
    </div>
  );
}