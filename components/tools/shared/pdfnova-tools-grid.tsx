import Link from "next/link";
import { toolRegistry } from "@/lib/tools-registry";

const TOOL_LINKS = toolRegistry.filter((tool) => tool.active);

type PdfNovaToolsGridProps = {
  currentToolHref?: string;
};

export function PdfNovaToolsGrid({ currentToolHref }: PdfNovaToolsGridProps) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">PDFNova Tools</h2>
        <Link href="/tools" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
          View all
        </Link>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {TOOL_LINKS.map((tool) => {
          const isCurrent = tool.href === currentToolHref;

          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={`rounded-xl border p-3 transition ${
                isCurrent
                  ? "border-brand-500 bg-brand-50"
                  : "border-slate-200 bg-slate-50 hover:border-brand-400 hover:bg-white"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-base leading-none">{tool.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{tool.label}</p>
                  <p className="mt-1 text-xs text-slate-600">{tool.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
