from sqlalchemy.orm import Session, joinedload
from backend.models.viatge import Viatge
from backend.schemas.schemas import ViatgeResponse, ViatgeSchema

def get_viatges(db: Session):
  return db.query(Viatge).all()

def get_viatge(db: Session, viatge_id: int):
  return db.query(Viatge).filter(Viatge.id == viatge_id).first()

def get_viatge_usuaris(db: Session, viatge_id: int):
  return db.query(Viatge).filter(Viatge.id == viatge_id).all()

def get_viatge_creador(db: Session, viatge_id: int):
  return db.query(Viatge).options(joinedload(Viatge.creador)).filter(Viatge.id == viatge_id).first()

def create_viatge(db: Session, viatge: ViatgeSchema):
  db_viatge = Viatge(nombre = viatge.nombre, destino = viatge.destino, fecha_inicio = viatge.fecha_inicio, fecha_fin = viatge.fecha_fin, descripcion = viatge.descripcion, creador = viatge.creador, maximo_participantes = viatge.maximo_participantes, total_participantes = viatge.total_participantes, estado = viatge.estado)
  db.add(db_viatge)
  db.commit()
  db.refresh(db_viatge)
  return db_viatge

def update_viatge(db: Session, viatge_id: int, viatge: ViatgeResponse):
  db_viatge = get_viatge(db, viatge_id)
  if not db_viatge:
    return None
  db_viatge.nombre == viatge.nombre
  db_viatge.destino == viatge.destino
  db_viatge.fecha_inicio == viatge.fecha_inicio
  db_viatge.fecha_fin == viatge.fecha_fin
  db_viatge.descripcion == viatge.descripcion
  db_viatge.creador == viatge.creador
  db_viatge.maximo_participantes == viatge.maximo_participantes
  db_viatge.total_particiantes == viatge.total_participantes
  db_viatge.estado == viatge.estado
  db.commit()
  db.refresh(db_viatge)
  return db_viatge

def delete_viatge(db: Session, viatge_id: int):
  db_viatge = get_viatge(db, viatge_id)
  if not db_viatge:
    return False
  db.delete(db_viatge)
  db.commit()
  return True