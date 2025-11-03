"use client";
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { increment } from "@/app/services/redux/features/counterSlice";
import { deleteTeamMember } from "@/app/services/Team/teamApi";

function ConfirmDeleteTeamMember({
  id,
  show,
  message,
  onClose,
}: {
  id: string;
  show: boolean;
  message: string;
  onClose: () => void;
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      if (id) {
        const res = await deleteTeamMember(id);
        if (res) {
          dispatch(increment());
          onClose();
        }
      }
    } catch (e) {
      console.error("Delete team member error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal centered show={show} onHide={onClose}>
      <Modal.Header closeButton className="border-0">
        <Modal.Title>Delete Team Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="col-12 text-center">
            <div className="spinner-grow text-secondary" role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        ) : (
          <>
            <h4>{message}</h4>
            <div className="col-12 d-flex justify-content-between mt-4">
              <Button variant="secondary" className="px-4" onClick={onClose}>
                No
              </Button>
              <Button variant="primary" className="px-4" onClick={onSubmit}>
                Yes
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmDeleteTeamMember;
