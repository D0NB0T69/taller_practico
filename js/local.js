function obtenerTareas() {
  const data = localStorage.getItem("tareas");
  if (!data) return [];
  return JSON.parse(data);
}

function guardarTareas(tareas) {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

// Agregar nueva tarea
function agregarTarea(fecha, descripcion) {
  let tareas = obtenerTareas();
  const nueva = {
    id: Date.now(),
    fecha,
    descripcion,
    completada: false
  };
  tareas.push(nueva);
  guardarTareas(tareas);
  mostrarTareas();
}

// Mostrar tareas en la página
function mostrarTareas() {
  let lista = document.getElementById("listaTareas");
  if (!lista) {
    lista = document.createElement("div");
    lista.id = "listaTareas";
    document.body.appendChild(lista);
  }
  lista.innerHTML = ""; //limpia la lista

  let tareas = obtenerTareas();
  tareas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  tareas.forEach(t => {
    const div = document.createElement("div");
    div.className = "tarea" + (t.completada ? " completada" : "");

    const span = document.createElement("span");
    span.innerHTML = `<b>${t.fecha}</b>: ${t.descripcion}`;

    const btnToggle = document.createElement("button");
    btnToggle.textContent = t.completada ? "Desmarcar" : "Completar";
    btnToggle.addEventListener("click", () => toggleCompletada(t.id));

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => eliminarTarea(t.id));

    div.appendChild(span);
    div.appendChild(btnToggle);
    div.appendChild(btnEliminar);
    lista.appendChild(div);
  });
}

// Eliminar tarea
function eliminarTarea(id) {
  let tareas = obtenerTareas();
  tareas = tareas.filter(t => t.id !== id);
  guardarTareas(tareas);
  mostrarTareas();
}

// Completar / desmarcar tarea
function toggleCompletada(id) {
  let tareas = obtenerTareas();
  tareas = tareas.map(t => {
    if (t.id === id) t.completada = !t.completada;
    return t;
  });
  guardarTareas(tareas);
  mostrarTareas();
}

// Evento del formulario
document.getElementById("formTarea").addEventListener("submit", e => {
  e.preventDefault();
  const fecha = document.getElementById("fecha").value;
  const descripcion = document.getElementById("descripcion").value;
  agregarTarea(fecha, descripcion);
  document.getElementById("formTarea").reset();
});

// Inicialización
mostrarTareas();
