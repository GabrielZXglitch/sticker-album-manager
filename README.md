# Sticker Album Manager

A mobile-first sticker album manager built with React, Vite, Tailwind CSS, and Firebase.

## Features
- **Google Authentication**: Secure login to your personal collection.
- **Dashboard**: Real-time overview of your album progress.
- **Collection Management**: Add, edit, and delete stickers. Filter by team or search by player.
- **Legends View**: Special view for your most prestigious stickers.
- **Trading Hub**: Dedicated view for duplicates with large text for easy sharing.
- **Dynamic Selections**: National teams are fetched directly from Firestore.

## Tech Stack
- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS (Trophy Mint Design System)
- **Database/Auth**: Firebase Firestore & Authentication
- **Icons**: Material Symbols & Lucide React

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Accessing on Tablet**:
   The `vite.config.js` is configured with `host: true`, allowing you to access the app on your tablet's browser using your machine's local IP address (e.g., `http://192.168.1.XX:5173`).

## Design Reference
This project was built following the **Trophy Mint** design system exported from Google Stitch.
- **Colors**: Teal (#006b5f) for primary actions, Legend Gold (#fed65b) for Legends.
- **Typography**: Plus Jakarta Sans.
- **Responsiveness**: Mobile-first approach.
