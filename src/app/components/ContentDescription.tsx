import React from 'react';

const SeoContentSection = ({ 
  contentDescription, 
  title = "Content Description",
  subtitle = "Detailed information and specifications",
  icon = "star",
  className = "",
  style = {}
}:{
  contentDescription?: string,
  title?: string,
  subtitle?: string,
  icon?: string,
  className?: string,
  style?: React.CSSProperties
}) => {
  if (!contentDescription) {
    return null;
  }

  return (
    <div className={`col-md-12 mt-5 ${className}`} style={style}>
      <div 
        className="seo-content-section"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
          fontFamily: "var(--font-poppins), Poppins, sans-serif",
          borderRadius: 16,
          padding: "32px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          border: "1px solid #e9ecef",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Content area */}
        <div 
          className="se-wrapper se-wrapper-wysiwyg sun-editor-editable"
          style={{
            fontFamily: "var(--font-poppins), Poppins, sans-serif"
          }}
        >
          <div 
            className="se-wrapper-content" 
            dangerouslySetInnerHTML={{ __html: contentDescription }}
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif"
            }}
          />
        </div>
        
        {/* Scoped styles with proper font family */}
        <style jsx>{`
          .seo-content-section :global(.se-wrapper-content) {
            font-family: var(--font-poppins), Poppins, sans-serif !important;
          }
          
          .seo-content-section :global(.se-wrapper-content p) {
            margin-bottom: 16px;
            text-align: justify;
            font-family: var(--font-poppins), Poppins, sans-serif;
            font-size: 16px;
            line-height: 1.7;
            color: #333;
          }
          
          .seo-content-section :global(.se-wrapper-content p:last-child) {
            margin-bottom: 0;
          }
          
          .seo-content-section :global(.se-wrapper-content strong) {
            color: #1a1a1a;
            font-weight: 600;
            font-family: var(--font-poppins), Poppins, sans-serif;
          }
          
          .seo-content-section :global(.se-wrapper-content ul),
          .seo-content-section :global(.se-wrapper-content ol) {
            padding-left: 24px;
            margin-bottom: 16px;
            font-family: var(--font-poppins), Poppins, sans-serif;
          }
          
          .seo-content-section :global(.se-wrapper-content li) {
            margin-bottom: 8px;
            line-height: 1.6;
            font-family: var(--font-poppins), Poppins, sans-serif;
            font-size: 16px;
          }
          
          .seo-content-section :global(.se-wrapper-content h1) {
            color: #1a1a1a;
            margin-top: 32px;
            margin-bottom: 16px;
            font-weight: 700;
            line-height: 1.3;
            font-family: var(--font-poppins), Poppins, sans-serif;
            font-size: 28px;
          }
          
          .seo-content-section :global(.se-wrapper-content h2) {
            color: #1a1a1a;
            margin-top: 28px;
            margin-bottom: 14px;
            font-weight: 600;
            line-height: 1.3;
            font-family: var(--font-poppins), Poppins, sans-serif;
            font-size: 24px;
          }
          
          .seo-content-section :global(.se-wrapper-content h3) {
            color: #1a1a1a;
            margin-top: 24px;
            margin-bottom: 12px;
            font-weight: 600;
            line-height: 1.3;
            font-family: var(--font-poppins), Poppins, sans-serif;
            font-size: 20px;
          }
          
          .seo-content-section :global(.se-wrapper-content h4) {
            color: #1a1a1a;
            margin-top: 20px;
            margin-bottom: 10px;
            font-weight: 600;
            line-height: 1.3;
            font-family: var(--font-poppins), Poppins, sans-serif;
            font-size: 18px;
          }
          
          .seo-content-section :global(.se-wrapper-content h5) {
            color: #1a1a1a;
            margin-top: 18px;
            margin-bottom: 8px;
            font-weight: 600;
            line-height: 1.3;
            font-family: var(--font-poppins), Poppins, sans-serif;
            font-size: 16px;
          }
          
          .seo-content-section :global(.se-wrapper-content h6) {
            color: #1a1a1a;
            margin-top: 16px;
            margin-bottom: 8px;
            font-weight: 600;
            line-height: 1.3;
            font-family: var(--font-poppins), Poppins, sans-serif;
            font-size: 14px;
          }
          
          .seo-content-section :global(.se-wrapper-content a) {
            color: #007bff;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s ease;
            font-family: var(--font-poppins), Poppins, sans-serif;
          }
          
          .seo-content-section :global(.se-wrapper-content a:hover) {
            border-bottom-color: #007bff;
          }
          
          .seo-content-section :global(.se-wrapper-content blockquote) {
            border-left: 4px solid #007bff;
            padding-left: 16px;
            margin: 20px 0;
            font-style: italic;
            color: #666;
            background-color: rgba(0, 123, 255, 0.05);
            padding: 16px;
            border-radius: 0 8px 8px 0;
            font-family: var(--font-poppins), Poppins, sans-serif;
            font-size: 16px;
          }
          
          .seo-content-section :global(.se-wrapper-content table) {
            font-family: var(--font-poppins), Poppins, sans-serif;
            font-size: 15px;
          }
          
          .seo-content-section :global(.se-wrapper-content code) {
            font-family: var(--font-poppins), Poppins, sans-serif;
          }
        `}</style>
      </div>
    </div>
  );
};

export default SeoContentSection;