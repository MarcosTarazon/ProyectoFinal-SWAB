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

      setClientes(cli);
      setBarberos(bar);
      setServicios(ser);
      setCitas(cit);

      // defaults si hay datos
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

      // recarga citas
      const cit = await api.get("/api/Citas");
      setCitas(cit);
    } catch (e2) {
      setError(e2.message || "Error creando cita");
    }
  }

  return (
    <div>
      <h1>Citas</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <form onSubmit={crearCita} style={{ marginBottom: 16 }}>
            <div>
              <label>Cliente</label><br />
              <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Barbero</label><br />
              <select value={barberoId} onChange={(e) => setBarberoId(e.target.value)}>
                {barberos.map((b) => (
                  <option key={b.id} value={b.id}>{b.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Servicio</label><br />
              <select value={servicioId} onChange={(e) => setServicioId(e.target.value)}>
                {servicios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} (${s.precio})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Fecha y hora</label><br />
              <input
                type="datetime-local"
                value={fechaHora}
                onChange={(e) => setFechaHora(e.target.value)}
              />
            </div>

            <button type="submit" style={{ marginTop: 10 }}>Crear cita</button>
          </form>

          <h2>Listado</h2>
          <ul>
            {citas.map((c) => (
              <li key={c.id} style={{ marginBottom: 10 }}>
                <b>{c.cliente?.nombre ?? "Cliente"}</b> — {c.barbero?.nombre ?? "Barbero"} — {c.servicio?.nombre ?? "Servicio"}
                <br />
                {new Date(c.fechaHora).toLocaleString()} — <i>{c.estado}</i>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
