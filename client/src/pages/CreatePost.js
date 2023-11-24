import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";



export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summery, setSummery] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [files, setFiles] = useState("");
  const [redirect,setRedirect] = useState(false)

  async function createNewPost(ev) {
    const data = new FormData(); // Corrected typo: FormData instead of Formdata
    data.set("title", title);
    data.set("summery", summery);
    data.set("content", content);
    data.append("file", files[0]); // Use append to add files to FormData
    ev.preventDefault();

    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials:'include',
    });
   if(response.ok){
    setRedirect(true)
   }
  }
  if(redirect){
    return <Navigate to="/"/>
  }

  return (
    <div>
      <form onSubmit={createNewPost}>
        <input
          type="title"
          placeholder="Title"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        <input
          type="summery"
          placeholder="Summery"
          value={summery}
          onChange={(ev) => setSummery(ev.target.value)}
        />
        <input
          type="file"
          onChange={(ev) => setFiles(ev.target.files)}
        />
        <Editor value={content} onChange={setContent}/>
        <button style={{ marginTop: "5px" }}>Create-Post</button>
      </form>
    </div>
  );
}
