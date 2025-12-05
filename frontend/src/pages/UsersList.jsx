import React, { useEffect, useState } from 'react';
import userService from '../services/userService';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getUsers();
        setUsers(res.data);
        setFilteredUsers(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="badge bg-danger text-uppercase">{role}</span>;
      case 'faculty':
        return <span className="badge bg-primary text-uppercase">{role}</span>;
      case 'student':
        return <span className="badge bg-success text-uppercase">{role}</span>;
      default:
        return <span className="badge bg-secondary">{role}</span>;
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow rounded-4">
        <div className="card-header bg-dark text-white d-flex align-items-center justify-content-between">
          <h4 className="mb-0">
            <i className="bi bi-people-fill me-2"></i>All Users
          </h4>
          <span className="badge bg-light text-dark">
            {filteredUsers.length} of {users.length} users
          </span>
        </div>
        <div className="card-body">
          {/* Search Bar */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, role, or department..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={clearSearch}
                    title="Clear search"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          {loading && <p>Loading users...</p>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && users.length === 0 && !error && (
            <p className="text-muted">No users found.</p>
          )}

          {!loading && users.length > 0 && filteredUsers.length === 0 && searchTerm && (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              No users found matching "{searchTerm}". Try a different search term.
            </div>
          )}

          {!loading && filteredUsers.length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Department</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{user.department || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;