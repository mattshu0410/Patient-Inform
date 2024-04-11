import React from "react";

function Note({ note, onDelete }) {
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");
  return (
    <div class="card m-4 w-full bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">{note.title}</h2>
        <p>{note.content}</p>
        <p>{formattedDate}</p>
        <div class="card-actions justify-end">
          <button class="btn btn-error" onClick={() => onDelete(note.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Note;
