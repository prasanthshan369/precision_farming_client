import React, { useEffect, useRef } from "react";
import canvas from "../assets/background.jpg";
import tomato from "../assets/tomato.jpg";
import fresh from "../assets/fresh.jpg";
import tom1 from "../assets/tomato1.png";
import "../css/Dashboard.css";
import { useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { BsPencilFill } from "react-icons/bs";
import { BsFillCloudSunFill } from "react-icons/bs";
import { IoWaterSharp } from "react-icons/io5";
import { IoRainy } from "react-icons/io5";
import { MdLocationPin } from "react-icons/md";
import Select, { useStateManager } from "react-select";
import moment from "moment";
import FarmCarrousel from "./farmCarousel/FarmCarrousel";
import QRCode from "react-qr-code";
import { Axios, base_url } from "../helpers/axios";
import Swal from "sweetalert2";
import axios from "axios";
import { useSelector } from "react-redux";
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px solid #ccc",
    // color: state.isSelected ? 'white' : 'black',
    // background: state.isSelected ? '#007bff' : 'white',
    color: state.isSelected ? "#007bff" : "#007bff",
    background: state.isSelected ? "white" : "white",
  }),
  menu: (provided) => ({
    ...provided,
    maxHeight: "200px", // Set the maximum height of the container here
    overflowY: "auto", // Enable vertical scrolling if options exceed the height
  }),
};
// const options = [
//   { value: 'apple', label: 'Apple', image: 'https://thumbs.dreamstime.com/b/one-apple-closeup-white-background-45309896.jpg' },
//   { value: 'banana', label: 'Banana', image: 'url_to_banana_image' },
//   // Add more options with images
// ];

const Dashboard = () => {
  const [timelineSoughing, setTimelineSoughing] = useState([]);
  const [isSidebar, setIsSidebar] = useState(false);
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedOption, setSelectedOption] = useState(null);
  const [sideBarCropDetails, setSideBarCropDetails] = useState([]);
  const [sideBarSelectedCrop, setSideBarSelectedCrop] = useState([]);
  const [timeLimeModelData, setTimeLimeModelData] = useState([]);
  const [options, setOptions] = useState([]);
  const [actionModel, setActionModel] = useState(false);
  const [cropModel, setCropModel] = useState(false);
  const [remerksModel, setRemerksModel] = useState(false);
  const [timeLineModel, setTimeLineModel] = useState(false);
  const [addCrop, setAddCrop] = useState(false);
  const [addCropImg, setAddCropImg] = useState("");
  const [addCropName, setAddCropName] = useState("");
  const [farmDetails, setFarmDetails] = useState([]);
  const [selectedCanvaArea, setSelectedCanvaArea] = useState();
  const [allCropsDetails, setAllCropsDetails] = useState([]);
  const [weather, setWeather] = useState([]);
  const [actionType, setActionType] = useState("");
  const [addCropData, setAddCropData] = useState({
    name: "",
    img: "",
    h_period: "",
    h_type: "",
    h_start: "",
    h_every: "",
    crop_id: "",
  });
  const canvasRef = useRef(null);
  const QrRef = useRef(null);
  const [farmAreaDetails, setFarmAreaDetails] = useState([]);
  const user = useSelector((state) => state.userData.user);
  useEffect(() => {
    console.log("user details", user);
    const canvasimg = canvasRef.current;
    const ctx = canvasimg.getContext("2d");
    const image = new Image();
    image.src = canvas;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, 800, 700);
    };
    // handleShowCanva();
    currentWeather();
  }, []);
  const currentWeather = () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${user.lattitude}&lon=${user.longitude}&appid=7b18e08f963b6f7adde50ba7206eeb08`;
    axios.get(url).then(async ({ data }) => {
      console.log("res", data);
      setWeather(data);
    });
  };

  const handleShowCanva = () => {
    if (farmAreaDetails.length !== 0) {
      const canvas2 = canvasRef.current;
      const ctx2 = canvas2.getContext("2d");
      // var point=[{cors:'126,251,242,130,128/206,183,286,276,208'},
      // {cors:'70,164,168,88,72/132,93,176,174,132'}]
      // console.log(point[0]);
      for (let i = 0; i < farmAreaDetails.length; i++) {
        drawPolygon(ctx2, farmAreaDetails[i].coordinates, "blue");
      }
    }
  };
  const drawPolygon = (ctx, points, color) => {
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
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    for (var i = 1; i < p[0].length; i++) {
      ctx.lineTo(p[0][i], p[1][i]);
      // console.log(p[0][i], p[1][i]);
    }
    ctx.closePath();
    ctx.stroke();
    canvasRef.current.style.cursor = "pointer";
  };
  const handleShowMouseDown = (e) => {
    console.log("----------------3", e);
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
        drawPolygon(ctx2, farmAreaDetails[i].coordinates, "blue");
        if (ctx2.isPointInPath(x, y)) {
          // ctx2.globalAlpha = 0.1;
          drawPolygon(ctx2, farmAreaDetails[i].coordinates, "red");
          setSelectedCanvaArea(farmAreaDetails[i]);
          console.log(farmAreaDetails[i]);
          GetSideBarCropDetails(farmAreaDetails[i].area_id);
          GetSideBarCropDetails(farmAreaDetails[i].area_id);

        }
      }
    }
  };

  const handleAddCropChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setAddCropData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const defaultOption = options[0];
  const handleClickAddCrop = () => {
    const now = moment();
    const DateTime = now.format("YYYY-MM-DD HH:mm:ss");
    const rgoods_id = Math.floor(1000 + Math.random() * 9000);
    const ncrop_id = Math.floor(1000 + Math.random() * 9000);
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to perform an action.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        if (
          selectedOption.crop_id == addCropData.crop_id &&
          selectedOption.crop_type == addCropData.h_type &&
          selectedOption.harvest_start == addCropData.h_start &&
          selectedOption.harvest_every == addCropData.h_every &&
          selectedOption.harvest_end == addCropData.h_period
        ) {
          // alert('good')
          Axios.post("/api/PF/InsertAgriTransaction", {
            dates: DateTime,
            email_id: "prasanthshan0123@gmail.com",
            farm_id: selectedCanvaArea.farm_id,
            area_id: selectedCanvaArea.area_id,
            crop_id: addCropData.crop_id,
            goods_id: rgoods_id,
            date_remarks: DateTime,
            remarks: "r1",
            type: 1,
            status: 0,
          }).then((res) => {
            console.log(res);
          });
          Axios.post("/api/PF/InsertAgriGoods", {
            dates: DateTime,
            farm_id: selectedCanvaArea.farm_id,
            area_id: selectedCanvaArea.area_id,
            crop_id: addCropData.crop_id,
            goods_id: rgoods_id,
            status: 1,
          }).then((res) => {
            GetSideBarCropDetails(selectedCanvaArea.area_id);
            console.log(res);
          });
        } else {
          Axios.post("/api/PF/InsertAgriTransaction", {
            dates: DateTime,
            email_id: "prasanthshan0123@gmail.com",
            farm_id: selectedCanvaArea.farm_id,
            area_id: selectedCanvaArea.area_id,
            crop_id: addCropData.crop_id,
            goods_id: rgoods_id,
            date_remarks: DateTime,
            remarks: "r1",
            type: 1,
            status: 0,
          }).then((res) => {
            console.log(res);
          });
          Axios.post("/api/PF/InsertAgriGoods", {
            dates: DateTime,
            farm_id: selectedCanvaArea.farm_id,
            area_id: selectedCanvaArea.area_id,
            // crop_id:addCropData.crop_id,
            crop_id: ncrop_id,
            goods_id: rgoods_id,
            status: 1,
          }).then((res) => {
            GetSideBarCropDetails(selectedCanvaArea.area_id);
            console.log(res);
          });
          Axios.post("/api/PF/InsertFarmCrop", {
            dates: DateTime,
            email: "prasanthshan0123@gmail.com",
            crop_id: addCropData.crop_id,
            newcrop_id: ncrop_id,
            crop_name: addCropData.name,
            crop_img: addCropData.img,
            crop_type: "1",
            harvest_start: addCropData.h_start,
            harvest_end: addCropData.h_period,
            harvest_every: addCropData.h_every,
            harvest_repeat: "1",
            remarks1: "r1",
            remarks2: "r2",
            remarks3: "r3",
            added_by: 0,
          }).then((res) => {
            console.log(res);
            GetSideBarCropDetails(selectedCanvaArea.area_id);
          });
          // alert('bad..')
        }
        Swal.fire("Action performed!", "You clicked Yes.", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "You clicked No or closed the dialog.", "error");
      }
    });

    setAddCrop(!addCrop);
  };
  useEffect(() => {
    getFarmCropDetails();
    handleAgriFarm();
    GetTileInformaton();
  }, []);

  const getFarmCropDetails = async () => {
    Axios.get("/api/PF/GetFarmCrops").then(({ data }) => {
      console.log("cropdata", data.data);
      // setAllCropsDetails(data.data)
      // setSideBarCropDetails(data.data)
      // setIsSidebar(true)
      setOptions(data.data);
      setSelectedOption(data.data[0]);
      setAddCropData((prev) => {
        return {
          ...prev,
          name: data.data[0].crop_name,
          img: data.data[0].crop_img,
          h_period: data.data[0].harvest_end,
          h_type: data.data[0].crop_type,
          h_start: data.data[0].harvest_start,
          h_every: data.data[0].harvest_every,
          crop_id: data.data[0].crop_id,
        };
      });
    });
  };
  const GetTileInformaton = () => {
    var totalArea = 0;
    if (farmDetails.length !== 0) {
      for (let i = 0; i < farmDetails.length; i++) {
        Axios.get(
          `/api/PF/GetFarmAreaDetails/farm_id=${farmDetails[i].farm_id}`
        ).then(({ data }) => {
          for (let j = 0; j < data.data.length; j++) {
            totalArea = totalArea + Number(data.data[j].area);
          }
        });
      }
      console.log("totalArea", totalArea);
    }
  };
  const handleAgriFarm = async () => {
    Axios.get("/api/PF/GetFarmDetails/user_id=01").then(({ data }) => {
      console.log("farm details", data.data);
      setFarmDetails(data.data);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.src = `${base_url}/img_uploads/${data.data[0].image}`;
      image.onload = () => {
        ctx.drawImage(image, 0, 0, 800, 700);
      };
      console.log("------data-------", data.data);
      if (farmDetails.length !== 0) {
        handleFarmSideBar(farmDetails[0].farm_id, 0);
      }
    });
  };
  const handleFarmSideBar = (farmid, index) => {
    Axios.get(`/api/PF/GetFarmAreaDetails/farm_id=${farmid}`).then(
      ({ data }) => {
        console.log("GetFarmAreaDetails", data.data);
        setFarmAreaDetails(data.data);
        setIsSidebar(false);
        // setSideBarCropDetails(allCropsDetails)
      }
    );
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = `${base_url}/img_uploads/${farmDetails[index].image}`;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, 800, 700);
    };
  };
  const handleChange = (option) => {
    setSelectedOption(option);
    setAddCropData((prev) => {
      return {
        ...prev,
        name: option.crop_name,
        img: option.crop_img,
        h_period: option.harvest_end,
        h_type: option.crop_type,
        h_start: option.harvest_start,
        h_every: option.harvest_every,
        crop_id: option.crop_id,
      };
    });
    console.log(addCropData);
  };
  const GetSideBarCropDetails = (area_id) => {
    var includeHarvestDatas = [];
    setAllCropsDetails([]);
    console.log(area_id);
    Axios.get(`/api/PF/GetAgriCrop/${area_id}`).then(({ data }) => {
      console.log("GetAgriCrop", data);
      setIsSidebar(true);
      data.data.forEach((item) => {
        Axios.get(`/api/PF/GetNextHarvest?goods_id=${item.goods_id}`).then(
          async (res) => {
            console.log("GetNextHarvest", res);
            console.log(
              "nextharvest",
              res.data.nextharvest == undefined
                ? res.data.data
                : res.data.nextharvest
            );
            var next_harvest =
              res.data.nextharvest == undefined
                ? res.data.data
                : res.data.nextharvest;
            //           const today = moment();
            // const date1 = moment(today, "DD-MM-YYYY");
            // const date2 = moment(next_harvest, "DD-MM-YYYY");
            // const differenceInDays = date2.diff(date1, 'days');
            item.next_harvest = await next_harvest;
            console.log(next_harvest, "days");
            includeHarvestDatas.push(item);
            setSideBarCropDetails(includeHarvestDatas);
          }
        );
      });
      console.log(data.data);
      if (includeHarvestDatas.length == 0) {
        setSideBarCropDetails(data.data);
      }
    });

    Axios.get(`/api/PF/GetAgriUserCrop/${area_id}`).then(({ data }) => {
      console.log("GetAgriUserCrop", data);
      setIsSidebar(true);
      data.data.forEach((item) => {
        Axios.get(`/api/PF/GetNextHarvest?goods_id=${item.goods_id}`).then(
          async (res) => {
            console.log("GetNextHarvest", res);
            console.log(
              "nextharvest",
              res.data.nextharvest == undefined
                ? res.data.data
                : res.data.nextharvest
            );
            var next_harvest =
              res.data.nextharvest == undefined
                ? res.data.data
                : res.data.nextharvest;
            //           const today = moment();
            // const date1 = moment(today, "DD-MM-YYYY");
            // const date2 = moment(next_harvest, "DD-MM-YYYY");
            // const differenceInDays = date2.diff(date1, 'days');
            item.next_harvest = await next_harvest;
            console.log(next_harvest, "days");
            includeHarvestDatas.push(item);
            // setSideBarCropDetails(includeHarvestDatas);
        setSideBarCropDetails(includeHarvestDatas);
          }

        );
      });
      console.log(data.data);
      if (includeHarvestDatas.length == 0) {
        setSideBarCropDetails(data.data);
      }
    });
  };
  const handleCropActions = () => {
    console.log(sideBarSelectedCrop);
    console.log(sideBarCropDetails);
    const now = moment();
    const DateTime = now.format("YYYY-MM-DD HH:mm:ss");
    const rgoods_id = Math.floor(1000 + Math.random() * 9000);
    const ncrop_id = Math.floor(1000 + Math.random() * 9000);
    if (actionType == "1") {
      Axios.post(`/api/PF/UpdateAgriGoods/${sideBarSelectedCrop.crop_id}`).then(
        (res) => {
          console.log(res);
          Axios.post("/api/PF/InsertAgriGoods", {
            dates: DateTime,
            farm_id: selectedCanvaArea.farm_id,
            area_id: selectedCanvaArea.area_id,
            crop_id: sideBarCropDetails[0].crop_id,
            goods_id: rgoods_id,
            status: 1,
          }).then((res) => {
            console.log(res);
          });
          // Axios.post("/api/PF/InsertAgriTransaction", {
          //   dates: DateTime,
          //   email_id: "prasanthshan0123@gmail.com",
          //   farm_id: selectedCanvaArea.farm_id,
          //   area_id: selectedCanvaArea.area_id,
          //   crop_id: sideBarCropDetails[0].crop_id,
          //   goods_id: sideBarCropDetails[0].goods_id,
          //   date_remarks: DateTime,
          //   remarks: "r1",
          //   type: 2,
          //   status: 0,
          // }).then((res) => {
          //   console.log(res);
          // });
          // new goodsid in acre transaction table
          Axios.post("/api/PF/InsertAgriTransaction", {
            dates: DateTime,
            email_id: "prasanthshan0123@gmail.com",
            farm_id: selectedCanvaArea.farm_id,
            area_id: selectedCanvaArea.area_id,
            crop_id: sideBarCropDetails[0].crop_id,
            goods_id: rgoods_id,
            date_remarks: DateTime,
            remarks: "r1",
            type: 11,
            status: 0,
          }).then((res) => {
            console.log(res);
          });
          setCropModel(!cropModel);
          setActionModel(!actionModel);
          GetSideBarCropDetails(selectedCanvaArea.area_id)
        }
      );
      console.log("sideBarSelectedCrop", sideBarSelectedCrop);
    } else if (actionType == "0") {
      Axios.post(`/api/PF/UpdateAgriGoods/${sideBarSelectedCrop.crop_id}`).then(
        (res) => {
          setCropModel(!cropModel);
          setActionModel(!actionModel);
          GetSideBarCropDetails(selectedCanvaArea.area_id)

        }
      );
    } else if (actionType == "") {
      Swal.fire({
        title: "Warnign !",
        text: "Please Select The Option",
        icon: "error",
      });
    }
  };
  const downloadQR = () => {
    const canvas = canvasRef.current;
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  const handleTimelineData = () => {
    var device_id = 0;
    setTimeLineModel(true);
    Axios.get(`/api/PF/GetAgriDevice/${sideBarSelectedCrop.area_id}`).then(
      ({ data }) => {
        console.log("device_id", data.data);
        // console.log(data.data[0].device_id);
        // setTimeLineModel(!timeLineModel)
        if (data.data.length !== 0) {
          device_id = data.data[0].device_id;
          Axios.get(
            `/api/PF/GetAgriTransaction_Goods/${sideBarSelectedCrop.goods_id}`
          ).then(({ data }) => {
            console.log("GetAgriTransaction_Goods", data.data);
            setTimelineSoughing(data.data);
            let start = moment(data.data[0].date_remarks).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            const now = moment();
            const end = now.format("YYYY-MM-DD HH:mm:ss");
            // let end=moment(data.data[1].date_remarks).format("YYYY-MM-DD hh:mm:ss")
            console.log("start : ", start, "end :", end);
            Axios.get(
              `/api/PF/GetAgriDeviceTransactions?startDate=${start}&endDate=${end}&device_id=${device_id}`
            ).then(({ data }) => {
              console.log(data.data);
              setTimeLimeModelData(data.data);
            });
          });
        } else {
          // alert('no devices')
          Axios.get(
            `/api/PF/GetAgriTransaction_Goods/${sideBarSelectedCrop.goods_id}`
          ).then(({ data }) => {
            console.log("GetAgriTransaction_Goods", data.data);
            setTimelineSoughing(data.data);
          });
        }
      }
    );
    //sideBarSelectedCrop.goods_id
  };
  const handleTimelineRemove = () => {
    const now = moment();
    const DateTime = now.format("YYYY-MM-DD HH:mm:ss");
    Axios.post(`/api/PF/UpdateAgriGoods/${sideBarSelectedCrop.crop_id}`).then(
      (res) => {
        Axios.post("/api/PF/InsertAgriTransaction", {
          dates: DateTime,
          email_id: "prasanthshan0123@gmail.com",
          farm_id: selectedCanvaArea.farm_id,
          area_id: selectedCanvaArea.area_id,
          crop_id: sideBarCropDetails[0].crop_id,
          goods_id: sideBarCropDetails[0].goods_id,
          date_remarks: DateTime,
          remarks: "r1",
          type: 2,
          status: 0,
        }).then((res) => {
          console.log(res);
          GetSideBarCropDetails(selectedCanvaArea.area_id);
          setTimeLineModel(false);
        });
      }
    );
  };
  return (
    <div>
      <div className="px-4 sm:ml-40">
        <div className="mt-2">
          <h1 className="font-bold text-2xl">
            Good Morning.{" "}
            <span className="font-bold text-2xl ">{user.name}</span>
          </h1>
        </div>
        <div className="py-2 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-5">
          <div>
            <a
              // onClick={() => setActionModel(true)}
              href="#"
              className="block max-w-sm py-6 px-3 bg-[#71f68b] border border-gray-200 rounded-lg shadow hover:bg-gray-100 "
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
                Total Farm Area
              </h5>
              <p className="font-normal  ">123 sq feet</p>
              <div className="border-b-2 py-1 border-solid border-[#616060]"></div>
              <h6 className="font-bold text-sm mt-2">Total area</h6>
              <p className="font-normal text-black mt-1">300 sq feet</p>
            </a>
          </div>
          <div>
            <a
              // onClick={() => setCropModel(true)}
              href="#"
              className="block max-w-sm py-6 px-3 bg-[#65d8a1] border border-gray-200 rounded-lg shadow hover:bg-gray-100 "
            >
              <h5 className=" text-2xl font-bold tracking-tight text-gray-900">
                Total Crops
              </h5>
              <h3 className="font-bold text-xl mt-1">
                {"allCropsDetails.length"}
              </h3>
              <div className="border-b-2 py-1 border-solid border-[#616060]"></div>
              <div className="flex justify-between items-center">
                <div className="flex-row ">
                  <p className="font-normal ">Crop for </p>
                  <h3 className=" font-normal  ">
                    {" "}
                    harvest <span className="font-bold text-xl">00</span>
                  </h3>
                </div>
                <div className="flex-row justify-center items-center">
                  <p className="font-normal ">Crop for </p>
                  <h3 className=" font-normal ">
                    {" "}
                    harvest <span className="font-bold text-xl">00</span>
                  </h3>
                </div>
              </div>
            </a>
          </div>
          <div>
            <a
              // onClick={() => setRemerksModel(true)}
              href="#"
              className="block max-w-sm p-6 bg-[#a9bf99] border border-gray-200 rounded-lg shadow hover:bg-gray-100"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
                Offline devices
              </h5>
              <p className="font-normal ">0</p>
              <div className="border-b-2 py-1 border-solid border-[#616060]"></div>

              <h6 className="font-bold text-sm mt-2">Total devices</h6>
              <p className="font-normal text-black mt-1">30</p>
            </a>
          </div>
          <div className="text-white">
            <a
              // onClick={() => setTimeLineModel(true)}
              href="#"
              className="block max-w-sm py-4 px-3 bg-[#77b8e2] border border-gray-200 rounded-lg shadow hover:bg-gray-400"
            >
              <h5 className=" mt-1 text-2xl font-bold tracking-tight ">
                Weather
              </h5>
              <div className="flex flex-row items-center">
                <BsFillCloudSunFill className="mx-1" size={17} />
                <h6 className="font-bold ">
                  {weather.length !== 0
                    ? Number(weather.main.temp - 273.15).toFixed(2)
                    : 0}
                  *C
                </h6>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center">
                  <IoWaterSharp className="mx-1" size={20} />
                  <h6 className="font-bold text-sm ">
                    {weather.length !== 0
                      ? Number(weather.main.humidity - 273.15).toFixed(2)
                      : 0}
                    Rh
                  </h6>
                </div>

                <div className="flex flex-row items-center">
                  <IoRainy className="mx-1" size={20} />
                  <h6 className="font-bold text-white ">
                    {weather.length !== 0
                      ? Number(weather.main.feels_like - 273.15).toFixed(2)
                      : 0}
                    %
                  </h6>
                </div>
              </div>
              <div className="border-b-2 my-1 border-solid border-[#616060]"></div>
              <div>
                <div className="flex flex-row items-center">
                  <MdLocationPin className="mx-1" size={25} />
                  <div>
                    <h6 className="font-bold ">
                      {weather.length !== 0 ? weather.name : ""}
                    </h6>
                    <h6 className="font-bold  ">
                      ({weather.length !== 0 ? weather.coord.lat : ""})
                    </h6>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="my-1 sm:ml-40 px-3 flex flex-row items-center">
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
          {isSidebar && (
            <>
              {sideBarCropDetails.length > 0 ? (
                <div className=" h-[700px] p-2 items-center flex flex-col justify-center ">
                  <h1 className="font-bold text-center">
                    Total Crops :{sideBarCropDetails.length}
                  </h1>

                  <div className="overflow-y-scroll w-full h-[600px]">
                    {sideBarCropDetails.map((item, index) => (
                      <div
                        key={item}
                        className="bg-green-300 rounded-md my-2 p-1"
                        onClick={() => setSideBarSelectedCrop(item)}
                      >
                        <img
                          src={`${base_url}/img_uploads/${item.crop_img}`}
                          className="w-[95%] rounded-sm ml-3 my-2 h-[150px]"
                        />
                        <div>
                          <div className="items-center flex flex-col justify-center">
                            <p className="text-gray-50000">
                              {moment(item.dates).format("YYYY-MM-DD HH:mm")}
                            </p>
                            <p className="text-black font-bold text-md">
                              Crop name : {item.crop_name}
                            </p>
                            <h5 className="text-[#3d6e2e] my-1 text-md font-bold">
                              Next harvest{" "}
                              <span className="font-extrabold text-md ">
                                In {item.next_harvest} Days
                              </span>
                            </h5>
                          </div>
                          <div className="flex items-center justify-around">
                            <div className="flex flex-row items-center">
                              <img
                                src={require("../assets/icons/temp.png")}
                                className="h-[24px] w-[24px]"
                              />
                              <div>
                                <p>Temperature</p>
                                <h5 className="font-bold text-md">32` C</h5>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-row items-center">
                                <img
                                  src={require("../assets/icons/drop.png")}
                                  className="h-[24px] w-[24px]"
                                />
                                <div>
                                  <p>Moisture</p>
                                  <h5 className="font-bold text-md">low</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p>----------------------------------</p>
                          <div className="flex items-center justify-around">
                            <div>
                              <div className="flex flex-row items-center">
                                <img
                                  src={require("../assets/icons/hplavel.png")}
                                  className="h-[24px] w-[24px]"
                                />
                                <div>
                                  <p>PH level</p>
                                  <h5 className="font-bold text-md">Normal</h5>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="flex flex-row items-center">
                                <img
                                  src={require("../assets/icons/tree.png")}
                                  className="h-[24px] w-[24px] mr-1"
                                />
                                <div>
                                  <p>NPK level</p>
                                  <h5 className="font-bold text-md">Normal</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-around mt-3">
                            <h5
                              className="text-black bg-green-400 my-2 mx-auto py-1 px-5 font-bold text-base rounded-md cursor-pointer"
                              onClick={() => {
                                setActionModel(true);
                              }}
                            >
                              Actions
                            </h5>
                            <div className="h-[30px] rounded-sm  bg-gray-500 w-[2.5px]"></div>
                            <h5
                              className="text-black bg-green-400 my-2 mx-auto py-1 px-5  text-base font-bold rounded-md cursor-pointer"
                              onClick={() => {
                                handleTimelineData();
                              }}
                            >
                              Timeline
                            </h5>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setAddCrop(true)}
                    className="text-black bg-green-400 my-2 mx-auto py-1 px-10  font-medium text-base rounded-md"
                  >
                    Add Crop
                  </button>
                </div>
              ) : (
                <div className="flex flex-col mx-5 justify-between h-24">
                  <button
                    onClick={() => setAddCrop(true)}
                    className="text-black bg-green-400 py-2 px-5 font-medium rounded-md"
                  >
                    Add Crop
                  </button>
                  <button className="text-black bg-slate-500 font-normal py-1 px-5 rounded-md">
                    Ploughing
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="dash_image__Carousel">
        {farmDetails.length !== 0 && (
          <FarmCarrousel
            data={farmDetails}
            handleFarmSideBar={handleFarmSideBar}
          />
        )}
      </div>
      {actionModel ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-[50%] my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#edf3ef] outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b-2 border-solid border-[#696b6a] rounded-t">
                  <h3 className="text-xl text-gray-500 font-bold">Actions</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setActionModel(false)}
                  >
                    <span className=" text-black  h-6 w-6 text-4xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="flex flex-col items-center justify-between h-[300px]">
                    <button
                      className=" border-2 focus:bg-green-600 focus:text-white  rounded-md border-green-600 text-2xl mx-3 py-4 w-[200px]  bg-green-200"
                      onClick={() => setActionType("1")}
                    >
                      Harvest
                    </button>
                    <button
                      className=" border-2 focus:bg-gray-600 focus:text-white  rounded-md border-gray-600 text-2xl mx-3 py-4 w-[200px]  bg-gray-200"
                      onClick={() => setActionType("2")}
                    >
                      Other
                    </button>
                    <button
                      className=" border-2 focus:bg-red-600 focus:text-white rounded-md border-red-600 text-2xl mx-3 py-4 w-[200px]  bg-red-200"
                      onClick={() => setActionType("0")}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setActionModel(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => handleCropActions()}
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
      {cropModel ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-[50%] my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#edf3ef] outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b-2 border-solid border-[#5f615f] rounded-t">
                  <h3 className="text-2xl text-gray-500 font-bold">
                    Crop Details
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setCropModel(false)}
                  >
                    <span className=" text-black  h-6 w-6 text-4xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="flex flex-col h-[350px]">
                    <div className="flex flex-row items-center justify-center">
                      <img
                        src={`${base_url}/img_uploads/${sideBarSelectedCrop.crop_img}`}
                        className="w-[200px] h-[150px] rounded-md"
                      />
                      <div className="flex-1 h-[150px] flex flex-col items-center">
                        <div>
                          <QRCode
                            value={`https://precisionfarminguser.netlify.app/`}
                            ref={QrRef}
                            className="mt-2 w-[200px] h-[120px]"
                          />
                          {/* <QRCode value={`192.168.1.4:3001/home/${sideBarSelectedCrop.goods_id}`} ref={QrRef}  className="mt-2 w-[200px] h-[120px]" /> */}
                        </div>
                        {/* <img src={require('../assets/icons/qrcode.png')} className="mt-2 w-[150px] h-[100px]" /> */}
                        <div className=" mt-3 flex flex-row items-center justify-center">
                          <img
                            src={require("../assets/icons/save.png")}
                            className=" mr-10 w-[24px] h-[24px] cursor-pointer"
                          />
                          <img
                            src={require("../assets/icons/download.png")}
                            onClick={downloadQR}
                            className="w-[24px] h-[24px] cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b-2 border-solid border-[#5c5c5c] "></div>
                    <div className="flex flex-row items-center justify-around my-3">
                      <div>
                        <p className="text-lg mt-1 text-gray-600 font-bold">
                          Crop name : {sideBarSelectedCrop.crop_name}
                        </p>
                        <p className="text-lg mt-1 text-gray-600 font-bold">
                          Swoed on : 12/01/2024
                        </p>
                        <p className="text-lg mt-2 text-gray-600  font-bold">
                          Harvested on :{" "}
                          {moment(currentDate).format("DD-MM-YYYY")}
                        </p>
                      </div>
                      <div className=" h-28 bg-[#7f7e7e] w-[2.5px]  " />
                      <div>
                        <p className="text-lg mt-1 text-gray-600 font-bold">
                          Location: Coimbatore,India
                        </p>
                        <p className="text-lg mt-1 text-gray-600 font-bold">
                          80.123.13.098
                        </p>
                        <p className="text-lg mt-2 text-gray-600  font-bold">
                          Farmer name : {user.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-around my-3">
                      <p className="text-lg mt-1 text-gray-500 font-bold">
                        NPK level:Normal
                      </p>
                      <p className="text-lg mt-1 text-gray-500 font-bold">
                        Other params:normal
                      </p>
                      <p className="text-lg mt-1 text-gray-500 font-bold">
                        Crop score: 86{" "}
                        <span className="text-gray-600  font-bold text-xl">
                          revert
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setCropModel(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setCropModel(false)}
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
      {remerksModel ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-[50%] my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#edf3ef] outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-[#ccd2ce] rounded-t">
                  <h3 className="text-2xl text-gray-500 font-bold">Actions</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setRemerksModel(false)}
                  >
                    <span className=" text-black  h-6 w-6 text-4xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="flex flex-col items-center justify-between bg-white h-[300px]"></div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setRemerksModel(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setRemerksModel(false)}
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
      {timeLineModel ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-[55%]  mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#edf3ef] outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-[#ccd2ce] rounded-t">
                  <div className="flex flex-1 flex-row items-center justify-around">
                    <h3 className="text-xl text-gray-600 font-semibold">
                      Timeline
                    </h3>
                    <h3 className="text-xl text-gray-600 font-semibold">
                      Date range picker
                    </h3>
                    <div>
                      <select className="w-[150px] rounded-sm h-[35px]">
                        <option defaultChecked hidden>
                          All
                        </option>
                        <option>Actions</option>
                        <option>IOT data</option>
                        <option>Others</option>
                      </select>
                    </div>
                  </div>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setTimeLineModel(false)}
                  >
                    <span className=" text-black  h-6 w-6 text-4xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-3 flex-auto">
                  {
                    // timeLimeModelData.length>0&&(
                    <>
                      {timelineSoughing.length !== 0 && (
                        <div className="w-full my-1 ">
                          <div className="flex flex-row items-center justify-between bg-white p-2 h-32 rounded-sm">
                            <img
                              src={require("../assets/icons/tractor.png")}
                              className="w-[130px] h-[100px] rounded-md"
                            />
                            <div className="flex-1">
                              <h3
                                className="text-xl text-right text-gray-600 font-bold cursor-pointer"
                                onClick={handleTimelineRemove}
                              >
                                Remove
                              </h3>
                              <div className=" pl-5">
                                <h3 className="text-base text-gray-600 font-normal ">
                                  {moment(
                                    timelineSoughing[0].date_remarks
                                  ).format("DD-MM-YYYY hh-MM-SS")}
                                </h3>
                                <h3 className="text-lg  text-green-500 font-semibold">
                                  Soughing
                                </h3>
                                <div className="flex flex-row items-center justify-between">
                                  <div>
                                    <h3 className="text-lg text-gray-500 font-normal ">
                                      Remarks: Start of harvest
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {timeLimeModelData.length !== 0 && (
                        <>
                          {timeLimeModelData.map((item, index) => (
                            <div className="flex flex-row px-5 items-center justify-between bg-white h-36">
                              <img
                                src={`${base_url}/img_uploads/${item.img_url}`}
                                className="w-[130px] h-[100px]"
                              />
                              <div className="flex-1">
                                <h3
                                  className="text-xl text-right text-gray-600 font-bold cursor-pointer"
                                  onClick={handleTimelineRemove}
                                >
                                  Remove
                                </h3>
                                <div className="items-center pl-5">
                                  <h3 className="text-lg text-gray-600 font-normal ">
                                    {moment(item.dates).format(
                                      "DD MM YYYY HH:MM:SS"
                                    )}
                                  </h3>
                                  <h3 className="text-lg  text-green-500 font-semibold">
                                    Start of harvst
                                  </h3>
                                  <div className="flex flex-row items-center justify-between">
                                    <div className="flex-row flex justify-center items-center">
                                      <img
                                        src={require("../assets/icons/temp.png")}
                                        className="h-[24px] w-[24px]"
                                      />
                                      <div className="flex flex-col items-center">
                                        <h3 className="text-lg text-gray-500 font-normal ">
                                          Temperature
                                        </h3>
                                        <h3 className="text-lg  text-gray-600 font-bold">
                                          {item.data1} `C
                                        </h3>
                                      </div>
                                    </div>
                                    <div className="flex-row flex justify-center items-center">
                                      <img
                                        src={require("../assets/icons/drop.png")}
                                        className="h-[24px] w-[24px]"
                                      />
                                      <div className="flex flex-col items-center">
                                        <h3 className="text-lg text-gray-500 font-normal ">
                                          Moisture
                                        </h3>
                                        <h3 className="text-lg  text-gray-600 font-bold">
                                          {item.data2}
                                        </h3>
                                      </div>
                                    </div>
                                    <div className="flex-row flex justify-center items-center">
                                      <img
                                        src={require("../assets/icons/hplavel.png")}
                                        className="h-[24px] w-[24px]"
                                      />
                                      <div className="flex flex-col items-center justify-center">
                                        <h3 className="text-lg text-gray-500 font-normal ">
                                          PH level
                                        </h3>
                                        <h3 className="text-lg  text-gray-600 font-bold">
                                          {item.data3}
                                        </h3>
                                      </div>
                                    </div>
                                    <div className="flex-row flex justify-center items-center">
                                      <img
                                        src={require("../assets/icons/tree.png")}
                                        className="h-[24px] w-[24px]"
                                      />
                                      <div className="flex flex-col items-center justify-center">
                                        <h3 className="text-lg text-gray-500 font-normal ">
                                          NPK level
                                        </h3>
                                        <h3 className="text-lg  text-gray-600 font-bold">
                                          {item.data4}
                                        </h3>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      {timeLimeModelData.length !== 0 && (
                        <div className="w-full my-1">
                          <div className="flex flex-row items-center justify-between bg-white p-2 h-31 rounded-sm">
                            <img
                              src={require("../assets/icons/harvest.png")}
                              className="w-[130px] h-[100px] rounded-md"
                            />
                            <div className="flex-1">
                              <h3
                                className="text-xl text-right text-gray-600 font-bold cursor-pointer"
                                onClick={handleTimelineRemove}
                              >
                                Remove
                              </h3>
                              <div className=" pl-5">
                                <h3 className="text-lg text-gray-600 font-normal ">
                                  {timelineSoughing.length >= 2
                                    ? moment(
                                        timelineSoughing[1].date_remarks
                                      ).format("DD-MM-YYYY hh-MM-SS")
                                    : moment(currentDate).format(
                                        "DD-MM-YYYY hh-MM-SS"
                                      )}
                                </h3>
                                <h3 className="text-lg  text-green-500 font-semibold">
                                  Harvest
                                </h3>
                                <div className="flex flex-row items-center justify-between">
                                  <div>
                                    <h3 className="text-lg text-gray-500 font-normal ">
                                      Remarks: Start of harvest
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                    // )
                  }
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-2 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setTimeLineModel(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setTimeLineModel(false)}
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

      {addCrop ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div
              className="relative w-[50%] 
             my-6  mx-auto max-w-3xl"
            >
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#edf3ef] outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b-2 border-solid border-[#8b8b8b] rounded-t">
                  <h3 className="text-xl text-gray-500 font-bold">Add Crop</h3>
                  <button
                    className="ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setAddCrop(false)}
                  >
                    <span className=" text-black  h-6 w-6 text-4xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="flex flex-row justify-around">
                    <h4 className="text-base text-gray-500 font-bold">
                      Add Crop
                    </h4>
                    <div className=" bg-white flex-1 mx-10">
                      {/* <Dropdown
                        options={options}
                        onChange={(e) => setAddCropName(e.value)}
                        value={defaultOption}
                        placeholder="Select an option"
                      /> */}
                      {options.length > 0 && (
                        <div className="crop__drobdown-ctn">
                          <Select
                            value={selectedOption}
                            onChange={handleChange}
                            options={options}
                            getOptionLabel={(option) => (
                              <div className="crop__drobdown">
                                <div style={{ flex: 0.3 }}>
                                  <img
                                    className="crop__drobdown-img"
                                    src={`${base_url}/img_uploads/${option.crop_img}`}
                                    alt={option.crop_name}
                                  />
                                </div>
                                <h3 className="crop__drobdown-title">
                                  {option.crop_name}
                                </h3>
                              </div>
                            )}
                            styles={customStyles}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-around p-5  my-2 border-y-2 border-solid border-[#8b8b8b] ">
                    <img
                      src={`${base_url}/img_uploads/${addCropData.img}`}
                      className="w-[150px] rounded-md h-[100px]"
                    />
                    <div className="flex-1 ml-5">
                      <p className="text-xs text-black font-bold">
                        #{addCropData.crop_id}
                      </p>
                      <p className="text-sm text-black font-bold">
                        {addCropData.name}
                      </p>
                      <div className="flex-row flex">
                        <p className="text-xs text-black font-bold">
                          Total harvest period :{" "}
                          <input
                            type="number"
                            id="period"
                            className="w-[35px] bg-transparent"
                            name="h_period"
                            value={addCropData.h_period}
                            onChange={handleAddCropChange}
                          />
                          <label htmlFor="period" className="font-normal">
                            days{" "}
                          </label>
                        </p>
                        <label htmlFor="period">
                          <BsPencilFill
                            size={12}
                            className="ml-0.5"
                            color="brown"
                          />
                        </label>
                      </div>
                      <div className="flex flex-row justify-start items-center">
                        <p className="text-xs text-black font-bold">
                          Harvest type :
                        </p>
                        <select
                          value={addCropData.h_type}
                          name="h_type"
                          onChange={handleAddCropChange}
                          className="ml-1 mt-1 h-[20px] rounded-md text-xs p-0border"
                        >
                          <option selected disabled className="hidden">
                            Types
                          </option>
                          <option value="1">Reapeated</option>
                          <option value="0">No Reapeaded</option>
                        </select>
                        {/* <Dropdown options={harvests} className='h-[10px]'  value={defaultOption} placeholder="Select an option" /> */}
                      </div>
                      <div className="flex-row flex">
                        <p className="text-xs text-black font-bold">
                          Harvest start :{" "}
                          <input
                            type="number"
                            id="h_start"
                            value={addCropData.h_start}
                            name="h_start"
                            onChange={handleAddCropChange}
                            className="w-[35px] bg-transparent"
                          />
                          <label htmlFor="h_start" className="font-normal">
                            days{" "}
                          </label>
                        </p>
                        <label htmlFor="h_start">
                          <BsPencilFill
                            size={12}
                            className="ml-0.5"
                            color="brown"
                          />
                        </label>
                      </div>
                      <div className="flex-row flex">
                        <p className="text-xs text-black font-bold">
                          Harvest every :{" "}
                          <input
                            type="number"
                            id="h_every"
                            className="w-[30px] bg-transparent"
                            onChange={handleAddCropChange}
                            value={addCropData.h_every}
                            name="h_every"
                          />
                          <label htmlFor="h_every" className="font-normal mb-1">
                            days{" "}
                          </label>
                        </p>
                        <label htmlFor="h_every">
                          <BsPencilFill
                            size={12}
                            className="ml-0.5"
                            color="brown"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-row justify-between mt-3">
                      <div>
                        <p className="text-xs text-black font-bold">
                          Soughing Date:
                        </p>
                        <div className="flex flex-row items-center">
                          <input
                            type="date"
                            value={moment(currentDate).format("YYYY-MM-DD")}
                            onChange={(event) => {
                              // moment().format("YYYY-MM-DD")
                              setCurrentDate(moment(event.target.value));
                            }}
                            className="bg-transparent text-xs font-normal mt-1"
                            id="startdate"
                          />
                          <label htmlFor="startdate">
                            <BsPencilFill
                              size={12}
                              className="ml-0.5"
                              color="brown"
                            />
                          </label>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-black font-bold">
                          Harvest start date :
                        </p>
                        <div className="flex flex-row items-center">
                          <input
                            value={moment(currentDate)
                              .add(addCropData.h_start, "days")
                              .format("YYYY-MM-DD")}
                            // onChange={(event)=>{setCurrentDate(event.target.value)}}
                            className="bg-transparent text-xs font-normal mt-1 cursor-pointer"
                            id="startdate"
                          />
                          {/* <label htmlFor="">
                            <BsPencilFill
                              size={12}
                              className="ml-0.5"
                              color="brown"
                            />
                          </label> */}
                        </div>
                        {/* <span className="font-normal text-xs">{addCropData.h_start} Days</span> */}
                      </div>
                      <div>
                        <p className="text-xs text-black font-bold">
                          Harvest every:
                        </p>
                        <span className="font-normal text-xs">
                          {addCropData.h_every} Days
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-black font-bold">
                          Harvest end Date:
                        </p>
                        <div className="flex flex-row items-center">
                          <input
                            value={moment(currentDate)
                              .add(addCropData.h_period, "days")
                              .format("YYYY-MM-DD")}
                            // onChange={(event)=>{setCurrentDate(event.target.value)}}
                            className="bg-transparent text-xs font-normal mt-1 cursor-pointer"
                            id="startdate"
                          />
                          {/* <label htmlFor="">
                            <BsPencilFill
                              size={12}
                              className="ml-0.5"
                              color="brown"
                            />
                          </label> */}
                        </div>
                        {/* <span className="font-normal text-xs">{addCropData.h_period} Days</span> */}
                      </div>
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end border-t border-solid border-blueGray-200 rounded-b m-2">
                  <button
                    className="text-white bg-red-500 rounded-md font-medium px-5 py-1 outline-none focus:outline-none mr-3 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setAddCrop(false)}
                  >
                    Close
                  </button>
                  <button
                    onClick={handleClickAddCrop}
                    className="text-white bg-green-700 py-1 px-5 font-medium rounded-md"
                  >
                    Add Crop
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

export default Dashboard;
