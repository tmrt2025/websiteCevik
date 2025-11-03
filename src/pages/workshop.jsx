import React, { useState } from 'react'
import { useFetchJson } from "../hooks/usefetchJson"
import "../css/workshop.css"

export default function Workshop() {
  const { data, loading, error } = useFetchJson("/content/workshopContent.json")
  const [selected, setSelected] = useState(null)

  if (loading) return (
    <div className="workshop-page">
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading workshop information...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="workshop-page">
      <div className="error-state">
        <h2>Error Loading Content</h2>
        <p>{error.message}</p>
      </div>
    </div>
  )

  if (!data || !data.workshops) return (
    <div className="workshop-page">
      <div className="error-state">
        <h2>No Data Found</h2>
        <p>Workshop content could not be loaded</p>
      </div>
    </div>
  )

  return (
    <div className="workshop-container">
      {/* Ana Başlık */}
      <header className="main-header">
        <h1 className="spark-title">SPARK25</h1>
        <p className="page-subtitle">Workshops</p>
      </header>

      {/* Workshop Grid */}
      <section className="workshops-section">
        <div className="workshop-grid">
          {data.workshops.map((ws, i) => (
            <div 
              key={i} 
              className='workshop-card' 
              onClick={() => setSelected(ws)}
            >
              <div className="card-image-container">
                <img 
                  src={ws.image} 
                  alt={ws.title}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.png'
                  }}
                />
              </div>
              <div className="card-content">
                <h3>{ws.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <div className="workshop-modal-overlay" onClick={() => setSelected(null)}>
          <div className="workshop-modal" onClick={(e) => e.stopPropagation()}>
            
            {/* Kapatma Butonu */}
            <button 
              className="close-button"
              onClick={() => setSelected(null)}
            >
              ×
            </button>

            {/* Modal İçeriği */}
            <div className="modal-content">
              {/* Workshop Görseli - Ortalanmış */}
              <div className="modal-image-container">
                <img 
                  src={selected.image} 
                  alt={selected.title}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.png'
                  }}
                />
              </div>

              {/* Workshop Başlığı */}
              <div className="modal-workshop-title">
                <h2>{selected.title}</h2>
              </div>

              {/* Açıklama */}
              <div className="modal-description">
                <p>{selected.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}