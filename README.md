# Gramaharvest Project

This is a mono-repo setup for the Gramaharvest website.

## Structure
- `frontend/`: Next.js 16 (React 19), Tailwind CSS v4, Three.js, GSAP.
- `backend/`: Node.js, Express, PostgreSQL.

## Getting Started

### Prerequisites
- Node.js installed.
- PostgreSQL database running (update credentials in `backend/.env`).

### Running the Frontend
1. Navigate to `gramaharvest/frontend`:
   ```bash
   cd gramaharvest/frontend
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000).

### Running the Backend
1. Navigate to `gramaharvest/backend`:
   ```bash
   cd gramaharvest/backend
   ```
2. Start the server:
   ```bash
   npm run dev
   ```
3. API runs on [http://localhost:5001](http://localhost:5001).

## Features Implemented
- **Hero Section**: Animated steam rising from rice bowls (GSAP).
- **Interactive 3D**: Rotating Ghee Jar (Three.js).
- **Scroll Animations**: Chillies sliding in with parallax (GSAP ScrollTrigger).
- **Design**: "From Our Grama to Your Home" theme with earthy colors (Cream, Green, Gold, Earth).
- **Responsive**: Mobile-first approach.
