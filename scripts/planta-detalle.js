document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-detalle");
    if (!contenedor) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const planta = RepositorioPlantas.obtenerPorId(id);

    if (!planta) {
        contenedor.innerHTML = `
            <section>
                <h2>Planta no encontrada</h2>
                <p>El ejemplar que buscás no existe o ya no está disponible en el catálogo.</p>
                <p><a href="catalogo.html" class="boton">Volver al catálogo</a></p>
            </section>
        `;
        return;
    }

    document.title = `Vivero Raíz - ${planta.nombre}`;

    const estado = planta.estadoStock;
    const etiquetasHTML = planta.etiquetas.length
        ? `<div class="etiquetas">${planta.etiquetas.map(e => `<span class="etiqueta">${e}</span>`).join("")}</div>`
        : "";

    contenedor.innerHTML = `
        <section class="detalle-planta">
            <article>
                <span class="badge-stock ${estado.clase}">${estado.texto}</span>
                <h2>${planta.nombre}</h2>
                <p><em>${planta.nombreCientifico}</em></p>
                <img src="${planta.foto}" alt="Foto de ${planta.nombre}" class="foto-detalle">
                ${etiquetasHTML}
                <p><strong>Precio: ${planta.precioFormateado}</strong></p>
                <p><strong>Stock disponible:</strong> ${planta.stock} unidades</p>
                <p><a href="contacto.html?planta=${encodeURIComponent(planta.nombre)}" class="boton">Consultar por esta planta</a></p>
            </article>

            <article>
                <h3>Ficha botánica</h3>
                <table>
                    <tr><th>Categoría</th><td>${planta.categoria}</td></tr>
                    <tr><th>Nivel de cuidado</th><td>${planta.nivelCuidado}</td></tr>
                    <tr><th>Luz</th><td>${planta.luz}</td></tr>
                    <tr><th>Riego</th><td>${planta.riego}</td></tr>
                    <tr><th>Mascotas</th><td>${planta.aptaMascotas ? "Apta para mascotas" : "No apta para mascotas"}</td></tr>
                    <tr><th>Fecha de ingreso</th><td>${planta.fechaIngreso || "-"}</td></tr>
                </table>
            </article>
        </section>

        <section class="bloque-cuidados">
            <h3>Notas de cuidado</h3>
            <p>${planta.notas || "Sin observaciones particulares."}</p>
        </section>
    `;
});