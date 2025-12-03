import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Legal notice and contact information for Banandre",
};

export default function ImpressumPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black uppercase tracking-wider text-[var(--blue-accent)] mb-8 brutalist-border inline-block bg-[var(--accent)] bg-opacity-20 px-4 py-2">
        Impressum
      </h1>
      
      <div className="prose prose-invert max-w-none space-y-8">
        <p className="text-gray-300 text-sm italic">
          Legal Notice according to § 5 TMG (German Telemedia Act)
        </p>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            Information according to § 5 TMG
          </h2>
          
          <div className="bg-[var(--muted)] border-2 border-[var(--accent)] p-6 rounded space-y-4">
            <div>
              <p className="text-[var(--accent)] font-bold text-sm uppercase tracking-wide mb-1">
                Name
              </p>
              <p className="text-gray-300">
                Andrii Fedorenko
              </p>
            </div>

            <div>
              <p className="text-[var(--accent)] font-bold text-sm uppercase tracking-wide mb-1">
                Website
              </p>
              <p className="text-gray-300">
                <a href="https://www.banandre.com" className="text-[var(--accent)] hover:underline">
                  www.banandre.com
                </a>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            Contact
          </h2>
          
          <div className="bg-[var(--muted)] border-2 border-[var(--accent)] p-6 rounded space-y-4">
            <div>
              <p className="text-[var(--accent)] font-bold text-sm uppercase tracking-wide mb-1">
                Email
              </p>
              <p className="text-gray-300">
                <a href="mailto:andre@banandre.com" className="text-[var(--accent)] hover:underline">
                  andre@banandre.com
                </a>
              </p>
            </div>

            <div>
              <p className="text-[var(--accent)] font-bold text-sm uppercase tracking-wide mb-1">
                Social Media
              </p>
              <ul className="list-none space-y-2 text-gray-300">
                <li>
                  <strong className="text-white">LinkedIn:</strong>{" "}
                  <a 
                    href="https://www.linkedin.com/in/andrii-fedorenko-65905863/" 
                    className="text-[var(--accent)] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    linkedin.com/in/andrii-fedorenko-65905863
                  </a>
                </li>
                <li>
                  <strong className="text-white">X (Twitter):</strong>{" "}
                  <a 
                    href="https://x.com/andre_banandre" 
                    className="text-[var(--accent)] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @andre_banandre
                  </a>
                </li>
                <li>
                  <strong className="text-white">GitHub:</strong>{" "}
                  <a 
                    href="https://github.com/andrebanandre" 
                    className="text-[var(--accent)] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/andrebanandre
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            Responsible for Content
          </h2>
          <p className="text-gray-300">
            Responsible for content according to § 55 Abs. 2 RStV (German Interstate Broadcasting Treaty):
          </p>
          <div className="bg-[var(--muted)] border-2 border-[var(--accent)] p-6 rounded mt-4">
            <p className="text-gray-300">
              <strong className="text-white">Andrii Fedorenko</strong><br />
              Contact: <a href="mailto:andre@banandre.com" className="text-[var(--accent)] hover:underline">andre@banandre.com</a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            Disclaimer
          </h2>
          
          <h3 className="text-xl font-semibold text-[var(--accent)] mb-3">
            Liability for Content
          </h3>
          <p className="text-gray-300 mb-4">
            The contents of our pages were created with great care. However, we cannot guarantee that the content is accurate, 
            complete, or up-to-date. As a service provider, we are responsible for our own content on these pages in accordance 
            with general law pursuant to § 7 (1) TMG. However, according to §§ 8 to 10 TMG, we are not obligated as a service 
            provider to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
          </p>
          <p className="text-gray-300 mb-6">
            Obligations to remove or block the use of information in accordance with general law remain unaffected. However, 
            liability in this regard is only possible from the time of knowledge of a specific infringement. Upon becoming aware 
            of corresponding legal violations, we will remove this content immediately.
          </p>

          <h3 className="text-xl font-semibold text-[var(--accent)] mb-3">
            Liability for Links
          </h3>
          <p className="text-gray-300 mb-4">
            Our website contains links to external third-party websites over whose content we have no control. Therefore, we 
            cannot accept any liability for this external content. The respective provider or operator of the pages is always 
            responsible for the content of the linked pages.
          </p>
          <p className="text-gray-300 mb-6">
            The linked pages were checked for possible legal violations at the time of linking. Illegal content was not 
            recognizable at the time of linking. However, permanent monitoring of the content of the linked pages is not 
            reasonable without concrete evidence of an infringement. Upon becoming aware of legal violations, we will remove 
            such links immediately.
          </p>

          <h3 className="text-xl font-semibold text-[var(--accent)] mb-3">
            Copyright
          </h3>
          <p className="text-gray-300 mb-4">
            The content and works created by the site operators on these pages are subject to copyright law. Duplication, 
            processing, distribution, and any kind of exploitation outside the limits of copyright require the written consent 
            of the respective author or creator.
          </p>
          <p className="text-gray-300 mb-4">
            Downloads and copies of this page are only permitted for private, non-commercial use. Insofar as the content on 
            this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party 
            content is identified as such. Should you nevertheless become aware of a copyright infringement, please inform us 
            accordingly. Upon becoming aware of legal violations, we will remove such content immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            EU Dispute Resolution
          </h2>
          <p className="text-gray-300 mb-4">
            The European Commission provides a platform for online dispute resolution (ODR):{" "}
            <a 
              href="https://ec.europa.eu/consumers/odr/" 
              className="text-[var(--accent)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ec.europa.eu/consumers/odr/
            </a>.
          </p>
          <p className="text-gray-300">
            We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            Privacy Policy
          </h2>
          <p className="text-gray-300">
            Information about how we handle your personal data can be found in our{" "}
            <a href="/privacy" className="text-[var(--accent)] hover:underline font-semibold">
              Privacy Policy
            </a>.
          </p>
        </section>

        <section className="mt-12 pt-8 border-t-2 border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            About This Website
          </h2>
          <p className="text-gray-300 mb-4">
            <strong className="text-white">Banandre</strong> is a personal blog operated by{" "}
            <strong className="text-white">Andrii Fedorenko</strong>, a software developer and technology writer. 
            The blog focuses on artificial intelligence, software architecture, and technology insights.
          </p>
          <p className="text-gray-300">
            <strong className="text-white">Professional Background:</strong> Software Developer & Technology Writer<br />
            <strong className="text-white">Topics:</strong> Artificial Intelligence, Machine Learning, Software Development, 
            Technology Analysis, Engineering Management
          </p>
        </section>

        <section className="mt-8 pt-8 border-t-2 border-gray-700">
          <p className="text-gray-400 text-sm">
            <strong>Note:</strong> This website is operated as a personal blog. This impressum complies with German legal 
            requirements (§ 5 TMG and § 55 RStV) for informational purposes.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </section>
      </div>
    </div>
  );
}

