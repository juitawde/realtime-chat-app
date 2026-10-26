<<<<<<< HEAD
# PulseChat

A modern real-time chat application built with **Node.js, Express.js and Socket.IO**. PulseChat supports public channels, private direct messaging, private groups, real-time presence, typing indicators, message history and a responsive chat interface.

## 🚀 Live Demo

**PulseChat:**  
https://realtime-chat-app-e3ab.onrender.com/

---

## 📌 Project Overview

PulseChat is a real-time communication platform designed to demonstrate the implementation of WebSocket-based communication using Socket.IO.

Users can join public channels, communicate through direct messages, create and join private groups, view online members and receive messages instantly without refreshing the page.

The application maintains recent message history in memory and provides real-time updates for messages, presence and typing activity.

---

## ✨ Features

### 💬 Public Channels

PulseChat provides multiple public channels:

- `#general`
- `#developers`
- `#gaming`
- `#random`

Users can join channels and exchange messages in real time.

### 👤 User Presence

- Username-based login
- Online/offline user status
- Real-time member list
- Automatic connection status updates

### ⚡ Real-Time Messaging

- Instant message delivery using Socket.IO
- Message timestamps
- Unique message IDs
- Latest 50 messages retained per conversation
- Automatic history replay when joining a channel

### ✍️ Typing Indicators
=======
# PulseChat — Production Full-Stack Real-Time Messaging Platform

> A resilient, high-performance real-time communication platform crafted with **React 18, TypeScript, Node.js, Express, Socket.IO, and MongoDB**, styled with the **Slate & Arctic Cyan** visual identity system.

---

## ✦ Table of Contents
1. [Project Overview](#1-project-overview)
2. [Visual Identity & Design System: Slate & Arctic Cyan](#2-visual-identity--design-system-slate--arctic-cyan)
3. [Architecture Overview & Diagram](#3-architecture-overview--diagram)
4. [Technology Stack](#4-technology-stack)
5. [Key Features & Capabilities](#5-key-features--capabilities)
6. [Persistent Avatar & Profile Picture System](#6-persistent-avatar--profile-picture-system)
7. [Chatterly AI Conversational Workspace](#7-chatterly-ai-conversational-workspace)
8. [Conversation Details: Media, Links & Docs](#8-conversation-details-media-links--docs)
9. [Dedicated Full-Page Settings](#9-dedicated-full-page-settings)
10. [Socket.IO Real-Time Event Protocol](#10-socketio-real-time-event-protocol)
11. [HTTP REST API Reference](#11-http-rest-api-reference)
12. [Local Development & Setup Guide](#12-local-development--setup-guide)
13. [Testing & Quality Verification](#13-testing--quality-verification)
14. [Security & Privacy Architecture](#14-security--privacy-architecture)

---

## 1. Project Overview

**PulseChat** is a production-quality, resume-worthy real-time messaging application designed for engineering teams, communities, and modern workplaces. It solves distributed state coordination, durable message persistence, granular room authorization, and rich editorial user experiences:

- **Durable Persistence**: All user accounts, public channels, direct messages, private groups, message revisions, emoji reactions, conversation media, and AI summaries persist in MongoDB.
- **Genuine Account Authentication**: Robust bcrypt password hashing (10 salt rounds), JSON Web Tokens (JWT) in secure HTTP-only cookies and bearer headers, input validation via Zod schemas, and rate-limited auth endpoints.
- **True Multi-Device Real-Time Synchronization**: Room authorization enforced server-side. Socket connections map to user identity, supporting multi-tab and multi-device synchronization without identity clashes.
- **Slate & Arctic Cyan Visual Direction**: A cohesive, professional, gender-neutral aesthetic supporting dark and light themes with zero-flash persistence and WCAG 2.2 AA compliant contrast.

---

## 2. Visual Identity & Design System: Slate & Arctic Cyan

PulseChat implements a cohesive **Slate & Arctic Cyan** design system:

### Core Color Palette
| Color Name | Hex Code | Intended Usage |
| :--- | :---: | :--- |
| **Deep Slate** | `#242B35` | Primary dark background, typography on light theme, deep surfaces |
| **Steel Blue** | `#364353` | Sidebars, incoming message bubbles in dark mode, elevated surfaces |
| **Muted Slate** | `#627487` | Secondary text, inactive tab borders, subdued controls |
| **Arctic Cyan** | `#55A9C7` | Active icons, accents, brand highlights, hover states |
| **Strong Cyan** | `#287F9F` | Outgoing message bubbles, primary action buttons, links |
| **Ice Grey** | `#E3EAF0` | Light theme dividers, incoming message bubbles in light mode |
| **Cloud White** | `#F7F9FB` | Light theme main background, card surfaces |

### Light & Dark Themes
- **Light Theme**: Cloud White (`#F7F9FB`) application background, Ice Grey (`#E3EAF0`) message bubbles and dividers, Deep Slate (`#242B35`) primary text, Strong Cyan (`#287F9F`) for buttons, and Arctic Cyan (`#55A9C7`) for accents.
- **Dark Theme**: Deep Slate (`#242B35`) main canvas, Steel Blue (`#364353`) sidebars and panels, light accessible text, and Arctic Cyan highlights.
- **Zero-Flash Persistence**: Active theme is stored in `localStorage` and automatically syncs with system preferences (`prefers-color-scheme`).

---

## 3. Architecture Overview & Diagram

```mermaid
flowchart TD
    subgraph Client ["Frontend Client (React 18 + Vite + TS)"]
        UI["UI Layer (Slate & Arctic Cyan Design Tokens)"]
        Router["App & Route System (/settings, /)"]
        AuthCtx["Auth Context (JWT / State)"]
        SocketCtx["Socket.IO Client Layer"]
        QueryClient["TanStack React Query Cache"]
        AIWorkspace["Chatterly AI Conversational Workspace"]
        DetailsPanel["Context Panel (Media, Links & Docs)"]
    end

    subgraph Server ["Backend Server (Node.js + Express + TS)"]
        HTTPGateway["Express API Gateway & Rate Limiters"]
        AuthMiddleware["JWT Authentication & RBAC Middleware"]
        SocketGateway["Socket.IO Server (Auth Handshake & Broadcasts)"]
        
        subgraph Controllers ["Controllers & Business Logic"]
            AuthController["Auth Controller"]
            ConvController["Conversation Controller (Media/Links/Docs)"]
            MsgController["Message Controller"]
            AIController["Chatterly AI Intelligence Controller"]
            UserController["User Profile & Avatar Controller"]
        end
    end

    subgraph Storage ["Durable Persistence & Object Storage"]
        MongoDB[("MongoDB 7.0+\nMongoose ODM\n(Users, Convs, Messages, Attachments)")]
        DiskStorage[("Static Uploads\n/uploads (Avatars & Files)")]
    end

    UI --> Router
    Router --> AuthCtx
    Router --> SocketCtx
    AuthCtx --> HTTPGateway
    QueryClient --> HTTPGateway
    SocketCtx <-->|WebSocket Stream\n(chat:send, user:profile_updated)| SocketGateway

    HTTPGateway --> AuthMiddleware
    AuthMiddleware --> AuthController
    AuthMiddleware --> ConvController
    AuthMiddleware --> MsgController
    AuthMiddleware --> AIController
    AuthMiddleware --> UserController

    AuthController --> MongoDB
    ConvController --> MongoDB
    MsgController --> MongoDB
    UserController --> MongoDB
    HTTPGateway --> DiskStorage
    SocketGateway <--> MongoDB
```

---

## 4. Technology Stack

### Frontend Architecture
- **Framework**: React 18, Vite 6, TypeScript 5 (Strict Mode)
- **State Management**: TanStack React Query 5 (Server State, Caching) & React Context (Auth, Theme, Socket)
- **Real-Time Client**: Socket.IO Client 4.8
- **HTTP Client**: Axios with automatic request interception and error handling
- **Icons**: Lucide React
- **Design Tokens**: Pure Vanilla CSS Custom Properties (Zero runtime CSS-in-JS overhead)
- **Testing**: Vitest, React Testing Library, JSDOM

### Backend Architecture
- **Runtime**: Node.js 20+, Express 4/5, TypeScript 5
- **Database & ODM**: MongoDB 7.0+, Mongoose 8
- **Real-Time Engine**: Socket.IO 4.8 with authenticated connection handshake
- **Authentication**: bcryptjs (Password hashing), JSON Web Tokens (JWT)
- **Validation**: Zod schema validation
- **Security & Reliability**: Helmet, express-rate-limit, cookie-parser, multer
- **Structured Logging**: Pino with pino-pretty
- **Testing**: Vitest, Supertest

---

## 5. Key Features & Capabilities

### 🔒 1. Authentic Authentication & User Management
- Dedicated, polished Sign In and Create Account screens (no developer-facing copy).
- Passwords hashed using bcrypt with salt rounds; password visibility toggles.
- Real-time profile synchronization across active client sessions.

### 💬 2. Direct Messaging (1-on-1) & Contact Discovery
- Search users by name or username across the platform.
- Idempotent conversation generation preventing duplicate 1-on-1 direct conversations.
- Real-time online/offline presence indicators.

### 👥 3. Persistent Channels & Private Groups
- Pre-seeded persistent public channels: `#general`, `#developers`, `#gaming`, `#random`.
- Create private group conversations with description and member checklists.
- 6-character uppercase invitation codes with instant copy button.
- Join private groups seamlessly via code (`/api/conversations/join`).
- Role-based permissions (Owner, Admin, Member).

### ✉️ 4. Rich Messaging Timeline & Composer
- Outgoing message bubbles in Strong Cyan (`#287F9F`) with white text and delivery indicators (`✓✓`).
- Incoming message bubbles in Ice Grey / Steel Blue with Deep Slate text.
- Message editing and soft deletion (`isDeleted` tombstone preserving conversation flow).
- Reply-to-message quotation banners.
- Emoji reactions with count pills and tooltip attribution.
- Message attachments: images with inline previews, documents/PDFs with download cards.
- Cursor-based message history pagination ("Load older messages").
- In-conversation text search.

---

## 6. Persistent Avatar & Profile Picture System

PulseChat features a universal, persistent avatar system:

1. **Uploaded Picture Display**: Whenever a user has uploaded a profile picture, their photo is displayed consistently everywhere.
2. **Dynamic Initial Fallback**: When no picture exists, an initial dynamically derived from their display name (e.g., Jui Tawde ➔ `J`, Rahul Sharma ➔ `R`) is rendered in a circular container with Slate & Arctic Cyan styling.
3. **Graceful Error Handling**: If an image fails to load, `onError` automatically falls back to the dynamic initial. The image and initial are **never** shown simultaneously.
4. **Settings Profile Management**:
   - Upload JPEG, PNG, or WebP files up to 5MB from device.
   - Real-time preview before saving.
   - Instant replacement and one-click removal (reverts to initial).
5. **Real-Time Propagation**: Updates broadcast via Socket.IO (`user:profile_updated`), instantly updating all open messages, participant rosters, and conversations across all connected clients without requiring a page reload.

---

## 7. Chatterly AI Conversational Workspace

Chatterly AI is a first-class citizen in the main navigation sidebar:

- **Dedicated Chat Workspace**: Open by clicking "Chatterly AI" in the primary navigation rail or sidebar.
- **Intelligent Engineering Assistant**: Ask programming questions, debug code, discuss architectural patterns, and brainstorm features.
- **Markdown Rendering**: Formatted headings, bullet points, inline code, and syntax-highlighted code blocks.
- **Starter Prompts**: Quick prompt cards (e.g., "Explain WebSockets vs SSE", "Debug React re-renders", "Architecture advice").
- **Interactive Actions**: One-click copy response, restart conversation session, and persistent chat history.
- **Backend Model Integration**: Connects to Google Gemini 1.5 Flash when `GEMINI_API_KEY` is configured; automatically falls back to Chatterly's built-in engineering assistant engine if unconfigured.

---

## 8. Conversation Details: Media, Links & Docs

Clicking the info icon on any channel, direct message, or group opens the WhatsApp-inspired conversation panel with 4 dedicated tabs:

1. **Overview**: Channel description, invite code with copy action, mute notifications, archive channel, and member roster with uploaded avatars.
2. **Media**: Thumbnail grid of real persisted images shared in that conversation. Clicking any image opens a full-resolution viewer modal.
3. **Links**: Automatic extraction of all URLs shared in messages, displaying domain badge, sender, timestamp, copy link, and open link actions.
4. **Docs**: File cards for uploaded documents and archives showing filename, format, size in KB/MB, upload date, and download button.

---

## 9. Dedicated Full-Page Settings

> **Strict Architectural Rule**: Settings is a dedicated full page (`/settings`), **never** a modal or floating overlay.

Sections included in `/settings`:
- **Profile**: Display name, username, profile picture upload/preview/replace/remove.
- **Appearance**: Light, Dark, or System theme toggle with live preview cards.
- **Notifications**: Desktop notifications, sound effects, email digests.
- **Privacy & Security**: Password change with current password verification, session security.
- **Chat Preferences**: Enter-to-send toggle, compact message density, code snippets.
- **Account**: Account deletion and sign out.

---

## 10. Socket.IO Real-Time Event Protocol

Every socket connection authenticates during the handshake via `socket.handshake.auth.token`.

| Event Name | Direction | Payload | Description |
| :--- | :---: | :--- | :--- |
| `room:join` | Client ➔ Server | `{ room: string }` | Verifies membership and joins channel/conversation room |
| `chat:send` | Client ➔ Server | `{ room, message, type, replyTo, attachments, idempotencyKey }` | Persists message to MongoDB and broadcasts |
| `chat:receive` | Server ➔ Room | Full `Message` Object | Delivers message to all participants in real time |
| `typing:start` | Client ➔ Server | `{ room: string }` | Triggers typing indicator |
| `typing:stop` | Client ➔ Server | `{ room: string }` | Cancels typing indicator |
| `typing:update` | Server ➔ Room | `{ username, isTyping, room }` | Emits typing state to conversation participants |
| `reaction:toggle`| Client ➔ Server | `{ messageId, emoji }` | Toggles emoji reaction in MongoDB |
| `reaction:update`| Server ➔ Room | `{ messageId, reactions }` | Broadcasts aggregated reaction counts to room |
| `presence:update`| Server ➔ Global | `{ users: [...] }` | Broadcasts online user roster changes |
| `user:profile_updated` | Server ➔ Global | `{ userId, displayName, avatar }` | Broadcasts avatar/profile changes to all active clients |
| `notification:new`| Server ➔ User | Full `Notification` Object | Delivers private in-app notification to `user:<id>` |

---

## 11. HTTP REST API Reference

All protected endpoints require `Authorization: Bearer <token>` or HTTP-only cookie.

### Authentication (`/api/auth`)
- `POST /register`: Register new account `{ username, displayName, email, password }`
- `POST /login`: Authenticate `{ identifier, password }`
- `POST /logout`: Clear session
- `GET /me`: Get authenticated user profile
- `PATCH /profile`: Update `{ displayName, statusMessage, theme }`
- `POST /change-password`: Update password `{ currentPassword, newPassword }`

### Users & Avatars (`/api/users`)
- `POST /avatar`: Upload profile picture (Multipart JPEG/PNG/WebP, 5MB limit)
- `DELETE /avatar`: Remove profile picture and revert to initial
- `GET /search?q=`: Search users by name or username
- `POST /upload`: Multipart form file upload (25MB limit)

### Conversations (`/api/conversations`)
- `GET /`: List all conversations with last message and unread counts
- `POST /direct`: Find or create direct message conversation `{ recipientId }`
- `POST /group`: Create private group `{ name, description?, memberIds? }`
- `POST /join`: Join group by invite code `{ code }`
- `GET /:id`: Get conversation metadata and members roster
- `GET /:id/media`: Retrieve image attachments shared in conversation
- `GET /:id/links`: Extract shared URLs and domains from conversation
- `GET /:id/docs`: Retrieve document attachments shared in conversation
- `POST /:id/leave`: Leave private group
- `POST /:id/archive`: Toggle archived status
- `POST /:id/mute`: Toggle muted notification status

### Messages (`/api`)
- `GET /conversations/:id/messages?before=&limit=30`: Cursor-based message history
- `POST /conversations/:id/messages`: Post message `{ content, type?, replyTo?, attachments?, idempotencyKey? }`
- `PATCH /messages/:id`: Edit message content (author only)
- `DELETE /messages/:id`: Soft delete message (author or admin)
- `POST /messages/:id/reactions`: Toggle emoji reaction `{ emoji }`
- `POST /messages/:id/pin`: Toggle message pin state

### AI Assistant (`/api/ai`)
- `POST /chat`: Multi-turn conversational AI assistance `{ message, history }`
- `POST /summarize`: Structured conversation catch-up digest `{ conversationId, scope: 'recent-24h' | 'last-50' | 'all-unread' }`

---

## 12. Local Development & Setup Guide

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **MongoDB**: v6.0 or higher running on `mongodb://127.0.0.1:27017`

### Environment Variables
Create `.env` in the `server` directory (or use `.env.example`):
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/pulsechat
JWT_SECRET=pulsechat_dev_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
UPLOAD_DIR=uploads
MAX_FILE_SIZE=26214400
GEMINI_API_KEY=your_optional_gemini_api_key_here
```

### Installation & Running Locally
```bash
# 1. Install dependencies for root, server, and client
npm run install:all

# 2. Run both server and client concurrently
npm run dev

# Backend runs on: http://localhost:5000
# Frontend runs on: http://localhost:5173
```

---

## 13. Testing & Quality Verification

Run the comprehensive test suite and production builds:

```bash
# Run all unit and integration tests (Server & Client)
npm test

# Run production build (Server TypeScript + Client Vite bundle)
npm run build
```

### Verified Test Results
- **Server Test Suite**: 3 test files, 16 tests passed (`auth.test.ts`, `conversation.test.ts`, `features.test.ts`).
- **Client Test Suite**: 3 test files, 10 tests passed (`Avatar.test.tsx`, `Button.test.tsx`, `ThemeContext.test.tsx`).
- **Total**: 26 automated tests passing with 0 failures.
- **Production Build**: 0 errors, 0 warnings.
>>>>>>> c3cfc63 (main)

- Real-time typing status
- Typing indicators are visible only to users in the same conversation
- Typing automatically stops when the user stops typing

<<<<<<< HEAD
### 🔒 Direct Messaging

Users can send private messages directly to another online user.

Features include:

- Private sender-to-recipient delivery
- Previous DM history during the session
- Private conversation list
- Unread message indicators
- Real-time message delivery

### 👥 Private Groups

Users can create private group conversations.

Group features include:

- Custom group name
- Select multiple users while creating a group
- Unique invitation code
- Private membership
- Group message history
- Group member list
- Join group using invitation code
- Leave group functionality

Example group code:

```text
PHX-7K4M-92Q
```

### 🎨 Modern UI

PulseChat includes a premium dark-themed interface with:

- Three-column desktop layout
- Conversation sidebar
- Main chat area
- Members/context sidebar
- Toast notifications
- Message animations
- Hover interactions
- Responsive mobile layout
- Mobile navigation drawers

### 📝 Message Composer

The message composer supports:

- Emoji button
- Attachment/add button
- Enter to send
- Shift + Enter for a new line
- Send button

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Socket.IO Client

### Backend

- Node.js
- Express.js
- Socket.IO
- CORS
- dotenv

### Development

- Nodemon
- npm

---

## 📂 Project Structure

```text
JUI_TAWDE/
│
├── public/
│   ├── index.html
│   ├── app.js
│   └── style.css
│
├── sockets/
│   ├── chatHandler.js
│   ├── userHandler.js
│   ├── roomHandler.js
│   ├── groupHandler.js
│   └── dmHandler.js
│
├── utils/
│   ├── messageStore.js
│   ├── groupStore.js
│   └── historyStore.js
│
├── docs/
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## 🔌 Socket.IO Events

PulseChat uses Socket.IO events for real-time communication.

### User Events

```text
user:login
```

Handles user login and registration of the user's socket connection.

### Room Events

```text
room:join
room:history
room:userlist
room:leave
```

These events handle joining, leaving, history retrieval and member updates for public rooms.

### Chat Events

```text
chat:send
chat:receive
```

Used for sending and receiving real-time public channel messages.

### Typing Events

```text
typing:start
typing:stop
typing:update
```

Used to broadcast typing activity to users in the current conversation.

### Direct Message Events

```text
direct:send
direct:receive
```

Used for private one-to-one communication.

### Private Group Events

```text
group:create
group:join
group:leave
group:history
group:userlist
```

Used to create and manage private group conversations.

---

## 🧠 Message History

PulseChat currently uses an **in-memory message store**.

For each conversation, the application retains the latest **50 messages**.

This allows users joining or reopening a conversation during the active server session to receive recent message history.

> Note: Since the current implementation uses in-memory storage, message history is cleared when the server restarts.

---

## 🔄 How PulseChat Works

```text
User
  │
  │ Connects
  ▼
Socket.IO Client
  │
  │ WebSocket Events
  ▼
Express + Socket.IO Server
  │
  ├── User Management
  ├── Room Management
  ├── Public Messaging
  ├── Direct Messaging
  ├── Private Groups
  ├── Typing Indicators
  └── Message History
  │
  ▼
Connected Users
```

---

## 💻 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
```

### 2. Navigate to the Project

```bash
cd JUI_TAWDE
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Application

For development:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

### 5. Open the Application

Visit:

```text
http://localhost:5000
```

---

## 📦 Dependencies

The project uses the following main dependencies:

```text
express
socket.io
cors
dotenv
nodemon
```

Dependencies can be installed using:

```bash
npm install
```

---

## 🧪 Testing

The application can be tested by opening PulseChat in multiple browser tabs or windows.

### Test 1: Multiple Users

1. Open PulseChat in two browser tabs.
2. Log in using different usernames.
3. Verify that both users appear in the online member list.

### Test 2: Public Messaging

1. Join the same channel from two tabs.
2. Send a message from one user.
3. Verify that the message appears instantly for the other user.

### Test 3: Room Isolation

1. Open two different channels.
2. Send a message in one channel.
3. Verify that users in the other channel do not receive the message.

### Test 4: Typing Indicator

1. Start typing from one user.
2. Verify that the other user sees the typing indicator.
3. Stop typing and verify that the indicator disappears.

### Test 5: Direct Messaging

1. Open a private conversation with another online user.
2. Send a message.
3. Verify that only the sender and recipient receive the message.

### Test 6: Private Groups

1. Create a private group.
2. Select users to invite.
3. Generate the group invitation code.
4. Join the group using the code.
5. Verify that only group members can access the conversation.

### Test 7: Message History

1. Send several messages in a channel.
2. Leave and rejoin the channel.
3. Verify that recent messages are restored.

---

## 📸 Screenshots

<img width="1470" height="956" alt="Screenshot 2026-09-10 at 9 13 53 PM" src="https://github.com/user-attachments/assets/54335f37-0645-484b-bd73-b598f146137e" />

<img width="1470" height="956" alt="Screenshot 2026-09-10 at 8 54 05 PM" src="https://github.com/user-attachments/assets/71a31a8a-b899-4b5b-be6b-fee89d93c00c" />

<img width="1470" height="956" alt="Screenshot 2026-09-10 at 8 54 23 PM" src="https://github.com/user-attachments/assets/42af5f4f-4099-4c3f-9e5b-c95171e8cdd0" />

<img width="1470" height="956" alt="Screenshot 2026-09-10 at 8 54 40 PM" src="https://github.com/user-attachments/assets/88cde37a-f16a-44ff-becc-8b0a6a07d43e" />

<img width="1470" height="956" alt="Screenshot 2026-09-10 at 8 55 12 PM" src="https://github.com/user-attachments/assets/39826849-55a3-4cfc-b5fc-23f6fe03b014" />

<img width="1470" height="956" alt="Screenshot 2026-09-10 at 8 55 20 PM" src="https://github.com/user-attachments/assets/32bfdb70-a271-44b0-a8d2-78a52027f944" />

---

## 🔐 Privacy & Security

Private conversations are handled using Socket.IO events and server-side membership information.

For private groups:

- Only members can access group messages.
- Group invitation codes are required to join.
- Group messages are not broadcast to public channels.

> This project is intended as an academic demonstration. Additional authentication, authorization, database persistence and production-grade security would be required for a real-world deployment.

---

## 📱 Responsive Design

PulseChat is designed to work across different screen sizes.

### Desktop

- Three-column layout
- Channel and conversation sidebar
- Main chat area
- Members/context panel

### Mobile

- Sidebars become navigation drawers
- Main conversation remains accessible
- Responsive message composer
- Optimized spacing and controls

---

## 🚀 Deployment

PulseChat is deployed using **Render**.

### Live Application

https://realtime-chat-app-e3ab.onrender.com/

The application runs the Node.js/Express server and serves the frontend from the same application.

---

## 🔮 Future Improvements

Possible future improvements include:

- MongoDB or PostgreSQL message persistence
- User authentication with passwords or OAuth
- Image and file sharing
- Message reactions
- Message editing and deletion
- Read receipts
- Push notifications
- Voice and video calls
- Searchable message history
- Admin and moderation controls
- End-to-end encryption
- Scalable multi-server Socket.IO deployment using Redis

---

## 📚 Learning Outcomes

This project demonstrates practical implementation of:

- Real-time WebSocket communication
- Socket.IO event-driven architecture
- Client-server communication
- Express.js server development
- Room-based messaging
- Private messaging
- Group communication
- User presence management
- Typing indicators
- In-memory data management
- Frontend-backend integration
- Responsive web design

---

## 👨‍💻 Project

**Project Name:** PulseChat  
**Assignment:** ITM Assignment 13 – Real-Time Chat Application  
**Technology:** Node.js + Express.js + Socket.IO  
**Deployment:** Render

---

## 📄 License

This project was created for educational and academic purposes.
=======
## 14. Security & Privacy Architecture

- **No Secrets in Frontend**: Secrets and API keys remain strictly on the backend.
- **Sanitized AI Prompts**: Only authorized messages from the requested conversation are analyzed.
- **Input Validation**: All payloads validated with Zod schemas.
- **Multer Upload Sanitization**: Mime-type whitelisting and size limits prevent arbitrary file upload vulnerabilities.
- **Granular Room Authorization**: Socket.IO join events verify membership before emitting real-time messages.
>>>>>>> c3cfc63 (main)
