import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Navbar
import AppNavbar from './components/Navbar';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import PostJob from './pages/PostJob';
import MyApplications from './pages/MyApplications';
import MyPostedJobs from './pages/MyPostedJobs';

function App() {
  return (
    <Router>
      <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white' }}>
        <AppNavbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/post-job" element={<PostJob />} />
          
          {/* My Posted Jobs (Recruiter Dashboard) */}
          <Route path="/my-jobs" element={<MyPostedJobs />} />
          <Route path="/my-posted-jobs" element={<MyPostedJobs />} />
          
          {/* My Applications (Seeker) */}
          <Route path="/my-applications" element={<MyApplications />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;