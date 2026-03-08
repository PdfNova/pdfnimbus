import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo";
import { LegalCompanyPage } from "@/components/company/legal-company-page";

const contactEmail = "bite_17@hotmail.com";

export const metadata: Metadata = buildToolMetadata({
  title: "Cookies",
  description: "How PDFNimbus uses essential browser storage and cookie-related controls.",
  canonicalPath: "/cookies"
});

export default function CookiesPage() {
  return (
    <LegalCompanyPage
      title={{ en: "Cookies and Browser Storage", es: "Cookies y almacenamiento del navegador" }}
      intro={[
        {
          en: "This page explains how PDFNimbus uses cookie-like technologies and browser storage in practical terms.",
          es: "Esta pagina explica como PDFNimbus usa tecnologias similares a cookies y almacenamiento del navegador en terminos practicos."
        },
        {
          en: "We focus on essential functionality and usability. We do not claim ad or marketing cookie use on this page.",
          es: "Nos centramos en funcionalidad esencial y usabilidad. No declaramos uso de cookies de publicidad o marketing en esta pagina."
        }
      ]}
      quickLinks={[
        { href: "/privacy-policy", label: { en: "Privacy Policy", es: "Politica de privacidad" } },
        { href: "/security", label: { en: "Security", es: "Seguridad" } },
        { href: "/contact", label: { en: "Contact", es: "Contacto" } }
      ]}
      sections={[
        {
          title: { en: "What cookies are", es: "Que son las cookies" },
          paragraphs: [
            {
              en: "Cookies are small pieces of data stored in your browser. Similar browser storage technologies include local storage and session storage.",
              es: "Las cookies son pequenos datos guardados en tu navegador. Tecnologias similares incluyen local storage y session storage."
            }
          ]
        },
        {
          title: { en: "What PDFNimbus uses", es: "Que usa PDFNimbus" },
          bullets: [
            {
              en: "Essential browser storage for interface preferences, such as selected language.",
              es: "Almacenamiento esencial del navegador para preferencias de interfaz, como idioma seleccionado."
            },
            {
              en: "Technical browser/session behavior required for normal page and tool operation.",
              es: "Comportamiento tecnico de navegador/sesion necesario para operacion normal de paginas y herramientas."
            }
          ]
        },
        {
          title: { en: "Analytics and marketing cookies", es: "Cookies de analitica y marketing" },
          paragraphs: [
            {
              en: "This page does not claim use of advertising or marketing cookie stacks. If analytics tooling is enabled in the future, this page and the privacy policy should be updated accordingly.",
              es: "Esta pagina no declara uso de pilas de cookies de publicidad o marketing. Si se habilitan herramientas de analitica en el futuro, esta pagina y la politica de privacidad deberan actualizarse en consecuencia."
            }
          ]
        },
        {
          title: { en: "How to manage preferences", es: "Como gestionar preferencias" },
          bullets: [
            {
              en: "Use browser settings to clear cookies, local storage, and cached data.",
              es: "Usa la configuracion del navegador para limpiar cookies, local storage y datos en cache."
            },
            {
              en: "Use private/incognito mode when you want temporary browser sessions.",
              es: "Usa modo privado/incognito cuando quieras sesiones temporales de navegador."
            },
            {
              en: "You can also contact us for policy-level questions.",
              es: "Tambien puedes contactarnos para consultas sobre politicas."
            }
          ]
        },
        {
          title: { en: "Contact", es: "Contacto" },
          paragraphs: [
            {
              en: `For cookie or browser-storage policy questions, contact ${contactEmail}.`,
              es: `Para consultas sobre cookies o politica de almacenamiento del navegador, contacta con ${contactEmail}.`
            }
          ]
        }
      ]}
    />
  );
}
