from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from vortex.api.routes import scan
from vortex.core.database import create_db_and_tables
from contextlib import asynccontextmanager
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="Vortex API", description="Next-Generation Async Vulnerability Engine API", lifespan=lifespan)

# CORS (Allow all for dev, restrict in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(scan.router, prefix="/api/scan", tags=["scan"])

# Mount Static Files (Frontend)
# We serve the 'dist' folder which contains the built React app
static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ui", "dist")

if os.path.exists(static_dir):
    # Mount assets specifically
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")
    
    # Catch-all for SPA routing (serve index.html for any other route)
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        return FileResponse(os.path.join(static_dir, "index.html"))
else:
    # Fallback for dev mode if dist doesn't exist yet
    @app.get("/")
    async def root():
        return {"message": "Vortex API is running. Frontend not found (run 'npm run build' in vortex/ui)."}
