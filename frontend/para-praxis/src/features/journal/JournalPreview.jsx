import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Preview-only surface. Keeps code and prose styling out of the page.
export function JournalPreview({ content }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 prose prose-invert max-w-none prose-headings:font-semibold prose-p:leading-relaxed prose-pre:bg-slate-900/70 prose-code:bg-slate-800/60 prose-code:px-1 prose-code:py-0.5 prose-li:my-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="mt-0 mb-4 text-3xl border-b border-slate-700 pb-2" {...props} />,
          h2: (props) => <h2 className="mt-8 mb-3 text-2xl border-b border-slate-800 pb-1" {...props} />,
          h3: (props) => <h3 className="mt-6 mb-2 text-xl" {...props} />,
          code: ({ inline, children, ...props }) =>
            !inline ? (
              <pre className="rounded-md p-3 text-sm overflow-x-auto bg-slate-900/80" {...props}>
                <code>{children}</code>
              </pre>
            ) : (
              <code className="rounded bg-slate-800/60 px-1 py-0.5" {...props}>
                {children}
              </code>
            ),
          blockquote: (props) => <blockquote className="border-l-4 border-indigo-500/60 pl-4 italic bg-slate-900/40 py-1" {...props} />,
          ul: (props) => <ul className="list-disc pl-6 space-y-1" {...props} />,
          ol: (props) => <ol className="list-decimal pl-6 space-y-1" {...props} />,
          li: (props) => <li className="marker:text-indigo-400" {...props} />,
          hr: () => <hr className="my-6 border-slate-700" />,
          a: (props) => <a className="text-indigo-400 hover:underline" target="_blank" rel="noreferrer" {...props} />,
        }}
      >
        {content || "*Nothing to preview yet...*"}
      </ReactMarkdown>
    </div>
  );
}
