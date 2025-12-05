

import React, { useEffect, useState } from 'react';
import eventService from '../../services/eventService';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Predefined departments list
  const predefinedDepartments = [
    'Computer Science',
    'Information Technology',
    'Electronics and Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Biomedical Engineering',
    'Aerospace Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Business Administration',
    'Marketing',
    'Finance',
    'Human Resources',
    'Operations',
    'Research & Development',
    'Quality Assurance',
    'Customer Service',
    'Sales',
    'Design',
    'Administration',
    'Management',
    'Other'
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  // Search and filter functionality
  useEffect(() => {
    let filtered = events;

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.createdBy?.name && event.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(event => event.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Department filter
    if (departmentFilter) {
      filtered = filtered.filter(event => event.department === departmentFilter);
    }

    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.eventDate);
        return eventDate.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter, departmentFilter, dateFilter]);

  const fetchEvents = async () => {
    try {
      const res = await eventService.getAllEvents();
      setEvents(res.data);
      setFilteredEvents(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filter dropdowns with predefined departments
  const getAllDepartments = () => {
    const existingDepartments = events.map(event => event.department).filter(Boolean);
    const allDepartments = [...new Set([...predefinedDepartments, ...existingDepartments])];
    return allDepartments.sort();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDepartmentFilter('');
    setDateFilter('');
  };

  const handleSave = async (updatedData) => {
    try {
      await eventService.updateEvent(editingEvent._id, updatedData);
      setEvents((prev) =>
        prev.map((e) => (e._id === editingEvent._id ? { ...e, ...updatedData } : e))
      );
      setEditingEvent(null);
    } catch (err) {
      alert('Failed to update event: ' + (err.response?.data?.message || err.message));
    }
  };

  const statusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return <span className="badge bg-info text-uppercase">{status}</span>;
      case 'ongoing':
        return <span className="badge bg-warning text-uppercase text-dark">{status}</span>;
      case 'completed':
        return <span className="badge bg-success text-uppercase">{status}</span>;
      default:
        return <span className="badge bg-secondary text-uppercase">{status}</span>;
    }
  };

  const EditEventModal = ({ event, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      title: event.title || '',
      description: event.description || '',
      department: event.department || '',
      eventDate: event.eventDate
        ? new Date(event.eventDate).toISOString().substr(0, 10)
        : '',
      status: event.status || 'upcoming',
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const updatedEvent = {
        ...formData,
        eventDate: new Date(formData.eventDate).toISOString(),
      };
      onSave(updatedEvent);
    };

    return (
      <div
        className="modal show fade d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          zIndex: 1050,
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-4 rounded-4 shadow">
            <h5 className="modal-title mb-4 text-center">Edit Event</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control"
                  required
                  placeholder="Enter event title"
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  rows={3}
                  required
                  placeholder="Enter event description"
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Department</option>
                  {getAllDepartments().map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Event Date</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="d-flex justify-content-center gap-3">
                <button type="submit" className="btn btn-primary px-4">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-start py-5"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f8f9fa',
      }}
    >
      <div
        className="card shadow-lg rounded-4 p-4"
        style={{ width: '100%', maxWidth: '1200px', backgroundColor: 'white' }}
      >
        <h4 className="mb-4 text-center text-dark">
          <i className="bi bi-calendar-event-fill me-2"></i>Event List
        </h4>

        {/* Search and Filter Section */}
        <div className="bg-light rounded p-4 mb-4 border">
          <div className="row g-3">
            {/* Search Input */}
            <div className="col-md-4">
              <label htmlFor="search" className="form-label fw-semibold text-secondary">
                <i className="bi bi-search me-1"></i>Search
              </label>
              <input
                id="search"
                type="text"
                className="form-control"
                placeholder="Search by title, description, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="col-md-2">
              <label htmlFor="statusFilter" className="form-label fw-semibold text-secondary">Status</label>
              <select
                id="statusFilter"
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Department Filter */}
            <div className="col-md-2">
              <label htmlFor="departmentFilter" className="form-label fw-semibold text-secondary">Department</label>
              <select
                id="departmentFilter"
                className="form-select"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {getAllDepartments().map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="col-md-2">
              <label htmlFor="dateFilter" className="form-label fw-semibold text-secondary">Event Date</label>
              <input
                id="dateFilter"
                type="date"
                className="form-control"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            {/* Clear Filters Button */}
            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
                disabled={!searchTerm && !statusFilter && !departmentFilter && !dateFilter}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Search Results Info */}
          {(searchTerm || statusFilter || departmentFilter || dateFilter) && (
            <div className="mt-3 pt-2 border-top">
              <small className="text-muted">
                Showing {filteredEvents.length} of {events.length} events
                {searchTerm && <span className="fw-semibold"> matching "{searchTerm}"</span>}
              </small>
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status" aria-label="Loading">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 fs-5 text-secondary">Loading events...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && events.length === 0 && (
          <p className="text-center text-muted">No events available.</p>
        )}

        {!loading && events.length > 0 && filteredEvents.length === 0 && (
          <div className="text-center my-5">
            <div className="text-muted">
              <i className="bi bi-search fs-1 mb-3 d-block"></i>
              <h5>No events match your search criteria</h5>
              <p>Try adjusting your search terms or filters</p>
              <button className="btn btn-outline-primary" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {!loading && filteredEvents.length > 0 && (
          <div className="table-responsive" style={{ paddingLeft: 0 }}>
            <table
              className="table table-hover table-bordered align-middle"
              style={{ borderCollapse: 'collapse', marginLeft: 0 }}
            >
              <thead className="table-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Title</th>
                  <th scope="col">Description</th>
                  <th scope="col">Department</th>
                  <th scope="col">Event Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Created By</th>
                  <th scope="col" style={{ minWidth: '100px' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, index) => (
                  <tr key={event._id}>
                    <td>{index + 1}</td>
                    <td>{event.title}</td>
                    <td className="text-truncate" style={{ maxWidth: '200px' }}>
                      {event.description}
                    </td>
                    <td>{event.department}</td>
                    <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                    <td>{statusBadge(event.status)}</td>
                    <td>{event.createdBy?.name || 'Unknown'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => setEditingEvent(event)}
                        title="Edit Event"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingEvent && (
          <EditEventModal
            event={editingEvent}
            onSave={handleSave}
            onCancel={() => setEditingEvent(null)}
          />
        )}
      </div>
    </div>
  );
};

export default EventList;