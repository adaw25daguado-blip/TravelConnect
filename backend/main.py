from fastapi import FastAPI
from backend.routers.usuari import router as usuari_router
from backend.routers.viatge import router as viatge_router
from backend.routers.peticioPromocio import router as peticioPromocio_router
from backend.routers.misatgeXat import router as misatgeXat_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CRUD 1:N en FastAPI con MySQL")

# Incluir rutas
app.include_router(usuari_router)
app.include_router(viatge_router)
app.include_router(peticioPromocio_router)
app.include_router(misatgeXat_router)


# Lista de orígenes permitidos
origins = [
    "http://localhost:5500",  # si tu frontend corre aquí
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],  # permite cualquier origen (no recomendable en producción)
    allow_origins=origins,  # permite solo esos orígenes
    allow_credentials=True,
    allow_methods=["*"],    # permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],    # permite todas las cabeceras
)