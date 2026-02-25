from sqlalchemy.orm import Session, joinedload
from backend.models.misatgeXat import MisatgeXat
from backend.schemas.schemas import MisatgeXatResponse, MisatgeXatSchema

def get_misatgesXats(db: Session):
  return db.query(MisatgeXat).all()

def get_misatge(db: Session, misatge_id: int):
  return db.query(MisatgeXat).filter(MisatgeXat.id == misatge_id).first()

def get_misatges_viatges(db: Session):
  return db.query(MisatgeXat).options(joinedload(MisatgeXat.viatges)).all()

def get_misatges_viatge(db: Session, viatge_id: int):
  return db.query(MisatgeXat).options(joinedload(MisatgeXat.viatge)).filter(MisatgeXat.viatge == viatge_id).all()

def create_misatge(db: Session, misatge: MisatgeXatSchema):
  db_misatge = MisatgeXat(viatge = MisatgeXat.viatge, autor = MisatgeXat.autor, contingut = MisatgeXat.contingut, time = MisatgeXat.timesTamp)
  db.add(db_misatge)
  db.commit()
  db.refresh(db_misatge)
  return db_misatge

# Update / Delete cuando vaya bien