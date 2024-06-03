import React, { useState } from 'react'
import image from '../assets/login_bg.jpg'
import { useDispatch } from 'react-redux'
import {addUser}from '../slices/userSlices'
import {Axios} from '../helpers/axios'
const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [statusmessage, setStatusmessage] = useState('')
const Dispatch=useDispatch()
    const handleLogin=async(e)=>{
    e.preventDefault()
    const {data}=await Axios.get(`/login?email_id=${username}&password=${password}`)
        console.log('res',data); 
        setStatusmessage(data.message)  
        if(data.status=="success"){
            console.log('res',data.results[0]);
            localStorage.setItem("user",true)
            Dispatch(addUser(data.results[0]))
        }
        // setUsername("")
        setPassword("")
    }
  return (
    <div>
        <section className="bg-gray-50 ">
  <div className="flex flex-col items-center justify-center px-6 py-5 mx-auto md:h-screen lg:py-0">
      <a href="#" className="flex items-center mb-3 text-2xl font-semibold text-gray-900 ">
          <img className="w-20 h-20 rounded-md mr-2" src={image} alt="logo"/>
          Agri Farming    
      </a>
      <div className="w-full bg-[#51b465] rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                  Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                  <div>
                      <label for="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                      <input type="email" onChange={(e)=>setUsername(e.target.value)} value={username} name="email" id="email" className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400" placeholder="****@gmail.com" required=""/>
                  </div>
                  <div>
                      <label for="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                      <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} name="password" id="password" placeholder="••••••••" className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " required=""/>
                  </div>
                  <div className="flex items-center justify-between">
                     
                      {/* <a href="#" className="text-sm font-medium text-primary-600 hover:underline ">Forgot password?</a> */}
                      <a href="#" className="text-xl text-center items-center font-bold text-red-600 hover:underline ">{statusmessage}</a>
                  
                  </div>

                  <button type="submit" onClick={handleLogin} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#71f68b]">Login</button>
                 
              </form>
          </div>
      </div>
  </div>
</section>
    </div>
  )
}

export default Login