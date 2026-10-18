import {useState} from "react";
import {formatPrice} from "../utils";

export default function WishCard ({wish, lists, onToggle, onRemove, onMove}){
    const [confirming, setConfirming] = useState(false);

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
                    {wish.image && (
                        <img className="wish-img" src={wish.image} alt=""
                            onError={(e) => (e.currentTarget.hidden = true)} />
                        )}
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
                        <a href={wish.url} target="_blank" rel="noreferrer">Open link</a>
                      )}
                    {lists.length > 1 && (
                        <select className="move-select" value={wish.listId}
                            onChange={(e) => onMove(wish.id, e.target.value)}
                            aria-label="Move to another list">
                            {lists.map((l) => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                    )}
                    {confirming ? (
                        <button className="link-btn danger" onClick={() => onRemove(wish.id)}>
                            Tap again to remove
                        </button>
                        ) : (
                        <button className="link-btn" onClick={() => setConfirming(true)}>
                            Remove
                        </button>
                        )}
                </div>
            </div>    
        </li>
    );
}
