/* eslint-disable @next/next/no-img-element */
"use client";
import React, { Suspense, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/logo.png";
import Loading from "./loading";
import {
  BsWind,
  BsClouds,
  BsFillCloudDrizzleFill,
  BsFillCloudSnowFill,
  BsCloudSunFill,
  BsFillSunFill,
} from "react-icons/bs";

import { FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";

import { TbTemperatureCelsius, TbTemperatureFahrenheit } from "react-icons/tb";
import { FaTemperatureHalf } from "react-icons/fa6";
import "./globals.css";
import axios from "axios";
const Spline = React.lazy(() => import("@splinetool/react-spline"));

export default function Home() {
  const [alerts, setAlerts] = useState<any>(null);
  const [current, setCurrent] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [boolean, setBoolean] = useState<any>(true);
  const [loading, setLoading] = useState<any>(true);
  const [location, setLocation] = useState<any>(null);
  const [autoComplete, setAutoComplete] = useState<any>(null);
  const [latlng, setLatlng] = useState<any>(null);
  const [weatherConditionText, setWeatherConditionText] = useState<string>(" ");
  const [search, setSearch] = useState("");
  const [LoadSpline, setLoadSpline] = useState(true);
  const [hourCondition, setHourCondition] = useState(false);

  const currentHour = useRef<null | HTMLDivElement>(null);
  const leftArrow = useRef<any>(null);
  const rightArrow = useRef<any>(null);
  const collectionElement = useRef<any>(null);
  const searchBar = useRef<any>(null);
  const NavBar = useRef<any>(null);
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  // Function to fetch data from a URL
  async function fetchData(url: string) {
    try {
      const response = await axios.get(url); // Send a GET request to the specified URL
      // Check if the request was successful (status code 200)
      if (response.status === 200) {
        // If successful, return the data from the response
        return response.data;
      } else {
        // Handle other status codes or errors if needed
        throw new Error(`Request failed with status: ${response.status}`);
      }
    } catch (error: any) {
      // Handle any errors that occurred during the request
      console.error("Error fetching data:", error.message);
      throw error; // Re-throw the error for the caller to handle, if needed
    }
  }
  const weatherCondition = [
    {
      text: "sunshine",
      link: "https://prod.spline.design/LOf-xnid9dF8WStU/scene.splinecode",
    },
    {
      text: "clear sky, clear",
      link: "https://prod.spline.design/LOf-xnid9dF8WStU/scene.splinecode",
    },
    {
      text: "partly cloudy",
      link: "https://prod.spline.design/DQB44gAQ6hmeyuFc/scene.splinecode",
    },
    {
      text: "overcast",
      link: "https://prod.spline.design/BAMORtyaxDyTezsS/scene.splinecode",
    },
    {
      text: "fog mist",
      link: "https://prod.spline.design/BAMORtyaxDyTezsS/scene.splinecode",
    },
    {
      text: "light rain, moderate rain",
      link: "https://prod.spline.design/1JkRBvytHaTN-yj4/scene.splinecode",
    },
    {
      text: "heavy rain",
      link: "https://prod.spline.design/ruYpN2KGvtFOT0Hn/scene.splinecode",
    },
    {
      text: " thunderstorm",
      link: "https://prod.spline.design/BhN2bFhStVf2Fdr7/scene.splinecode",
    },
    {
      text: "light snow, hail",
      link: "https://prod.spline.design/Jp40HHTchOQkTKgM/scene.splinecode ",
    },
    {
      text: "windy",
      link: "https://prod.spline.design/2tWRXnX4bOSCeSND/scene.splinecode",
    },
    {
      text: "blizzard, dust storm, tsunami, smoke, freezing rain, heatwaze, cold snap, tornado, hurricane or typhoon, aurora",
      link: "https://prod.spline.design/1JkRBvytHaTN-yj4/scene.splinecode",
    },
  ];
  // let myRef: any = null;

  useEffect(() => {
    // Find the current hour element and scroll into view
    if (currentHour.current) {
      currentHour.current.classList.add("current-hour");
      currentHour.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      window.scrollTo(0, 0);
    }
  }, [forecast, hourCondition]);
  useEffect(() => {
    // accesibility for sraech bar
    if (searchBar.current) {
      document.addEventListener("keydown", function (event) {
        // Check if the key combination is Control + K
        if (event.ctrlKey && event.key === "k") {
          // Prevent the default behavior (e.g., opening bookmarks in some browsers)
          event.preventDefault();

          // Set focus on the search input
          searchBar.current.focus();
        }
      });
    }

    // get the user location
    function getUserLocation() {
      return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              const locationString = `${latitude},${longitude}`;
              resolve(locationString);
            },
            (error) => {
              reject(`Error getting geolocation: ${error.message}`);
            }
          );
        } else {
          reject("Geolocation is not supported by your browser.");
        }
      });
    }
    // Example usage of the fetchData function
    async function requestData() {
      try {
        let getLo = await getUserLocation();
        const latlon = latlng || getLo;
        // const latlon = "london";
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}q=${latlon}&days=3&aqi=no&alerts=yes`; // Example URL
        const data = await fetchData(url); // Call the fetchData function
        console.log("Fetched data:", data);
        setAlerts(data.alerts);
        setCurrent(data.current);
        setForecast(data.forecast);
        setLocation(data.location);

        const condition = data.current.condition.text;
        // const condition = "Light rain";
        let weatherSpline = weatherCondition.filter((item) => {
          if (item.text.toLowerCase().includes(condition.toLowerCase())) {
            return item;
          }
        });
        if (weatherSpline.length === 0) {
          weatherSpline.push(weatherCondition[0]);
        }
        setWeatherConditionText(weatherSpline[0]?.link);
        console.log(condition, weatherSpline);

        setLoading(false);
      } catch (error: any) {
        setLoading(true);
        console.error("An error occurred:", error.message);
      }
    }
    requestData();
  }, [latlng]);
  const getDayOfTheWeek = (timestamp: number) => {
    let date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds

    // Days of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const dayOfWeek = daysOfWeek[date.getDay()];
    return dayOfWeek;
  };
  const gethours = (timestamp: number) => {
    // Create a Date object and pass the timestamp in milliseconds
    const date = new Date(timestamp * 1000);

    // Get the hours and minutes components
    const hours = date.getHours().toString().padStart(2, "0"); // Format to two digits
    const minutes = date.getMinutes().toString().padStart(2, "0");
    // Create a formatted time string
    const formattedTime = `${hours} : ${minutes}`;
    return formattedTime;
  };
  const fetchSearchCities = (value: string) => {
    fetch(`http://api.weatherapi.com/v1/search.json?key=${API_KEY}q=${value}`)
      .then((response) => response.json())
      .then((json) => {
        const results = json;
        if (results.length >= 1) {
          setAutoComplete(results);
        } else {
          setAutoComplete(null);
        }
        console.log(results);
      });
  };
  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.length > 2) {
      fetchSearchCities(value);
    } else {
      setAutoComplete(null);
    }
  };
  const handleClick = (input: any) => {
    let value = input.name;
    setSearch(value);
    let lat = input.lat;
    let lon = input.lon;
    setLatlng(lat + "," + lon);
    setAutoComplete(null);
  };
  function leftClick() {
    let box = collectionElement.current;
    let x: any = "";
    if (box) {
      x = Math.floor(box.offsetWidth / 2 - box.scrollLeft);
      box.scrollTo({
        left: -x,
        behavior: "smooth",
      });
    }

    rightArrow.current?.classList.remove("hidden");
    if (-x <= 0) {
      leftArrow.current?.classList.add("hidden");
    }
  }
  function rightClick() {
    let box = collectionElement.current;
    let totalWidthn = box.children.length * box.children[0].offsetWidth;
    let x: any = "";
    if (box) {
      x = Math.floor(box.offsetWidth / 2 + box.scrollLeft);

      box.scrollTo({
        left: x,
        behavior: "smooth",
      });
    }

    leftArrow.current?.classList.remove("hidden");

    if (totalWidthn <= x || totalWidthn <= x + 200) {
      rightArrow.current?.classList.add("hidden");
    }
  }
  const cloudLoading = () => {
    // alert("loaded");
    setLoadSpline(!LoadSpline);
    console.log("loaded");
  };

  if (loading) {
    return <Loading />;
  }
  // console.log(currentHour);

  return (
    <main className='flex flex-col items-center pb-10 w-full overflow-hidden'>
      <div
        ref={NavBar}
        className='px-5 py-[13px] m-3 rounded flex justify-between text-slate-50 w-[90%] glassMorphism relative z-40'>
        <Link
          className='flex gap-3 items-center'
          target='_blank'
          href='https://louis-bamidele.vercel.app/'>
          <Image src={logo} width={30} height={30} alt='logo' />{" "}
        </Link>
        <div className='relative'>
          <input
            ref={searchBar}
            type='search'
            autoComplete='off'
            value={search}
            className='p-[5px] glassMorphism2 focus:outline-none h-[35px] rounded-lg bg-teal-200 placeholder:text-white text-white'
            name='sraech'
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='Type a city or country'
          />
          {autoComplete && (
            <div className='absolute glassMorphism2 p-2 mt-2 rounded z-100 w-full '>
              {autoComplete.map((data: any, index: number) => {
                return (
                  <div
                    key={index}
                    onClick={() => handleClick(data)}
                    className='group hover:bg-[#9EDDFF] px-2 mb-2 cursor-pointer rounded'>
                    <p className='text-lg capitalize '>{data.name}</p>
                    <p className='text-sm group-hover:text-stone-500 text-stone-300 capitalize '>
                      {data.region}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className='flex mt-5 flex-row flex-wrap  justify-around w-full relative z-20'>
        <div className=' flex flex-col  relative '>
          <div className='w-fit centered-absolute-div h-[400px]'>
            <Spline scene='https://prod.spline.design/BhN2bFhStVf2Fdr7/scene.splinecode' />
          </div>
          <div className='p-5 pt-[400px] w-full md:w-[510px]'>
            <div className='flex gap-5 items-center h-fit'>
              <h1 className='text-8xl  font-bold flex flex-col relative'>
                {boolean ? current?.feelslike_f : current?.feelslike_c}
                <span className=' absolute top-[5px] right-[-25%]'>
                  <span
                    onClick={() => setBoolean(!boolean)}
                    className={`pointer cursor-pointer FC text-lg text-[#6499E9] ${
                      !boolean ? "flex-row-reverse" : null
                    } flex items-center gap-1 text-sm`}>
                    <span
                      // onClick={() => setBoolean(true)}
                      className={` text-lg ${
                        !boolean ? "text-slate-300" : null
                      }`}>
                      {" "}
                      &#176;F
                    </span>
                    <span className='text-slate-300 text-lg'>|</span>
                    <span
                      // onClick={() => setBoolean(false)}
                      className={`text-lg ${
                        boolean ? "text-slate-300" : null
                      }`}>
                      &#176;C
                    </span>
                  </span>
                </span>
              </h1>
              <img
                src={current?.condition.icon}
                alt={`${current?.condition.text}`}
                className='w-[60px] h-[60px] ml-5'
              />
            </div>

            <h3 className='text-2xl'>{location?.name}</h3>
            <div className='flex gap-1 flex-col'>
              <p>Condition: {current?.condition.text}</p>
              <p>Last Updated: {current?.last_updated} </p>
            </div>
            <h3 className='text-2xl'>
              {location?.region}, {location?.country}
            </h3>
            <div className='flex gap-2 w-fit justify-between'>
              <p>{getDayOfTheWeek(location?.localtime_epoch)}</p>{" "}
              <p>H:{current?.humidity}&#176;</p>
              <div className='flex items-center gap-1'>
                <p>Temp:{!boolean ? current?.temp_c : current?.temp_f}</p>

                {!boolean ? (
                  <TbTemperatureCelsius />
                ) : (
                  <TbTemperatureFahrenheit />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='w-[100%] md:w-fit h-fit relative  flex flex-row flex-wrap lg:flex-col  justify-between items-center gap-3'>
          <div className='glassMorphism rounded-lg text-slate-50 p-5 my-5 mx-auto mt-[0px] w-fit '>
            <div className='capitalize text-3xl flex items-center gap-2 mb-5'>
              <BsClouds />
              <h3 className='text-xl text-black'>air quality</h3>
            </div>
            <div className='grid grid-cols-2 gap-5  justify-center self-center mx-auto w-fit'>
              <div className='text-2xl flex gap-2 items-center '>
                <BsCloudSunFill />
                <div className='text-sm text-black flex flex-col  capitalize'>
                  <p className='text-gray-500'>real feel</p>
                  <div className='flex items-center gap-1'>
                    <p className='whitespace-nowrap'>
                      {!boolean ? current?.feelslike_c : current?.feelslike_f}
                    </p>
                    {!boolean ? (
                      <TbTemperatureCelsius />
                    ) : (
                      <TbTemperatureFahrenheit />
                    )}
                  </div>
                </div>
              </div>
              <div className='text-2xl flex gap-2 items-center'>
                <BsClouds />
                <div className='text-sm text-black flex flex-col gap-1 capitalize'>
                  <p className='text-gray-500'>cloud</p>
                  <p>{current?.cloud}</p>
                </div>
              </div>
              <div className='text-2xl flex gap-2 items-center'>
                <BsFillCloudDrizzleFill />
                <div className='text-sm text-black flex flex-col gap-1 capitalize'>
                  <p className='text-gray-500'>change of rain</p>
                  <p>{forecast?.forecastday[0].day.daily_chance_of_rain}%</p>
                </div>
              </div>
              <div className='text-2xl flex gap-2 items-center'>
                <BsFillCloudSnowFill />
                <div className='text-sm text-black flex flex-col gap-1 capitalize'>
                  <p className='text-gray-500'>change of snow</p>
                  <p>{forecast?.forecastday[0].day.daily_chance_of_snow}%</p>
                </div>
              </div>
              <div className='text-2xl flex gap-2 items-center'>
                <BsFillSunFill />
                <div className='text-sm text-black flex flex-col gap-1 capitalize'>
                  <p className='text-gray-500'>uv index</p>
                  <p>{current?.uv}</p>
                </div>
              </div>
              <div className='text-2xl flex gap-2 items-center'>
                <BsWind />
                <div className='text-sm text-black flex flex-col gap-1 capitalize'>
                  <p className='text-gray-500'>wind</p>
                  <p>
                    {!boolean
                      ? current?.wind_kph + "kph"
                      : current?.wind_mph + "mph"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='glassMorphism rounded-lg text-black text-sm p-5 my-5 mx-auto w-fit'>
            <h3 className=''>3-Day Forecast</h3>
            <hr className='bg-black text-black border-black my-3' />
            <div className='w-[100%] '>
              {forecast?.forecastday.map((day: any, item: number) => {
                return (
                  <div key={item} className='forecast-grid w-full '>
                    <div className=' h[30px] flex justify-between items-center w-fit'>
                      <h6 className='text-[0.9rem ]'>
                        {getDayOfTheWeek(day.date_epoch)}
                      </h6>
                      <img
                        src={day.day.condition.icon}
                        alt={`${day.day.condition.text}`}
                        className=' h-[30px]'
                      />
                    </div>

                    <div className='  h[30px] flex items-center gap-1 '>
                      <BsWind />
                      <p className=' whitespace-nowrap'>
                        {!boolean
                          ? `${day.day.maxwind_kph}: kph`
                          : `${day.day.maxwind_mph}: mph`}
                      </p>
                    </div>

                    <div className=' h[30px] flex items-center  gap-1'>
                      <BsFillSunFill />

                      <p className=''>{`${day.day.daily_chance_of_rain}% `}</p>
                    </div>
                    <div className='   h[30px] flex items-center gap-1'>
                      <FaTemperatureHalf />
                      <p className=''>
                        {!boolean
                          ? `${day.day.avgtemp_c} `
                          : `${day.day.avgtemp_f}`}
                      </p>
                      {!boolean ? (
                        <TbTemperatureCelsius />
                      ) : (
                        <TbTemperatureFahrenheit />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className='w-[100%] mt-5 flex gap-2 justify-around items-center mx-auto'>
        <FaAngleDoubleLeft
          onClick={leftClick}
          ref={leftArrow}
          className='arrow'
        />
        <div
          ref={collectionElement}
          className=' text-slate-50  p-5 flex overflow-hidden scrollbar-hide  overflow-x-scroll w-[85%]'>
          {forecast?.forecastday[0].hour.map((time: any, index: number) => {
            const condition =
              gethours(time.time_epoch).slice(0, 2) ===
              gethours(current.last_updated_epoch).slice(0, 2);

            return (
              <div
                key={index}
                ref={condition ? currentHour : null}
                // { getho urs(time.time_epoch) === gethours(current.last_updated_epoch) ? { ref={ currentHour } } : null}
                className='flex glassMorphism whitespace-nowrap rounded-lg mx-5 py-3 px-5 flex-col   justify-center items-center'>
                <h3>{gethours(time.time_epoch)}</h3>
                <img
                  src={time.condition.icon}
                  alt={time.condition.text}
                  className='w-[60px] h-[60px]'
                />
                <p>
                  {boolean ? time?.feelslike_f : time?.feelslike_c}
                  {boolean ? <span>&#176;F</span> : <span>&#176;C</span>}
                </p>
              </div>
            );
          })}
        </div>
        <FaAngleDoubleRight
          onClick={rightClick}
          ref={rightArrow}
          className='arrow'
        />
      </div>
    </main>
  );
}
