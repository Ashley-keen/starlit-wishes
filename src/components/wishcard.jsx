import {formatPrice} from "../utils";

export default function WishCard ({wish, onToggle, onRemove}){
    return(
        <li className={wish.got ? "wish got" : "wish"}>
            <button
                className="tick"
                onClick={() => onToggle(wish.id)}
                aria-label={wish.got ? "Mark as still wishing" : "Mark as got it"}
            >
                {wish.got ? "\u2726" : ""}
            </button>
            <div className="wish-body">
                <h3 className="wish-name">{wish.name}</h3>
                <p className="wish-meta">
                    {typeof wish.price === "number" && (
                        <span className="price">{formatPrice(wish.price)}</span>
                    )}
                    <span className="hearts">{"♥" .repeat(wish.hearts)}</span>
                    <span>{wish.category}</span>
                </p>
                <div className="wish-actions">
                    {wish.url && (
                        <a href={wish.url} target="_blank" rel="noreferrer">Open Link</a>
                    )}
                    <button className="link-btn" onClick={() => onRemove(wish.id)}>
                        Remove
                    </button>
                </div>
            </div>    
        </li>
    );
}
