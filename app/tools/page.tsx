import type { Metadata } from "next";
import Link from "next/link";
import { toolRegistry, type ToolCategory } from "@/lib/tools-registry";

export const metadata: Metadata = {
  title: "All Tools",
  description: "Explore the full PDFNova tools ecosystem across PDF, image, document, and QR categories."
};

const categoryLabels: Record<ToolCategory, string> = {
  pdf: "PDF tools",
  image: "Image tools",
  document: "Document tools",
  qr: "QR tools"
};

const pdfTools = toolRegistry.filter((tool) => tool.category === "pdf");
const futureCategoryTools = toolRegistry.filter((tool) => tool.category !== "pdf");

function ToolCard({ href, label, description, icon, active }: { href: string; label: string; description: string; icon: string; active: boolean; }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xl leading-none">{icon}</span>
        {!active ? (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Coming soon
          </span>
        ) : null}
      </div>
      <h3 className="mt-2 text-sm font-semibold text-slate-900">{label}</h3>
      <p className="mt-1 text-xs text-slate-600">{description}</p>
    </>
  );

  if (!active) {
    return <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 opacity-90">{content}</div>;
  }

  return (
    <Link href={href} className="rounded-xl border border-slate-200 bg-white p-3 transition hover:border-brand-400 hover:bg-brand-50">
      {content}
    </Link>
  );
}

export default function ToolsPage() {
  const groupedFuture = (Object.keys(categoryLabels) as ToolCategory[])
    .filter((category) => category !== "pdf")
    .map((category) => ({
      category,
      title: categoryLabels[category],
      tools: futureCategoryTools.filter((tool) => tool.category === category)
    }))
    .filter((group) => group.tools.length > 0);

  return (
    <main className="mx-auto w-full max-w-[1500px] px-4 py-4 sm:px-6 sm:py-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">PDFNova ecosystem</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">All PDFNova Tools</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
          One place to discover active tools and upcoming categories across PDF, image, document, and QR workflows.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-lg font-semibold text-slate-900">All PDF tools</h2>
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pdfTools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-lg font-semibold text-slate-900">Future categories</h2>
        <div className="mt-3 space-y-4">
          {groupedFuture.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{group.title}</h3>
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.tools.map((tool) => (
                  <ToolCard key={tool.href} {...tool} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

