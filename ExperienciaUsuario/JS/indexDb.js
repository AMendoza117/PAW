// Configuración de IndexedDB
const dbName = "estudianteAMMA";
const storeName = "almacen-amma";

let db = null;

const baseDatos = indexedDB.open(dbName, 1);

baseDatos.onsuccess = (evento) => {
  console.log("Base de datos creada o abierta exitosamente.");
  db = evento.target.result;
  cargarDatos(); // Cargar datos existentes en la tabla
};

baseDatos.onupgradeneeded = (evento) => {
  console.log("Base de datos actualizada.");
  db = evento.target.result;
  db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
};

baseDatos.onerror = (evento) => {
  console.error("Error al abrir la base de datos:", evento.target.error);
};

// Obtener el almacén de datos
const obtenerAlmacen = (modo) => {
  const transaccion = db.transaction(storeName, modo);
  return transaccion.objectStore(storeName);
};

// Guardar datos
const guardar = (data, callback = null) => {
  const almacen = obtenerAlmacen("readwrite");
  const solicitud = almacen.add(data);

  solicitud.onsuccess = () => {
    console.log("Datos guardados exitosamente:", data);
    if (callback) callback();
  };

  solicitud.onerror = (evento) => {
    console.error("Error al guardar los datos:", evento.target.error);
  };
};

// Cargar datos en la tabla
const cargarDatos = () => {
  const almacen = obtenerAlmacen("readonly");
  const solicitud = almacen.getAll();

  solicitud.onsuccess = (evento) => {
    const datos = evento.target.result;
    const tablaCuerpo = document
      .getElementById("dataTable")
      .querySelector("tbody");
    tablaCuerpo.innerHTML = ""; // Limpiar contenido anterior

    datos.forEach((item) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
                        <td>${item.nombre}</td>
                        <td>${item.apellidos}</td>
                        <td>${item.edad}</td>
                        <td>${item.correo}</td>
                    `;
      tablaCuerpo.appendChild(fila);
    });
  };

  solicitud.onerror = (evento) => {
    console.error("Error al cargar los datos:", evento.target.error);
  };
};

// Manejar el formulario de envío
document.getElementById("infoForm").addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const edad = parseInt(document.getElementById("edad").value.trim());
  const correo = document.getElementById("correo").value.trim();

  if (!nombre || !apellidos || isNaN(edad) || !correo) {
    alert("Por favor, llena todos los campos correctamente.");
    return;
  }

  const nuevoRegistro = { nombre, apellidos, edad, correo };

  guardar(nuevoRegistro, () => {
    cargarDatos(); // Actualizar la tabla con los nuevos datos
    document.getElementById("infoForm").reset(); // Limpiar formulario
    alert("¡Datos registrados exitosamente!");
  });
});
