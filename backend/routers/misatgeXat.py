from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.crud.misatgeXat import get_misatge, create_misatge, delete_misatge
from backend.schemas.schemas import MisatgeXatSchema, MisatgeXatResponse
from backend.db.deps import get_db

router = APIRouter(prefix="/misatge_xat", tags=["misatge_xat"])

#Mostrar un mensaje por id
@router.get("/{misatgeXat_id}", response_model=MisatgeXatResponse)
def read_misatgeXat(misatgeXat_id: int, db: Session = Depends(get_db)):
  db_misatgeXat = get_misatge(db, misatgeXat_id)
  if not db_misatgeXat:
    raise HTTPException(status_code=404, detail="Misatge Xat promocio not found")
  return db_misatgeXat

#Crear un mensaje
@router.post("/", response_model=MisatgeXatResponse)
def create_misatgeXat(misatge: MisatgeXatSchema, db: Session = Depends(get_db)):
  return create_misatge(db, misatge)

#Eliminar un mensaje
@router.delete("/{misatge_id}", response_model=dict)
def delete_existing_mensaje(misatge_id: int, db: Session = Depends(get_db)):
  success = delete_misatge(db, misatge_id)
  if not success:
    raise HTTPException(status_code=404, detail="Misatge not found")
  return {"detail": "Misatge deleted successfully"}