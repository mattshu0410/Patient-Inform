import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import supabase from "../config/supabaseClient";

function Home() {
  const [fetchError, setFetchError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [content, SetContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    const { data, error } = await supabase.from("Notes").select();
    if (error) {
      setFetchError("Could not fetch the data");
      setNotes(null);
      console.log(error);
    }
    if (data) {
      setNotes(data);
      setFetchError(null);
    }
  };

  const createNote = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("Notes").insert({ title, content });
    if (error) {
      console.log(error);
    } else {
      getNotes();
    }
  };

  const deleteNote = async (id) => {
    const { error } = await supabase.from("Notes").delete().eq("id", id);
    if (error) {
      console.log(error);
    } else {
      getNotes();
    }
  };

  // Django Version
  // const getNotes = () => {
  //   // Recall that the api URL in backend -> urls.py forwards all api/*
  //   api
  //     .get("/api/notes/")
  //     .then((res) => res.data)
  //     .then((data) => {
  //       setNotes(data);
  //       console.log(data);
  //     })
  //     .catch((error) => console.log(error));
  // };

  // const deleteNote = (id) => {
  //   api
  //     .delete(`/api/notes/delete/${id}/`)
  //     .then((res) => {
  //       if (res.status === 204) alert("Note deleted");
  //       else alert("Failed to delete note.");
  //       getNotes();
  //     })
  //     .catch((error) => alert(error));
  // };

  // const createNote = (e) => {
  //   console.log("I have been called");
  //   e.preventDefault();
  //   api
  //     .post("/api/notes/", { title, content })
  //     .then((res) => {
  //       if (res.status === 201) alert("Note created");
  //       else alert("Failed to create note.");
  //       getNotes();
  //     })
  //     .catch((error) => alert(error));
  // };

  return (
    <>
      <div class="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col items-center justify-center p-16">
          <div class="prose m-8">
            <h1>My Notepad</h1>
            {fetchError && <p>{fetchError}</p>}
          </div>
          <div class="card w-full bg-base-100 shadow-xl">
            <div class="card-body flex flex-col gap-4">
              <h2 class="card-title">Add a New Note</h2>
              <form onSubmit={createNote} class="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  name="title"
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  class="input input-bordered textarea-lg w-full"
                />
                <textarea
                  placeholder="Start writing your incredible note..."
                  class="textarea textarea-bordered textarea-lg w-full"
                  name="content"
                  required
                  onChange={(e) => SetContent(e.target.value)}
                  value={content}
                ></textarea>
                <div class="card-actions justify-end">
                  <button type="submit" value="Submit" class="btn btn-primary">
                    Add Note
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div class="prose m-8">
            <h1>My Past Notes</h1>
          </div>
          {notes.map((note) => (
            <Note note={note} onDelete={deleteNote} key={note.id}></Note>
          ))}
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
          <ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
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
