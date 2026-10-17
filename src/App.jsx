import { useState } from "react";
import Header from "./components/Header";
import WishForm from "./components/WishForm";
import WishCard from "./components/WishCard";
import { sampleWishes } from "./data/sample";

export default function App(){
  const [wishes, setWishes] =useState(sampleWishes);

    function addWish(wish) {
      setWishes((all) => [{ ...wish, id: crypto.randomUUID(), got: false }, ...all]);
    }
    function toggleGot(id) {
      setWishes((all) => all.map((w) => (w.id === id ? { ...w, got: !w.got } : w)));
    }
    function removeWish(id) {
      setWishes((all) => all.filter((w) => w.id !== id));
    }
  return (
    <>
      <Header left={wishes.length} got={0} total="£0" />
      <main className="wrap">
        <WishForm onAdd={addWish} />
        <ul className="wish-list">
          {wishes.map((wish) => (
            <WishCard key={wish.id} wish={wish}
             onToggle={toggleGot} onRemove={removeWish} />
          ))}
        </ul>
      </main>
    </>  
  ) ; 
}

