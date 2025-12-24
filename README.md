# SmartFinance: AI-Powered Financial Analytics Platform

![Status](https://img.shields.io/badge/Status-MVP_Complete-success)
![Stack](https://img.shields.io/badge/Tech-React_FastAPI_PostgreSQL_Docker-blue)
![AI](https://img.shields.io/badge/GenAI-Google_Gemini_2.0-orange)
![Feature](https://img.shields.io/badge/Feature-Real_Time_Alerts-red)

## 🚀 Executive Summary
SmartFinance is a full-stack financial SaaS platform designed to mimic core functionalities of **QuickBooks** and **Mint**. It leverages **Generative AI (LLMs)** to automate transaction categorization, solving the "cold start" problem in personal finance tracking.

Unlike standard CRUD apps, SmartFinance features a **Fault-Tolerant Hybrid Architecture**: it uses Google's Gemini 2.0 Flash for intelligent data enrichment but automatically fails over to a deterministic Rule-Based Engine if API rate limits or latency issues occur.

**New in v1.1:** The platform now includes a proactive **Alerting Engine** acting as an "Incident Response" system for your budget, preventing overspending via real-time threshold monitoring.
## 🏗️ Technical Architecture
The system is built on a loosely coupled Monorepo architecture to ensure scalability and separation of concerns.

* **Frontend:** React.js + Vite (Client-side rendering). Includes new `AlertManager` and Health Status indicators.
* **Backend:** FastAPI (Python) - Async architecture handling high-concurrency transaction processing.
* **Database:** Hybrid support.
    * *Production:* PostgreSQL (Containerized via Docker).
    * *Development:* SQLite (via environment variable configuration).
* **AI Layer:** Google Gemini 2.0 Flash for categorization.
* **Notification Service:** Mock Twilio/Email simulation for alert dispatching.
* **DevOps:** Docker Compose for orchestration.
## ✨ Key Features

### 1. Intelligent Transaction Categorization (GenAI)
Instead of forcing users to manually select categories, the system uses an LLM agent to analyze unstructured text (e.g., "Uber to SFO") and map it to standardized financial ledgers (e.g., "Transportation").
* *Tech:* Prompt Engineering, Context Awareness, JSON output parsing.

### 2. Real-Time Alerting & "Incident Response" (New)
A robust mechanism to enforce spending discipline. Users can define global or category-specific spending limits.
* **Threshold Management:** The `AlertThreshold` model uses unique constraints to prevent duplicate rules.
* **Live Monitoring:** The `alert_service` checks every incoming transaction against defined limits.
* **Notification Simulation:** Triggers a mock external notification upon breach:
  > `[MOCK TWILIO]: Dispatching SMS to user for Incident #{alert.id}`
* **UI Feedback:** Frontend displays "Health Status" indicators and incident alerts immediately after transaction submission.

### 3. Resilient "Graceful Degradation" Pattern
Designed for high availability. The categorization engine implements a fallback strategy:
* **Primary:** Calls Google Gemini API for context-aware classification.
* **Secondary:** If the API fails (429/500 errors), a local keyword heuristic engine takes over instantly.
* *Result:* Zero downtime for the user, even during API outages.

### 4. Financial Data Visualization
Real-time dashboard rendering of expense aggregation and historical trends using React state management.

## 🛠️ Installation & Setup

### Prerequisites
* Node.js & npm
* Python 3.10+
* Docker Desktop

### 1. Database Setup
```bash
docker-compose up -d
# Starts PostgreSQL on port 5432
```
### 2. Backend Setup
``` bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
Note: Create a .env file in /backend with GEMINI_API_KEY=your_key

### 3.Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Verification & Testing
The latest build has undergone the following verification:

* **Backend API:** Validated schema correctness for AlertThreshold and confirmed POST /transactions returns generated alerts alongside transaction data.
* **Frontend:** Verified the AlertManager UI allows setting limits and the "Incident Response" alerts appear correctly.
* **Logging:** Confirmed Mock Twilio logs are generated in the backend console when thresholds are breached.

## 🔮 Future Roadmap
* **OCR Receipt Scanning:** Integrating Tesseract for image-to-text transaction entry.
* **Anomaly Detection:** Using Isolation Forests (Scikit-Learn) to flag fraudulent transactions.
* **CI/CD:** GitHub Actions pipeline for automated testing.
