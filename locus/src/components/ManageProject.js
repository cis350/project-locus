import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Form,
  Alert,
} from 'react-bootstrap';
import { checkIfEmailAlreadyExists, getUserFullName } from '../modules/storage';

const ManageProject = function ManageProjectComponent({ userId }) {
  const navigate = useNavigate();

  const [currMembers, setCurrMembers] = useState([]);
  const [currentMilestones, setCurrMilestones] = useState([]);
  const [currentTasks, setCurrTasks] = useState([]);
  const [attendance, checkAttendence] = useState(false);
  const [milestonesView, changeMilestonesView] = useState(false);
  const [userNotInClub, setUserNotInClub] = useState(false);
  const [userAlreadyInProject, setUserAlreadyInProject] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [rerender, setRerender] = useState(false);

  const poke = (() => {
    alert('poked!');
  });

  const createMilestone = (() => {
    alert('milestone created!');
  });

  const closeMilestone = (() => {
    alert('milestone closed!');
  });

  const assignTask = (() => {
    alert('task assigned!');
  });

  const completeTask = (() => {
    alert('task completed!');
  });

  const createTask = (() => {
    alert('task created!');
  });

  const deleteUser = (() => {
    alert('deleted!');
  });

  const takeAttendance = (() => {
    checkAttendence(!attendance);
  });

  const manageMilestonesAndTasks = (() => {
    changeMilestonesView(!milestonesView);
  });

  const viewAnalytics = (() => {
    navigate(`/projects/manage-projects/analytics/${userId}`);
  });

  const attendenceMembers = (() => (
    currMembers.map((data) => (
      <div className="form-check">
        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
        <label className="form-check-label" htmlFor="flexCheckDefault">
          {getUserFullName(data)}
        </label>
      </div>
    )))
  );

  const usersInTable = (() => (
    currMembers.map((data) => (
      <li style={{ listStyleType: 'none', width: '15rem' }} key={data}>
        <div className="row">
          <div className="col-6">
            {getUserFullName(data)}
          </div>
          <div className="col-3">
            <Button
              style={{
                backgroundColor: '#D9ED92',
                width: '60px',
                height: '25px',
                fontWeight: 'bold',
                fontSize: '8px',
                color: 'black',
                borderColor: '#D9ED92',
                borderRadius: '20px',
                marginTop: '5px',
                marginLeft: '20px',
              }}
              onClick={() => poke()}
            >
              Poke
            </Button>
          </div>
          <div className="col-3">
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
              onClick={() => deleteUser()}
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

  const errorMsgUserAlreadyInClub = (() => (
    <Alert variant="danger" style={{ width: '23rem', margin: 'auto', marginTop: '10px' }} className="text-center">
      User already in project.
    </Alert>
  ));

  const updateMemberEmail = ((e) => {
    setMemberEmail(e.target.value);
  });

  const processUserEmail = (() => {
    if (checkIfEmailAlreadyExists(memberEmail)) {
      setUserAlreadyInProject(false);
      setUserNotInClub(true);
    } else if (currMembers.includes(memberEmail)) {
      setUserAlreadyInProject(true);
      setUserNotInClub(false);
    } else {
      setUserAlreadyInProject(false);
      setUserNotInClub(false);
      setRerender(!rerender);
    }
  });

  const currMilestones = (() => currentMilestones.map((data) => (
    <div>
      <div className="col-6">
        {data}
      </div>
      <div className="col-3">
        <Button
          style={{
            backgroundColor: '#C30000',
            width: '60px',
            height: '25px',
            fontWeight: 'bold',
            fontSize: '8px',
            color: 'white',
            borderColor: '#D9ED92',
            borderRadius: '20px',
            marginTop: '5px',
            marginLeft: '20px',
          }}
          onClick={() => closeMilestone()}
        >
          Close
        </Button>
      </div>
    </div>
  ))
  );

  const currTasks = (() => currentTasks.map((data) => (
    <div>
      <div className="col-6">
        {data}
      </div>
      <div className="col-3">
        <Button
          style={{
            backgroundColor: '#34A0A4',
            width: '60px',
            height: '25px',
            fontWeight: 'bold',
            fontSize: '8px',
            color: 'white',
            borderColor: '#D9ED92',
            borderRadius: '20px',
            marginTop: '5px',
            marginLeft: '20px',
          }}
          onClick={() => assignTask()}
        >
          Assign
        </Button>
        <Button
          style={{
            backgroundColor: '#C30000',
            width: '60px',
            height: '25px',
            fontWeight: 'bold',
            fontSize: '8px',
            color: 'white',
            borderColor: '#D9ED92',
            borderRadius: '20px',
            marginTop: '5px',
            marginLeft: '20px',
          }}
          onClick={() => completeTask()}
        >
          Complete
        </Button>
      </div>
    </div>
  ))
  );

  useEffect(() => {
    if (memberEmail !== '') {
      const newCurrMembers = currMembers;
      newCurrMembers.push(memberEmail);
      setCurrMembers([...newCurrMembers]);
    }
  }, [rerender]);

  if (attendance) {
    return (
      <div className="mx-auto" style={{ position: 'relative', padding: '20px' }}>
        <div>
          {attendenceMembers()}
        </div>
        <Button
          style={{
            backgroundColor: '#C30000',
            width: '300px',
            height: '35px',
            fontWeight: 'bold',
            fontSize: '15px',
            color: 'black',
            borderColor: '#52B69A',
            marginTop: '10px',
          }}
          onClick={() => takeAttendance()}
        >
          Return
        </Button>
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
          onClick={() => takeAttendance()}
        >
          Submit Attendance
        </Button>
      </div>
    );
  }

  if (milestonesView) {
    return (
      <div>
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
                <h5 className="text-center">Active Milestones</h5>
                <div style={{ overflow: 'hidden', overflowY: 'scroll' }}>
                  <ul style={{ height: '310px' }}>
                    {currMilestones()}
                  </ul>
                </div>
                <div className="row">
                  {/* <div className="col-8">
                    <Form.Control style={{ marginTop: '10px', height: '25px' }} type="name" onChange={(e) => updateMemberEmail(e)} />
                  </div> */}
                  <div className="col-4">
                    <Button
                      style={{
                        backgroundColor: '#52B69A',
                        width: '100px',
                        height: '25px',
                        fontWeight: 'bold',
                        fontSize: '8px',
                        color: 'black',
                        borderColor: '#6A9B72',
                        marginTop: '10px',
                      }}
                      onClick={() => createMilestone()}
                    >
                      Create Milestone
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
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
                <h5 className="text-center">Active Tasks</h5>
                <div style={{ overflow: 'hidden', overflowY: 'scroll' }}>
                  <ul style={{ height: '310px' }}>
                    {currTasks()}
                  </ul>
                </div>
                <div className="row">
                  {/* <div className="col-8">
                    <Form.Control style={{ marginTop: '10px', height: '25px' }} type="name" onChange={(e) => updateMemberEmail(e)} />
                  </div> */}
                  <div className="col-4">
                    <Button
                      style={{
                        backgroundColor: '#52B69A',
                        width: '100px',
                        height: '25px',
                        fontWeight: 'bold',
                        fontSize: '8px',
                        color: 'black',
                        borderColor: '#6A9B72',
                        marginTop: '10px',
                      }}
                      onClick={() => createTask()}
                    >
                      Create Task
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
        <Button
          style={{
            backgroundColor: '#C30000',
            width: '300px',
            height: '35px',
            fontWeight: 'bold',
            fontSize: '15px',
            color: 'black',
            borderColor: '#52B69A',
            marginTop: '10px',
          }}
          onClick={() => manageMilestonesAndTasks()}
        >
          Return
        </Button>
      </div>
    );
  }

  return (
    <div className="container" style={{ position: 'relative', padding: '20px' }}>
      <h1 className="text-center">PROJECT NAME</h1>
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
          {userAlreadyInProject && errorMsgUserAlreadyInClub()}
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
              onClick={() => takeAttendance()}
            >
              Attendance
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
              onClick={() => manageMilestonesAndTasks()}
            >
              Manange Milestones/Tasks
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
              onClick={() => viewAnalytics()}
            >
              View Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProject;
