import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <h1>You probably meant to run Ladle...</h1>
    <p>
      If you want to develop the library, or just play around with the code, run
      <p>
        <code>(npm | pnpm | yarn) ladle serve</code>
      </p>
      instead.
    </p>
  </React.StrictMode>
);
