from backend.models.usuari import Usuari
from backend.models.viatge import Viatge
from backend.models.participants import Participants
from backend.models.peticioPromocio import PeticioPromocio
from backend.models.misatgeXat import MisatgeXat
from backend.db.database import Base, engine

Base.metadata.create_all(bind=engine)