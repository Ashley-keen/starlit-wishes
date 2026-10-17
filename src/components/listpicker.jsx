import {useState} from "react";

export default function ListPicker({ lists, activeId, onSelect, onAdd}){
    const [adding, setAdding] = useState(false);
    const [name, setName] =useState("");


    function save(event) {
        event.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;
            onAdd(trimmed);
            setAdding(false);
            setName("");
    }
    return(
        <section className="lists">
            <div className="list-tabs">
                {lists.map((list) => (
                    <button key={list.id} aria-pressed={list.id === activeId}
                        onClick={() => onSelect(list.id)}>
                            {list.name}
                    </button>
                ))}
                <button className="new-list" onClick={() => setAdding(true)}>+ New List</button>
            </div>
            {adding && (
                <form className="list-form" onSubmit={save}>
                    <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Christmas" aria-label="List name"/>
                    <button type="submit" className="primary">Save</button>    
                    <button type="button" className="link-btn" onClick={()=>setAdding(false)}>
                        Cancel
                    </button>
                </form>
            )}
        </section>
    );
}