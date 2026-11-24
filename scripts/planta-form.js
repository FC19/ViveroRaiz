document.addEventListener("DOMContentLoaded", () => {
    if (!Auth.verificarIntranet()) return;

    const form = document.getElementById("form-planta");
    const msg = document.getElementById("mensaje-form");
    const titulo = document.querySelector("main h2");
    if (!form) return;

    const inputFecha = document.getElementById("fechaingreso") || document.getElementById("fechaIngreso");
    const checkMascotas = form.querySelector('input[name="aptaMascotas"]') || document.getElementById("aptaMascotas");

    const params = new URLSearchParams(window.location.search);
    const idEdicion = params.get("id");

    if (idEdicion) {
        const planta = RepositorioPlantas.obtenerPorId(idEdicion);
        if (!planta) {
            mostrarMensaje(msg, "La planta que intentás editar no existe.", true);
            form.classList.add("oculto");
            return;
        }

        if (titulo) {
            titulo.textContent = `Editar Planta #${planta.id}`;
        }
        document.title = `Vivero Raíz - Editar ${planta.nombre}`;

        document.getElementById("nombre").value = planta.nombre;
        document.getElementById("nombreCientifico").value = planta.nombreCientifico;
        document.getElementById("categoria").value = planta.categoria;
        document.getElementById("foto").value = planta.foto;
        document.getElementById("riego").value = planta.riego;
        document.getElementById("precio").value = planta.precio;
        document.getElementById("stock").value = planta.stock;
        if (inputFecha) inputFecha.value = planta.fechaIngreso;
        document.getElementById("notas").value = planta.notas;

        const radioLuz = form.querySelector(`input[name="luz"][value="${planta.luz}"]`);
        if (radioLuz) radioLuz.checked = true;

        if (checkMascotas) checkMascotas.checked = planta.aptaMascotas;

        form.querySelectorAll('input[name="etiquetas"]').forEach(chk => {
            chk.checked = planta.etiquetas.includes(chk.value);
        });
    }

    form.addEventListener("submit", e => {
        e.preventDefault();

        const radioLuz = form.querySelector('input[name="luz"]:checked');
        if (!radioLuz) {
            mostrarMensaje(msg, "Seleccioná el nivel de luz que necesita la planta.", true);
            return;
        }

        const etiquetasSeleccionadas = [...form.querySelectorAll('input[name="etiquetas"]:checked')]
            .map(chk => chk.value);

        const datos = {
            nombre: document.getElementById("nombre").value,
            nombreCientifico: document.getElementById("nombreCientifico").value,
            categoria: document.getElementById("categoria").value,
            foto: document.getElementById("foto").value,
            luz: radioLuz.value,
            riego: document.getElementById("riego").value,
            aptaMascotas: checkMascotas ? checkMascotas.checked : false,
            etiquetas: etiquetasSeleccionadas,
            precio: document.getElementById("precio").value,
            stock: document.getElementById("stock").value,
            fechaIngreso: inputFecha ? inputFecha.value : "",
            notas: document.getElementById("notas").value
        };

        try {
            if (idEdicion) {
                RepositorioPlantas.actualizar(idEdicion, datos);
                mostrarMensaje(msg, "Planta actualizada correctamente. Volviendo al listado...");
            } else {
                RepositorioPlantas.crear(datos);
                mostrarMensaje(msg, "Planta cargada correctamente. Volviendo al listado...");
                form.reset();
            }

            setTimeout(() => {
                window.location.href = "listado.html";
            }, 1000);
        } catch (error) {
            mostrarMensaje(msg, error.message, true);
        }
    });
});