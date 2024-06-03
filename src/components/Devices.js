import React, { useEffect, useRef, useState } from 'react'
import FarmCarrousel from './farmCarousel/FarmCarrousel'
import { Axios, base_url } from '../helpers/axios'
import canvas from "../assets/background.jpg";
import tom1 from "../assets/tomato1.png";
import device from "../assets/icons/device.png";
import moment from 'moment';
import "../css/Devices.css";
import { Link } from 'react-router-dom';
const Devices = () => {
  const [isSidebar, setIsSidebar] = useState(false)
  const [selectedCanvaArea, setSelectedCanvaArea] = useState([])
  const [sideBarDeviceDetails, setSideBarDeviceDetails] = useState([])
  const [deviceId, setDeviceId] = useState('')
  const [deviceName, setDeviceName] = useState('')
  const [addDevice, setAddDevice] = useState(false)
  const [farmDetails, setFarmDetails] = useState([])
  const [farmAreaDetails, setFarmAreaDetails] = useState([])
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvasimg = canvasRef.current;
    const ctx = canvasimg.getContext("2d");
    const image = new Image();
    image.src = canvas;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, 800, 700);
    };
    // handleShowCanva();
    handleAgriFarm()

  }, []);

  const drawPolygon = (ctx, points,color) => {
    var point = String(points).split("/");
    var p = [point[0].split(","), point[1].split(",")];
    const backgroundImage = new Image();
    backgroundImage.src = tom1; // Replace with your background image source
    backgroundImage.style.borderRadius = "10px";
    backgroundImage.onload = () => {
      // ctx.drawImage(backgroundImage, p[0][1], p[1][0], 50, 50);

      // ctx.drawImage(backgroundImage,p[0][1],p[1][2], 50,50);
    };
    // console.log('p',p);
    // ctx.strokeStyle = "	#FF00FF";
    // if(selectedCanvaArea.coordinates==points){
    // ctx.strokeStyle = color;
    // }else{
    //   ctx.strokeStyle =color;
    // }
    ctx.strokeStyle =color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    for (var i = 1; i < p[0].length; i++) {
      ctx.lineTo(p[0][i], p[1][i]);
      // console.log(p[0][i], p[1][i]);
    }
    ctx.closePath();
    ctx.stroke();
    canvasRef.current.style.cursor = 'pointer'; 
  };
  const handleShowMouseDown = (e) => {
    console.log('----------------3',e);
    showcanvahandleclick(e);
  };
  const showcanvahandleclick = (e) => {
    if (farmAreaDetails.length !== 0) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = parseInt(e.clientX - rect.left);
      const y = parseInt(e.clientY - rect.top);
      const canvas2 = canvasRef.current;
      const ctx2 = canvas2.getContext("2d");
      for (let i = 0; i < farmAreaDetails.length; i++) {
        drawPolygon(ctx2, farmAreaDetails[i].coordinates,"blue");
        if (ctx2.isPointInPath(x, y)) {
          // ctx2.globalAlpha = 0.1;
          drawPolygon(ctx2, farmAreaDetails[i].coordinates,"red");
          setSelectedCanvaArea(farmAreaDetails[i])
          console.log(farmAreaDetails[i]);
          GetSideBarDeviceDetails(farmAreaDetails[i].area_id)
        }
      }
    }
  };
  const GetSideBarDeviceDetails=(area_id)=>{
    Axios.get(`/device?area_id=${area_id}`).then(({data})=>{
      console.log(data.result);
      setIsSidebar(true)
      setSideBarDeviceDetails(data.result)
    })
  }
  const handleAgriFarm=async()=>{
    Axios.get("/api/PF/GetFarmDetails/user_id=01").then(({data})=>{
      console.log('farm details',data.data)
      setFarmDetails(data.data)
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.src =`${base_url}/img_uploads/${data.data[0].image}`;
      image.onload = () => {
        ctx.drawImage(image, 0, 0,800,700);
      };
      console.log('------data-------',data.data);
      if(farmDetails.length !==0){
        handleFarmSideBar(farmDetails[0].farm_id,0)
      }
    })
    
  }
  const handleFarmSideBar=(farmid,index)=>{
    Axios.get(`/api/PF/GetFarmAreaDetails/farm_id=${farmid}`).then(({data})=>{
      console.log('GetFarmAreaDetails',data.data)
      setFarmAreaDetails(data.data)
      setIsSidebar(false)
      // setSideBarDeviceDetails(allCropsDetails)
  })
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  const image = new Image();
  image.src =`${base_url}/img_uploads/${farmDetails[index].image}`;
  image.onload = () => {
    ctx.drawImage(image, 0, 0,800,700);
  };
}

const handleInsertDevice=()=>{
  Axios.post('/device/Insert',{
    area_id:selectedCanvaArea.area_id, 
    device_id:deviceId,
    device_name:deviceName,
    device_type:"1", 
    remarks:"rm-1"
  }).then((res)=>{
    console.log(res);
    setDeviceId("")
    setDeviceName("")
    setAddDevice(!addDevice)
    GetSideBarDeviceDetails(selectedCanvaArea.area_id)

  })
}
const handleDeleteDevice=(device_id)=>{
  Axios.post(`/device/Delete?device_id=${device_id}`).then((res)=>{
    console.log(res);
    GetSideBarDeviceDetails(selectedCanvaArea.area_id)
  })
  
}
  return (
     <div className='sm:ml-40 ml-2'>
       <div className="mt-2">
          <h1 className="font-bold text-2xl pl-2">
            Good Morning. <span className="font-bold text-2xl "></span>
          </h1>
        </div>
         <div className="my-1  px-3 flex flex-row items-center">
        <div>
          <canvas
            ref={canvasRef}
            width={800} // Width of canvas
            height={700} // Height of canvas
            onClick={handleShowMouseDown}
            // onMouseUp={handleShowCanva}
            className="canvas rounded-sm"
          />
        </div>
        <div className="bg-[#dcefd1] border-2 rounded-sm border-green-500 h-[700px] w-[300px] ml-1 flex flex-col justify-center">
          
          {
            isSidebar&&(
              <>
             {
               sideBarDeviceDetails.length >0?(
                <div className=' h-[700px] p-2 items-center flex flex-col justify-center '>
                <h1 className='font-bold text-center'>Total Devices :{sideBarDeviceDetails.length}</h1>
                
                <div className="overflow-y-scroll w-full h-[600px]">
                {
                  sideBarDeviceDetails.map((item,index)=>(
                    <div key={item} className="bg-green-300 flex flex-col justify-center  my-2 p-1" 
                    // onClick={()=>setSideBarSelectedCrop(item)}
                    >
                      <div className='flex flex-row justify-end' >
                 <img onClick={()=>{handleDeleteDevice(item.device_id)}} src={require('../assets/icons/delete.png')} className='w-[30px] rounded-sm mx-2 cursor-pointer my-2 h-[30px]' />
                      </div>
                      <div className='flex flex-row justify-center'>
                 <img src={device} className='w-[50%] rounded-sm ml-3 my-2 h-[100px]' />
                 </div>
                 {/* <img src={`${base_url}/img_uploads/${item.crop_img}`} className='w-[95%] rounded-sm ml-3 my-2 h-[150px]' /> */}
                <div>
                 <div className="flex flex-col justify-center items-center ">
                 <p className='text-gray-50000'> Device ID : {item.device_id}</p>
                 <p className='text-gray-50000'> Device Name : {item.device_name}</p>
                 <div className='flex flex-row items-center justify-evenly w-full'>
                 <p className='text-black font-bold text-md'>Water Motor : </p>
                 <label class="inline-flex items-center cursor-pointer">
  <input type="checkbox" value="" class="sr-only peer"/>
  <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
</label>

                  
                 </div>
                 <div className='flex flex-row justify-between items-center '>
                 <h5 className='text-[#3d6e2e] my-1 text-md font-bold'>Status  </h5>
                    <span className=' w-5 h-5 bg-green-500 rounded-full mx-3'></span>
                    <span className='font-extrabold text-md '>online</span>
                  </div>
                 </div>
               
                  <div className='flex items-center justify-around mt-3'>
                    <Link to={`/Consumption/${item.device_id}`} className='text-black bg-green-400 my-2 mx-auto py-1 px-5 font-bold text-base rounded-md cursor-pointer'>Analytics</Link>
                    </div>
                    </div>
                  
                    </div>
                  ))
                }
                </div>
                <button
                    onClick={() => setAddDevice(true)}
                    className="text-black bg-green-400 my-2 mx-auto py-1 px-10  font-medium text-base rounded-md"
                  >
                    Add Device
                  </button>
              </div>
                ):(
                  <div className="flex flex-col mx-5 justify-between h-24">
                  <button
                    onClick={() => setAddDevice(true)}
                    className="text-black bg-green-400 py-2 px-5 font-medium rounded-md"
                  >
                    Add Device
                  </button>
                  {/* <button className="text-black bg-slate-500 font-normal py-1 px-5 rounded-md">
                    Ploughing
                  </button> */}
                </div>
                )
             }
              </>
            )
          }
        
        </div>
      </div>
      <div className="device_image__Carousel">
        {
          farmDetails.length !==0 &&(
            <FarmCarrousel data={farmDetails} handleFarmSideBar={handleFarmSideBar}/>

          )
        }
      </div>
      {addDevice ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-[40%] my-3 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#edf3ef] outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-[#ccd2ce] rounded-t">
                  <h3 className="text-2xl text-gray-500 font-bold">Add Devices</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setAddDevice(false)}
                  >
                    <span className=" text-black  h-6 w-6 text-4xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-3 flex-auto">
                  <div className="flex flex-col items-center justify-center h-[270px]">
<div class="mb-4 flex flex-row justify-between items-center">
  <label for="example" class="block mr-4 text-gray-700 text-sm font-bold mb-2">Device ID  </label>
  <input type="text" id="example" value={deviceId} onChange={(e)=>{setDeviceId(e.target.value)}} name="example" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-3"/>
</div>
<div class="mb-4 flex flex-row justify-between items-center">
  <label for="example"  class="block text-gray-700 text-sm font-bold mb-2">Device Name</label>
  <input type="text" value={deviceName} onChange={(e)=>{setDeviceName(e.target.value)}} id="example" name="example" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
</div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setAddDevice(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => handleInsertDevice()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
     </div>

  )
}

export default Devices