function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div>
        <h1>JustHomes</h1>
        <p>Welcome home.</p>

        <a href="/this-does-not-exist">Test the 404 page</a>
      </div>
    </main>
  );
}

export default Home;
