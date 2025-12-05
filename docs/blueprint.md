# **App Name**: SugVoyage

## Core Features:

- AI Itinerary Builder: Generates personalized travel itineraries based on user interests, budget, trip length, and group type, providing maps, schedules, and cost estimates using a tool.
- Interactive Storytelling Hub: Presents Cebu's stories through various categories like history, nature, and folklore, with audio narration available in multiple languages using a tool to decide on the complexity of the language to use.
- AI Scan & Learn: Allows tourists to scan landmarks, food, or artifacts with their phone camera, after asking for camera permissions, and the AI identifies the object and narrates its history and cultural importance using a tool.
- Explore Page: Displays a mobile-first UI with tab categories for browsing (People's Choice, Adventure, Hotels, Restaurants, Coffee Shops).
- Stories: Locals and tourists can post their experiences through video or image with a caption that can also be set to Public or Friends.
- Offline Mode: Enables users to download itineraries, maps, and audio stories for use without an internet connection.
- User Profile: Allows users to save itineraries, favorite stories, maintain a travel mood journal, and adjust settings for language, accessibility, and narration style.

## Style Guidelines:

- Primary color: Vibrant ocean blue (#3498DB), reminiscent of Cebu's seas, conveying openness and trustworthiness.
- Background color: Light desaturated blue (#EBF5FB), of similar hue to the primary, for a calming, clean backdrop.
- Accent color: Energetic yellow-orange (#F39C12), analogous to the primary hue, inspired by the Sinulog festival, providing contrast and highlighting interactive elements.
- Body and headline font: 'PT Sans', a humanist sans-serif font that provides both a modern and welcoming feel.
- Use simple, clear icons with rounded edges, inspired by travel and Cebuano culture.
- Employ a minimalist, mobile-first interface with rounded buttons, soft shadows, and grid layouts for content, sticky navigation bar below for easier user access and put the profile section at the top right
- Implement subtle animations and transitions to enhance user experience, such as smooth loading of content or interactive feedback on button presses.


# **GOOGLE DOCS**
Sugoyage: The Smart Traveling Assistant for Cebu
Sugoyage is a mobile application designed to enhance the journey of tourists in Cebu by acting as a smart, location-aware travel assistant. This document outlines the application's structure, technology stack (using the chosen React Native framework), and development plan.
1. Application Screens and User Flows
The application will feature five primary screens accessible via a main navigation bar, plus several dedicated sub-screens and modals.
A. Main Navigation Screens
1. Map / Home Screen
Purpose: The central hub for discovery and real-time location interaction.
Features:
Displays a map of Cebu with the user's current location.
Shows interactive Map Pins (Markers) for all famous spots.
Includes a Filter/Category Selector (e.g., Cultural, Beach, Food) to instantly update the pins shown on the map.
Displays the "Nearby Me" radius visually on the map.
Presents a compact, pull-up panel (like a sheet) showing real-time location details and proximity alerts.
2. Planner Screen (AI)
Purpose: Interface for generating and viewing personalized itineraries.
Features:
Input form for user preferences (duration, budget, interests, pace).
Displays the generated, optimized Activity Itinerary (Day 1, Day 2, etc.).
Shows estimated travel times, traffic analysis, and weather forecasts for scheduled activities.
3. Social Feed Screen
Purpose: The community platform where users share experiences and give enriched feedback.
Features:
A scrollable feed of recent community posts from other users.
Each post includes text, pictures, a "Like" button, and a "Comment" count.
A dedicated button to navigate to the Create Post Screen.
4. Settings Screen
Purpose: Manage account details and application behavior.
Features:
User Profile Management (Sign in/out, edit profile).
Radius Range Adjustment: A slider to set the geofencing notification radius (e.g., 500 meters to 5 kilometers).
Push Notification Preferences.
5. Profile Screen
Purpose: View the user's past contributions and saved content.
Features:
Displays all posts created by the current user.
Shows a list of saved itineraries or favorite locations.
B. Detail & Workflow Screens
Location Detail Screen: Opens when a Map Pin is clicked. Shows:
Name and description of the famous spot.
Option to start navigation.
Real-time activity suggestions (e.g., "Try diving with whale sharks in Oslob!").
Embedded feed of community posts related to that specific location.
Create Post Screen: A full-screen workflow for:
Text input.
Image/Photo Upload from the camera or gallery.
Tagging a specific Cebu location.
2. Technology Stack (Free & Open Source Focus)
This selection focuses on utilizing free-tier, open-source, or community-supported libraries that integrate well with the mandated React Native frontend.
Category
Component/Tool
Rationale (For Non-Tech Stakeholders)
Frontend
React Native (Mandatory)
Allows us to build one codebase that works on both iOS (Apple) and Android phones, saving development time and cost.
Backend & Storage
Firebase (Google Free-Tier)
A comprehensive suite for mobile apps. We use Firestore (database), Authentication (user login), and Cloud Storage (for community pictures). It offers excellent scalability on a generous free tier.
Mapping & Display
react-native-maps
The industry-standard, open-source component to display interactive maps and custom markers (pins) seamlessly on both iOS and Android.
Geofencing
Native Geolocation API + Turf.js
We use the device's built-in location service (react-native-geolocation-service recommended) combined with Turf.js (a free JavaScript library) to calculate if the user is inside a defined radius (Geofence) for push notifications.
Routing & Traffic
OpenRouteService (ORS) / OSRM
Free, open-source routing engines that use OpenStreetMap data. They can calculate travel time and optimize routes, fulfilling the "analyze how long it would take to arrive" feature without relying on paid map APIs.
AI Processing
Gemini API (Free Tier)
A powerful, free-tier Generative AI model that can process complex user inputs (e.g., "I like beaches and history") to generate structured, personalized itineraries and activity suggestions.
Push Notifications
react-native-push-notification
A reliable, community-maintained library to handle system alerts for geofencing notifications on both iOS and Android devices.

3. Integration Plan and Development Phases
We recommend a Phased Approach to ensure the core value proposition is built, tested, and polished before moving on to the most complex features.
Phase 1: Foundation & Authentication (4 Weeks)
Goal: Establish a stable architecture and a usable environment.
Key Tasks:
Set up the React Native project and integrate Firebase.
Implement user sign-up and login (Authentication).
Build the core navigation shell (Bottom Tab Bar).
Develop the basic Social Feed Screen template and the Profile Screen layout.
Outcome: A functional app skeleton where users can log in and navigate between empty screens.
Phase 2: Location Core & Geofencing (6 Weeks)
Goal: Implement the primary location features and the core real-time assistant logic.
Key Tasks:
Integrate react-native-maps and display a static map of Cebu.
Fetch and display famous Cebu spots as interactive Map Pins.
Implement Nearby Me location tracking.
Set up the Geofencing logic using the native location API and Turf.js to detect proximity.
Connect geofencing alerts to Push Notifications.
Build the Location Detail Screen to show pin information.
Outcome: The app now functions as a real-time, location-aware notification tool.
Phase 3: Social Community Platform (6 Weeks)
Goal: Enable users to share content and interact with each other's posts.
Key Tasks:
Develop the Create Post Screen, including photo upload functionality (using Firebase Storage).
Implement saving and retrieving posts to Firestore (Database).
Add "Like" and "Comment" (Feedback) functionality on posts.
Implement the location filtering feature on the Map Screen.
Outcome: Users can now post, share pictures, and engage with the community, replacing the traditional rating system.
Phase 4: Smart AI Planning & Analysis (8 Weeks)
Goal: Integrate the complex AI and optimization features.
Key Tasks:
Set up the Gemini API connection for itinerary generation.
Develop the Planner Screen UI for user input and results display.
Integrate the OpenRouteService (ORS) to calculate and display optimized routes and travel times for the generated itineraries.
Implement the Activity Suggestions engine (AI-driven) on the Location Detail Screen.
Implement the Radius Range Adjustment setting on the Settings Screen.
Outcome: The app becomes a full-featured "Smart Traveling Assistant" with personalized planning and predictive analytics.
Phase 5: Testing, Polish, and Launch Readiness (4 Weeks)
Goal: Final quality assurance, performance optimization, and preparation for app store submission.
Key Tasks:
Thorough cross-platform (iOS and Android) testing of all features.
Optimizing map and background location services for battery life.
Improving the user interface (UI) design and user experience (UX) flows.
Writing final documentation for support and maintenance.
Outcome: Sugoyage is ready to launch to tourists in Cebu!
This phased plan ensures that the core mapping and geofencing features are stable before tackling the complexity of the AI and social features.
If you are looking to understand the technical complexity of setting up geofencing and background location tracking in the React Native environment, this video provides a good overview: Geofencing in React Native with react-native-maps.
1. "Cebu Story Ticket"
Like getting a movie ticket that shows a preview

When you get off the plane, scan a QR code

Your phone shows a fun Cebu story just for you

If you like beaches → shows beach adventures

If you like food → shows food tours

2. "Airport Treasure Hunt"
Like finding hidden clues around the airport

Look at airport screens that show Cebu pictures

Find QR codes that unlock fun Cebu games

Take photos with Cebu-themed backgrounds to share

3. "Magic Storytelling Walls"
Like talking pictures in Harry Potter

Touch screens in the airport that tell Cebu stories

Point your phone at signs → see Cebu come alive

Hear Cebu legends while waiting for baggage
