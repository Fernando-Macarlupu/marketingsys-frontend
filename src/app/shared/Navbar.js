import React, { useEffect, Component, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { Trans } from "react-i18next";
import {
  PUBLIC_CLIENT_APPLICATION,
  MSAL_CONFIG,
} from "../login-pages/msalConfig";
import { PublicClientApplication } from "@azure/msal-browser";

const Navbar = () => {
  const history = useHistory();
  const [usuarioLogueado, setUsuarioLogueado] = useState({});
  const [interactionInProgress, setInteractionInProgress] = useState(false);

  const toggleOffcanvas = () => {
    document.querySelector(".sidebar-offcanvas").classList.toggle("active");
  };

  const handleSettings = (event) => {
    history.push({
      pathname: "/perfilUsuario",
    });
    return;
  }

  const cerrarSesion = async (event) => {
    event.preventDefault();
    localStorage.removeItem("marketingSYSusuario");
    localStorage.setItem("marketingSYSusuario_logueado", JSON.stringify(false));

    let cuentaWindows = localStorage.getItem("cuentaWindows");
    console.log(cuentaWindows);
    if (cuentaWindows != null) {
      const CLIENT_APPLICATION = new PublicClientApplication(MSAL_CONFIG);
      console.log("entro a estooooo");
      localStorage.removeItem("cuentaWindows"); //o remove
      localStorage.removeItem("msal.account.keys");
      localStorage.removeItem("msal.token.keys.0954303b-dff1-4dd5-bd18-1bcb0623c6c4");
      await CLIENT_APPLICATION.initialize();
      if (!interactionInProgress) {
        setInteractionInProgress(true);
        await CLIENT_APPLICATION.logoutRedirect({
          account: JSON.parse(cuentaWindows),
          postLogoutRedirectUri:
            "http://localhost:3000/marketingsys/iniciarSesion",
        });
        setInteractionInProgress(false);
      }
    }
    history.push({
      pathname: "/iniciarSesion",
    });
    return;
  };

  useEffect(() => {
    let usuario = localStorage.getItem("marketingSYSusuario");
    if (usuario == null) {
      history.push({
        pathname: "/iniciarSesion",
      });
      return;
    }
    setUsuarioLogueado(JSON.parse(usuario));
  }, []);

  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo" to="/">
          MarketingSYS
        </Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-stretch">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          onClick={() => document.body.classList.toggle("sidebar-icon-only")}
        >
          <span className="mdi mdi-menu"></span>
        </button>
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item">
            <Link className="nav-link" to="/perfilUsuario">
              <i className="mdi mdi-settings"></i>
            </Link>
          </li>
          <li className="nav-item nav-profile nav-language">
            <Dropdown alignRight>
              <Dropdown.Toggle className="nav-link count-indicator">
                <div className="nav-profile-text">
                  <p className="mb-1 text-black">
                    <Trans>{usuarioLogueado["nombreCompleto"]}</Trans>
                  </p>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="preview-list navbar-dropdown">
                <div className="p-2">
                  <h5 className="dropdown-header text-uppercase pl-2 text-dark">
                    <Trans>Opciones de usuario</Trans>
                  </h5>
                  <Dropdown.Item
                    className="dropdown-item d-flex align-items-center justify-content-between"
                    onClick={handleSettings}
                  >
                    <span>
                      <Trans>Perfil de usuario</Trans>
                    </span>
                    <span className="p-0">
                      <i className="mdi mdi-settings ml-1"></i>
                    </span>
                  </Dropdown.Item>
                  <div role="separator" className="dropdown-divider"></div>
                  <h5 className="dropdown-header text-uppercase  pl-2 text-dark mt-2">
                    <Trans>Acciones</Trans>
                  </h5>
                  <Dropdown.Item
                    className="dropdown-item d-flex align-items-center justify-content-between"
                    onClick={cerrarSesion}
                  >
                    <span>
                      <Trans>Cerrar sesión</Trans>
                    </span>
                    <i className="mdi mdi-logout ml-1"></i>
                  </Dropdown.Item>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          onClick={toggleOffcanvas}
        >
          <span className="mdi mdi-menu"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
