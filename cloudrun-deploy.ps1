# ==============================================================================
# CareCircle — Google Cloud Run Automated Deployment Script (PowerShell)
# Target Project: carecircle-4ec05 | Region: asia-south1 (Mumbai)
# ==============================================================================

$PROJECT_ID = "carecircle-4ec05"
$SERVICE_NAME = "carecircle-app"
$REGION = "asia-south1"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Deploying CareCircle to Google Cloud Run ($PROJECT_ID)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Configure gcloud project
Write-Host "Step 1: Setting active Google Cloud project..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# 2. Deploy source to Cloud Run
Write-Host "Step 2: Submitting source build and deploying container..." -ForegroundColor Yellow
gcloud run deploy $SERVICE_NAME `
  --project=$PROJECT_ID `
  --region=$REGION `
  --source=. `
  --platform=managed `
  --allow-unauthenticated `
  --port=8080 `
  --min-instances=0 `
  --max-instances=5 `
  --memory=512Mi `
  --cpu=1 `
  --set-env-vars="NODE_ENV=production,NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID"

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
$SERVICE_URL = gcloud run services describe $SERVICE_NAME --project=$PROJECT_ID --region=$REGION --format='value(status.url)'
Write-Host "Service URL: $SERVICE_URL" -ForegroundColor Green
Write-Host "Health Check: $SERVICE_URL/healthz" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
