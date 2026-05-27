import { useEffect, useState } from "react";
import { api } from "../services/api";
export default function Barberos() {
    const [barberos, setBarberos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    async function cargar() {
        setError("");
        setLoading(true);
        try {
            const data = await api.get("/api/Barberos");
            setBarberos(data);
        } catch (e) {
            setError(e.message || "Error cargando barberos");
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
            await api.post("/api/Barberos", { nombre: nombre.trim(), telefono: telefono.trim(), email: email.trim() });
            setNombre(""); setTelefono(""); setEmail("");
            await cargar();
        } catch (e) {
            setError(e.message || "Error creando barbero");
        }
    }
    async function eliminar(id) {
        const ok = confirm("¿Eliminar este barbero?");
        if (!ok) return;
        setError("");
        try {
            await api.del(`/api/Barberos/${id}`);
            setBarberos((prev) => prev.filter((b) => b.id !== id));
        } catch (e) {
            setError(e.message || "Error eliminando barbero");
        }
    }
    return (
        <div className="container">
            <h1>Barberos</h1>
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
                    {barberos.map((b) => (
                        <li key={b.id} className="listItem">
                            <span><b>{b.nombre}</b> — {b.telefono} — {b.email}</span>
                            <button className="btn btnDanger" onClick={() => eliminar(b.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}