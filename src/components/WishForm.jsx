import {useState} from "react";
import {cleanUrl} from "../utils";

const CATEGORIES = ["Clothes", "Beauty", "Tech", "Treats", "Others"];

export default function WishForm ({onAdd}){
    const [name, setName] = useState("");
    const [url, setUrl] = useState ("");
    const [price, setPrice] = useState ("");
    const [category, setCategory] = useState("Clothes");
    const [hearts, setHearts] = useState(2);
    const [error, setError] = useState("");

     async function handleSubmit(event){
            event.preventDefault();

            if (!name.trim()) {
                setError("Give your wish a name first."); 
                return;
            }

            let priceNumber =null;
            if (price.trim()) {
                priceNumber=Number(price.replace(/[£,\s]/g, ""));
                if (!Number.isFinite(priceNumber) || priceNumber< 0){
                    setError("Price should be a number, like 12.99");
                    return;
                }
            }

        const link = cleanUrl(url);
        if (url.trim() && !link){
            setError("That link doesn't look right. Try copying it again from the shop.");
            return;
        }

        let image = null;
        if (link) {
            try {
                const res = await fetch("/.netlify/functions/preview?url=" + encodeURIComponent(link));
                if (res.ok) image = (await res.json()).image;
            } catch {
            }
        }

        onAdd({ name: name.trim(), url: link, price: priceNumber, category, hearts, image });
        setName("");
        setUrl("");
        setPrice("");
        setError("");
    }

    return (
        <form className="wish-form" onSubmit={handleSubmit}>
            <h2>Make a Wish</h2>
            <label>What is it?
                <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Satin Bow Clips" />
            </label>
            <label>
                Link
                <input value={url} onChange={(e) => setUrl(e.target.value)}
                placeholder="Place the shop link" inputMode="url" />
            </label>
            <div className="row">
                <label>
                    Price (£)
                    <input value ={price} onChange={(e) => setPrice(e.target.value)}
                    placeholder="12.99" inputMode="decimal" />
                </label>
                <label>
                    Category
                    <select value ={category} onChange={(e) => setCategory(e.target.value)}>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                </label>
            </div>
            <div className="hearts-picker" role="radiogroup" aria-label="How much do you want it?">
                {[1, 2, 3].map((n) => (
                    <button type="button" key={n} role="radio" aria-checked={ n=== hearts}
                        aria-label={n + "hearts"} className={n <= hearts ? "on" : ""}
                        onClick={()=> setHearts(n)}>
                            {"\u2665"}
                    </button>
                ))}
            </div>
            {error &&  <p className="error">{error}</p>}
            <button type="submit" className="primary"> Add to my wishes</button>
        </form>
    );
}