/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Row,
  Col,
  Modal,
} from 'react-bootstrap';
import { createProject, getAllProjects } from '../modules/api';

const Project = function ProjectComponent({
  userId,
  email,
  club,
  role,
  setCurrProject,
  setCurrProjectWithoutSpace,
}) {
  const [allProjects, setAllProjects] = useState([]);
  const [modalClick, setModalClick] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectAdded, setProjectAdded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getAllProjects(club).then((res) => {
      if (res.status === 200) {
        setAllProjects(res.jsonContent.result);
      }
    });
  }, [projectAdded]);

  const updateProjectName = ((e) => {
    setProjectName(e.target.value);
  });

  const openModal = () => {
    setModalClick(true);
  };

  const closeModal = () => {
    setModalClick(false);
  };

  const addProject = (() => {
    createProject(club, projectName, email, email).then((res) => {
      if (res.status === 201) {
        setProjectAdded(!projectAdded);
      } else {
        alert('Project already exists');
      }
    });
  });

  const goToManageProject = ((noSpaceProject, project) => {
    setCurrProjectWithoutSpace(noSpaceProject);
    setCurrProject(project);
    navigate(`/projects/manage-projects/${noSpaceProject}/${userId}`);
  });

  const modal = (() => (
    <Modal show={modalClick} onHide={() => closeModal()}>
      <Modal.Header closeButton>
        <Modal.Title>
          Create Project for
          {' '}
          {club}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input className="form-control" type="text" placeholder="Type in the project name" onChange={(e) => updateProjectName(e)} />
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-secondary mt-2" onClick={() => closeModal()}>
          Close
        </Button>
        <Button className="btn btn-primary mt-2" onClick={() => { addProject(); closeModal(); }}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  ));

  const displayProjects = (() => (
    allProjects.map((data) => {
      if (data.members.includes(email)) {
        return (
          <div className="club-item" key={data.projectName}>
            {/* referenced https://www.delftstack.com/howto/javascript/javascript-remove-spaces */}
            <Button className="club-button" onClick={() => goToManageProject(data.projectName.replace(/\s+/g, ''), data.projectName)}>
              <Row>
                <Col className="d-flex justify-content-center">
                  {data.projectName}
                </Col>
              </Row>
            </Button>
          </div>
        );
      }
      return null;
    })
  ));

  const createNewProjectButton = (() => (
    <div className="club-item">
      {/* referenced https://www.delftstack.com/howto/javascript/javascript-remove-spaces */}
      <Button className="club-button" onClick={() => openModal()}>
        <Row>
          <Col className="d-flex justify-content-center">
            Create new project
          </Col>
        </Row>
      </Button>
    </div>
  ));

  const msgNoProjects = (() => (
    <h4 className="text-center">
      {club}
      {' '}
      has no projects.
    </h4>
  ));

  const hasAtLeastOneProjectAssigned = (() => {
    for (let i = 0; i < allProjects.length; i += 1) {
      if (allProjects[i].members.includes(email)) {
        return true;
      }
    }
    return false;
  });

  const msgNoProjectsAssigned = (() => (
    <h3 className="text-center">
      You do not have any projects assigned for
      {' '}
      {club}
      !
    </h3>
  ));

  return (
    <div className="container" style={{ position: 'relative', padding: '20px' }}>
      {allProjects.length === 0 && msgNoProjects()}
      {(role === 'master' || role === 'admin') && createNewProjectButton()}
      {allProjects.length !== 0 && displayProjects()}
      {!hasAtLeastOneProjectAssigned() && msgNoProjectsAssigned()}
      {modalClick && (modal())}
    </div>
  );
};

export default Project;
