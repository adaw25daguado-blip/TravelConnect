from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.crud.missatgeChat import get_misatgesXats, get_misatge, get_misatges_viatge, create_misatge
from backend.crud.viatge import get_viatge
from backend.schemas.schemas import MisatgeXatSchema, MisatgeXatResponse, MisatgeUsuariResponse, MisatgeViatgeResponse
from backend.db.deps import get_db

router = APIRouter(prefix="/misatge_xat", tags=["misatge_xat"])

#Mostrar todos los mensajes
@router.get("/", response_model= List[MisatgeXatResponse])
def red_misatgesXat(db: Session = Depends(get_db)):
  return get_misatgesXats

#Mostrar un mensaje por id
@router.get("/{misatgeXat_id}", response_model=MisatgeXatResponse)
def read_misatgeXat(misatgeXat_id: int, db: Session = Depends(get_db)):
  db_misatgeXat = get_misatge(db, misatgeXat_id)
  if not db_misatgeXat:
    raise HTTPException(status_code=404, detail="Misatge Xat promocio not found")
  return db_misatgeXat

# Mostrar los mensajes de un viaje
@router.get("/{viatge_id}", response_model=MisatgeViatgeResponse)
def read_misatges_viatge(db, viatge_id):
  db_viatge = get_viatge(db, viatge_id)
  if not db_viatge:
    raise HTTPException(status_code=404, detail="Viatge not found")
  return get_misatges_viatge

#Crear un mensaje
@router.post("/", response_model=MisatgeXatResponse)
def create_misatgeXat(misatge: MisatgeXatSchema, db: Session = Depends(get_db)):
  return create_misatge(db, misatge)
