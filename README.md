Jaypee Associates - Frontend Next.js Application
A comprehensive e-commerce and business management platform built with Next.js 15, TypeScript, and MongoDB. This application serves as a B2B platform for Jaypee Associates, featuring product management, user authentication, admin dashboard, and enquiry management systems.

🚀 Quick Start
Prerequisites
Node.js: Version 20 or higher
npm: Version 8 or higher
MongoDB: Database instance (local or cloud)
AWS S3: For file storage and image hosting
Environment Variables: Properly configured .env.local file
Installation
Clone the repository bash git clone <repository-url> cd Frontend-Nextjs-Prod

Install dependencies bash npm install --legacy-peer-deps

Environment Setup Create a .env.local file in the root directory with the following variables: ```env # Database MONGODB_URI=your_mongodb_connection_string

# AWS S3 Configuration AWS_ACCESS_KEY_ID=your_aws_access_key AWS_SECRET_ACCESS_KEY=your_aws_secret_key AWS_REGION=ap-south-1 AWS_S3_BUCKET=jaypee-images

# JWT Secret JWT_SECRET=your_jwt_secret_key

# Email Configuration (Choose one) # SendGrid SENDGRID_API_KEY=your_sendgrid_api_key SENDGRID_FROM_EMAIL=your_verified_email

# Brevo (formerly Sendinblue) BREVO_API_KEY=your_brevo_api_key BREVO_FROM_EMAIL=your_verified_email

# MailerSend MAILERSEND_API_KEY=your_mailersend_api_key MAILERSEND_FROM_EMAIL=your_verified_email

# Application URLs NEXT_PUBLIC_BASE_URL=http://localhost:3000 NEXT_PUBLIC_WORDPRESS_URL=your_wordpress_blog_url

# Staging Environment (Optional) NEXT_PUBLIC_STAGING_URL=your_staging_url ```

Run the development server bash npm run dev

Open your browser Navigate to http://localhost:3000

🏗️ Project Structure
Frontend-Nextjs-Prod/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (screens)/               # Public pages
│   │   │   ├── home/                # Homepage
│   │   │   ├── products/            # Product pages
│   │   │   ├── signin/              # Authentication
│   │   │   ├── signup/              # User registration
│   │   │   ├── user-profile/        # User dashboard
│   │   │   ├── my-cart/             # Shopping cart
│   │   │   ├── my-enquiry/          # User enquiries
│   │   │   └── ...                  # Other public pages
│   │   ├── admin/                   # Admin dashboard
│   │   │   ├── dashboard/           # Admin home
│   │   │   ├── products/            # Product management
│   │   │   ├── categories/          # Category management
│   │   │   ├── brands/              # Brand management
│   │   │   ├── users/               # User management
│   │   │   ├── enquiries/           # Enquiry management
│   │   │   └── ...                  # Other admin features
│   │   ├── api/                     # API routes
│   │   │   ├── auth/                # Authentication APIs
│   │   │   ├── product/             # Product APIs
│   │   │   ├── enquiry/             # Enquiry APIs
│   │   │   ├── admin/               # Admin APIs
│   │   │   └── ...                  # Other API endpoints
│   │   ├── components/              # Reusable components
│   │   │   ├── Header/              # Navigation header
│   │   │   ├── Footer/              # Site footer
│   │   │   ├── ProductItem/         # Product display
│   │   │   ├── admin/               # Admin components
│   │   │   └── ...                  # Other components
│   │   ├── services/                # Business logic & APIs
│   │   │   ├── redux/               # State management
│   │   │   ├── Product/             # Product services
│   │   │   ├── Auth/                # Authentication services
│   │   │   └── ...                  # Other services
│   │   ├── globals.scss             # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── middleware.ts            # Request middleware
│   ├── lib/                         # Utility libraries
│   │   ├── mongodb.ts               # Database connection
│   │   ├── s3.ts                    # AWS S3 utilities
│   │   ├── jwt.ts                   # JWT utilities
│   │   └── ...                      # Other utilities
│   ├── models/                      # MongoDB schemas
│   │   ├── Product.ts               # Product model
│   │   ├── User.ts                  # User model
│   │   ├── Enquiry.ts               # Enquiry model
│   │   └── ...                      # Other models
│   └── types/                       # TypeScript type definitions
├── public/                          # Static assets
│   ├── assets/                      # Images and media
│   └── ...                          # Other static files
├── Dockerfile                       # Docker configuration
├── next.config.ts                   # Next.js configuration
├── package.json                     # Dependencies and scripts
└── tsconfig.json                    # TypeScript configuration
🛠️ Technology Stack
Frontend
Next.js 15: React framework with App Router
TypeScript: Type-safe JavaScript
React 18: UI library
Redux Toolkit: State management
SCSS/Sass: CSS preprocessor
Bootstrap 5: CSS framework
Material-UI: React component library
React Hook Form: Form handling
React Hot Toast: Notifications
Backend & Database
MongoDB: NoSQL database
Mongoose: MongoDB ODM
JWT: Authentication
bcrypt: Password hashing
File Storage & Services
AWS S3: File storage
Multer: File upload handling
Puppeteer: PDF generation
SendGrid/Brevo/MailerSend: Email services
Development Tools
ESLint: Code linting
Jest: Testing framework
Docker: Containerization
📋 Available Scripts
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Docker
docker build -t jaypee-associates .    # Build Docker image
docker run -p 3000:3000 jaypee-associates  # Run container
🔧 Configuration
Next.js Configuration (next.config.ts)
CORS headers for API routes
Image optimization for AWS S3
ESLint configuration
MongoDB connection during build
Database Models
The application uses Mongoose schemas for data modeling:

Product: Product information, pricing, categories
User: User accounts, authentication
Enquiry: Customer enquiries and quotations
Category: Product categories
Brand: Product brands
FAQ: Frequently asked questions
State Management
Redux Toolkit with persistence for: - User authentication state - Shopping cart - Application counter

🎨 Styling & UI
Global Styles (globals.scss)
Custom CSS variables for theming
Google Fonts integration (Open Sans, Poppins)
Responsive design utilities
Component-specific styles
Component Styling
SCSS modules for component-specific styles
Bootstrap 5 for layout and components
Material-UI components for admin interface
Custom responsive design
🔐 Authentication & Security
User Authentication
JWT-based authentication
Password hashing with bcrypt
Protected routes for admin and user areas
Session management with Redux
API Security
CORS configuration
Request validation
File upload security
Environment variable protection
📁 File Upload & Storage
AWS S3 Integration
Image upload for products
User profile pictures
Payment slips
Invoice documents
Catalogue files
Supported File Types
Images: JPG, PNG, GIF, WebP, AVIF
Documents: PDF, CSV
Videos: MP4, GIF
📧 Email Integration
The application supports multiple email providers: - SendGrid: Primary email service - Brevo (Sendinblue): Alternative email service - MailerSend: Additional email provider

🚀 Deployment
Production Build
npm run build
npm run start
Docker Deployment
# Build image
docker build -t jaypee-associates .

# Run container
docker run -p 3000:3000 -e MONGODB_URI=your_uri jaypee-associates
Environment Variables for Production
Ensure all required environment variables are set in your production environment: - Database connection string - AWS credentials - Email service credentials - JWT secret - Application URLs

🔧 Making Changes
Adding New Pages
Create page file in src/app/(screens)/ or src/app/admin/
Add route to navigation if needed
Update types in src/types/ if adding new data structures
Add API routes in src/app/api/ if needed
Example:

// src/app/(screens)/new-page/page.tsx
"use client";
import React from 'react';

export default function NewPage() {
  return (
    <div className="container">
      <h1>New Page</h1>
    </div>
  );
}
Adding New Components
Create component in src/app/components/
Add TypeScript types if needed
Create SCSS module for styling
Export component for reuse
Example:

// src/app/components/NewComponent/NewComponent.tsx
import React from 'react';
import styles from './NewComponent.module.scss';

interface NewComponentProps {
  title: string;
  children: React.ReactNode;
}

export default function NewComponent({ title, children }: NewComponentProps) {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
Adding New API Routes
Create route file in src/app/api/
Add database models if needed
Update types for request/response
Add error handling
Example:

// src/app/api/new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    // Your logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
Adding New Database Models
Create model file in src/models/
Define schema with Mongoose
Add TypeScript interface
Update API routes to use the model
Example:

// src/models/NewModel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface INewModel extends Document {
  name: string;
  description: string;
  createdAt: Date;
}

const NewModelSchema = new Schema<INewModel>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.NewModel || mongoose.model<INewModel>('NewModel', NewModelSchema);
Styling Guidelines
Use SCSS modules for component-specific styles
Follow BEM methodology for class naming
Use CSS variables for theming
Ensure responsive design
Maintain consistency with existing styles
Code Quality Standards
TypeScript: Use strict typing
ESLint: Follow linting rules
Component Structure: Follow existing patterns
Error Handling: Implement proper error boundaries
Performance: Optimize for production
🐛 Troubleshooting
Common Issues
MongoDB Connection Error

Check MONGODB_URI environment variable
Ensure MongoDB instance is running
Verify network connectivity
AWS S3 Upload Issues

Verify AWS credentials
Check S3 bucket permissions
Ensure correct region configuration
Build Errors

Clear node_modules and reinstall
Check TypeScript errors
Verify all environment variables
Email Service Issues

Verify email service credentials
Check sender email verification
Review email service quotas
Development Tips
Use Turbopack for faster development builds
Enable TypeScript strict mode for better type safety
Use Redux DevTools for state debugging
Monitor network requests in browser dev tools
Check console logs for debugging information
📚 Additional Resources
Next.js Documentation
TypeScript Handbook
MongoDB Documentation
AWS S3 Documentation
Redux Toolkit Documentation
🤝 Contributing
Follow the existing code structure
Use TypeScript for all new code
Add proper error handling
Test your changes thoroughly
Update documentation as needed
📄 License
This project is proprietary software for Jaypee Associates.

Note: This application is designed for production use and includes comprehensive error handling, security measures, and performance optimizations. Always test changes in a development environment before deploying to production.