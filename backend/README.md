# Portfolio Chatbot Backend

This is the serverless Node.js backend for the AI resume search chatbot, deployed to **Google Cloud Run** and integrating with **Google Vertex AI** and **Google reCAPTCHA v3**.

---

## 🚀 How to Deploy to Google Cloud Run

To deploy the backend with your private **reCAPTCHA Secret Key** securely injected (without saving it to any files or committing it to Git), run the following command in your terminal from inside this `backend/` directory:

```bash
gcloud run deploy portfolio-chatbot \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="RECAPTCHA_SECRET_KEY=YOUR_SECRET_KEY_HERE"
```

### What this command does:
* `--source .`: Packs the files in this directory (excluding node_modules due to `.dockerignore`) and uploads them to Google Cloud for container building.
* `--region us-central1`: Deploys the service to the Iowa region (standard free-tier eligible region supporting Vertex AI).
* `--allow-unauthenticated`: Makes the endpoint publicly accessible so your portfolio website can call it.
* `--set-env-vars="RECAPTCHA_SECRET_KEY=..."`: Securely injects your private reCAPTCHA secret key into the running container's memory. **Replace `YOUR_SECRET_KEY_HERE` with your actual Google reCAPTCHA Secret Key before running.**

Once the deployment completes, it will output a **Service URL** (e.g., `https://portfolio-chatbot-xxx.run.app`). Ensure this URL matches the `API_ENDPOINT` variable in your frontend `script.js` file.

---

## 💻 Local Development

To run the backend server locally on your machine:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server (runs on port `8080`):
   ```bash
   npm start
   ```
   *Note: If you want to run locally while loading your `.env` variables (supported natively in Node.js 20.6.0+), you can run:*
   ```bash
   node --env-file=.env src/index.js
   ```

> [!TIP]
> **reCAPTCHA Local Bypass**: During local development, if you do not define the `RECAPTCHA_SECRET_KEY` environment variable in your `.env` or system environment, the backend will print a console warning but will **automatically bypass verification**. This allows you to test your chat functionality locally on `http://localhost:8080` without setting up mock secret keys.

---

## 🔒 Security Architecture

* **Zero API Keys**: Access to Google Vertex AI is secured keyless using **GCP IAM roles** attached to the default Compute Engine Service Account.
* **CORS Restrictions**: The server only allows browser requests coming from `https://pwick15.github.io` and standard local ports (`http://localhost:5500`, `http://127.0.0.1:5500`).
* **IP Rate Limiting**: The server limits client requests to a maximum of **20 queries per 10 minutes** per IP address to protect against bot abuse and sudden billing spikes.
* **reCAPTCHA v3 Protection**: Every incoming message must carry a valid, high-score human interaction token validated directly against Google's verification API.
