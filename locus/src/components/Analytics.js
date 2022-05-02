import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
} from 'react-bootstrap';

const Analytics = function AnalyticsComponent({ userId }) {
  const tasksCompletedData = {
    completedTasks: ['Task 1', 'Task 2', 'Task 3'],
    taskCompletedByPerson: [{ personName: 'Dustin', taskCompleted: 0 }, { personName: 'Soham', taskCompleted: 1 }, { personName: 'James', taskCompleted: 2 }],
  };

  const navigate = useNavigate();

  const returnToProject = (() => {
    navigate(`/projects/manage-projects/${userId}`);
  });

  const tasksCompleted = (() => (
    tasksCompletedData.completedTasks.map((data) => (
      <li style={{ listStyleType: 'none', width: '15rem' }} key={data}>
        <div className="row">
          <div className="col-6">
            {data}
          </div>
        </div>
      </li>
    ))
  ));

  const usersAndTheirCompletedTasks = (() => (
    tasksCompletedData.taskCompletedByPerson.map((data) => (
      <li style={{ listStyleType: 'none', width: '15rem' }} key={data}>
        <div className="row">
          <div className="col-6">
            {`${data.personName} ${data.taskCompleted}`}
          </div>
        </div>
      </li>
    ))
  ));

  return (
    <div className="container" style={{ position: 'relative', padding: '20px' }}>
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
              <h5 className="text-center">Completed Tasks</h5>
              <div style={{ overflow: 'hidden', overflowY: 'scroll' }}>
                <ul style={{ height: '310px' }}>
                  {tasksCompleted()}
                </ul>
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
              <h5 className="text-center">Task Tracker</h5>
              <div style={{ overflow: 'hidden', overflowY: 'scroll' }}>
                <ul style={{ height: '310px' }}>
                  {usersAndTheirCompletedTasks()}
                </ul>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="navbar-brand" style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <Button
          style={{
            backgroundColor: '#C30000',
            width: '120px',
            height: '50px',
            fontWeight: 'bold',
            fontSize: '25px',
            color: 'black',
            borderColor: '#C30000',
          }}
          onClick={() => returnToProject()}
        >
          Return
        </Button>
      </div>
    </div>
  );
};

export default Analytics;
