import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Notes.css";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [message, setMessage] = useState("Loading notes...");

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setNotes(data.notes);
        setMessage("");
      } else {
        setMessage(data.message || "Unable to load notes");
      }
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const startEditing = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setMessage("");
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setEditingId(null);
        setTitle("");
        setContent("");
        setMessage("Note updated successfully!");

        await fetchNotes();
      } else {
        setMessage(data.message || "Unable to update note");
      }
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  const handlePin = async (noteId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/${noteId}/pin`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        await fetchNotes();
      } else {
        setMessage(data.message || "Unable to pin note");
      }
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  const handleArchive = async (noteId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/${noteId}/archive`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        await fetchNotes();
      } else {
        setMessage(data.message || "Unable to archive note");
      }
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  const handleDelete = async (noteId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/${noteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Note deleted successfully!");
        await fetchNotes();
      } else {
        setMessage(data.message || "Unable to delete note");
      }
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  const filteredNotes = notes.filter((note) => {
    const search = searchText.toLowerCase();

    return (
      note.title.toLowerCase().includes(search) ||
      note.content.toLowerCase().includes(search)
    );
  });

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h1>My Notes</h1>

        <Link
          className="back-dashboard"
          to="/dashboard"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <input
        className="notes-search"
        type="text"
        placeholder="Search notes..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />

      {message && <p>{message}</p>}

      {editingId && (
        <form
          className="edit-note-form"
          onSubmit={handleUpdate}
        >
          <h2>Edit Note</h2>

          <label>Title</label>

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
          />

          <label>Content</label>

          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            required
            rows="5"
          />

          <button type="submit">
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setContent("");
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {filteredNotes.length === 0 && !message && (
        <p>
          {searchText
            ? "No notes found."
            : "You don't have any notes yet."}
        </p>
      )}

      {filteredNotes.map((note) => (
        <div
          className="note-card"
          key={note._id}
        >
          <h2>
            {note.isPinned && "📌 "}
            {note.title}
          </h2>

          <p>{note.content}</p>

          <div className="note-actions">
            <button
              onClick={() => handlePin(note._id)}
            >
              {note.isPinned ? "Unpin" : "Pin"}
            </button>

            <button
              onClick={() => handleArchive(note._id)}
            >
              Archive
            </button>

            <button
              onClick={() => startEditing(note)}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(note._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notes;