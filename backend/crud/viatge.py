from sqlalchemy.orm import Session, joinedload
from backend.models.viatge import Viatge
from backend.models.participants import Participants
from backend.schemas.schemas import ViatgeResponse, ViatgeSchema
from fastapi import HTTPException
from datetime  import date

#Get todos los viajes
def get_viatges(db: Session):
  return db.query(Viatge).all()

#Get viaje por id
def get_viatge(db: Session, viatge_id: int):
  return db.query(Viatge).filter(Viatge.id == viatge_id).first()

#Get usuarios de un viaje
def get_viatge_usuaris(db: Session, viatge_id: int):
  viatge = (db.query(Viatge).options(joinedload(Viatge.usuaris).joinedload(Participants.usuari)).filter(Viatge.id == viatge_id).first())

  if not viatge:
        return []

    # Convertir Participants -> Usuarios
  return [p.usuari for p in viatge.usuaris]

#Get de todos los mensajes de un viaje
def get_viatge_misatges(db: Session, viatge_id: int):
  viatge = get_viatge(db, viatge_id)
  return viatge.comentaris

#Get creador de un viaje
def get_viatge_creador(db: Session, viatge_id: int):
  return db.query(Viatge).options(joinedload(Viatge.creador)).filter(Viatge.id == viatge_id).first()

#Crear un viaje
def create_viatge(db: Session, viatge: ViatgeSchema):
  db_viatge = Viatge(
    nombre = viatge.nombre, 
    destino = viatge.destino, 
    fecha_inicio = viatge.fecha_inicio, 
    fecha_fin = viatge.fecha_fin, 
    descripcion = viatge.descripcion, 
    creador_id = viatge.creador_id, 
    maximo_participantes = 
    viatge.maximo_participantes, 
    total_participantes = viatge.total_participantes, 
    estado = viatge.estado)
  db.add(db_viatge)
  db.commit()
  db.refresh(db_viatge)
  return db_viatge

#Apuntar un usuario a un viaje
def apuntarse_a_viaje(db: Session, usuario_id: int, viaje_id: int):

    # Obtener el viaje
    viaje = get_viatge(db, viaje_id)
    if not viaje:
        raise HTTPException(status_code=404, detail="Viaje no encontrado")

    # Validacion que no este lleno
    if viaje.total_participantes >= viaje.maximo_participantes:
        raise HTTPException(status_code=400, detail="El viaje ya está completo")

    # Verificacion que el usuario no este inscrito
    existe = db.query(Participants).filter(
        Participants.usuari_id == usuario_id,
        Participants.viatge_id == viaje_id
    ).first()

    if existe:
        raise HTTPException(status_code=400, detail="Ya estás inscrito en este viaje")

    # Crear la inscripcion
    nuevo_participante = Participants(
        usuari_id=usuario_id,
        viatge_id=viaje_id,
        fecha_inscripcion=date.today()
    )
    db.add(nuevo_participante)

    # +1 total de participantes
    viaje.total_participantes += 1
    db.commit()
    db.refresh(viaje)
    return viaje

#Eliminar un usuario de un viaje
def borrarse_de_viaje(db: Session, usuario_id: int, viaje_id: int):

    # 1. Obtener el viaje
    viaje = db.query(Viatge).filter(Viatge.id == viaje_id).first()
    if not viaje:
        raise HTTPException(status_code=404, detail="Viaje no encontrado")

    # 2. Verificar que el usuario esté inscrito
    participante = db.query(Participants).filter(
        Participants.usuari_id == usuario_id,
        Participants.viatge_id == viaje_id
    ).first()

    if not participante:
        raise HTTPException(status_code=400, detail="No estás inscrito en este viaje")

    # 3. Eliminar la inscripción
    db.delete(participante)

    # 4. Decrementar el total de participantes (evitar negativos)
    if viaje.total_participantes > 0:
        viaje.total_participantes -= 1

    # 5. Guardar cambios
    db.commit()
    db.refresh(viaje)

    return viaje

# Actualizar viajes
def update_viatge(db: Session, viatge_id: int, viatge: ViatgeResponse):
  db_viatge = get_viatge(db, viatge_id)
  if not db_viatge:
    return None
  db_viatge.nombre = viatge.nombre
  db_viatge.destino = viatge.destino
  db_viatge.fecha_inicio = viatge.fecha_inicio
  db_viatge.fecha_fin = viatge.fecha_fin
  db_viatge.descripcion = viatge.descripcion
  db_viatge.creador_id = viatge.creador_id
  db_viatge.maximo_participantes = viatge.maximo_participantes
  db_viatge.total_participantes = viatge.total_participantes
  db_viatge.estado = viatge.estado
  db.commit()
  db.refresh(db_viatge)
  return db_viatge

#Eliminar viajes
def delete_viatge(db: Session, viatge_id: int):
  db_viatge = get_viatge(db, viatge_id)
  if not db_viatge:
    return False
  db.delete(db_viatge)
  db.commit()
  return True