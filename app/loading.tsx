import React from "react";
// import loadingCSS from "./loadingcss";
function loading() {
  return (
    <div className='absolute top-[0] left-[0] z-index-[99] w-[100%] h-[100%] grid place-items-center'>
      <div className='spinner'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default loading;
