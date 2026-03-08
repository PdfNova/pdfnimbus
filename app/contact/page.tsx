import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo";
import { LegalCompanyPage } from "@/components/company/legal-company-page";

const contactEmail = "bite_17@hotmail.com";

export const metadata: Metadata = buildToolMetadata({
  title: "Contact",
  description: "How to contact PDFNimbus for support, bugs, privacy requests, and product feedback.",
  canonicalPath: "/contact"
});

export default function ContactPage() {
  return (
    <LegalCompanyPage
      title={{ en: "Contact", es: "Contacto" }}
      intro={[
        {
          en: "Need help with PDFNimbus or want to share feedback? Email is the primary contact channel.",
          es: "Necesitas ayuda con PDFNimbus o quieres compartir comentarios? El correo electronico es el canal principal de contacto."
        },
        {
          en: "Please include clear details about your request so we can respond faster.",
          es: "Incluye detalles claros sobre tu solicitud para poder responder mas rapido."
        }
      ]}
      quickLinks={[
        { href: "/about", label: { en: "About", es: "Acerca de" } },
        { href: "/privacy-policy", label: { en: "Privacy Policy", es: "Politica de privacidad" } },
        { href: "/terms-and-conditions", label: { en: "Terms", es: "Terminos" } }
      ]}
      sections={[
        {
          title: { en: "Primary contact", es: "Contacto principal" },
          paragraphs: [
            { en: `Email: ${contactEmail}`, es: `Correo: ${contactEmail}` }
          ]
        },
        {
          title: { en: "Common request categories", es: "Categorias de solicitudes" },
          bullets: [
            { en: "Support", es: "Soporte" },
            { en: "Bug report", es: "Reporte de errores" },
            { en: "Privacy or legal request", es: "Solicitud de privacidad o legal" },
            { en: "Feature request", es: "Solicitud de funcionalidad" },
            { en: "Business inquiry", es: "Consulta de negocio" }
          ]
        },
        {
          title: { en: "What to include in your message", es: "Que incluir en tu mensaje" },
          bullets: [
            {
              en: "Tool/page involved and a short description of the issue or request.",
              es: "Herramienta/pagina implicada y una descripcion corta del problema o solicitud."
            },
            {
              en: "Steps to reproduce, when relevant.",
              es: "Pasos para reproducir, cuando aplique."
            },
            {
              en: "Screenshots or sample details only when necessary and safe to share.",
              es: "Capturas o detalles de ejemplo solo cuando sea necesario y seguro compartirlos."
            }
          ]
        }
      ]}
    />
  );
}
