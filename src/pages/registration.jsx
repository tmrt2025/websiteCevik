import React from 'react'
import "../css/registration.css"
import { useFetchJson } from "../hooks/useFetchJson.JSX"

export default function Registration() {
  const { data, loading, error } = useFetchJson("/content/registrationContent.json")
  
  if (loading) return (
    <div className="registration-page">
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading registration information...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="registration-page">
      <div className="error-state">
        <h2>Error Loading Content</h2>
        <p>{error.message}</p>
      </div>
    </div>
  );
  
  if (!data) return (
    <div className="registration-page">
      <div className="error-state">
        <h2>No Data Found</h2>
        <p>Registration content could not be loaded.</p>
      </div>
    </div>
  );

  return (
    <div className="registration-page">
      <div className="page-title">
        <h1>{data.pageTitle}</h1>
      </div>

      <div className="content">
        {data.sections && data.sections.map((section, i) => (
          <div key={i} className={`section-${section.type}`}>
            {section.title && <h2>{section.title}</h2>}

            {section.type === "info" && (
              <p>{section.content}</p>
            )}

            {section.type === "links" && section.links && (
              <div className="links-container">
                {section.links.map((link, j) => (
                  <a 
                    href={link.url} 
                    className="link-item"
                    key={j}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span className="link-text">{link.text}</span>
                    <span className="link-button">
                      {link.clk || "Register Now"}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}