import "./Privacy.css";

function Privacy() {
  return (
    <div className="privacy container">
      <p className="privacy__eyebrow">Privacy Policy</p>
      <h1>How we handle your information</h1>
      <p className="privacy__updated">Last updated: {new Date().getFullYear()}</p>

      <section>
        <h2>What we collect</h2>
        <p>
          When you submit a rental or rent-to-own application through this site, we collect the information you
          provide directly, including your name, date of birth, primary phone number, email address, current
          address, Social Security number, employment and income details, residence history, intended occupants,
          references, and any documents you choose to upload (such as a photo ID or proof of income). Every
          applicant aged 18 or older who intends to live in the home must submit their own application.
        </p>
      </section>

      <section>
        <h2>How we use it</h2>
        <p>
          We use this information solely to evaluate your rental or rent-to-own application, including verifying
          your identity, employment, income, and rental history, and — where you've given consent during the
          application — to run a background and credit check. We do not use your information for marketing, and
          we do not sell your personal information to third parties.
        </p>
      </section>

      <section>
        <h2>How it's stored and protected</h2>
        <p>
          Application data is stored in an encrypted database, and any uploaded documents are stored in a private
          cloud storage bucket that is never publicly accessible — documents can only be viewed through
          short-lived, secure links generated for authorized JustHomes staff. Access to submitted applications is
          restricted to authenticated JustHomes staff accounts protected by multi-factor authentication.
        </p>
      </section>

      <section>
        <h2>Who we share it with</h2>
        <p>
          We use a third-party company, TenetBackgroundSearch.com, to perform background checks as part of
          processing your application. We only share your name and email address with them, used to confirm
          your identity — we do not send them your full application. Beyond this, we share application
          information with third parties only as needed to process your application, or where required by
          law. We do not sell or rent your personal information.
        </p>
      </section>

      <section>
        <h2>Application and background check fees</h2>
        <p>
          Every applicant aged 18 or older who intends to live in the home or apartment must submit a
          separate application and undergo a background check. You will receive an invoice directly from our
          background check provider for this service. Pricing may vary, but typically costs about $28 per
          adult applicant.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          You can contact us at any time to ask what information we have on file for you, to request a correction,
          or to request deletion of your application data, subject to any records we're legally required to
          retain. Reach us at{" "}
          <a href="mailto:david@justhomes.us" className="privacy__link">
            david@justhomes.us
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Debt Relief Agency Disclaimer</h2>
        <p>
          We are not a debt relief agency and we do not help people file for bankruptcy relief under the
          Bankruptcy Code. We do not provide bankruptcy information, advice, debt relief service,
          counseling, document preparation, bankruptcy filing, or legal representation related to an
          existing or prospective bankruptcy. If you want bankruptcy advice please consult an attorney. If
          you want debt relief service please consult a debt relief agency. Any written or oral statements
          we may give to you about bankruptcy or debt relief service are our opinions only. We are not
          lawyers or a debt relief agency, nor do we help people with bankruptcy filings and cannot give you
          competent legal advice about bankruptcy.
        </p>
      </section>

      <section>
        <h2>Questions</h2>
        <p>
          If you have questions about this policy or how your information is handled, email us at{" "}
          <a href="mailto:david@justhomes.us" className="privacy__link">
            david@justhomes.us
          </a>
          .
        </p>
      </section>
    </div>
  );
}

export default Privacy;
