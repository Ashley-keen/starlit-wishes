import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import SharedList from "./components/SharedList.jsx";
const shareId = new URLSearchParams(window.location.search).get("share");
createRoot(document.getElementById("root")).render(
 <StrictMode>
 {shareId ? <SharedList shareId={shareId} /> : <App />}
 </StrictMode>
);
