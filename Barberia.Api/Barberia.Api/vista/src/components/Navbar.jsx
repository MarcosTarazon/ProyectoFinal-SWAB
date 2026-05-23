import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            <Link to="/" style={{ marginRight: "10px" }}>Inicio</Link>
            <Link to="/servicios" style={{ marginRight: "10px" }}>Servicios</Link>
            <Link to="/clientes" style={{ marginRight: "10px" }}>Clientes</Link>
            <Link to="/barberos" style={{ marginRight: "10px" }}>Barberos</Link>
            <Link to="/citas" style={{ marginRight: "10px" }}>Citas</Link>
        </nav>
    );
}