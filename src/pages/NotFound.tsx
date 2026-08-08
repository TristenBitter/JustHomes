import "./NotFound.css";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-house" aria-hidden="true">
          🏡
        </div>

        <div className="not-found-code">404 Error Code</div>

        <h1>Oops!</h1>

        <h2>This home isn't here.</h2>

        <p>
          Looks like the page you're looking for has moved, sold, or never
          existed in the first place.
        </p>

        <a className="not-found-button" href="/">
          Back to JustHomes
        </a>
      </div>
    </main>
  );
}

export default NotFound;
