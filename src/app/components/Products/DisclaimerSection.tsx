import React from "react";

const DisclaimerSection = () => {
  return (
    <div
      className="container my-5"
    //   style={}
    >
      <div
        className="p-4 rounded-3 shadow-sm"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #eee",
        }}
      >
        <h5 className="fw-semibold mb-3">Disclaimer:</h5>
        <p
          style={{
            color: "#333",
            fontSize: "1rem",
            lineHeight: "1.7",
            margin: 0,
          }}
        >
          Before making an enquiry, please take a moment to review our{" "}
          <a href="/faq" className="text-primary text-decoration-none">
            FAQ’s
          </a>
          ,{" "}
          <a href="/termscondition" className="text-primary text-decoration-none">
            Terms & Conditions
          </a>
          ,{" "}
          <a href="/shipping-policy" className="text-primary text-decoration-none">
            Shipping & Delivery Policy
          </a>
          , and{" "}
          <a href="/privacy-policy" className="text-primary text-decoration-none">
            Privacy Policy
          </a>{" "}
          — these apply to all purchases. You can find them linked in the footer
          of our website to help avoid any misunderstandings.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerSection;
