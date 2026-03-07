import type { TranslationKey } from "@/lib/i18n";

export type ToolCategory = "pdf" | "image" | "document" | "qr";

export type ToolRegistryItem = {
  href: string;
  labelKey: TranslationKey;
  descriptionKey: TranslationKey;
  label: string;
  description: string;
  icon: string;
  category: ToolCategory;
  active: boolean;
};

export const toolRegistry: ToolRegistryItem[] = [
  {
    href: "/tools/merge-pdf",
    labelKey: "toolMergePdfLabel",
    descriptionKey: "toolMergePdfDescription",
    label: "Merge PDF",
    description: "Combine multiple PDFs into one document.",
    icon: "MERGE",
    category: "pdf",
    active: true
  },
  {
    href: "/tools/compress-pdf",
    labelKey: "toolCompressPdfLabel",
    descriptionKey: "toolCompressPdfDescription",
    label: "Compress PDF",
    description: "Reduce PDF file size for faster sharing.",
    icon: "SIZE",
    category: "pdf",
    active: true
  },
  {
    href: "/tools/split-pdf",
    labelKey: "toolSplitPdfLabel",
    descriptionKey: "toolSplitPdfDescription",
    label: "Split PDF",
    description: "Extract pages, ranges, or page groups.",
    icon: "SPLIT",
    category: "pdf",
    active: true
  },
  {
    href: "/tools/rotate-pdf",
    labelKey: "toolRotatePdfLabel",
    descriptionKey: "toolRotatePdfDescription",
    label: "Rotate PDF",
    description: "Rotate pages with live visual preview.",
    icon: "ROTATE",
    category: "pdf",
    active: true
  },
  {
    href: "/tools/pdf-to-jpg",
    labelKey: "toolPdfToJpgLabel",
    descriptionKey: "toolPdfToJpgDescription",
    label: "PDF to JPG",
    description: "Convert each PDF page into JPG images.",
    icon: "PDF->JPG",
    category: "image",
    active: true
  },
  {
    href: "/tools/jpg-to-pdf",
    labelKey: "toolJpgToPdfLabel",
    descriptionKey: "toolJpgToPdfDescription",
    label: "JPG to PDF",
    description: "Turn JPG or PNG images into one PDF.",
    icon: "JPG->PDF",
    category: "image",
    active: true
  },
  {
    href: "/tools/compress-image",
    labelKey: "toolCompressImageLabel",
    descriptionKey: "toolCompressImageDescription",
    label: "Compress Image",
    description: "Compress image files with selectable quality levels.",
    icon: "IMG",
    category: "image",
    active: true
  },
  {
    href: "/tools/pdf-to-word",
    labelKey: "toolPdfToWordLabel",
    descriptionKey: "toolPdfToWordDescription",
    label: "PDF to Word",
    description: "Convert PDF documents into editable Word files.",
    icon: "PDF->DOC",
    category: "document",
    active: false
  },
  {
    href: "/tools/word-to-pdf",
    labelKey: "toolWordToPdfLabel",
    descriptionKey: "toolWordToPdfDescription",
    label: "Word to PDF",
    description: "Convert Word files into PDF format.",
    icon: "DOC->PDF",
    category: "document",
    active: false
  },
  {
    href: "/tools/qr-generator",
    labelKey: "toolQrGeneratorLabel",
    descriptionKey: "toolQrGeneratorDescription",
    label: "QR Generator",
    description: "Create custom QR codes for links and text.",
    icon: "QR",
    category: "qr",
    active: true
  },
  {
    href: "/tools/wifi-qr",
    labelKey: "toolWifiQrLabel",
    descriptionKey: "toolWifiQrDescription",
    label: "WiFi QR",
    description: "Generate QR codes for WiFi access.",
    icon: "WIFI",
    category: "qr",
    active: false
  },
  {
    href: "/tools/vcard-qr",
    labelKey: "toolVcardQrLabel",
    descriptionKey: "toolVcardQrDescription",
    label: "vCard QR",
    description: "Share contact cards using QR format.",
    icon: "VCARD",
    category: "qr",
    active: false
  }
];
