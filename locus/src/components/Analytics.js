/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
} from 'react-bootstrap';
import { getAllTasks } from '../modules/api';

const Analytics = function AnalyticsComponent({
  userId,
  currProjectWithoutSpace,
  project,
  club,
  email,
}) {
  const [allTasks, setAllTasks] = useState([]);
  useEffect(() => {
    getAllTasks(project, club, email).then((res) => {
      if (res.status === 200) {
        setAllTasks(res.jsonContent);
      }
    });
  }, []);

  const navigate = useNavigate();

  const returnToProject = (() => {
    navigate(`/projects/manage-projects/${currProjectWithoutSpace}/${userId}`);
  });

  const tasksCompleted = (() => (
    allTasks.map((data) => {
      if (data.status === 'done') {
        console.log(data);
        return (
          <li style={{ listStyleType: 'none', width: '50rem' }} key={data._id}>
            <div className="row">
              <div className="col-6">
                {data.taskName}
              </div>
            </div>
          </li>
        );
      }
    })
  ));

  const tasksIncompleted = (() => (
    allTasks.map((data) => {
      if (data.status === 'incomplete') {
        console.log(data);
        return (
          <li style={{ listStyleType: 'none', width: '50rem' }} key={data._id}>
            <div className="row">
              <div className="col-6">
                {data.taskName}
              </div>
            </div>
          </li>
        );
      }
      if (data.status === 'need help') {
        console.log(data);
        return (
          <li style={{ listStyleType: 'none', width: '50rem' }} key={data._id}>
            <div className="row">
              <div className="col-6">
                {data.taskName}
                {' '}
                (need help)
              </div>
            </div>
          </li>
        );
      }
    })
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
              <h5 className="text-center">Incompleted Tasks</h5>
              <div style={{ overflow: 'hidden', overflowY: 'scroll' }}>
                <ul style={{ height: '310px' }}>
                  {tasksIncompleted()}
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
