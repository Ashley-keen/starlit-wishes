import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
 const [mode, setMode] = useState("signin"); // "signin" or "signup"
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [error, setError] = useState("");
 const [note, setNote] = useState("");
 const [busy, setBusy] = useState(false);

 async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNote("");
    if (password.length < 6) {
        setError("Passwords need at least 6 characters.");
        return;
    }
    setBusy(true);
    const { data, error } = mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setBusy(false);
        if (error) {
        setError(friendly(error.message));
        return;
    }
 if (mode === "signup" && !data.session) {
    setNote("Check your email to confirm your account, then sign in.");
    }
    // when it works, App notices the new session and shows your lists
 }

 async function sendLink() {
    setError("");
    if (!email) {
        setError("Type your email above first.");
        return;
    }
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin },
    });
    if (error) setError(friendly(error.message));
    else setNote("Check your email for a sign-in link.");
 }

 function switchMode() {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
    setNote("");
 }

 return (
    <main className="wrap">
        <form className="wish-form" onSubmit={handleSubmit}>
            <h2>{mode === "signin" ? "Sign in" : "Create an account"}</h2>
                <label>
                    Email
                        <input type="email" value={email} required autoComplete="email"
                            onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    Password
                        <input type="password" value={password} required minLength={6}
                            autoComplete={mode === "signin" ? "current-password" : "new-password"}
                            onChange={(e) => setPassword(e.target.value)} />
                </label>
                {error && <p className="error">{error}</p>}
                {note && <p>{note}</p>}
                <button type="submit" className="primary" disabled={busy}>
                    {busy ? "One moment..." : mode === "signin" ? "Sign in" : "Create account"}
                </button>
                <button type="button" className="link-btn" onClick={switchMode}>
                    {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
                </button>
                <button type="button" className="link-btn" onClick={sendLink}>
                    Email me a sign-in link instead
                </button>
        </form>
    </main>
 );
}
function friendly(message) {
 if (message.includes("Invalid login credentials")) {
 return "That email and password don't match. Check them, or create an account.";
 }
 if (message.includes("already registered")) {
 return "There's already an account with that email. Try signing in instead.";
 }
 if (message.toLowerCase().includes("rate limit")) {
 return "Too many attempts. Please wait a few minutes and try again.";
 }
 return message;
}

