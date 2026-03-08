import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo";
import { LegalCompanyPage } from "@/components/company/legal-company-page";

const siteUrl = "https://pdfnimbus.vercel.app";
const contactEmail = "bite_17@hotmail.com";

export const metadata: Metadata = buildToolMetadata({
  title: "Privacy Policy",
  description: "How PDFNimbus handles information, browser processing, and privacy requests.",
  canonicalPath: "/privacy-policy"
});

export default function PrivacyPolicyPage() {
  return (
    <LegalCompanyPage
      title={{ en: "Privacy Policy", es: "Politica de privacidad" }}
      intro={[
        {
          en: "PDFNimbus is a browser-first PDF tools product. This policy explains what information may be handled when you use the website and tools.",
          es: "PDFNimbus es un producto de herramientas PDF browser-first. Esta politica explica que informacion puede tratarse cuando usas el sitio y las herramientas."
        },
        {
          en: "Our goal is practical privacy: clear workflows, minimal data exposure for typical use, and transparent contact paths for questions.",
          es: "Nuestro objetivo es una privacidad practica: flujos claros, exposicion minima de datos en uso normal y vias de contacto transparentes para consultas."
        }
      ]}
      quickLinks={[
        { href: "/cookies", label: { en: "Cookies", es: "Cookies" } },
        { href: "/security", label: { en: "Security", es: "Seguridad" } },
        { href: "/contact", label: { en: "Contact", es: "Contacto" } }
      ]}
      sections={[
        {
          title: { en: "Overview", es: "Resumen" },
          paragraphs: [
            {
              en: `PDFNimbus is available at ${siteUrl} and focuses on browser-first file workflows for tools such as merge, split, rotate, and conversion tasks.`,
              es: `PDFNimbus esta disponible en ${siteUrl} y se centra en flujos de archivos browser-first para tareas como unir, dividir, rotar y convertir.`
            }
          ]
        },
        {
          title: { en: "Information we may collect", es: "Informacion que podemos recopilar" },
          bullets: [
            {
              en: "Basic technical request information needed to serve pages (for example, standard server logs managed by the hosting platform).",
              es: "Informacion tecnica basica de solicitud necesaria para servir paginas (por ejemplo, logs estandar del servidor gestionados por la plataforma de hosting)."
            },
            {
              en: "Language preference stored in browser local storage to remember your selected interface language.",
              es: "Preferencia de idioma guardada en local storage del navegador para recordar el idioma de interfaz seleccionado."
            },
            {
              en: "Messages you send directly to the contact email when requesting support or privacy help.",
              es: "Mensajes que envias directamente al email de contacto al solicitar soporte o ayuda de privacidad."
            }
          ]
        },
        {
          title: { en: "How we use information", es: "Como usamos la informacion" },
          bullets: [
            { en: "Deliver and maintain website functionality.", es: "Entregar y mantener la funcionalidad del sitio." },
            {
              en: "Remember language settings in your browser for usability.",
              es: "Recordar ajustes de idioma en tu navegador para mejorar usabilidad."
            },
            {
              en: "Respond to support, legal, or privacy requests sent by email.",
              es: "Responder solicitudes de soporte, legales o de privacidad enviadas por email."
            }
          ]
        },
        {
          title: { en: "File handling and browser processing", es: "Gestion de archivos y procesamiento en navegador" },
          paragraphs: [
            {
              en: "For typical tool usage, file processing is designed to run in the browser. You are responsible for reviewing outputs before sharing or publishing final documents.",
              es: "Para uso normal de herramientas, el procesamiento de archivos esta disenado para ejecutarse en el navegador. Eres responsable de revisar resultados antes de compartir o publicar documentos finales."
            },
            {
              en: "As with any web-based tool, you should evaluate your own risk when handling sensitive or regulated material.",
              es: "Como con cualquier herramienta web, debes evaluar tu propio riesgo al tratar material sensible o regulado."
            }
          ]
        },
        {
          title: { en: "Cookies and browser storage", es: "Cookies y almacenamiento del navegador" },
          paragraphs: [
            {
              en: "PDFNimbus does not claim marketing or advertising cookie usage in this policy. The site may rely on essential technical browser storage features such as local storage for language preference.",
              es: "PDFNimbus no declara uso de cookies de marketing o publicidad en esta politica. El sitio puede usar funciones tecnicas esenciales del navegador como local storage para la preferencia de idioma."
            },
            {
              en: "See the Cookies page for more practical controls and browser management options.",
              es: "Consulta la pagina de Cookies para controles practicos adicionales y opciones de gestion del navegador."
            }
          ]
        },
        {
          title: { en: "Data retention", es: "Retencion de datos" },
          paragraphs: [
            {
              en: "We aim to keep personally identifying information only as long as reasonably needed to respond to requests or maintain service operations.",
              es: "Buscamos conservar informacion personal identificable solo el tiempo razonablemente necesario para responder solicitudes o mantener operaciones del servicio."
            }
          ]
        },
        {
          title: { en: "Your rights and contact", es: "Tus derechos y contacto" },
          paragraphs: [
            {
              en: `For privacy-related questions, access requests, or correction/deletion requests, contact ${contactEmail}.`,
              es: `Para consultas de privacidad, solicitudes de acceso o peticiones de correccion/eliminacion, contacta con ${contactEmail}.`
            }
          ]
        }
      ]}
    />
  );
}
