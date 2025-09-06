

//Funciones
//Para agregar nuevas Tareas
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

function mostrarTareas(filtro = "todas", busqueda = "") {
  const lista = document.getElementById("listaTareas");
  lista.innerHTML = "";

  let tareas = obtenerTareas();
}