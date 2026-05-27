import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Citas() {
    const [clientes, setClientes] = useState([]);
    const [barberos, setBarberos] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [citas, setCitas] = useState([]);
    const [clienteId, setClienteId] = useState("");
    const [barberoId, setBarberoId] = useState("");
    const [servicioId, setServicioId] = useState("");
    const [fechaHora, setFechaHora] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    async function cargarTodo() {
        setError("");
        setLoading(true);
        try {
            const [cli, bar, ser, cit] = await Promise.all([
                api.get("/api/Clientes"),
                api.get("/api/Barberos"),
                api.get("/api/Servicios"),
                api.get("/api/Citas"),
            ]);
            setClientes(cli); setBarberos(bar); setServicios(ser); setCitas(cit);
            if (cli.length && !clienteId) setClienteId(String(cli[0].id));
            if (bar.length && !barberoId) setBarberoId(String(bar[0].id));
            if (ser.length && !servicioId) setServicioId(String(ser[0].id));
        } catch (e) {
            setError(e.message || "Error cargando datos");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargarTodo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function crearCita(e) {
        e.preventDefault();
        setError("");
        if (!clienteId || !barberoId || !servicioId) return setError("Selecciona cliente, barbero y servicio");
        if (!fechaHora) return setError("Selecciona fecha y hora");
        const iso = new Date(fechaHora).toISOString();
        try {
            await api.post("/api/Citas", {
                clienteId: Number(clienteId),
                barberoId: Number(barberoId),
                servicioId: Number(servicioId),
                fechaHora: iso,
                estado: "Pendiente",
            });
            setFechaHora("");
            const cit = await api.get("/api/Citas");
            setCitas(cit);
        } catch (e2) {
            setError(e2.message || "Error creando cita");
        }
    }

    return (
        <div className="container">
            <h1>Citas</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <>
                    <div className="card">
                        <form onSubmit={crearCita}>
                            <div className="field">
                                <label className="label">Cliente</label>
                                <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                                    {clientes.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label className="label">Barbero</label>
                                <select value={barberoId} onChange={(e) => setBarberoId(e.target.value)}>
                                    {barberos.map((b) => (
                                        <option key={b.id} value={b.id}>{b.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label className="label">Servicio</label>
                                <select value={servicioId} onChange={(e) => setServicioId(e.target.value)}>
                                    {servicios.map((s) => (
                                        <option key={s.id} value={s.id}>{s.nombre} (${s.precio})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label className="label">Fecha y hora</label>
                                <input className="input" type="datetime-local" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btnPrimary">Crear cita</button>
                        </form>
                    </div>
                    <h2>Listado</h2>
                    <ul className="list">
                        {citas.map((c) => (
                            <li key={c.id} className="listItem">
                                <span>
                                    <b>{c.cliente?.nombre ?? "Cliente"}</b> — {c.barbero?.nombre ?? "Barbero"} — {c.servicio?.nombre ?? "Servicio"}
                                    <br />
                                    {new Date(c.fechaHora).toLocaleString()} — <i>{c.estado}</i>
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}