# 🏢 Udyam OpenBiz

Udyam OpenBiz is a **full-stack monorepo application** for Udyam Registration Automation.  
It consists of a **React + Vite frontend** and a **Node.js + Express backend** that work together to allow enterprises to register for Udyam using Aadhaar verification and OTP.

---

## 📌 Features

- **Step-based form** with progress bar
- **Dynamic form rendering** from JSON schema
- Aadhaar OTP verification
- Application submission to backend
- Input validation with error handling
- Responsive design with Tailwind CSS
- REST API integration
- Dockerized for easy deployment

---

## 🛠 Tech Stack

**Frontend**
- React 18
- Vite
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- Zod (schema validation)
- CORS
- Prisma (if DB is connected)

**Development**
- Nodemon (backend auto-restart)
- ESLint
- Docker & Docker Compose

---

## 📂 Folder Structure

```
udyam-openbiz/
│
├── backend/                 # Backend server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── prisma/          # Prisma schema & DB config (if used)
│   │   ├── index.js         # Entry point
│   │   └── app.js           # Express app config
│   ├── package.json
│   ├── .env                 # Backend env vars
│   └── .gitignore
│
├── frontend/                # Frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── schema/          # JSON schemas for dynamic forms
│   │   ├── App.jsx
│   │   └── api.js           # Axios instance
│   ├── package.json
│   ├── vite.config.js
│   ├── .gitignore
│   └── .env                 # Frontend env vars
│
├── docker-compose.yml       # Multi-container configuration
├── Dockerfile.frontend      # Frontend Docker config
├── Dockerfile.backend       # Backend Docker config
├── nginx.conf               # Nginx config for frontend
├── README.md
└── .gitignore
```

---

## 🖼 Screenshots

### Step 1: Aadhaar Verification  
<img width="1890" height="855" alt="image" src="https://github.com/user-attachments/assets/e7e5270a-3b7c-4d3c-8194-cebd438ab376" />

### Step 2: Application Form  
<img width="1889" height="866" alt="image" src="https://github.com/user-attachments/assets/d8de8e8e-9f2e-45cd-8aee-1bce96ca56bc" />
<img width="1893" height="854" alt="image" src="https://github.com/user-attachments/assets/a38db408-81b7-437f-8530-a2a8a2a8ea88" />

---

## ⚙️ Installation & Running (Local)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/viz-83/udyam-openbiz.git
cd udyam-openbiz
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```env
PORT=5000
DATABASE_URL=your_database_url_if_any
```

Run backend:
```bash
npm run dev
```
Backend will run on **http://localhost:5000**

---

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
```

Create `.env` file in `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run frontend:
```bash
npm run dev
```
Frontend will run on **http://localhost:5173**

---

## 🐳 Running with Docker

This project includes **Docker & Docker Compose** configuration for easy deployment.

### 1️⃣ Build the containers
```bash
docker-compose build
```

### 2️⃣ Run the containers
```bash
docker-compose up
```

The following services will be available:
- **Frontend** → [http://localhost:3000](http://localhost:3000)
- **Backend API** → [http://localhost:5000](http://localhost:5000)

---

### 3️⃣ Stopping containers
```bash
docker-compose down
```

---

### 4️⃣ Prisma binary fix for Docker
If you get the error:
```
Prisma Client could not locate the Query Engine for runtime "debian-openssl-3.0.x"
```
Open `backend/prisma/schema.prisma` and update:
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```
Then run:
```bash
cd backend
npx prisma generate
```
Rebuild Docker:
```bash
docker-compose build --no-cache
docker-compose up
```

---

## 📡 API Endpoints

| Method | Endpoint                  | Description                    |
|--------|---------------------------|--------------------------------|
| POST   | `/api/otp/send`           | Send Aadhaar OTP               |
| POST   | `/api/applications/submit`| Submit application form        |
| GET    | `/health`                 | Health check                   |

---

## 📋 Environment Variables

### Backend
| Variable         | Description                     |
|------------------|---------------------------------|
| `PORT`           | Server port                     |
| `DATABASE_URL`   | Prisma DB connection string     |

### Frontend
| Variable             | Description                          |
|----------------------|--------------------------------------|
| `VITE_API_BASE_URL`  | API base URL (backend)                |

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch  
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes  
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch  
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
