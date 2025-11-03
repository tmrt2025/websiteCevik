import React from 'react'
import { useFetchJson } from "../hooks/usefetchJson"
import "../css/sponsors.css"

export default function PartnersAndSponsors() {
  const {data,loading,error}=useFetchJson("/content/sponsors.json")
  console.log(data)
  
  if (loading) return (
    <div className="social-program-page">
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading sponsors information...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="social-program-page">
      <div className="error-state">
        <h2>Error Loading Content</h2>
        <p>{error.message}</p>
      </div>
    </div>
  );
  
  if (!data) return (
    <div className="social-program-page">
      <div className="error-state">
        <h2>No Data Found</h2>
        <p>Sponsors content could not be loaded.</p>
      </div>
    </div>
  );
  
  return (
    <div className='sponsors'>
      <div className="sponsors-header">
        <h1 className='page-title'>{data.pageTitle}</h1>
      </div>
      <div className="sponsor-image">
        <img src={data.image} alt="sponsors" />
      </div>
    </div>
  )
}