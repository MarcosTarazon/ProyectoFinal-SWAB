import { useEffect, useState } from "react";
import { api } from "../services/api";
export default function Ventas() {
    const [ventas, setVentas] = useState([]);
    const [citas, setCitas] = useState([]);
    const [citaId, setCitaId] = useState("");
    const [monto, setMonto] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    async function cargar() {
        setError("");
        setLoading(true);
        try {
            const [v, c] = await Promise.all([
                api.get("/api/Ventas"),
                api.get("/api/Citas"),
            ]);
            setVentas(v);
            setCitas(c);
            if (c.length && !citaId) setCitaId(String(c[0].id));
        } catch (e) {
            setError(e.message || "Error cargando ventas/citas");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        (async () => { await cargar(); })();
    }, []);
    async function crearVenta(e) {
        e.preventDefault();
        setError("");
        if (!citaId) return setError("Selecciona una cita");
        const montoNum = Number(monto);
        if (Number.isNaN(montoNum) || montoNum <= 0) return setError("Monto inválido");
        try {
            await api.post("/api/Ventas", {
                citaId: Number(citaId),
                monto: montoNum,
                fechaHora: new Date().toISOString(),
            });
            setMonto("");
            await cargar();
        } catch (e) {
            setError(e.message || "Error creando venta");
        }
    }
    return (
        <div className="container">
            <h1>Ventas</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <>
                    <div className="card">
                        <form onSubmit={crearVenta}>
                            <div className="field">
                                <label className="label">Cita</label>
                                <select value={citaId} onChange={(e) => setCitaId(e.target.value)}>
                                    {citas.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            #{c.id} | {c.cliente?.nombre ?? "Cliente"} | {c.servicio?.nombre ?? "Servicio"} | {c.estado}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label className="label">Monto</label>
                                <input className="input" value={monto} onChange={(e) => setMonto(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btnPrimary">Registrar venta</button>
                        </form>
                    </div>
                    <h2>Listado</h2>
                    <ul className="list">
                        {ventas.map((v) => (
                            <li key={v.id} className="listItem">
                                <span>
                                    <b>Venta #{v.id}</b> | ${v.monto} | {new Date(v.fechaHora).toLocaleString()}
                                    <br />
                                    Cita #{v.citaId} | {v.cita?.cliente?.nombre ?? "Cliente"} | {v.cita?.servicio?.nombre ?? "Servicio"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}