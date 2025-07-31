import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaDonate, FaImages, FaVideo, FaChartLine, FaSignOutAlt } from 'react-icons/fa';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [donations, setDonations] = useState([]);
  const [media, setMedia] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    recentDonations: 0,
    mediaCount: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch dashboard data
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        const donationsRes = await fetch('/api/donations');
        const mediaRes = await fetch('/api/media');
        
        const donationsData = await donationsRes.json();
        const mediaData = await mediaRes.json();
        
        setDonations(donationsData.slice(0, 5));
        setMedia(mediaData.slice(0, 5));
        
        setStats({
          totalDonations: donationsData.reduce((sum, d) => sum + d.amount, 0),
          recentDonations: donationsData.slice(0, 5).reduce((sum, d) => sum + d.amount, 0),
          mediaCount: mediaData.length
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };
    
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'donations':
        return <DonationsTab donations={donations} />;
      case 'media':
        return <MediaTab media={media} />;
      case 'analytics':
        return <AnalyticsTab stats={stats} />;
      case 'users':
        return <UsersTab />;
      default:
        return <DashboardOverview stats={stats} donations={donations} media={media} />;
    }
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Menna Center Admin</h2>
        
        <nav style={styles.nav}>
          <button 
            style={activeTab === 'dashboard' ? styles.activeNavButton : styles.navButton}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaChartLine style={styles.icon} /> Dashboard
          </button>
          
          <button 
            style={activeTab === 'donations' ? styles.activeNavButton : styles.navButton}
            onClick={() => setActiveTab('donations')}
          >
            <FaDonate style={styles.icon} /> Donations
          </button>
          
          <button 
            style={activeTab === 'media' ? styles.activeNavButton : styles.navButton}
            onClick={() => setActiveTab('media')}
          >
            <FaImages style={styles.icon} /> Media
          </button>
          
          <button 
            style={activeTab === 'users' ? styles.activeNavButton : styles.navButton}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers style={styles.icon} /> Users
          </button>
        </nav>
        
        <button style={styles.logoutButton} onClick={handleLogout}>
          <FaSignOutAlt style={styles.icon} /> Logout
        </button>
      </aside>
      
      <main style={styles.mainContent}>
        {renderContent()}
      </main>
    </div>
  );
}

// Sub-components for each tab
function DashboardOverview({ stats, donations, media }) {
  return (
    <div>
      <h2>Dashboard Overview</h2>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>Total Donations</h3>
          <p style={styles.statValue}>${stats.totalDonations.toLocaleString()}</p>
        </div>
        
        <div style={styles.statCard}>
          <h3>Recent Donations (5)</h3>
          <p style={styles.statValue}>${stats.recentDonations.toLocaleString()}</p>
        </div>
        
        <div style={styles.statCard}>
          <h3>Media Items</h3>
          <p style={styles.statValue}>{stats.mediaCount}</p>
        </div>
      </div>
      
      <div style={styles.section}>
        <h3>Recent Donations</h3>
        <DonationsTable donations={donations} />
      </div>
      
      <div style={styles.section}>
        <h3>Recent Media</h3>
        <MediaGrid media={media} />
      </div>
    </div>
  );
}

function DonationsTab() {
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await fetch('/api/donations', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        const data = await res.json();
        setDonations(data);
      } catch (err) {
        setError('Failed to load donations');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDonations();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/donations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status })
      });
      
      const updated = await res.json();
      setDonations(donations.map(d => d._id === updated._id ? updated : d));
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to update donation status');
    }
  };

  const filteredDonations = donations.filter(d => 
    filter === 'all' || d.status === filter
  );

  if (isLoading) return <div>Loading donations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Donation Management</h2>
      
      <div style={styles.filterBar}>
        {['all', 'pending', 'completed', 'failed'].map(f => (
          <button
            key={f}
            style={filter === f ? styles.activeFilter : styles.filterButton}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Donor</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map(donation => (
              <tr key={donation._id}>
                <td>
                  <div>{donation.name || 'Anonymous'}</div>
                  {donation.email && <small>{donation.email}</small>}
                </td>
                <td>${donation.amount.toLocaleString()}</td>
                <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                <td>{donation.method || 'N/A'}</td>
                <td>
                  <span style={getStatusStyle(donation.status)}>
                    {donation.status}
                  </span>
                </td>
                <td>
                  {donation.status === 'pending' && (
                    <div style={styles.actionButtons}>
                      <button 
                        onClick={() => updateStatus(donation._id, 'completed')}
                        style={styles.completeButton}
                      >
                        Complete
                      </button>
                      <button 
                        onClick={() => updateStatus(donation._id, 'failed')}
                        style={styles.failButton}
                      >
                        Fail
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={styles.statsCard}>
        <h3>Donation Summary</h3>
        <div style={styles.summaryGrid}>
          <div>
            <div>Total Donations</div>
            <div style={styles.summaryValue}>
              ${donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
            </div>
          </div>
          <div>
            <div>Completed</div>
            <div style={styles.summaryValue}>
              {donations.filter(d => d.status === 'completed').length}
            </div>
          </div>
          <div>
            <div>Pending</div>
            <div style={styles.summaryValue}>
              {donations.filter(d => d.status === 'pending').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function AnalyticsTab({ stats }) {
  // In a real app, you would fetch more detailed analytics data
  return (
    <div>
      <h2>Analytics</h2>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>Total Donations</h3>
          <p style={styles.statValue}>${stats.totalDonations.toLocaleString()}</p>
        </div>
        
        <div style={styles.statCard}>
          <h3>Donations This Month</h3>
          <p style={styles.statValue}>$12,450</p>
        </div>
        
        <div style={styles.statCard}>
          <h3>Media Views</h3>
          <p style={styles.statValue}>3,245</p>
        </div>
      </div>
      
      <div style={styles.chartContainer}>
        <h3>Donations Over Time</h3>
        {/* In a real app, you would use a charting library here */}
        <div style={styles.placeholderChart}>
          [Chart would display here]
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'editor'
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(newUser)
      });
      
      const data = await res.json();
      setUsers([...users, data]);
      setNewUser({
        username: '',
        password: '',
        role: 'editor'
      });
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      
      <div style={styles.userForm}>
        <h3>Create New User</h3>
        <form onSubmit={handleCreateUser}>
          <div style={styles.formGroup}>
            <label>Username:</label>
            <input
              type="text"
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label>Password:</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label>Role:</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button type="submit">Create User</button>
        </form>
      </div>
      
      <div style={styles.usersList}>
        <h3>All Users</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <button 
                    onClick={() => deleteUser(user.id)}
                    disabled={user.role === 'admin'}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Shared components
function DonationsTable({ donations, onUpdateStatus }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Donor</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Method</th>
          <th>Status</th>
          {onUpdateStatus && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {donations.map(donation => (
          <tr key={donation.id}>
            <td>{donation.id.slice(0, 8)}...</td>
            <td>{donation.name || 'Anonymous'}</td>
            <td>${donation.amount.toLocaleString()}</td>
            <td>{new Date(donation.date).toLocaleDateString()}</td>
            <td>{donation.method}</td>
            <td>
              <span style={getStatusStyle(donation.status)}>
                {donation.status}
              </span>
            </td>
            {onUpdateStatus && (
              <td>
                {donation.status === 'pending' && (
                  <>
                    <button onClick={() => onUpdateStatus(donation.id, 'completed')}>
                      Complete
                    </button>
                    <button onClick={() => onUpdateStatus(donation.id, 'failed')}>
                      Fail
                    </button>
                  </>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MediaGrid({ media, onDelete, isAdminView = false }) {
  return (
    <div style={styles.mediaGrid}>
      {media.map(item => (
        <div key={item.id} style={styles.mediaCard}>
          {item.type === 'image' ? (
            <img 
              src={item.url} 
              alt={item.title} 
              style={styles.mediaThumbnail}
            />
          ) : (
            <div style={styles.videoPlaceholder}>
              <FaVideo size={48} />
            </div>
          )}
          
          <div style={styles.mediaInfo}>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <small>Uploaded: {new Date(item.createdAt).toLocaleDateString()}</small>
            
            {isAdminView && onDelete && (
              <button 
                onClick={() => onDelete(item.id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper functions
function getStatusStyle(status) {
  const styles = {
    padding: '4px 8px',
    borderRadius: '4px',
    color: 'white',
    fontWeight: 'bold'
  };
  
  switch(status) {
    case 'completed':
      return { ...styles, backgroundColor: '#4CAF50' };
    case 'pending':
      return { ...styles, backgroundColor: '#FFC107' };
    case 'failed':
      return { ...styles, backgroundColor: '#F44336' };
    default:
      return { ...styles, backgroundColor: '#9E9E9E' };
  }
}

// Styles
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#4B0082',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column'
  },
  logo: {
    textAlign: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255,255,255,0.2)'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '1rem'
  },
  activeNavButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '1rem'
  },
  icon: {
    fontSize: '1.2rem'
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: 'auto'
  },
  mainContent: {
    flex: 1,
    padding: '2rem',
    backgroundColor: 'white'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '0.5rem 0 0',
    color: '#4B0082'
  },
  section: {
    marginBottom: '2rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem'
  },
  tableTh: {
    backgroundColor: '#f2f2f2',
    padding: '0.75rem',
    textAlign: 'left'
  },
  tableTd: {
    padding: '0.75rem',
    borderBottom: '1px solid #ddd'
  },
  filterBar: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  filterButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f2f2f2',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  activeFilter: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4B0082',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  mediaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  mediaCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  mediaThumbnail: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  videoPlaceholder: {
    width: '100%',
    height: '200px',
    backgroundColor: '#f2f2f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666'
  },
  mediaInfo: {
    padding: '1rem'
  },
  uploadForm: {
    backgroundColor: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem'
  },
  userForm: {
    backgroundColor: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '0.5rem'
  },
  chartContainer: {
    backgroundColor: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    marginTop: '2rem'
  },
  placeholderChart: {
    height: '300px',
    backgroundColor: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    marginTop: '1rem'
  },
  
  tableContainer: {
    overflowX: 'auto',
    margin: '1rem 0',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  failButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  statsCard: {
    backgroundColor: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    marginTop: '2rem'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  summaryValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#4B0082'
  }

};

export default AdminDashboard;