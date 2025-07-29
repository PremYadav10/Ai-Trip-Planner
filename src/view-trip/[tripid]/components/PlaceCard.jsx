import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { getPhotoByQuery } from '@/service/UnsplashApi';

function PlaceCard({index, place, trip }) {

    const [placePhotoUrl, setPlacePhotoUrl] = useState(null);

    useEffect(() => {
        trip && fetchPlacePhoto(place?.placeName);
    }, [trip])

    const fetchPlacePhoto = async (placeName) => {
        try {
            const response = await getPhotoByQuery(placeName + ',' + trip.userSelecation.destination);
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

        <Link to={'https://www.google.com/maps/search/?api=1&query=' + place?.placeName} target='_blank'>

            <div key={index} className='flex gap-2 my-1 border-2 border-gray-200 p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-100 ease-in-out sm:flex-row flex-col items-center sm:items-start'>
                <div>
                    <img src={trip?placePhotoUrl:"https://cdn.pixabay.com/photo/2023/08/06/23/16/ai-generated-8173941_1280.png"} className='lg:h-[20vh] md:h-[20vh] h-[25vh] lg:w-[20vw] md:w-[20vw] w-[80vw] object-cover rounded-2xl' />
                </div>
                <div>
                    <h2 className='text-md font-medium'>{place?.placeName}</h2>
                    <h2 className='text-sm text-gray-500'>{place?.placeDetails}</h2>
                    <h2 className='text-sm text-gray-500'>🕒 Time: {place?.timeTravel}</h2>
                    <h2 className='text-sm text-gray-500'>💰 Price: {place?.ticketPricing}</h2>
                    <h2 className='text-sm text-gray-500'>⭐ Rating: {place?.rating}</h2>
                </div>
            </div>
        </Link>

    )
}

export default PlaceCard