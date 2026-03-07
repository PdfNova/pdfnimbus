"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { trackDownloadGenerated, trackToolUsed, trackEvent } from "@/lib/analytics";
import { useTranslation } from "@/components/i18n-provider";

type QrInputType = "url" | "text" | "wifi" | "email";

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function downloadTextFile(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildQrPayload({
  type,
  url,
  text,
  wifiSsid,
  wifiPassword,
  wifiEncryption,
  wifiHidden,
  emailTo,
  emailSubject,
  emailBody
}: {
  type: QrInputType;
  url: string;
  text: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: "WPA" | "WEP" | "nopass";
  wifiHidden: boolean;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
}) {
  if (type === "url") {
    return url.trim();
  }

  if (type === "text") {
    return text.trim();
  }

  if (type === "wifi") {
    const ssid = wifiSsid.trim();
    const password = wifiPassword.trim();
    const hidden = wifiHidden ? "true" : "false";
    return `WIFI:T:${wifiEncryption};S:${ssid};P:${password};H:${hidden};;`;
  }

  const to = emailTo.trim();
  const params = new URLSearchParams();
  if (emailSubject.trim()) params.set("subject", emailSubject.trim());
  if (emailBody.trim()) params.set("body", emailBody.trim());
  const query = params.toString();
  return `mailto:${to}${query ? `?${query}` : ""}`;
}

export function QrGeneratorTool() {
  const { language } = useTranslation();
  const [inputType, setInputType] = useState<QrInputType>("url");

  const [url, setUrl] = useState("https://");
  const [text, setText] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(2);
  const [darkColor, setDarkColor] = useState("#0f172a");
  const [lightColor, setLightColor] = useState("#ffffff");

  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const copy =
    language === "es"
      ? {
          previewTitle: "Vista previa QR",
          previewAlt: "Vista previa QR",
          previewHint: "La vista previa se actualiza al cambiar opciones.",
          previewEmpty: "Ingresa datos para generar un codigo QR.",
          downloadPng: "Descargar PNG",
          downloadSvg: "Descargar SVG",
          optionsTitle: "Opciones QR",
          types: {
            url: { label: "URL", hint: "Generar QR para enlaces" },
            text: { label: "Texto", hint: "Generar QR para texto plano" },
            wifi: { label: "WiFi", hint: "Compartir credenciales WiFi" },
            email: { label: "Email", hint: "Abrir redaccion con destinatario/asunto" }
          },
          placeholders: {
            url: "https://ejemplo.com",
            text: "Escribe tu texto",
            wifiSsid: "Nombre WiFi (SSID)",
            wifiPassword: "Contrasena",
            noPassword: "Sin contrasena",
            hiddenNetwork: "Red oculta",
            emailTo: "destinatario@ejemplo.com",
            emailSubject: "Asunto",
            emailBody: "Mensaje"
          },
          controls: {
            size: "Tamano",
            margin: "Margen",
            fg: "Color frontal",
            bg: "Color de fondo"
          },
          generationError: "No se pudo generar el QR. Revisa datos y opciones."
        }
      : {
          previewTitle: "QR preview",
          previewAlt: "QR preview",
          previewHint: "Live preview updates as you change options.",
          previewEmpty: "Enter input to generate a QR code.",
          downloadPng: "Download PNG",
          downloadSvg: "Download SVG",
          optionsTitle: "QR options",
          types: {
            url: { label: "URL", hint: "Generate a QR for links" },
            text: { label: "Text", hint: "Generate a QR for plain text" },
            wifi: { label: "WiFi", hint: "Share WiFi credentials quickly" },
            email: { label: "Email", hint: "Open compose with recipient/subject" }
          },
          placeholders: {
            url: "https://example.com",
            text: "Enter your text",
            wifiSsid: "WiFi name (SSID)",
            wifiPassword: "Password",
            noPassword: "No password",
            hiddenNetwork: "Hidden network",
            emailTo: "recipient@example.com",
            emailSubject: "Subject",
            emailBody: "Email body"
          },
          controls: {
            size: "Size",
            margin: "Margin",
            fg: "Foreground color",
            bg: "Background color"
          },
          generationError: "Could not generate QR. Check your input and options."
        };

  const inputTypes: Array<{ value: QrInputType; label: string; hint: string }> = [
    { value: "url", label: copy.types.url.label, hint: copy.types.url.hint },
    { value: "text", label: copy.types.text.label, hint: copy.types.text.hint },
    { value: "wifi", label: copy.types.wifi.label, hint: copy.types.wifi.hint },
    { value: "email", label: copy.types.email.label, hint: copy.types.email.hint }
  ];

  const qrPayload = useMemo(
    () =>
      buildQrPayload({
        type: inputType,
        url,
        text,
        wifiSsid,
        wifiPassword,
        wifiEncryption,
        wifiHidden,
        emailTo,
        emailSubject,
        emailBody
      }),
    [
      emailBody,
      emailSubject,
      emailTo,
      inputType,
      text,
      url,
      wifiEncryption,
      wifiHidden,
      wifiPassword,
      wifiSsid
    ]
  );

  useEffect(() => {
    let canceled = false;

    const run = async () => {
      if (!qrPayload) {
        setPngDataUrl(null);
        setSvgContent(null);
        return;
      }

      try {
        const [png, svg] = await Promise.all([
          QRCode.toDataURL(qrPayload, {
            width: size,
            margin,
            color: { dark: darkColor, light: lightColor }
          }),
          QRCode.toString(qrPayload, {
            type: "svg",
            width: size,
            margin,
            color: { dark: darkColor, light: lightColor }
          })
        ]);

        if (!canceled) {
          setPngDataUrl(png);
          setSvgContent(svg);
          setError(null);
        }
      } catch {
        if (!canceled) {
          setError(copy.generationError);
          setPngDataUrl(null);
          setSvgContent(null);
        }
      }
    };

    void run();

    return () => {
      canceled = true;
    };
  }, [copy.generationError, darkColor, lightColor, margin, qrPayload, size]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      {error ? (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <h2 className="text-sm font-semibold text-slate-900">{copy.previewTitle}</h2>
          <p className="mt-1 text-xs text-slate-600">{copy.previewHint}</p>

          <div className="mt-3 flex min-h-[340px] items-center justify-center rounded-xl border border-slate-200 bg-white p-4">
            {pngDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pngDataUrl} alt={copy.previewAlt} className="h-auto w-full max-w-[340px] object-contain" />
            ) : (
              <p className="text-sm text-slate-500">{copy.previewEmpty}</p>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!pngDataUrl}
              onClick={() => {
                if (!pngDataUrl) return;
                downloadDataUrl(pngDataUrl, "pdfnova-qr.png");
                trackToolUsed("qr_generator");
                trackDownloadGenerated("qr_generator", "png");
                trackEvent("qr_generator_complete", { input_type: inputType, format: "png" });
              }}
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {copy.downloadPng}
            </button>

            <button
              type="button"
              disabled={!svgContent}
              onClick={() => {
                if (!svgContent) return;
                downloadTextFile(svgContent, "pdfnova-qr.svg", "image/svg+xml;charset=utf-8");
                trackToolUsed("qr_generator");
                trackDownloadGenerated("qr_generator", "svg");
                trackEvent("qr_generator_complete", { input_type: inputType, format: "svg" });
              }}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {copy.downloadSvg}
            </button>
          </div>
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-3">
          <h2 className="text-sm font-semibold text-slate-900">{copy.optionsTitle}</h2>

          <div className="mt-3 grid gap-2">
            {inputTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setInputType(type.value)}
                className={`rounded-lg border px-3 py-2 text-left transition ${
                  inputType === type.value
                    ? "border-brand-600 bg-brand-50 text-slate-900"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-400"
                }`}
              >
                <p className="text-sm font-semibold">{type.label}</p>
                <p className="mt-1 text-xs text-slate-600">{type.hint}</p>
              </button>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            {inputType === "url" ? (
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder={copy.placeholders.url}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
              />
            ) : null}

            {inputType === "text" ? (
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={copy.placeholders.text}
                rows={4}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
              />
            ) : null}

            {inputType === "wifi" ? (
              <div className="space-y-2">
                <input
                  value={wifiSsid}
                  onChange={(event) => setWifiSsid(event.target.value)}
                  placeholder={copy.placeholders.wifiSsid}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
                />
                <input
                  value={wifiPassword}
                  onChange={(event) => setWifiPassword(event.target.value)}
                  placeholder={copy.placeholders.wifiPassword}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={wifiEncryption}
                    onChange={(event) => setWifiEncryption(event.target.value as "WPA" | "WEP" | "nopass")}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
                  >
                    <option value="WPA">WPA</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">{copy.placeholders.noPassword}</option>
                  </select>
                  <label className="flex items-center gap-1 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={wifiHidden}
                      onChange={(event) => setWifiHidden(event.target.checked)}
                    />
                    {copy.placeholders.hiddenNetwork}
                  </label>
                </div>
              </div>
            ) : null}

            {inputType === "email" ? (
              <div className="space-y-2">
                <input
                  value={emailTo}
                  onChange={(event) => setEmailTo(event.target.value)}
                  placeholder={copy.placeholders.emailTo}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
                />
                <input
                  value={emailSubject}
                  onChange={(event) => setEmailSubject(event.target.value)}
                  placeholder={copy.placeholders.emailSubject}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
                />
                <textarea
                  value={emailBody}
                  onChange={(event) => setEmailBody(event.target.value)}
                  placeholder={copy.placeholders.emailBody}
                  rows={3}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
                />
              </div>
            ) : null}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              {copy.controls.size}
              <input
                type="number"
                min={160}
                max={1024}
                step={10}
                value={size}
                onChange={(event) => setSize(Number(event.target.value) || 320)}
                className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm outline-none transition focus:border-brand-500"
              />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              {copy.controls.margin}
              <input
                type="number"
                min={0}
                max={8}
                step={1}
                value={margin}
                onChange={(event) => setMargin(Number(event.target.value) || 2)}
                className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm outline-none transition focus:border-brand-500"
              />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              {copy.controls.fg}
              <input
                type="color"
                value={darkColor}
                onChange={(event) => setDarkColor(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-slate-300 p-1"
              />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              {copy.controls.bg}
              <input
                type="color"
                value={lightColor}
                onChange={(event) => setLightColor(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-slate-300 p-1"
              />
            </label>
          </div>
        </aside>
      </div>
    </section>
  );
}
