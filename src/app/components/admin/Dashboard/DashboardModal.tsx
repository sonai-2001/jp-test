// InvoiceEditModal.tsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap'; // or your preferred modal library

interface InvoiceEditModalProps {
    show: boolean;
    onHide: () => void;
    invoicePrefix: string;
    invoiceMidNo: string;
    invoiceNo: string;
    onPrefixChange: (value: string) => void;
    onMidNoChange: (value: string) => void;
    onNoChange: (value: string) => void;
    invoicePrefixErr: boolean;
    invoiceMidNoErr: boolean;
    invoiceNoErr: boolean;
    onUpdateInvoice: () => void;
}

const InvoiceEditModal: React.FC<InvoiceEditModalProps> = ({
    show,
    onHide,
    invoicePrefix,
    invoiceMidNo,
    invoiceNo,
    onPrefixChange,
    onMidNoChange,
    onNoChange,
    invoicePrefixErr,
    invoiceMidNoErr,
    invoiceNoErr,
    onUpdateInvoice
}) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Invoice Number</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-3">
                    <input
                        type="text"
                        className={`form-control ${invoicePrefixErr ? "border-2 border-danger" : ""}`}
                        placeholder="Invoice Prefix. Ex: JA"
                        value={invoicePrefix}
                        onChange={(e: any) => onPrefixChange(e.target.value)}
                    />
                    <input
                        type="text"
                        className={`form-control ${invoiceMidNoErr ? "border-2 border-danger" : ""}`}
                        placeholder="Invoice Mid No. Ex: 25"
                        value={invoiceMidNo}
                        onChange={(e: any) => onMidNoChange(e.target.value)}
                    />
                    <input
                        type="number"
                        className={`form-control ${invoiceNoErr ? "border-2 border-danger" : ""}`}
                        placeholder="Invoice Last No. Ex: 46"
                        value={invoiceNo}
                        onChange={(e: any) => onNoChange(e.target.value)}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onUpdateInvoice}>
                    Update Invoice
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default InvoiceEditModal;