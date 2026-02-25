from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.database import Base

class participants(Base):
  __tablename__ = "participants"

  usuari_id = Column(Integer, ForeignKey("usuaris.id"), primary_key=True)
  viatge_id = Column(Integer, ForeignKey("viatges.id"), primary_key=True)
  fecha_inscripcion = Column(Date, nullable=False)

  usuari = relationship("Usuari", back_populates="viatges") 
  viatge = relationship("Viatge", back_populates="participants")
