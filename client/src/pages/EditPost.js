import { useState , useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { Navigate , useParams} from "react-router-dom";
import Editor from "../Editor";




export default function EditPost() {
  const [title, setTitle] = useState("");
  const [summery, setSummery] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [files, setFiles] = useState("");
  const [redirect,setRedirect] = useState(false);
  
  const {id} = useParams();

  useEffect(() => {
    fetch('http://localhost:4000/post/'+id)
    .then(response =>{
        response.json().then(postInfo =>{
            setTitle(postInfo.title);
            setContent(postInfo.content);
            setSummery(postInfo.summery);
        })
    })
    
  }, [])
  

  async function updatePost(ev){
    ev.preventDefault();
    const data = new FormData(); 
    data.set("title", title);
    data.set("summery", summery);
    data.set("content", content);
    data.set('id',id);
    if(files?.[0]){

        data.append("file", files?.[0]);
    }
    const response = await fetch('http://localhost:4000/post',{
        method: 'PUT',
        body :data,
        credentials: 'include'
    });
    if(response.ok){

  setRedirect(true)
    }

  }

  if(redirect){
    return <Navigate to={"/post/"+id}/>
  }
 
  return (
    <div>
      <form onSubmit={updatePost}>
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
        <Editor  value={content} onChange={setContent}/>
        <button style={{ marginTop: "5px" }}>Update-Post</button>
      </form>
    </div>
  );
}
