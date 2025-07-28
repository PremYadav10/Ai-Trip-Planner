import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { getPhotoByQuery } from '@/service/UnsplashApi';


function HotelItemCard({ hotel, index, trip }) {
    const [placePhotoUrl, setPlacePhotoUrl] = useState(null);

    useEffect(() => {
        trip && fetchPlacePhoto(hotel?.hotelName + ',' + hotel?.hotelAddress);
    }, [trip])

    const fetchPlacePhoto = async (placeName) => {
        try {
            const response = await getPhotoByQuery(placeName);
            //console.log("Unsplash Response:", response);
            const photo = response.data.results[0];

            if (photo) {
                // Photo ka URL mil gaya
                const photoUrl = photo.urls.regular; // Hum 'regular' size ki photo use kar rahe hain
                //console.log("Unsplash Photo URL:", photoUrl);
                setPlacePhotoUrl(photoUrl); // State mein URL save karein
            } else {
                console.log("No photos found on Unsplash for this query.");
                setPlacePhotoUrl(null); // Agar photo nahi hai to state ko clear karein
            }
        } catch (error) {
            console.error("Error fetching photo from Unsplash:", error);
        }
    };
    return (
        <div>
            <Link to={'https://www.google.com/maps/search/?api=1&query=' + hotel?.hotelName + ',' + hotel?.hotelAddress} target='_blank'>
                <div className='hover:scale-105 transition-all duration-100 ease-in-out p-2 rounded-lg shadow-md cursor-pointer' key={index}>
                    <img src={trip?placePhotoUrl:"https://cdn.pixabay.com/photo/2023/08/06/23/16/ai-generated-8173941_1280.png"} className='h-[300px] w-[300px]  object-cover rounded-2xl' />
                    <div className='my-3'>
                        <h2 className='font-medium'>{hotel?.hotelName}</h2>
                        <h2 className='text-xs text-gray-500'> 📍 {hotel?.hotelAddress}</h2>
                        <h2 className='text-xs text-gray-500'>💰Price : {hotel?.price} / Night</h2>
                        <h2 className='text-xs text-gray-500'> ⭐Rating : {hotel?.rating} </h2>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default HotelItemCard