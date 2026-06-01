// CONFIGURACIÓN - GNews funciona en GitHub Pages (NewsAPI no)
const API_KEY = 'd9f1dff045f7a9a86aa6ecf9eec2ea24'; // Tu API key de gnews.io
const API_URL = 'https://gnews.io/api/v4/top-headlines';

// Variables
let categoriaActual = 'technology';
const elementos = {
    btnRefrescar: document.getElementById('btnRefrescar'),
    categoria: document.getElementById('categoria'),
    contenedorNoticias: document.getElementById('contenedor-noticias'),
    cargando: document.getElementById('cargando'),
    error: document.getElementById('error'),
    modal: document.getElementById('modal'),
    cerrarModal: document.getElementById('cerrarModal'),
    modalBody: document.getElementById('modal-body')
};

// ===== EVENT LISTENERS =====
elementos.btnRefrescar.addEventListener('click', cargarNoticias);
elementos.categoria.addEventListener('change', (e) => {
    categoriaActual = e.target.value;
    cargarNoticias();
});
elementos.cerrarModal.addEventListener('click', cerrarModal);
window.addEventListener('click', (e) => {
    if (e.target === elementos.modal) {
        cerrarModal();
    }
});

// ===== FUNCIONES PRINCIPALES =====

async function cargarNoticias() {
    mostrarCargando(true);
    ocultarError();

    try {
        const respuesta = await fetch(
            `${API_URL}?category=${categoriaActual}&lang=es&max=10&token=${API_KEY}`
        );

        if (!respuesta.ok) {
            throw new Error('Error al conectar con la API');
        }

        const datos = await respuesta.json();

        if (!datos.articles || datos.articles.length === 0) {
            mostrarError('No se encontraron noticias para esta categoría');
            mostrarCargando(false);
            return;
        }

        mostrarNoticias(datos.articles);
        mostrarCargando(false);

    } catch (error) {
        console.error('Error:', error);
        mostrarError('No se pudo cargar las noticias. Intenta nuevamente.');
        mostrarCargando(false);
    }
}

function mostrarNoticias(noticias) {
    elementos.contenedorNoticias.innerHTML = '';

    noticias.forEach(noticia => {
        const noticiaTarjeta = document.createElement('div');
        noticiaTarjeta.className = 'noticia';
        noticiaTarjeta.innerHTML = `
            <img src="${noticia.image || 'https://via.placeholder.com/300x200?text=Sin+imagen'}" 
                 alt="${noticia.title}" class="noticia-imagen">
            <div class="noticia-contenido">
                <h3 class="noticia-titulo">${noticia.title}</h3>
                <p class="noticia-descripcion">${noticia.description || 'Sin descripción disponible'}</p>
                <div class="noticia-metadata">
                    <span>${noticia.source.name}</span>
                    <span>${formatearFecha(noticia.publishedAt)}</span>
                </div>
            </div>
        `;

        noticiaTarjeta.addEventListener('click', () => abrirModalNoticia(noticia));
        elementos.contenedorNoticias.appendChild(noticiaTarjeta);
    });
}

function abrirModalNoticia(noticia) {
    elementos.modalBody.innerHTML = `
        <h2>${noticia.title}</h2>
        <img src="${noticia.image || 'https://via.placeholder.com/700x400?text=Sin+imagen'}" 
             alt="${noticia.title}">
        <p><strong>Fuente:</strong> ${noticia.source.name}</p>
        <p><strong>Fecha:</strong> ${formatearFecha(noticia.publishedAt)}</p>
        <p>${noticia.description || 'Sin contenido disponible'}</p>
        <a href="${noticia.url}" target="_blank">Leer artículo completo →</a>
    `;
    elementos.modal.style.display = 'flex';
}

function cerrarModal() {
    elementos.modal.style.display = 'none';
}

function mostrarCargando(visible) {
    elementos.cargando.style.display = visible ? 'block' : 'none';
}

function mostrarError(mensaje) {
    elementos.error.textContent = mensaje;
    elementos.error.style.display = 'block';
}

function ocultarError() {
    elementos.error.style.display = 'none';
}

function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ===== CARGAR NOTICIAS AL INICIAR =====
cargarNoticias();