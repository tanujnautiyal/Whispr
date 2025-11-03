import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up")
  const [fullName, setfullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setisDataSubmitted] = useState(false)
  const {login} = useContext(AuthContext)


  const onSubmithandler = (event)=>{
    event.preventDefault();
    if(currState=== 'Sign Up' && !isDataSubmitted){
      setisDataSubmitted(true)
      return;
    }
    login(currState==="Sign Up" ? 'signup' : 'login', {fullName, email, password, bio})
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center 
    gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/*left*/}
        <img src={assets.logo} alt="" className='w-[min(40vw,300px)]'/>
      {/*Right*/}

      <form onSubmit={onSubmithandler}  className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
          <h2 className='font-medium text-2xl flex justify-between items-center'>
            {currState}
            {isDataSubmitted && <img onClick={()=>setisDataSubmitted(false)} src={assets.arrow_icon} className='w-5 cursor-pointer'/>}
            
          </h2>
          {currState=== "Sign Up" && !isDataSubmitted && (
            <input onChange={(e)=> setfullName(e.target.value)} value={fullName} 
            type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none 
          ' placeholder='Full Name ' required/>
          )}
          {!isDataSubmitted && (
            <>
            <input onChange={(e)=> setEmail(e.target.value)} value={email} 
            type="email" placeholder='Email Address' required className='p-2 border border-gray-500 
            rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
            <input onChange={(e)=> setPassword(e.target.value)} value={password} 
            type="password" placeholder='Enter Password' required className='p-2 border border-gray-500 
            rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
            </>
          )}
          {
            currState=== "Sign Up" && isDataSubmitted && (
              <textarea onChange={(e)=> setBio(e.target.value)} value={bio}
              rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none
              focus:ring-indigo-500' placeholder='Add bio...' required></textarea>
            )
          }
          <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
            {currState=== "Sign Up" ? "Create Account " : "Login "}
          </button>

          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <input type="checkbox" />
            <p>I Agree to the T&C and Privacy Policy</p>
          </div>

          <div className='flex flex-col gap-2'>
            {currState === "Sign Up" ? (
              <p>Already have an Account? <span onClick={()=>{setCurrState("Login"); setisDataSubmitted(false)}} className='font-medium text-violet-500 cursor-pointer'>Login Here</span></p>
            ) : (<p>Create an Account <span onClick={()=> setCurrState("Sign Up")} className='font-medium text-violet-500 cursor-pointer'>Click Here</span></p>)}

          </div>

      </form>

    </div>
  )
}

export default LoginPage