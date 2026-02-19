from .database import Base, engine
from models.usuari import Usuari
from models.viatge import Viatge
from models.peticioPromocio import PeticioPromocio
from models.participants import participants
from models.misatgeXat import MisatgeXat

Base.metadata.create_all(bind=engine)