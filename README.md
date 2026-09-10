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

- Real-time typing status
- Typing indicators are visible only to users in the same conversation
- Typing automatically stops when the user stops typing

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
