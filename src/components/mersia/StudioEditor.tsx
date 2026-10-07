import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useCallback } from "react";

/* ─────────────────────────────────────────
   Toolbar button helper
───────────────────────────────────────── */
interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  active = false,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // keep focus in editor
        onClick();
      }}
      title={title}
      className={`
        px-2 py-1 rounded-lg text-[10px] font-semibold transition-all select-none
        ${
          active
            ? "bg-gold/20 text-gold border border-gold/40"
            : "text-muted-text hover:text-ink hover:bg-surface-muted/60 border border-transparent"
        }
      `}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="h-4 w-px bg-line-soft mx-0.5 inline-block" />;
}

/* ─────────────────────────────────────────
   Main editor component
───────────────────────────────────────── */
interface StudioEditorProps {
  /** Persisted HTML content */
  content: string;
  /** Called whenever the editor content changes */
  onChange: (html: string) => void;
  placeholder?: string;
}

export function StudioEditor({
  content,
  onChange,
  placeholder = "Start writing your research notes, policy analysis, or executive summary\u2026",
}: StudioEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class: [
          "prose prose-invert prose-xs max-w-none h-full outline-none",
          "text-xs text-ink leading-relaxed font-sans",
          "focus:outline-none",
          "[&_h1]:text-sm [&_h1]:font-bold [&_h1]:text-ink [&_h1]:mb-2 [&_h1]:mt-3",
          "[&_h2]:text-xs [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mb-1.5 [&_h2]:mt-2.5",
          "[&_h3]:text-[11px] [&_h3]:font-semibold [&_h3]:text-muted-text [&_h3]:mb-1 [&_h3]:mt-2",
          "[&_p]:text-xs [&_p]:text-ink [&_p]:mb-1.5 [&_p]:leading-relaxed",
          "[&_ul]:list-disc [&_ul]:pl-4 [&_ul]:text-xs [&_ul]:text-ink [&_ul]:space-y-0.5 [&_ul]:mb-2",
          "[&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:text-xs [&_ol]:text-ink [&_ol]:space-y-0.5 [&_ol]:mb-2",
          "[&_li]:leading-relaxed",
          "[&_strong]:font-semibold [&_strong]:text-ink",
          "[&_em]:italic [&_em]:text-muted-text",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-gold/40 [&_blockquote]:pl-3 [&_blockquote]:text-muted-text [&_blockquote]:italic [&_blockquote]:my-2",
          "[&_code]:bg-surface-muted/60 [&_code]:text-gold [&_code]:px-1 [&_code]:rounded [&_code]:text-[10px] [&_code]:font-mono",
          "[&_pre]:bg-surface-muted/60 [&_pre]:rounded-xl [&_pre]:p-3 [&_pre]:text-[10px] [&_pre]:font-mono [&_pre]:text-gold [&_pre]:overflow-x-auto [&_pre]:my-2",
          "[&_hr]:border-line-soft [&_hr]:my-3",
        ].join(" "),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Sync external content changes (e.g. switching workspaces)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== content) {
      editor.commands.setContent(content, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const isActive = useCallback(
    (type: string, attrs?: Record<string, unknown>) =>
      editor?.isActive(type, attrs) ?? false,
    [editor]
  );

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full rounded-xl border border-line-soft bg-surface-muted/40 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-line-soft bg-surface/60">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={isActive("bold")}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={isActive("italic")}
          title="Italic"
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={isActive("strike")}
          title="Strikethrough"
        >
          <span className="line-through">S</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={isActive("code")}
          title="Inline code"
        >
          {"</>"}
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={isActive("bulletList")}
          title="Bullet list"
        >
          {"\u2022 List"}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={isActive("orderedList")}
          title="Ordered list"
        >
          1. List
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={isActive("blockquote")}
          title="Blockquote"
        >
          {"\u275d"}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={isActive("codeBlock")}
          title="Code block"
        >
          Code
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal rule"
        >
          {"\u2500 Rule"}
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          {"\u21a9"}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          {"\u21aa"}
        </ToolbarButton>
      </div>

      {/* Editor content */}
      <div
        className="flex-1 overflow-y-auto p-3 relative"
        onClick={() => editor.commands.focus()}
      >
        {editor.isEmpty && (
          <p className="absolute top-3 left-3 right-3 text-xs text-muted-text/50 pointer-events-none select-none leading-relaxed">
            {placeholder}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
