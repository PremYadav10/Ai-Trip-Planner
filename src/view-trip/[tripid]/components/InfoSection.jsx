import React, { useEffect,useState } from 'react'
import { IoIosSend } from "react-icons/io";
import { getPhotoByQuery } from '@/service/UnsplashApi';

function InfoSection({trip}) {

    const [placePhotoUrl, setPlacePhotoUrl] = useState(null); // Photo URL save karne ke liye state

    useEffect(()=>{
            trip&&fetchPlacePhoto(trip?.userSelecation?.destination);
    },[trip])

    const fetchPlacePhoto = async (placeName) => {
    try {
      const response = await getPhotoByQuery(placeName);
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
    <div className='flex flex-col   gap-4 p-4'>
        <img src={trip?placePhotoUrl:"https://cdn.pixabay.com/photo/2023/08/06/23/16/ai-generated-8173941_1280.png"} className='h-[300px] w-full object-cover rounded-2xl'/>
    
        <div className='my-5 flex flex-col gap-2'>
            <h2 className='font-bold text-2xl'>{trip?.userSelecation?.destination}</h2>
            <div className='flex flex-wrap gap-2'>
                <h2 className='p-1 px-3 bg-gray-400 text-sm w-fit rounded-lg'>
                    📅 Number of days : {trip?.userSelecation?.days} 
                </h2>

                <h2 className='p-1 px-3 bg-gray-400 text-sm w-fit rounded-lg '>
                   💰 Budget : {trip?.userSelecation?.budget} 
                </h2>

                <h2 className='p-1 px-3 bg-gray-400 text-sm w-fit rounded-lg '>
                   🧑🏻‍🤝‍🧑🏻 Number Of Peoples : {trip?.userSelecation?.companion} 
                </h2>
            </div>
        </div>
        <button> <IoIosSend/></button>
    </div>
  )
}

export default InfoSection