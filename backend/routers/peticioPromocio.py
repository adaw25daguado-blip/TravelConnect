from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.crud.peticioPromocio import get_peticionsPromocions, get_peticioPromocio ,create_peticioPromocio ,update_peticioPromocio, delete_peticioPromocio
from backend.schemas.schemas import PeticioPromocioSchema, PeticioPromocioResponse, PeticioUsuariResponse
from backend.db.deps import get_db

router = APIRouter(prefix="/peticio_promocio", tags=["peticio_promocio"])

#Mostrar todos las peticiones
@router.get("/", response_model=List[PeticioPromocioResponse])
def read_peticions(db: Session = Depends(get_db)):
  return get_peticionsPromocions(db)

#Mostrar las peticiones por id
@router.get("/{id_peticio}", response_model=PeticioPromocioResponse)
def read_peticio(peticio_id: int, db: Session = Depends(get_db)):
  db_peticio = get_peticioPromocio(db, peticio_id)
  if not db_peticio:
    raise HTTPException(status_code=404, detail="Peticio promocio not found")
  return db_peticio

#Crear una peicion
@router.post("/", response_model=PeticioPromocioResponse)
def create_peticioPromocio(peticio: PeticioPromocioSchema, db: Session = Depends(get_db)):
  return create_peticioPromocio(db, peticio)

#Actualizar una peticion
@router.put("/{peticio_id}", response_model=PeticioPromocioResponse)
def update_existing_peticioPormocio(peticio_id: int, peticio: PeticioPromocioSchema, db: Session = Depends(get_db)):
  db_peticio = update_peticioPromocio(db, peticio_id, peticio)
  if not db_peticio:
    raise HTTPException(status_code=404, detail="Peticio promocio not found")
  return db_peticio

#Eliminar una peticion
@router.delete("/{peticio_id}", response_model=dict)
def delete_existing_peticioPromocio(peticio_id: int, db: Session = Depends(get_db)):
  success = delete_peticioPromocio(db, peticio_id)
  if not success:
    raise HTTPException(status_code=404, detail="Peticio promocio not found")
  return {"detail": "Peticio promocio deleted successfully"}