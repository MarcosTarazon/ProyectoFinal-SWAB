import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/servicios">Servicios</Link></li>
        <li><Link to="/clientes">Clientes</Link></li>
        <li><Link to="/barberos">Barberos</Link></li>
        <li><Link to="/citas">Citas</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
