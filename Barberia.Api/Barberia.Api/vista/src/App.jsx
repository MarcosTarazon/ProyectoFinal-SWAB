import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import Home from "./pages/Home.jsx";
import Servicios from "./pages/Servicios.jsx";
import Clientes from "./pages/Clientes.jsx";
import Barberos from "./pages/Barberos.jsx";
import Citas from "./pages/Citas.jsx";

export default function App() {
    return (
        <>
            <Navbar />
            <div style={{ padding: "10px" }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/barberos" element={<Barberos />} />
                    <Route path="/citas" element={<Citas />} />
                </Routes>
            </div>
        </>
    );
}