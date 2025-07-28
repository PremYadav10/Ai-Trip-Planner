import React from 'react'
import { Link } from 'react-router-dom'
import PlaceCard from './PlaceCard';

function PlacesToVisit({ trip }) {
    return (
        <div>
            <h2 className='font-bold text-lg mt-2'>Places To Visit</h2>
            <div className='mt-2'>
                {trip?.tripData?.travelPlan?.itinerary?.map((item, index) => (
                    <div key={index} className='mb-10'>
                        <h2 className='font-bold text-lg'>{item?.day}</h2>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5' key={index}>
                            {item?.plan?.map((place, index) => (
                                <PlaceCard index={index} place={place} trip={trip} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlacesToVisit