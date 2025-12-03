import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Banandre - How we collect, use, and protect your data",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black uppercase tracking-wider text-[var(--blue-accent)] mb-8 brutalist-border inline-block bg-[var(--accent)] bg-opacity-20 px-4 py-2">
        Privacy Policy
      </h1>
      
      <div className="prose prose-invert max-w-none space-y-8">
        <p className="text-gray-300 text-sm">
          <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section>
          <p className="text-gray-300 leading-relaxed">
            Banandre ("we", "our", or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, and safeguard your information 
            when you visit our website at <a href="https://www.banandre.com" className="text-[var(--accent)] hover:underline">www.banandre.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            1. Information We Collect
          </h2>
          
          <h3 className="text-xl font-semibold text-[var(--accent)] mb-3">
            1.1 Information Collected Automatically
          </h3>
          <p className="text-gray-300 mb-4">
            When you visit our website, we automatically collect certain information about your device and browsing behavior, including:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>Your IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages you visit and time spent on pages</li>
            <li>Referring website addresses</li>
            <li>Date and time stamps</li>
            <li>Device information (screen size, device type)</li>
          </ul>

          <h3 className="text-xl font-semibold text-[var(--accent)] mb-3">
            1.2 Cookies and Tracking Technologies
          </h3>
          <p className="text-gray-300 mb-4">
            We use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic. See the "Cookies" section below for more details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-300 mb-4">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>To provide and maintain our website</li>
            <li>To analyze website usage and improve our content</li>
            <li>To understand how visitors navigate our website</li>
            <li>To detect and prevent technical issues</li>
            <li>To monitor and analyze trends, usage, and activities</li>
            <li>To ensure the security and proper functioning of our website</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            3. Third-Party Services
          </h2>
          
          <h3 className="text-xl font-semibold text-[var(--accent)] mb-3">
            3.1 Google Analytics
          </h3>
          <p className="text-gray-300 mb-4">
            We use Google Analytics, a web analytics service provided by Google LLC ("Google"), to help us understand how visitors use our website. 
            Google Analytics uses cookies to collect information such as:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>How often users visit our site</li>
            <li>What pages they visit and in what sequence</li>
            <li>How long they stay on each page</li>
            <li>What site referred them to our site</li>
          </ul>
          <p className="text-gray-300 mb-4">
            Google uses this information to provide us with reports about website activity. 
            Google may also transfer this information to third parties where required by law or where such third parties process the information on Google's behalf.
          </p>
          <p className="text-gray-300 mb-4">
            For more information about how Google uses data, please visit{" "}
            <a 
              href="https://policies.google.com/technologies/partner-sites" 
              className="text-[var(--accent)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google's Privacy Policy
            </a>.
          </p>
          <p className="text-gray-300">
            You can opt out of Google Analytics by installing the{" "}
            <a 
              href="https://tools.google.com/dlpage/gaoptout" 
              className="text-[var(--accent)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics Opt-out Browser Add-on
            </a>.
          </p>

          <h3 className="text-xl font-semibold text-[var(--accent)] mb-3 mt-6">
            3.2 Cloudflare Workers
          </h3>
          <p className="text-gray-300 mb-4">
            Our website is hosted on Cloudflare Workers, a serverless computing platform provided by Cloudflare, Inc. 
            Cloudflare processes data on our behalf to deliver and secure our website. This includes:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>Request logs for monitoring and debugging</li>
            <li>Performance metrics and traces</li>
            <li>Security and threat detection data</li>
          </ul>
          <p className="text-gray-300 mb-4">
            Cloudflare's observability features collect anonymized and aggregated data to improve service quality and detect security threats. 
            We control the sampling rate of logs and what information is collected.
          </p>
          <p className="text-gray-300">
            For more information about Cloudflare's data practices, please visit{" "}
            <a 
              href="https://www.cloudflare.com/privacypolicy/" 
              className="text-[var(--accent)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudflare's Privacy Policy
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            4. Cookies
          </h2>
          <p className="text-gray-300 mb-4">
            Cookies are small text files that are placed on your device to help us provide a better user experience. 
            We use the following types of cookies:
          </p>

          <h3 className="text-xl font-semibold text-[var(--accent)] mb-3">
            4.1 Analytics Cookies
          </h3>
          <p className="text-gray-300 mb-4">
            These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. 
            We use Google Analytics cookies (_ga, _gid, _gat) to:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>Distinguish unique users</li>
            <li>Throttle request rates</li>
            <li>Track user sessions</li>
          </ul>

          <h3 className="text-xl font-semibold text-[var(--accent)] mb-3">
            4.2 Managing Cookies
          </h3>
          <p className="text-gray-300 mb-4">
            You can control and manage cookies through your browser settings. Most browsers allow you to:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>View what cookies are stored and delete them individually</li>
            <li>Block third-party cookies</li>
            <li>Block all cookies from specific sites</li>
            <li>Block all cookies from being set</li>
            <li>Delete all cookies when you close your browser</li>
          </ul>
          <p className="text-gray-300">
            Please note that blocking or deleting cookies may impact your user experience and some features of our website may not function properly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            5. Data Storage and Security
          </h2>
          <p className="text-gray-300 mb-4">
            We take the security of your data seriously and implement appropriate technical and organizational measures to protect your information:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>All data transmitted to and from our website is encrypted using HTTPS/TLS</li>
            <li>Data is stored securely on Cloudflare's infrastructure with encryption at rest</li>
            <li>We regularly monitor our systems for security vulnerabilities</li>
            <li>Access to data is restricted to authorized personnel only</li>
          </ul>
          <p className="text-gray-300">
            While we strive to protect your personal information, no method of transmission over the internet or electronic storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            6. Data Retention
          </h2>
          <p className="text-gray-300 mb-4">
            We retain analytics and log data for the following periods:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li><strong>Google Analytics data:</strong> 26 months (default setting)</li>
            <li><strong>Cloudflare logs:</strong> As configured in our observability settings, typically 30 days for detailed logs</li>
            <li><strong>Aggregated analytics:</strong> Indefinitely for historical analysis and reporting</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            7. Your Data Protection Rights (GDPR)
          </h2>
          <p className="text-gray-300 mb-4">
            If you are a resident of the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR):
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>
              <strong>Right to access:</strong> You have the right to request copies of your personal data
            </li>
            <li>
              <strong>Right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete
            </li>
            <li>
              <strong>Right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions
            </li>
            <li>
              <strong>Right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions
            </li>
            <li>
              <strong>Right to object to processing:</strong> You have the right to object to our processing of your personal data, under certain conditions
            </li>
            <li>
              <strong>Right to data portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions
            </li>
          </ul>
          <p className="text-gray-300">
            If you make a request, we have one month to respond to you. To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            8. California Privacy Rights (CCPA)
          </h2>
          <p className="text-gray-300 mb-4">
            If you are a California resident, you have specific rights regarding your personal information under the California Consumer Privacy Act (CCPA):
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>The right to know what personal information is being collected about you</li>
            <li>The right to know whether your personal information is sold or disclosed and to whom</li>
            <li>The right to say no to the sale of personal information (we do not sell personal information)</li>
            <li>The right to access your personal information</li>
            <li>The right to equal service and price, even if you exercise your privacy rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            9. Children's Privacy
          </h2>
          <p className="text-gray-300">
            Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. 
            If you are a parent or guardian and believe that your child has provided us with personal information, please contact us so we can delete it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            10. International Data Transfers
          </h2>
          <p className="text-gray-300">
            Your information may be transferred to and maintained on servers located outside of your state, province, country, 
            or other governmental jurisdiction where data protection laws may differ. We ensure appropriate safeguards are in place 
            when transferring data internationally, including using services that comply with applicable data protection frameworks.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            11. Links to Other Websites
          </h2>
          <p className="text-gray-300">
            Our website may contain links to other websites that are not operated by us. If you click on a third-party link, 
            you will be directed to that third party's site. We strongly advise you to review the privacy policy of every site you visit. 
            We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            12. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-300">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
            and updating the "Last Updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically 
            for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            13. Legal Basis for Processing (GDPR)
          </h2>
          <p className="text-gray-300 mb-4">
            Under the GDPR, we process your personal data based on the following legal grounds:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>
              <strong>Legitimate interests:</strong> We process analytics data based on our legitimate interest in understanding 
              how our website is used and improving our services
            </li>
            <li>
              <strong>Consent:</strong> Where required by law, we obtain your consent for specific data processing activities, 
              such as the use of analytics cookies
            </li>
            <li>
              <strong>Legal obligation:</strong> We may process your data where necessary to comply with legal obligations
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            14. Contact Us
          </h2>
          <p className="text-gray-300 mb-4">
            If you have any questions about this Privacy Policy, your data protection rights, or would like to make a request regarding your personal data, please contact us:
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

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            15. Supervisory Authority
          </h2>
          <p className="text-gray-300 mb-4">
            If you are located in the EEA and believe we have not addressed your concerns adequately, you have the right to lodge a complaint 
            with your local data protection supervisory authority.
          </p>
          <p className="text-gray-300">
            For a list of supervisory authorities in the EU, please visit:{" "}
            <a 
              href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" 
              className="text-[var(--accent)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              European Data Protection Board
            </a>
          </p>
        </section>

        <section className="mt-12 pt-8 border-t-2 border-gray-700">
          <p className="text-gray-400 text-sm">
            This privacy policy was last updated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. 
            We review and may update this policy periodically to reflect changes in our practices or applicable law.
          </p>
        </section>
      </div>
    </div>
  );
}

