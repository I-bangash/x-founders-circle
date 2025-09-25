"use client";

export default function Home() {
  const handleErrorButtonClick = () => {
    throw new Error("Frontend error");
  };

  const handleAPIButtonClick = async () => {
    const response = await fetch("/api/test-error");
    console.log("[test] response", response.body);
    const data = await response.json();
    console.log("[test] data", data);
  };

  return (
    <div>
      <h1>Welcome to our broken app</h1>
      <button onClick={handleErrorButtonClick}>Click me for an error</button>
      <button onClick={handleAPIButtonClick}>
        Click me for a backend API error
      </button>
    </div>
  );
}
