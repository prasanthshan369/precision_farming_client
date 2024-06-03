import React, { useEffect, useRef, useState } from "react";
import tomato from "../assets/tomato.jpg";
import pencil from "../assets/pencil.png";
import erase from "../assets/paint-brush.png";
import color_icon from "../assets/color-palette.png";
import fresh from "../assets/fresh.jpg";
import upload from '../assets/upload.png'
import "../css/Segmentation.css";
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import FarmCarrousel from "./farmCarousel/FarmCarrousel";
import {Axios, base_url} from "../helpers/axios";
const Segmantation = () => {
  const [landSegment, setLandSegment] = useState(false);
  const [isAreaImage, setIsAreaImage] = useState('')
  const [deviceModel, setDeviceModel] = useState(false)
  const canvasRef = useRef(null);
  const showcanvas= useRef(null)
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [color, setColor] = useState("red");
  const [lineWidth, setLineWidth] = useState(5);
  const [fillColor, setFillColor] = useState("");
  const [showFillOptions, setShowFillOptions] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [areaText, setAreaText] = useState('')
  const [areaImage, setAreaImage] = useState('')
  const [farmDetails, setFarmDetails] = useState([])
  const [farmAreaDetails, setFarmAreaDetails] = useState([])
  useEffect(() => {
    console.log('Axios',Axios);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // const image = new Image();
    // image.src =canvas1;
    // image.onload = () => {
    //   ctx.drawImage(image, 0, 0,800,700);
    // };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (imageLoaded) {
        ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
      }
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      if (drawing && points.length > 2) {
        ctx.lineTo(points[0].x, points[0].y);
        if (fillColor) {
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
      }
      ctx.lineWidth =2;
      // ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      canvasRef.current.style.cursor = 'crosshair'; 
      canvasRef.current.style.borderColor = 'blue'; // C
      // ctx.fill();
      
    };

    draw();
  }, [drawing, points, color, lineWidth, fillColor, imageLoaded]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints([...points, { x, y }]);
    setDrawing(true);
  };

  const handleMouseUp = () => {
    setDrawing(false);
    for (let i = 0; i < points.length - 1; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const distance = Math.sqrt((points[i].x - points[j].x) ** 2 + (points[i].y - points[j].y) ** 2);
        if (distance < 10) {
          // alert(points[points.length-1].x,"&",points[points.length-1].y)
          console.log(points);
          setLandSegment(true)
          return;
        }}
      }
    const polygon = {
      closed: points.length > 2 && points[0].x === points[points.length - 1].x && points[0].y === points[points.length - 1].y,
      points: [...points]
    };
    const activePoint = polygon.points[0];
    if (polygon.closed && polygon.points.length > 2 && activePoint === polygon.points[0]) {
      alert("Polygon is closed!");
    }
  };

  const handleMouseMove = (e) => {
    if (drawing) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPoints([...points.slice(0, -1), { x, y }]);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPoints([]);
  };
  const toggleFillOptions = () => {
    setShowFillOptions(!showFillOptions);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setImageLoaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const imageRef = useRef(null);

  const drawCanva = () => {
    // setLandSegment(true);
  };
  const handleSelect=(event)=>{
    console.log(event.target.value);
  }
  const handlelandImage=async(e)=>{
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAreaImage(file);
      setIsAreaImage(imageUrl)
    }
  }
  const handleLandSegment=async()=>{
    const farm_id = await farmAreaDetails[0].farm_id
    const area_id = await Math.floor(1000 + Math.random() * 9000)
    const now = moment();
  const DateTime = now.format('YYYY-MM-DD HH:mm:ss');
  const x=points.map(points=>points.x)
  const y=points.map(points=>points.y)
  const coordinates=x+"/"+y

      const formData = new FormData();
      formData.append('image', areaImage);
      formData.append('dates',DateTime );
      formData.append('farm_id',farm_id );
      formData.append('area_id',area_id );
      formData.append('coordinates',coordinates );
      formData.append('area',areaText );
      formData.append('remarks',"remarks" );
  if(areaText !==""&&areaImage !==""){
   Axios.post("/add_farmarea",formData,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((res)=>{
        setLandSegment(false)
          console.log('add_farmarea',res);
          setAreaImage("")
          setAreaText("")
        setIsAreaImage("")
          clearCanvas()
        })
        console.log('add_farmarea data added');
        setLandSegment(false)


  }else{
    alert("Fill All The Details")

  }

}
  const handleLandmodel=()=>{
    setAreaImage("")
    setIsAreaImage("")
    setAreaText("")
    setLandSegment(false)
    clearCanvas()
  }
  // const handleshowcanvaMouseDown = (e) =>{}
  const handleShowMouseDown = (e) => {
    showcanvahandleclick(e)}
  const showcanvahandleclick=(e)=>{
    if (farmAreaDetails.length !== 0) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = parseInt(e.clientX - rect.left);
      const y = parseInt(e.clientY - rect.top);
      const canvas2 = canvasRef.current;
      const ctx2 = canvas2.getContext("2d");
      for (let i = 0; i < farmAreaDetails.length; i++) {
        drawPolygon(ctx2, farmAreaDetails[i].coordinates);
        if (ctx2.isPointInPath(x, y)) {
        }
      }
    }
  }
  const drawPolygon = (ctx, points) => {
    var point=String(points).split("/")
    var p=[point[0].split(','),point[1].split(',')]
    console.log('p',p);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 5;
    // ctx.beginPath();
    // points.forEach((point, index) => {
    //   if (index === 0) {
    //     ctx.moveTo(pointx, pointy);
    //   } else {
    //     ctx.lineTo(pointx, pointy);
    //   }
    // });
    // ctx.closePath();
    // ctx.stroke();
    //
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    for (var i = 1; i < p[0].length; i++) {
        ctx.lineTo(p[0][i], p[1][i]);
        console.log(p[0][i], p[1][i]);
    }
    ctx.closePath();
    ctx.stroke();
  };
  const handleShowCanva=()=>{
    if (points.length > 0) {
    
      console.log(points);
    }
    const canvas2 = canvasRef.current;
    const ctx2 = canvas2.getContext('2d');
    var point=[{cors:'126,251,242,130,128/206,183,286,276,208'},
    {cors:'70,164,168,88,72/132,93,176,174,132'}]
    console.log(point[0]);
    for(let i=0;i<point.length;i++){
    drawPolygon(ctx2,point[i].cors);
    }
  }
  useEffect(()=>{
    handleAgriFarm()

  },[])
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
        setImageSrc(`${base_url}/img_uploads/${data.data[0].image}`)
        setImageLoaded(true);
        // handleFarmSideBar(data.data[0].farm_id,0)

    })
  }
  const handleFarmSideBar=(farmid,index)=>{
    Axios.get(`/api/PF/GetFarmAreaDetails/farm_id=${farmid}`).then(({data})=>{
      console.log('GetFarmAreaDetails',data.data)
      setFarmAreaDetails(data.data)
  })
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  const image = new Image();
  image.src =`${base_url}/img_uploads/${farmDetails[index].image}`;
  image.onload = () => {
    ctx.drawImage(image, 0, 0,800,700);
  };
    setImageSrc(`${base_url}/img_uploads/${farmDetails[index].image}`)
    setImageLoaded(true);

}
  return (
    <div className="sm:ml-40 pl-2">
      <div className="mt-5">
        <h1 className="font-bold text-2xl text-black">Farm Segmentation</h1>
      </div>
      
      <div className="flex items-center justify-between w-[15%] mt-5 ml-5">
        <div className="cursor-pointer" onClick={handleShowCanva}>
          <img src={pencil} className="w-10 h-10" />
          <p className="font-bold text-md">Draw</p>
        </div>
        <div className="cursor-pointer div">
          <input
          className="div_input"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
          <img src={color_icon} className="w-10 h-10" />

          <p className="font-bold text-md">Color</p>

        </div>
        <div className="cursor-pointer" onClick={clearCanvas}>
          <img src={erase} className="w-10 h-10" />
          <p className="font-bold text-md" >Erase</p>
        </div>
      </div>
 
      {/* <Modal handlesegmodel={handlesegmodel}/> */}
      <div className=" my-2  flex items-center">
        <div id="mydiv">
          {/* {
            !imageLoaded &&(
              <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{position:'absolute',top:'50%',left:'50%'}}
            />
            )
          } */}
       
        <canvas
        ref={canvasRef}
        width={800}
        height={700}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleShowMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
        </div>

        <div className="bg-[#dcefd1] h-[700px] w-[300px] flex flex-col  justify-between pt-5 items-center ml-1 overflow-scroll">
          
          {
            farmAreaDetails.length !==0?(
              <div>
              <h1 className="text-center font-bold text-base">Total : {farmAreaDetails.length} Crops</h1>
              {
                farmAreaDetails.map((item,index)=>(
                  <div key={index} className="cursor-pointer bg-[#cbd8ce]  w-[250px] h-[250px] flex flex-col justify-center items-center rounded-md my-2">
                  <img
                    src={`${base_url}/img_uploads/${item.img}`}
                    className="w-[90%] rounded-sm ml-2  my-2 h-[150px]"
                  />
                  <div>
                    <p className="text-gray-50000">Land ID : 12345</p>
                    <p className="text-black font-bold text-md">Area :{item.area} sq feet</p>
                  </div>
                </div>
                ))
              }
              </div>
            ):(
              <div className="flex flex-col justify-center items-center w-full h-full">
                <p className="text-red-500 text-2xl font-bold">No Data</p>
              </div>
            )
           
          }
          
        </div>
        {imageLoaded && <img src={imageSrc} ref={imageRef} alt="Loaded" style={{ display: "none" }} />}
      </div>
      <div>
    {imageLoaded && <img src={imageSrc} ref={imageRef} alt="Loaded" style={{ display: "none" }} />}
  </div>
  
  <div className="image__Carousel">
    {
          farmDetails.length !==0 &&(
            <FarmCarrousel data={farmDetails} handleFarmSideBar={handleFarmSideBar}/>
          )

    }
      </div>
      {/* model add land segmentcoodes */}
      <div
        id="crud-modal"
        tabindex="-1"
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Product
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    for="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type product name"
                    required=""
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="$2999"
                    required=""
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="category"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option selected="">Select category</option>
                    <option value="TV">TV/Monitors</option>
                    <option value="PC">PC</option>
                    <option value="GA">Gaming/Console</option>
                    <option value="PH">Phones</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label
                    for="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Product Description
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write product description here"
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="me-1 -ms-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                Add new product
              </button>
            </form>
          </div>
        </div>
      </div>
      {landSegment&& (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-[50%] my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#edf3ef] outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-[#ccd2ce] rounded-t">
                  <h3 className="text-2xl text-gray-500 font-bold">
                    Add Land Segment
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() =>handleLandmodel()}
                  >
                    <span className=" text-black  h-6 w-6 text-4xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="flex items-center justify-around">
                    <h4 className="text-2xl mx-3">Area</h4>
                    <input className="flex-1 py-3 rounded-md px-2 text-xl" 
                    value={areaText}
                    onChange={(txt)=>setAreaText(txt.target.value)}
                    />
                  </div>
                  <div className="mt-7">
                  <h4 className="text-xl mx-3 mb-3 font-bold">
                    {isAreaImage ?"Uploaded Image :":"Choose image :"}</h4>
                    {
                      isAreaImage ?(
                        <img src={isAreaImage} className="w-64 rounded-md h-44 items-center" />
                      ):(
                        <div>
                        <div id="input_mainpart">
                      <img src={upload} className="upload_img"/>
                      <input
                        id="mainpart"
                        type="file"
                        onChange={handlelandImage}
                      />
                    </div>
                    </div>

                      )
                    }
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => handleLandmodel()}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleLandSegment}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) }

       {deviceModel ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-[50%] my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#edf3ef] outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-[#ccd2ce] rounded-t">
                  <h3 className="text-2xl text-gray-500 font-bold">
                    Add Device
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setDeviceModel(false)}
                  >
                    <span className=" text-black  h-6 w-6 text-4xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="flex items-center justify-around">
                    <h4 className="text-2xl mx-3">Device ID</h4>
                    <input className="flex-1 py-3 rounded-md px-2 text-xl" />
                    <select  onChange={handleSelect} name="plan" id="plan" className=" py-3 rounded-md mx-2"> 
        <option value="none" selected disabled hidden>Select an Option</option> 
        <option className="p-1" value="1">Type 1</option> 
        <option className="p-1" value="2">Type 2 </option> 
        <option className="p-1" value="3">Type 3</option> 
        <option className="p-1" value="4">Type 4</option> 
    </select> 
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setDeviceModel(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setDeviceModel(false)}
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
 
  );
};

export default Segmantation;
