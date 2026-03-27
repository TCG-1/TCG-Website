import type { DashboardIconName } from "@/lib/client-hub";

export function DashboardIcon({
  name,
  className = "h-5 w-5",
}: {
  name: DashboardIconName;
  className?: string;
}) {
  const sharedProps = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "calendar":
      return (
        <svg {...sharedProps}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      );
    case "folder":
      return (
        <svg {...sharedProps}>
          <path d="M3 7.5a2.5 2.5 0 0 1 2.5-2.5H10l2 2h6a2 2 0 0 1 2 2v7.5a2.5 2.5 0 0 1-2.5 2.5h-12A2.5 2.5 0 0 1 3 16.5z" />
        </svg>
      );
    case "chart":
      return (
        <svg {...sharedProps}>
          <path d="M4 19h16" />
          <path d="M7 15V9M12 15V5M17 15v-3" />
        </svg>
      );
    case "help":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2.2-2.5 4" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "logout":
      return (
        <svg {...sharedProps}>
          <path d="M15 16l4-4-4-4" />
          <path d="M19 12H9" />
          <path d="M13 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7" />
        </svg>
      );
    case "spark":
      return (
        <svg {...sharedProps}>
          <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" />
          <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
        </svg>
      );
    case "search":
      return (
        <svg {...sharedProps}>
          <circle cx="11" cy="11" r="6" />
          <path d="M20 20l-4.2-4.2" />
        </svg>
      );
    case "bell":
      return (
        <svg {...sharedProps}>
          <path d="M6 9a6 6 0 1 1 12 0v4l2 2H4l2-2z" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
      );
    case "settings":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.6Z" />
        </svg>
      );
    case "user":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="8.5" r="3.5" />
          <path d="M5 19c1.5-3.6 4.5-5.4 7-5.4s5.5 1.8 7 5.4" />
        </svg>
      );
    case "shield":
      return (
        <svg {...sharedProps}>
          <path d="M12 3l7 3v5c0 4.7-2.9 7.8-7 10-4.1-2.2-7-5.3-7-10V6z" />
          <path d="M9.3 12.1l1.8 1.8 3.6-3.9" />
        </svg>
      );
    case "document":
      return (
        <svg {...sharedProps}>
          <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2z" />
          <path d="M14 3.5v4h4M9 12h6M9 16h6" />
        </svg>
      );
    case "message":
      return (
        <svg {...sharedProps}>
          <path d="M5 6.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-5 3v-3H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "recycle":
      return (
        <svg {...sharedProps}>
          <path d="M8 8l2-4 2 4" />
          <path d="M12 4h4l2 3" />
          <path d="M16 10l4 2-4 2" />
          <path d="M20 12l-2 4h-4" />
          <path d="M12 20l-2 4-2-4" />
          <path d="M8 20H4l-2-3" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...sharedProps}>
          <path d="M13 2L5 14h5l-1 8 8-12h-5z" />
        </svg>
      );
    case "tree":
      return (
        <svg {...sharedProps}>
          <path d="M6 5h5v5H6zM13 5h5v5h-5zM9.5 13h5v5h-5z" />
          <path d="M11 10v3M16 10v3M13 18v3" />
        </svg>
      );
    case "group":
      return (
        <svg {...sharedProps}>
          <circle cx="9" cy="9" r="3" />
          <circle cx="17" cy="10" r="2.5" />
          <path d="M4 19c1.3-3.2 4-4.8 6-4.8S14.7 15.8 16 19" />
          <path d="M14.5 18c.8-2.2 2.5-3.2 4.2-3.2.5 0 1 .1 1.5.3" />
        </svg>
      );
    case "check":
      return (
        <svg {...sharedProps}>
          <path d="M5 12l4 4L19 6" />
        </svg>
      );
    case "play":
      return (
        <svg {...sharedProps}>
          <path d="M9 7l8 5-8 5z" />
        </svg>
      );
    case "download":
      return (
        <svg {...sharedProps}>
          <path d="M12 4v10" />
          <path d="M8 10l4 4 4-4" />
          <path d="M4 20h16" />
        </svg>
      );
    case "book":
      return (
        <svg {...sharedProps}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5A2.5 2.5 0 0 0 17.5 16H6.5A2.5 2.5 0 0 0 4 18.5z" />
          <path d="M8 7h8M8 11h6" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...sharedProps}>
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      );
    case "location":
      return (
        <svg {...sharedProps}>
          <path d="M12 21s6-4.4 6-10a6 6 0 1 0-12 0c0 5.6 6 10 6 10Z" />
          <circle cx="12" cy="11" r="2" />
        </svg>
      );
    case "video":
      return (
        <svg {...sharedProps}>
          <rect x="3" y="6" width="13" height="12" rx="2" />
          <path d="M16 10l5-3v10l-5-3z" />
        </svg>
      );
    case "insight":
      return (
        <svg {...sharedProps}>
          <path d="M12 3v6" />
          <path d="M5.6 7.6l4.2 4.2" />
          <path d="M3 12h6" />
          <path d="M5.6 16.4l4.2-4.2" />
          <path d="M12 15v6" />
          <path d="M14.2 11.8 18.4 7.6" />
          <path d="M15 12h6" />
        </svg>
      );
    case "architecture":
      return (
        <svg {...sharedProps}>
          <path d="M4 20h16" />
          <path d="M6 20V8l6-4 6 4v12" />
          <path d="M9 20v-5h6v5" />
        </svg>
      );
    case "dashboard":
    default:
      return (
        <svg {...sharedProps}>
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="13" y="3" width="8" height="5" rx="1.5" />
          <rect x="13" y="10" width="8" height="11" rx="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" />
        </svg>
      );
  }
}
