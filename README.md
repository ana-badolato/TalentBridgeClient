# Talent Bridge App

## [🚀 See the App!](www.your-deploy-url-here.com)

![Talent Bridge Logo](./public/cover.png)

## 📝 Description

This project is a web platform for managing events and collaborative projects. It allows users to create, join, and manage events and projects, while handling notifications, team members, and (soon) communication through email integration. Our mission: **building a future through talent, one project and event at a time**.

#### [Deployed App](www.your-deploy-url-here.com)
#### [Client Repo here](https://github.com/ana-badolato/TalentBridgeClient)
#### [Server Repo here](https://github.com/ana-badolato/TalentBridgeServer)


## 💻 Technologies & Libraries used

- **Frontend:** HTML, CSS, React
- **Libraries:** Cloudinary, Leaflet, Nomitatim

## 🛠️ Backlog Functionalities

- Send messages via email/chat (email currently being implemented)
- Add lecturers to events

# 🏗️ Client Structure

## 📚 User Stories

- **404** - As a user, I want to see a user-friendly 404 page when I access a page that doesn’t exist so that I know it was my error.
- **500** - As a user, I want to see an informative error page if there’s an issue with the app so that I know it’s not my fault.
- **Homepage** - As a user, I want to see the homepage with options to log in or sign up to understand what the app offers.
- **Sign Up** - As a user, I want to sign up on the website to view all available events and projects.
- **Login** - As a user, I want to log in to access my account.
- **Logout** - As a user, I want to log out to protect my account security.
- **Edit Profile** - As a user, I want to edit my profile to keep my information up-to-date.
- **Event List** - As a user, I want to see a list of events to decide which ones to join.
- **Create Event** - As a user, I want to create an event related to my project so that others can join.
- **Edit & Delete Event** - As an event owner, I want to edit or delete my events.
- **Project List** - As a user, I want to browse available projects for potential collaboration.
- **Create Project** - As a user, I want to create my own project and invite others to collaborate.
- **Edit & Delete Project** - As a project owner, I want to edit or delete my project.
- **Join an Event** - As a user, I want to join an event automatically when I click to join.
- **Apply to a Project** - As a user, I want to apply to join a project, requesting access from the project owner.
- **Receive Notifications** - As an event or project owner, I want to be notified when users apply or join.
- **Approve or Reject Users** - As a project owner, I want to accept or decline users through notifications.
- **Delete Notifications** - As a user, I want to delete notifications when they are no longer relevant.

## 🛤️ Client Routes

| Path                       | Page            | Components          | Permissions              | Behavior                                                      |
| -------------------------- | --------------- | ------------------- | ------------------------ | ------------------------------------------------------------- |
| `/`                        | Home            | CardEvent, CardProject, CardUser, CallToAction, Slider | Public                   | Home page with main features                                  |
| `/signup`                  | Signup          |                     | Public                   | Signup form with link to login                                |
| `/login`                   | Login           |                     | Public                   | Login form with link to signup                                |
| `/user/profile`            | Profile         | CardEvent, CardProject, Map | Private               | User profile with event and project information               |
| `/user/profile/:username`  | Public Profile  | CardProject, Card Event | Public             | Public profile showing user’s events and projects             |
| `/user`                    | User List       | CardUser, SearchBar | Public               | List of all users with search functionality                   |
| `/profile/edit`            | Edit Profile    |                     | Private                  | Profile edit page                                             |
| `/category/:category`      | Category Page   | CardEvent, CardUser, CardProject, SearchBar | Public   | Shows events and projects filtered by category                |
| `/sendemail/:userid`       | Email Form      |                     | Private                  | Form to send an email to a specific user                      |
| `/project`                 | Project List    | CardProject, SearchBar, Filter | Public             | List of projects with search and filter                       |
| `/newproject`              | New Project     | Autocomplete        | Private                  | Form to create a new project                                  |
| `/project/:projectid`      | Project Details | CardEvent, CardUser Project | Public             | Detailed view of a project                                    |
| `/editproject/:projectid`  | Edit Project    | CardUser           | Private                  | Edit page for project                                         |
| `/event`                   | Event List      | CardEvent, Map, SearchBar | Public               | List of events with search and map view                       |
| `/event/:eventid`          | Event Details   | CardProject        | Public                   | Detailed view of an event                                     |
| `/newevent`                | New Event       |                     | Private                  | Form to create a new event                                    |
| `/editevent/:eventid`      | Edit Event      |                     | Private                  | Edit page for an event                                        |
| `/error`                   | Error Page      |                     | Public                   | Page displayed on error                                       |
| `*`                        | Not Found       |                     | Public                   | 404 page for non-existent routes                              |

## 🧩 Other Components

- Navbar
- Footer

## 🔌 Services

- **Auth Service**
  - `auth.login(user)`
  - `auth.signup(user)`
  - `auth.verify()`

- **Backlog Service**
  - **Event:** `event.filter(category)`, `event.detail(id)`, `event.add(id)`, `event.edit(id)`, `event.delete(id)`
  - **Project:** `project.filter(category)`, `project.detail(id)`, `project.add(id)`, `project.edit(id)`, `project.delete(id)`
  - **Notifications:** `notifications.detail(id)`, `notifications.add(id)`, `notifications.delete(id)`

- **External Packages**
  - **Cloudinary:** `add`, `edit`
  - **Leaflet:** `add`

## 🌐 Context

- `auth.context`

## 🔗 Links

### 👥 Collaborators

- [Ana Badolato](https://github.com/ana-badolato)
- [Nuria Soley](https://github.com/NuriaSoley)

### 📂 Project
- [Deployed App](www.your-deploy-url-here.com)
- [Repository Link Client](https://github.com/ana-badolato/TalentBridgeClient)
- [Repository Link Server](https://github.com/ana-badolato/TalentBridgeServer)

### 🌍 Deploy

- [Deployed App](www.your-deploy-url-here.com)

### 🎬 Slides

- [Slides Link](https://docs.google.com/presentation/d/1HkBky47yAJdYXUKvhw6kafLBSuF5vaREZ-ctHERr45g/edit?usp=sharing)

