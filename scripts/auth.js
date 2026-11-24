const STORAGE_USUARIOS = "vivero_raiz_usuarios";
const STORAGE_SESION = "vivero_raiz_sesion";

const Auth = {
    obtenerUsuarios() {
        const guardados = localStorage.getItem(STORAGE_USUARIOS);
        if (!guardados) {
            const adminDefault = [{
                nombre: "Admin",
                apellido: "Vivero",
                email: "admin@viveroraiz.com",
                password: "admin1234",
                rol: "administrador"
            }];
            localStorage.setItem(STORAGE_USUARIOS, JSON.stringify(adminDefault));
            return adminDefault;
        }
        try {
            return JSON.parse(guardados);
        } catch {
            return [];
        }
    },

    registrar(nuevoUsuario) {
        const usuarios = this.obtenerUsuarios();
        const emailNormalizado = nuevoUsuario.email.toLowerCase();
        const existe = usuarios.some(u => u.email.toLowerCase() === emailNormalizado);

        if (existe) {
            return { ok: false, mensaje: "Ya existe una cuenta registrada con ese correo." };
        }

        usuarios.push({ ...nuevoUsuario, email: emailNormalizado });
        localStorage.setItem(STORAGE_USUARIOS, JSON.stringify(usuarios));
        return { ok: true, mensaje: "Cuenta creada con éxito. Redirigiendo al ingreso..." };
    },

    iniciarSesion(email, password, recordar) {
        const emailNormalizado = email.toLowerCase();
        const usuario = this.obtenerUsuarios().find(
            u => u.email.toLowerCase() === emailNormalizado && u.password === password
        );

        if (!usuario) return null;

        const sesion = {
            nombre: usuario.nombre,
            apellido: usuario.apellido || "",
            email: usuario.email,
            rol: usuario.rol
        };

        sessionStorage.removeItem(STORAGE_SESION);
        localStorage.removeItem(STORAGE_SESION);

        const storage = recordar ? localStorage : sessionStorage;
        storage.setItem(STORAGE_SESION, JSON.stringify(sesion));
        return sesion;
    },

    obtenerSesion() {
        const raw = sessionStorage.getItem(STORAGE_SESION) || localStorage.getItem(STORAGE_SESION);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    },

    verificarIntranet() {
        const sesion = this.obtenerSesion();
        if (!sesion) {
            window.location.href = "login.html";
            return null;
        }
        return sesion;
    },

    cerrarSesion() {
        sessionStorage.removeItem(STORAGE_SESION);
        localStorage.removeItem(STORAGE_SESION);
        window.location.href = "login.html";
    }
};

function mostrarMensaje(elemento, texto, esError = false) {
    if (!elemento) return;
    elemento.textContent = texto;
    elemento.className = `mensaje ${esError ? "mensaje-error" : "mensaje-exito"}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login");
    if (formLogin) {
        if (Auth.obtenerSesion()) {
            window.location.href = "listado.html";
            return;
        }

        const msg = document.getElementById("mensaje-login");
        formLogin.addEventListener("submit", e => {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const checkRecordar = document.getElementById("recordar");
            const recordar = checkRecordar ? checkRecordar.checked : false;

            const sesion = Auth.iniciarSesion(email, password, recordar);
            if (!sesion) {
                mostrarMensaje(msg, "Correo o contraseña incorrectos.", true);
                return;
            }
            window.location.href = "listado.html";
        });
    }

    const formRegistro = document.getElementById("form-registro");
    if (formRegistro) {
        const msg = document.getElementById("mensaje-registro");
        formRegistro.addEventListener("submit", e => {
            e.preventDefault();
            const nombre = document.getElementById("nombre").value.trim();
            const apellido = document.getElementById("apellido").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm_password").value;

            if (nombre.length < 2 || apellido.length < 2) {
                mostrarMensaje(msg, "Ingresá un nombre y apellido válidos.", true);
                return;
            }

            if (password.length < 8) {
                mostrarMensaje(msg, "La contraseña debe tener al menos 8 caracteres.", true);
                return;
            }

            if (password !== confirmPassword) {
                mostrarMensaje(msg, "Las contraseñas no coinciden.", true);
                return;
            }

            const inputFecha = document.getElementById("fecha_nacimiento");
            const inputTelefono = document.getElementById("telefono");
            const selectRol = document.getElementById("rol");

            const resultado = Auth.registrar({
                nombre,
                apellido,
                fechaNacimiento: inputFecha ? inputFecha.value : "",
                telefono: inputTelefono ? inputTelefono.value.trim() : "",
                email,
                password,
                rol: selectRol ? selectRol.value : "vendedor"
            });

            mostrarMensaje(msg, resultado.mensaje, !resultado.ok);
            if (resultado.ok) {
                formRegistro.reset();
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1200);
            }
        });
    }

    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", e => {
            e.preventDefault();
            Auth.cerrarSesion();
        });
    }
});