import { useEffect, useState } from "react";
import Header from "./components/Header";
import ListPicker from "./components/ListPicker";
import WishForm from "./components/WishForm";
import WishCard from "./components/WishCard";
import { sampleLists, sampleWishes } from "./data/sample";
import {formatPrice} from "./utils";

function load(key, fallback){
  try{
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
}

const FILTERS =[
  {id: "wishing", label:"Still wishing"},
  {id:"got", label:"Got it"},
  {id:"all", label:"Everything"},
];

export default function App(){
  const [wishes, setWishes] =useState(() => load ("wishes", sampleWishes));
  const [lists, setLists] = useState(()=> load("lists", sampleLists));
  const [activeListId, setActiveListId] = useState(() => load("activeListId", lists[0].id));
  const [filter, setFilter] =useState("wishing");


  useEffect(() =>{
    localStorage.setItem("wishes", JSON.stringify(wishes));
  }, [wishes]);
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
  function toggleGot(id){
    setWishes((all) => all.map((w) =>(w.id === id ? {...w,got:!w.got} :w)));
  }
  function removeWish(id){
    setWishes((all) => all.filter((w) => w.id !== id));
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
  const stillWishing =inList.filter((w)=>!w.got);
  const gotIt =inList.filter((w)=>w.got);
  const shown =filter === "got" ? gotIt : filter === "all" ? inList : stillWishing;
  const totalLeft = stillWishing.reduce((sum,w) => sum + (w.price ?? 0), 0);


  return (
    <>
      <Header left={stillWishing.length} got={gotIt.length} total={formatPrice(totalLeft)} />
      <main className="wrap">
        <ListPicker lists={lists} activeId={activeList.id} count={inList.length}
          onSelect={setActiveListId} onAdd={addList}
          onRename={renameList} onDelete={deleteList} />
        <WishForm onAdd={addWish} />  
        <div className="filters">
          {FILTERS.map((f)=>(
            <button key={f.id} aria-pressed={filter ===f.id} onClick={()=> setFilter(f.id)}>
              {f.label}
          </button>
        ))}
      </div>
        {shown.length === 0?(
          <p className="empty">Nothing here yet.</p>
        ) : (
          <ul className="wish-list">
            {shown.map((wish) => (
              <WishCard key={wish.id} wish={wish}
                onToggle={toggleGot} onRemove={removeWish} />
        ))}
      </ul>
    )}
  </main>
    </>  
  ) ; 
}

