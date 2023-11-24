import React, { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


async function register(ev){
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/register" ,{
        method: "POST",
        body: JSON.stringify({username,password}),
        headers: {'Content-type':'application/json',
       
      
      
      }


    });
    if(response.status === 200){
        alert('Registration Successful');
    }
    else{
        alert('Registration Failed');
        
    }

}

  return (
    <div>
      <form className="register" onSubmit={register}>
        <h1>Regsiter</h1>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={ev => setUsername(ev.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={ev => setPassword(ev.target.value)}
        />
        <button>Register</button>
      </form>
    </div>
  );
}
