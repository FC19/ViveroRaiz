document.addEventListener("DOMContentLoaded", () => {
    const sesion = Auth.verificarIntranet();
    if (!sesion) return;

    const saludo = document.getElementById("saludo-usuario");
    const contenedorResumen = document.getElementById("resumen-intranet");
    const tbody = document.getElementById("tbody-plantas");

    if (saludo) {
        saludo.innerHTML = `Hola, <strong>${sesion.nombre}</strong> (${sesion.rol})`;
    }

    function renderizarResumen() {
        if (!contenedorResumen) return;
        const resumen = RepositorioPlantas.obtenerResumen();
        contenedorResumen.innerHTML = `
            <div class="tarjeta-metrica">
                <span>Especies cargadas</span>
                <strong>${resumen.totalEspecies}</strong>
            </div>
            <div class="tarjeta-metrica">
                <span>Unidades en invernadero</span>
                <strong>${resumen.unidadesTotales}</strong>
            </div>
            <div class="tarjeta-metrica">
                <span>Con bajo stock</span>
                <strong>${resumen.stockBajo}</strong>
            </div>
        `;
    }

    function renderizarTabla() {
        const plantas = RepositorioPlantas.obtenerTodas();

        if (plantas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No hay plantas cargadas en el inventario.</td></tr>';
            return;
        }

        tbody.innerHTML = plantas.map(planta => {
            const estado = planta.estadoStock;
            return `
                <tr>
                    <td>${planta.id}</td>
                    <td><img src="${planta.foto}" alt="${planta.nombre}" class="thumb-tabla"></td>
                    <td>${planta.nombre}</td>
                    <td>${planta.categoria}</td>
                    <td>${planta.precioFormateado}</td>
                    <td>
                        ${planta.stock}
                        <span class="badge-stock ${estado.clase}">${estado.texto}</span>
                    </td>
                    <td>
                        <a href="planta-form.html?id=${planta.id}" class="boton-accion editar">Editar</a>
                        <button type="button" class="boton-accion eliminar" data-id="${planta.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    function actualizarVista() {
        renderizarResumen();
        renderizarTabla();
    }

    tbody.addEventListener("click", e => {
        const btnEliminar = e.target.closest(".eliminar");
        if (!btnEliminar) return;

        const id = btnEliminar.dataset.id;
        const planta = RepositorioPlantas.obtenerPorId(id);
        const nombrePlanta = planta ? planta.nombre : "esta planta";

        if (confirm(`¿Seguro que querés eliminar "${nombrePlanta}" del inventario?`)) {
            RepositorioPlantas.eliminar(id);
            actualizarVista();
        }
    });

    actualizarVista();
});