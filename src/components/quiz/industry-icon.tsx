/** Простые монохромные иконки для 7 плиток отраслей на первом шаге квиза (PROJECT.md 5.6). */
export function IndustryIcon({ id, className }: { id: string; className?: string }) {
  const props = {
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    className,
    "aria-hidden": true as const,
  };

  switch (id) {
    case "manufacturing":
      return (
        <svg {...props}>
          <circle cx="16" cy="16" r="5" />
          <path d="M16 4v4M16 24v4M4 16h4M24 16h4M7.5 7.5l2.8 2.8M21.7 21.7l2.8 2.8M24.5 7.5l-2.8 2.8M10.3 21.7l-2.8 2.8" />
        </svg>
      );
    case "warehouse":
      return (
        <svg {...props}>
          <path d="M5 14l11-8 11 8" />
          <path d="M7 13v12h18V13" />
          <path d="M13 25v-7h6v7" />
        </svg>
      );
    case "horeca":
      return (
        <svg {...props}>
          <path d="M9 4v10a4 4 0 0 0 8 0V4" />
          <path d="M13 14v14" />
          <path d="M23 4v9c0 1.7-1.3 3-3 3v12" />
          <path d="M23 4c-1.7 0-3 1.8-3 4s1.3 4 3 4" />
        </svg>
      );
    case "retail":
      return (
        <svg {...props}>
          <path d="M8 11h16l-1.5 15h-13z" />
          <path d="M12 11V9a4 4 0 0 1 8 0v2" />
        </svg>
      );
    case "medical":
      return (
        <svg {...props}>
          <rect x="5" y="5" width="22" height="22" rx="4" />
          <path d="M16 11v10M11 16h10" />
        </svg>
      );
    case "construction":
      return (
        <svg {...props}>
          <path d="M6 18a10 10 0 0 1 20 0" />
          <path d="M4 18h24" />
          <path d="M9 18v4M23 18v4" />
        </svg>
      );
    case "education":
      return (
        <svg {...props}>
          <path d="M4 12l12-6 12 6-12 6z" />
          <path d="M10 15v6c0 1.7 2.7 3 6 3s6-1.3 6-3v-6" />
          <path d="M28 12v8" />
        </svg>
      );
    default:
      return null;
  }
}
