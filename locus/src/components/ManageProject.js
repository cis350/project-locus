/* eslint-disable no-alert */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Form,
  Alert,
  Row,
  Col,
  Modal,
} from 'react-bootstrap';
import {
  getProject,
  getSpecificClub,
  addUserToProject,
  removeMemberFromProject,
  getTasksForProject,
  updateStatusForCurrTask,
} from '../modules/api';

const ManageProject = function ManageProjectComponent({
  email,
  userId,
  club,
  project,
  role,
  currProjectWithoutSpace,
}) {
  const [currMembers, setCurrMembers] = useState([]);
  const [clubMembers, setClubMembers] = useState([]);
  const [userNotInClub, setUserNotInClub] = useState(false);
  const [userAlreadyInProject, setUserAlreadyInProject] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [rerender, setRerender] = useState(false);
  const [allTasksForNonMaster, setAllTasksForNonMaster] = useState([]);
  const [modalClickTask, setModalClickTask] = useState(false);
  const [currTask, setCurrTask] = useState('');
  const [currTaskId, setCurrTaskId] = useState('');
  const [currStatus, setCurrStatus] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    getProject(club, project).then((res1) => {
      if (res1.status === 200) {
        const userList = res1.jsonContent.result.members;
        const leaderData = res1.jsonContent.result.leaderEmail;
        setCurrMembers(userList);
        setLeaderEmail(leaderData);
      }
    });
    getSpecificClub(club).then((res2) => {
      if (res2.status === 200) {
        const currClubMembers = res2.jsonContent.members;
        setClubMembers(currClubMembers);
      }
    });
    getTasksForProject(project, club, email).then((res) => {
      if (res.status === 200) {
        setAllTasksForNonMaster(res.jsonContent);
      }
    });
  }, [rerender]);

  const openTaskModal = (task, id, status) => {
    setModalClickTask(true);
    setCurrTask(task);
    setCurrTaskId(id);
    setCurrStatus(status);
  };

  const closeTaskModal = () => {
    setModalClickTask(false);
  };

  const deleteUser = ((data) => {
    if (data === email) {
      alert('You cannot remove yourself from the project!');
    } else {
      removeMemberFromProject(project, club, email, data, leaderEmail).then((res) => {
        if (res.status === 200) {
          setRerender(!rerender);
        } else {
          alert('You cannot remove the leader!');
        }
      });
    }
  });

  const viewAnalytics = (() => {
    navigate(`/projects/manage-projects/${currProjectWithoutSpace}/analytics/${userId}`);
  });

  const manageTasks = (() => {
    navigate(`/projects/manage-projects/${currProjectWithoutSpace}/managetasks/${userId}`);
  });

  const usersInTable = (() => (
    currMembers.map((data) => (
      <li style={{ listStyleType: 'none', width: '15rem' }} key={data}>
        <div className="row">
          <div className="col-8">
            {data}
          </div>
          <div className="col-4">
            <Button
              style={{
                backgroundColor: '#9C0000',
                width: '60px',
                height: '25px',
                fontWeight: 'bold',
                fontSize: '8px',
                color: 'black',
                borderColor: '#9C0000',
                borderRadius: '20px',
                marginTop: '5px',
                marginRight: '30px',
                marginLeft: '20px',
              }}
              onClick={() => deleteUser(data)}
            >
              Remove
            </Button>
          </div>
        </div>
      </li>
    ))
  ));

  const errorMsgUserDoesNotExist = (() => (
    // referenced https://react-bootstrap.github.io/components/alerts/
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      User was not found in the club
    </Alert>
  ));

  const errorMsgUserAlreadyInProject = (() => (
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      User already in project.
    </Alert>
  ));

  const updateMemberEmail = ((e) => {
    setMemberEmail(e.target.value);
  });

  const checkUserInClub = (inputEmail) => clubMembers.includes(inputEmail);

  const processUserEmail = (() => {
    if (!checkUserInClub(memberEmail)) {
      setUserAlreadyInProject(false);
      setUserNotInClub(true);
    } else if (currMembers.includes(memberEmail)) {
      setUserAlreadyInProject(true);
      setUserNotInClub(false);
    } else {
      addUserToProject(club, email, memberEmail, project).then((res) => {
        if (res.status === 201) {
          setRerender(!rerender);
        }
      });
      setUserAlreadyInProject(false);
      setUserNotInClub(false);
    }
  });

  const masterView = (() => (
    <div className="row">
      <div className="col-sm">
        <Card style={{
          width: '23rem',
          height: '27rem',
          margin: 'auto',
          marginTop: '20px',
          borderRadius: '10px',
          backgroundColor: '#B5E48C',
          borderColor: '#B5E48C',
        }}
        >
          <Card.Body>
            {/* referenced https://react-bootstrap.github.io/forms/overview/ */}
            <h5 className="text-center">Members</h5>
            <div style={{ overflow: 'hidden', overflowY: 'scroll' }}>
              <ul style={{ height: '310px' }}>
                {usersInTable()}
              </ul>
            </div>

            <div className="row">
              <div className="col-8">
                <Form.Control style={{ marginTop: '10px', height: '25px' }} type="name" onChange={(e) => updateMemberEmail(e)} />
              </div>
              <div className="col-4">
                <Button
                  style={{
                    backgroundColor: '#6A9B72',
                    width: '100px',
                    height: '25px',
                    fontWeight: 'bold',
                    fontSize: '8px',
                    color: 'black',
                    borderColor: '#6A9B72',
                    marginTop: '10px',
                  }}
                  onClick={() => processUserEmail()}
                >
                  Add Member
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
        {userNotInClub && errorMsgUserDoesNotExist()}
        {userAlreadyInProject && errorMsgUserAlreadyInProject()}
      </div>
      <div className="col-sm" style={{ marginTop: '120px' }}>
        <div style={{ height: '70px', width: '23rem', margin: 'auto' }}>
          <Button
            style={{
              backgroundColor: '#52B69A',
              width: '300px',
              height: '35px',
              fontWeight: 'bold',
              fontSize: '15px',
              color: 'black',
              borderColor: '#52B69A',
              marginTop: '10px',
            }}
            onClick={() => viewAnalytics()}
          >
            View Analytics
          </Button>
        </div>
        <div style={{ height: '70px', width: '23rem', margin: 'auto' }}>
          <Button
            style={{
              backgroundColor: '#52B69A',
              width: '300px',
              height: '35px',
              fontWeight: 'bold',
              fontSize: '15px',
              color: 'black',
              borderColor: '#52B69A',
              marginTop: '10px',
            }}
            onClick={() => manageTasks()}
          >
            Manage Tasks
          </Button>
        </div>
      </div>
    </div>
  ));

  const updateStatus = (() => {
    setUpdatedStatus('');
  });

  const updateStatusState = ((e) => {
    setUpdatedStatus(e.target.value);
  });

  const updateStatusForTask = (() => {
    updateStatusForCurrTask(currTaskId, club, project, email, updatedStatus).then((res) => {
      if (res.status === 200) {
        setRerender(!rerender);
      }
    });
  });

  const taskModal = (() => (
    <Modal show={modalClickTask} onHide={() => closeTaskModal()}>
      <Modal.Header closeButton>
        <Modal.Title>
          Update status for
          {' '}
          {currTask}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Current status:
        {' '}
        {currStatus}
        <div className="form-check">
          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="radio1" value="incomplete" onChange={(e) => updateStatusState(e)} />
          <label className="form-check-label" htmlFor="inlineRadio1">Incomplete</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="radio2" value="done" onChange={(e) => updateStatusState(e)} />
          <label className="form-check-label" htmlFor="inlineRadio2">Done</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="radio2" value="need help" onChange={(e) => updateStatusState(e)} />
          <label className="form-check-label" htmlFor="inlineRadio2">Need help</label>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-secondary mt-2" onClick={() => closeTaskModal()}>
          Close
        </Button>
        <Button className="btn btn-primary mt-2" onClick={() => { updateStatus(); updatedStatus !== '' ? updateStatusForTask() : alert('please select an option'); closeTaskModal(); }}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  ));

  const displayTasksForNonMaster = (() => (
    allTasksForNonMaster.map((data) => {
      if (data.assignedTo === email) {
        return (
          <div className="club-item" key={data._id}>
            {/* referenced https://www.delftstack.com/howto/javascript/javascript-remove-spaces */}
            <Button className="club-button" onClick={() => openTaskModal(data.taskName, data._id, data.status)}>
              <Row>
                <Col className="d-flex justify-content-center">
                  {data.taskName}
                  {' '}
                  (Status:
                  {' '}
                  {data.status}
                  )
                </Col>
              </Row>
            </Button>
          </div>
        );
      }
      return null;
    })
  ));

  const hasAtLeastOneProjectAssigned = (() => {
    for (let i = 0; i < allTasksForNonMaster.length; i += 1) {
      if (allTasksForNonMaster[i].assignedTo === email) {
        return true;
      }
    }
    return false;
  });

  const msgNoTasks = (() => (
    <h3 className="text-center">
      You do not have any tasks assigned for
      {' '}
      {project}
      !
    </h3>
  ));

  return (
    <div className="container" style={{ position: 'relative', padding: '20px' }}>
      <h1 className="text-center">
        {project}
      </h1>
      {(role === 'master' || role === 'admin') && masterView()}
      {(role !== 'master' && role !== 'admin') && hasAtLeastOneProjectAssigned() && displayTasksForNonMaster()}
      {(role !== 'master' && role !== 'admin') && !hasAtLeastOneProjectAssigned() && msgNoTasks()}
      {modalClickTask && taskModal()}
    </div>
  );
};

export default ManageProject;
