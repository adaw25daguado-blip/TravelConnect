let usuarioActual = null;
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// -------- LOGIN --------
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const user = await loginUser(email, password);

    if (user) {
      //Guardo el usuario actual sin la contrasenya para mostrarla en el perfil
      usuarioActual = user;

      console.log("Login correcto. Rol:", user.rol);
      mostrarPanel(user.rol);
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  } catch (error) {
    console.error("Error en login:", error);
    alert("Error al conectar con el servidor");
  }
});


async function loginUser(email, password) {
  const response = await fetch("http://localhost:8000/usuaris/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) return false;

  return await response.json();
}


// -------- REGISTRO --------
registerForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("registerPassword").value;
  const bio = document.getElementById("bio").value;


  try {
    const success = await registerUser(name, email, password, bio);

    if (success) {
      alert("Usuario creado correctamente");
      mostrarLogin();
    } else {
      alert("Error al crear usuario");
    }

  } catch (error) {
    console.error("Error en registro:", error);
    alert("Error al conectar con el servidor");
  }
});


async function registerUser(name, email, password, bio) {
  const response = await fetch("http://localhost:8000/usuaris/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: name,
      email: email,
      password: password,
      bio: bio
    })
  });

  return response.ok;
}


// -------- CAMBIAR ENTRE LOGIN Y REGISTRO --------
function mostrarRegistro() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("registerPage").style.display = "block";
}

function mostrarLogin() {
  document.getElementById("registerPage").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
}


// --- MOSTRAR PANELES SEGÚN ROL ---

function mostrarPanel(role) {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("appPage").style.display = "block";

  if (role === "Admin") {
    document.getElementById("adminPanel").classList.remove("d-none");
  } else if (role === "Creador") {
    document.getElementById("creadorPanel").classList.remove("d-none");
  } else {
    document.getElementById("viajeroPanel").classList.remove("d-none");
  }
}

// --- CAMBIAR PANTALLAS ---
function mostrarPantalla(id) {
  // Ocultar todas las pantallas internas
  const pantallas = document.querySelectorAll(
    "#pantallaPerfil, #pantallaUsuarios, #pantallaViajes, #pantallaViajesDisponibles, #pantallaMisViajes, #pantallaCrearUsuario, #pantallaCrearViaje, #chatViaje, #pantallaPeticions, #pantallaPeticionPromocion"
  );
  console.log(id)
  pantallas.forEach(p => p.classList.add("d-none"));

  // Mostrar la pantalla seleccionada
  document.getElementById(id).classList.remove("d-none");

  // Mi Perfil -> cargar datos
  if (id === "pantallaPerfil") {
    cargarPerfil();
  }

  // Gestion usuarios
  if (id === "pantallaUsuarios") {
    cargarUsuarios();
  }

  //Crear/Actualizar Viajes  
  if (id === "pantallaViajes") {
    cargarViajes();
  }

  //Pantalla de peticiones
  if (id === "pantallaPeticions") {
    cargarPeticions();
  }

  if (id === "pantallaViajesDisponibles") {
    cargarViajesDisponibles();
  }

  if (id === "pantallaMisViajes") {
    cargarMisViajes();
  }

}


// -------------------- CARGAR PERFIL --------------------
async function cargarPerfil() {
  if (!usuarioActual) return;

  try {
    const response = await fetch(`http://localhost:8000/usuaris/${usuarioActual.id}`);

    if (!response.ok) {
      alert("Error al cargar el perfil");
      return;
    }

    const user = await response.json();

    // Rellenar formulario
    document.getElementById("perfilNombre").value = user.fullName;
    document.getElementById("perfilEmail").value = user.email;
    document.getElementById("perfilRol").value = user.rol;
    document.getElementById("perfilBio").value = user.bio;

  } catch (error) {
    console.error("Error cargando perfil:", error);
    alert("Error al conectar con el servidor");
  }
}

document.getElementById("btnActualizarUsuario").addEventListener("click", function () {

  //Activar los campos para editar
  document.getElementById("perfilNombre").disabled = false;
  document.getElementById("perfilEmail").disabled = false;
  document.getElementById("perfilPassword").disabled = false;
  document.getElementById("perfilBio").disabled = false;

  //Cambiar texto del botón
  this.textContent = "Guardar cambios";

  //Cambiar comportamiento del botón
  this.removeEventListener("click", arguments.callee);
  this.addEventListener("click", guardarCambiosUsuario);
});

async function guardarCambiosUsuario() {

  const updatedUser = {
    fullName: document.getElementById("perfilNombre").value,
    email: document.getElementById("perfilEmail").value,
    hashed_password: document.getElementById("perfilPassword").value,
    rol: document.getElementById("perfilRol").value,
    bio: document.getElementById("perfilBio").value
  };

  try {
    const response = await fetch(`http://localhost:8000/usuaris/${usuarioActual.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser)
    });

    if (!response.ok) {
      alert("Error al actualizar usuario");
      return;
    }

    alert("Usuario actualizado correctamente");

    // Bloquear campos otra vez
    document.getElementById("perfilNombre").disabled = true;
    document.getElementById("perfilEmail").disabled = true;
    document.getElementById("perfilPassword").disabled = true;
    document.getElementById("perfilBio").disabled = true;

    // Actualizar usuarioActual
    usuarioActual = await response.json();

    // Restaurar botón
    const btn = document.getElementById("btnActualizarUsuario");
    btn.textContent = "Actualizar usuario";
    btn.removeEventListener("click", guardarCambiosUsuario);
    btn.addEventListener("click", function () {
      document.getElementById("perfilNombre").disabled = false;
      document.getElementById("perfilEmail").disabled = false;
      document.getElementById("perfilPassword").disabled = false;
      document.getElementById("perfilBio").disabled = false;

      btn.textContent = "Guardar cambios";
      btn.removeEventListener("click", arguments.callee);
      btn.addEventListener("click", guardarCambiosUsuario);
    });

  } catch (error) {
    console.error("Error actualizando usuario:", error);
    alert("Error al conectar con el servidor");
  }
}

// -------------------- GESTION USUARIOS --------------------

async function cargarUsuarios() {
  try {
    const response = await fetch("http://localhost:8000/usuaris");

    if (!response.ok) {
      console.error("Error cargando usuarios");
      return;
    }

    const usuarios = await response.json();

    const contenedor = document.getElementById("listaUsuarios");
    contenedor.innerHTML = "";

    usuarios.forEach(usuario => {
      const boton = document.createElement("button");
      boton.classList.add("btn", "btn-primary", "m-2");
      boton.textContent = `${usuario.fullName} (${usuario.email})`;

      boton.addEventListener("click", () => {
        mostrarOpcionesUsuario(usuario);
      });

      contenedor.appendChild(boton);
    });

  } catch (error) {
    console.error("Error cargando usuarios:", error);
  }
}

function mostrarOpcionesUsuario(usuario) {
  const acciones = document.getElementById("accionesUsuario");

  acciones.innerHTML = `
    <h3>${usuario.fullName}</h3>
    <button id="btnEliminar" class="btn btn-danger m-2">Eliminar usuario</button>
    <button id="btnEditar" class="btn btn-warning m-2">Actualizar usuario</button>
  `;

  document.getElementById("btnEliminar").onclick = () => eliminarUsuario(usuario.id);
  document.getElementById("btnEditar").onclick = () => cargarUsuarioEnFormulario(usuario);
}

async function eliminarUsuario(id) {
  if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

  const response = await fetch(`http://localhost:8000/usuaris/${id}`, {
    method: "DELETE"
  });

  if (response.ok) {
    alert("Usuario eliminado");
    cargarUsuarios();
    document.getElementById("accionesUsuario").innerHTML = "";
  } else {
    alert("Error al eliminar usuario");
  }
}

function cargarUsuarioEnFormulario(usuario) {
  mostrarPantalla("pantallaPerfil");

  document.getElementById("perfilNombre").value = usuario.fullName;
  document.getElementById("perfilEmail").value = usuario.email;
  document.getElementById("perfilRol").value = usuario.rol;
  document.getElementById("perfilBio").value = usuario.bio;
  document.getElementById("perfilPassword").value = "";

  usuarioActual = usuario;
}

// Creacion de usuarios (ADMIN)

document.getElementById("btnCrearUsuario").addEventListener("click", () => {
  mostrarPantalla("pantallaCrearUsuario");

  // Vaciar campos
  document.getElementById("crearNombre").value = "";
  document.getElementById("crearEmail").value = "";
  document.getElementById("crearPassword").value = "";
  document.getElementById("crearRol").value = "Viajero";
  document.getElementById("crearBio").value = "";
});

document.getElementById("btnCrearUsuarioEnviar").addEventListener("click", async () => {

  const nuevoUsuario = {
    fullName: document.getElementById("crearNombre").value,
    email: document.getElementById("crearEmail").value,
    hashed_password: document.getElementById("crearPassword").value,
    rol: document.getElementById("crearRol").value,
    bio: document.getElementById("crearBio").value
  };

  try {
    const response = await fetch("http://localhost:8000/usuaris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario)
    });

    if (!response.ok) {
      alert("Error al crear usuario");
      return;
    }

    alert("Usuario creado correctamente");

    // Volver a la gestión de usuarios
    mostrarPantalla("pantallaUsuarios");
    cargarUsuarios();

  } catch (error) {
    console.error("Error creando usuario:", error);
    alert("Error al conectar con el servidor");
  }
});

// -------------------- GESTION VIAJES --------------------

async function cargarViajes() {
  try {
    const response = await fetch("http://localhost:8000/viatges");

    if (!response.ok) {
      console.error("Error cargando viajes");
      return;
    }

    const viajes = await response.json();

    const contenedor = document.getElementById("listaViajes");
    contenedor.innerHTML = "";

    viajes.forEach(viaje => {

      // Formatear fechas (tu backend ya devuelve YYYY-MM-DD)
      const salida = viaje.fecha_inicio;
      const vuelta = viaje.fecha_fin;

      const boton = document.createElement("button");
      boton.classList.add("btn", "btn-primary", "m-2", "w-100");

      // Formato fechas
      boton.textContent = `Viaje a ${viaje.destino} (${salida} → ${vuelta})`;

      boton.addEventListener("click", () => {
        mostrarOpcionesViaje(viaje);
      });

      contenedor.appendChild(boton);
    });

  } catch (error) {
    console.error("Error cargando viajes:", error);
  }
}

function mostrarOpcionesViaje(viaje) {
  const acciones = document.getElementById("accionesViaje");

  acciones.innerHTML = `
    <h3>${viaje.nombre}</h3>
    <p><strong>${viaje.fecha_inicio} → ${viaje.fecha_fin}</strong></p>

    <button id="btnEliminarViaje" class="btn btn-danger m-2">Eliminar viaje</button>
    <button id="btnEditarViaje" class="btn btn-warning m-2">Actualizar viaje</button>
  `;

  document.getElementById("btnEliminarViaje").onclick = () => eliminarViaje(viaje.id);
  document.getElementById("btnEditarViaje").onclick = () => cargarViajeEnFormulario(viaje);

  //Mostrar chat
  document.getElementById("chatViaje").classList.remove("d-none");

  //Cargar mensajes del viaje
  cargarMensajes(viaje.id);

  //Guardar ID del viaje actual para enviar mensajes
  window.viajeChatActual = viaje.id;
}

async function cargarMensajes(viajeId) {
  try {
    const response = await fetch(`http://localhost:8000/viatges/${viajeId}/comentaris`);
    const mensajes = await response.json();

    const contenedor = document.getElementById("mensajesChat");
    contenedor.innerHTML = "";

    mensajes.forEach(msg => {
      const div = document.createElement("div");
      div.classList.add("mb-2", "mensaje-item");

      div.textContent = msg.contingut;

      div.dataset.id = msg.id;

      div.addEventListener("click", () => mostrarBotonEliminar(div));

      contenedor.appendChild(div);
    });

    contenedor.scrollTop = contenedor.scrollHeight;

  } catch (error) {
    console.error("Error cargando mensajes:", error);
  }
}

async function crearViaje() {

  const nuevo = {
    nombre: document.getElementById("crearTitulo").value,
    destino: document.getElementById("crearDestino").value,
    fecha_inicio: document.getElementById("crearFechaInicio").value,
    fecha_fin: document.getElementById("crearFechaFin").value,
    descripcion: document.getElementById("crearDescripcion").value,
    maximo_participantes: parseInt(document.getElementById("crearMaxParticipantes").value),
    total_participantes: 0,
    creador_id: usuarioActual.id,
    estado: "Planificando"
  };

  try {
    const response = await fetch("http://localhost:8000/viatges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo)
    });

    if (!response.ok) {
      alert("Error al crear viaje");
      return;
    }

    alert("Viaje creado correctamente");

    mostrarPantalla("pantallaViajes");
    cargarViajes();

  } catch (error) {
    console.error("Error creando viaje:", error);
  }
}


async function eliminarViaje(id) {
  if (!confirm("¿Seguro que quieres eliminar este viaje?")) return;

  try {
    const response = await fetch(`http://localhost:8000/viatges/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      alert("Error al eliminar viaje");
      return;
    }

    alert("Viaje eliminado correctamente");

    // Recargar lista
    cargarViajes();

    // Limpiar panel de acciones
    document.getElementById("accionesViaje").innerHTML = "";

  } catch (error) {
    console.error("Error eliminando viaje:", error);
  }
}

function cargarViajeEnFormulario(viaje) {
  mostrarPantalla("pantallaCrearViaje");

  // Cambiar título
  document.getElementById("tituloFormularioViaje").textContent = "Actualizar viaje";

  // Rellenar campos visibles
  document.getElementById("crearTitulo").value = viaje.nombre;
  document.getElementById("crearDestino").value = viaje.destino;
  document.getElementById("crearFechaInicio").value = viaje.fecha_inicio;
  document.getElementById("crearFechaFin").value = viaje.fecha_fin;
  document.getElementById("crearDescripcion").value = viaje.descripcion;
  document.getElementById("crearMaxParticipantes").value = viaje.maximo_participantes;

  // Valores que NO están en el formulario
  window.viajeEditando = viaje.id;
  window.viajeEditandoCreador = viaje.creador_id;
  window.viajeEditandoTotal = viaje.total_participantes;
  window.viajeEditandoEstado = viaje.estado;

  // Cambiar botón
  const btn = document.getElementById("btnCrearViajeEnviar");
  btn.textContent = "Guardar cambios";
  btn.onclick = actualizarViaje;
}

async function actualizarViaje() {

  const updated = {
    nombre: document.getElementById("crearTitulo").value,
    destino: document.getElementById("crearDestino").value,
    fecha_inicio: document.getElementById("crearFechaInicio").value,
    fecha_fin: document.getElementById("crearFechaFin").value,
    descripcion: document.getElementById("crearDescripcion").value,
    maximo_participantes: parseInt(document.getElementById("crearMaxParticipantes").value),

    // Valores que vienen del viaje original
    creador_id: window.viajeEditandoCreador,
    total_participantes: window.viajeEditandoTotal,
    estado: window.viajeEditandoEstado
  };

  const response = await fetch(`http://localhost:8000/viatges/${window.viajeEditando}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated)
  });

  if (!response.ok) {
    alert("Error al actualizar viaje");
    return;
  }

  alert("Viaje actualizado correctamente");
  mostrarPantalla("pantallaViajes");
  cargarViajes();
}

async function enviarMensaje() {
  console.log(">>> enviarMensaje() ejecutado");

  const texto = document.getElementById("inputMensaje").value.trim();
  if (texto === "") return;

  const mensaje = {
    viatge_id: window.viajeChatActual,
    autor_id: null, // anónimo
    contingut: texto,
    timestamp: new Date().toISOString()
  };

  console.log("Mensaje a enviar:", mensaje);

  try {
    const response = await fetch("http://localhost:8000/misatge_xat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mensaje)
    });

    console.log("Respuesta POST:", response.status);

    if (!response.ok) {
      console.error("Error enviando mensaje:", await response.text());
      return;
    }

    // Limpiar input
    document.getElementById("inputMensaje").value = "";

    // Recargar mensajes
    cargarMensajes(window.viajeChatActual);

  } catch (error) {
    console.error("Error enviando mensaje:", error);
  }
}

function mostrarBotonEliminar(divMensaje) {
  // Evitar duplicar botones
  if (divMensaje.querySelector(".btn-eliminar")) return;

  const btn = document.createElement("button");
  btn.textContent = "Eliminar";
  btn.classList.add("btn-eliminar");
  btn.style.marginLeft = "10px";

  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // Evita reabrir el botón
    eliminarMensaje(divMensaje.dataset.id);
  });

  divMensaje.appendChild(btn);
}

async function eliminarMensaje(id) {
  console.log("Eliminando mensaje ID:", id);

  try {
    const response = await fetch(`http://localhost:8000/misatge_xat/${id}`, {
      method: "DELETE"
    });

    console.log("Respuesta DELETE:", response.status);

    if (!response.ok) {
      console.error("Error eliminando mensaje:", await response.text());
      return;
    }

    // Recargar mensajes
    cargarMensajes(window.viajeChatActual);

  } catch (error) {
    console.error("Error eliminando mensaje:", error);
  }
}

//

let peticioSeleccionada = null;

// ===============================
// Cargar lista de peticiones
// ===============================
async function cargarPeticions() {
  try {
    const response = await fetch("http://localhost:8000/peticio_promocio/");
    const peticions = await response.json();

    const contenedor = document.getElementById("llistaPeticions");
    contenedor.innerHTML = "";

    console.log("Peticions recibidas:", peticions);

    peticions.forEach(p => {
      const boton = document.createElement("button");

      // MISMAS CLASES QUE LOS USUARIOS
      boton.classList.add("btn", "btn-primary", "m-2", "w-100");

      boton.innerHTML = `
        Estat: ${p.estat || "Pendent"}
      `;

      boton.addEventListener("click", () => obrirFormulari(p));

      contenedor.appendChild(boton);
    });

  } catch (error) {
    console.error("Error cargando peticions:", error);
  }
}



// ===============================
// Abrir formulario con datos
// ===============================
async function obrirFormulari(peticio) {
  peticioSeleccionada = peticio;

  // 1. Obtener el usuario por ID
  try {
    const response = await fetch(`http://localhost:8000/usuaris/${peticio.usuari_solicitant}`);
    const usuario = await response.json();

    // 2. Rellenar el formulario con datos reales
    document.getElementById("peticioUsuari").value = usuario.fullName;
  } catch (error) {
    console.error("Error obtenint usuari:", error);
  }

  // 3. Resto de campos de la petició
  document.getElementById("peticioDescripcio").value = peticio.misatge_peticio;
  document.getElementById("peticioEstat").value = peticio.estat;

  // 4. Mostrar el formulario
  document.getElementById("formulariPeticio").style.display = "block";
}



// ===============================
// Guardar cambios
// ===============================
async function guardarPeticio() {
  if (!peticioSeleccionada) return;

  const data = {
    usuari_solicitant: peticioSeleccionada.usuari_solicitant,   // nombre correcto
    misatge_peticio: peticioSeleccionada.misatge_peticio,       // NO editable
    estat: document.getElementById("peticioEstat").value        // único editable
  };

  const response = await fetch(`http://localhost:8000/peticio_promocio/${peticioSeleccionada.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    console.error("Error actualitzant petició");
    return;
  }

  cargarPeticions();
  document.getElementById("formulariPeticio").style.display = "none";
}

async function cargarViajesDisponibles() {
  try {
    const response = await fetch("http://localhost:8000/viatges");

    if (!response.ok) {
      console.error("Error cargando viajes disponibles");
      return;
    }

    const viajes = await response.json();

    const contenedor = document.getElementById("listaViajesDisponibles");
    contenedor.innerHTML = "";

    viajes.forEach(viaje => {
      const salida = viaje.fecha_inicio;
      const vuelta = viaje.fecha_fin;


      const boton = document.createElement("button");
      boton.classList.add("btn", "btn-primary", "m-2", "w-100");

      boton.textContent = `Viaje a ${viaje.destino} (${salida} → ${vuelta})`;

      boton.addEventListener("click", () => {
        mostrarOpcionesViajeDisponible(viaje);
      });

      contenedor.appendChild(boton);
    });

  } catch (error) {
    console.error("Error cargando viajes disponibles:", error);
  }
}

function mostrarOpcionesViajeDisponible(viaje) {
  const contenedor = document.getElementById("infoViajeSeleccionado");

  contenedor.innerHTML = `
    <h3>${viaje.destino}</h3>
    <p><strong>${viaje.fecha_inicio} → ${viaje.fecha_fin} / Participantes: ${viaje.total_participantes}/${viaje.maximo_participantes}</strong></p>

    <button id="btnInscribirme" class="btn btn-success mt-3">
      Inscribirme en este viaje
    </button>
  `;

  document.getElementById("btnInscribirme").onclick = () => {
    apuntarse(viaje.id);
  };
}

async function apuntarse(viajeId) {
  try {
    const response = await fetch(`http://localhost:8000/viatges/viajes/${viajeId}/apuntarse?usuario_id=${usuarioActual.id}`, {
      method: "POST"
    });

    if (!response.ok) {
      const error = await response.json();
      alert("Error: " + error.detail);
      return;
    }

    alert("Inscripción realizada correctamente");
    cargarViajesDisponibles();

  } catch (error) {
    console.error("Error al inscribirse:", error);
  }
}


async function cargarMisViajes() {
  const contenedor = document.getElementById("listaMisViajes");
  contenedor.innerHTML = "";
  try {
    const response = await fetch(`http://localhost:8000/usuaris/${usuarioActual.id}/viatges`);

    if (!response.ok) {
      console.error("Error cargando mis viajes");
      return;
    }

    const viajes = await response.json();



    if (viajes.length === 0) {
      contenedor.innerHTML = "<p>No estás inscrito en ningún viaje.</p>";
      return;
    }

    viajes.forEach(viaje => {
      const boton = document.createElement("button");
      boton.classList.add("btn", "btn-primary", "m-2", "w-100");

      boton.textContent = `Viaje a ${viaje.destino} (${viaje.fecha_inicio} → ${viaje.fecha_fin})`;

      boton.addEventListener("click", () => {
        mostrarMiViaje(viaje);
      });

      contenedor.appendChild(boton);
    });

  } catch (error) {
    console.error("Error cargando mis viajes:", error);
  }
}

function mostrarMiViaje(viaje) {
  const contenedor = document.getElementById("infoMiViaje");

  contenedor.innerHTML = `
    <h3>${viaje.destino}</h3>
    <p><strong>${viaje.fecha_inicio} → ${viaje.fecha_fin}</strong></p>
    <p><strong>Participantes:</strong> ${viaje.total_participantes}/${viaje.maximo_participantes}</p>
    <p>${viaje.descripcion}</p>

    <button class="btn btn-danger mt-3" onclick="anularInscripcion(${viaje.id})">
      Anular inscripción
    </button>
  `;

  cargarChatViajero(viaje.id);
}


function mostrarOpcionesViaje(viaje) {
  const acciones = document.getElementById("accionesViaje");

  acciones.innerHTML = `
    <h3>${viaje.nombre}</h3>
    <p><strong>${viaje.fecha_inicio} → ${viaje.fecha_fin}</strong></p>

    <button id="btnEliminarViaje" class="btn btn-danger m-2">Eliminar viaje</button>
    <button id="btnEditarViaje" class="btn btn-warning m-2">Actualizar viaje</button>
  `;

  document.getElementById("btnEliminarViaje").onclick = () => eliminarViaje(viaje.id);
  document.getElementById("btnEditarViaje").onclick = () => cargarViajeEnFormulario(viaje);

  //Mostrar chat
  document.getElementById("chatViaje").classList.remove("d-none");

  //Cargar mensajes del viaje
  cargarMensajes(viaje.id);

  //Guardar ID del viaje actual para enviar mensajes
  window.viajeChatActual = viaje.id;
}

async function cargarMensajes(viajeId) {
  try {
    const response = await fetch(`http://localhost:8000/viatges/${viajeId}/comentaris`);
    const mensajes = await response.json();

    const contenedor = document.getElementById("mensajesChat");
    contenedor.innerHTML = "";

    mensajes.forEach(msg => {
      const div = document.createElement("div");
      div.classList.add("mb-2", "mensaje-item");

      div.textContent = msg.contingut;

      div.dataset.id = msg.id;

      div.addEventListener("click", () => mostrarBotonEliminar(div));

      contenedor.appendChild(div);
    });

    contenedor.scrollTop = contenedor.scrollHeight;

  } catch (error) {
    console.error("Error cargando mensajes:", error);
  }
}

async function cargarChatViajero(viajeId) {
  const contenedor = document.getElementById("chatMiViaje");
  contenedor.innerHTML = "<p>Cargando chat...</p>";

  try {
    const response = await fetch(`http://localhost:8000/viatges/${viajeId}/comentaris`);
    const mensajes = await response.json();

    contenedor.innerHTML = `
      <h4>Chat del viaje</h4>

      <div id="mensajesChatViajero"
           style="border:1px solid #ccc; padding:10px; height:250px; overflow-y:auto; background:white;">
      </div>

      <div class="mt-2">
        <input id="mensajeInputViajero" class="form-control" placeholder="Escribe un mensaje...">
        <button class="btn btn-success mt-2" onclick="enviarMensajeViajero(${viajeId})">Enviar</button>
      </div>
    `;

    const lista = document.getElementById("mensajesChatViajero");
    lista.innerHTML = "";

    mensajes.forEach(msg => {
      const div = document.createElement("div");
      div.classList.add("mb-2", "p-2", "border", "rounded");

      // SIN botón de eliminar
      div.textContent = msg.contingut;

      lista.appendChild(div);
    });

    lista.scrollTop = lista.scrollHeight;

  } catch (error) {
    contenedor.innerHTML = "<p>Error cargando el chat.</p>";
    console.error("Error cargando chat:", error);
  }
}

async function enviarMensajeViajero(viajeId) {
  console.log(">>> enviarMensajeViajero() ejecutado");

  const texto = document.getElementById("mensajeInputViajero").value.trim();
  if (!texto) return;

  const mensaje = {
    viatge_id: viajeId,
    autor_id: usuarioActual.id,
    contingut: texto,
    timestamp: new Date().toISOString()
  };

  console.log("Mensaje a enviar:", mensaje);

  try {
    const response = await fetch("http://localhost:8000/misatge_xat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mensaje)
    });

    console.log("Respuesta POST:", response.status);

    if (!response.ok) {
      console.error("Error enviando mensaje:", await response.text());
      return;
    }

    // Limpiar input
    document.getElementById("mensajeInputViajero").value = "";

    // Recargar chat del viajero
    cargarChatViajero(viajeId);

  } catch (error) {
    console.error("Error enviando mensaje:", error);
  }
}

async function anularInscripcion(viajeId) {
  if (!confirm("¿Seguro que quieres anular tu inscripción?")) return;

  try {
    const response = await fetch(
      `http://localhost:8000/viatges/viajes/${viajeId}/borrarse?usuario_id=${usuarioActual.id}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Error al anular inscripción:", error);
      alert("No se pudo anular la inscripción.");
      return;
    }

    alert("Te has borrado del viaje correctamente.");

    cargarMisViajes();
    document.getElementById("infoMiViaje").innerHTML = "";
    document.getElementById("chatMiViaje").innerHTML = "";

  } catch (error) {
    console.error("Error:", error);
  }
}


async function enviarPeticionPromocion() {
  const mensaje = document.getElementById("mensajePeticion").value.trim();

  if (mensaje === "") {
    alert("Debes escribir un mensaje.");
    return;
  }

  const peticion = {
    usuari_solicitant: usuarioActual.id,
    misatge_peticio: mensaje,
    estat: "pendent"
  };

  try {
    const response = await fetch("http://localhost:8000/peticio_promocio/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(peticion)
    });

    if (!response.ok) {
      console.error(await response.text());
      alert("Error enviando la petición.");
      return;
    }

    alert("Petición enviada correctamente.");
    document.getElementById("mensajePeticion").value = "";

  } catch (error) {
    console.error("Error:", error);
  }
}








// Conectar botón guardar
document.getElementById("btnGuardarPeticio").addEventListener("click", guardarPeticio);

// Cargar lista al iniciar
cargarPeticions();



// --- LOGOUT ---
document.getElementById("logoutBtn").addEventListener("click", function () {
  location.reload();
});

document.getElementById("btnCrearViaje").addEventListener("click", () => {
  mostrarPantalla("pantallaCrearViaje");
});

document.getElementById("btnCrearViajeEnviar").addEventListener("click", () => {
  crearViaje();
});

document.getElementById("btnEnviarMensaje").addEventListener("click", enviarMensaje);


