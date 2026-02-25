from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.crud.usuari import create_usuari, get_usuari, delete_usuari, get_usuari_misatges, get_usuaris_viatges,get_usuari_viatges, get_usuaris, update_usuari
from backend.schemas.schemas import UsuariSchema, UsuariResponse, UsuariViatgeResponse, UsuariPeticioResponse, UsuariMisatgeResponse
from backend.db.deps import get_db

router = APIRouter(prefix="/usuaris", tags=["usuaris"])

#Mostrar un usuario por id
@router.get("/{usuari_id}", response_model = UsuariResponse)
def read_usuari(usuari_id: int, db: Session = Depends(get_db)):
  db_usuari = get_usuari(db, usuari_id)
  if not db_usuari:
    raise HTTPException(status_code=404, detail="Usuari not found")
  return db_usuari

#Mostrar todos los usuarios
@router.get("/", response_model=List[UsuariResponse])
def read_usuaris(db: Session = Depends(get_db)):
  return get_usuaris(db)

#Mostrar todos los usuarios con sus viajes
@router.get("/viatges", response_model=List[UsuariViatgeResponse])
def read_usuaris_vitges(db: Session = Depends(get_db)):
  return get_usuaris_viatges(db)

#Mostrar un usuario por id y sus viajes
@router.get("/{usuario_id}/viatges", response_model=UsuariViatgeResponse)
def read_usuari_viatges(usuari_id: int, db: Session = Depends(get_db)):
  db_usuari = get_usuari_viatges(db, usuari_id)
  if not db_usuari:
    raise HTTPException(status_code=404, detail="Usuari not found")
  return db_usuari

#Mostrar un usuario y sus mensajes
@router.get("/{usuario_id}/misatge_xat", response_model=UsuariMisatgeResponse)
def read_usuari_misatge(usuari_id: int, db: Session = Depends(get_db)):
  db_usuari = get_usuari_misatges(db, usuari_id)
  if not db_usuari:
    raise HTTPException(status_code=404, detail="Usuari not found")
  return db_usuari

#Crear un nuevo usuario
@router.post("/", response_model=UsuariResponse)
def create_new_usuari(usuari:UsuariSchema, db: Session = Depends(get_db)):
  return create_usuari(db, usuari)

#Modificar un usuario
@router.put("/{usuari_id}", response_model=UsuariResponse)
def update_existing_usuari(usuari_id: int, usuari: UsuariSchema, db: Session = Depends(get_db)):
  db_usuari = update_usuari(db, usuari_id, usuari)
  if not db_usuari:
    raise HTTPException(status_code=404, detail="Usuari not found")
  return db_usuari

#Eliminar un usuario existente
@router.delete("/{usuari_id}", response_model=dict)
def delete_existing_usuari(usuari_id: int, db: Session = Depends(get_db)):
  success = delete_usuari(db, usuari_id)
  if not success:
      raise HTTPException(status_code=404, detail="Usuari not found")
  return {"detail": "Usuari deleted successfully"}


