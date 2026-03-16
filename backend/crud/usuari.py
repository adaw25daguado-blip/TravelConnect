from sqlalchemy.orm import Session, joinedload
from backend.models.usuari import Usuari
from backend.models.participants import Participants
from backend.schemas.schemas import UsuariResponse, UsuariSchema, RegisterSchema
from passlib.hash import bcrypt
from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"], 
    deprecated="auto"
)

def get_usuaris(db: Session):
  return db.query(Usuari).all()

def get_usuari(db: Session, usuari_id: int):
  return db.query(Usuari).filter(Usuari.id == usuari_id).first()

def get_usuari_viatges(db: Session, usuari_id: int):
  usuari = db.query(Usuari).options(joinedload(Usuari.viatges).joinedload(Participants.viatge)).filter(Usuari.id == usuari_id).first()

  if not usuari:
    return []
  # Convertir Participants → Viajes
  return [p.viatge for p in usuari.viatges]

def create_usuari(db: Session, usuari: UsuariSchema):    
    db_usuari = Usuari(
        email=usuari.email,
        hashed_password=hashearContrasenyas(usuari.hashed_password),  # Hash correcto
        fullName=usuari.fullName,
        rol=usuari.rol,
        bio=usuari.bio
    )
    db.add(db_usuari)
    db.commit()
    db.refresh(db_usuari)
    return db_usuari

def update_usuari(db: Session, usuari_id: int, usuari: UsuariSchema):
  db_usuari = get_usuari(db, usuari_id)
  if not db_usuari:
    return None
  db_usuari.email = usuari.email
  db_usuari.hashed_password = hashearContrasenyas(usuari.hashed_password)
  db_usuari.fullName = usuari.fullName
  db_usuari.rol = usuari.rol
  db_usuari.bio = usuari.bio
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

def hashearContrasenyas(pswd: str) -> str:
    return pwd_context.hash(pswd)

def verificar_contrasenya(pswd_input: str, hashed: str) -> bool:
    return pwd_context.verify(pswd_input, hashed)

# Metodos usuarios forntend

def logUsuaris(db: Session, email: str, password: str):
    user = db.query(Usuari).filter(Usuari.email == email).first()
    if not user:
        return None
    
    if pwd_context.verify(password, user.hashed_password):
        return user
    else:
        return None
    
def register_usuari(db: Session, usuari: RegisterSchema):        
    db_usuari = Usuari(
        email=usuari.email,
        hashed_password=hashearContrasenyas(usuari.password),  # Hash correcto
        fullName=usuari.fullName,
        rol="Viajero",
        bio=usuari.bio
    )
    db.add(db_usuari)
    db.commit()
    db.refresh(db_usuari)
    return db_usuari
