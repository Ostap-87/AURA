import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

const LINK_PATTERN = /\[([^\]]+)\]\((\/[^)]+)\)/g;

/** Renders inline `[text](/path)` links (internal-only) inside a paragraph. */
function renderInline(text: string, keyPrefix: string) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <Link key={`${keyPrefix}-${i++}`} href={match[2]!} className="underline underline-offset-2 hover:text-stone">
        {match[1]}
      </Link>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

/** Renders a blog body: `## ` blocks become headings, others become paragraphs with inline internal links. */
export function RichBody({ body }: { body: string }) {
  return (
    <div className="mt-8 space-y-4">
      {body.split("\n\n").map((block, i) =>
        block.startsWith("## ") ? (
          <h2
            key={i}
            className="mt-10 border-l-4 border-accent pl-4 text-heading-sm font-semibold text-ink first:mt-0"
          >
            {renderInline(block.slice(3), `h-${i}`)}
          </h2>
        ) : (
          <p key={i} className="whitespace-pre-line text-body text-ink">
            {renderInline(block, `p-${i}`)}
          </p>
        ),
      )}
    </div>
  );
}
