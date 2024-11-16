import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading1,
  Heading2,
} from 'lucide-react';

interface Props {
  content: string;
  onChange: (content: string) => void;
}

export const RichTextEditor: React.FC<Props> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const toggleLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
          }`}
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
          }`}
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('bold') ? 'bg-gray-200' : ''
          }`}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('italic') ? 'bg-gray-200' : ''
          }`}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('strike') ? 'bg-gray-200' : ''
          }`}
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('bulletList') ? 'bg-gray-200' : ''
          }`}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('orderedList') ? 'bg-gray-200' : ''
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button
          type="button"
          onClick={toggleLink}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('link') ? 'bg-gray-200' : ''
          }`}
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4" />
    </div>
  );
};