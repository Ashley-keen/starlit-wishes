import { useState } from "react";

export default function ListPicker({ lists, activeId, count, userId,
  onSelect, onAdd, onRename, onDelete, onShare, onStopSharing, onLeave }) {
  const [mode, setMode] = useState(null); // null, "new" or "rename"
  const [text, setText] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(""); // "", "share" or "invite"
  const active = lists.find((l) => l.id === activeId);
  const isOwner = active.user_id === userId;

  function start(newMode) {
    setMode(newMode);
    setText(newMode === "rename" ? active.name : "");
    setConfirming(false);
  }

  function save(event) {
    event.preventDefault();
    const name = text.trim();
    if (!name) return;
    if (mode === "new") onAdd(name);
    else onRename(activeId, name);
    setMode(null);
  }

  async function copy(kind, url) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(kind);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      // clipboard blocked: nothing else to do
    }
  }

  return (
    <section className="lists">
      <div className="list-tabs">
        {lists.map((list) => (
          <button key={list.id} aria-pressed={list.id === activeId}
            onClick={() => { onSelect(list.id); setMode(null); setConfirming(false); }}>
            {list.name}{list.user_id !== userId && " \u{1F465}"}
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
      ) : isOwner ? (
        <div className="list-actions">
          <button className="link-btn" onClick={() => start("rename")}>Rename</button>
          <button className="link-btn" onClick={() =>
            copy("invite", window.location.origin + "/?join=" + active.invite_code)}>
            {copied === "invite" ? "Copied!" : "Invite"}
          </button>
          {active.share_id ? (
            <>
              <button className="link-btn" onClick={() =>
                copy("share", window.location.origin + "/?share=" + active.share_id)}>
                {copied === "share" ? "Copied!" : "Copy share link"}
              </button>
              <button className="link-btn" onClick={() => onStopSharing(activeId)}>
                Stop sharing
              </button>
            </>
          ) : (
            <button className="link-btn" onClick={() => onShare(activeId)}>Share list</button>
          )}
          {lists.length > 1 && (confirming ? (
            <button className="link-btn danger"
              onClick={() => { onDelete(activeId); setConfirming(false); }}>
              Delete {active.name} and its {count} wishes?
            </button>
          ) : (
            <button className="link-btn" onClick={() => setConfirming(true)}>Delete list</button>
          ))}
        </div>
      ) : (
        <div className="list-actions">
          {confirming ? (
            <button className="link-btn danger"
              onClick={() => { onLeave(activeId); setConfirming(false); }}>
              Leave {active.name}?
            </button>
          ) : (
            <button className="link-btn" onClick={() => setConfirming(true)}>Leave list</button>
          )}
        </div>
      )}
    </section>
  );
}