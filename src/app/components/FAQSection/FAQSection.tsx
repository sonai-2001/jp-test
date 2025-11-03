import { useState } from "react";

const FAQSection = ({ faqData }: { faqData: any }) => {
  const [activeId, setActiveId] = useState(null);

  const toggleAccordion = (id: any) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="accordion" id="accordionExample" style={{ width: "100%" }}>
      {/* 🔵 Hardcoded FAQ - Contact Us */}
      <div className="accordion-item" style={{ marginBottom: "20px" }}>
        <h2 className="accordion-header">
          <button
            className="accordion-button collapsed"
            type="button"
            onClick={() => toggleAccordion("contact")}
            aria-expanded={activeId === "contact"}
            aria-controls="collapse-contact"
          >
            <h5>How can I contact customer support?</h5>
          </button>
        </h2>
        <div
          id="collapse-contact"
          className={`accordion-collapse collapse ${
            activeId === "contact" ? "show" : ""
          }`}
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body" style={{ whiteSpace: "pre-wrap" }}>
            You can reach us by phone at
            <a href="tel:+9830422190"> +91-9830422190 </a>
            Or via email at
            <a href="mailto:sales@jaypeeassociates.com">
              {"  "}
              sales@jaypeeassociates.com
            </a>{" "}
          </div>
        </div>
      </div>
      {faqData?.map((item: any) => (
        <div
          key={item?._id}
          className="accordion-item"
          style={{ marginBottom: "20px" }}
        >
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${
                activeId === item?._id ? "" : "collapsed"
              }`}
              type="button"
              onClick={() => toggleAccordion(item?._id)}
              aria-expanded={activeId === item?._id}
              aria-controls={`collapse-${item?._id}`}
            >
              <h5>{item?.question}</h5>
            </button>
          </h2>
          <div
            id={`collapse-${item?._id}`}
            className={`accordion-collapse collapse ${
              activeId === item?._id ? "show" : ""
            }`}
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body" style={{ whiteSpace: "pre-wrap" }}>
              {item?.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQSection;
