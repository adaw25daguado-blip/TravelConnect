from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.crud.viatge import get_viatges, get_viatge, get_viatge_creador, get_viatge_usuaris, get_viatge_misatges, apuntarse_a_viaje, borrarse_de_viaje,create_viatge, update_viatge, delete_viatge
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
@router.get("/{vitge_id}/usuaris", response_model=List[ViatgeUsuariResponse])
def read_viatge_usuaris(viatge_id: int, db: Session = Depends(get_db)):
  db_usuaris = get_viatge_usuaris(db, viatge_id)
  if not db_usuaris:
    raise HTTPException(status_code=404, detail="Viatge not found")
  return db_usuaris

#Motrar el creador del viaje
@router.get("/{viatge_id}", response_model=ViatgeUsuariResponse)
def read_viatge_autor(viatge_id: int, db: Session = Depends(get_db)):
  db_creador = get_viatge_creador(db, viatge_id)
  if not db_creador:
    raise HTTPException(status_code=404, detail="Viatge not found")
  return db_creador

#Mostrar los comentarios del viaje
@router.get("/{viatge_id}/comentaris", response_model=List[ViatgeMisatgeResponse])
def read_viatge_cometaris(viatge_id: int, db: Session = Depends(get_db)):
    db_comentaris = get_viatge_misatges(db, viatge_id)
    return db_comentaris


#Apuntar un usuario a un viaje
@router.post("/viajes/{viaje_id}/apuntarse")
def apuntarse(viaje_id: int, usuario_id: int, db: Session = Depends(get_db)):
    return apuntarse_a_viaje(db, usuario_id, viaje_id)

#Eliminar un usuario de un viaje
@router.delete("/viajes/{viaje_id}/borrarse")
def borrarse(viaje_id: int, usuario_id: int, db: Session = Depends(get_db)):
    return borrarse_de_viaje(db, usuario_id, viaje_id)

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