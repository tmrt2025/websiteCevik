import React from 'react'
import "../css/homepage.css"
export default function homepage() {
  return (
    <>
      <img src="src/assets/images/2025banner.png" className="d-block w-100"alt="..." />
      <div className="counter-wrap">
        <div className="counter">
          <div className="day" >
            <span>000</span>
            <span style={{marginLeft:"6px"}}>Day</span>
          </div>
          <div className="hour" >
            <span>00</span>
            <span style={{marginLeft:"6px"}}>Hour</span>
          </div>
          <div className="minute" >
            <span>00</span>
            <span style={{marginLeft:"6px"}}>Minute</span>
          </div>
          <div className="second">
            <span >00</span>
            <span style={{marginLeft:"6px"}}>Second</span>
          </div>
        </div>
      </div>
      
      
    </>
  )
}
