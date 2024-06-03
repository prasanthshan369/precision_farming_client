import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div >
        <button data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
   <span className="sr-only">Open sidebar</span>
   <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
   <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
   </svg>
</button>
<aside id="sidebar-multi-level-sidebar" className="fixed top-0 left-0 z-40 w-40 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
   <div className="h-full px-3 py-7 overflow-y-auto bg-[#65d8a1] dark:bg-[#65d8a1]">
      <ul className="space-y-2 font-medium">
      <li>
            <Link to='/'  className=" p-1 flex flex-col justify-center items-center text-gray-900 rounded-lg bg-[#71f68b]  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <img src={require('../assets/icons/logo.png')} className='w-[50px] h-[50px]'/>
               <h3 className="p-0 m-0">Precision</h3>
               <span>Farming</span>
            </Link>
         </li>
         <li>
            <Link to='/Dashboard'  className="flex flex-col items-center p-1 text-gray-900 rounded-lg bg-[#71f68b]  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <img src={require('../assets/icons/dashboard.png')} className='w-[50px] h-[50px]'/>
               <span className="ms-3">Dashboard</span>
            </Link>
         </li>
         <li>
            <Link to='/Segmentation'  className="flex flex-col items-center w-full p-1 text-base text-gray-900 bg-[#71f68b] transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
            <img src={require('../assets/icons/farm.png')} className='w-[50px] h-[50px]'/>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">My Farm</span>
                  
            </Link>
         </li>
         <li>
            <Link to="/Devices" className="flex flex-col items-center  p-1 text-gray-900 bg-[#71f68b] rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <img src={require('../assets/icons/devices.png')} className='w-[50px] h-[50px]'/>
               <span className="flex-1 ms-3 whitespace-nowrap">My Devices</span>
               {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span> */}
            </Link>
         </li>
         <li>
            <a href="#" className="flex items-center flex-col p-1 text-gray-900 bg-[#71f68b] rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <img src={require('../assets/icons/devices.png')} className='w-[50px] h-[50px]'/>
               <span className="flex-1 ms-3 whitespace-nowrap">Setting</span>
               {/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span> */}
            </a>
         </li>
         <li>
            <Link to='/Login' className="flex items-center p-2 mt-2 text-gray-900 bg-[#71f68b] rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Login</span>
            </Link>
         </li>
         
      </ul>
   </div>
</aside>

    </div>
  )
}

export default Navbar