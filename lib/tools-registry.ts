export type ToolCategory = "pdf" | "image" | "document" | "qr";

export type ToolRegistryItem = {
  href: string;
  label: string;
  description: string;
  icon: string;
  category: ToolCategory;
  active: boolean;
};

export const toolRegistry: ToolRegistryItem[] = [
  {
    href: "/tools/merge-pdf",
    label: "Merge PDF",
    description: "Combine multiple PDFs into one document.",
    icon: "🧩",
    category: "pdf",
    active: true
  },
  {
    href: "/tools/compress-pdf",
    label: "Compress PDF",
    description: "Reduce PDF file size for faster sharing.",
    icon: "🗜️",
    category: "pdf",
    active: true
  },
  {
    href: "/tools/split-pdf",
    label: "Split PDF",
    description: "Extract pages, ranges, or page groups.",
    icon: "✂️",
    category: "pdf",
    active: true
  },
  {
    href: "/tools/rotate-pdf",
    label: "Rotate PDF",
    description: "Rotate pages with live visual preview.",
    icon: "↻",
    category: "pdf",
    active: true
  },
  {
    href: "/tools/pdf-to-jpg",
    label: "PDF to JPG",
    description: "Convert each PDF page into JPG images.",
    icon: "🖼️",
    category: "image",
    active: true
  },
  {
    href: "/tools/jpg-to-pdf",
    label: "JPG to PDF",
    description: "Turn JPG or PNG images into one PDF.",
    icon: "📄",
    category: "image",
    active: true
  },
  {
    href: "/tools/compress-image",
    label: "Compress Image",
    description: "Compress image files with selectable quality levels.",
    icon: "🖼️",
    category: "image",
    active: true
  },
  {
    href: "/tools/pdf-to-word",
    label: "PDF to Word",
    description: "Convert PDF documents into editable Word files.",
    icon: "📝",
    category: "document",
    active: false
  },
  {
    href: "/tools/word-to-pdf",
    label: "Word to PDF",
    description: "Convert Word files into PDF format.",
    icon: "📘",
    category: "document",
    active: false
  },
  {
    href: "/tools/qr-generator",
    label: "QR Generator",
    description: "Create custom QR codes for links and text.",
    icon: "◻️",
    category: "qr",
    active: false
  },
  {
    href: "/tools/wifi-qr",
    label: "WiFi QR",
    description: "Generate QR codes for WiFi access.",
    icon: "📶",
    category: "qr",
    active: false
  },
  {
    href: "/tools/vcard-qr",
    label: "vCard QR",
    description: "Share contact cards using QR format.",
    icon: "👤",
    category: "qr",
    active: false
  }
];
