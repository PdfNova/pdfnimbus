import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { brand } from "@/lib/brand";
import { toolRegistry } from "@/lib/tools-registry";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: brand.name,
    template: `%s | ${brand.name}`
  },
  description: brand.description,
  openGraph: {
    title: brand.name,
    description: brand.description,
    siteName: brand.name,
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "PDFNova"
      }
    ]
  }
};

const primaryNav = [
  { href: "/tools/merge-pdf", label: "Merge" },
  { href: "/tools/compress-pdf", label: "Compress" },
  { href: "/tools/split-pdf", label: "Split" },
  { href: "/tools/pdf-to-jpg", label: "Convert" },
  { href: "/tools", label: "QR" }
] as const;

const panelPdfTools = toolRegistry.filter((tool) => tool.category === "pdf");
const panelQrTools = toolRegistry.filter((tool) => tool.category === "qr");

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">
        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        ) : null}

        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1300px] items-center gap-4 px-4 py-2.5 sm:px-6">
            <Link href="/" className="shrink-0 text-xl font-bold tracking-tight text-slate-900">
              {brand.name}
            </Link>

            <nav className="hidden min-w-0 flex-1 items-center justify-center gap-2 lg:flex">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <select
                defaultValue="en"
                className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-brand-500"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>

              <details className="relative">
                <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:border-brand-500 hover:text-brand-700">
                  <span className="grid grid-cols-3 gap-0.5">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <span key={`dot-${i}`} className="h-1 w-1 rounded-full bg-current" />
                    ))}
                  </span>
                </summary>

                <div className="absolute right-0 mt-2 w-[330px] rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    PDF tools
                  </h3>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {panelPdfTools.map((tool) => (
                      <div key={tool.href}>
                        {tool.active ? (
                          <Link
                            href={tool.href}
                            className="block rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-800"
                          >
                            <span className="mr-1.5">{tool.icon}</span>
                            {tool.label}
                          </Link>
                        ) : (
                          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-500">
                            <span className="mr-1.5">{tool.icon}</span>
                            {tool.label}
                            <span className="ml-2 text-[10px] uppercase tracking-wide">Soon</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    QR tools
                  </h3>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {panelQrTools.map((tool) => (
                      <div
                        key={tool.href}
                        className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-500"
                      >
                        <span className="mr-1.5">{tool.icon}</span>
                        {tool.label}
                        <span className="ml-2 text-[10px] uppercase tracking-wide">Soon</span>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          </div>
        </header>

        {children}

        <footer className="mt-10 border-t border-slate-200 bg-white">
          <div className="mx-auto grid w-full max-w-[1300px] gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Product</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li><Link href="/" className="hover:text-slate-900">{brand.name}</Link></li>
                <li><Link href="/tools" className="hover:text-slate-900">All Tools</Link></li>
              </ul>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Tools</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {panelPdfTools.filter((tool) => tool.active).map((item) => (
                  <li key={`footer-${item.href}`}>
                    <Link href={item.href} className="hover:text-slate-900">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Legal</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li><Link href="/privacy-policy" className="hover:text-slate-900">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-slate-900">Terms and Conditions</Link></li>
                <li><Link href="/cookies" className="hover:text-slate-900">Cookies</Link></li>
                <li><Link href="/security" className="hover:text-slate-900">Security</Link></li>
              </ul>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Company</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li><Link href="/about" className="hover:text-slate-900">About</Link></li>
                <li><Link href="/contact" className="hover:text-slate-900">Contact</Link></li>
              </ul>
            </section>
          </div>
        </footer>
      </body>
    </html>
  );
}
