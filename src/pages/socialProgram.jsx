import React from 'react';
import { useFetchJson } from "../hooks/useFetchJson.JSX";
import "../css/socialProgram.css";
import useLocalContent from "../hooks/useLocalContent"
export default function SocialProgram() {
  const { data, loading, error } = useLocalContent("socialProgram")
  
  if (loading) return (
    <div className="social-program-page">
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading social program information...</p>
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
        <p>Social program content could not be loaded.</p>
      </div>
    </div>
  );

  return (
    <div className="social-program-page">
      <div className="page-header">
        <h1 className="page-title">{data.pageTitle}</h1>
      </div>

      <div className="social-program-content">
        {/* Introduction Section */}
        <section className="intro-section">
          <div className="intro-content">
            {data.intro && data.intro.content ? (
              <p>{data.intro.content}</p>
            ) : (
              <p>No introduction content available.</p>
            )}
          </div>
        </section>

        {/* Social Programs Events */}
        {data.events && data.events.length > 0 && (
          <section className="events-section">
            <div className="events-grid">
              {data.events.map((event, index) => (
                <div className="event-card" key={index}>
                  <div className="event-image">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      onError={(e) => {
                        e.target.src = '/images/placeholder-event.jpg';
                      }}
                    />
                  </div>
                  <div className="event-details">
                    <div className="event-header">
                      <h3 className="event-title">{event.title}</h3>
                    </div>
                    <div className="event-info">
                      <div className="info-item">
                        <span className="info-label">📅 Date:</span>
                        <span className="info-value">{event.date}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">⏰ Time:</span>
                        <span className="info-value">{event.time}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">📍 Location:</span>
                        <span className="info-value">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}