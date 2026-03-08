"use client";

import Link from "next/link";
import { toolRegistry } from "@/lib/tools-registry";
import { brand } from "@/lib/brand";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslation } from "@/components/i18n-provider";

const primaryNavKeys = [
  { href: "/tools/merge-pdf", key: "navMerge" as const },
  { href: "/tools/compress-pdf", key: "navCompress" as const },
  { href: "/tools/split-pdf", key: "navSplit" as const },
  { href: "/tools/pdf-to-jpg", key: "navConvert" as const },
  { href: "/tools/qr-generator", key: "navQr" as const },
  { href: "/tools", key: "navAllTools" as const }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const activeTools = toolRegistry.filter((tool) => tool.active);
  const panelPdfTools = toolRegistry.filter((tool) => tool.category === "pdf");
  const panelImageTools = toolRegistry.filter((tool) => tool.category === "image");
  const panelQrTools = toolRegistry.filter((tool) => tool.category === "qr");

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1620px] items-center gap-2 px-2 py-1.5 sm:px-3 lg:px-4">
          <Link
            href="/"
            className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-900 transition hover:border-brand-300"
          >
            <span className="block text-xl font-black leading-none tracking-tight">{brand.name}</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-wide text-slate-500 xl:block">
              {t("browserFirst")}
            </span>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
            {primaryNavKeys.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1">
            <LanguageSelector compact />

            <details className="group relative">
              <summary className="flex h-9 cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-brand-500 hover:text-brand-700">
                <span>{t("toolsMenu")}</span>
                <span className="grid grid-cols-3 gap-0.5">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={`dot-${i}`} className="h-1 w-1 rounded-full bg-current" />
                  ))}
                </span>
              </summary>

              <div className="invisible absolute right-0 mt-2 w-[min(95vw,560px)] rounded-xl border border-slate-200 bg-white p-3 opacity-0 shadow-xl transition group-open:visible group-open:opacity-100">
                <header className="mb-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-900">{t("toolsMenu")}</p>
                  <p className="mt-1 text-xs text-slate-600">{t("toolsMenuHint")}</p>
                </header>

                <div className="space-y-3">
                  <section>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {t("pdfToolsLabel")}
                    </h3>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {panelPdfTools.map((tool) => (
                        <div key={tool.href}>
                          {tool.active ? (
                            <Link
                              href={tool.href}
                              className="block rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-800"
                            >
                              <p className="font-semibold">{t(tool.labelKey)}</p>
                              <p className="mt-0.5 text-[11px] text-slate-500">{t(tool.descriptionKey)}</p>
                            </Link>
                          ) : (
                            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
                              <p className="font-semibold">{t(tool.labelKey)}</p>
                              <p className="mt-0.5 text-[11px]">{t("comingSoon")}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {t("imageToolsLabel")}
                    </h3>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {panelImageTools.map((tool) => (
                        <div key={tool.href}>
                          {tool.active ? (
                            <Link
                              href={tool.href}
                              className="block rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-800"
                            >
                              <p className="font-semibold">{t(tool.labelKey)}</p>
                              <p className="mt-0.5 text-[11px] text-slate-500">{t(tool.descriptionKey)}</p>
                            </Link>
                          ) : (
                            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
                              <p className="font-semibold">{t(tool.labelKey)}</p>
                              <p className="mt-0.5 text-[11px]">{t("comingSoon")}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {t("qrToolsLabel")}
                    </h3>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {panelQrTools.map((tool) => (
                        <div key={tool.href}>
                          {tool.active ? (
                            <Link
                              href={tool.href}
                              className="block rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-800"
                            >
                              <p className="font-semibold">{t(tool.labelKey)}</p>
                              <p className="mt-0.5 text-[11px] text-slate-500">{t(tool.descriptionKey)}</p>
                            </Link>
                          ) : (
                            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
                              <p className="font-semibold">{t(tool.labelKey)}</p>
                              <p className="mt-0.5 text-[11px]">{t("comingSoon")}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </details>
          </div>
        </div>
      </header>

      {children}

      <footer className="mt-5 border-t border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-[1620px] gap-5 px-2 py-7 sm:grid-cols-2 sm:px-3 lg:grid-cols-4 lg:px-4">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">{t("product")}</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:text-slate-900">
                  {brand.name}
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-slate-900">
                  {t("allTools")}
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">{t("tools")}</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              {activeTools.map((item) => (
                <li key={`footer-${item.href}`}>
                  <Link href={item.href} className="hover:text-slate-900">
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">{t("legal")}</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li>
                <Link href="/privacy-policy" className="hover:text-slate-900">
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-slate-900">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-slate-900">
                  {t("cookies")}
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-slate-900">
                  {t("security")}
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">{t("company")}</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li>
                <Link href="/about" className="hover:text-slate-900">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-900">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </footer>
    </>
  );
}
