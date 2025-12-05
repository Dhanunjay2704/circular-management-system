


import React, { useEffect, useState } from 'react';
import eventService from '../../services/eventService';
import '../../App.css'; // Make sure your custom styles are imported

const StudentEventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

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

  // Search and filter functionality
  useEffect(() => {
    let filtered = events;

    // Apply text search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      
      filtered = filtered.filter((event) => {
        switch (searchFilter) {
          case 'title':
            return event.title.toLowerCase().includes(searchLower);
          case 'description':
            return event.description.toLowerCase().includes(searchLower);
          case 'department':
            return event.department.toLowerCase().includes(searchLower);
          case 'createdBy':
            return event.createdBy?.name?.toLowerCase().includes(searchLower);
          case 'all':
          default:
            return (
              event.title.toLowerCase().includes(searchLower) ||
              event.description.toLowerCase().includes(searchLower) ||
              event.department.toLowerCase().includes(searchLower) ||
              event.createdBy?.name?.toLowerCase().includes(searchLower)
            );
        }
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  }, [searchTerm, searchFilter, statusFilter, events]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchFilter('all');
    setStatusFilter('all');
  };

  // Get unique statuses for filter dropdown
  const uniqueStatuses = [...new Set(events.map(event => event.status))];

  return (
    <div className="container mt-5">
      <h3 className="text-center fw-bold text-primary mb-4">Upcoming Events</h3>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" aria-label="Loading spinner">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 fs-5">Loading events...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center fs-5" role="alert">
          {error}
        </div>
      )}

      {!loading && events.length === 0 && (
        <p className="text-center fs-5 text-muted">No events available.</p>
      )}

      {!loading && events.length > 0 && (
        <>
          {/* Search Controls */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-5">
                  <label htmlFor="searchInput" className="form-label fw-semibold">
                    Search Events
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="searchInput"
                      placeholder="Enter search term..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    {(searchTerm || statusFilter !== 'all') && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={clearSearch}
                        title="Clear all filters"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-md-3">
                  <label htmlFor="searchFilter" className="form-label fw-semibold">
                    Search In
                  </label>
                  <select
                    className="form-select"
                    id="searchFilter"
                    value={searchFilter}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All Fields</option>
                    <option value="title">Title</option>
                    <option value="description">Description</option>
                    <option value="department">Department</option>
                    <option value="createdBy">Created By</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label htmlFor="statusFilter" className="form-label fw-semibold">
                    Status
                  </label>
                  <select
                    className="form-select"
                    id="statusFilter"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                  >
                    <option value="all">All Status</option>
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <div className="text-muted small">
                    Showing {filteredEvents.length} of {events.length} events
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {filteredEvents.length === 0 && (searchTerm || statusFilter !== 'all') && (
            <div className="alert alert-info text-center">
              <i className="bi bi-info-circle me-2"></i>
              No events found matching your search criteria.
              <button 
                className="btn btn-link p-0 ms-2" 
                onClick={clearSearch}
              >
                Clear filters
              </button>
            </div>
          )}

          {filteredEvents.length > 0 && (
            <div className="card shadow-3d p-4">
              <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered table-3d align-middle">
                  <thead className="table-primary text-center">
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Department</th>
                      <th>Event Date</th>
                      <th>Status</th>
                      <th>Created By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event, index) => (
                      <tr key={event._id}>
                        <td className="text-center fw-bold">{index + 1}</td>
                        <td className="fw-semibold text-primary">{event.title}</td>
                        <td>{event.description}</td>
                        <td>{event.department}</td>
                        <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`badge rounded-pill px-3 py-2 ${
                              event.status === 'Upcoming'
                                ? 'bg-success'
                                : event.status === 'Ongoing'
                                ? 'bg-warning text-dark'
                                : 'bg-secondary'
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                        <td>{event.createdBy?.name || 'Unknown'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentEventList;