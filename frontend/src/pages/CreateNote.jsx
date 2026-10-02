import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateNote.css";

function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes`,
        {
          method: "POST",
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
        setMessage("Note created successfully!");

        setTitle("");
        setContent("");

        setTimeout(() => {
          navigate("/notes");
        }, 1000);
      } else {
        setMessage(
          data.message || "Unable to create note"
        );
      }
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="create-note-container">
      <h1>Create a New Note</h1>

      <Link to="/dashboard">
        ← Back to Dashboard
      </Link>

      <form
        className="create-note-form"
        onSubmit={handleSubmit}
      >
        <div>
          <label>Title</label>

          <input
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
          />
        </div>

        <br />

        <div>
          <label>Content</label>

          <textarea
            rows="10"
            placeholder="Write your note here..."
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            required
          ></textarea>
        </div>

        <br />

        <button type="submit">
          Save Note
        </button>
      </form>

      {message && (
        <p className="create-note-message">
          {message}
        </p>
      )}
    </div>
  );
}

export default CreateNote;