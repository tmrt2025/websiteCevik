import React from 'react'
import "../css/scientficProg.css"
import useLocalContent from "../hooks/useLocalContent"
export default function ScientificProgram() {
  // İki programı aynı anda çek
  const { data: data1, loading: loading1, error: error1 } = useLocalContent("schedule")
  const { data: data2, loading: loading2, error: error2 } = useLocalContent("schedule2")

  if (loading1 || loading2) return <div className="loading">Loading program info...</div>;
  if (error1) return <div className="error">Error loading May 23 program: {error1.message}</div>;
  if (error2) return <div className="error">Error loading May 24 program: {error2.message}</div>;
  if (!data1 || !data2) return <div className="error">No data found.</div>;

  return (
    <div className="scientific-program">
      {/* May 23 Programı */}
      <div className="program-day">
        <div className="program-header">
          <h1 className="day-title">May 23rd, Friday</h1>
          <div className="day-subtitle">First Day - Innovation & Technology</div>
        </div>
        
        <div className="schedule-container">
          {data1.schedule.map((item, index) => (
            <ScheduleItem key={index} item={item} />
          ))}
        </div>
      </div>

      {/* May 24 Programı */}
      <div className="program-day">
        <div className="program-header">
          <h1 className="day-title">May 24th, Saturday</h1>
          <div className="day-subtitle">Second Day - Research & Future Perspectives</div>
        </div>
        
        <div className="schedule-container">
          {data2.schedule.map((item, index) => (
            <ScheduleItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Ayrı bir component for schedule items
function ScheduleItem({ item }) {
  if (item.type === "section-header") {
    return (
      <div className="section-header">
        <div className="section-title">{item.title}</div>
        {item.moderator && item.moderator !== "X" && (
          <div className="section-moderator">
            <strong>Moderator:</strong> {item.moderator}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`schedule-item ${item.type}`}>
      <div className="item-time">
        {item.start} - {item.end}
      </div>
      <div className="item-content">
        <div className="item-header">
          <span className="item-icon">{getIcon(item.type)}</span>
          <h3 className="item-title">{item.title}</h3>
        </div>
        
        {item.speaker && (
          <div className="item-speaker">
            <strong>{item.speaker}</strong>
          </div>
        )}
        
        {item.moderator && (
          <div className="item-moderator">
            <strong>Moderator:</strong> {item.moderator}
          </div>
        )}
      </div>
    </div>
  );
}

// Icon belirleme fonksiyonu
function getIcon(type) {
  const icons = {
    "registration": "📝",
    "ceremony": "🎉",
    "speech": "🎤",
    "talk": "💡",
    "break": "☕",
    "inspiration": "🌟",
    "presentation": "📊",
    "workshop": "🔧",
    "section-header": "🧭",
    "debate": "⚡",
    "awards": "🏆"
  };
  return icons[type] || "📅";
}