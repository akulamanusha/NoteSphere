import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ArchivedNotes.css";

function ArchivedNotes() {
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState(
    "Loading archived notes..."
  );

  const fetchArchivedNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/archived`,
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
        setMessage(
          data.message || "Unable to load archived notes"
        );
      }
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  useEffect(() => {
    fetchArchivedNotes();
  }, []);

  const handleUnarchive = async (noteId) => {
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
        setMessage("Note restored successfully!");
        await fetchArchivedNotes();
      } else {
        setMessage(
          data.message || "Unable to restore note"
        );
      }
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="archived-container">
      <div className="archived-header">
        <h1>Archived Notes</h1>

        <Link
          className="back-dashboard"
          to="/dashboard"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {message && (
        <p className="archived-message">
          {message}
        </p>
      )}

      {notes.length === 0 && !message && (
        <p>You don't have any archived notes.</p>
      )}

      {notes.map((note) => (
        <div
          className="archived-card"
          key={note._id}
        >
          <h2>{note.title}</h2>

          <p>{note.content}</p>

          <button
            onClick={() => handleUnarchive(note._id)}
          >
            Restore
          </button>
        </div>
      ))}
    </div>
  );
}

export default ArchivedNotes;