import React, { useEffect, useState } from 'react'
import Chart from "react-apexcharts";
import { Axios } from '../helpers/axios';
import { useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
const Consumption = () => {
  const { device_id } = useParams();
  const [isConsumption, setIsConsumption] = useState(true)
  const [powerConsumption, setPowerConsumption] = useState({
    series: [{
    name: 'Enery (Wh)',
    data: [44, 55, 41, 37, 22, 43, 21]
  }, {
    name: 'Cost (INR)',
    data: [53, 32, 33, 52, 13, 43, 32]
  }],
  options: {
    chart: {
      type: 'bar',
      height: 350,
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          total: {
            enabled: true,
            offsetX: 0,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    title: {
      text: 'Energy Monitor'
    },
    xaxis: {
      categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
      labels: {
        formatter: function (val) {
          return val + "K"
        }
      }
    },
    yaxis: {
      title: {
        text: undefined
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "K"
        }
      }
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40
    }
  }
  })
const [StartDate, setStartDate] = useState(moment().format("YYYY-MM-DD"))
const [EndDate, setEndDate] = useState(moment().format("YYYY-MM-DD"))
  const handleIsConsumption=()=>{
    setIsConsumption(!isConsumption)
    handleAnalytics(isConsumption==true?'GetPower' :'GetConsumption',device_id,moment(StartDate).format("YYYY-MM-DD"),moment(EndDate).format("YYYY-MM-DD"))
  }
  useEffect(()=>{
    handleAnalytics('GetPower',device_id,moment(StartDate).format("YYYY-MM-DD"),moment(EndDate).format("YYYY-MM-DD"))
  },[])
  // handleAnalytics('GetPower','GetConsumption',device_id)
  function days_between(date1, date2) {
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const differenceMs = Math.abs(new Date(date1) - new Date(date2));
    return Math.round(differenceMs / ONE_DAY);

}
  const handleAnalytics=(type,device_id,startDate,endDate)=>{
    console.log(startDate,endDate);
    Axios.get(`device/${type}?device_id=${device_id}&StartDate=${startDate}&EndDate=${endDate}`).then(({data})=>{
      console.log('result',data.result);
      var cons=data.result
      var optval=[]
      var optcost=[]
      var optlabel=[]
    var dybet=days_between(startDate,endDate)
      for(let i=0;i<cons.length;i++){
        // console.log(cons[i].power?cons[i].power:cons[i].consumption)
        optval.push(cons[i].power?cons[i].power:cons[i].consumption)
        optcost.push(cons[i].power?cons[i].power*5:cons[i].consumption*5)
        optlabel.push(dybet==1?moment(cons[i].date).format('hh:mm:ss'):moment(cons[i].date).format('DD-MM-YYYY'))

      }
      setPowerConsumption({
        series: [{
          name: 'Enery (Wh)',
          data: optval
        }, {
          name: 'Cost (INR)',
          data: optcost
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350,
            stacked: false,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              dataLabels: {
                total: {
                  enabled: true,
                  offsetX: 0,
                  style: {
                    fontSize: '13px',
                    fontWeight: 900
                  }
                }
              }
            },
          },
          stroke: {
            width: 1,
            colors: ['#fff']
          },
          title: {
            text: 'Energy Monitor'
          },
          xaxis: {
            categories: optlabel,
            labels: {
              formatter: function (val) {
                return val + ""
              }
            }
          },
          yaxis: {
            title: {
              text: undefined
            },
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + ""
              }
            }
          },
          fill: {
            opacity: 1
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
          }
        }
        })
    })
  }
  const handleTimeRange=(e)=>{
    setStartDate(e[0])
    setEndDate(e[1])
  }
  const handleSubmit=(name)=>{
    console.log(name);
      handleAnalytics(name,device_id,moment(StartDate).format("YYYY-MM-DD"),moment(EndDate).format("YYYY-MM-DD"))
  }
  return (
    <div className='sm:ml-40'>
<div class="text-sm w-full font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
    <ul class="flex flex-row justify-around items-center -mb-px">
        <li class="me-2 w-[50%]" onClick={handleIsConsumption}>
            <a href="#" className={`inline-block p-4 ${isConsumption ?'border-b-2 border-transparent  hover:text-blue-800 hover:border-blue-800 dark:hover:text-blue-800' : 'text-blue-600 border-b-2 border-blue-600' }  rounded-t-lg`}>Energy consumption</a>
        </li>
        <li class="me-2 w-[50%] " onClick={handleIsConsumption}>
            <a href="#" className={`inline-block p-4 ${isConsumption ? 'text-blue-600 border-b-2 border-blue-600':'border-b-2 border-transparent  hover:text-blue-800 hover:border-blue-800 dark:hover:text-blue-800'}  rounded-t-lg active`} aria-current="page">Water consumption</a>
        </li>
    </ul>
</div>
   {
    isConsumption==true ?(
  <>
      <div className='p-5 flex flex-row items-center justify-center  w-full'>
     <div className="p-2 mx-10 border-2 border-green-700 cursor-pointer rounded-md">
       <DatePicker
      selectsRange={true}
      startDate={StartDate}
      endDate={EndDate}
      onChange={handleTimeRange}
      className='cursor-pointer border-none outline-none'
      // dateFormatCalendar={'DD-MM-YYYY'}
      
      />
     </div>
      <button type="button" onClick={()=>{handleSubmit("GetConsumption")}} class="text-white mt-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Search</button>

    </div>

<div id="column-chart mx-3 ml-5">
    <Chart
            options={powerConsumption.options}
            series={powerConsumption.series}
            type="bar"
            width="1100"
          />
  </div></>
    ):(
     <>
      <div className='p-5 flex flex-row items-center justify-center  w-full'>
     <div className="p-2 mx-10 border-2 border-green-700 cursor-pointer rounded-md">
       <DatePicker
      selectsRange={true}
      startDate={StartDate}
      endDate={EndDate}
      onChange={handleTimeRange}
      className='cursor-pointer border-none outline-none'
      // dateFormatCalendar={'DD-MM-YYYY'}
      
      />
     </div>
      <button type="button" onClick={()=>{handleSubmit("GetPower")}} class="text-white mt-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Search</button>

    </div>

<div id="column-chart mx-3 ml-5">
    <Chart
            options={powerConsumption.options}
            series={powerConsumption.series}
            type="bar"
            width="1100"
          />
  </div></>
    )
   }

    </div>
  )
}

export default Consumption