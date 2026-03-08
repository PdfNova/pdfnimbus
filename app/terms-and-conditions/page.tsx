import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo";
import { LegalCompanyPage } from "@/components/company/legal-company-page";

const contactEmail = "bite_17@hotmail.com";

export const metadata: Metadata = buildToolMetadata({
  title: "Terms and Conditions",
  description: "Terms for using PDFNimbus browser-first tools.",
  canonicalPath: "/terms-and-conditions"
});

export default function TermsAndConditionsPage() {
  return (
    <LegalCompanyPage
      title={{ en: "Terms and Conditions", es: "Terminos y condiciones" }}
      intro={[
        {
          en: "These terms apply to your use of PDFNimbus tools and pages. By using the service, you agree to use it responsibly and within applicable law.",
          es: "Estos terminos se aplican al uso de herramientas y paginas de PDFNimbus. Al usar el servicio, aceptas usarlo de forma responsable y conforme a la ley aplicable."
        },
        {
          en: "Please read this page carefully before relying on outputs for official, legal, financial, or publication workflows.",
          es: "Lee esta pagina con atencion antes de apoyarte en resultados para flujos oficiales, legales, financieros o de publicacion."
        }
      ]}
      quickLinks={[
        { href: "/privacy-policy", label: { en: "Privacy Policy", es: "Politica de privacidad" } },
        { href: "/security", label: { en: "Security", es: "Seguridad" } },
        { href: "/contact", label: { en: "Contact", es: "Contacto" } }
      ]}
      sections={[
        {
          title: { en: "Acceptance of terms", es: "Aceptacion de terminos" },
          paragraphs: [
            {
              en: "Using PDFNimbus indicates acceptance of these terms. If you disagree with these terms, do not use the service.",
              es: "El uso de PDFNimbus implica aceptacion de estos terminos. Si no estas de acuerdo, no uses el servicio."
            }
          ]
        },
        {
          title: { en: "Permitted use", es: "Uso permitido" },
          bullets: [
            {
              en: "Use the tools for lawful, legitimate document and image workflows.",
              es: "Usa las herramientas para flujos de documentos e imagenes legitimos y legales."
            },
            {
              en: "Do not attempt abuse, disruption, scraping attacks, or misuse of the service.",
              es: "No intentes abusar, interrumpir, atacar por scraping ni usar indebidamente el servicio."
            },
            {
              en: "Do not upload or process content you are not permitted to handle.",
              es: "No subas ni proceses contenido que no estes autorizado a manejar."
            }
          ]
        },
        {
          title: { en: "Service provided as-is", es: "Servicio ofrecido tal cual" },
          paragraphs: [
            {
              en: "PDFNimbus is provided on an as-is and as-available basis. We do not guarantee uninterrupted availability or that outputs will be error-free in every case.",
              es: "PDFNimbus se ofrece tal cual y segun disponibilidad. No garantizamos disponibilidad ininterrumpida ni que los resultados esten libres de errores en todos los casos."
            }
          ]
        },
        {
          title: { en: "User responsibility", es: "Responsabilidad del usuario" },
          paragraphs: [
            {
              en: "You are responsible for checking final output quality, accuracy, and suitability before sharing, filing, printing, or publishing documents.",
              es: "Eres responsable de verificar calidad, exactitud e idoneidad del resultado final antes de compartir, presentar, imprimir o publicar documentos."
            }
          ]
        },
        {
          title: { en: "Intellectual property", es: "Propiedad intelectual" },
          paragraphs: [
            {
              en: "PDFNimbus branding, interface elements, and product materials remain protected by applicable intellectual property rights.",
              es: "La marca PDFNimbus, elementos de interfaz y materiales del producto permanecen protegidos por los derechos de propiedad intelectual aplicables."
            }
          ]
        },
        {
          title: { en: "Availability and changes", es: "Disponibilidad y cambios" },
          paragraphs: [
            {
              en: "Tools, pages, or features may be updated, changed, or removed over time to improve reliability, quality, or security.",
              es: "Herramientas, paginas o funciones pueden actualizarse, cambiarse o retirarse con el tiempo para mejorar fiabilidad, calidad o seguridad."
            }
          ]
        },
        {
          title: { en: "Limitation of liability", es: "Limitacion de responsabilidad" },
          paragraphs: [
            {
              en: "To the maximum extent allowed by applicable law, PDFNimbus is not liable for indirect, incidental, or consequential damages resulting from service use or inability to use the service.",
              es: "En la maxima medida permitida por la ley aplicable, PDFNimbus no sera responsable por danos indirectos, incidentales o consecuenciales derivados del uso del servicio o de la imposibilidad de usarlo."
            }
          ]
        },
        {
          title: { en: "Support and legal contact", es: "Contacto de soporte y legal" },
          paragraphs: [
            {
              en: `For support or legal questions about these terms, contact ${contactEmail}.`,
              es: `Para consultas de soporte o legales sobre estos terminos, contacta con ${contactEmail}.`
            }
          ]
        }
      ]}
    />
  );
}
