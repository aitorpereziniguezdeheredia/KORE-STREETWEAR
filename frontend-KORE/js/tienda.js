// Importar funciones de utilidad del carrito (se mantienen)
import { getCartItems, saveCartItems, addToCart } from "./cartUtils.js";

// =====================
// CONFIGURACIÓN GLOBAL
// =====================
let productos = [];
let modoEliminarActivo = false;

const API_URL = "http://localhost/backend/public/api";
const token = localStorage.getItem("token");
const usuario = JSON.parse(localStorage.getItem("usuario"));

// =====================
// RENDER GALERÍA
// =====================
function renderizarGaleria() {
  const galeria = document.getElementById("listaProductos");
  if (!galeria) {
    console.error("Elemento #listaProductos no encontrado");
    return;
  }

  galeria.innerHTML = "";

  productos.forEach((producto) => {
    const article = document.createElement("article");

    const productId = producto.ID_producto;
    const productName = producto.nombre;
    const productPrice = Number(producto.precio).toFixed(2);
    const productImageSrc = producto.imagen_url;

    article.innerHTML = `
      <img src="${productImageSrc}" alt="${productName}">
      <h3>${productName}</h3>
      <p>Precio: ${productPrice}€</p>
      <button 
        type="button"
        data-product-id="${productId}" 
        class="accion-boton">
        ${modoEliminarActivo ? "Eliminar" : "Comprar"}
      </button>
    `;

    galeria.appendChild(article);

    const boton = article.querySelector(".accion-boton");

    // 🔴 MODO ELIMINAR (ADMIN)
    if (modoEliminarActivo && usuario?.ID_rol === 1) {
      boton.classList.add("eliminar-modo");
      boton.addEventListener("click", async (e) => {
        e.preventDefault();

        if (!confirm("¿Eliminar este producto?")) return;

        try {
          const res = await fetch(`${API_URL}/productos/${productId}`, {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + token,
              Accept: "application/json",
            },
          });

          if (!res.ok) throw new Error();

          productos = productos.filter(
            (p) => p.ID_producto !== productId
          );
          renderizarGaleria();
        } catch {
          alert("No autorizado o error al eliminar");
        }
      });
    } else {
      // 🛒 MODO COMPRA → IR A DETALLE
      boton.classList.add("comprar-modo");
      boton.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `detalle_producto.html?id=${productId}`;
      });
    }
  });
}

// =====================
// FORMULARIO PRODUCTOS
// =====================
function mostrarAñadirProductos() {
  document.getElementById("formulario-productos")?.classList.remove("oculto");
}

function activarModoEliminar() {
  modoEliminarActivo = !modoEliminarActivo;
  const boton = document.getElementById("modo-eliminar");
  if (boton) {
    boton.textContent = modoEliminarActivo
      ? "Desactivar modo eliminar"
      : "Eliminar";
  }
  renderizarGaleria();
}

function inicializarFormularioProducto() {
  const formulario = document.getElementById("anadir-producto-form");
  if (!formulario) return;

  const imagenInput = document.getElementById("imagen-producto");
  const imagenVista = document.getElementById("vista-imagen");
  const botonBorrar = document.getElementById("borrar-imagen");
  const nombreInput = document.getElementById("nombre-producto");
  const precioInput = document.getElementById("precio");
  const vistaNombre = document.getElementById("vista-nombre");
  const vistaPrecio = document.getElementById("vista-precio");

  // Vista previa: nombre
  nombreInput.addEventListener("input", () => {
    vistaNombre.textContent =
      nombreInput.value.trim() || "Nombre del producto";
  });

  // Vista previa: precio
  precioInput.addEventListener("input", () => {
    const valor = precioInput.value;
    vistaPrecio.textContent = valor
      ? `${Number(valor).toFixed(2)}€`
      : "0€";
  });

  // Vista previa: imagen
  imagenInput.addEventListener("change", () => {
    const file = imagenInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      imagenVista.src = e.target.result;
      botonBorrar.style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  botonBorrar.addEventListener("click", () => {
    imagenVista.src = "";
    imagenInput.value = "";
    botonBorrar.style.display = "none";
  });

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(formulario);

    try {
      const res = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
        body: formData,
      });

      if (!res.ok) throw new Error();

      const productoCreado = await res.json();
      productos.push(productoCreado);
      renderizarGaleria();

      formulario.reset();
      document
        .getElementById("formulario-productos")
        .classList.add("oculto");
      imagenVista.src = "";
      botonBorrar.style.display = "none";
    } catch {
      alert("No autorizado o error al crear producto");
    }
  });
}

// =====================
// CARGAR PRODUCTOS API
// =====================
async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) throw new Error();

    productos = await response.json();
    renderizarGaleria();
  } catch {
    console.error("Error cargando productos");
  }
}

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  inicializarFormularioProducto();

  if (usuario?.ID_rol === 1) {
    document.getElementById("adminPanel")?.classList.remove("oculto");
  }

  document
    .getElementById("anadir-productos")
    ?.addEventListener("click", mostrarAñadirProductos);

  document
    .getElementById("modo-eliminar")
    ?.addEventListener("click", activarModoEliminar);

  document
    .getElementById("cerrar-formulario")
    ?.addEventListener("click", () => {
      document
        .getElementById("formulario-productos")
        ?.classList.add("oculto");
    });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document
        .getElementById("formulario-productos")
        ?.classList.add("oculto");
      if (modoEliminarActivo) activarModoEliminar();
    }
  });
});
