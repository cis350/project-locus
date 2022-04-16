import React, { useState } from 'react';
import {
  Modal,
  Button,
  Card,
  Form,
} from 'react-bootstrap';

const SelectProject = function SelectProjectComponent() {
  const [modalClick, setmodalClick] = useState(false);

  const closeModal = (() => {
    setmodalClick(false);
  });

  const openModal = (() => {
    setmodalClick(true);
  });

  const modal = (() => (
    <Modal show={modalClick} onHide={() => closeModal()}>
      <Modal.Header closeButton>
        <Modal.Title>Title</Modal.Title>
      </Modal.Header>
      <Modal.Body>Body 1</Modal.Body>
      <Modal.Body style={{ fontWeight: 'bold' }}>
        Body 2
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-secondary mt-2" onClick={() => closeModal()}>
          Button
        </Button>
      </Modal.Footer>
    </Modal>
  ));

  return (
    <div>
      Select Project Page
    </div>
  );
};

export default SelectProject;
