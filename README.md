
## 🚀 Installation & Local Execution

Ensure you have **Node.js (v16+)** installed on your system.

### 1. Set Up the Backend WebSocket Tower

Open a fresh terminal panel, navigate to the server module, and boot the runtime thread:

```bash
cd whiteboard-server
npm install
npm run dev

```

The console will verify the socket connection gateway is online:
`[INFO] ts-node-dev server running...`
`Server streaming on port 3001`

### 2. Set Up the Frontend Interface

Open a second isolated terminal window, navigate to the parent project directory, and start the Vite app:

```bash
# From the parent COMPANY_ASSIGNMENT folder
npm install
npm run dev

```

Vite will render a local address frame, usually mapping to: `http://localhost:5173`

### 3. Simulating Collaborative Environments

To witness real-time tracking loops without multiple physical computers:

1. Fire up your primary web browser window and hit `http://localhost:5173`.
2. Launch a completely separate **Incognito / Private Window** alongside it at the same URL.
3. Draw or move your cursor inside Window A—you will immediately notice smooth yellow tracking markers and paths reflecting live inside Window B.

---

## 🧠 Utilizing the Machine Learning Feature

1. Ensure your canvas tool toggle is adjusted to **✏️ Draw** mode or **🤚 Panning** mode.
2. Click the blue **📷 Predict** button embedded in the floating dock dashboard.
3. Select a clear JPEG or PNG picture from your local file system (e.g., a laptop, cat, coffee mug).
4. The loader will briefly display `AI...` while downloading the lightweight weights matrix.
5. The system will cleanly drop your image on the board, run client-side inference, and stamp a vibrant green classification tracking badge directly over the target asset in real-time.

---

## 📝 Future Scope Enhancements

* **Shareable Dynamic Rooms:** Integrating customizable URL search params (`?room=unique-id`) to break away from the root room framework and allow secure personal whiteboards.
* **Complex Geometry Vectors:** Dedicated buttons to instantly spawn perfect structural shapes like straight lines, circles, boxes, and rich HTML editable annotation nodes.
* **AI-Driven Bounding Boxes:** Expanding the TensorFlow data payload to trace precise object coordinates and render interactive bounds outlines around predicted targets automatically.


# 🎨 Real-Time Smart Whiteboard

A sleek, modern, and interactive full-stack collaborative whiteboard application. This platform combines high-performance vector graphics canvas manipulation, instant multi-user synchronization, and edge client-side machine learning inference for real-time object classification on uploaded images.

---

## ✨ Features

- **🎨 Advanced Vector Workspace:** Powered by Fabric.js with customizable brush thickness, interactive dynamic hex-color pickers, and fluid interactive scaling.
- **🤚 Canvas Panning Mode:** Seamless workspace exploration with a simple toggle switch between real-time drawing and coordinate canvas panning.
- **🔄 Complete State Ledger (Undo/Redo):** Comprehensive history tracking mechanics that maintain user action nodes for clean reversion states.
- **🤖 Browser-Side Machine Learning:** Seamless execution of the deep MobileNet neural network model via TensorFlow.js directly in the client browser—no API costs or external processing latencies.
- **⚡ High-Performance Sync Pipeline:** Scalable WebSockets communication tier using Socket.IO that delivers flicker-free vector delta synchronization and real-time remote cursor pooling.
- **💾 High-Fidelity Asset Generation:** Local rendering pipeline to compile complex multi-layered boards (drawings, images, and HTML text properties) into high-resolution PNG downloads.
- **💎 Frosted Glass Dashboard UI:** Clean Minimalist user experience built using premium floating glassmorphism structural layouts and hover micro-interactions.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework:** React with TypeScript (Vite Engine)
- **Canvas Interface:** Fabric.js (Modern Promise-Driven API Structure)
- **Machine Learning Client:** TensorFlow.js (`@tensorflow/tfjs`) & MobileNet Object Identification Model
- **Real-Time Client Driver:** Socket.IO Client
- **Styling Architecture:** Modern CSS Glassmorphism with Bootstrap Layout Components

### Backend Infrastructure
- **Runtime Environment:** Node.js
- **Framework Application Server:** Express
- **Networking Server Communication:** Socket.IO (Configured with highly permissive CORS for development flexibility)
- **Development Process Manager:** `ts-node-dev` for real-time compilation and hot reloading.

---

## 📂 System File Layout

```text
COMPANY_ASSIGNMENT/
├── src/
│   ├── components/
│   │   ├── Whiteboard.tsx     # Pure functional component logic & socket listeners
│   │   └── Whiteboard.css     # Glassmorphism design system & micro-interactions
│   ├── App.tsx                # Main entry point
│   └── main.tsx               # Bootstrap client mounter
├── whiteboard-server/
│   ├── server.ts              # Express / Socket.IO collaboration gateway
│   ├── package.json           # Backend dependency manifests
│   └── tsconfig.json          # Node TypeScript configuration
├── package.json               # Frontend dependency manifests
└── vite.config.ts             # Vite development pipeline rules

```

---

## 🚀 Installation & Local Execution

Ensure you have **Node.js (v16+)** installed on your system.

### 1. Set Up the Backend WebSocket Tower

Open a fresh terminal panel, navigate to the server module, and boot the runtime thread:

```bash
cd whiteboard-server
npm install
npm run dev

```

The console will verify the socket connection gateway is online:
`[INFO] ts-node-dev server running...`
`Server streaming on port 3001`

### 2. Set Up the Frontend Interface

Open a second isolated terminal window, navigate to the parent project directory, and start the Vite app:

```bash
# From the parent COMPANY_ASSIGNMENT folder
npm install
npm run dev

```

Vite will render a local address frame, usually mapping to: `http://localhost:5173`

### 3. Simulating Collaborative Environments

To witness real-time tracking loops without multiple physical computers:

1. Fire up your primary web browser window and hit `http://localhost:5173`.
2. Launch a completely separate **Incognito / Private Window** alongside it at the same URL.
3. Draw or move your cursor inside Window A—you will immediately notice smooth yellow tracking markers and paths reflecting live inside Window B.

---

## 🧠 Utilizing the Machine Learning Feature

1. Ensure your canvas tool toggle is adjusted to **✏️ Draw** mode or **🤚 Panning** mode.
2. Click the blue **📷 Predict** button embedded in the floating dock dashboard.
3. Select a clear JPEG or PNG picture from your local file system (e.g., a laptop, cat, coffee mug).
4. The loader will briefly display `AI...` while downloading the lightweight weights matrix.
5. The system will cleanly drop your image on the board, run client-side inference, and stamp a vibrant green classification tracking badge directly over the target asset in real-time.

---

## 📝 Future Scope Enhancements

* **Shareable Dynamic Rooms:** Integrating customizable URL search params (`?room=unique-id`) to break away from the root room framework and allow secure personal whiteboards.
* **Complex Geometry Vectors:** Dedicated buttons to instantly spawn perfect structural shapes like straight lines, circles, boxes, and rich HTML editable annotation nodes.
* **AI-Driven Bounding Boxes:** Expanding the TensorFlow data payload to trace precise object coordinates and render interactive bounds outlines around predicted targets automatically.

```

### How to commit this new file along with your changes:
Run these commands in your terminal to save everything cleanly up to your repository:

```bash
git add README.md
git commit -m "docs: add comprehensive product README with instructions"
git push

```
