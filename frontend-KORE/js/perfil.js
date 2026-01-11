document.addEventListener("DOMContentLoaded", () => {
    cargarDatosUsuario();
    cargarHistorialPedidos();
});

/* ===============================
   DATOS DE USUARIO
================================ */
function cargarDatosUsuario() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return;

    document.getElementById("nombre").value = usuario.nombre || "";
    document.getElementById("apellido").value = usuario.apellido || "";
    document.getElementById("email").value = usuario.email || "";
    document.getElementById("telefono").value = usuario.telefono || "";
    document.getElementById("rol").value =
        usuario.ID_rol === 1 ? "Administrador" : "Usuario";

    if (usuario.fecha_registro) {
        document.getElementById("fecha_registro").value =
            new Date(usuario.fecha_registro).toLocaleDateString("es-ES");
    }
}

/* ===============================
   HISTORIAL DE PEDIDOS
================================ */
async function cargarHistorialPedidos() {
    const tabla = document.getElementById("historialCompras");
    const token = localStorage.getItem("token");

    if (!token) {
        tabla.innerHTML = `<tr><td colspan="5">Debes iniciar sesión</td></tr>`;
        return;
    }

    try {
        const res = await fetch(
            "http://localhost/backend/public/api/pedidos/mis-pedidos",
            {
                headers: {
                    Authorization: "Bearer " + token,
                    Accept: "application/json",
                },
            }
        );

        if (!res.ok) throw new Error("Error cargando pedidos");

        const pedidos = await res.json();
        tabla.innerHTML = "";

        if (pedidos.length === 0) {
            tabla.innerHTML = `<tr><td colspan="5">No hay pedidos</td></tr>`;
            return;
        }

        pedidos.forEach((pedido) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>#${pedido.ID_pedido}</td>
                <td>${new Date(pedido.fecha_pedido).toLocaleDateString("es-ES")}</td>
                <td>${Number(pedido.total).toFixed(2)} €</td>
                <td>${pedido.estado_pedido}</td>
                <td>
                    <button onclick="verDetallePedido(${pedido.ID_pedido})">
                        Ver detalle
                    </button>
                </td>
            `;

            tabla.appendChild(tr);
        });
    } catch (e) {
        console.error(e);
        tabla.innerHTML = `<tr><td colspan="5">Error cargando pedidos</td></tr>`;
    }
}

/* ===============================
   DETALLE DE PEDIDO
================================ */
async function verDetallePedido(idPedido) {
    const token = localStorage.getItem("token");
    const modal = document.getElementById("modalDetalle");
    const contenido = document.getElementById("contenidoDetalle");

    modal.style.display = "flex";
    contenido.innerHTML = "<p>Cargando...</p>";

    try {
        const res = await fetch(
            `http://localhost/backend/public/api/pedidos/${idPedido}/detalle`,
            {
                headers: {
                    Authorization: "Bearer " + token,
                    Accept: "application/json",
                },
            }
        );

        if (!res.ok) {
            const err = await res.json();
            throw err;
        }

        const data = await res.json();

        if (!data.productos || data.productos.length === 0) {
            contenido.innerHTML = "<p>Este pedido no tiene productos</p>";
            return;
        }

        let html = `<h3>Pedido #${data.pedido_id}</h3>`;

        data.productos.forEach((p) => {
            html += `
                <div class="producto-detalle">
                    <img src="${p.imagen_url}" alt="${p.nombre}">
                    <div>
                        <strong>${p.nombre}</strong><br>
                        Talla: ${p.talla || "-"}<br>
                        Color: ${p.color || "-"}<br>
                        Cantidad: ${p.cantidad}<br>
                        Precio: ${Number(p.precio_unitario).toFixed(2)} €
                    </div>
                </div>
                <hr>
            `;
        });

        contenido.innerHTML = html;
    } catch (e) {
        console.error(e);
        contenido.innerHTML = "<p>Error cargando detalle del pedido</p>";
    }
}

/* ===============================
   CERRAR MODAL
================================ */
function cerrarModalDetalle() {
    document.getElementById("modalDetalle").style.display = "none";
}
