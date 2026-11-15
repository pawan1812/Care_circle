#!/usr/bin/env bash
# ==============================================================================
# CareCircle — Google Cloud Run Automated Deployment Script
# Target Project: carecircle-4ec05 | Region: asia-south1 (Mumbai)
# ==============================================================================

set -e

PROJECT_ID="carecircle-4ec05"
SERVICE_NAME="carecircle-app"
REGION="asia-south1"

echo "=========================================================="
echo "🚀 Deploying CareCircle to Google Cloud Run ($PROJECT_ID)"
echo "=========================================================="

# 1. Ensure gcloud is configured to the correct project
echo "Step 1: Setting active Google Cloud project..."
gcloud config set project "$PROJECT_ID"

# 2. Deploy source directly to Cloud Run (handles automated Cloud Build & containerization)
echo "Step 2: Submitting build and deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --source=. \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --min-instances=0 \
  --max-instances=5 \
  --memory=512Mi \
  --cpu=1 \
  --set-env-vars="NODE_ENV=production,NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID"

echo ""
echo "=========================================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "Service URL:"
gcloud run services describe "$SERVICE_NAME" --project="$PROJECT_ID" --region="$REGION" --format='value(status.url)'
echo "Health Check:"
echo "$(gcloud run services describe "$SERVICE_NAME" --project="$PROJECT_ID" --region="$REGION" --format='value(status.url)')/healthz"
echo "=========================================================="

