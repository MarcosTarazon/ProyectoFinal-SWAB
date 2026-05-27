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
        (async () => { await cargar(); })();
    }, []);
    async function crear(e) {
        e.preventDefault();
        setError("");
        if (!nombre.trim()) return setError("Nombre es obligatorio");
        if (!telefono.trim()) return setError("Teléfono es obligatorio");
        if (!/^\d{10}$/.test(telefono.trim())) return setError("Teléfono inválido (10 dígitos).");
        if (!email.trim()) return setError("Email es obligatorio");
        if (!email.includes("@")) return setError("Email inválido.");
        try {
            await api.post("/api/Clientes", { nombre: nombre.trim(), telefono: telefono.trim(), email: email.trim() });
            setNombre(""); setTelefono(""); setEmail("");
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
        <div className="container">
            <h1>Clientes</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="card">
                <form onSubmit={crear}>
                    <div className="field">
                        <label className="label">Nombre</label>
                        <input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </div>
                    <div className="field">
                        <label className="label">Teléfono</label>
                        <input className="input" value={telefono} onChange={(e) => setTelefono(e.target.value)} inputMode="numeric" pattern="[0-9]{10}" maxLength={10} />
                    </div>
                    <div className="field">
                        <label className="label">Email</label>
                        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btnPrimary">Agregar</button>
                </form>
            </div>
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <ul className="list">
                    {clientes.map((c) => (
                        <li key={c.id} className="listItem">
                            <span><b>{c.nombre}</b> — {c.telefono} — {c.email}</span>
                            <button className="btn btnDanger" onClick={() => eliminar(c.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}