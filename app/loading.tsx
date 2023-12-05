import React from "react";
// import loadingCSS from "./loadingcss";
function loading() {
  return (
    <div className='absolute top-[0] left-[0] z-index-[99] w-[100%] h-[100%] grid place-items-center'>
      <div className='flex flex-col gap-6 justify-center items-center'>
        <div className='spinner flex gap-3'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className='text '>
          <h4>This weather app need access to your location.</h4>
        </div>
      </div>
    </div>
  );
}

export default loading;
