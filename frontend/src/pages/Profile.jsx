import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const userData = JSON.parse(savedUser);

      setUser(userData);
      setName(userData.name);
    }
  }, []);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setMessage("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setMessage(
          data.message || "Unable to update profile"
        );
      }
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      <Link to="/dashboard">
        ← Back to Dashboard
      </Link>

      {message && <p>{message}</p>}

      {user ? (
        <div className="profile-card">
          <h2>User Information</h2>

          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <div className="profile-actions">
            {!isEditing && (
              <button
                onClick={() => {
                  setName(user.name);
                  setIsEditing(true);
                  setMessage("");
                }}
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing && (
            <form
              className="profile-edit-form"
              onSubmit={handleUpdateProfile}
            >
              <h2>Edit Profile</h2>

              <label>Name</label>
              <br />

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />

              <br />

              <button type="submit">
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => {
                  setName(user.name);
                  setIsEditing(false);
                  setMessage("");
                }}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      ) : (
        <p>User information not available.</p>
      )}
    </div>
  );
}

export default Profile;