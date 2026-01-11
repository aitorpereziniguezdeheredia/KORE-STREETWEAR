// js/carrito.js
import { getCartItems, saveCartItems } from './cartUtils.js';

document.addEventListener('DOMContentLoaded', () => {

    const listaProductos = document.getElementById('lista-productos-carrito');
    const subtotalEl = document.getElementById('subtotal-carrito');
    const envioEl = document.getElementById('envio-carrito');
    const totalEl = document.getElementById('total-carrito');
    const btnCheckout = document.getElementById('boton-checkout');
    const btnVaciar = document.getElementById('vaciar-carrito');
    const mensajeVacio = document.querySelector('.carrito-vacio-mensaje');

    const COSTO_ENVIO = 5.00;
    const API_URL = 'http://localhost/backend/public/api';
    const token = localStorage.getItem('token');

    // =========================
    // RENDER CARRITO
    // =========================
    function renderCarrito() {
        const carrito = getCartItems();
        listaProductos.innerHTML = '';

        if (carrito.length === 0) {
            mensajeVacio.style.display = 'block';
            btnCheckout.disabled = true;
            btnVaciar.disabled = true;
            actualizarTotales();
            return;
        }

        mensajeVacio.style.display = 'none';
        btnCheckout.disabled = false;
        btnVaciar.disabled = false;

        carrito.forEach(item => {
            const precio = Number(item.price ?? item.precio ?? 0);

            const article = document.createElement('article');
            article.classList.add('item-carrito');

            article.innerHTML = `
                <img src="${item.images?.[0] || item.imagen_url || ''}" alt="${item.name || item.nombre}">
                <div class="info-item">
                    <h3>${item.name || item.nombre}</h3>
                    ${item.selectedSize ? `<p>Talla: ${item.selectedSize}</p>` : ''}
                    ${item.selectedColor ? `<p>Color: ${item.selectedColor}</p>` : ''}
                    <p class="precio-item">${precio.toFixed(2)}€</p>

                    <div class="cantidad-selector">
                        <button class="restar" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="sumar" data-id="${item.id}">+</button>
                    </div>

                    <button class="eliminar" data-id="${item.id}">Eliminar</button>
                </div>
            `;

            listaProductos.appendChild(article);
        });

        actualizarTotales();
    }

    // =========================
    // TOTALES
    // =========================
    function actualizarTotales() {
        const carrito = getCartItems();
        let subtotal = 0;

        carrito.forEach(item => {
            const precio = Number(item.price ?? item.precio ?? 0);
            subtotal += precio * item.quantity;
        });

        subtotalEl.textContent = `${subtotal.toFixed(2)}€`;
        envioEl.textContent = `${COSTO_ENVIO.toFixed(2)}€`;
        totalEl.textContent = `${(subtotal + COSTO_ENVIO).toFixed(2)}€`;
    }

    // =========================
    // CANTIDAD / ELIMINAR
    // =========================
    function actualizarCantidad(id, cambio) {
        const carrito = getCartItems();
        const index = carrito.findIndex(p => p.id == id);

        if (index !== -1) {
            carrito[index].quantity += cambio;
            if (carrito[index].quantity <= 0) {
                carrito.splice(index, 1);
            }
            saveCartItems(carrito);
            renderCarrito();
        }
    }

    function eliminarProducto(id) {
        const carrito = getCartItems().filter(p => p.id != id);
        saveCartItems(carrito);
        renderCarrito();
    }

    listaProductos.addEventListener('click', e => {
        if (e.target.classList.contains('sumar')) {
            actualizarCantidad(e.target.dataset.id, 1);
        }
        if (e.target.classList.contains('restar')) {
            actualizarCantidad(e.target.dataset.id, -1);
        }
        if (e.target.classList.contains('eliminar')) {
            eliminarProducto(e.target.dataset.id);
        }
    });

    btnVaciar.addEventListener('click', () => {
        if (confirm('¿Vaciar el carrito?')) {
            saveCartItems([]);
            renderCarrito();
        }
    });

    // =========================
    // CREAR PEDIDO (POST)
    // =========================
    btnCheckout.addEventListener('click', async () => {
        const carrito = getCartItems();
        if (carrito.length === 0) return;

        let subtotal = 0;

        carrito.forEach(item => {
            const precio = Number(item.price ?? item.precio ?? 0);
            subtotal += precio * item.quantity;
        });

        const payload = {
            subtotal: subtotal,
            costo_envio: COSTO_ENVIO,
            total: subtotal + COSTO_ENVIO,
            items: carrito.map(item => ({
                ID_producto: item.id,
                talla: item.selectedSize || null,
                color: item.selectedColor || null,
                cantidad: item.quantity,
                precio_unitario: Number(item.price ?? item.precio ?? 0)
            }))
        };

        try {
            const response = await fetch(`${API_URL}/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(errorData);
                throw new Error('Error al crear el pedido');
            }

            const data = await response.json();

            alert('Pedido creado correctamente');
            saveCartItems([]);
            window.location.href = 'tienda.html';

        } catch (error) {
            console.error(error);
            alert('No se pudo completar el pedido');
        }
    });

    renderCarrito();
});
