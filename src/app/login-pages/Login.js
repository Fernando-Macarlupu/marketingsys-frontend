import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import api from "../api";

const Login = () => {
  const history = useHistory();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [usuario, setUsuario] = useState({});

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

    api
      .post("login", usuarioBusqueda)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
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
                <Form className="pt-3">
                  <Form.Group>
                    <label className="col-form-label">Nombre de usuario</label>
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
    </div>
  );
};

export default Login;
