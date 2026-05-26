import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");

    async function cargar() {
        setError("");
        setLoading(true);
        try {
            const data = await api.get("/api/Clientes");
            setClientes(data);
        } catch (e) {
            setError(e.message || "Error cargando clientes");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            await cargar();
        })();
    }, []);

    async function crear(e) {
        e.preventDefault();
        setError("");

        if (!nombre.trim()) return setError("Nombre es obligatorio");
        if (!telefono.trim()) return setError("Teléfono es obligatorio");
        if (!/^\d{10}$/.test(telefono.trim()))
            return setError("Teléfono inválido (10 dígitos).");
        if (!email.trim()) return setError("Email es obligatorio");
        if (!email.includes("@")) return setError("Email inválido.");

        try {
            await api.post("/api/Clientes", {
                nombre: nombre.trim(),
                telefono: telefono.trim(),
                email: email.trim(),
            });

            setNombre("");
            setTelefono("");
            setEmail("");
            await cargar();
        } catch (e) {
            setError(e.message || "Error creando cliente");
        }
    }

    async function eliminar(id) {
        const ok = confirm("¿Eliminar este cliente?");
        if (!ok) return;

        setError("");
        try {
            await api.del(`/api/Clientes/${id}`);
            setClientes((prev) => prev.filter((c) => c.id !== id));
        } catch (e) {
            setError(e.message || "Error eliminando cliente");
        }
    }

    return (
        <div>
            <h1>Clientes</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={crear} style={{ marginBottom: 16 }}>
                <div>
                    <label>Nombre</label><br />
                    <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>

                <div>
                    <label>Teléfono</label><br />
                    <input
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        maxLength={10}
                    />
                </div>

                <div>
                    <label>Email</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <button type="submit" style={{ marginTop: 10 }}>
                    Agregar
                </button>
            </form>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <ul>
                    {clientes.map((c) => (
                        <li key={c.id} style={{ marginBottom: 8 }}>
                            <b>{c.nombre}</b> — {c.telefono} — {c.email}{" "}
                            <button onClick={() => eliminar(c.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}