import React, { useEffect } from 'react'
import "./FarmCarrousel.css"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick'
import { base_url } from '../../helpers/axios';
const FarmCarrousel = ({data,handleFarmSideBar}) => {
    var settings = {
        dots: false,
        infinite:true,
        speed: 1000,
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplaySpeed:3000,
        row:1
      };
      useEffect(()=>{
        if(data.length !==0){
        handleFarmSideBar(data[0].farm_id,0)
        }
      },[])
  return (
    <Slider {...settings}>
    {
        data.map((item,index)=>(
            <div key={item.farm_id} className='farm__Carousel focus:border-2 focus:border-red-600' onClick={()=>handleFarmSideBar(item.farm_id,index)}>
                <img className='farm__Carousel-img' src={`${base_url}/img_uploads/${item.image}`}/>
            </div>
        ))
    } 
    </Slider>
  )
}

export default FarmCarrousel