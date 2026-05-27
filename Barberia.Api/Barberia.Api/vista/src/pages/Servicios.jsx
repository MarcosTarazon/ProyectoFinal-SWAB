import { useEffect, useState } from "react";
import { api } from "../services/api";
export default function Servicios() {
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [duracionMin, setDuracionMin] = useState("");
    async function cargarServicios() {
        setError("");
        setLoading(true);
        try {
            const data = await api.get("/api/Servicios");
            setServicios(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        cargarServicios();
    }, []);
    async function crearServicio(e) {
        e.preventDefault();
        setError("");
        if (!nombre.trim()) return setError("Nombre es obligatorio");
        const precioNum = Number(precio);
        const durNum = Number(duracionMin);
        if (Number.isNaN(precioNum) || precioNum <= 0) return setError("Precio inválido");
        if (Number.isNaN(durNum) || durNum <= 0) return setError("Duración inválida");
        try {
            await api.post("/api/Servicios", {
                nombre: nombre.trim(),
                precio: precioNum,
                duracionMin: durNum,
            });
            setNombre("");
            setPrecio("");
            setDuracionMin("");
            await cargarServicios();
        } catch (e2) {
            setError(e2.message);
        }
    }
    async function eliminarServicio(id) {
        const ok = confirm("¿Eliminar este servicio?");
        if (!ok) return;
        setError("");
        try {
            await api.del(`/api/Servicios/${id}`);
            setServicios((prev) => prev.filter((s) => s.id !== id));
        } catch (e) {
            setError(e.message);
        }
    }
    return (
        <div className="container">
            <h1>Servicios</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="card">
                <form onSubmit={crearServicio}>
                    <div className="field">
                        <label className="label">Nombre</label>
                        <input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </div>
                    <div className="field">
                        <label className="label">Precio</label>
                        <input className="input" value={precio} onChange={(e) => setPrecio(e.target.value)} />
                    </div>
                    <div className="field">
                        <label className="label">Duración (min)</label>
                        <input className="input" value={duracionMin} onChange={(e) => setDuracionMin(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btnPrimary">Agregar</button>
                </form>
            </div>
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <ul className="list">
                    {servicios.map((s) => (
                        <li key={s.id} className="listItem">
                            <span><b>{s.nombre}</b> — ${s.precio} — {s.duracionMin} min</span>
                            <button className="btn btnDanger" onClick={() => eliminarServicio(s.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}