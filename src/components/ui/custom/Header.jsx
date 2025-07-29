import React, { useEffect } from 'react'
import { Button } from '../button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout } from '@react-oauth/google';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa';
import { useState } from 'react';
import { CgProfile } from "react-icons/cg";
import axios from 'axios';

function Header() {

  const [openDialog, setOpenDialog] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
      // console.log("Login Success:", codeResp)
      GetUserProfile(codeResp);
    },
    onError: (error) => console.error("Login Failed:", error)
  });

  const GetUserProfile = (tokenInfo) => {
    // console.log("Token Info:", tokenInfo);
    // console.log("Access Token:", tokenInfo?.access_token);
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {

      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json'
      }
    }).then((response) => {
      // console.log("User Profileresponse :", response);
      localStorage.setItem('user', JSON.stringify(response.data));
      setOpenDialog(false);
      window.location.reload();
    })
  }

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // console.log("User data:", user);
    //console.log("profile picture",user?.picture)
  }, [user]);

  return (
    <div className='p-3 shadow-sm flex justify-between items-center'>
      <img onClick={() => {
        window.location.href = '/';
      }} src="https://bestfreeaiwebsites.com/wp-content/uploads/2024/06/Screenshot-2024-06-07-at-1.04.16%E2%80%AFPM.png" className='cursor-pointer h-[10vh] w-[12vw]' />


      <div className='flex items-center gap-4 '>
        {
          user ?
            <div className='flex items-center gap-2 w-auto'>

              <button onClick={() => {
                window.location.href = '/CreateTrip';
              }} variant="outline" className='rounded-full'>+ Create Trip</button>

              <button onClick={() => {
                window.location.href = '/my-trip';
              }} variant="outline" className='rounded-full'>My Trip</button>


              <Popover>
                <PopoverTrigger >
                  {user.picture ?
                    <img src={user.picture} className='h-[25px] w-[25px] rounded-full' />
                    : <CgProfile className='h-[25px] w-[25px] rounded-full' />
                  }
                </PopoverTrigger>
                <PopoverContent>
                  <h2 className='cursor-pointer' onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}>Logout</h2>
                </PopoverContent>
              </Popover>
            </div>
            : <Button onClick={() => { setOpenDialog(true) }}>Sign In</Button>
        }

      </div>
      <Dialog open={openDialog}>

        <DialogContent className={"sm:max-w-lg sm:rounded-2xl bg-white p-6"}>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-blue-700 mb-4">Login Required</DialogTitle>
            <DialogDescription className=" text-center">
              <h2 className="text-lg font-semibold mb-4">Login Required</h2>
              <p className="text-gray-600 mb-4">
                Please login to generate your trip. You can login using your google account
              </p>

              <div className='flex items-center gap-4 justify-between'>
                <Button
                  className="w-auto bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                  onClick={() => {
                    login();
                  }}
                >
                  <FaGoogle className="mr-2" />
                  Login with Google
                </Button>

                <DialogClose  className=" w-auto h-[40px] ">
                  <Button  onClick={() => setOpenDialog(false)} className={"w-full h-full"  }>
                    Close
                  </Button>
                </DialogClose>
              </div>


            </DialogDescription>




          </DialogHeader>


        </DialogContent>

      </Dialog>
    </div>

  )
}

export default Header