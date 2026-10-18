import { useEffect, useState } from "react";
import Header from "./Header";
import { supabase } from "../lib/supabase";
import { formatPrice } from "../utils";

export default function SharedList({ shareId }) {
    const [list, setList] = useState(undefined); 

    useEffect(() => {
        supabase.rpc("get_shared_list", { p_share_id: shareId })
            .then(({ data, error }) => setList(error ? null : data));
        }, [shareId]);

 if (list === undefined) return <p className="empty">Loading...</p>;

 if (!list) {
    return (
        <>
            <Header left={0} got={0} total="£0" />
            <p className="empty">This list isn't shared any more.</p>
        </>
        );
    }

    const wishing = list.wishes.filter((w) => !w.got);
    const total = wishing.reduce((sum, w) => sum + (w.price ?? 0), 0);

    return (
        <>
            <Header left={wishing.length} got={list.wishes.length - wishing.length}
                total={formatPrice(total)} />
            <main className="wrap">
                <h2 className="shared-title">{list.name}</h2>
                <p className="shared-note">A gift list made with Starlit Wishes</p>
                <ul className="wish-list">
                    {wishing.map((wish) => (
                        <li key={wish.id} className="wish shared">
                            <div className="wish-body">
                                <h3 className="wish-name">{wish.name}</h3>
                                    <p className="wish-meta">
                                        {typeof wish.price === "number" && (
                                            <span className="price">{formatPrice(wish.price)}</span>
                                        )}
                                        <span className="hearts">{"\u2665".repeat(wish.hearts)}</span>
                                        <span>{wish.category}</span>
                                    </p>
                                    {wish.url && (
                                            <div className="wish-actions">
                                                <a href={wish.url} target="_blank" rel="noreferrer">Open link</a>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </main>
                </>
            );
        }