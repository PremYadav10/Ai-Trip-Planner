import React, { use } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../service/firebaseconfig'
import { useEffect,useState } from 'react'
import InfoSection from './components/InfoSection'
import Hotel from './components/Hotel'
import PlacesToVisit from './components/PlacesToVisit'
import Footer from './components/Footer'

function ViewTrip() {
    const {tripid} = useParams();
    const [trip,setTrip] = useState([]);

    useEffect(() => {
        tripid&&GetTripData();
    }, [tripid]);

    const GetTripData = async () => {
        const docRef = doc(db, 'AiTrips', tripid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            //console.log("Document data:", docSnap.data());
            setTrip(docSnap.data());      
        }
        else {
            console.log("No such document!");
            //toast("No such trip found!");
        }
    }
  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
        {/* Information Section */}
        <InfoSection trip={trip} />

        {/* Recomandated Hotels */}
        <Hotel trip={trip} />

        {/* Daily Plans or Itinerary  */}
        <PlacesToVisit trip={trip}/>


        {/* Footer  */}
        <Footer />
    </div>
  )
    }

export default ViewTrip