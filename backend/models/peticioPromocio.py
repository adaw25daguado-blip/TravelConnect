from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.database import Base

class PeticioPromocio(Base):
  __tablename__ = "peticio_promocio"

  id = Column(Integer, primary_key=True, index=True)
  usuari_solicitant = Column(Integer, ForeignKey("usuaris.id"), primary_key=True)
  misatge_peticio = Column(String(200), unique=True, nullable=False)
  estat = Column(Enum("Pendent", "Aprovat", "Rebutjat"), nullable = False)

  usuari = relationship("Usuari", back_populates="peticions_promocio")