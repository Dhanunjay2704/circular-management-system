
// src/pages/AdminPortal.jsx


import React, { useEffect, useState } from 'react';
import CircularForm from '../components/circulars/CircularForm';
import CircularList from '../components/circulars/CircularList';
import EventForm from '../components/events/EventForm';
import EventList from '../components/events/EventList';
import UserList from './UsersList';
import adminService from '../services/adminService';

const AdminPortal = () => {
  const [selected, setSelected] = useState('home');
  const [counts, setCounts] = useState({
    totalUsers: 0,
    students: 0,
    faculties: 0,
    admins: 0,
    totalCirculars: 0,
    totalEvents: 0,
  });
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [error, setError] = useState('');

  // Circular Modal
  const [isCircularFormOpen, setCircularFormOpen] = useState(false);
  const [editingCircular, setEditingCircular] = useState(null);

  // Event Modal
  const [isEventFormOpen, setEventFormOpen] = useState(false);

  useEffect(() => {
    if (selected === 'home') {
      fetchCounts();
    }
  }, [selected]);

  const fetchCounts = async () => {
    setLoadingCounts(true);
    setError('');
    try {
      const [usersRes, circularsRes, eventsRes] = await Promise.all([
        adminService.getUserCounts(),
        adminService.getCircularCount(),
        adminService.getEventCount(),
      ]);

      setCounts({
        totalUsers: usersRes.data.totalUsers || 0,
        students: usersRes.data.students || 0,
        faculties: usersRes.data.faculties || 0,
        admins: usersRes.data.admins || 0,
        totalCirculars: circularsRes.data.count || 0,
        totalEvents: eventsRes.data.count || 0,
      });
    } catch (err) {
      console.error('Error fetching counts:', err.response || err.message || err);
      setError('Failed to load counts. Please try again later.');
    } finally {
      setLoadingCounts(false);
    }
  };

  const openAddCircularForm = () => {
    setEditingCircular(null);
    setCircularFormOpen(true);
  };

  const openEditCircularForm = (circular) => {
    setEditingCircular(circular);
    setCircularFormOpen(true);
  };

  const closeCircularForm = () => {
    setEditingCircular(null);
    setCircularFormOpen(false);
  };

  const handleCircularFormSuccess = () => {
    closeCircularForm();
  };

  const openEventForm = () => {
    setEventFormOpen(true);
  };

  const closeEventForm = () => {
    setEventFormOpen(false);
  };

  const renderContent = () => {
    switch (selected) {
      case 'home':
        return (
          <div className="home-summary">
            <h4>Summary</h4>
            {loadingCounts && <p>Loading counts...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loadingCounts && !error && (
              <div className="summary-grid">
                {[
                  ['Total Users', counts.totalUsers, 'user'],
                  ['Students', counts.students, 'student'],
                  ['Faculties', counts.faculties, 'faculty'],
                  ['Admins', counts.admins, 'admin'],
                  ['Total Circulars', counts.totalCirculars, 'circular'],
                  ['Total Events', counts.totalEvents, 'event'],
                ].map(([label, value, key]) => (
                  <div className="summary-card" key={key}>
                    <h5>{label}</h5>
                    <p className="count">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'circulars':
        return (
          <>
            <div className="header-actions">
              <button className="btn btn-primary neumorphic-btn" onClick={openAddCircularForm}>
                + Add Circular
              </button>
            </div>

            <CircularList onEditClick={openEditCircularForm} />

            {isCircularFormOpen && (
              <div
                className="modal-overlay"
                onClick={closeCircularForm}
              >
                <div className="modal-content neumorphic-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h5>{editingCircular ? 'Edit Circular' : 'Add Circular'}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={closeCircularForm}
                    />
                  </div>
                  <div className="modal-body">
                    <CircularForm
                      circular={editingCircular}
                      onClose={closeCircularForm}
                      onSuccess={handleCircularFormSuccess}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case 'events':
        return (
          <>
            <div className="header-actions">
              
              <button className="btn btn-success neumorphic-btn" onClick={openEventForm}>
                + Add Event
              </button>
            </div>

            <EventList />

            {isEventFormOpen && (
              <div
                className="modal-overlay"
                onClick={closeEventForm}
              >
                <div className="modal-content neumorphic-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h5>Add Event</h5>
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
            )}
          </>
        );

      case 'users':
        return (
          <>
            <h4>All Users</h4>
            <UserList />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-portal-container">
      <nav className="sidebar neumorphic-sidebar">
        <div className="sidebar-header">
          <div className="admin-logo">
            <div className="logo-icon">⚡</div>
            <h5 className="sidebar-title">Admin Portal</h5>
          </div>
        </div>
        <ul className="nav flex-column sidebar-nav">
          {[
            ['home', 'Dashboard', '🏠'],
            ['circulars', 'Circulars', '📋'],
            ['events', 'Events', '📅'],
            ['users', 'Users', '👥'],
          ].map(([key, label, icon]) => (
            <li className="nav-item" key={key}>
              <button
                className={`nav-link neumorphic-btn-sidebar ${selected === key ? 'active' : ''
                  }`}
                onClick={() => setSelected(key)}
                type="button"
              >
                <span className="nav-icon">{icon}</span>
                <span className="nav-label">{label}</span>
                {selected === key && <div className="active-indicator"></div>}
              </button>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">A</div>
            <div className="admin-details">
              <span className="admin-name">Administrator</span>
              <span className="admin-status">Online</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content neumorphic-main">
        <div className="dashboard-header">
          <div className="header-content">
            <h2 className="main-title">
              {selected === 'home' ? 'Dashboard Overview' : 
               selected === 'circulars' ? 'Manage Circulars' :
               selected === 'events' ? 'Manage Events' : 'Manage Users'}
            </h2>
            <div className="header-meta">
              <span className="breadcrumb">Admin Portal / {selected.charAt(0).toUpperCase() + selected.slice(1)}</span>
              <div className="header-actions-right">
                <div className="datetime">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>

      <style>{`
        /* Import Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        /* Overall container */
        .admin-portal-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #2d3748;
          user-select: none;
          position: relative;
        }

        /* Sidebar Styles */
        .sidebar {
          flex-shrink: 0;
          width: 280px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.1),
            0 20px 48px rgba(0, 0, 0, 0.1);
        }

        .sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          pointer-events: none;
        }

        .sidebar-header {
          padding: 2rem 1.5rem 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .sidebar-title {
          font-weight: 700;
          font-size: 1.25rem;
          margin: 0;
          color: #1a202c;
          letter-spacing: -0.025em;
        }

        .sidebar-nav {
          list-style: none;
          padding: 0 1.5rem;
          margin: 1rem 0;
          flex-grow: 1;
        }

        .sidebar-nav .nav-item {
          margin-bottom: 0.5rem;
        }

        .neumorphic-btn-sidebar {
          width: 100%;
          background: transparent;
          border: none;
          border-radius: 12px;
          padding: 0.875rem 1rem;
          font-weight: 500;
          color: #4a5568;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          text-align: left;
          font-size: 0.95rem;
          user-select: none;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          outline: none;
        }

        .nav-icon {
          font-size: 1.1rem;
          width: 20px;
          text-align: center;
        }

        .nav-label {
          flex: 1;
        }

        .active-indicator {
          width: 4px;
          height: 4px;
          background: #667eea;
          border-radius: 50%;
          margin-left: auto;
        }

        .neumorphic-btn-sidebar:hover {
          background: rgba(102, 126, 234, 0.08);
          color: #667eea;
          transform: translateX(4px);
        }

        .neumorphic-btn-sidebar.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .neumorphic-btn-sidebar.active:hover {
          transform: translateX(0);
          background: linear-gradient(135deg, #5a67d8, #6b46c1);
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .admin-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #48bb78, #38a169);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1rem;
        }

        .admin-details {
          display: flex;
          flex-direction: column;
        }

        .admin-name {
          font-weight: 600;
          font-size: 0.875rem;
          color: #1a202c;
        }

        .admin-status {
          font-size: 0.75rem;
          color: #48bb78;
          font-weight: 500;
        }

        /* Main Content */
        .main-content {
          flex-grow: 1;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .dashboard-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 2rem 2.5rem 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .main-title {
          font-weight: 700;
          font-size: 2rem;
          margin: 0;
          color: #1a202c;
          letter-spacing: -0.025em;
        }

        .header-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .breadcrumb {
          font-size: 0.875rem;
          color: #718096;
          font-weight: 500;
        }

        .datetime {
          font-size: 0.875rem;
          color: #4a5568;
          font-weight: 500;
        }

        .content-wrapper {
          flex-grow: 1;
          padding: 2.5rem;
          overflow-y: auto;
        }

        /* Home Summary Styles */
        .home-summary h4 {
          font-weight: 600;
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          color: #2d3748;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .summary-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.05),
            0 10px 15px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .summary-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .summary-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.1),
            0 16px 32px rgba(0, 0, 0, 0.1);
        }

        .summary-card h5 {
          font-weight: 600;
          margin-bottom: 1rem;
          font-size: 0.95rem;
          color: #4a5568;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .summary-card .count {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a202c;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        /* Header Actions */
        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .header-actions h4 {
          font-weight: 600;
          font-size: 1.25rem;
          color: #2d3748;
          margin: 0;
        }

        .neumorphic-btn {
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .neumorphic-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .neumorphic-btn:active {
          transform: translateY(0);
        }

        .btn-primary.neumorphic-btn {
          background: linear-gradient(135deg, #4299e1, #3182ce);
        }

        .btn-primary.neumorphic-btn:hover {
          box-shadow: 0 6px 16px rgba(66, 153, 225, 0.4);
        }

        .btn-success.neumorphic-btn {
          background: linear-gradient(135deg, #48bb78, #38a169);
        }

        .btn-success.neumorphic-btn:hover {
          box-shadow: 0 6px 16px rgba(72, 187, 120, 0.4);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
          user-select: none;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
          width: 600px;
          max-width: 90vw;
          max-height: 90vh;
          overflow-y: auto;
          padding: 0;
          user-select: text;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h5 {
          font-weight: 600;
          font-size: 1.25rem;
          color: #1a202c;
          margin: 0;
        }

        .btn-close {
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          color: #4a5568;
          padding: 0;
          line-height: 1;
          user-select: none;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-close:hover {
          background: #edf2f7;
          color: #2d3748;
        }

        .btn-close::before {
          content: '×';
          font-size: 18px;
          font-weight: 400;
        }

        .modal-body {
          flex-grow: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        /* Loading and Error States */
        .alert {
          padding: 1rem 1.5rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .alert-danger {
          background: #fed7d7;
          color: #9b2c2c;
          border: 1px solid #feb2b2;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .sidebar {
            width: 260px;
          }
          
          .content-wrapper {
            padding: 2rem;
          }
          
          .dashboard-header {
            padding: 1.5rem 2rem 1.25rem;
          }
        }

        @media (max-width: 768px) {
          .admin-portal-container {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            flex-direction: row;
            padding: 1rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .sidebar-header {
            padding: 0;
            border-bottom: none;
            margin-right: 1rem;
          }
          
          .admin-logo {
            margin-bottom: 0;
          }
          
          .sidebar-title {
            display: none;
          }
          
          .sidebar-nav {
            display: flex;
            flex-direction: row;
            gap: 0.5rem;
            margin: 0;
            padding: 0;
            flex-grow: 1;
          }
          
          .sidebar-nav .nav-item {
            margin-bottom: 0;
          }
          
          .neumorphic-btn-sidebar {
            padding: 0.75rem 1rem;
            border-radius: 10px;
            font-size: 0.875rem;
            min-width: 80px;
            justify-content: center;
          }
          
          .nav-label {
            display: none;
          }
          
          .nav-icon {
            font-size: 1.25rem;
          }
          
          .sidebar-footer {
            display: none;
          }
          
          .main-content {
            min-height: calc(100vh - 80px);
          }
          
          .dashboard-header {
            padding: 1.25rem 1.5rem 1rem;
          }
          
          .main-title {
            font-size: 1.5rem;
          }
          
          .content-wrapper {
            padding: 1.5rem;
          }
          
          .summary-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }
          
          .summary-card {
            padding: 1.5rem;
          }
          
          .header-actions {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
            padding: 1.25rem 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .summary-grid {
            grid-template-columns: 1fr;
          }
          
          .modal-content {
            width: 95vw;
            margin: 1rem;
          }
          
          .modal-header,
          .modal-body {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPortal;