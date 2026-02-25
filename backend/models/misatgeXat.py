from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey, text
from backend.db.database import Base

class MisatgeXat(Base):
  __tablename__ = "misatge_xat" 
  id = Column(Integer, primary_key=True, index=True) 
  viatge_id = Column(Integer, ForeignKey("viatges.id")) 
  autor_id = Column(Integer, ForeignKey("usuaris.id")) 
  contingut = Column(String(200), nullable=False) 
  timestamp = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"), nullable=False) 
  
  usuari = relationship("Usuari", back_populates="misatges") 
  viatge = relationship("Viatge", back_populates="comentaris")