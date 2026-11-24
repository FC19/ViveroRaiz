document.addEventListener("DOMContentLoaded", () => {
    const formFiltros = document.getElementById("form-filtros");
    const grilla = document.getElementById("grilla-catalogo");
    const contador = document.getElementById("contador-plantas");
    const inputBusqueda = document.getElementById("busqueda");
    const selectCategoria = document.getElementById("categoria");
    const selectLuz = document.getElementById("luz");
    const checkMascotas = document.getElementById("mascotas");

    if (!grilla) return;

    const params = new URLSearchParams(window.location.search);
    const categoriaURL = params.get("categoria");
    if (categoriaURL && [...selectCategoria.options].some(opt => opt.value === categoriaURL)) {
        selectCategoria.value = categoriaURL;
    }

    function renderizar() {
        const filtros = {
            texto: inputBusqueda ? inputBusqueda.value : "",
            categoria: selectCategoria.value,
            luz: selectLuz.value,
            soloMascotas: checkMascotas.checked
        };

        const plantas = RepositorioPlantas.obtenerTodas().filter(p => p.cumpleFiltros(filtros));
        contador.textContent = plantas.length;

        if (plantas.length === 0) {
            grilla.innerHTML = "<p>No encontramos plantas que coincidan con tu búsqueda.</p>";
            return;
        }

        grilla.innerHTML = plantas.map(planta => {
            const estado = planta.estadoStock;
            return `
                <article>
                    <img src="${planta.foto}" alt="Foto de ${planta.nombre}">
                    <span class="badge-stock ${estado.clase}">${estado.texto}</span>
                    <h4>${planta.nombre}</h4>
                    <p><em>${planta.nombreCientifico}</em></p>
                    <p>Categoría: ${planta.categoria} | Cuidado: ${planta.nivelCuidado}</p>
                    <p>Luz: ${planta.luz} | Riego: ${planta.riego}</p>
                    <p><strong>${planta.precioFormateado}</strong></p>
                    <p><a href="planta.html?id=${planta.id}" class="boton">Ver detalle</a></p>
                </article>
            `;
        }).join("");
    }

    if (formFiltros) {
        formFiltros.addEventListener("submit", e => e.preventDefault());
    }
    if (inputBusqueda) {
        inputBusqueda.addEventListener("input", renderizar);
    }
    selectCategoria.addEventListener("change", renderizar);
    selectLuz.addEventListener("change", renderizar);
    checkMascotas.addEventListener("change", renderizar);

    renderizar();
});