from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from backend.db.database import Base

class Usuari(Base):
  __tablename__= "usuaris"

  id = Column(Integer, primary_key=True, index=True)
  email = Column(String(120), unique=True, index=True, nullable=False)
  hashed_password = Column(String(200), nullable=False)
  fullName = Column(String(50), nullable=False)  
  rol = Column(Enum("Viajero", "Creador", "Admin", name="rol_enum"), nullable=False)
  bio = Column(String(200), default="", nullable=False)

  viatges = relationship("Participants", back_populates="usuari") 
  viatges_creats = relationship("Viatge", back_populates="creador") 
  misatges = relationship("MisatgeXat", back_populates="usuari")   
  peticions_promocio = relationship("PeticioPromocio", back_populates="usuari")
  