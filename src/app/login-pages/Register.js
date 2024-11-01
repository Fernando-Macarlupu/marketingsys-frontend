import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import api from "../api";

const Register = () => {
  const history = useHistory();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [correo, setCorreo] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    if (nombreCompleto == "") return alert("Ingrese su nombre completo");
    if (correo == "") return alert("Ingrese un correo electrónico");
    if (nombreUsuario == "") return alert("Ingrese un nombre de usuario");
    if (contrasena == "") return alert("Ingrese una contraseña");
    let fechaHoy = new Date();
    let fechaExpiracion = new Date(fechaHoy);
    fechaExpiracion.setDate(fechaHoy.getDate() + 180);

    const usuarioCreado = {
      idUsuario: 0,
      nombreCompleto: nombreCompleto,
      nombreUsuario: nombreUsuario,
      contrasena: contrasena,
      redes: [],
      correos: [{servicio: "", direccion: correo}],
      esAdministrador: true,
      foto: "",
      rol: "",
      cuentaUsuario: {
        id: 0,
        nombre: nombreUsuario,
        expiracionCuenta: fechaExpiracion.getDate() + "-" + parseInt(fechaExpiracion.getMonth() + 1) + "-" + fechaExpiracion.getFullYear(),
        diasExpiracioncuenta: 180,
      }
    };

    api
      .post("registrarUsuario", usuarioCreado)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        history.push({
          pathname: "/iniciarSesion",
        });
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
              <div className="page-header">
                <h2 className="page-title"> Crear cuenta </h2>
              </div>
              <Form className="pt-3">
                <Form.Group className="row">
                  <label className="col-form-label">
                    <code>*</code> Información obligatoria
                  </label>
                </Form.Group>
                <Form.Group className="row">
                  <div className="col-md-12">
                    <label className="col-form-label">
                      Nombre completo <code>*</code>
                    </label>
                    <div>
                      <Form.Control
                        type="text"
                        size="lg"
                        className="h-auto"
                        value={nombreCompleto}
                        onChange={({ target }) =>
                          setNombreCompleto(target.value)
                        }
                      />
                    </div>
                  </div>
                </Form.Group>
                <Form.Group>
                  <label className="col-form-label">
                    Correo <code>*</code>
                  </label>
                  <div>
                    <Form.Control
                      type="email"
                      size="lg"
                      className="h-auto"
                      value={correo}
                      onChange={({ target }) => setCorreo(target.value)}
                    />
                  </div>
                </Form.Group>
                <Form.Group>
                  <label className="col-form-label">
                    Nombre de usuario <code>*</code>
                  </label>
                  <div>
                    <Form.Control
                      type="text"
                      size="lg"
                      className="h-auto"
                      value={nombreUsuario}
                      onChange={({ target }) => setNombreUsuario(target.value)}
                    />
                  </div>
                </Form.Group>
                <Form.Group>
                  <label className="col-form-label">
                    Contraseña <code>*</code>
                  </label>
                  <div>
                    <Form.Control
                      type="password"
                      size="lg"
                      className="h-auto"
                      value={contrasena}
                      onChange={({ target }) => setContrasena(target.value)}
                    />
                  </div>
                </Form.Group>
                <div className="mt-3">
                  <button
                      type="button"
                      className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                      onClick={handleRegister}
                    >
                      Registrarse
                    </button>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12">
                    <button
                      type="button"
                      className="btn btn-block btn-outline-primary btn-lg font-weight-medium auth-form-btn"
                    >
                      <i className="mdi mdi-google mr-2"></i>Iniciar con Google
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
                  <span className="text-black">¿Ya tiene una cuenta? </span>
                  <Link to="/iniciarSesion" className="text-primary">
                    Iniciar sesión
                  </Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
