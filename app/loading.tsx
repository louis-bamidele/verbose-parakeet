"use client";
import React, { useState, useEffect } from "react";

function Loading() {
  const [message, setMessage] = useState("Bots are checking the weather...");

  const text: string[] = [
    "Loading, please wait...",
    "Just a moment, we're almost there...",
    "Hang tight, good things are coming...",
    "Patience is a virtue, we're on it...",
    "Fetching awesome content for you...",
    "This won't take long, promise...",
    "Thanks for waiting, almost done...",
  ];

  const handleTextChange = () => {
    let number: number = Math.floor(Math.random() * 6);
    setMessage(text[number]);
  };
  useEffect(() => {
    setInterval(handleTextChange, 3000);
  }, []);

  return (
    <div className='absolute top-[0] left-[0] z-index-[99] w-[100%] h-[100%] grid place-items-center'>
      <div className='flex flex-col gap-6 justify-center items-center'>
        <h4>This weather app need access to your location.</h4>
        <h4>{message}</h4>

        <div className='spinner flex gap-3'>
          <div></div>
        </div>
        <div className='text '></div>
      </div>
    </div>
  );
}

export default Loading;
