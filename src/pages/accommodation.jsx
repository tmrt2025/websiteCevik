import React from 'react'
import {useFetchJson} from "../hooks/usefetchJson"
import "../css/accomodation.css"

export default function accommodation() {
  const {data,loading,error}=useFetchJson("/content/accomodation.json")
  if(loading) return(
    <div className="accomoadion-page">
      <div className="loading-state">
        <div className="loading-spinner">
          <p>loading accomodation information...</p>
        </div>
      </div>
    </div>
  )
  if(error) return(
    <div className="accomodation-page">
      <div className="error-state">
        <h2>Error Loading Content</h2>
        <p>{error.message}</p>
      </div>
    </div>
  )
  if(!data) return(
    <div className="accomodation-page">
      <div className="error-state">
        <h2>No Data Found</h2>
        <p>Accomodation content could not be loaded</p>
      </div>
    </div>
  )
  return (
    <div>
      <div className="accomodation-page">
        <div className="page-header">
          <h1 className='page-title'> {data.pageTitle}</h1>
        </div>
        <div className="accomodation-content">
          {/*introduction section*/}
          {data.intro &&(
            <section className='intro-section'>
              <div className="intro-content" dangerouslySetInnerHTML={{ __html: data.intro.content.replace(/\n/g, '<br/>') }}>

              </div>
            </section>
          )}
          {/**accomodation options */}
          {data.accommodationOptions && data.accommodationOptions.length>0 &&(
            <section className='options-section'>
              <h2 className='section-title'> Accomodation Options</h2>
              <div className="option-grid">
                {data.accommodationOptions.map((option,index)=>(
                  <div className="option-card" key={index}>
                    <div className="option-image">
                      <img src={option.image} alt={option.name}
                      onError={(e)=>{
                        e.target.src='/images/placeholder-hotel.jpg'
                      }} />
                    </div>
                    <div className="option-content">
                      <h3 className='option-name'> {option.name}</h3>
                      <p className='option-description'>{option.description}</p>
                      {option.features &&option.features.length<0 &&(
                        <ul className='option-features'>
                          {option.features.map((feature,featureIndex)=>(
                            <li key={featureIndex}> {feature}</li>
                          ))}
                        </ul>
                      )}
                      {option.price &&(
                        <div className="option-price">
                          <strong>
                            Price:
                          </strong> {option.price}
                        </div>
                      )}
                      {option.bookingLink &&(
                        <a href={option.bookingLink} className='booking-button' target='_blank'
                        rel='noopener noreferrer'>
                          Book Now
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
