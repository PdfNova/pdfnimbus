import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo";
import { LegalCompanyPage } from "@/components/company/legal-company-page";

const siteUrl = "https://pdfnimbus.vercel.app";
const contactEmail = "bite_17@hotmail.com";

export const metadata: Metadata = buildToolMetadata({
  title: "Security",
  description: "Security overview, browser-first processing expectations, and reporting path for PDFNimbus.",
  canonicalPath: "/security"
});

export default function SecurityPage() {
  return (
    <LegalCompanyPage
      title={{ en: "Security", es: "Seguridad" }}
      intro={[
        {
          en: "PDFNimbus is built around browser-first workflows for common PDF and image tasks. This page explains practical security expectations and user responsibilities.",
          es: "PDFNimbus se basa en flujos browser-first para tareas comunes de PDF e imagen. Esta pagina explica expectativas practicas de seguridad y responsabilidades del usuario."
        },
        {
          en: "Security is a shared responsibility: we aim for a clear and safe product experience, and users should evaluate risk before processing highly sensitive data online.",
          es: "La seguridad es una responsabilidad compartida: buscamos una experiencia de producto clara y segura, y los usuarios deben evaluar el riesgo antes de procesar datos muy sensibles online."
        }
      ]}
      quickLinks={[
        { href: "/privacy-policy", label: { en: "Privacy Policy", es: "Politica de privacidad" } },
        { href: "/cookies", label: { en: "Cookies", es: "Cookies" } },
        { href: "/contact", label: { en: "Contact", es: "Contacto" } }
      ]}
      sections={[
        {
          title: { en: "Security overview", es: "Resumen de seguridad" },
          paragraphs: [
            {
              en: `PDFNimbus at ${siteUrl} is designed to keep workflows straightforward and reduce unnecessary data movement for typical tool operations.`,
              es: `PDFNimbus en ${siteUrl} esta disenado para mantener flujos simples y reducir movimiento innecesario de datos en operaciones normales.`
            }
          ]
        },
        {
          title: { en: "Local browser processing", es: "Procesamiento local en navegador" },
          paragraphs: [
            {
              en: "For common use cases, tool processing is intended to run in the browser. This can reduce exposure compared with workflows that depend on routine remote file processing.",
              es: "Para casos de uso comunes, el procesamiento de herramientas esta pensado para ejecutarse en el navegador. Esto puede reducir exposicion frente a flujos que dependen de procesamiento remoto rutinario."
            }
          ]
        },
        {
          title: { en: "Network and transport", es: "Red y transporte" },
          paragraphs: [
            {
              en: "The public site is served over HTTPS on its hosting platform. As with any internet service, no online environment should be treated as risk-free.",
              es: "El sitio publico se sirve por HTTPS en su plataforma de hosting. Como en cualquier servicio en internet, ningun entorno online debe considerarse libre de riesgo."
            }
          ]
        },
        {
          title: { en: "Data handling expectations", es: "Expectativas sobre manejo de datos" },
          bullets: [
            {
              en: "Do not assume this service is a substitute for formal regulated-compliance platforms.",
              es: "No asumas que este servicio sustituye plataformas formales de cumplimiento regulado."
            },
            {
              en: "Review output files before submission or publication.",
              es: "Revisa archivos de salida antes de presentacion o publicacion."
            },
            {
              en: "Apply your own internal security policy for sensitive workflows.",
              es: "Aplica tu propia politica interna de seguridad para flujos sensibles."
            }
          ]
        },
        {
          title: { en: "User best practices", es: "Buenas practicas del usuario" },
          bullets: [
            {
              en: "Avoid processing highly sensitive regulated documents unless your risk review supports it.",
              es: "Evita procesar documentos regulados muy sensibles salvo que tu analisis de riesgo lo permita."
            },
            {
              en: "Use trusted devices and updated browsers.",
              es: "Usa dispositivos confiables y navegadores actualizados."
            },
            {
              en: "Clear browser data when using shared computers.",
              es: "Limpia datos del navegador cuando uses equipos compartidos."
            }
          ]
        },
        {
          title: { en: "Report a security concern", es: "Reportar una incidencia de seguridad" },
          paragraphs: [
            {
              en: `If you identify a security issue, report it to ${contactEmail} with enough detail to reproduce and investigate.`,
              es: `Si identificas una incidencia de seguridad, reportala a ${contactEmail} con detalle suficiente para reproducir e investigar.`
            }
          ]
        }
      ]}
    />
  );
}
