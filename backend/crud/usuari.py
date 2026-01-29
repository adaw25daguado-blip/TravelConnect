from sqlalchemy.orm import Session, joinedload
from models.usuari import Usuari
from schemas.schemas import UsuariResponse, UsuariSchema

def get_usuaris(db: Session):
  return db.query(Usuari).all()

def get_usuaris_viatges(db: Session):
  return db.query(Usuari).options(joinedload(Usuari.viatges)).all()

def get_usuaris_peticio(db: Session):
  return db.query(Usuari).options(joinedload(Usuari.peticions)).all()

