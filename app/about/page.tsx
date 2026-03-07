import { brand } from "@/lib/brand";

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">About {brand.name}</h1>
        <p className="mt-3 text-sm text-slate-600">
          {brand.name} is a compact suite of fast document tools focused on clear workflows and privacy-conscious processing.
        </p>
      </section>
    </main>
  );
}
