import React from 'react'
import {useFetchJson} from "../hooks/usefetchJson"
import "../css/abstSubm.css"

export default function AbstractSubmissionJuryEva() {
  const {data,loading,error}=useFetchJson("/content/absSubm.json")
    if (loading) return <p>Loading registration info...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;
    if (!data) return <p>No data found.</p>;
    console.log(data)

  // Oral presentations bölümünü bul
  const oralPresentationsSection = data.sections.find(
    section => section.type === "presentations" && section.header === "Oral Presentations"
  );
  const posterPresentationSection=data.sections.find(
    section=>section.type==="presentations" &&
    section.header==="Poster Presentations"
  )
  console.log(posterPresentationSection)

  return (
    <div>
  <div className="page-title" style={{width:"auto",height:"auto",justifyContent:"center",alignItems:"center",marginLeft:"100px",marginRight:"100px"}}>
    <h1 style={{ 
                fontWeight: "700", 
                fontSize: "32px",
                color: "white",
                marginBottom: "24px"}}>
      {data.pageTitle}
    </h1>
  </div>
  
  <div className="content-abstract">
    <div className="sessions">
      {data.sections.map((section, i) => (
        <div key={i}>
          {section.type === "info" && (
            <div>
              {Array.isArray(section.content) ? (
                section.content.map((paragraph, j) => (
                  <p key={j} style={{
                    fontFamily: "'Open Sans', 'Helvetica Neue', Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#121212",
                    margin: "0 0 16px 0"
                  }}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p style={{
                  fontFamily: "'Open Sans', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#121212",
                  margin: "0 0 16px 0"
                }}>
                  {section.content}
                </p>
              )}
            </div>
          )}
        
          {section.type === "links" && section.links && (
            <div className="single-link-container" style={{marginTop: "20px"}}>
              <a
                href={section.links[0].url}
                className="abstract-submission-link"
                style={{
                  fontFamily: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: "600",
                  fontSize: "16px",
                  color: "#2c5aa0",
                  textDecoration: "none",
                  padding: "8px 16px",
                  border: "2px solid #2c5aa0",
                  borderRadius: "4px",
                  display: "inline-block"
                }}
              >
                {section.links[0].text}
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>

  <div className="session-text" style={{backgroundColor:"#03043a",padding:"10px 12px"}}>
    <p style={{color:"white",fontFamily:"bold",fontSize:"32px",fontWeight:"700",justifyContent:"center",alignItems:"center",textAlign:"center"}}>SESSIONS</p>
  </div>

  {/* Oral Presentations Section */}
  {oralPresentationsSection && (
    <div className="oral-presentations-section" style={{padding: "20px 100px"}}>
      <h2 className="section-header" style={{
        fontSize: "28px",
        fontWeight: "700",
        color: "#2c3e50",
        textAlign: "center",
        marginBottom: "40px",
        paddingBottom: "10px",
        borderBottom: "2px solid #bdc3c7"
      }}>
        {oralPresentationsSection.header}
      </h2>
      
      {/* Part I - May 23rd, Friday */}
      {oralPresentationsSection.sessions?.[0] && (
        <div className="presentation-part" style={{marginBottom: "50px"}}>
          <div className="part-header" style={{
            textAlign: "center",
            marginBottom: "25px",
            padding: "15px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "8px",
            color: "white"
          }}>
            <h3 className="part-title" style={{
              fontSize: "1.4rem",
              fontWeight: "600",
              margin: "0 0 5px 0",
              color: "white"
            }}>
              {oralPresentationsSection.sessions[0].title.split('—')[0]?.trim()}
            </h3>
            <div className="part-date" style={{
              fontSize: "1.1rem",
              opacity: "0.9",
              fontWeight: "500"
            }}>
              {oralPresentationsSection.sessions[0].title.split('—')[1]?.trim()}
            </div>
          </div>
          
          <div className="presentation-list">
            {oralPresentationsSection.sessions[0].presentations?.map((presentation, index) => (
              <div key={index} className="presentation-item" style={{
                display: "flex",
                gap: "15px",
                alignItems: "flex-start",
                padding: "20px",
                border: "1px solid #e1e8ed",
                borderRadius: "12px",
                background: "#fafbfc",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                marginBottom: "15px"
              }}>
                <div className="presentation-bullet" style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#e74c3c",
                  marginTop: "2px",
                  minWidth: "30px",
                  textAlign: "center"
                }}>
                  [ ]
                </div>
                <div className="presentation-content" style={{flex: "1"}}>
                  <div className="author" style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#2c3e50",
                    marginBottom: "8px",
                    lineHeight: "1.3"
                  }}>
                    {presentation.author}
                  </div>
                  <div className="title" style={{
                    fontSize: "0.95rem",
                    color: "#5d6d7e",
                    lineHeight: "1.5",
                    marginBottom: "10px"
                  }}>
                    {presentation.title}
                  </div>
                  {presentation.pdfUrl && (
                    <div className="pdf-link" style={{marginTop: "8px"}}>
                      <a 
                        href={presentation.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "#3498db",
                          textDecoration: "none",
                          fontWeight: "500",
                          fontSize: "0.9rem"
                        }}
                      >
                        📄 View PDF
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Part II - May 24th, Saturday */}
      {oralPresentationsSection.sessions?.[1] && (
        <div className="presentation-part" style={{marginBottom: "50px"}}>
          <div className="part-header" style={{
            textAlign: "center",
            marginBottom: "25px",
            padding: "15px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "8px",
            color: "white"
          }}>
            <h3 className="part-title" style={{
              fontSize: "1.4rem",
              fontWeight: "600",
              margin: "0 0 5px 0",
              color: "white"
            }}>
              {oralPresentationsSection.sessions[1].title.split('—')[0]?.trim()}
            </h3>
            <div className="part-date" style={{
              fontSize: "1.1rem",
              opacity: "0.9",
              fontWeight: "500"
            }}>
              {oralPresentationsSection.sessions[1].title.split('—')[1]?.trim()}
            </div>
          </div>
          
          <div className="presentation-list">
            {oralPresentationsSection.sessions[1].presentations?.map((presentation, index) => (
              <div key={index} className="presentation-item" style={{
                display: "flex",
                gap: "15px",
                alignItems: "flex-start",
                padding: "20px",
                border: "1px solid #e1e8ed",
                borderRadius: "12px",
                background: "#fafbfc",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                marginBottom: "15px"
              }}>
                <div className="presentation-bullet" style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#e74c3c",
                  marginTop: "2px",
                  minWidth: "30px",
                  textAlign: "center"
                }}>
                  [ ]
                </div>
                <div className="presentation-content" style={{flex: "1"}}>
                  <div className="author" style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#2c3e50",
                    marginBottom: "8px",
                    lineHeight: "1.3"
                  }}>
                    {presentation.author}
                  </div>
                  <div className="title" style={{
                    fontSize: "0.95rem",
                    color: "#5d6d7e",
                    lineHeight: "1.5",
                    marginBottom: "10px"
                  }}>
                    {presentation.title}
                  </div>
                  {presentation.pdfUrl && (
                    <div className="pdf-link" style={{marginTop: "8px"}}>
                      <a 
                        href={presentation.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "#3498db",
                          textDecoration: "none",
                          fontWeight: "500",
                          fontSize: "0.9rem"
                        }}
                      >
                        📄 View PDF
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )}

  {/* Poster Presentations Section */}
  {posterPresentationSection && (
    <div className="poster-presentation-section" style={{padding: "20px 100px"}}>
      <h2 className="section-header" style={{
        fontSize: "28px",
        fontWeight: "700",
        color: "#2c3e50",
        textAlign: "center",
        marginBottom: "40px",
        paddingBottom: "10px",
        borderBottom: "2px solid #bdc3c7"
      }}>
        {posterPresentationSection.header}
      </h2>
      
      {/* Poster Presentation - May 24th, Saturday */}
      {posterPresentationSection.sessions?.[0] && (
        <div className="presentation-part" style={{marginBottom: "50px"}}>
          <div className="part-header" style={{
            textAlign: "center",
            marginBottom: "25px",
            padding: "15px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "8px",
            color: "white"
          }}>
            <h3 className="part-title" style={{
              fontSize: "1.4rem",
              fontWeight: "600",
              margin: "0 0 5px 0",
              color: "white"
            }}>
              {posterPresentationSection.sessions[0].title.split('—')[0]?.trim() || "Poster Presentations"}
            </h3>
            <div className="part-date" style={{
              fontSize: "1.1rem",
              opacity: "0.9",
              fontWeight: "500"
            }}>
              {posterPresentationSection.sessions[0].title.split('—')[1]?.trim()}
            </div>
          </div>
          
          <div className="presentation-list">
            {posterPresentationSection.sessions[0].presentations?.map((presentation, index) => (
              <div key={index} className="presentation-item" style={{
                display: "flex",
                gap: "15px",
                alignItems: "flex-start",
                padding: "20px",
                border: "1px solid #e1e8ed",
                borderRadius: "12px",
                background: "#fafbfc",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                marginBottom: "15px"
              }}>
                <div className="presentation-bullet" style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#e74c3c",
                  marginTop: "2px",
                  minWidth: "30px",
                  textAlign: "center"
                }}>
                  [ ]
                </div>
                <div className="presentation-content" style={{flex: "1"}}>
                  <div className="author" style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#2c3e50",
                    marginBottom: "8px",
                    lineHeight: "1.3"
                  }}>
                    {presentation.author}
                  </div>
                  <div className="title" style={{
                    fontSize: "0.95rem",
                    color: "#5d6d7e",
                    lineHeight: "1.5",
                    marginBottom: "10px"
                  }}>
                    {presentation.title}
                  </div>
                  {presentation.pdfUrl && (
                    <div className="pdf-link" style={{marginTop: "8px"}}>
                      <a 
                        href={presentation.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "#3498db",
                          textDecoration: "none",
                          fontWeight: "500",
                          fontSize: "0.9rem"
                        }}
                      >
                        📄 View PDF
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )}
</div>
  )
}
