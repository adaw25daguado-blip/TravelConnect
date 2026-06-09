from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.crud.usuari import create_usuari, get_usuari, delete_usuari, get_usuari_viatges, get_usuaris, update_usuari, logUsuaris, register_usuari
from backend.schemas.schemas import UsuariSchema, UsuariResponse, UsuariViewResponse, UsuariViatgeResponse, UsuariUpdateSchema, LoginSchema, RegisterSchema
from backend.db.deps import get_db
from backend.auth.jwt_handler import create_access_token


router = APIRouter(prefix="/usuaris", tags=["usuaris"])

#Mostrar un usuario por id y sus viajes
@router.get("/{usuari_id}/viatges", response_model=List[UsuariViatgeResponse])
def read_usuari_viatges(usuari_id: int, db: Session = Depends(get_db)):
    db_usuari = get_usuari_viatges(db, usuari_id)
    if db_usuari is None:
        return []   # ← LISTA VACÍA SI NO TIENE VIAJES
    return db_usuari


#Mostrar un usuario por id
@router.get("/{usuari_id}", response_model = UsuariViewResponse)
def read_usuari(usuari_id: int, db: Session = Depends(get_db)):
  db_usuari = get_usuari(db, usuari_id)
  if not db_usuari:
    raise HTTPException(status_code=404, detail="Usuari not found")
  return db_usuari

#Mostrar todos los usuarios
@router.get("/", response_model=List[UsuariViewResponse])
def read_usuaris(db: Session = Depends(get_db)):
  return get_usuaris(db)

#Crear un nuevo usuario
@router.post("/", response_model=UsuariResponse)
def create_new_usuari(usuari:UsuariSchema, db: Session = Depends(get_db)):
  return create_usuari(db, usuari)

#Modificar un usuario
@router.put("/{usuari_id}", response_model=UsuariResponse)
def update_existing_usuari(usuari_id: int, usuari: UsuariUpdateSchema, db: Session = Depends(get_db)):
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


#Metodos forntend

#Loging
@router.post("/login")
def log_usuaris(usuari: LoginSchema, db: Session = Depends(get_db)):
    print(">>> CARGANDO ENDPOINT LOGIN")
    db_usuari = logUsuaris(db, usuari.email, usuari.password)
    if not db_usuari:
        raise HTTPException(status_code=404, detail="Usuari o contrasenya incorrecto")

    # Crear token
    access_token = create_access_token({
        "sub": str(db_usuari.id),
        "role": db_usuari.rol
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


#Auto Registro de usuario
@router.post("/register")
def register_user(usuari: RegisterSchema, db: Session = Depends(get_db)):
    db_usuari = register_usuari(db, usuari)

    # Crear token igual que en login
    
    access_token = create_access_token({
        "sub": str(db_usuari.id),
        "role": db_usuari.rol
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


