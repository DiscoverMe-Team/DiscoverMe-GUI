
# DiscoverMe - GUI

DiscoverMe is a comprehensive web-based Mood & Mental Health Tracker designed to help users log their moods, track trends, and receive personalized suggestions for mental wellness. This repository contains the frontend (GUI) built using Vue.js and PrimeVue Admin Portal style.

## Table of Contents
- Project Overview
- Features
- Tech Stack
- Installation
- Usage
- Directory Structure
- Contributing
- License

## Project Overview

DiscoverMe aims to provide users with tools to monitor their mental health through features like mood tracking, journal entries, and personalized insights. This frontend application uses Vue.js, integrated with PrimeVue components, for a responsive and modern user interface.

## Features

- **Mood Tracking**: Users can log their current mood and track their mental health trends over time.
- **Journal Entries**: A personal journal feature for users to reflect on their thoughts and experiences.
- **Insights Dashboard**: Visualizations and statistics on mood trends and self-care activities.
- **User Authentication**: Secure user login and registration system integrated with AWS Cognito.
- **Responsive Design**: Built using PrimeVue components for a consistent and adaptive UI experience.

## Tech Stack

- Frontend: Vue.js, PrimeVue
- Backend: Django (DiscoverMe-API repository)
- Hosting: AWS EC2, RDS, Cognito
- Dependencies: Axios, Vue Router, Vuetify

## Installation

To set up the frontend locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/DiscoverMe-Team/DiscoverMe-GUI.git
   cd DiscoverMe-GUI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## Usage

- Navigate to the landing page and log in or register for a new account.
- Use the dashboard to log your current mood, view journal entries, and explore insights.
- Access the 'Settings' page for personalized configuration options.

## Directory Structure

```
DiscoverMe-GUI/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── layout/
|   ├── router/
|   ├── service/
│   ├── views/
├── package.json
├── vue.config.js
└── README.md
```

- **public/**: Static assets and index.html.
- **src/assets/**: Images and stylesheets.
- **src/components/**: Reusable Vue components.
- **src/layout/**: Layout components like Navbar and Sidebar.
- **src/router/**: Vue Router configuration.
- **src/service/**: Includes the api service
- **src/views/**: Application pages (Dashboard, MoodLog, Journal).


## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
