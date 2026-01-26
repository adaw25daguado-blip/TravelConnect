from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey, text
from db.database import Base
from datetime import datetime, timezone

class MisatgeXat(Base): 
  id = Column(Integer, primary_key=True, index=True)
  viatge = Column(Integer, ForeignKey("viatges.id"), primary_key=True)
  autor = Column(Integer, ForeignKey("usuaris.id"), primary_key=True)
  contingut = Column(String(200), unique=True, nullable=False)
  timesTamp = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"),nullable=False)

  usuari = relationship("Usuari", back_populates="usuariAutor")
  viatge = relationship("Viatge", back_populates="viatgeComentari")