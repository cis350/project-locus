/* eslint-disable no-alert */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Row,
  Col,
  Modal,
} from 'react-bootstrap';
import {
  createTask,
  getTasksForProject,
  updateStatusForCurrTask,
  deleteTask,
} from '../modules/api';

const ManageTasks = function ManageTasksComponent({
  project,
  club,
  email,
  role,
}) {
  const [modalClickCreate, setModalClickCreate] = useState(false);
  const [modalClickTask, setModalClickTask] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [targetEmail, setTargetName] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const [taskAdded, setTaskAdded] = useState(false);
  const [currTask, setCurrTask] = useState('');
  const [currTaskId, setCurrTaskId] = useState('');
  const [currStatus, setCurrStatus] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState('');

  useEffect(() => {
    getTasksForProject(project, club, email).then((res) => {
      if (res.status === 200) {
        setAllTasks(res.jsonContent);
      }
    });
  }, [taskAdded]);

  const openCreateModal = () => {
    setModalClickCreate(true);
  };

  const closeCreateModal = () => {
    setModalClickCreate(false);
  };

  const openTaskModal = (task, id, status) => {
    setModalClickTask(true);
    setCurrTask(task);
    setCurrTaskId(id);
    setCurrStatus(status);
  };

  const closeTaskModal = () => {
    setModalClickTask(false);
  };

  const updateTaskName = ((e) => {
    setTaskName(e.target.value);
  });

  const updateTargetEmail = ((e) => {
    setTargetName(e.target.value);
  });

  const addTask = (() => {
    createTask(project, club, taskName, email, targetEmail, 'incomplete').then((res) => {
      if (res.status === 201) {
        setTaskAdded(!taskAdded);
      } else {
        alert('Error!');
      }
    });
  });

  const createModal = (() => (
    <Modal show={modalClickCreate} onHide={() => closeCreateModal()}>
      <Modal.Header closeButton>
        <Modal.Title>
          Create task for
          {' '}
          {project}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input className="form-control" type="text" placeholder="Type in the task name" onChange={(e) => updateTaskName(e)} />
        <input className="form-control" type="text" placeholder="Type in the the recipient email" onChange={(e) => updateTargetEmail(e)} />
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-secondary mt-2" onClick={() => closeCreateModal()}>
          Close
        </Button>
        <Button className="btn btn-primary mt-2" onClick={() => { addTask(); closeCreateModal(); }}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
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
        setTaskAdded(!taskAdded);
      }
    });
  });

  const deleteCurrTask = (() => {
    deleteTask(currTaskId, club, project, email).then((res) => {
      if (res.status === 200) {
        setTaskAdded(!taskAdded);
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
        <Button className="btn btn-danger mt-2" onClick={() => { closeTaskModal(); deleteCurrTask(); }}>
          Delete Task
        </Button>
      </Modal.Footer>
    </Modal>
  ));

  const displayProjects = (() => (
    allTasks.map((data) => (
      <div className="club-item" key={data._id}>
        {/* referenced https://www.delftstack.com/howto/javascript/javascript-remove-spaces */}
        <Button className="club-button" onClick={() => openTaskModal(data.taskName, data._id, data.status)}>
          <Row>
            <Col className="d-flex justify-content-center">
              {data.taskName}
              {' '}
              (Assigned to:
              {' '}
              {data.assignedTo}
              {' '}
              Status:
              {' '}
              {data.status}
              )
            </Col>
          </Row>
        </Button>
      </div>
    ))
  ));

  return (
    <div className="container" style={{ position: 'relative', padding: '20px' }}>
      <div className="club-item">
        {/* referenced https://www.delftstack.com/howto/javascript/javascript-remove-spaces */}
        {role === 'master' && (
        <Button className="club-button" onClick={() => openCreateModal()}>
          <Row>
            <Col className="d-flex justify-content-center">
              Create new task
            </Col>
          </Row>
        </Button>
        )}
      </div>
      {allTasks.length !== 0 && displayProjects()}
      {modalClickTask && taskModal()}
      {modalClickCreate && createModal()}
    </div>
  );
};

export default ManageTasks;
