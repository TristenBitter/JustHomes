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
          provide directly, including your name, date of birth, contact information, current address, the last
          four digits of your Social Security number, employment and income details, residence history, household
          members, references, and any documents you choose to upload (such as a photo ID or proof of income).
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
          We share application information with third parties only as needed to process your application — for
          example, a background or credit screening provider, if you've consented to that check — or where
          required by law. We do not sell or rent your personal information.
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
