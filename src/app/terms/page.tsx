import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for using Banandre",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black uppercase tracking-wider text-[var(--blue-accent)] mb-8 brutalist-border inline-block bg-[var(--accent)] bg-opacity-20 px-4 py-2">
        Terms and Conditions
      </h1>

      <div className="prose prose-invert max-w-none space-y-8">
        <p className="text-gray-300 text-sm">
          <strong>Last Updated:</strong>{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">1. Welcome</h2>
          <p className="text-gray-300 mb-4">
            Welcome to <strong className="text-white">Banandre</strong>! These terms explain how
            this Website works. By using the Website, you agree to these simple terms. We&apos;ve
            kept them straightforward and focused on what matters.
          </p>
          <p className="text-gray-300">
            These Terms apply to all visitors and users of the Website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            2. Description of Service
          </h2>
          <p className="text-gray-300 mb-4">
            Banandre is a personal blog operated by Andrii Fedorenko that provides articles,
            insights, and analysis on topics including but not limited to:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Artificial Intelligence and Machine Learning</li>
            <li>Software Development and Architecture</li>
            <li>Technology Analysis and Industry Trends</li>
            <li>Engineering Management</li>
            <li>Data Engineering</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            3. Content and AI Disclosure
          </h2>

          <h3 className="text-xl font-semibold text-[var(--accent)] mb-3">
            3.1 AI-Assisted Content
          </h3>
          <p className="text-gray-300 mb-4">
            Some content on this Website is created with the assistance of artificial intelligence
            (AI) tools. While we review content before publishing:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>AI-generated content may contain errors or inaccuracies</li>
            <li>We make reasonable efforts to ensure quality but cannot guarantee perfection</li>
            <li>Content reflects a human-AI collaborative process</li>
          </ul>

          <h3 className="text-xl font-semibold text-[var(--accent)] mb-3">3.2 No Guarantees</h3>
          <p className="text-gray-300 mb-4">Content is provided for informational purposes only:</p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>We do not guarantee accuracy, completeness, or timeliness</li>
            <li>Technology information becomes outdated quickly</li>
            <li>This is not professional advice of any kind</li>
            <li>Use your own judgment and verify important information</li>
          </ul>

          <h3 className="text-xl font-semibold text-[var(--accent)] mb-3">
            3.3 Your Responsibility
          </h3>
          <p className="text-gray-300">
            You use this Website and its content at your own risk and discretion. Always verify
            important information from authoritative sources and consult professionals for critical
            decisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            4. Content Usage and Attribution
          </h2>

          <h3 className="text-xl font-semibold text-[var(--accent)] mb-3">
            4.1 Open Content Policy
          </h3>
          <p className="text-gray-300 mb-4">
            We believe in sharing knowledge openly. You are generally free to use, copy, modify, and
            distribute content from this Website, including for commercial purposes, with the
            following simple conditions:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>
              <strong className="text-white">Attribution preferred (but not required):</strong>{" "}
              While we appreciate attribution back to Banandre or the specific article URL, it is
              not mandatory
            </li>
            <li>
              <strong className="text-white">No warranty:</strong> Content is provided
              &quot;as-is&quot; without any guarantees of accuracy or completeness
            </li>
            <li>
              <strong className="text-white">Respect third-party content:</strong> Some embedded
              content (images, videos, quotes) may be subject to their original copyright
              holders&apos; terms
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-[var(--accent)] mb-3">
            4.2 Third-Party Content
          </h3>
          <p className="text-gray-300">
            While our written content is freely available, please respect the rights of third
            parties for any embedded media, quoted material, or linked content that may have
            different license terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            5. Acceptable Use
          </h2>
          <p className="text-gray-300 mb-4">
            We keep this simple. Please don&apos;t use this Website in ways that:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Are illegal or harmful to others</li>
            <li>Attempt to damage, disrupt, or overload the Website&apos;s infrastructure</li>
            <li>Violate others&apos; privacy or rights</li>
          </ul>
          <p className="text-gray-300 mt-4">
            Otherwise, feel free to read, share, and use the content as you see fit. Web scraping
            and automated access are fine as long as they don&apos;t harm the Website&apos;s
            availability.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            6. User Interaction
          </h2>
          <p className="text-gray-300 mb-4">
            If we add functionality for comments or user interaction in the future:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>Please be respectful and don&apos;t post anything illegal</li>
            <li>We may remove comments at our discretion but don&apos;t actively moderate</li>
            <li>By commenting, you allow us to display your comment publicly</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            7. Links to External Websites
          </h2>
          <p className="text-gray-300 mb-4">
            This Website may contain links to external websites that are not provided or maintained
            by us. We have no control over the content and nature of these sites.
          </p>
          <p className="text-gray-300 mb-4">
            The inclusion of any links does not necessarily imply a recommendation or endorse the
            views expressed within them. We are not responsible for the content of linked websites.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            8. Content Disclaimer
          </h2>
          <p className="text-gray-300 mb-4">
            This Website is provided &quot;as is&quot; for informational and educational purposes.
            Since some content is AI-assisted:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>
              We strive for accuracy but cannot guarantee all information is correct or up-to-date
            </li>
            <li>Technology topics evolve rapidly and information may become outdated</li>
            <li>The Website may contain errors, omissions, or inaccuracies</li>
            <li>We make reasonable efforts to review content but cannot catch every mistake</li>
          </ul>
          <p className="text-gray-300 mb-4">
            <strong className="text-white">Not Professional Advice:</strong> Content on this Website
            is for general information only and should not be relied upon as professional, legal,
            financial, or technical advice. Always verify important information and consult
            qualified professionals for your specific situation.
          </p>
          <p className="text-gray-300">
            <strong className="text-white">Use at Your Own Discretion:</strong> You are responsible
            for how you use information from this Website. We encourage critical thinking and
            verification of facts from multiple sources.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            9. Limitation of Liability
          </h2>
          <p className="text-gray-300 mb-4">
            This is a personal blog sharing information freely. To the extent permitted by law:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>We are not liable for decisions you make based on information from this Website</li>
            <li>
              We cannot guarantee the accuracy of AI-assisted content despite our review efforts
            </li>
            <li>You use this Website and its content at your own risk</li>
            <li>We are not responsible for any losses resulting from reliance on this content</li>
          </ul>
          <p className="text-gray-300">
            Nothing in these Terms limits our liability for death or personal injury caused by
            negligence, fraud, or any other liability that cannot be excluded by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            10. Privacy and Data Protection
          </h2>
          <p className="text-gray-300 mb-4">
            Your use of this Website is also governed by our Privacy Policy, which explains how we
            collect, use, and protect your personal information in accordance with the GDPR and
            other applicable data protection laws.
          </p>
          <p className="text-gray-300">
            Please read our{" "}
            <a href="/privacy" className="text-[var(--accent)] hover:underline font-semibold">
              Privacy Policy
            </a>{" "}
            to understand how we handle your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            11. Cookies
          </h2>
          <p className="text-gray-300 mb-4">
            We use cookies and similar tracking technologies on this Website. By using this Website,
            you consent to our use of cookies in accordance with our Privacy Policy.
          </p>
          <p className="text-gray-300">
            You can manage cookie preferences through your browser settings. However, disabling
            cookies may affect the functionality of this Website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            12. Changes to Terms
          </h2>
          <p className="text-gray-300 mb-4">
            We reserve the right to modify these Terms and Conditions at any time. Changes will be
            effective immediately upon posting to this page with an updated &quot;Last Updated&quot;
            date.
          </p>
          <p className="text-gray-300">
            Your continued use of the Website after changes are posted constitutes your acceptance
            of the modified Terms and Conditions. We encourage you to review these Terms
            periodically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            13. Governing Law
          </h2>
          <p className="text-gray-300 mb-4">
            These Terms and Conditions are governed by and construed in accordance with the laws
            applicable to the jurisdiction where the Website operator is based, without regard to
            its conflict of law provisions.
          </p>
          <p className="text-gray-300">
            For EU residents, you also have protection under the mandatory consumer protection laws
            of your country of residence.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            14. Severability
          </h2>
          <p className="text-gray-300">
            If any provision of these Terms and Conditions is found to be unenforceable or invalid
            under any applicable law, such unenforceability or invalidity shall not render these
            Terms and Conditions unenforceable or invalid as a whole. Such provisions shall be
            deleted without affecting the remaining provisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">15. Waiver</h2>
          <p className="text-gray-300">
            Our failure to enforce any right or provision of these Terms and Conditions will not be
            considered a waiver of those rights. Any waiver of any provision of these Terms and
            Conditions will be effective only if in writing and signed by us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            16. Entire Agreement
          </h2>
          <p className="text-gray-300">
            These Terms and Conditions, together with our Privacy Policy and Impressum, constitute
            the entire agreement between you and us regarding the use of this Website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            17. Contact Information
          </h2>
          <p className="text-gray-300 mb-4">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="bg-[var(--muted)] border-2 border-[var(--accent)] p-6 rounded">
            <p className="text-gray-300 mb-2">
              <strong>Email:</strong>{" "}
              <a href="mailto:andre@banandre.com" className="text-[var(--accent)] hover:underline">
                andre@banandre.com
              </a>
            </p>
            <p className="text-gray-300">
              <strong>Website:</strong>{" "}
              <a href="https://www.banandre.com" className="text-[var(--accent)] hover:underline">
                www.banandre.com
              </a>
            </p>
          </div>
        </section>

        <section className="mt-12 pt-8 border-t-2 border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            Related Policies
          </h2>
          <p className="text-gray-300 mb-4">
            For more information about our practices and policies, please review:
          </p>
          <ul className="list-none space-y-2">
            <li>
              <a
                href="/privacy"
                className="text-[var(--accent)] hover:underline text-lg font-semibold"
              >
                → Privacy Policy
              </a>
              <span className="text-gray-400 text-sm ml-2">- How we handle your personal data</span>
            </li>
            <li>
              <a
                href="/impressum"
                className="text-[var(--accent)] hover:underline text-lg font-semibold"
              >
                → Impressum
              </a>
              <span className="text-gray-400 text-sm ml-2">
                - Legal information and AI disclosure
              </span>
            </li>
          </ul>
        </section>

        <section className="mt-8 pt-8 border-t-2 border-gray-700">
          <p className="text-gray-400 text-sm">
            By using this Website, you acknowledge that you have read, understood, and agree to be
            bound by these Terms and Conditions.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </section>
      </div>
    </div>
  );
}
