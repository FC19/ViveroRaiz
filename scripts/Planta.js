class Planta {
    #precio = 0;
    #stock = 0;
    #etiquetas = [];

    constructor({
        id,
        nombre = "",
        nombreCientifico = "",
        categoria = "interior",
        foto = "",
        luz = "media sombra",
        riego = "medio",
        aptaMascotas = false,
        etiquetas = [],
        precio = 0,
        stock = 0,
        fechaIngreso = "",
        notas = ""
    }) {
        this.id = Number(id);
        this.nombre = nombre.trim();
        this.nombreCientifico = nombreCientifico.trim();
        this.categoria = categoria;
        this.foto = foto.trim();
        this.luz = luz;
        this.riego = riego;
        this.aptaMascotas = Boolean(aptaMascotas);
        this.fechaIngreso = fechaIngreso;
        this.notas = notas.trim();

        if (!this.nombre) {
            throw new Error("El nombre de la planta es obligatorio.");
        }

        this.precio = precio;
        this.stock = stock;
        this.#etiquetas = Array.isArray(etiquetas) ? [...etiquetas] : [];
    }

    get precio() {
        return this.#precio;
    }

    set precio(valor) {
        const numero = Number(valor);
        if (Number.isNaN(numero) || numero < 0) {
            throw new Error("El precio debe ser un número mayor o igual a 0.");
        }
        this.#precio = numero;
    }

    get stock() {
        return this.#stock;
    }

    set stock(valor) {
        const numero = Number(valor);
        if (!Number.isInteger(numero) || numero < 0) {
            throw new Error("El stock debe ser un número entero mayor o igual a 0.");
        }
        this.#stock = numero;
    }

    get etiquetas() {
        return [...this.#etiquetas];
    }

    get disponible() {
        return this.#stock > 0;
    }

    get precioFormateado() {
        return "$" + this.#precio.toLocaleString("es-AR");
    }

    get nivelCuidado() {
        if (this.riego === "alto") return "Dedicado";
        if (this.riego === "bajo" && (this.luz !== "sol pleno" || this.categoria === "suculenta")) {
            return "Principiante";
        }
        if (this.riego === "medio" && this.luz === "sol pleno") return "Dedicado";
        return "Intermedio";
    }

    get estadoStock() {
        if (this.#stock === 0) {
            return { texto: "Sin stock", clase: "badge-agotado" };
        }
        if (this.#stock <= 5) {
            return { texto: "Últimas unidades", clase: "badge-bajo" };
        }
        return { texto: "Disponible", clase: "badge-ok" };
    }

    cumpleFiltros({ texto = "", categoria = "todas", luz = "todas", soloMascotas = false } = {}) {
        const termino = texto.trim().toLowerCase();
        if (termino) {
            const coincideNombre = this.nombre.toLowerCase().includes(termino);
            const coincideCientifico = this.nombreCientifico.toLowerCase().includes(termino);
            if (!coincideNombre && !coincideCientifico) return false;
        }
        if (categoria !== "todas" && this.categoria !== categoria) return false;
        if (luz !== "todas" && this.luz !== luz) return false;
        if (soloMascotas && !this.aptaMascotas) return false;
        return true;
    }

    toLiteral() {
        return {
            id: this.id,
            nombre: this.nombre,
            nombreCientifico: this.nombreCientifico,
            categoria: this.categoria,
            foto: this.foto,
            luz: this.luz,
            riego: this.riego,
            aptaMascotas: this.aptaMascotas,
            etiquetas: this.etiquetas,
            precio: this.#precio,
            stock: this.#stock,
            fechaIngreso: this.fechaIngreso,
            notas: this.notas
        };
    }

    static fromLiteral(dato) {
        return new Planta(dato);
    }
}