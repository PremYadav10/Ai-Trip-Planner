import React, { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import NominatimAutocomplete from '../components/NominatimAutocomplete';
import { chatSession } from '../service/AiModel'; // Path sahi hai, yeh assume kar rahe hain
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FaGoogle } from "react-icons/fa";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../service/firebaseconfig';
  import { ToastContainer, toast } from 'react-toastify';
  

import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner'; // FIX 1: 'toast' ko import karna zaruri hai
// AI_PROMPT ko function ke bahar define karein taaki yeh har baar re-create na ho.

const AI_PROMPT = 'Generate Travel Plan for Location : {location}, for {totalDays} Days for {traveler} with a {budget} budget, Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format.';



export default function CreateTripForm() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
      console.log("Login Success:", codeResp)
      GetUserProfile(codeResp);
    },
    onError: (error) => console.error("Login Failed:", error)
  });

  const OnGenerateTrip = async (data) => {

    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDialog(true);
      return;
    }

    console.log("Trip Data:", data);

    if (!data.destination || !data.days || !data.budget || !data.companion) {
      // toast.error('Please fill all details!');
      return;
    }

    setLoading(true);

    // Step 2: User ke input se final prompt taiyar karein
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', data.destination)
      .replace(/{totalDays}/g, data.days) // '/g' (global flag) se {totalDays} ke sabhi instances replace honge
      .replace('{traveler}', data.companion)
      .replace('{budget}', data.budget);

    console.log("Sending Prompt to AI:", FINAL_PROMPT);

    // Step 3: AI model ko prompt bhejein
    let tripData;
    try {
      // toast.info("Generating your trip... Please wait.");
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      //console.log("AI Response:", result);

      // Step 4: Response ko extract karein
      const responseText = await result.response.text();
      //console.log("AI Response Text:", responseText);

      // Step 5: Text response ko JSON object mein convert karein
      // FIX 4: JSON.parse ko try-catch mein rakhna zaruri hai, kyunki agar response valid JSON nahi hai toh error aayega.
      
      // --- START OF THE FIX ---

      // Step 1: Find the start and end of the JSON block
      const startIndex = responseText.indexOf('{');
      const endIndex = responseText.lastIndexOf('}');
      
      if (startIndex === -1 || endIndex === -1) {
        throw new Error("Valid JSON object not found in the response.");
      }
      
      // Step 2: Extract only the JSON part of the string
      const jsonString = responseText.substring(startIndex, endIndex + 1);
      
      console.log("Cleaned JSON String:", jsonString);

      try {
        tripData = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        // toast.error('Error parsing trip data. Please try again.');
        return;
      }
      console.log("Final JSON Data:", tripData);

      // toast.success("Trip generated successfully!");

    } catch (error) {
      console.log("Error communicating with AI:", error);
      // toast.error('Error generating trip. Please try again.');
    }

    setLoading(false);

    // Step 6: Firebase mein save karein
    SaveAiTrip(data, tripData);
  }

  const GetUserProfile = (tokenInfo) => {
    console.log("Token Info:", tokenInfo);
    console.log("Access Token:", tokenInfo?.access_token);
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {

      headers: { 
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json'
      }
    }).then((response) => {
      console.log("User Profileresponse :", response);
      localStorage.setItem('user', JSON.stringify(response.data));
      setOpenDialog(false);
      OnGenerateTrip();
    })
  }

  const SaveAiTrip = async (formData, TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();

    await setDoc(doc(db, "AiTrips", docId), {
      userSelecation: formData,
      tripData: TripData,
      userEmail: user?.email,
      id: docId
    });

    setLoading(false);
    navigate(`/view-trip/${docId}`); 
  }




  // Naya function: Place name se photo fetch karne ke liye
  

  const budget = watch("budget");
  const companion = watch("companion");

  return (
    <form
      onSubmit={handleSubmit(OnGenerateTrip)}
      className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow space-y-6 my-7"
    >
      <h2 className="text-2xl font-bold text-center text-blue-700">Tell us your travel preferences 🏕️🌴</h2>
      <p className="text-gray-600 text-center">
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      {/* Destination */}
      <div>
        <label className="block text-sm font-medium mb-1">What is your destination of choice?</label>
        <NominatimAutocomplete
          onSelect={(place) => {
            setValue("destination", place.display_name, { shouldValidate: true });
            setSelectedPlace(place);
          }}
        />
        <input type="hidden" {...register("destination", { required: "Destination is required" })} />
        {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>}
      </div>

      {/* Days */}
      <div>
        <label className="block text-sm font-medium mb-1">How many days are you planning your trip?</label>
        <input
          type="number"
          placeholder="e.g., 3"
          {...register("days", {
            required: "Number of days is required",
            min: { value: 1, message: "Minimum 1 day" },
            max: { value: 8, message: "Maximum 8 days" }
          })}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.days && <p className="text-red-500 text-xs mt-1">{errors.days.message}</p>}
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium mb-2">What is your budget?</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { emoji: "💵", value: "cheap", label: "Cheap", desc: "Stay conscious of costs" },
            { emoji: "💰", value: "moderate", label: "Moderate", desc: "Average spending" },
            { emoji: "💸", value: "luxury", label: "Luxury", desc: "No cost concern" },
          ].map((item) => (
            <label
              key={item.value}
              className={`p-4 border rounded-xl cursor-pointer text-center transition-all ${budget === item.value ? "bg-blue-100 border-blue-600 ring-2 ring-blue-500" : "border-gray-300"
                }`}
            >
              <input type="radio" value={item.value} {...register("budget", { required: true })} className="hidden" />
              <div className="text-2xl">{item.emoji}</div>
              <div className="font-semibold mt-2">{item.label}</div>
              <div className="text-sm text-gray-500">{item.desc}</div>
            </label>
          ))}
        </div>
      </div>

      {/* Companion */}
      <div>
        <label className="block text-sm font-medium mb-2">Who are you traveling with?</label>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          {[
            { emoji: "✈️", value: "solo", label: "Just Me", desc: "A solo traveler" },
            { emoji: "🥂", value: "couple", label: "A Couple", desc: "Two travelers" },
            { emoji: "🏡", value: "family", label: "Family", desc: "Fun-loving group" },
            { emoji: "⛵", value: "friends", label: "Friends", desc: "Thrill-seekers" },
          ].map((item) => (
            <label
              key={item.value}
              className={`p-4 border rounded-xl cursor-pointer text-center transition-all ${companion === item.value ? "bg-blue-100 border-blue-600 ring-2 ring-blue-500" : "border-gray-300"
                }`}
            >
              <input type="radio" value={item.value} {...register("companion", { required: true })} className="hidden" />
              <div className="text-2xl">{item.emoji}</div>
              <div className="font-semibold mt-2">{item.label}</div>
              <div className="text-sm text-gray-500">{item.desc}</div>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        disabled={loading}
        type="submit"
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-center"
      >
        {loading ?
         <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin ' />
          : "Generate My Trip" }
      </button>

      <Dialog open={openDialog}>

        <DialogContent className={"sm:max-w-lg sm:rounded-2xl bg-white p-6"}>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-blue-700 mb-4">Login Required</DialogTitle>
            <DialogDescription className=" text-center">
              <h2 className="text-lg font-semibold mb-4">Login Required</h2>
              <p className="text-gray-600 mb-4">
                Please login to generate your trip. You can login using your google account
              </p>
              <button onClick={login}
                className="flex gap-2.5 items-center justify-between" > <FaGoogle className='h-7 w-7' /> Login With Google</button>
            </DialogDescription>

          </DialogHeader>
        </DialogContent>

      </Dialog>
    </form>
  );
}