import { useEffect, useState } from "react";
import Header from "./components/Header";
import ListPicker from "./components/ListPicker";
import WishForm from "./components/WishForm";
import WishCard from "./components/WishCard";
import Login from "./components/Login";
import { formatPrice } from "./utils";
import { supabase } from "./lib/supabase";

const FILTERS = [
  { id: "wishing", label: "Still wishing" },
  { id: "got", label: "Got it" },
  { id: "all", label: "Everything" },
];

// the database says list_id, the app says listId
const fromRow = (row) => ({ ...row, listId: row.list_id });

export default function App() {
  const [session, setSession] = useState(null);
  const [lists, setLists] = useState([]);
  const [wishes, setWishes] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [filter, setFilter] = useState("wishing");
  const [message, setMessage] = useState("");

  // keep track of whether you're logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  // load your lists and wishes once you're logged in
  useEffect(() => {
    if (!session) return;
    async function loadAll() {
      let { data: listRows, error } = await supabase
        .from("lists").select("*").order("created_at");
      if (error) return setMessage("Couldn't load your lists.");

      if (listRows.length === 0) {
        const { data: first, error: firstError } = await supabase
          .from("lists").insert({ name: "My wishes" }).select().single();
        if (firstError) return setMessage("Couldn't create your first list.");
        listRows = [first];
      }

      const { data: wishRows, error: wishError } = await supabase
        .from("wishes").select("*").order("created_at", { ascending: false });
      if (wishError) return setMessage("Couldn't load your wishes.");

      setLists(listRows);
      setWishes(wishRows.map(fromRow));
      setActiveListId(listRows[0].id);
    }
    loadAll();
  }, [session]);

  // logged out: show the sign-in form
  if (!session) {
    return (
      <>
        <Header left={0} got={0} total="£0" />
        <Login />
      </>
    );
  }

  // logged in but still loading
  if (lists.length === 0) {
    return (
      <>
        <Header left={0} got={0} total="£0" />
        <p className="empty">{message || "Loading your wishes..."}</p>
      </>
    );
  }

  const activeList = lists.find((l) => l.id === activeListId) ?? lists[0];

  async function addWish(wish) {
    const { data, error } = await supabase.from("wishes")
      .insert({ ...wish, list_id: activeList.id }).select().single();
    if (error) return setMessage("Couldn't save that wish.");
    setMessage("");
    setWishes((all) => [fromRow(data), ...all]);
  }

  async function toggleGot(id) {
    const wish = wishes.find((w) => w.id === id);
    const { error } = await supabase.from("wishes")
      .update({ got: !wish.got }).eq("id", id);
    if (error) return setMessage("Couldn't update that wish.");
    setWishes((all) => all.map((w) => (w.id === id ? { ...w, got: !w.got } : w)));
  }

  async function removeWish(id) {
    const { error } = await supabase.from("wishes").delete().eq("id", id);
    if (error) return setMessage("Couldn't remove that wish.");
    setWishes((all) => all.filter((w) => w.id !== id));
  }

  async function moveWish(id, listId) {                       
    const { error } = await supabase.from("wishes")
      .update({ list_id: listId }).eq("id", id);             
    if (error) return setMessage("Couldn't move that wish.");
    setWishes((all) =>
      all.map((w) => (w.id === id ? { ...w, listId, list_id: listId } : w)));  
  }

  async function addList(name) {
    const { data, error } = await supabase.from("lists")
      .insert({ name }).select().single();
    if (error) return setMessage("Couldn't create that list.");
    setLists((all) => [...all, data]);
    setActiveListId(data.id);
  }

  async function renameList(id, name) {
    const { error } = await supabase.from("lists").update({ name }).eq("id", id);
    if (error) return setMessage("Couldn't rename that list.");
    setLists((all) => all.map((l) => (l.id === id ? { ...l, name } : l)));
  }

  async function deleteList(id) {
    if (lists.length === 1) return;
    const { error } = await supabase.from("lists").delete().eq("id", id);
    if (error) return setMessage("Couldn't delete that list.");
    setLists((all) => all.filter((l) => l.id !== id));
    setWishes((all) => all.filter((w) => w.listId !== id));
    setActiveListId(lists.find((l) => l.id !== id).id);
  }

  const inList = wishes.filter((w) => w.listId === activeList.id);
  const stillWishing = inList.filter((w) => !w.got);
  const gotIt = inList.filter((w) => w.got);
  const shown = filter === "got" ? gotIt : filter === "all" ? inList : stillWishing;
  const totalLeft = stillWishing.reduce((sum, w) => sum + (w.price ?? 0), 0);

  return (
    <>
      <Header left={stillWishing.length} got={gotIt.length} total={formatPrice(totalLeft)} />
      <main className="wrap">
        <ListPicker lists={lists} activeId={activeList.id} count={inList.length}
          onSelect={setActiveListId} onAdd={addList}
          onRename={renameList} onDelete={deleteList} />
        <WishForm onAdd={addWish} />
        {message && <p className="error">{message}</p>}
        <div className="filters">
          {FILTERS.map((f) => (
            <button key={f.id} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
        {shown.length === 0 ? (
          <p className="empty">Nothing here yet.</p>
        ) : (
          <ul className="wish-list">
            {shown.map((wish) => (
              <WishCard key={wish.id} wish={wish} lists={lists}onToggle={toggleGot} onRemove={removeWish} onMove={moveWish} />
            ))}
          </ul>
        )}
        <button className="link-btn" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </main>
    </>
  );
}