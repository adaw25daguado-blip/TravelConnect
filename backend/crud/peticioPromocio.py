from sqlalchemy.orm import Session, joinedload
from backend.models.peticioPromocio import PeticioPromocio
from backend.schemas.schemas import PeticioPromocioResponse, PeticioPromocioSchema

def get_peticionsPromocions(db: Session):
  return db.query(PeticioPromocio).all()

def get_peticioPromocio(db: Session, peticio_id: int):
  return db.query(PeticioPromocio).filter(PeticioPromocio.id == peticio_id).first()

def create_peticioPromocio(db: Session, peticio: PeticioPromocioSchema):
  db_peticio = PeticioPromocio(usuariSolicitant = peticio.usuari_solicitant, misatge_peticio = peticio.misatge_peticio, estat = peticio.estat)
  db.add(db_peticio)
  db.commit()
  db.refresh(db_peticio)
  return db_peticio

def update_peticioPromocio(db: Session, peticio_id: int, peticio: PeticioPromocioResponse):
  db_peticio = get_peticioPromocio(db, peticio_id)
  if not db_peticio:
    return None
  db_peticio.usuari_solicitant = peticio.usuari_solicitant
  db_peticio.misatge_peticio = peticio.misatge_peticio
  db_peticio.estat = peticio.estat
  db.commit()
  db.refresh(db_peticio)
  return db_peticio

def delete_peticioPromocio(db: Session, peticio_id: int):
  db_peticio = get_peticioPromocio(db, peticio_id)
  if not db_peticio:
    return False
  db.delete(db_peticio)
  db.commit()
  return True