
import React, { useEffect, useState } from 'react';
import circularService from '../../services/circularService';
import CircularPreview from './CircularPreview';

const CircularList = () => {
  const [circulars, setCirculars] = useState([]);
  const [filteredCirculars, setFilteredCirculars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCircular, setSelectedCircular] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [editingCircular, setEditingCircular] = useState(null);
  
  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // New state for date sorting

  // Enhanced predefined options for better filtering
  const typeOptions = [
    'incoming',
    'outgoing',
    'notification',
    'policy',
    'announcement',
    'directive',
    'memorandum',
    'order',
    'instruction'
  ];

  const departmentOptions = [
    'Human Resources',
    'Finance',
    'Administration',
    'IT Department',
    'Academic Affairs',
    'Student Affairs',
    'Research & Development',
    'Legal Department',
    'Operations',
    'Marketing',
    'Public Relations',
    'Security',
    'Maintenance',
    'Library',
    'Examination',
    'Accounts',
    'Purchase',
    'Training',
    'Quality Assurance',
    'General Administration'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title Z-A' },
    { value: 'title-desc', label: 'Title A-Z' }
  ];

  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await circularService.getAllCirculars();
        setCirculars(response.data);
        setFilteredCirculars(response.data);

        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserRole(payload.role);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load circulars');
      } finally {
        setLoading(false);
      }
    };

    fetchCirculars();
  }, []);

  // Search, filter, and sort functionality
  useEffect(() => {
    let filtered = circulars;

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(circular =>
        circular.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        circular.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        circular.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        circular.targetAudience.some(audience => 
          audience.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (circular.referenceId && circular.referenceId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(circular => circular.status === statusFilter);
    }

    // Type filter
    if (typeFilter) {
      filtered = filtered.filter(circular => circular.type === typeFilter);
    }

    // Department filter
    if (departmentFilter) {
      filtered = filtered.filter(circular => circular.department === departmentFilter);
    }

    // Sorting
    filtered = filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.issueDate) - new Date(a.issueDate);
        case 'oldest':
          return new Date(a.issueDate) - new Date(b.issueDate);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return new Date(b.issueDate) - new Date(a.issueDate);
      }
    });

    setFilteredCirculars(filtered);
  }, [circulars, searchTerm, statusFilter, typeFilter, departmentFilter, sortOrder]);

  // Get unique values for filter dropdowns (combines predefined with existing data)
  const getUniqueValues = (field, predefinedOptions = []) => {
    const existingValues = circulars.map(circular => circular[field]).filter(Boolean);
    const allValues = [...new Set([...predefinedOptions, ...existingValues])];
    return allValues.sort();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
    setDepartmentFilter('');
    setSortOrder('newest');
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await circularService.updateCircularStatus(id, newStatus);
      setCirculars((prev) =>
        prev.map((circ) =>
          circ._id === id ? { ...circ, status: newStatus } : circ
        )
      );
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this circular?')) return;
    try {
      await circularService.deleteCircular(id);
      setCirculars((prev) => prev.filter((circ) => circ._id !== id));
    } catch {
      alert('Failed to delete circular');
    }
  };

  const handleSave = async (updatedData) => {
    try {
      await circularService.updateCircular(editingCircular._id, updatedData);
      setCirculars((prev) =>
        prev.map((circ) =>
          circ._id === editingCircular._id ? { ...circ, ...updatedData } : circ
        )
      );
      setEditingCircular(null);
    } catch {
      alert('Failed to update circular');
    }
  };

  const EditCircularForm = ({ circular, onCancel, onSave }) => {
    const [formData, setFormData] = useState({
      title: circular.title,
      type: circular.type,
      department: circular.department,
      targetAudience: circular.targetAudience.join(', '),
      issueDate: new Date(circular.issueDate).toISOString().substr(0, 10),
      referenceId: circular.referenceId,
      status: circular.status,
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const updatedCircular = {
        ...formData,
        targetAudience: formData.targetAudience.split(',').map((item) => item.trim()),
        issueDate: new Date(formData.issueDate).toISOString(),
      };
      onSave(updatedCircular);
    };

    return (
      <form onSubmit={handleSubmit} className="p-3">
        <div className="mb-3">
          <label htmlFor="title" className="form-label fw-semibold">Title</label>
          <input id="title" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label fw-semibold">Type</label>
          <select id="type" className="form-select" name="type" value={formData.type} onChange={handleChange} required>
            <option value="">Select Type</option>
            {typeOptions.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="department" className="form-label fw-semibold">Department</label>
          <select id="department" className="form-select" name="department" value={formData.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            {departmentOptions.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="targetAudience" className="form-label fw-semibold">Target Audience (comma separated)</label>
          <input id="targetAudience" className="form-control" name="targetAudience" value={formData.targetAudience} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="issueDate" className="form-label fw-semibold">Issue Date</label>
          <input id="issueDate" type="date" className="form-control" name="issueDate" value={formData.issueDate} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="referenceId" className="form-label fw-semibold">Reference ID</label>
          <input id="referenceId" className="form-control" name="referenceId" value={formData.referenceId} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="form-label fw-semibold">Status</label>
          <select id="status" className="form-select" name="status" value={formData.status} onChange={handleChange} required>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="d-flex justify-content-end gap-3">
          <button
            type="submit"
            className="btn btn-primary px-4 py-2 fs-6 shadow-sm"
            style={{ minWidth: '100px' }}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary px-4 py-2 fs-6 shadow-sm"
            onClick={onCancel}
            style={{ minWidth: '100px' }}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  // Helper to get badge class based on status with better color scheme
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'bg-success text-white';
      case 'pending': return 'bg-warning text-dark';
      case 'rejected': return 'bg-danger text-white';
      case 'published': return 'bg-info text-dark';
      default: return 'bg-secondary text-white';
    }
  };

  // Helper to get type badge styling
  const getTypeBadgeClass = (type) => {
    switch (type.toLowerCase()) {
      case 'incoming': return 'bg-primary text-white';
      case 'outgoing': return 'bg-success text-white';
      case 'notification': return 'bg-info text-white';
      case 'policy': return 'bg-warning text-dark';
      case 'announcement': return 'bg-secondary text-white';
      default: return 'bg-light text-dark';
    }
  };

  return (
    <div className="container my-5" style={{ backgroundColor: '#f0f4f8', borderRadius: '12px', padding: '2rem' }}>
      <h3 className="mb-4 text-primary fw-bold border-bottom pb-3" style={{ letterSpacing: '1.1px' }}>
        All Circulars
      </h3>

      {/* Search and Filter Section */}
      <div className="bg-white rounded shadow-sm p-4 mb-4">
        <div className="row g-3">
          {/* Search Input */}
          <div className="col-md-3">
            <label htmlFor="search" className="form-label fw-semibold text-secondary">
              <i className="bi bi-search me-1"></i>Search
            </label>
            <input
              id="search"
              type="text"
              className="form-control"
              placeholder="Search by title, type, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort Order */}
          <div className="col-md-2">
            <label htmlFor="sortOrder" className="form-label fw-semibold text-secondary">
              <i className="bi bi-sort-down me-1"></i>Sort By
            </label>
            <select
              id="sortOrder"
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Type Filter - Enhanced with incoming/outgoing */}
          <div className="col-md-2">
            <label htmlFor="typeFilter" className="form-label fw-semibold text-secondary">Type</label>
            <select
              id="typeFilter"
              className="form-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              {getUniqueValues('type', typeOptions).map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter - Enhanced with more departments */}
          <div className="col-md-2">
            <label htmlFor="departmentFilter" className="form-label fw-semibold text-secondary">Department</label>
            <select
              id="departmentFilter"
              className="form-select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {getUniqueValues('department', departmentOptions).map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="col-md-1 d-flex align-items-end">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={clearFilters}
              disabled={!searchTerm && !statusFilter && !typeFilter && !departmentFilter && sortOrder === 'newest'}
              title="Clear all filters and reset sorting"
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>

        {/* Search Results Info */}
        {(searchTerm || statusFilter || typeFilter || departmentFilter || sortOrder !== 'newest') && (
          <div className="mt-3 pt-2 border-top">
            <small className="text-muted">
              Showing {filteredCirculars.length} of {circulars.length} circulars
              {searchTerm && <span className="fw-semibold"> matching "{searchTerm}"</span>}
              {statusFilter && <span className="fw-semibold"> • Status: {statusFilter}</span>}
              {typeFilter && <span className="fw-semibold"> • Type: {typeFilter}</span>}
              {departmentFilter && <span className="fw-semibold"> • Department: {departmentFilter}</span>}
              {sortOrder !== 'newest' && (
                <span className="fw-semibold"> • Sorted by: {sortOptions.find(opt => opt.value === sortOrder)?.label}</span>
              )}
            </small>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status" aria-label="Loading">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 fs-5 text-secondary">Loading circulars...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger shadow-sm rounded" role="alert">
          {error}
        </div>
      )}

      {!loading && circulars.length === 0 && (
        <p className="text-muted fs-5 text-center my-5">No circulars found.</p>
      )}

      {!loading && circulars.length > 0 && filteredCirculars.length === 0 && (
        <div className="text-center my-5">
          <div className="text-muted">
            <i className="bi bi-search fs-1 mb-3 d-block"></i>
            <h5>No circulars match your search criteria</h5>
            <p>Try adjusting your search terms or filters</p>
            <button className="btn btn-outline-primary" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {!loading && filteredCirculars.length > 0 && (
        <div className="table-responsive shadow rounded" style={{ backgroundColor: 'white' }}>
          <table className="table table-hover align-middle mb-0">
            <thead className="table-primary text-primary">
              <tr>
                <th className="fw-semibold text-center" style={{ width: '60px' }}>#</th>
                <th className="fw-semibold">Title</th>
                <th className="fw-semibold">Type</th>
                <th className="fw-semibold">Department</th>
                <th className="fw-semibold">Target Audience</th>
                <th className="fw-semibold">Status</th>
                <th className="fw-semibold">Issue Date</th>
                <th className="fw-semibold">Reference ID</th>
                <th className="text-center fw-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCirculars.map((circular, index) => (
                <tr key={circular._id} className="align-middle">
                  <td className="text-center fw-semibold text-muted">{index + 1}</td>
                  <td className="text-truncate" style={{ maxWidth: '160px' }}>{circular.title}</td>
                  <td>
                    <span className={`badge ${getTypeBadgeClass(circular.type)} px-2 py-1`}>
                      {circular.type.charAt(0).toUpperCase() + circular.type.slice(1)}
                    </span>
                  </td>
                  <td>{circular.department}</td>
                  <td>{circular.targetAudience.join(', ')}</td>
                  <td>
                    {userRole === 'admin' ? (
                      <select
                        value={circular.status}
                        onChange={(e) => handleStatusChange(circular._id, e.target.value)}
                        className="form-select form-select-sm"
                        style={{ minWidth: '120px', transition: 'all 0.3s ease' }}
                        aria-label={`Change status for ${circular.title}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="published">Published</option>
                      </select>
                    ) : (
                      <span className={`badge ${getStatusBadgeClass(circular.status)}`}>
                        {circular.status.charAt(0).toUpperCase() + circular.status.slice(1)}
                      </span>
                    )}
                  </td>
                  <td>{new Date(circular.issueDate).toLocaleDateString()}</td>
                  <td>{circular.referenceId || '-'}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#previewModal"
                      onClick={() => setSelectedCircular(circular)}
                      aria-label={`Preview circular titled ${circular.title}`}
                    >
                      Preview
                    </button>

                    {userRole === 'admin' && (
                      <>
                        <button
                          className="btn btn-sm btn-outline-warning me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#editModal"
                          onClick={() => setEditingCircular(circular)}
                          aria-label={`Edit circular titled ${circular.title}`}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(circular._id)}
                          aria-label={`Delete circular titled ${circular.title}`}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal */}
      <div
        className="modal fade"
        id="previewModal"
        tabIndex="-1"
        aria-labelledby="previewModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content shadow rounded-3 border-0">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold text-primary" id="previewModalLabel">Circular Preview</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close preview modal"
              ></button>
            </div>
            <div className="modal-body px-4 pt-0 pb-4">
              {selectedCircular && <CircularPreview circular={selectedCircular} />}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content shadow rounded-3 border-0">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold text-primary" id="editModalLabel">Edit Circular</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close edit modal"
                onClick={() => setEditingCircular(null)}
              ></button>
            </div>
            <div className="modal-body px-4 pt-0 pb-4">
              {editingCircular && (
                <EditCircularForm
                  circular={editingCircular}
                  onCancel={() => setEditingCircular(null)}
                  onSave={(data) => {
                    handleSave(data);
                    document.querySelector('#editModal .btn-close').click();
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularList;