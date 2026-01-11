// ==============================
// CONFIG
// ==============================
const API_URL = "http://localhost/backend/public/api";
const token = localStorage.getItem("token");

const usuariosPorPagina = 10;
let paginaActual = 1;
let usuarios = [];

// ==============================
// ELEMENTOS DOM
// ==============================
const tbody = document.querySelector("#tabla-usuarios tbody");
const inputBusqueda = document.getElementById("busqueda");
const modal = document.getElementById("modal");
const modalForm = document.getElementById("modalForm");
const modalDetalles = document.getElementById("modalDetalles");
const modalCloseBtn = document.getElementById("modalClose");

// ==============================
// HELPERS
// ==============================
function nombreRol(usuario) {
  return usuario.ID_rol === 1 ? "Administrador" : "Usuario";
}

function usuariosFiltrados() {
  const filtro = inputBusqueda.value.toLowerCase();
  return usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(filtro) ||
      u.apellido.toLowerCase().includes(filtro) ||
      u.email.toLowerCase().includes(filtro)
  );
}

// ==============================
// CARGAR USUARIOS
// ==============================
async function cargarUsuarios() {
  try {
    const res = await fetch(`${API_URL}/usuarios`, {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error("Error al cargar usuarios");

    usuarios = await res.json();
    paginaActual = 1;
    renderTabla(usuariosFiltrados());
  } catch (error) {
    console.error(error);
  }
}

// ==============================
// RENDER TABLA
// ==============================
function renderTabla(lista) {
  tbody.innerHTML = "";

  const inicio = (paginaActual - 1) * usuariosPorPagina;
  const fin = inicio + usuariosPorPagina;
  const pagina = lista.slice(inicio, fin);

  pagina.forEach((usuario) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${usuario.ID_usuario}</td>
      <td>${usuario.nombre} ${usuario.apellido}</td>
      <td>${usuario.email}</td>
      <td>
        <select onchange="cambiarRol(${usuario.ID_usuario}, this.value)">
          <option value="2" ${usuario.ID_rol == 2 ? "selected" : ""}>Usuario</option>
          <option value="1" ${usuario.ID_rol == 1 ? "selected" : ""}>Administrador</option>
        </select>
      </td>
      <td>${usuario.telefono || "-"}</td>
      <td>
        ${
          usuario.fecha_registro
            ? new Date(usuario.fecha_registro).toLocaleDateString("es-ES")
            : "N/D"
        }
      </td>
      <td>
        <button data-id="${usuario.ID_usuario}" class="ver">👁️</button>
        <button data-id="${usuario.ID_usuario}" class="editar">✏️</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  renderPaginacion(lista);
}

// ==============================
// PAGINACIÓN
// ==============================
function renderPaginacion(lista) {
  const contenedor = document.getElementById("paginacion");
  contenedor.innerHTML = "";

  const totalPaginas = Math.ceil(lista.length / usuariosPorPagina);

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = i === paginaActual;

    btn.addEventListener("click", () => {
      paginaActual = i;
      renderTabla(usuariosFiltrados());
    });

    contenedor.appendChild(btn);
  }
}

// ==============================
// CAMBIAR ROL (ADMIN)
// ==============================
async function cambiarRol(idUsuario, nuevoRol) {
  try {
    const res = await fetch(`${API_URL}/usuarios/${idUsuario}/rol`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ID_rol: Number(nuevoRol),
      }),
    });

    if (!res.ok) throw new Error();

    cargarUsuarios();
  } catch (error) {
    alert("Error al cambiar el rol");
    console.error(error);
  }
}

// ==============================
// MODAL VER / EDITAR
// ==============================
tbody.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  const usuario = usuarios.find((u) => u.ID_usuario == id);
  if (!usuario) return;

  modal.style.display = "block";

  // VER
  if (e.target.classList.contains("ver")) {
    modalForm.style.display = "none";
    modalDetalles.style.display = "block";

    modalDetalles.innerHTML = `
      <h3>Detalles del Usuario</h3>
      <p><strong>ID:</strong> ${usuario.ID_usuario}</p>
      <p><strong>Nombre:</strong> ${usuario.nombre}</p>
      <p><strong>Apellido:</strong> ${usuario.apellido}</p>
      <p><strong>Email:</strong> ${usuario.email}</p>
      <p><strong>Rol:</strong> ${nombreRol(usuario)}</p>
      <p><strong>Teléfono:</strong> ${usuario.telefono || "No indicado"}</p>
      <p><strong>Fecha registro:</strong>
        ${
          usuario.fecha_registro
            ? new Date(usuario.fecha_registro).toLocaleDateString("es-ES")
            : "N/D"
        }
      </p>
      <button id="cerrarDetalle">Cerrar</button>
    `;

    document.getElementById("cerrarDetalle").onclick = () => {
      modal.style.display = "none";
    };
  }

  // EDITAR (solo datos básicos)
  if (e.target.classList.contains("editar")) {
    modalDetalles.style.display = "none";
    modalForm.style.display = "block";

    modalForm.id.value = usuario.ID_usuario;
    modalForm.name.value = usuario.nombre;
    modalForm.email.value = usuario.email;
    modalForm.phone.value = usuario.telefono || "";
  }
});

// ==============================
// GUARDAR EDICIÓN
// ==============================
modalForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = modalForm.id.value;

  const payload = {
    nombre: modalForm.name.value,
    email: modalForm.email.value,
    telefono: modalForm.phone.value,
  };

  try {
    const res = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error();

    modal.style.display = "none";
    cargarUsuarios();
  } catch {
    alert("Error al actualizar usuario");
  }
});

// ==============================
// BUSCADOR
// ==============================
inputBusqueda.addEventListener("input", () => {
  paginaActual = 1;
  renderTabla(usuariosFiltrados());
});

// ==============================
// CERRAR MODAL
// ==============================
modalCloseBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// ==============================
// INIT
// ==============================
document.addEventListener("DOMContentLoaded", cargarUsuarios);
