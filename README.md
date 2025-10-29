# Floor Plan Management System

## Overview
This project is a Floor Plan Management System built using Next.js, Prisma, and Tailwind CSS. It includes features for managing floor plans, regions, variation options, and user roles.

## Features
- Add, edit, and delete floor plans.
- Manage regions and variation options.
- User role management.
- Dynamic form submission with validation.

## Setup Instructions

### Prerequisites
- Node.js installed on your system.
- PostgreSQL database.

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd floor-plan
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Database Setup
1. Configure the database connection in `.env`:
   ```env
   DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
   ```
2. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

### Development
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open the application in your browser at `http://localhost:3000`.

### Prisma Studio
To manage the database visually, run:
```bash
npx prisma studio
```

## Deployment
Follow the deployment instructions for your hosting provider (e.g., Vercel, Netlify).

## Notes
- Ensure the database is properly configured and accessible.
- Use Prisma Studio to verify the schema and data integrity.

## Troubleshooting
If you encounter issues with form submission or API endpoints, check:
- Server logs for detailed error messages.
- Database schema and relations.
- API handler implementations.

## License
This project is licensed under the MIT License.
