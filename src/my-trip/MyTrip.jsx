import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../service/firebaseconfig'; 
import UserTripCardItem from './UserTripCardItem';




function MyTrip() {
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserTrips();
  }, []);

  /**
   * Used to get all User Trips from Firestore
   */
  const getUserTrips = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      
      window.location.href = '/';
      return;
    }

    // Clear previous trips before fetching new ones
    setUserTrips([]);

    // Construct the Firestore query
    const q = query(
      collection(db, "AiTrips"), 
      where("userEmail", "==", user?.email)
    );

    try {
      const querySnapshot = await getDocs(q);
      const trips = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        trips.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setUserTrips(trips);
    //   setUserTrips(prevValue => [...prevValue, doc.data()])
    } catch (error) {
      console.error("Error fetching user trips: ", error);
      // You can add a toast notification for the error here if you like
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">My Trips</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-10">
        {loading ? (
          // Skeleton loading effect
          [1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-[220px] w-full bg-slate-200 animate-pulse rounded-xl">
            </div>
          ))
        ) : (
          // Actual trip data
          userTrips.map((trip, index) => (
            <UserTripCardItem trip={trip} key={index} />
          ))
        )}
      </div>
    </div>
  );
}

export default MyTrip;