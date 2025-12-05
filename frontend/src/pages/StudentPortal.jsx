
import React, { useState } from 'react';
import StudentEventList from '../components/events/StudentEventList';
import CircularListForUser from '../components/circulars/CircularListForUser';

const StudentPortal = () => {
  const [selected, setSelected] = useState('home');

  const renderContent = () => {
    switch (selected) {
      case 'home':
        return (
          <div className="home-3d-card">
            <h3>Welcome to the Student Dashboard</h3>
            <p>
              Here you can stay updated with all circulars and events relevant to you.
              Use the tabs above to explore.
            </p>
            <div className="info-boxes">
              <div className="info-box">
                <h4>Stay Informed</h4>
                <p>Check important circulars from your department and university.</p>
              </div>
              <div className="info-box">
                <h4>Participate</h4>
                <p>Join upcoming events to enhance your skills and networking.</p>
              </div>
              <div className="info-box">
                <h4>Quick Navigation</h4>
                <p>Use the navigation tabs above to browse circulars and events easily.</p>
              </div>
            </div>
          </div>
        );
      case 'circulars':
        return (
          <div>
            <h4>Available Circulars</h4>
            <CircularListForUser />
          </div>
        );
      case 'events':
        return (
          <div>
            <h4>Available Events</h4>
            <StudentEventList />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="student-portal-container">
      <div className="container mt-4">
        <h2 className="portal-title">Student Dashboard</h2>

        {/* Navbar */}
        <nav className="nav nav-tabs mb-4 nav-3d">
          <button
            className={`nav-link ${selected === 'home' ? 'active' : ''}`}
            onClick={() => setSelected('home')}
            type="button"
          >
            Home
          </button>
          <button
            className={`nav-link ${selected === 'circulars' ? 'active' : ''}`}
            onClick={() => setSelected('circulars')}
            type="button"
          >
            Circulars
          </button>
          <button
            className={`nav-link ${selected === 'events' ? 'active' : ''}`}
            onClick={() => setSelected('events')}
            type="button"
          >
            Events
          </button>
        </nav>

        {/* Render content based on selected tab */}
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </div>

      {/* Professional 3D Styling */}
      <style>{`
        /* Global Styles */
        .student-portal-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
        }

        .student-portal-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: -1;
        }

        /* Portal Title */
        .portal-title {
          text-align: center;
          font-weight: 700;
          color: #0f172a;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          font-size: 2.75rem;
          letter-spacing: -0.025em;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        }

        .portal-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border-radius: 2px;
        }

        /* Professional 3D Nav Tabs */
        .nav-3d {
          border-bottom: none;
          padding: 0 1rem;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          position: relative;
          overflow: hidden;
        }

        .nav-3d::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%);
          pointer-events: none;
        }

        .nav-3d .nav-link {
          font-weight: 600;
          color: #475569;
          background: transparent;
          border: none;
          border-radius: 12px;
          margin: 0.5rem 0.25rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          padding: 0.875rem 1.75rem;
          font-size: 0.95rem;
          letter-spacing: 0.025em;
          position: relative;
          overflow: hidden;
        }

        .nav-3d .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .nav-3d .nav-link:hover::before {
          left: 100%;
        }

        .nav-3d .nav-link.active {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          box-shadow: 
            0 4px 14px 0 rgba(34, 197, 94, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .nav-3d .nav-link:hover:not(.active) {
          background: rgba(34, 197, 94, 0.08);
          color: #15803d;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* Content Wrapper */
        .content-wrapper {
          position: relative;
          z-index: 1;
        }

        /* Home 3D Card */
        .home-3d-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 24px;
          box-shadow: 
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          padding: 3rem 3.5rem;
          text-align: center;
          color: #1e293b;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 3rem;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .home-3d-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.03) 0%, rgba(22, 163, 74, 0.03) 100%);
          pointer-events: none;
        }

        .home-3d-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(34, 197, 94, 0.1);
        }

        .home-3d-card h3 {
          font-weight: 700;
          margin-bottom: 1.5rem;
          font-size: 2.5rem;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.025em;
        }

        .home-3d-card > p {
          font-size: 1.125rem;
          margin-bottom: 2.5rem;
          line-height: 1.7;
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
          color: #64748b;
          font-weight: 400;
        }

        /* Info boxes inside home card */
        .info-boxes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .info-box {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          padding: 2rem 2.5rem;
          color: #334155;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .info-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .info-box:hover::before {
          transform: scaleX(1);
        }

        .info-box:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 10px 25px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05),
            0 0 0 1px rgba(34, 197, 94, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }

        .info-box h4 {
          margin-bottom: 1rem;
          font-weight: 600;
          font-size: 1.25rem;
          color: #1e293b;
          letter-spacing: -0.025em;
        }

        .info-box p {
          font-size: 0.975rem;
          line-height: 1.6;
          color: #64748b;
          margin: 0;
        }

        /* Professional 3D Button (for any future use) */
        .btn-3d {
          border-radius: 12px;
          box-shadow: 
            0 4px 14px 0 rgba(34, 197, 94, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          font-size: 0.975rem;
          letter-spacing: 0.025em;
          border: none;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .btn-3d::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn-3d:hover::before {
          left: 100%;
        }

        .btn-3d:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 25px 0 rgba(34, 197, 94, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .btn-3d:active {
          transform: translateY(0);
          box-shadow: 
            0 4px 14px 0 rgba(34, 197, 94, 0.3),
            inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .portal-title {
            font-size: 2.25rem;
          }

          .home-3d-card {
            padding: 2rem 1.5rem;
          }

          .info-boxes {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .nav-3d .nav-link {
            padding: 0.75rem 1.25rem;
            font-size: 0.9rem;
          }
        }

        /* Additional section styling */
        .content-wrapper h4 {
          color: #1e293b;
          font-weight: 600;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          letter-spacing: -0.025em;
        }

        /* Custom scrollbar for better aesthetics */
        .student-portal-container ::-webkit-scrollbar {
          width: 8px;
        }

        .student-portal-container ::-webkit-scrollbar-track {
          background: rgba(34, 197, 94, 0.1);
          border-radius: 4px;
        }

        .student-portal-container ::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.3);
          border-radius: 4px;
        }

        .student-portal-container ::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.5);
        }

        /* Focus styles for accessibility */
        .nav-3d .nav-link:focus {
          outline: 2px solid rgba(34, 197, 94, 0.5);
          outline-offset: 2px;
        }

        /* Loading animation for future use */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .loading-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default StudentPortal;