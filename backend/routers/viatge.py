from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.crud.viatge import get_viatges, get_viatge, get_viatge_creador, get_viatge_usuaris, create_viatge, update_viatge, delete_viatge
from backend.schemas.schemas import ViatgeSchema, ViatgeResponse, ViatgeUsuariResponse, ViatgeMisatgeResponse
from backend.db.deps import get_db

router = APIRouter(prefix="/viatges", tags=["viatges"])

#Mostrar un viaje por id
@router.get("/{viatge_id}", response_model=ViatgeResponse)
def read_viatge(viatge_id: int, db: Session = Depends(get_db)):
  db_viatge = get_viatge(db, viatge_id)
  if not db_viatge:
    raise HTTPException(status_code=404, detail="Viatge not found")
  return db_viatge

#Mostrar todos los viajes
@router.get("/", response_model=List[ViatgeResponse])
def read_viatges(db: Session = Depends(get_db)):
  return get_viatges(db)

#Mostrar los usuarios del viaje
@router.get("/{vitge_id}/usuaris", response_model=ViatgeUsuariResponse)
def read_viatge_usuaris(viatge_id: int, db: Session = Depends(get_db)):
  db_viatge = get_viatge_usuaris(db, viatge_id)
  if not db_viatge:
    raise HTTPException(status_code=404, detail="Viatge not found")
  return db_viatge

#Motrar el creador del viaje
@router.get("/{viatge_id}", response_model=ViatgeUsuariResponse)
def read_viatge_autor(viatge_id: int, db: Session = Depends(get_db)):
  db_creador = get_viatge_creador(db, viatge_id)
  if not db_creador:
    raise HTTPException(status_code=404, detail="Viatge not found")
  return db_creador

#Crear un viaje
@router.post("/", response_model=ViatgeResponse)
def create_new_viatje(viatge: ViatgeSchema, db: Session = Depends(get_db)):
  return create_viatge(db, viatge)
#Modificar un viaje
@router.put("/{viatge_id}", response_model=ViatgeResponse)
def update_existing_viatge(viatge_id: int, viatge: ViatgeSchema, db: Session = Depends(get_db)):
  db_viatge = update_viatge(db, viatge_id, viatge)
  if not db_viatge:
    raise HTTPException(status_code=404, detail="Viatge not found")
  return db_viatge

#Eliminar un viaje
@router.delete("/{viatge_id}", response_model=dict)
def delete_existing_viatge(viatge_id: int, db: Session = Depends(get_db)):
  success = delete_viatge(db, viatge_id)
  if not success:
    raise HTTPException(status_code=404, detail="Viatge not found")
  return {"detail": "Viatge deleted successfully"}