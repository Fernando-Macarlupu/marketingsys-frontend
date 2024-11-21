import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import api from "../api";
import axios from 'axios';
import { LOGIN_REQUEST, PUBLIC_CLIENT_APPLICATION, TOKEN_REQUEST } from './msalConfig';

const Login = () => {
  const history = useHistory();
  const location = useLocation();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [usuario, setUsuario] = useState({});
  const [mostrarCargaDatos, setMostrarCargaDatos] = useState(false);
  const [mostrarDatos, setMostrarDatos] = useState(true);
  const [mostrarMensajeExito, setMostrarMensajeExito] = useState(false);

  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);
  const [correoLogin, setCorreoLogin] = useState([]);

  let fechaHoy = new Date();
    let fechaExpiracion = new Date(fechaHoy);
    fechaExpiracion.setDate(fechaHoy.getDate() + 180);

  const [token, setToken] = useState(null);
  const [interactionInProgress, setInteractionInProgress] = useState(false);

  const handleSignIn = async () => {
    const loginResponse = await PUBLIC_CLIENT_APPLICATION.loginPopup(LOGIN_REQUEST);
    if (loginResponse.account) {
      PUBLIC_CLIENT_APPLICATION.setActiveAccount(loginResponse.account);
    }
    const tokenResponse = await PUBLIC_CLIENT_APPLICATION.acquireTokenSilent(TOKEN_REQUEST);
    setToken(tokenResponse.accessToken);
  }

  const handleSignOut = async () => {
    if (!interactionInProgress) {
      setInteractionInProgress(true);
      PUBLIC_CLIENT_APPLICATION.logout();
      setToken(null);
      setInteractionInProgress(false);
    }
  }

  const handleRefreshToken = async () => {
    const tokenResponse = await PUBLIC_CLIENT_APPLICATION.acquireTokenSilent(TOKEN_REQUEST);
    setToken(tokenResponse.accessToken);
  }

  const handleLoginGoogle = (data) => {
    const datos = {
      correo: data.email,
      nombreCompleto: data.name,
      servicio: "0",
      cuentaUsuario: {
        id: 0,
        nombre: data.name,
        expiracionCuenta: fechaExpiracion.getDate() + "-" + parseInt(fechaExpiracion.getMonth() + 1) + "-" + fechaExpiracion.getFullYear(),
        diasExpiracioncuenta: 180,
      }
    };
    // send the username and password to the server
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .post("loginCorreo", datos)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCargaDatos(false);
        setMostrarDatos(true);
        if (data["mensaje"] == "Usuario no encontrado") alert(data["mensaje"]);
        else {
          setUsuario(data["datos"]);
          localStorage.setItem(
            "marketingSYSusuario",
            JSON.stringify(data["datos"])
          );
          localStorage.setItem(
            "marketingSYSusuario_logueado",
            JSON.stringify(true)
          );
          console.log("llego hasta poner el dashboard");
          history.push({
            pathname: "/dashboard",
          });
        }
      })
      .catch((err) => alert(err));
  };

  const obtenerPerfil = (user) => {
    axios
    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
        headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json'
        }
    })
    .then((res) => {
        setProfile(res.data);
        console.log(res.data);
        handleLoginGoogle(res.data);
    })
    .catch((err) => console.log(err));
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      //console.log(codeResponse);
      obtenerPerfil(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (location.state == null) console.log("La cuenta guardada es null");
    else {
      if (location.state.registroDeCuenta == true) {
        setMostrarMensajeExito(true);
        setTimeout(() => {
          setMostrarMensajeExito(false);
        }, 5000);
      }
    }
  }, []);

  const handleChangeNombreUsuario = (event) => {
    //console.log(event.target.value);
    setNombreUsuario(event.target.value);
  };

  const handleChangeContrasena = (event) => {
    //console.log(event.target.value);
    setContrasena(event.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (nombreUsuario == "") return alert("Ingrese un nombre de usuario");
    if (contrasena == "") return alert("Ingrese una contraseña");

    const usuarioBusqueda = {
      nombreUsuario: nombreUsuario,
      contrasena: contrasena,
    };
    // send the username and password to the server
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .post("login", usuarioBusqueda)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCargaDatos(false);
        setMostrarDatos(true);
        if (data["mensaje"] == "Usuario no encontrado") alert(data["mensaje"]);
        else {
          setUsuario(data["datos"]);
          localStorage.setItem(
            "marketingSYSusuario",
            JSON.stringify(data["datos"])
          );
          localStorage.setItem(
            "marketingSYSusuario_logueado",
            JSON.stringify(true)
          );
          console.log("llego hasta poner el dashboard");
          history.push({
            pathname: "/dashboard",
          });
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      {mostrarCargaDatos && (
        <div className="row h-100">
          <div className="col-sm-12 my-auto">
            <div className="circle-loader"></div>
          </div>
        </div>
      )}
      {mostrarDatos && (
        <div className="d-flex auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-6 px-0">
              <div className="text-center py-5 px-4 px-sm-5">
                <div className="col-lg-8 mx-auto">
                  <img
                    src={require("../../assets/images/imagenLogin.png")}
                    alt="logo"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6 px-0">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="col-lg-8 mx-auto">
                  <div className="page-header">
                    <h2 className="page-title"> Iniciar Sesión </h2>
                  </div>
                  <Alert
                    show={mostrarMensajeExito}
                    variant="success"
                    className="small text-center"
                  >
                    {" "}
                    <i className="px-2 mdi mdi-check-circle"></i>
                    Cuenta de usuario creada correctamente
                  </Alert>
                  <Form className="pt-3">
                    <Form.Group>
                      <label className="col-form-label">
                        Nombre de usuario
                      </label>
                      <div>
                        <Form.Control
                          type="text"
                          size="lg"
                          className="h-auto"
                          onChange={handleChangeNombreUsuario}
                        />
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <label className="col-form-label">Contraseña</label>
                      <div>
                        <Form.Control
                          type="password"
                          size="lg"
                          className="h-auto"
                          onChange={handleChangeContrasena}
                        />
                      </div>
                    </Form.Group>
                    <div className="my-2 d-flex justify-content-between align-items-center">
                      <div></div>
                      <a
                        href="!#"
                        onClick={(event) => event.preventDefault()}
                        className="auth-link text-primary"
                      >
                        ¿Olvidó la contraseña?
                      </a>
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                        onClick={handleLogin}
                      >
                        Iniciar sesión
                      </button>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <button
                          type="button"
                          className="btn btn-block btn-outline-primary btn-lg font-weight-medium auth-form-btn"
                          onClick={() => login()}
                        >
                          <i className="mdi mdi-google mr-2"></i>Iniciar con
                          Google
                        </button>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <button
                          type="button"
                          className="btn btn-block btn-outline-primary btn-lg font-weight-medium auth-form-btn"
                          onClick={handleSignIn}
                        >
                          <i className="mdi mdi-windows mr-2"></i>Iniciar con
                          Windows
                        </button>
                      </div>
                    </div>
                    <div className="auth-link text-left mt-3">
                      <span className="text-black">¿No tiene una cuenta? </span>
                      <Link to="/registrarCuenta" className="text-primary">
                        Crear cuenta
                      </Link>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
