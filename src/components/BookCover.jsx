import { useId } from "react";

function wrapTitle(text, maxChars = 14, maxLines = 4) {
  const words = text.split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);

  if (lines.length > maxLines) {
    const trimmed = lines.slice(0, maxLines);
    trimmed[maxLines - 1] = trimmed[maxLines - 1].replace(/\s*\S*$/, "") + "…";
    return trimmed;
  }
  return lines;
}

// "Alexander Hamilton, James Madison & John Jay" doesn't fit on a cover
function shortAuthor(author) {
  if (author.length <= 22) return author;
  const firstAuthor = author.split(/,|&/)[0].trim();
  return `${firstAuthor.split(" ").pop()} et al.`;
}

function PatternShapes({ name, color }) {
  switch (name) {
    case "stripes":
      return <path d="M0 20 L20 0" stroke={color} strokeWidth="3" />;
    case "circles":
      return (
        <circle
          cx="10"
          cy="10"
          r="6"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
        />
      );
    case "grid":
      return <path d="M20 0 V20 M0 20 H20" stroke={color} strokeWidth="1" />;
    case "waves":
      return (
        <path
          d="M0 10 Q5 4 10 10 T20 10"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
        />
      );
    case "diamonds":
      return (
        <path
          d="M10 2 L18 10 L10 18 L2 10 Z"
          fill="none"
          stroke={color}
          strokeWidth="1.2"
        />
      );
    case "dots":
    default:
      return <circle cx="10" cy="10" r="2.5" fill={color} />;
  }
}

export default function BookCover({ book, className = "", size = "md" }) {
  // useId returns things like ":r3:" - colons break url(#...) in some browsers
  const patternId = `pattern-${useId().replace(/:/g, "")}`;
  const { bg, accent, pattern } = book.cover;
  const titleLines = wrapTitle(book.title);
  const titleFontSize = size === "lg" ? 19 : 18;

  const authorLine = shortAuthor(book.author);

  return (
    <svg
      viewBox="0 0 200 300"
      className={`block h-auto w-full rounded-sm shadow-md ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id={patternId}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <PatternShapes name={pattern} color={accent} />
        </pattern>
      </defs>

      <rect width="200" height="300" fill={bg} />
      <rect
        width="200"
        height="300"
        fill={`url(#${patternId})`}
        opacity="0.18"
      />

      {/* spine shadow */}
      <rect width="10" height="300" fill="#000" opacity="0.25" />

      <rect x="24" y="48" width="160" height="150" fill={bg} opacity="0.85" />
      <line x1="34" y1="58" x2="174" y2="58" stroke={accent} strokeWidth="2" />
      <line
        x1="34"
        y1="188"
        x2="174"
        y2="188"
        stroke={accent}
        strokeWidth="2"
      />

      <text
        x="104"
        y={123 - (titleLines.length - 1) * 11}
        textAnchor="middle"
        fill="#fff"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize={titleFontSize}
        fontWeight="bold"
      >
        {titleLines.map((line, i) => (
          <tspan key={i} x="104" dy={i === 0 ? 0 : 22}>
            {line}
          </tspan>
        ))}
      </text>

      <text
        x="104"
        y="262"
        textAnchor="middle"
        fill={accent}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize={authorLine.length > 18 ? 10.5 : 13}
        letterSpacing={authorLine.length > 18 ? 0.5 : 1}
      >
        {authorLine.toUpperCase()}
      </text>
    </svg>
  );
}
