import { Link } from "react-router-dom";
export default function Navbar() {
    return (
        <nav className="nav">
            <span className="nav-brand">✂ Barbería</span>
            <Link to="/" className="navLink">Inicio</Link>
            <Link to="/servicios" className="navLink">Servicios</Link>
            <Link to="/clientes" className="navLink">Clientes</Link>
            <Link to="/barberos" className="navLink">Barberos</Link>
            <Link to="/citas" className="navLink">Citas</Link>
            <Link to="/ventas" className="navLink">Ventas</Link>
        </nav>
    );
}