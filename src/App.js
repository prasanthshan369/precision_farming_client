import React, { useEffect, useState } from 'react'
import {BrowserRouter as Router,Routes,Route} from  'react-router-dom'
import Dashboard from './components/Dashboard'
import Segmantation from './components/Segmantation'
import Navbar from './components/Navbar'
import Landing from './components/Devices.js'
import Login from './components/Login'
import Home from './components/Home'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from './slices/userSlices'
import Devices from './components/Devices.js'
import Consumption from './components/Consumption.js'
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const user=useSelector((state)=>state.userData.user)
  const Dispatch=useDispatch()
  useEffect(()=>{
    RedirectSite()
  })
  const RedirectSite = async() => {
    // var userDetail=await localStorage.getItem('user')
    //  user= await localStorage.removeItem('user')
   console.log('user',user);
    if(user){
      setIsLoggedIn(true)
    }else{
      setIsLoggedIn(false)
    }
  };
  return (
    <div>
      <Router>
      <Navbar/>
        {!isLoggedIn ? (
          <Login />
        ) : (
      <Routes >
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/Devices' element={<Devices/>}/>
        <Route path='/Dashboard' element={<Dashboard/>}/>
        <Route path='/Segmentation' element={<Segmantation/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Consumption/:device_id' element={<Consumption/>}/>
      </Routes>
        )
}
      </Router>
    </div>
  )
}

export default App