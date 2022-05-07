import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Row,
  Col,
  Modal,
  Card,
  Form,
  Alert,
} from 'react-bootstrap';

const ManageTasks = function ManageTasksComponent({ project }) {
  const [modalClick, setModalClick] = useState(false);
  const [taskName, setTaskName] = useState('');

  const openModal = () => {
    setModalClick(true);
  };

  const closeModal = () => {
    setModalClick(false);
  };

  const updateTaskName = ((e) => {
    setTaskName(e.target.value);
  });

  const addTask = (() => {
    // todo
  });

  const modal = (() => (
    <Modal show={modalClick} onHide={() => closeModal()}>
      <Modal.Header closeButton>
        <Modal.Title>
          Create task for
          {' '}
          {project}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input className="form-control" type="text" placeholder="Type in the task name" onChange={(e) => updateTaskName(e)} />
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-secondary mt-2" onClick={() => closeModal()}>
          Close
        </Button>
        <Button className="btn btn-primary mt-2" onClick={() => { addTask(); closeModal(); }}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  ));

  return (
    <div className="container" style={{ position: 'relative', padding: '20px' }}>
      <div className="club-item">
        {/* referenced https://www.delftstack.com/howto/javascript/javascript-remove-spaces */}
        <Button className="club-button" onClick={() => openModal()}>
          <Row>
            <Col className="d-flex justify-content-center">
              Create new task
            </Col>
          </Row>
        </Button>
      </div>
      {modalClick && (modal())}
    </div>
  );
};

export default ManageTasks;
