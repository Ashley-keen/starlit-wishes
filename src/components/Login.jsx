import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: window.location.origin },
        });
        if (error) setError(error.message);
        else setSent(true);
}

return (
    <main className="wrap">
        <form className="wish-form" onSubmit={handleSubmit}>
            <h2>Sign in</h2>
            {sent ? (
                <p>Check your email for a sign-in link.</p>
            ) : (
            <>
                <label>
                    Email
                        <input type="email" value={email} required
                        onChange={(e) => setEmail(e.target.value)} />
                </label>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="primary">Email me a link</button>
            </>
        )}
    </form>
 </main>
 );
}