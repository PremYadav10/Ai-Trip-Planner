import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPhotoByQuery } from '../service/UnsplashApi'


function UserTripCardItem({ trip,index }) {
 // console.log("Trip Data in usertripcard:", trip);
  const [photoUrl, setPhotoUrl] = useState("https://cdn.pixabay.com/photo/2023/08/06/23/16/ai-generated-8173941_1280.png"); // Start with a placeholder

  useEffect(() => {
    if (trip?.userSelecation?.destination) {
      fetchPlacePhoto();
    }
  }, [trip]);

  /**
   * Used to get the photo for the trip card from Unsplash
   */
  const fetchPlacePhoto = async () => {
    try {
      const query = trip.userSelecation.destination;
      const response = await getPhotoByQuery(query);
      const result = response.data.results[0];
      if (result) {
        setPhotoUrl(result.urls.regular);
      }
    } catch (error) {
      console.error("Error fetching photo for card:", error);
      // If there's an error, the placeholder will remain
    }
  };

  return (
    <Link to={`/view-trip/${trip.id}`}>
      <div className="hover:scale-105 transition-all cursor-pointer">
        <img 
          src={photoUrl?photoUrl:"https://cdn.pixabay.com/photo/2023/08/06/23/16/ai-generated-8173941_1280.png"} 
          className="object-cover rounded-xl h-[220px]" 
         
        />
        <div className="mt-2">
          <h2 className="font-bold text-lg">{trip?.userSelecation?.destination}</h2>
          <h2 className="text-sm text-gray-500">
            {trip?.userSelecation?.days} Days trip with {trip?.userSelecation?.budget} Budget
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;