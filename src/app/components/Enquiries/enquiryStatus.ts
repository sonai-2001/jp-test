export const enquiryUser = (status: string) => {
    if (status === "" || status === "Pending") {
        return "Enquiry sent (In Progress)"
    } else if (status === "Draft") {
        return "Enquiry sent (In Progress)"
    } else if (status === "Quotation Received") {
        return "Quotation Received"
    } else if (status === "Revision Request Resend-admin") {
        return "Revision Request Received"
    } else if (status === "Revision Request Resend-user") {
        return "Revision Request Send"
    } else if (status === "Purchase Order") {
        return "Instructions for Purchase Order sent to email"
    } else if (status === "Offline Payment Selected") {
        return "NetBanking/Upi Selected"
    } else if (status === "Online Payment Selected") {
        return "Online Payment Selected"
    } else if (status === "Online Payment Selected") {
        return "Online Payment Selected"
    } else if (status === "Slip Submited") {
        return "Payment Complete (Verification in Progress)"
    } else if (status === "Proof Received") {
        return "Payment Verification Complete"
    } else if (status === "Invoice has been send") {
        return "Invoice sent to your e-mail"
    } else if (status === "Payment Resent") {
        return "Please Resend Payment Proof"
    } else {
        return status
    }
}

export const enquiryAdmin = (status: string) => {
    if (status === "" || status === "Pending") {
        return "Enquiry sent (In Progress)"
    } else if (status === "Draft") {
        return "Enquiry sent (In Progress)"
    } else if (status === "Quotation Received") {
        return "Quotation Sent"
    } else if (status === "Revision Request Resend-admin") {
        return "Revision Request Send"
    } else if (status === "Purchase Order") {
        return "Instructions for Purchase Order sent to email"
    } else if (status === "Revision Request Resend-user") {
        return "Revision Request Received"
    } else if (status === "Offline Payment Selected") {
        return "NetBanking/Upi Selected"
    } else if (status === "Online Payment Selected") {
        return "Online Payment Selected"
    } else if (status === "Slip Submited") {
        return "Payment Received"
    } else if (status === "Proof Received") {
        return "Payment Verification Complete"
    } else if (status === "Invoice has been send") {
        return "Invoice sent to user's e-mail"
    } else if (status === "Payment Resent") {
        return "Please Resend Payment Proof"
    } else {
        return status
    }
}