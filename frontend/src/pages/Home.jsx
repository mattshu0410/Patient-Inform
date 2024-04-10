import { useState, useEffect } from "react";
import api from "../api";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, SetContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    // Recall that the api URL in backend -> urls.py forwards all api/*
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted");
        else alert("Failed to delete note.");
      })
      .catch((error) => alert(error));
    getNotes();
  };

  const createNote = () => {
    e.preventDefault();
    api
      .post("/api/notes/", { title, content })
      .then((res) => {
        if (res.status === 201) alert("Note created");
        else alert("Failed to create note.");
      })
      .catch((error) => alert(error));
    getNotes();
  };

  return (
    <>
      <div class="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col items-center justify-center">
          <h1>Main</h1>
          <label
            for="my-drawer-2"
            class="btn btn-primary drawer-button lg:hidden"
          >
            Open drawer
          </label>
        </div>
        <div class="drawer-side">
          <label
            for="my-drawer-2"
            aria-label="close sidebar"
            class="drawer-overlay"
          ></label>
          <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <h2>Sidebar</h2>
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Home;
