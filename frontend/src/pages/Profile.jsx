
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="profile-container">
        <p className="login-message">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>
      <div className="profile-card">
        <table className="profile-table">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{user.name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>{user.role}</td>
            </tr>
            {/* Add more fields as per your user object */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;

const styles = `
  .profile-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .profile-title {
    color: #333;
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .profile-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .profile-table {
    width: 100%;
    border-collapse: collapse;
  }

  .profile-table th,
  .profile-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
  }

  .profile-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
    width: 30%;
  }

  .profile-table td {
    color:rgb(18, 19, 20);
  }

  .profile-table tr:last-child th,
  .profile-table tr:last-child td {
    border-bottom: none;
  }

  .login-message {
    text-align: center;
    color: #6c757d;
    font-size: 1.1rem;
    margin-top: 3rem;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}