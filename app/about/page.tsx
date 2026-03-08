import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo";
import { LegalCompanyPage } from "@/components/company/legal-company-page";
import { brand } from "@/lib/brand";

const contactEmail = "bite_17@hotmail.com";

export const metadata: Metadata = buildToolMetadata({
  title: "About",
  description: "What PDFNimbus is, who it is for, and the browser-first product philosophy.",
  canonicalPath: "/about"
});

export default function AboutPage() {
  return (
    <LegalCompanyPage
      title={{ en: `About ${brand.name}`, es: `Acerca de ${brand.name}` }}
      intro={[
        {
          en: `${brand.name} is a browser-first suite of practical PDF and image tools designed for fast daily workflows.`,
          es: `${brand.name} es una suite browser-first de herramientas practicas para PDF e imagen pensada para flujos diarios rapidos.`
        },
        {
          en: "The product focuses on clarity, speed, and useful outcomes instead of complex setup or heavy software.",
          es: "El producto se centra en claridad, rapidez y resultados utiles en lugar de configuraciones complejas o software pesado."
        }
      ]}
      quickLinks={[
        { href: "/tools", label: { en: "All tools", es: "Todas las herramientas" } },
        { href: "/privacy-policy", label: { en: "Privacy Policy", es: "Politica de privacidad" } },
        { href: "/contact", label: { en: "Contact", es: "Contacto" } }
      ]}
      sections={[
        {
          title: { en: "What is PDFNimbus", es: "Que es PDFNimbus" },
          paragraphs: [
            {
              en: "PDFNimbus brings together focused tools such as merge, compress, split, rotate, and convert flows so users can complete common document tasks quickly.",
              es: "PDFNimbus reune herramientas concretas como unir, comprimir, dividir, rotar y convertir para completar tareas documentales comunes con rapidez."
            }
          ]
        },
        {
          title: { en: "Who it is for", es: "Para quien es" },
          bullets: [
            {
              en: "People who need lightweight document workflows without complex software.",
              es: "Personas que necesitan flujos documentales ligeros sin software complejo."
            },
            {
              en: "Teams and individuals preparing reports, forms, submissions, and shareable files.",
              es: "Equipos e individuos que preparan informes, formularios, entregas y archivos para compartir."
            },
            {
              en: "Users who value straightforward browser-based tools.",
              es: "Usuarios que valoran herramientas claras basadas en navegador."
            }
          ]
        },
        {
          title: { en: "Why PDFNimbus exists", es: "Por que existe PDFNimbus" },
          paragraphs: [
            {
              en: "Many PDF tasks should be simple. PDFNimbus exists to reduce friction and help users complete practical operations in fewer steps.",
              es: "Muchas tareas PDF deberian ser simples. PDFNimbus existe para reducir friccion y ayudar a completar operaciones practicas en menos pasos."
            }
          ]
        },
        {
          title: { en: "Browser-first philosophy", es: "Filosofia browser-first" },
          paragraphs: [
            {
              en: "The product aims to keep processing close to the user for common workflows, with interfaces that make choices and outputs easy to understand.",
              es: "El producto busca mantener el procesamiento cerca del usuario en flujos comunes, con interfaces que faciliten entender opciones y resultados."
            }
          ]
        },
        {
          title: { en: "Privacy and simplicity", es: "Privacidad y simplicidad" },
          paragraphs: [
            {
              en: "PDFNimbus prioritizes clear controls, concise workflows, and practical privacy language aligned with how the tools are actually used.",
              es: "PDFNimbus prioriza controles claros, flujos concisos y lenguaje de privacidad practico alineado con el uso real de las herramientas."
            }
          ]
        },
        {
          title: { en: "Get in touch", es: "Contacto" },
          paragraphs: [
            {
              en: `For questions, suggestions, or collaboration inquiries, contact ${contactEmail}.`,
              es: `Para consultas, sugerencias o colaboraciones, contacta con ${contactEmail}.`
            }
          ]
        }
      ]}
    />
  );
}
