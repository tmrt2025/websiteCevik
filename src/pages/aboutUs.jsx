import React from 'react'
import { useEffect,useState } from 'react'
import "../css/aboutUs.css"
function AboutUs() {
  const [data,setData]=useState(null)
  useEffect(()=>{
    fetch("/content/aboutUsContent.json")
    .then(res=>res.json())
    .then(setData);
    
  },[])
  if (!data) return <p>Loading...</p>;
  return (
    <div>
      <div className="about-us">
        <h1>{data.pageTitle}</h1>
        <section>
          <h2>{data.scientificBoard.chairTitle}</h2>
          <h2>{data.scientificBoard.ChairName}</h2>
          <h2>{data.scientificBoard.chairInfo}</h2>
          <h2>SCIENTIFIC BOARD MEMBERS</h2>
          {data.scientificBoard.members.map((m,i)=>(
            <div key={i}>
              <h4>{m.name}</h4>
              <p>{m.info}</p>
            </div>
          ))}
        </section>
        <section>
          <h2>{data.purpose.title}</h2>
          <p>{data.purpose.content}</p>
        </section>
        <section>
          <h2>{data.scope.title}</h2>
          <p>{data.scope.content}</p>
        </section>
      </div>

    </div>
  )
}

export default AboutUs