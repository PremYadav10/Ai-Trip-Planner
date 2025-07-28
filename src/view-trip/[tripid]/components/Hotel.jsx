import React from 'react'
import { Link } from 'react-router-dom'
import HotelItemCard from './HotelItemCard';

function Hotel({trip}) {
  return (
    <div>
        <h2 className='font-bold text-xl mt-5'>Hotel Recomendation</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5'>
            {trip?.tripData?.travelPlan?.hotels?.map((hotel,index)=>(
                <HotelItemCard hotel={hotel} index={index} trip={trip}/>
                ))}
        </div>
    </div>
    )  
}

export default Hotel