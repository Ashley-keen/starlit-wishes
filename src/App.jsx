import { useEffect, useState } from "react";
import Header from "./components/Header";
import WishForm from "./components/WishForm";
import WishCard from "./components/WishCard";
import { sampleLists, sampleWishes } from "./data/sample";
import ListPicker from "./components/ListPicker";

function load(key, fallback){
  try{
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
}

export default function App(){
  const [wishes, setWishes] =useState(() => load ("wishes", sampleWishes));

    useEffect(() =>{
      localStorage.setItem("wishes", JSON.stringify(wishes));
    }, [wishes]);

  const [lists, setLists] = useState(()=> load("lists", sampleLists));
  const [activeListId, setActiveListId] = useState(() => load("activeListId", lists[0].id));

    useEffect(() => {
      localStorage.setItem("lists", JSON.stringify(lists));
    }, [lists]);

    useEffect(() => {
      localStorage.setItem("activeListId", JSON.stringify(activeListId));
    }, [activeListId]);

  const activeList = lists.find((l) => l.id === activeListId) ?? lists[0];

    function addWish(wish) {
      setWishes((all) => [
        { ...wish, id: crypto.randomUUID(), listId: activeList.id, got: false },
            ...all,
      ]);
    }

    function addList(name) {
        const list = { id: crypto.randomUUID(), name };
        setLists((all) => [...all, list]);
        setActiveListId(list.id);
    }

    function renameList(id, name) {
        setLists((all) => all.map((l) => (l.id === id ? { ...l, name } : l)));
    }

    function deleteList(id) {
      if (lists.length === 1) return;
      setLists((all) => all.filter((l) => l.id !== id));
      setWishes((all) => all.filter((w) => w.listId !== id));
      setActiveListId(lists.find((l) => l.id !== id).id);
    }

    const inList = wishes.filter((w) => w.listId === activeList.id);
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
      <ListPicker lists={lists} activeId={activeList.id} count={inList.length}
        onSelect={setActiveListId} onAdd={addList}
        onRename={renameList} onDelete={deleteList} />
      <WishForm onAdd={addWish} />
        <ul className="wish-list">
          {inList.map((wish) => (
            <WishCard key={wish.id} wish={wish}
             onToggle={toggleGot} onRemove={removeWish} />
          ))}
        </ul>
      </main>
    </>  
  ) ; 
}

