import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", weight: ["500", "700"] });

export const metadata: Metadata = {
  title: { default: "PM Panels: think like a product manager", template: "%s · PM Panels" },
  description:
    "Illustrated, interactive case studies for product managers and PM interview prep. Answer first, then see how a strong PM would think it through.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="logo">
              <span className="logo-mark" aria-hidden="true">
                PM
              </span>
              Panels
            </Link>
            <nav aria-label="Main">
              <Link href="/#case-studies">Case studies</Link>
              <Link href="/frameworks">Frameworks</Link>
              <Link href="/#newsletter">Newsletter</Link>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>
              PM Panels is independent and not affiliated with any company featured. Case studies about real
              products are commentary based on public information. Scenarios marked <em>fictional</em> are invented
              for practice.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
