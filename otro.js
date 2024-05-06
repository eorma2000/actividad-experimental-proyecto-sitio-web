// Funciones adicionales como mostrarProductosCarrito(), mostrarTotalCarrito(), sumarPreciosCarrito(), etc.
// Función para guardar el carrito en el almacenamiento local
function guardarCarrito(carrito) {
  const carritoJSON = JSON.stringify(carrito); // Convertir el objeto JavaScript a JSON
  localStorage.setItem('carrito', carritoJSON); // Guardar el carrito en el almacenamiento local
}

// Función para obtener el carrito del almacenamiento local
function obtenerCarrito() {
  // Verificar si hay un carrito almacenado en el almacenamiento local
  if (localStorage.getItem('carrito')) {
      // Si existe, obtener el carrito almacenado y convertirlo de JSON a objeto JavaScript
      const carritoJSON = localStorage.getItem('carrito');
      const carrito = JSON.parse(carritoJSON);
      return carrito;
  } else {
      // Si no hay un carrito almacenado, devolver un carrito vacío
      return {};
  }
}

// Objeto para almacenar los productos en el carrito
let carrito = {};

// Función para agregar un producto al carrito
function agregarAlCarrito(evento) {
  evento.preventDefault();

  // Obtiene el ID del producto desde el atributo data-id del botón
  const productoId = evento.target.dataset.id;
  // Obtener el contenedor del producto actual
  const productoContainer = evento.target.closest('.ropa');
  // Obtener los detalles del producto desde el contenedor
  const imagen = productoContainer.querySelector('img').src;
  const nombre = productoContainer.querySelector('h4').textContent;
  const precio = productoContainer.querySelector('.precio').textContent;

  // Verificar si el producto ya está en el carrito
  if (carrito[productoId]) {
      // Si el producto ya existe en el carrito, aumenta su contador en 1
      carrito[productoId].cantidad += 1;
  } else {
      // Si el producto no existe en el carrito, agregarlo al carrito
      carrito[productoId] = {
          nombre: nombre,
          precio: precio,
          cantidad: 1
      };
  }

  // Actualizar el contador del carrito en la interfaz
  actualizarContadorCarrito();

  // Mostrar los productos en el carrito
  mostrarProductosCarrito();

  // Guardar el carrito actualizado en el almacenamiento local
  guardarCarrito(carrito);
}

// Función para eliminar un producto del carrito
function eliminarProductoCarrito(productoId) {
  delete carrito[productoId];

  // Actualizar el contador del carrito en la interfaz
  actualizarContadorCarrito();

  // Mostrar los productos en el carrito
  mostrarProductosCarrito();

  // Guardar el carrito actualizado en el almacenamiento local
  guardarCarrito(carrito);
}

// Función para vaciar completamente el carrito
function vaciarCarrito(event) {
  event.preventDefault();

  // Limpiar el carrito
  carrito = {};

  // Actualizar el contador del carrito en la interfaz
  actualizarContadorCarrito();

  // Mostrar los productos en el carrito
  mostrarProductosCarrito();

  // Guardar el carrito vacío en el almacenamiento local
  guardarCarrito(carrito);
}

// Función para actualizar el contador del carrito en la interfaz
function actualizarContadorCarrito() {
  // Obtiene una referencia al elemento donde se mostrará el contador
  const contadorCarrito = document.getElementById('contador-carrito');

  // Obtiene la cantidad total de productos en el carrito sumando los contadores
  const cantidadTotal = Object.values(carrito).reduce((total, producto) => total + producto.cantidad, 0);

  // Actualiza el texto del contador con la cantidad total
  contadorCarrito.textContent = cantidadTotal;

  // Muestra u oculta el contador según si hay productos en el carrito
  if (cantidadTotal > 0) {
      contadorCarrito.style.display = 'block';
  } else {
      contadorCarrito.style.display = 'none';
  }
}

// Función para mostrar los productos en el carrito
function mostrarProductosCarrito() {
  const tbody = document.querySelector("#lista-carrito tbody");
  tbody.innerHTML = ""; // Limpiar el contenido actual de la tabla

  Object.keys(carrito).forEach((productoId) => {
      const producto = carrito[productoId];
      const fila = document.createElement("tr");
      fila.innerHTML = `
          <td><img src="${producto.imagen}" width="50"></td>
          <td>${producto.nombre}</td>
          <td>${producto.precio}</td>
          <td>${producto.cantidad}</td>
          <td><button class="eliminar-producto" data-id="${productoId}">Eliminar</button></td>
      `;

      // Agregar el evento de clic para eliminar el producto
      const botonEliminar = fila.querySelector(".eliminar-producto");
      botonEliminar.addEventListener("click", () => {
          eliminarProductoCarrito(productoId);
      });

      tbody.appendChild(fila);
  });
}

// Función para mostrar el total en el carrito
function mostrarTotalCarrito() {
  const totalCarritoElement = document.getElementById("total-compra");
  let totalCompra = 0;

  Object.keys(carrito).forEach((productoId) => {
      const producto = carrito[productoId];
      const precioDecimal = parseFloat(producto.precio.replace("$", ""));
      totalCompra += precioDecimal * producto.cantidad;
  });

  // Redondear el resultado a dos decimales
  totalCompra = totalCompra.toFixed(2);

  // Actualizar el contenido del elemento con el total
  totalCarritoElement.textContent = `Total: $${totalCompra}`;
}

// Función para inicializar el carrito al cargar la página
function inicializarCarrito() {
  carrito = obtenerCarrito(); // Obtener el carrito del almacenamiento local
  mostrarProductosCarrito(); // Mostrar los productos en el carrito
  actualizarContadorCarrito(); // Actualizar el contador del carrito
  mostrarTotalCarrito(); // Mostrar el total en el carrito
}

// Agrega un evento de clic a cada botón "Agregar al carrito"
document.querySelectorAll('.agregar-carrito').forEach((boton) => {
  boton.addEventListener('click', agregarAlCarrito);
});

// Agrega un evento de clic al botón "Vaciar Carrito"
document.querySelector("#vaciar-carrito").addEventListener("click", vaciarCarrito);

// Llama a la función para inicializar el carrito al cargar la página

inicializarCarrito();

// Función para alternar la clase "active" en el menú desplegable
function toggleMenu() {
  const navbar = document.querySelector('.menu .navbar');
  navbar.classList.toggle('active');
}
