/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaDonate, FaImages, FaVideo, FaChartLine, FaSignOutAlt,FaFileAlt,FaTrash,FaCheck,FaTimes} from 'react-icons/fa';
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function AdminDashboard() {
  const isMobile = window.innerWidth <= 768;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [donations, setDonations] = useState([]);
  const [media, setMedia] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({totalDonations: 0,recentDonations: 0, mediaCount: 0, userCount: 0});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Container styles
  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  };

  // Sidebar styles
  const sidebarStyle = {
    width: isMobile ? '100%' : '250px',
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: isMobile ? 'none' : '2px 0 10px rgba(0,0,0,0.1)'
  };

  // Logo styles
  const logoStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    fontSize: '1.5rem',
    fontWeight: '600'
  };

  // Nav styles
  const navStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column',
    gap: '0.5rem',
    flex: 1,
    marginTop: '1rem',
    overflowX: isMobile ? 'auto' : 'visible',
    paddingBottom: isMobile ? '0.5rem' : '0'
  };

  // Nav button styles
  const navButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    color: 'rgba(255,255,255,0.8)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap'
  };

  const activeNavButtonStyle = {
    ...navButtonStyle,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    fontWeight: '500'
  };

  // Icon styles
  const iconStyle = {
    fontSize: '1.1rem'
  };

  // Logout button styles
  const logoutButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: 'auto',
    transition: 'all 0.2s ease'
  };

  // Main content styles
  const mainContentStyle = {
    flex: 1,
    padding: isMobile ? '1rem' : '2rem',
    backgroundColor: 'white',
    overflowY: 'auto'
  };

  // Loading spinner styles
  const loadingSpinnerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    color: '#7f8c8d'
  };

  // Error message styles
  const errorMessageStyle = {
    color: '#e74c3c',
    backgroundColor: '#f8d7da',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.9rem'
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/admin-login');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [donationsRes, mediaRes, usersRes] = await Promise.all([
          fetch('https://asremenaapp.onrender.com/api/admin/donations',
             { headers }
            ),  
            fetch('https://asremenaapp.onrender.com/api/admin/media',
             { headers }
            ), 
             fetch('https://asremenaapp.onrender.com/api/admin/users',
             { headers }
            ),
          // fetch(`${API_BASE_URL}/Admin/media`,
          //   //  { headers }

          // ),
          // fetch(`${API_BASE_URL}/admin/users`, 
          //   // { headers }
          // )
        ]);

        if (!donationsRes.ok || !mediaRes.ok || !usersRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const donationsData = await donationsRes.json();
        const mediaData = await mediaRes.json();
        const usersData = await usersRes.json();

        setDonations(donationsData);
        setMedia(mediaData);
        setUsers(usersData);

        setStats({
          totalDonations: donationsData.reduce((sum, d) => sum + d.amount, 0),
          recentDonations: donationsData.slice(0, 5).reduce((sum, d) => sum + d.amount, 0),
          mediaCount: mediaData.length,
          userCount: usersData.length
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        if (err.message.includes('Unauthorized')) {
          localStorage.removeItem('adminToken');
          navigate('/admin-login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    // localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const renderContent = () => {
    if (loading) return <div style={loadingSpinnerStyle}>Loading...</div>;
    if (error) return <div style={errorMessageStyle}>{error}</div>;

    switch(activeTab) {
      case 'donations':
        return <DonationsTab donations={donations} setDonations={setDonations} isMobile={isMobile} />;
      case 'media':
        return <MediaTab media={media} setMedia={setMedia} isMobile={isMobile} />;
      case 'users':
        return <UsersTab users={users} setUsers={setUsers} isMobile={isMobile} />;
      case 'analytics':
        return <AnalyticsTab stats={stats} donations={donations} isMobile={isMobile} />;
      default:
        return <DashboardOverview stats={stats} donations={donations} media={media} isMobile={isMobile} />;
    }
  };

  return (
    <div style={containerStyle}>
      <aside style={sidebarStyle}>
        <h2 style={logoStyle}>Admin Dashboard</h2>
        
        <nav style={navStyle}>
          <button 
            style={activeTab === 'dashboard' ? activeNavButtonStyle : navButtonStyle}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaChartLine style={iconStyle} /> Dashboard
          </button>
          
          <button 
            style={activeTab === 'donations' ? activeNavButtonStyle : navButtonStyle}
            onClick={() => setActiveTab('donations')}
          >
            <FaDonate style={iconStyle} /> Donations
          </button>
          
          <button 
            style={activeTab === 'media' ? activeNavButtonStyle : navButtonStyle}
            onClick={() => setActiveTab('media')}
          >
            <FaImages style={iconStyle} /> Media
          </button>
          
          <button 
            style={activeTab === 'users' ? activeNavButtonStyle : navButtonStyle}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers style={iconStyle} /> Users
          </button>

          <button 
            style={activeTab === 'analytics' ? activeNavButtonStyle : navButtonStyle}
            onClick={() => setActiveTab('analytics')}
          >
            <FaChartLine style={iconStyle} /> Analytics
          </button>
        </nav>
        
        <button style={logoutButtonStyle} onClick={handleLogout}>
          <FaSignOutAlt style={iconStyle} /> Logout
        </button>
      </aside>
      
      <main style={mainContentStyle}>
        {renderContent()}
      </main>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview({ stats, donations, media, isMobile }) {
  // Styles
  const overviewStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  };

  const statCardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    border: '1px solid #eee'
  };

  const statValueStyle = {
    fontSize: '1.8rem',
    fontWeight: '600',
    margin: '0.5rem 0 0',
    color: '#2c3e50'
  };

  const sectionStyle = {
    marginBottom: '3rem',
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    border: '1px solid #eee'
  };

  return (
    <div style={overviewStyle}>
      <h2>Dashboard Overview</h2>
      
      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <h3>Total Donations</h3>
          <p style={statValueStyle}>${stats.totalDonations.toLocaleString()}</p>
        </div>
        
        <div style={statCardStyle}>
          <h3>Recent Donations</h3>
          <p style={statValueStyle}>${stats.recentDonations.toLocaleString()}</p>
        </div>
        
        <div style={statCardStyle}>
          <h3>Media Items</h3>
          <p style={statValueStyle}>{stats.mediaCount}</p>
        </div>

        <div style={statCardStyle}>
          <h3>Registered Users</h3>
          <p style={statValueStyle}>{stats.userCount}</p>
        </div>
      </div>
      
      <div style={sectionStyle}>
        <h3>Recent Donations</h3>
        <DonationsTable donations={donations.slice(0, 5)} isMobile={isMobile} />
      </div>
      
      <div style={sectionStyle}>
        <h3>Recent Media</h3>
        <MediaGrid media={media.slice(0, 4)} isMobile={isMobile} />
      </div>
    </div>
  );
}

// Donations Tab Component
function DonationsTab({ donations, setDonations, isMobile }) {
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Styles
  const tabStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const filterBarStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap'
  };

  const filterButtonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s'
  };

  const activeFilterStyle = {
    ...filterButtonStyle,
    backgroundColor: '#2c3e50',
    color: 'white',
    borderColor: '#2c3e50'
  };

  const tableContainerStyle = {
    overflowX: 'auto',
    margin: '1rem 0',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    fontSize: '0.9rem'
  };

  const thStyle = {
    backgroundColor: '#f8f9fa',
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontWeight: '500',
    color: '#555',
    borderBottom: '1px solid #eee'
  };

  const tdStyle = {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #eee',
    verticalAlign: 'top'
  };

  const trHoverStyle = {
    '&:hover td': {
      backgroundColor: '#f8f9fa'
    }
  };

  const statusBadgeStyle = (status) => ({
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '500',
    textTransform: 'capitalize',
    backgroundColor: 
      status === 'completed' ? '#d4edda' : 
      status === 'pending' ? '#fff3cd' : 
      status === 'failed' ? '#f8d7da' : '#e2e3e5',
    color: 
      status === 'completed' ? '#155724' : 
      status === 'pending' ? '#856404' : 
      status === 'failed' ? '#721c24' : '#383d41'
  });

  const actionButtonsStyle = {
    display: 'flex',
    gap: '0.5rem'
  };

  const actionButtonStyle = {
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem'
  };

  const successButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#d4edda',
    color: '#155724',
    '&:hover': {
      backgroundColor: '#c3e6cb'
    }
  };

  const dangerButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#f8d7da',
    color: '#721c24',
    '&:hover': {
      backgroundColor: '#f5c6cb'
    }
  };

  const statsCardStyle = {
    backgroundColor: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    marginTop: '2rem'
  };

  const summaryGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  };

  const summaryValueStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2c3e50'
  };

  const updateStatus = async (id, status) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const res = await fetch(`https://asremenaapp.onrender.com/api/admin/donations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (!res.ok) throw new Error('Failed to update donation');
      
      const updated = await res.json();
      setDonations(donations.map(d => d._id === updated._id ? updated : d));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter(d => 
    filter === 'all' || d.status === filter
  );

  return (
    <div style={tabStyle}>
      <h2>Donation Management</h2>
      
      <div style={filterBarStyle}>
        {['all', 'pending', 'completed', 'failed'].map(f => (
          <button
            key={f}
            style={filter === f ? activeFilterStyle : filterButtonStyle}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      
      {error && <div style={errorMessageStyle}>{error}</div>}
      
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Donor</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Method</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map(donation => (
              <tr key={donation._id} style={trHoverStyle}>
                <td style={tdStyle}>
                  <div>{donation.name || 'Anonymous'}</div>
                  {donation.email && <small>{donation.email}</small>}
                </td>
                <td style={tdStyle}>${donation.amount.toLocaleString()}</td>
                <td style={tdStyle}>{new Date(donation.createdAt).toLocaleDateString()}</td>
                <td style={tdStyle}>{donation.method || 'N/A'}</td>
                <td style={tdStyle}>
                  <span style={statusBadgeStyle(donation.status)}>
                    {donation.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  {donation.status === 'pending' && (
                    <div style={actionButtonsStyle}>
                      <button 
                        onClick={() => updateStatus(donation._id, 'completed')}
                        style={successButtonStyle}
                        disabled={loading}
                      >
                        <FaCheck /> Complete
                      </button>
                      <button 
                        onClick={() => updateStatus(donation._id, 'failed')}
                        style={dangerButtonStyle}
                        disabled={loading}
                      >
                        <FaTimes /> Fail
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={statsCardStyle}>
        <h3>Donation Summary</h3>
        <div style={summaryGridStyle}>
          <div>
            <div>Total Donations</div>
            <div style={summaryValueStyle}>
              ${donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
            </div>
          </div>
          <div>
            <div>Completed</div>
            <div style={summaryValueStyle}>
              {donations.filter(d => d.status === 'completed').length}
            </div>
          </div>
          <div>
            <div>Pending</div>
            <div style={summaryValueStyle}>
              {donations.filter(d => d.status === 'pending').length}
            </div>
          </div>
          <div>
            <div>Failed</div>
            <div style={summaryValueStyle}>
              {donations.filter(d => d.status === 'failed').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Media Tab Component
function MediaTab({ media, setMedia, isMobile }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Styles
  const tabStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const uploadFormStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    border: '1px solid #eee',
    marginBottom: '2rem'
  };

  const formGroupStyle = {
    marginBottom: '1rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#555'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.6rem 0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical'
  };

  const primaryButtonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#2980b9'
    },
    '&:disabled': {
      backgroundColor: '#bdc3c7',
      cursor: 'not-allowed'
    }
  };

  const mediaSectionStyle = {
    marginTop: '2rem'
  };

  const mediaGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem'
  };

  const mediaCardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    border: '1px solid #eee',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }
  };

  const mediaThumbnailStyle = {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderBottom: '1px solid #eee'
  };

  const placeholderStyle = {
    width: '100%',
    height: '180px',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#7f8c8d',
    borderBottom: '1px solid #eee'
  };

  const mediaInfoStyle = {
    padding: '1rem'
  };

  const mediaMetaStyle = {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.8rem',
    color: '#95a5a6',
    marginBottom: '1rem'
  };

  const dangerButtonStyle = {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    '&:hover': {
      backgroundColor: '#c0392b'
    },
    '&:disabled': {
      backgroundColor: '#bdc3c7',
      cursor: 'not-allowed'
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const file = formData.get('file');

    if (!title || !file) {
      setUploadError('Title and file are required');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError('');
      const token = localStorage.getItem('adminToken');
      
      const res = await fetch('https://asremenaapp.onrender.com/api/admin/media', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const newMedia = await res.json();
      setMedia([newMedia, ...media]);
      e.target.reset();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const res = await fetch(`https://asremenaapp.onrender.com/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to delete media');
      
      setMedia(media.filter(item => item._id !== id));
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={tabStyle}>
      <h2>Media Management</h2>
      
      <div style={uploadFormStyle}>
        <h3>Upload New Media</h3>
        {uploadError && <div style={errorMessageStyle}>{uploadError}</div>}
        <form onSubmit={handleUpload}>
          <div style={formGroupStyle}>
            <label htmlFor="title" style={labelStyle}>Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              style={inputStyle}
              required
            />
          </div>
          
          <div style={formGroupStyle}>
            <label htmlFor="description" style={labelStyle}>Description (optional):</label>
            <textarea
              id="description"
              name="description"
              style={textareaStyle}
            />
          </div>
          
          <div style={formGroupStyle}>
            <label htmlFor="file" style={labelStyle}>File:</label>
            <input
              type="file"
              id="file"
              name="file"
              style={inputStyle}
              required
            />
          </div>
          
          <button type="submit" disabled={isUploading} style={primaryButtonStyle}>
            {isUploading ? 'Uploading...' : 'Upload Media'}
          </button>
        </form>
      </div>
      
      <div style={mediaSectionStyle}>
        <h3>All Media ({media.length})</h3>
        <div style={mediaGridStyle}>
          {media.map(item => (
            <div key={item._id} style={mediaCardStyle}>
              {item.type === 'image' ? (
                <img 
                  src={`https://asremenaapp.onrender.com/api/admin${item.url}`} 
                  alt={item.title} 
                  style={mediaThumbnailStyle}
                />
              ) : item.type === 'video' ? (
                <div style={placeholderStyle}>
                  <FaVideo size={48} />
                </div>
              ) : (
                <div style={placeholderStyle}>
                  <FaFileAlt size={48} />
                </div>
              )}
              
              <div style={mediaInfoStyle}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <div style={mediaMetaStyle}>
                  <span>{item.type}</span>
                  <span>{(item.size / 1024).toFixed(1)} KB</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                
                <button 
                  onClick={() => handleDelete(item._id)}
                  style={dangerButtonStyle}
                  disabled={deleteLoading}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Users Tab Component
function UsersTab({ users, setUsers, isMobile }) {
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'editor'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Styles
  const tabStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const userFormStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    border: '1px solid #eee',
    marginBottom: '2rem'
  };

  const formGroupStyle = {
    marginBottom: '1rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#555'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.6rem 0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem'
  };

  const selectStyle = {
    ...inputStyle
  };

  const primaryButtonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#2980b9'
    },
    '&:disabled': {
      backgroundColor: '#bdc3c7',
      cursor: 'not-allowed'
    }
  };

  const usersListStyle = {
    marginTop: '2rem'
  };

  const tableContainerStyle = {
    overflowX: 'auto',
    margin: '1rem 0',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    fontSize: '0.9rem'
  };

  const thStyle = {
    backgroundColor: '#f8f9fa',
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontWeight: '500',
    color: '#555',
    borderBottom: '1px solid #eee'
  };

  const tdStyle = {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #eee',
    verticalAlign: 'top'
  };

  const trHoverStyle = {
    '&:hover td': {
      backgroundColor: '#f8f9fa'
    }
  };

  const roleBadgeStyle = (role) => ({
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '500',
    textTransform: 'capitalize',
    backgroundColor: role === 'admin' ? '#d1ecf1' : '#e2e3e5',
    color: role === 'admin' ? '#0c5460' : '#383d41'
  });

  const dangerButtonStyle = {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    '&:hover': {
      backgroundColor: '#c0392b'
    },
    '&:disabled': {
      backgroundColor: '#bdc3c7',
      cursor: 'not-allowed'
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('adminToken');
      
      const res = await fetch('https://asremenaapp.onrender.com/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      const data = await res.json();
      setUsers([...users, data]);
      setNewUser({
        username: '',
        password: '',
        role: 'editor'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const res = await fetch(`https://asremenaapp.onrender.com/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to delete user');
      
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={tabStyle}>
      <h2>User Management</h2>
      
      <div style={userFormStyle}>
        <h3>Create New User</h3>
        {error && <div style={errorMessageStyle}>{error}</div>}
        <form onSubmit={handleCreateUser}>
          <div style={formGroupStyle}>
            <label htmlFor="username" style={labelStyle}>Username:</label>
            <input
              type="text"
              id="username"
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={formGroupStyle}>
            <label htmlFor="password" style={labelStyle}>Password:</label>
            <input
              type="password"
              id="password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={formGroupStyle}>
            <label htmlFor="role" style={labelStyle}>Role:</label>
            <select
              id="role"
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              style={selectStyle}
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button type="submit" disabled={loading} style={primaryButtonStyle}>
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
      
      <div style={usersListStyle}>
        <h3>All Users ({users.length})</h3>
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Created</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={trHoverStyle}>
                  <td style={tdStyle}>{user.username}</td>
                  <td style={tdStyle}>
                    <span style={roleBadgeStyle(user.role)}>
                      {user.role}
                    </span>
                  </td>
                  <td style={tdStyle}>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    <button 
                      onClick={() => deleteUser(user._id)}
                      disabled={loading || user.role === 'admin'}
                      style={dangerButtonStyle}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab({ stats, donations, isMobile }) {
  // Styles
  const tabStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  };

  const statCardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    border: '1px solid #eee'
  };

  const statValueStyle = {
    fontSize: '1.8rem',
    fontWeight: '600',
    margin: '0.5rem 0 0',
    color: '#2c3e50'
  };

  const chartContainerStyle = {
    backgroundColor: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    marginTop: '2rem'
  };

  const chartPlaceholderStyle = {
    height: '300px',
    backgroundColor: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    marginTop: '1rem'
  };

  const summaryGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  };

  const summaryValueStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2c3e50'
  };

  return (
    <div style={tabStyle}>
      <h2>Analytics Dashboard</h2>
      
      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <h3>Total Donations</h3>
          <p style={statValueStyle}>${stats.totalDonations.toLocaleString()}</p>
        </div>
        
        <div style={statCardStyle}>
          <h3>Monthly Donations</h3>
          <p style={statValueStyle}>${
            donations
              .filter(d => new Date(d.createdAt) > new Date(Date.now() - 30*24*60*60*1000))
              .reduce((sum, d) => sum + d.amount, 0)
              .toLocaleString()
          }</p>
        </div>
        
        <div style={statCardStyle}>
          <h3>Weekly Donations</h3>
          <p style={statValueStyle}>${
            donations
              .filter(d => new Date(d.createdAt) > new Date(Date.now() - 7*24*60*60*1000))
              .reduce((sum, d) => sum + d.amount, 0)
              .toLocaleString()
          }</p>
        </div>
      </div>
      
      <div style={chartContainerStyle}>
        <h3>Donations Over Time</h3>
        <div style={chartPlaceholderStyle}>
          {/* In a real app, you would use Chart.js or similar here */}
          <p>Chart visualization would appear here</p>
        </div>
      </div>
      
      <div style={statCardStyle}>
        <h3>Donation Sources</h3>
        <div style={summaryGridStyle}>
          {['Telebirr', 'CBE Birr', 'PayPal', 'Bank Transfer'].map(source => (
            <div key={source}>
              <div>{source}</div>
              <div style={summaryValueStyle}>
                {donations.filter(d => d.method === source).length}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Shared components
function DonationsTable({ donations, isMobile }) {
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    fontSize: '0.9rem'
  };

  const thStyle = {
    backgroundColor: '#f8f9fa',
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontWeight: '500',
    color: '#555',
    borderBottom: '1px solid #eee'
  };

  const tdStyle = {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #eee',
    verticalAlign: 'top'
  };

  const statusBadgeStyle = (status) => ({
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '500',
    backgroundColor: 
      status === 'completed' ? '#d4edda' : 
      status === 'pending' ? '#fff3cd' : 
      status === 'failed' ? '#f8d7da' : '#e2e3e5',
    color: 
      status === 'completed' ? '#155724' : 
      status === 'pending' ? '#856404' : 
      status === 'failed' ? '#721c24' : '#383d41'
  });

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>ID</th>
          <th style={thStyle}>Donor</th>
          <th style={thStyle}>Amount</th>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Method</th>
          <th style={thStyle}>Status</th>
        </tr>
      </thead>
      <tbody>
        {donations.map(donation => (
          <tr key={donation._id}>
            <td style={tdStyle}>{donation._id.slice(0, 8)}...</td>
            <td style={tdStyle}>{donation.name || 'Anonymous'}</td>
            <td style={tdStyle}>${donation.amount.toLocaleString()}</td>
            <td style={tdStyle}>{new Date(donation.createdAt).toLocaleDateString()}</td>
            <td style={tdStyle}>{donation.method || 'N/A'}</td>
            <td style={tdStyle}>
              <span style={statusBadgeStyle(donation.status)}>
                {donation.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MediaGrid({ media, isMobile }) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    border: '1px solid #eee'
  };

  const thumbnailStyle = {
    width: '100%',
    height: '180px',
    objectFit: 'cover'
  };

  const placeholderStyle = {
    width: '100%',
    height: '180px',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#7f8c8d'
  };

  const infoStyle = {
    padding: '1rem'
  };

  return (
    <div style={gridStyle}>
      {media.map(item => (
        <div key={item._id} style={cardStyle}>
          {item.type === 'image' ? (
            <img 
              src={`https://asremenaapp.onrender.com/api/admin${item.url}`} 
              alt={item.title} 
              style={thumbnailStyle}
            />
          ) : item.type === 'video' ? (
            <div style={placeholderStyle}>
              <FaVideo size={48} />
            </div>
          ) : (
            <div style={placeholderStyle}>
              <FaFileAlt size={48} />
            </div>
          )}
          
          <div style={infoStyle}>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <small>{new Date(item.createdAt).toLocaleDateString()}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

// Error message style (shared)
const errorMessageStyle = {
  color: '#e74c3c',
  backgroundColor: '#f8d7da',
  padding: '0.75rem 1rem',
  borderRadius: '4px',
  marginBottom: '1rem',
  fontSize: '0.9rem'
};

export default AdminDashboard;