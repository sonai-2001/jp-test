// components/CNCWorkholdingBanner.tsx
import { useRouter } from 'next/navigation';
import React from 'react';

interface CNCWorkholdingBannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onContactClick?: () => void;
}

const CNCWorkholdingBanner: React.FC<CNCWorkholdingBannerProps> = ({
  title = "NEED CNC WORKHOLDING SOLUTIONS FROM ONE OF INDIA'S BEST HARDWARE MATERIAL SUPPLIERS?",
  description = "If you are looking for reliable pneumatic tools, or precision CNC machined components, contact Jaypee Associates today for the perfect industrial solution.",
  buttonText = "CONTACT US",
  onContactClick
}) => {
 const router= useRouter()
  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick();
    } else {
      // Default behavior - redirect to contact page
      router.push('/contactus')
    }
  };

  return (
    <>
      <div className="cncBanner">
        <div className="bannerContainer">
          <h2 className="bannerTitle">
            {title}
          </h2>
          
          <p className="bannerDescription">
            {description}
          </p>
          
          <button 
            className="contactButton"
            onClick={handleContactClick}
          >
            {buttonText}
          </button>
        </div>
      </div>

      <style jsx>{`
        .cncBanner {
          background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
          color: white;
          padding: 80px 20px;
          text-align: center;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
        }

        .bannerContainer {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .bannerTitle {
          font-weight: bold;
          font-size: 3rem;
          line-height: 1.2;
          margin: 0 0 30px 0;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .bannerDescription {
          font-size: 1.25rem;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto 40px auto;
          font-weight: 400;
          opacity: 0.95;
        }

        .contactButton {
          background-color: white;
          color: #1976d2;
          font-size: 1.1rem;
          font-weight: bold;
          padding: 15px 40px;
          border-radius: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .contactButton:hover {
          background-color: #f5f5f5;
          box-shadow: 0 6px 25px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }

        .contactButton:active {
          transform: translateY(0px);
        }

        .contactButton:focus {
          outline: 2px solid rgba(255, 255, 255, 0.5);
          outline-offset: 2px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .cncBanner {
            padding: 60px 20px;
          }
          
          .bannerTitle {
            font-size: 2.5rem;
          }
          
          .bannerDescription {
            font-size: 1.1rem;
          }
          
          .contactButton {
            font-size: 1rem;
            padding: 12px 30px;
          }
        }

        @media (max-width: 640px) {
          .bannerTitle {
            font-size: 1.8rem;
          }
          
          .bannerDescription {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .bannerTitle {
            font-size: 1.5rem;
          }
          
          .bannerDescription {
            font-size: 0.9rem;
            margin-bottom: 30px;
          }
        }
      `}</style>
    </>
  );
};

export default CNCWorkholdingBanner;