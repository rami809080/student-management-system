# Student Management System

This is a web application for managing students and classes, built with Next.js, Node.js, and MongoDB.

## Features

*   User Management (Admin, Teacher roles)
*   Student Management (CRUD operations, detailed profiles)
*   Class Management (CRUD operations, assigning students)
*   Excel Import for Students
*   Multilingual Support (English, Arabic, Hebrew) with RTL
*   JWT Authentication with secure cookies
*   Responsive UI

## Tech Stack

*   **Frontend:** Next.js (React), Tailwind CSS, shadcn/ui
*   **Backend:** Node.js (Next.js API Routes)
*   **Database:** MongoDB (using Mongoose)
*   **Authentication:** JWT, bcryptjs
*   **Internationalization:** next-intl
*   **Excel Handling:** xlsx

## Project Structure

```
student-management-app/
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── [locale]/       # Main application pages (dashboard, students, classes)
│   │   │   ├── layout.js   # Root layout for authenticated routes
│   │   │   └── page.js     # Example dashboard page
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Authentication endpoints (login, register)
│   │   │   ├── students/   # Student CRUD and import endpoints
│   │   │   └── classes/    # Class CRUD endpoints
│   │   └── login/        # Login page component
│   ├── components/
│   │   ├── ui/           # Reusable UI components (from shadcn/ui)
│   │   ├── layout/       # Header, Sidebar, LanguageSwitcher
│   │   ├── students/     # StudentForm, StudentList, StudentDetail
│   │   └── classes/      # ClassForm, ClassList, ClassDetail
│   ├── lib/
│   │   └── mongodb/      # MongoDB connection utility
│   ├── models/           # Mongoose models (User, Student, Class)
│   ├── middleware.js     # Authentication and authorization middleware
│   └── i18n.js           # next-intl configuration
├── messages/               # Translation files (en.json, ar.json, he.json)
├── .env.local.example      # Example environment variables
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies
├── pnpm-lock.yaml          # Lockfile
└── README.md               # This file
```

## Local Setup and Running

**Prerequisites:**

*   Node.js (v20.x or later recommended)
*   pnpm (or npm/yarn)
*   MongoDB instance (local or cloud like MongoDB Atlas)

**Steps:**

1.  **Clone/Extract the Project:**
    Extract the provided zip file to your desired directory.

2.  **Navigate to Project Directory:**
    ```bash
    cd path/to/student-management-app
    ```

3.  **Install Dependencies:**
    ```bash
    pnpm install 
    # or npm install / yarn install
    ```

4.  **Set Up Environment Variables:**
    *   Rename `.env.local.example` to `.env.local`.
    *   Edit `.env.local` and add your configuration:
        ```dotenv
        # MongoDB Connection String (replace with your actual connection string)
        MONGODB_URI=mongodb://localhost:27017/student_management

        # JWT Secret Key (change this to a strong, random secret)
        JWT_SECRET=your_strong_jwt_secret_key_here

        # Optional: JWT Token Expiry (default is 1d)
        # JWT_EXPIRES_IN=1d 
        ```

5.  **Ensure MongoDB is Running:**
    *   If using a local MongoDB instance, make sure the MongoDB server is running.
        ```bash
        # Example command (might vary based on your installation)
        sudo systemctl start mongod 
        # or mongod --config /path/to/mongod.conf
        ```
    *   If using MongoDB Atlas, ensure your IP address is whitelisted and the connection string is correct.

6.  **Run the Development Server:**
    ```bash
    pnpm dev
    # or npm run dev / yarn dev
    ```

7.  **Access the Application:**
    Open your browser and navigate to `http://localhost:3000` (or the port specified in the console).

8.  **Initial User:**
    *   There is no default admin user. You will need to register the first user.
    *   Navigate to `/register` (e.g., `http://localhost:3000/en/register`) to create an account. The first registered user might need to be manually promoted to 'admin' in the database if admin-specific functionalities are restricted.
    *   Alternatively, modify the registration API (`src/app/api/auth/register/route.js`) temporarily to allow setting the 'admin' role during the first registration, or create a seeding script.

## Deployment

This Next.js application can be deployed to various platforms that support Node.js.

**General Steps (Platform Agnostic):**

1.  **Build the Application:**
    ```bash
    pnpm build
    # or npm run build / yarn build
    ```
    This creates an optimized production build in the `.next` directory.

2.  **Set Environment Variables:**
    Ensure the production environment has the necessary environment variables set (`MONGODB_URI`, `JWT_SECRET`). **Do not commit your `.env.local` file to version control.** Use the platform's environment variable management system.

3.  **Start the Production Server:**
    ```bash
    pnpm start
    # or npm run start / yarn start
    ```
    This starts the Next.js production server.

**Platform Specific Examples:**

*   **Vercel:**
    *   Connect your Git repository (GitHub, GitLab, Bitbucket) to Vercel.
    *   Configure the environment variables in the Vercel project settings.
    *   Vercel will automatically build and deploy the application upon pushes to the main branch.

*   **Netlify:**
    *   Similar to Vercel, connect your Git repository.
    *   Set environment variables in Netlify.
    *   Netlify will build and deploy.

*   **Docker:**
    *   Create a `Dockerfile` optimized for Next.js applications (multi-stage builds are recommended).
    *   Build the Docker image.
    *   Run the Docker container, passing in the environment variables.

*   **Node.js Server (e.g., EC2, DigitalOcean Droplet):**
    *   Ensure Node.js, pnpm/npm/yarn, and potentially a process manager (like PM2) are installed on the server.
    *   Clone the repository.
    *   Install dependencies (`pnpm install --prod`).
    *   Build the application (`pnpm build`).
    *   Set environment variables.
    *   Start the application using the process manager (`pm2 start pnpm --name student-app -- start`).
    *   Configure a reverse proxy (like Nginx or Apache) to handle incoming requests and forward them to the Next.js application (running on port 3000 by default).

**Important Considerations for Deployment:**

*   **Database:** Ensure your MongoDB instance is accessible from your deployment environment. Use MongoDB Atlas or a managed database service for easier management and scalability.
*   **Security:** Use strong secrets for `JWT_SECRET`. Configure HTTPS.
*   **CORS:** If your frontend and backend are on different domains (less likely with Next.js API routes), configure CORS appropriately.
*   **Image Uploads:** The current implementation does not include file storage for student photos. You would need to integrate a cloud storage service (like AWS S3, Google Cloud Storage, Cloudinary) and update the `StudentForm` and API endpoints to handle uploads.


