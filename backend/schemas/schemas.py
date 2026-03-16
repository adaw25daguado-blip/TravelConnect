from typing import List, Optional
from pydantic import BaseModel
from datetime  import date, datetime

# ------------------ Input ------------------
class UsuariSchema(BaseModel):
  email: str
  hashed_password: str
  fullName: str
  rol: str
  bio: str

class ViatgeSchema(BaseModel):
  nombre: str
  destino: str
  fecha_inicio: date
  fecha_fin: date
  descripcion: str
  creador_id: int
  maximo_participantes: int
  total_participantes: int
  estado: str

class ParticipantsSchemas(BaseModel):
  usuari_id: Optional[int]
  viatge_id: Optional[int]
  fecha_inscripcion: date

class PeticioPromocioSchema(BaseModel):
  usuari_solicitant: Optional[int]
  misatge_peticio: str
  estat: str

class MisatgeXatSchema(BaseModel):
  viatge_id: Optional[int]
  autor_id: Optional[int]
  contingut: str
  timestamp: datetime

# ------------------ Output ------------------

  class Config:
    from_attributes = True

class UsuariResponse(UsuariSchema):
  id: int
  email: str  
  fullName: str
  rol: str
  bio: str
  class Config:
    from_attributes = True

class UsuariViewResponse(BaseModel):
  id: int
  email: str  
  fullName: str
  rol: str
  bio: str
  class Config:
    from_attributes = True

class ViatgeResponse(ViatgeSchema):
  id: int 
    
  class Config: 
    from_attributes = True

class ParticipantsResponse(ParticipantsSchemas):
  id: int

  class Config:
    from_attributes = True

class MisatgeXatResponse(MisatgeXatSchema):
  id: int 
  
  class Confog:
    from_attributes = True




class PeticioPromocioResponse(PeticioPromocioSchema):
  id: int
  
  class Config:
    from_attributes = True

# ------------------ Output Anidado ------------------

class inscripcionUsuari(BaseModel):
  fecha_inscripcion: date
  usuari: UsuariResponse

  class Config:
    from_attributes = True

class inscripcionViatge(BaseModel):
  fecha_inscripcion: date
  viatge: ViatgeResponse




class InscripcionUsuari(BaseModel):
  fecha_inscripcion: date
  usuari: UsuariResponse

  class Config:
    from_attributes = True

class InscripcionViatge(BaseModel):
  fecha_inscripcion: date
  viatge: ViatgeResponse

  class Config:
    from_attributes = True


    

class UsuariViatgeResponse(BaseModel):
  id: int
  nombre: str
  destino: str
  fecha_inicio: date
  fecha_fin: date
  descripcion: str
  creador_id: int
  maximo_participantes: int
  total_participantes: int
  estado: str

  class Config:
    from_attributes = True

class UsuariPeticioResponse(PeticioPromocioResponse):
  peticio: Optional["PeticioPromocioResponse"] = None

  class Config: 
    from_attributes = True
  



class ViatgeUsuariResponse(BaseModel):
  email: str 
  fullName: str
  rol: str
  bio: str
    
  class Config:
    from_attributes = True

class ViatgeMisatgeResponse(BaseModel):
  id: int
  viatge_id: Optional[int]
  autor_id: Optional[int]
  contingut: str
  timestamp: datetime

  class Config:
    from_attributes = True




class PeticioUsuariResponse(UsuariResponse):
  usuari: Optional["UsuariResponse"] = None

  class Config: 
    from_attributes = True




class MisatgeViatgeResponse(BaseModel):
    id: int
    contingut: str
    viatge_id: int
    autor_id: int
    timestamp: datetime
    viatge: Optional[ViatgeResponse] = None

    class Config:
        from_attributes = True


class MisatgeUsuariResponse(UsuariResponse):
  usuari: Optional["ViatgeResponse"] = None

  class Config:
    from_attributes = True

#Frontend

class LoginSchema(BaseModel):
  email: str
  password: str

class RegisterSchema(BaseModel):
  email: str
  password: str
  fullName: str
  bio: Optional[str] = None
