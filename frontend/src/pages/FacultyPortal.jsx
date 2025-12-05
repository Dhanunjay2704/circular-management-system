

import React, { useState } from 'react';
import EventForm from '../components/events/EventForm';
import EventList from '../components/events/EventList';
import CircularListForUser from '../components/circulars/CircularListForUser';

const FacultyPortal = () => {
  const [selected, setSelected] = useState('home');
  const [showEventFormModal, setShowEventFormModal] = useState(false);

  const openEventForm = () => setShowEventFormModal(true);
  const closeEventForm = () => setShowEventFormModal(false);

  const renderContent = () => {
    switch (selected) {
      case 'home':
        return (
          <div className="home-3d-card">
            <h3>Welcome to the Faculty Dashboard</h3>
            <p>
              This dashboard helps you manage your events and view circulars efficiently.
              Stay updated with all the latest notifications and organize your schedule with ease.
            </p>
            <div className="info-boxes">
              <div className="info-box">
                <h4>Upcoming Events</h4>
                <p>Check and add new events for your department and faculty.</p>
              </div>
              <div className="info-box">
                <h4>Circulars</h4>
                <p>View all important circulars directed to you and your department.</p>
              </div>
              <div className="info-box">
                <h4>Quick Actions</h4>
                <p>Use the tabs above to navigate through your dashboard features.</p>
              </div>
            </div>
          </div>
        );
      case 'events':
        return (
          <>
            <div className="mb-3">
              <button className="btn btn-primary btn-3d" onClick={openEventForm}>
                + Add Event
              </button>
            </div>

            <EventList />

            {/* Modal for Event Form */}
            {showEventFormModal && (
              <div
                className="modal show fade d-block modal-3d-backdrop"
                tabIndex="-1"
                role="dialog"
                onClick={closeEventForm}
              >
                <div
                  className="modal-dialog modal-3d-dialog"
                  role="document"
                  onClick={(e) => e.stopPropagation()} // prevent closing modal when clicking inside
                >
                  <div className="modal-content modal-3d-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Add Event</h5>
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={closeEventForm}
                      />
                    </div>
                    <div className="modal-body">
                      <EventForm onClose={closeEventForm} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      case 'circulars':
        return (
          <div>
            <h4>All Circulars</h4>
            <CircularListForUser />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="faculty-portal-container">
      <div className="container mt-4">
        <h2 className="portal-title">Faculty Dashboard</h2>

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
            className={`nav-link ${selected === 'events' ? 'active' : ''}`}
            onClick={() => setSelected('events')}
            type="button"
          >
            Events
          </button>
          <button
            className={`nav-link ${selected === 'circulars' ? 'active' : ''}`}
            onClick={() => setSelected('circulars')}
            type="button"
          >
            Circulars
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
        .faculty-portal-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
        }

        .faculty-portal-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: -1;
        }

        /* Portal Title */
        .portal-title {
          text-align: center;
          font-weight: 700;
          color: #1e293b;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          font-size: 2.75rem;
          letter-spacing: -0.025em;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
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
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
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
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          box-shadow: 
            0 4px 14px 0 rgba(59, 130, 246, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .nav-3d .nav-link:hover:not(.active) {
          background: rgba(59, 130, 246, 0.08);
          color: #1e40af;
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
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%);
          pointer-events: none;
        }

        .home-3d-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(59, 130, 246, 0.1);
        }

        .home-3d-card h3 {
          font-weight: 700;
          margin-bottom: 1.5rem;
          font-size: 2.5rem;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
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
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
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
            0 0 0 1px rgba(59, 130, 246, 0.1);
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

        /* Professional 3D Button */
        .btn-3d {
          border-radius: 12px;
          box-shadow: 
            0 4px 14px 0 rgba(59, 130, 246, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          font-size: 0.975rem;
          letter-spacing: 0.025em;
          border: none;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
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
            0 8px 25px 0 rgba(59, 130, 246, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .btn-3d:active {
          transform: translateY(0);
          box-shadow: 
            0 4px 14px 0 rgba(59, 130, 246, 0.3),
            inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Modal backdrop */
        .modal-3d-backdrop {
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Modal dialog with professional 3D effect */
        .modal-3d-dialog {
          max-width: 650px;
          width: 100%;
          border-radius: 24px;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-3d-content {
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .modal-header {
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          padding: 1.5rem 2rem 1rem;
        }

        .modal-title {
          font-weight: 600;
          color: #1e293b;
          font-size: 1.5rem;
          letter-spacing: -0.025em;
        }

        .btn-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #64748b;
          opacity: 0.7;
          transition: all 0.2s ease;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-close:hover {
          opacity: 1;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .modal-body {
          padding: 1rem 2rem 2rem;
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

          .modal-3d-dialog {
            margin: 1rem;
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
      `}</style>
    </div>
  );
};

export default FacultyPortal;