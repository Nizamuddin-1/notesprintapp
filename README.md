# Project 3: NoteSprint (Markdown Notes App)

A MERN stack project demonstrating **Multi-Environment Promotion** (`development` vs `production`), **GitHub Environment Protection Rules (Manual Approval Gates)**, and automated deployments to **AWS EC2 (Backend via PM2) + AWS S3 (Frontend)**.

---

## 🏗 Multi-Environment Architecture

```
[ Push to main ]
       │
       ▼
   [ Stage 1: CI ] ────► Tests & Build check
       │
       ▼
[ Stage 2: Deploy Dev ] ────► Backend to Dev EC2 (PM2) + Frontend to Dev S3
       │
       ▼
[ ⏸ MANUAL APPROVAL GATE ] ────► Pauses until Reviewer approves in GitHub UI
       │
       ▼
[ Stage 3: Deploy Prod ] ────► Backend to Prod EC2 (PM2) + Frontend to Prod S3
```

---

## 🛠 Local Setup

### Backend
```bash
cd backend
npm install
npm test
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
npm run build
```

---

## 🚀 GitHub Setup: Environments & Secrets

Go to your repository on GitHub -> **Settings** -> **Environments**:

### 1. `development` Environment
- No approval gate required (auto-deploys on push to `main`).
- **Environment Variables**:
  - `API_URL`: `http://<DEV_EC2_IP>:5000`
  - `FRONTEND_URL`: `http://<DEV_S3_BUCKET>.s3-website-<REGION>.amazonaws.com`
  - `PORT`: `5000`
  - `PM2_APP_NAME`: `notesprint-dev`
  - `APP_DIR`: `notesprint-dev`
- **Environment Secrets**:
  - `EC2_HOST`: IP/DNS of your EC2 instance
  - `EC2_USER`: `ubuntu`
  - `EC2_SSH_KEY`: Content of your `.pem` key
  - `S3_BUCKET`: Name of your Dev S3 bucket
  - `MONGO_URI`: `mongodb+srv://.../notesprint_dev`

---

### 2. `production` Environment
- Under **Deployment protection rules**, check **Required reviewers** and add your GitHub username!
- **Environment Variables**:
  - `API_URL`: `http://<PROD_EC2_IP>:5001` (or separate instance)
  - `FRONTEND_URL`: `http://<PROD_S3_BUCKET>.s3-website-<REGION>.amazonaws.com`
  - `PORT`: `5001`
  - `PM2_APP_NAME`: `notesprint-prod`
  - `APP_DIR`: `notesprint-prod`
- **Environment Secrets**:
  - `EC2_HOST`: IP/DNS of your EC2 instance (can be same instance or separate prod instance)
  - `EC2_USER`: `ubuntu`
  - `EC2_SSH_KEY`: Content of your `.pem` key
  - `S3_BUCKET`: Name of your Production S3 bucket
  - `MONGO_URI`: `mongodb+srv://.../notesprint_prod`

---

### 3. Repository-Level Secrets (Shared)
Under **Settings** -> **Secrets and variables** -> **Actions**:
- `AWS_ACCESS_KEY_ID`: IAM user access key
- `AWS_SECRET_ACCESS_KEY`: IAM user secret key
- `AWS_REGION`: e.g. `us-east-1`
