from sqlalchemy.orm import Session, joinedload
from models.usuari import Usuari
from schemas.schemas import UsuariResponse, UsuariSchema

def get_usuaris(db: Session):
  return db.query(Usuari).all()

def get_usuari(db: Session, usuari_id: int):
  return db.query(Usuari).filter(Usuari.id == usuari_id).first()

def get_usuari_viatges(db: Session, usuari_id: int):
   return db.query(Usuari).options(joinedload(Usuari.viatges)).filter(Usuari.id == usuari_id).all()

def get_usuaris_viatges(db:Session):
  return db.query(Usuari).options(joinedload(Usuari.viatges)).all()

def get_usuari_misatges(db: Session, usuari_id: int):
  return db.query(Usuari).options(joinedload(Usuari.misatge)).filter(Usuari.id == usuari_id).all()

def create_usuari(db: Session, usuari: UsuariSchema):
  db_usuari = Usuari(email = usuari.email, hashed_pswd = usuari.hashed_pasword, full_name = usuari.fullName, rol = usuari.rol, bio = usuari.bio)
  db.add(db_usuari)
  db.commit()
  db.refresh(db_usuari)
  return db_usuari

def update_usuari(db: Session, usuari_id: int, usuari: UsuariResponse):
  db_usuari = get_usuari(db, usuari_id)
  if not db_usuari:
    return None
  db_usuari.email == usuari.email
  db_usuari.hashed_pasword == usuari.hashed_pasword
  db_usuari.fullName == usuari.fullName
  db_usuari.rol == usuari.rol
  db_usuari.bio == usuari.bio
  db.commit()
  db.refresh(db_usuari)
  return db_usuari

def delete_usuari(db: Session, usuari_id: int):
  db_usuari = get_usuari(db, usuari_id)
  if not db_usuari:
    return False
  db.delete(db_usuari)
  db.commit()
  return True