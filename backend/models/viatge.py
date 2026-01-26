from sqlalchemy import Column, Integer, String, Enum, Date, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base

class Viatge(Base):
  __tablename__ = "viatges"

  id = Column(Integer, primary_key=True, index=True)
  nombre = Column(String(50), nullable=False)
  destino = Column(String (30), nullable=False)
  fecha_inicio = Column(Date, nullable=False)
  fecha_fin = Column(Date, nullable=False)
  descripcion = Column(String (200), nullable=False)
  creador = Column(Integer, ForeignKey("usuaris.id"), nullable = False)
  maximo_participantes = Column(Integer, nullable = False)
  total_particiantes = Column(Integer, nullable = False)
  estado = Column(Enum("Planificando", "Activo", "Completado", "Cancelado"), nullable=False)

  creador = relationship("Usuari", back_populates="viatges_creats")
  usuaris = relationship("Participants", back_populates="Viatge")


  