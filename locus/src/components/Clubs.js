import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import '../assets/Clubs.css';

function Clubs(props) {
  // need to render buttons with club mapping (use json)
  // map JSON array to button map
  return (
    <div>
      <h1 className="club-header">
        Which Club Needs Work?
      </h1>
      <div className="club-table">
        <Button className="club-button">
          <ul className="club-button-info">
            <li className="club-button-info-item">Club 1</li>
            <li className="club-button-info-item">Master: James</li>
            <li className="club-button-info-item">Settings</li>
          </ul>
        </Button>
        <br />
        <Button className="club-button">
          <ul className="club-button-info">
            <li className="club-button-info-item">Club 2</li>
            <li className="club-button-info-item">Master: Dustin</li>
            <li className="club-button-info-item">Settings</li>
          </ul>
        </Button>
      </div>
    </div>
  );
}

export default Clubs;
