from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from db.database import Base

class Usuari(Base):
  __tablename__= "usuaris"

  id = Column(Integer, primary_key=True, index=True)
  email = Column(String(120), unique=True, index=True, nullable=False)
  hashed_pasword = Column(String(200), unique=True, nullable=False)
  fullNameColumn = Column(String(50), nullable=False)
  rol = Column(Enum("Viajero", "Creador", "Admin", name="rol_enum"), nullable=False)
  bio = Column(String(200))

  viatge = relationship("Participants", back_populates="Usuari")