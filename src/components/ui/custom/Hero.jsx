import React from 'react'
import { Button } from '../button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col items-center p-16'>
        <h1
        className='font-extrabold text-4xl md:text-5xl lg:text-6xl text-center max-w-3xl leading-tight'
        ><span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span> Personalized Itineraries at Your Fingertips</h1>
        <p className='text-xl my-3'>Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.</p>
        <Link to="/CreateTrip">
         <Button>Get Started , It's Free</Button>
        </Link>
        
    </div>
  )
}

export default Hero