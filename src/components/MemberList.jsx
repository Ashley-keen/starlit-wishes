  export default function MemberList({ members, isOwner, userId, onRemove }) {
  if (members.length === 0) return null;

  return (
    <section className="members">
      <h3 className="members-title">Collaborators</h3>
      <ul className="members-list">
        {members.map((m) => (
          <li key={m.user_id}>
            <span>{m.email || "Someone"}{m.user_id === userId && " (you)"}</span>
            {isOwner && (
              <button className="link-btn" onClick={() => onRemove(m.user_id)}>
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}