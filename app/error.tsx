"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-[900px] px-4 py-10 sm:px-6">
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-red-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-red-800">
          We hit an unexpected error while rendering this page. Please retry.
        </p>
        {error?.message ? (
          <p className="mt-2 text-xs text-red-700">Details: {error.message}</p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="mt-4 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
