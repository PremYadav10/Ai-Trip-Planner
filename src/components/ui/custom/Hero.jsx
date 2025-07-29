import React from 'react'
import { Button } from '../button'
import { Link } from 'react-router-dom'
import landingImg from '../../../assets/image.png'

function Hero() {
  return (
    <div className='flex flex-col items-center p-10 justify-center gap-10 bg-[#ffffff]'>
        <h1
        className='font-extrabold text-4xl md:text-5xl lg:text-6xl text-center max-w-3xl leading-tight '
        ><span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span> Personalized Itineraries at Your Fingertips</h1>
        <p className='text-xl my-3 px-10 lg:px-40 text-center'>Your personal trip planner and travel curator, creating custom itineraries (Plans/day) tailored to your interests and budget. 
        Whether you're looking for a relaxing getaway or an action-packed adventure, our AI-powered platform has got you covered.
        Start planning your dream trip today and let us handle the details
        </p>
        
        <Link to="/CreateTrip">
         <Button>Get Started , It's Free</Button>
        </Link>


        <div className='w-auto h-auto relative '>
          <Link to={"/createTrip"}>
          <img  src={landingImg} className='h-full w-full'/> 
          </Link>
        </div>
        
    </div>

  )
}

export default Hero