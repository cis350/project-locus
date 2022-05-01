import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Row,
  Col,
} from 'react-bootstrap';

import { getUserClubs } from '../modules/api';

const ProjectClubList = function ProjectClubList({
  userId,
  email,
  setCurrClubWithoutSpace,
  setCurrClub,
  setCurrClubRole,
}) {
  const [allClubs, setAllClubs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUserClubs(email).then((res) => {
      if (res.status === 200) {
        setAllClubs(res.jsonContent);
      }
    });
  }, []);

  const onClubClick = ((noSpaceClub, club, role) => {
    setCurrClubWithoutSpace(noSpaceClub);
    setCurrClub(club);
    setCurrClubRole(role);
    navigate(`/projects/allprojects/${noSpaceClub}/${userId}`);
  });

  const displayClubs = (() => (
    allClubs.map((data) => (
      <div className="club-item" key={data.clubName}>
        {/* referenced https://www.delftstack.com/howto/javascript/javascript-remove-spaces */}
        <Button className="club-button" onClick={() => onClubClick(data.clubName.replace(/\s+/g, ''), data.clubName, data.role)}>
          <Row>
            <Col className="d-flex justify-content-center">
              {data.clubName}
            </Col>
            <Col className="d-flex justify-content-center">
              Role: &nbsp;
              {data.role}
            </Col>
          </Row>
        </Button>
      </div>
    ))
  ));

  const msgUserInNoClubs = (() => (
    <h4 className="text-center">
      You are in no clubs.
    </h4>
  ));

  return (
    <div className="container" style={{ position: 'relative', padding: '20px' }}>
      <h1 className="text-center">Your Clubs</h1>
      {allClubs.length !== 0 && displayClubs()}
      {allClubs.length === 0 && msgUserInNoClubs()}
    </div>
  );
};

export default ProjectClubList;
