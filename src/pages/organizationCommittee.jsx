
import React from 'react'
import { useEffect,useState } from 'react'
import { useFetchJson } from '../hooks/usefetchJson';
import "../css/organizationCommittee.css";
function organizationCommittee() {
  const {data,loading,error}=useFetchJson("/content/organizationCommittee.json")

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
    <div className="organization-committee">
      <div className="container">
        <h1 className="page-title">{data.pageTitle}</h1>
        
        {/* Head of Scientific Board */}
        <section className="committee-section head-section">
          <h2 className="section-title">HEAD OF THE SCIENTIFIC BOARD</h2>
          <div className="member-card prominent">
            <h3 className="member-name">{data.headOfScientificBoard.name}</h3>
          </div>
        </section>

        {/* Board of Management */}
        <section className="committee-section">
          <h2 className="section-title">BOARD OF MANAGEMENT</h2>
          <div className="members-grid management-grid">
            {data.boardOfManagement.map((member, index) => (
              <div key={index} className="member-card management">
                <h4 className="member-role">{member.role}</h4>
                <p className="member-name">{member.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Scientific Committee */}
        <section className="committee-section">
          <h2 className="section-title">SCIENTIFIC COMMITTEE</h2>
          <div className="committee-with-coordinators">
            <div className="coordinators-section">
              <h3 className="sub-title">Coordinators</h3>
              <div className="members-grid">
                {data.scientificCommittee.coordinators.map((coordinator, index) => (
                  <div key={index} className="member-card coordinator">
                    <p className="member-name">{coordinator.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="members-section">
              <h3 className="sub-title">Members</h3>
              <div className="members-grid">
                {data.scientificCommittee.members.map((member, index) => (
                  <div key={index} className="member-card">
                    <p className="member-name">{member.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hosting Committee */}
        <section className="committee-section">
          <h2 className="section-title">HOSTING COMMITTEE</h2>
          <div className="committee-with-coordinators">
            <div className="coordinators-section">
              <h3 className="sub-title">Coordinators</h3>
              <div className="members-grid">
                {data.hostingCommittee.coordinators.map((coordinator, index) => (
                  <div key={index} className="member-card coordinator">
                    <p className="member-name">{coordinator.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="members-section">
              <h3 className="sub-title">Members</h3>
              <div className="members-grid large-grid">
                {data.hostingCommittee.members.map((member, index) => (
                  <div key={index} className="member-card">
                    <p className="member-name">{member.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Workshop Committee */}
        <section className="committee-section">
          <h2 className="section-title">WORKSHOP COMMITTEE</h2>
          <div className="committee-with-coordinators">
            <div className="coordinators-section">
              <h3 className="sub-title">Coordinators</h3>
              <div className="members-grid">
                {data.workshopCommittee.coordinators.map((coordinator, index) => (
                  <div key={index} className="member-card coordinator">
                    <p className="member-name">{coordinator.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="members-section">
              <h3 className="sub-title">Members</h3>
              <div className="members-grid">
                {data.workshopCommittee.members.map((member, index) => (
                  <div key={index} className="member-card">
                    <p className="member-name">{member.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social Program Committee */}
        <section className="committee-section">
          <h2 className="section-title">SOCIAL PROGRAM COMMITTEE</h2>
          <div className="committee-with-coordinators">
            <div className="coordinators-section">
              <h3 className="sub-title">Coordinators</h3>
              <div className="members-grid">
                {data.socialProgramCommittee.coordinators.map((coordinator, index) => (
                  <div key={index} className="member-card coordinator">
                    <p className="member-name">{coordinator.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="members-section">
              <h3 className="sub-title">Members</h3>
              <div className="members-grid">
                {data.socialProgramCommittee.members.map((member, index) => (
                  <div key={index} className="member-card">
                    <p className="member-name">{member.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Committee */}
        <section className="committee-section">
          <h2 className="section-title">SOCIAL MEDIA COMMITTEE</h2>
          <div className="simple-committee">
            <div className="coordinator-single">
              <h3 className="sub-title">Coordinator</h3>
              <div className="member-card coordinator">
                <p className="member-name">{data.socialMediaCommittee.coordinator}</p>
              </div>
            </div>
            <div className="members-section">
              <h3 className="sub-title">Members</h3>
              <div className="members-grid">
                {data.socialMediaCommittee.members.map((member, index) => (
                  <div key={index} className="member-card">
                    <p className="member-name">{member.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Publications & Support Committee */}
        <section className="committee-section">
          <h2 className="section-title">PUBLICATIONS & SUPPORT COMMITTEE</h2>
          <div className="simple-committee">
            <div className="coordinator-single">
              <h3 className="sub-title">Coordinator</h3>
              <div className="member-card coordinator">
                <p className="member-name">{data.publicationsSupportCommittee.coordinator}</p>
              </div>
            </div>
            <div className="members-section">
              <h3 className="sub-title">Members</h3>
              <div className="members-grid">
                {data.publicationsSupportCommittee.members.map((member, index) => (
                  <div key={index} className="member-card">
                    <p className="member-name">{member.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Financial Committee */}
        <section className="committee-section">
          <h2 className="section-title">FINANCIAL COMMITTEE</h2>
          <div className="members-grid financial-grid">
            {data.financialCommittee.map((member, index) => (
              <div key={index} className="member-card financial">
                <p className="member-name">{member.name}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default organizationCommittee