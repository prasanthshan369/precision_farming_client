import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    useEffect(()=>{
      RedirectSite()
    })
    const RedirectSite = async() => {
    //   var user=await localStorage.getItem('user')
      //  user= await localStorage.removeItem('user')
      if(isLoggedIn==true){
       return <Navigate to="/Dashboard" />
      }else{
       return <Navigate to="/Segmentation" />
      }
    };
  return isLoggedIn?<Link to="/Dashboard" />: <Link to="/Segmentation" />
}

export default Home