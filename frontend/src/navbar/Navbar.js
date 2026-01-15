import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem, NavbarToggler, Collapse } from "reactstrap";
import "./Navbar.css";
import { useSelector } from "react-redux";

function NavBar({ logOut }) {
  const currentUser = useSelector((store) => store.currentUser);
  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <div className="NavBar">
      <Navbar className="navbar" expand="md" dark>
        <NavLink className="Navbar-brand" to="/" end>
          <span className="Navbar-logo">
            <img
              width="25px"
              alt="stock-market-icon"
              src="stock-market-icon.png"
            />
          </span>
          Market Update
        </NavLink>
        <NavbarToggler
          onClick={toggleNavbar}
          className="mr-2 Navbar-toggler-btn"
        />
        <Collapse isOpen={!collapsed} navbar>
          <Nav className="ml-auto" navbar>
            {Object.keys(currentUser).length ? (
              <>
                <NavItem>
                  <NavLink className="navlinks" to="/" exact="true">
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="navlinks" to="/news">
                    News
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="navlinks" to="/search">
                    Search
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="navlinks" to="/watchlist">
                    Watchlist
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="navlinks" to="/profile">
                    Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="navlinks-logout" to="/" onClick={logOut}>
                    Log Out
                  </NavLink>
                </NavItem>
              </>
            ) : (
                <>
                <NavItem>
                  <NavLink className="navlinks" to="/" exact="true">
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="navlinks" to="/search">
                    Search
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="navlinks" to="/news">
                    News
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="navlinks" to="/login">
                    Login
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="navlinks" to="/signup">
                    Sign Up
                  </NavLink>
                </NavItem>
              </>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavBar;
