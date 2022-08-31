import React, {useContext} from "react";
import {NavLink} from 'react-router-dom';

import { AuthContext } from "../../context/auth-context";
import './NavLinks.css';

const NavLinks = props => {
    const auth = useContext(AuthContext);

    return <ul className="nav-links">
        {auth.isLoggedIn && <li>
            <NavLink to="/" exact>Home</NavLink>
        </li>}
        <li>
            <NavLink to="/all" exact>All Users</NavLink>
        </li>
        {auth.isLoggedIn && <li>
            <NavLink to={`/${auth.userId}/places`}>My Places</NavLink>
        </li>}
        {auth.isLoggedIn && <li>
            <NavLink to="/places/new">Add Place</NavLink>
        </li>}
        {!auth.isLoggedIn && <li>
            <NavLink to="/auth">Login/Sign Up</NavLink>
        </li>}
        {auth.isLoggedIn && (
            <li>
                <button onClick={auth.logout}>Log Out</button>
            </li>
        )}
    </ul>
}

export default NavLinks;