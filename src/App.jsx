import Header from "./components/Header";
import WishCard from "./components/WishCard";
import { sampleWishes } from "./data/sample";
import WishForm from "./components/WishForm";

export default function App() {
 return (
 <>
  <Header left={0} got={0} total="£0" />
    <main className="wrap">
      <WishForm onAdd={(wish) => console.log(wish)} />
      <ul className="wish-list">
        {sampleWishes.map((wish) => (
          <WishCard key={wish.id} wish={wish}
            onToggle={() => {}} onRemove={() => {}} />
        ))}
      </ul>
    </main>
  </>
 );
}
