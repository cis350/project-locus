import React from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';

const Home = function HomeComponent({ userEmail, setIsLoggedIn }) {
  const navigate = useNavigate();

  function handleLogout() {
    setIsLoggedIn(false);
    navigate('/');
  }
  return (
    <div>
      <Profile userEmail={userEmail} />
      <div className="d-flex justify-content-center align-content-center ">
        <button
          type="button"
          className="btn btn-danger"
          style={{ textAlign: 'center' }}
          onClick={() => handleLogout()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
