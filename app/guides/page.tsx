import type { Metadata } from "next";
import Link from "next/link";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "PDF Guides",
  description: "Learn how to merge, compress, split, rotate, and convert PDFs with quick step-by-step guides.",
  canonicalPath: "/guides"
});

const guides = [
  { href: "/guides/merge-pdf-files", title: "Merge PDF files" },
  { href: "/guides/combine-pdf-pages", title: "Combine PDF pages" },
  { href: "/guides/merge-pdf-online-free", title: "Merge PDF online free" },
  { href: "/guides/merge-pdf-without-software", title: "Merge PDF without software" },
  { href: "/guides/merge-pdf-for-email", title: "Merge PDF for email" },
  { href: "/guides/merge-pdf-on-mac", title: "Merge PDF on Mac" },
  { href: "/guides/merge-pdf-on-windows", title: "Merge PDF on Windows" },
  { href: "/guides/compress-pdf-without-losing-quality", title: "Compress PDF without losing quality" },
  { href: "/guides/compress-pdf-for-email", title: "Compress PDF for email" },
  { href: "/guides/split-pdf-by-range", title: "Split PDF by range" },
  { href: "/guides/split-pdf-into-pages", title: "Split PDF into pages" },
  { href: "/guides/rotate-pdf-pages", title: "Rotate PDF pages" },
  { href: "/guides/pdf-pages-to-jpg", title: "Convert PDF pages to JPG" },
  { href: "/guides/convert-pdf-to-jpg-online", title: "Convert PDF to JPG online" },
  { href: "/guides/combine-images-into-pdf", title: "Combine images into PDF" },
  { href: "/guides/pdf-to-word", title: "PDF to Word" },
  { href: "/guides/convert-pdf-to-word", title: "Convert PDF to Word" },
  { href: "/guides/word-to-pdf", title: "Word to PDF" },
  { href: "/guides/convert-word-to-pdf", title: "Convert Word to PDF" },
  { href: "/guides/remove-pages-from-pdf", title: "Remove pages from PDF" },
  { href: "/guides/password-protect-pdf", title: "Password protect PDF" },
  { href: "/guides/protect-pdf-for-email", title: "Protect PDF for email" },
  { href: "/guides/how-to-lock-a-pdf-file", title: "How to lock a PDF file" },
  { href: "/guides/unlock-pdf", title: "Unlock PDF" },
  { href: "/guides/remove-password-from-pdf", title: "Remove password from PDF" },
  { href: "/guides/unlock-pdf-for-printing", title: "Unlock PDF for printing" },
  { href: "/guides/pdf-to-excel", title: "PDF to Excel" },
  { href: "/guides/convert-pdf-to-excel", title: "Convert PDF to Excel" },
  { href: "/guides/excel-to-pdf", title: "Excel to PDF" },
  { href: "/guides/convert-excel-to-pdf", title: "Convert Excel to PDF" },
  { href: "/guides/pdf-to-powerpoint", title: "PDF to PowerPoint" },
  { href: "/guides/convert-pdf-to-powerpoint", title: "Convert PDF to PowerPoint" },
  { href: "/guides/powerpoint-to-pdf", title: "PowerPoint to PDF" },
  { href: "/guides/convert-powerpoint-to-pdf", title: "Convert PowerPoint to PDF" }
];

export default function GuidesHubPage() {
  return (
    <main className="mx-auto w-full max-w-[1000px] px-4 py-6 sm:px-6 sm:py-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">PDF Guides</h1>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Learn how to merge, compress, split and convert PDFs with practical browser-first workflows.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ul className="grid gap-2 sm:grid-cols-2">
          {guides.map((guide) => (
            <li key={guide.href}>
              <Link
                href={guide.href}
                className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-400 hover:bg-white hover:text-brand-700"
              >
                {guide.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
