from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy import Date

# ------------------ Input ------------------
class UsuariSchema(BaseModel):
  email: str
  hashed_pasword: str
  fullName: str
  rol: str
  bio: str

class ViatgeSchema(BaseModel):
  nombre: str
  destino: str
  fecha_inicio: Date
  fecha_fin: Date
  descripcion: str
  creador: Optional[str]
  maximo_participantes: int
  total_participantes: int
  estado: str

class ParticipantsSchemas(BaseModel):
  usuari_id: Optional[int]
  viatge_id: Optional[int]
  fecha_inscripcion: Date

class PeticioPromocioSchema(BaseModel):
  usuari_solicitant: Optional[int]
  misatge_peticio: str
  estat: str

class MisatgeXatSchema(BaseModel):
  viatge: Optional[int]
  autor: Optional[int]
  contingut: str
  timesTamp: Date

# ------------------ Output ------------------

class UsuariResponse(UsuariSchema):
  id: int
  class Config:
    from_attributes = True

class UsuariViatgeResponse(UsuariResponse):
  viatges: List["ViatgeResponse"] = []

  class Config:
    from_attributes = True

class UsuariPeticioResponse(UsuariResponse):
  peticio: Optional["PeticioPromocioResponse"] = None

  class Config: 
    from_attributes = True

class UsuariMisatgeResponse(UsuariResponse):
  misatge: List["MisatgeXatResponse"] = []

  class Config:
    from_attributes = True



class ViatgeResponse(ViatgeSchema):
  id: int
  
  class Config: 
    from_attributes = True
  
class ViatgeUsuariResponse(ViatgeResponse):
  usuari: List["UsuariResponse"] = []

  class Config:
    from_attributes = True

class ViatgeMisatgeResponse(ViatgeResponse):
  misatge: List["MisatgeXatResponse"] = []

  class Config:
    from_attributes = True



class PeticioPromocioResponse(PeticioPromocioSchema):
  id: int
  
  class Config:
    from_attributes = True

class PeticioUsuariResponse(PeticioPromocioResponse):
  usuari: Optional["UsuariResponse"] = None

  class Config: 
    from_attributes = True



class MisatgeXatResponse(MisatgeXatSchema):
  id: int 

  class Confog:
    from_attributes = True

class MisatgeViatgeResponse(MisatgeXatResponse):
  viatge: Optional["ViatgeResponse"] = None

  class Config:
    from_attributes = True

class MisatgeUsuariResponse(MisatgeXatResponse):
  usuari: Optional["ViatgeResponse"] = None

  class Config:
    from_attributes = True


# ------------------ Output Anidado ------------------

class InscripcionUsuari(BaseModel):
  fecha_inscripcion: Date
  usuari: UsuariResponse

  class Config:
    from_attributes = True

class InscripcionViatge(BaseModel):
  fecha_inscripcion: Date
  viatge: ViatgeResponse

  class Config:
    from_attributes = True

class UsuariViatgeResponse(UsuariResponse):
  viatge: Optional[InscripcionViatge] = None

  class Config:
    from_attributes = True

class ViatgeUsuariResponse(ViatgeResponse):
  usuari: List[InscripcionUsuari] = []

  class Config:
    from_attributes = True
