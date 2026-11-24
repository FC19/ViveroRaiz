const STORAGE_CONSULTAS = "vivero_raiz_consultas";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-contacto");
    const msg = document.getElementById("mensaje-contacto");
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const plantaConsultada = params.get("planta");
    if (plantaConsultada) {
        const selectMotivo = document.getElementById("motivo");
        const textareaMensaje = document.getElementById("mensaje");
        if (selectMotivo) selectMotivo.value = "consulta";
        if (textareaMensaje) {
            textareaMensaje.value = `Hola Vivero Raíz, quería consultar disponibilidad y cuidados de la planta ${plantaConsultada}.`;
        }
    }

    form.addEventListener("submit", e => {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value.trim();
        const inputEmail = document.getElementById("email");
        const email = inputEmail ? inputEmail.value.trim() : "";
        const selectMotivo = document.getElementById("motivo");
        const motivo = selectMotivo ? selectMotivo.value : "consulta";
        const mensaje = document.getElementById("mensaje").value.trim();

        if (nombre.length < 3) {
            msg.textContent = "Ingresá tu nombre completo (mínimo 3 caracteres).";
            msg.className = "mensaje mensaje-error";
            return;
        }

        if (mensaje.length < 10) {
            msg.textContent = "Contanos un poco más en el mensaje (mínimo 10 caracteres).";
            msg.className = "mensaje mensaje-error";
            return;
        }

        const historial = JSON.parse(localStorage.getItem(STORAGE_CONSULTAS) || "[]");
        historial.push({
            fecha: new Date().toISOString(),
            nombre,
            email,
            motivo,
            mensaje
        });
        localStorage.setItem(STORAGE_CONSULTAS, JSON.stringify(historial));

        msg.textContent = `¡Gracias ${nombre}! Recibimos tu consulta y te responderemos a la brevedad.`;
        msg.className = "mensaje mensaje-exito";
        form.reset();
    });
});