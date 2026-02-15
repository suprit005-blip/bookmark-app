"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    alert("Error logging in");
  }
}

  // Fetch bookmarks
  async function getBookmarks() {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setBookmarks(data || []);
    }
  }

  // Add or Update bookmark
  async function addBookmark() {

    if (!title || !url) {
      alert("Please enter title and URL");
      return;
    }

    if (editingId) {
      await supabase
        .from("bookmarks")
        .update({ title, url })
        .eq("id", editingId);

      setEditingId(null);

    } else {

      await supabase
        .from("bookmarks")
        .insert([{ title, url }]);
    }

    setTitle("");
    setUrl("");

    getBookmarks();
  }

  // Delete bookmark
  async function deleteBookmark(id: number) {

    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    getBookmarks();
  }

  // Load on start
  useEffect(() => {
    getBookmarks();
  }, []);

  return (

    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f4f6f8"
    }}>

      <div style={{
        width: "400px",
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.2)"
      }}>

        <h2 style={{ textAlign: "center" }}>
  Bookmark App
</h2>

<button
  onClick={signInWithGoogle}
  style={{
    width: "100%",
    backgroundColor: "#4285F4",
    color: "white",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer"
  }}
>
  Sign in with Google
</button>

        <input
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px"
          }}
        />

        <input
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px"
          }}
        />

        <button
          onClick={addBookmark}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          {editingId ? "Update Bookmark" : "Add Bookmark"}
        </button>

        <h3>Saved Bookmarks:</h3>

        {bookmarks.map((b) => (

          <div key={b.id} style={{ marginBottom: "15px" }}>

            <b>{b.title}</b>

            <br />

            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
            >
              {b.url}
            </a>

            <br /><br />

            <button
              onClick={() => {
                setEditingId(b.id);
                setTitle(b.title);
                setUrl(b.url);
              }}
              style={{
                backgroundColor: "green",
                color: "white",
                border: "none",
                padding: "6px 12px",
                marginRight: "10px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Edit
            </button>

            <button
              onClick={() => deleteBookmark(b.id)}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Delete
            </button>

            <hr />

          </div>

        ))}

      </div>

    </div>

  );
}