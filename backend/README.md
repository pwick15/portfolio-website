# Portfolio Chatbot Backend

This is the serverless Node.js backend for the AI resume search chatbot, deployed to **Google Cloud Run** and integrating with **Google Vertex AI** and **Google reCAPTCHA v3**.

---

To deploy the backend to **Google Cloud Run**, run the following command in your terminal from inside this `backend/` directory:

```bash
gcloud run deploy portfolio-chatbot \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

### What this command does:
* `--source .`: Packs the files in this directory (excluding node_modules due to `.dockerignore`) and uploads them to Google Cloud for container building.
* `--region us-central1`: Deploys the service to the Iowa region (standard free-tier eligible region supporting Vertex AI).
* `--allow-unauthenticated`: Makes the endpoint publicly accessible so your portfolio website can call it.

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
* **CORS Restrictions**: The server only allows browser requests coming from your custom domain (`https://punjaya.com`, `https://www.punjaya.com`) and standard local ports (`http://localhost:5500`, `http://127.0.0.1:5500`).
* **IP Rate Limiting**: The server limits client requests to a maximum of **20 queries per 10 minutes** per IP address to protect against bot abuse and sudden billing spikes.

---

## 🔑 Credential Hygiene (Log in / Log out)

To practice good security hygiene on your local machine, you should only authenticate your terminal when you are actively testing or deploying. Once you are finished making changes, log out of your GCP credentials immediately.

### 1. Before making changes (Log in)
To run the deployment command or configure permissions locally:
```bash
# Log in to your main gcloud CLI account
gcloud auth login

# Log in to generate Application Default Credentials (for local RAG testing)
gcloud auth application-default login
```

### 2. After making changes (Log out / Clean up)
To revoke all credentials from your local machine so that it is secure when idle:
```bash
# Log out of gcloud CLI
gcloud auth revoke

# Log out of local Application Default Credentials
gcloud auth application-default revoke
```
