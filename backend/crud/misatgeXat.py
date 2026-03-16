from sqlalchemy.orm import Session
from backend.models.misatgeXat import MisatgeXat
from backend.schemas.schemas import MisatgeXatSchema

def get_misatge(db: Session, misatge_id: int):
  return db.query(MisatgeXat).filter(MisatgeXat.id == misatge_id).first()

def create_misatge(db: Session, misatge: MisatgeXatSchema):
  db_misatge = MisatgeXat(viatge_id = misatge.viatge_id, autor_id = misatge.autor_id, contingut = misatge.contingut, timestamp = misatge.timestamp)
  db.add(db_misatge)
  db.commit()
  db.refresh(db_misatge)
  return db_misatge

def delete_misatge(db: Session, misatge_id: int):
  db_misatge = get_misatge(db, misatge_id)
  if not db_misatge:
    return False
  db.delete(db_misatge)
  db.commit()
  return True
