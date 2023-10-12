import React from 'react'
import { useState } from 'react'

function Login() {

    const [name,setName] = useState('')
    
    const Test = (e)=>{
        e.preventDefault()
        fetch("http://127.0.0.1:4000/test",{mode: 'no-cors'})
    }

  return (
    <div>
        <input type='text'onChange={(e)=>setName(e.target.value)} value={name}/>
        <button onClick={Test}>TEST</button>
    </div>
  )
}

export default Login