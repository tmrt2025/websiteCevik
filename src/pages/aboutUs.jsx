import React from 'react';
import useLocalContent from "../hooks/useLocalContent"; // ✅ BU İMPORTU EKLE
import "../css/aboutUs.css";

function AboutUs() {
  const { data, loading, error } = useLocalContent("aboutUsContent");
  
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!data) return <div className="error">No data found</div>;

  return (
    <div className="about-us">
      <h1>{data.pageTitle}</h1>
      
      <section className="scientific-board-section">
        <div className="chairman-info">
          <h2>{data.scientificBoard?.chairTitle}</h2>
          <div className="chair-name">{data.scientificBoard?.chairName}</div>
          <div className="chair-info">{data.scientificBoard?.chairInfo}</div>
        </div>
        
        <h2>SCIENTIFIC BOARD MEMBERS</h2>
        <div className="members-grid">
          {data.scientificBoard?.members?.map((member, index) => (
            <div key={index} className="member-card">
              <h4>{member.name}</h4>
              <p>{member.info}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="purpose-section">
        <h2>{data.purpose?.title}</h2>
        <p>{data.purpose?.content}</p>
      </section>

      <section className="scope-section">
        <h2>{data.scope?.title}</h2>
        <p>{data.scope?.content}</p>
      </section>
    </div>
  );
}

export default AboutUs;