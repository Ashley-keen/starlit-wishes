import { useState } from "react";

export default function ListPicker({ lists, activeId, count,
  onSelect, onAdd, onRename, onDelete, onShare, onStopSharing }) {
  const [mode, setMode] = useState(null); // null, "new" or "rename"
  const [text, setText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);
  const active = lists.find((l) => l.id === activeId);

  function start(newMode) {
    setMode(newMode);
    setText(newMode === "rename" ? active.name : "");
    setConfirmDelete(false);
  }

  function save(event) {
    event.preventDefault();
    const name = text.trim();
    if (!name) return;
    if (mode === "new") onAdd(name);
    else onRename(activeId, name);
    setMode(null);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        window.location.origin + "/?share=" + active.share_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked: nothing else to do
    }
  }

  return (
    <section className="lists">
      <div className="list-tabs">
        {lists.map((list) => (
          <button key={list.id} aria-pressed={list.id === activeId}
            onClick={() => { onSelect(list.id); setMode(null); setConfirmDelete(false); }}>
            {list.name}
          </button>
        ))}
        <button className="new-list" onClick={() => start("new")}>+ New list</button>
      </div>

      {mode ? (
        <form className="list-form" onSubmit={save}>
          <input autoFocus value={text} onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Christmas" aria-label="List name" />
          <button type="submit" className="primary">Save</button>
          <button type="button" className="link-btn" onClick={() => setMode(null)}>
            Cancel
          </button>
        </form>
      ) : (
        <div className="list-actions">
          <button className="link-btn" onClick={() => start("rename")}>Rename</button>

          {active.share_id ? (
            <>
              <button className="link-btn" onClick={copyLink}>
                {copied ? "Copied!" : "Copy share link"}
              </button>
              <button className="link-btn" onClick={() => onStopSharing(activeId)}>
                Stop sharing
              </button>
            </>
          ) : (
            <button className="link-btn" onClick={() => onShare(activeId)}>
              Share list
            </button>
          )}

          {lists.length > 1 && (confirmDelete ? (
            <button className="link-btn danger"
              onClick={() => { onDelete(activeId); setConfirmDelete(false); }}>
              Delete {active.name} and its {count} wishes?
            </button>
          ) : (
            <button className="link-btn" onClick={() => setConfirmDelete(true)}>
              Delete list
            </button>
          ))}
        </div>
      )}
    </section>
  );
}