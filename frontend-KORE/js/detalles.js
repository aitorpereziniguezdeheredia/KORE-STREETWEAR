import { addToCart } from './cartUtils.js';

const API_URL = 'http://localhost/backend/public/api';

document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        console.error('ID de producto no encontrado en la URL');
        return;
    }

    // Elementos del DOM
    const tituloPagina = document.getElementById('detalle-titulo-pagina');
    const imgPrincipal = document.getElementById('detalle-imagen-principal');
    const miniaturas = document.getElementById('detalle-miniaturas');
    const nombreEl = document.getElementById('detalle-nombre');
    const descripcionEl = document.getElementById('detalle-descripcion');
    const precioEl = document.getElementById('detalle-precio');
    const tallaSelect = document.getElementById('detalle-talla');
    const colorSelect = document.getElementById('detalle-color');
    const cantidadInput = document.getElementById('detalle-cantidad');
    const btnCarrito = document.getElementById('boton-anadir-carrito');

    let productoActual = null;
    let inventario = [];

    // -------------------------
    // CARGAR PRODUCTO
    // -------------------------
    async function cargarProducto() {
        const res = await fetch(`${API_URL}/productos/${productId}`);
        if (!res.ok) throw new Error('Error cargando producto');

        productoActual = await res.json();

        tituloPagina.textContent = `${productoActual.nombre} - KÖRE Streetwear`;
        nombreEl.textContent = productoActual.nombre;
        descripcionEl.textContent = productoActual.descripcion || '';
        precioEl.textContent = parseFloat(productoActual.precio).toFixed(2);

        imgPrincipal.src = productoActual.imagen_url;
        imgPrincipal.alt = productoActual.nombre;
    }

    // -------------------------
    // CARGAR INVENTARIO
    // -------------------------
    async function cargarInventario() {
        const res = await fetch(`${API_URL}/inventario/producto/${productId}`);
        if (!res.ok) throw new Error('Error cargando inventario');

        inventario = await res.json();

        const tallas = [...new Set(inventario.map(i => i.talla))];
        const colores = [...new Set(inventario.map(i => i.color))];

        tallas.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            tallaSelect.appendChild(opt);
        });

        colores.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            colorSelect.appendChild(opt);
        });
    }

    // -------------------------
    // AÑADIR AL CARRITO
    // -------------------------
    function configurarBotonCarrito() {
        if (!btnCarrito) return;

        btnCarrito.addEventListener('click', () => {
            const talla = tallaSelect.value;
            const color = colorSelect.value;
            const cantidad = parseInt(cantidadInput.value, 10);

            if (!talla || !color) {
                alert('Selecciona talla y color');
                return;
            }

            if (cantidad < 1) {
                alert('Cantidad inválida');
                return;
            }

            addToCart({
                id: productoActual.ID_producto,
                name: productoActual.nombre,
                price: parseFloat(productoActual.precio),
                images: [productoActual.imagen_url],
                quantity: cantidad,
                selectedSize: talla,
                selectedColor: color
            });

            window.location.href = 'carrito.html';
        });
    }

    // -------------------------
    // INIT
    // -------------------------
    (async () => {
        try {
            await cargarProducto();
            await cargarInventario();
            configurarBotonCarrito();
        } catch (err) {
            console.error(err);
            nombreEl.textContent = 'Error cargando producto';
        }
    })();

});
