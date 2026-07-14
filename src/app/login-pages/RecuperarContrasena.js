import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import api from "../api";
import axios from "axios";

const RecuperarContrasena = () => {
  const history = useHistory();
  const [idUsuario, setIdUsuario] = useState(0);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [contrasenaConfirmar, setContrasenaConfirmar] = useState("");
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [codigoInput, setCodigoInput] = useState("");
  const [paso, setPaso] = useState(1);
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

  const handleChangeNombreUsuario = (event) => {
    //console.log(event.target.value);
    setNombreUsuario(event.target.value);
  };

  const handleChangeContrasena = (event) => {
    //console.log(event.target.value);
    setContrasena(event.target.value);
  };

  const handleChangeContrasenaConfirmar = (event) => {
    //console.log(event.target.value);
    setContrasenaConfirmar(event.target.value);
  };

  const handleChangeCorreo = (event) => {
    //console.log(event.target.value);
    setCorreo(event.target.value);
  };

  const handleChangeCodigoInput = (event) => {
    //console.log(event.target.value);
    setCodigoInput(event.target.value);
  };

  const handleSendCode = (e) => {
    e.preventDefault();
    const codigoGenerado = Math.floor(Math.random() * 9000 + 1000);
    const cuerpo = {
      correo: correo,
      codigo: codigoGenerado,
    };
    if (correo == "") return alert("Ingrese un correo");
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .post("enviarCodigoRecuperacion", cuerpo)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCargaDatos(false);
        setMostrarDatos(true);
        if (data == {})
          alert("No se ha encontrado una cuenta de usuario asociada al correo");
        else {
          setCodigo(codigoGenerado);
          setIdUsuario(parseInt(data["idUsuario"]));
          setCodigoInput("");
          setPaso(2);
        }
      })
      .catch((err) => alert(err));
  };

  const handleValidateCode = (e) => {
    e.preventDefault();
    if (codigoInput == "") alert("Ingrese el código de verificación");
    else {
      if (codigoInput != codigo) alert("El código ingresado es incorrecto");
      else {
        setPaso(3);
      }
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (contrasena == "" || contrasenaConfirmar == "")
      return alert("Ingrese la contraseña y su confirmación");
    if (contrasena != contrasenaConfirmar)
      return alert("Las contraseña y su confirmación no coincide");

    const usuarioContrasena = {
      idUsuario: idUsuario,
      contrasena: contrasena,
    };
    // send the username and password to the server
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .post("actualizarContrasena", usuarioContrasena)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCargaDatos(false);
        setMostrarDatos(true);
        if (data == {}) alert("Error al actualizar contraseña");
        else {
          history.push({
            pathname: "/iniciarSesion",
            state: { actualizacionContrasena: true },
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
            {paso == 1 && (
              <div className="col-lg-6 px-0">
                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                  <div className="col-lg-8 mx-auto">
                    <div className="page-header">
                      <h2 className="page-title"> Restablecer contraseña </h2>
                    </div>
                    <Form className="pt-3">
                      <Form.Group>
                        <label className="col-form-label">
                          Ingrese una dirección de correo de Google o Microsoft
                          para enviarle un código para restablecer su contraseña
                        </label>
                      </Form.Group>
                      <Form.Group>
                        <label className="col-form-label">Correo</label>
                        <div>
                          <Form.Control
                            type="email"
                            size="lg"
                            className="h-auto"
                            onChange={handleChangeCorreo}
                            value={correo}
                            required
                          />
                        </div>
                      </Form.Group>
                      <div className="mt-3">
                        <button
                          type="button"
                          className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                          onClick={handleSendCode}
                        >
                          Enviar código
                        </button>
                      </div>
                      <div className="auth-link text-left mt-3">
                        <span className="text-black">
                          ¿Ya tienes una cuenta?{" "}
                        </span>
                        <Link to="/iniciarSesion" className="text-primary">
                          Iniciar sesión
                        </Link>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            )}
            {paso == 2 && (
              <div className="col-lg-6 px-0">
                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                  <div className="col-lg-8 mx-auto">
                    <div className="page-header">
                      <h2 className="page-title"> Restablecer contraseña </h2>
                    </div>
                    <Form className="pt-3">
                      <Form.Group>
                        <label className="col-form-label">
                          Ingrese el código para restablecer su contraseña
                          enviado al correo {correo}
                        </label>
                      </Form.Group>
                      <Form.Group>
                        <label className="col-form-label">Código</label>
                        <div>
                          <Form.Control
                            type="number"
                            size="lg"
                            className="h-auto"
                            onChange={handleChangeCodigoInput}
                            required
                          />
                        </div>
                      </Form.Group>
                      <div className="mt-3">
                        <div className="row">
                          <div className="col-md-6">
                            <button
                              type="button"
                              className="btn btn-block btn-primary btn-lg"
                              onClick={(e) => setPaso(1)}
                            >
                              Volver al envío del código
                            </button>
                          </div>
                          <div className="col-md-6">
                            <button
                              type="button"
                              className="btn btn-block btn-primary btn-lg"
                              onClick={handleValidateCode}
                            >
                              Comprobar código
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="auth-link text-left mt-3">
                        <span className="text-black">
                          ¿Ya tienes una cuenta?{" "}
                        </span>
                        <Link to="/iniciarSesion" className="text-primary">
                          Iniciar sesión
                        </Link>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            )}
            {paso == 3 && (
              <div className="col-lg-6 px-0">
                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                  <div className="col-lg-8 mx-auto">
                    <div className="page-header">
                      <h2 className="page-title"> Restablecer contraseña </h2>
                    </div>
                    <Form className="pt-3">
                      <Form.Group>
                        <label className="col-form-label">
                          Información obligatoria <code>*</code>
                        </label>
                      </Form.Group>
                      <Form.Group>
                        <label className="col-form-label">
                          Nueva contraseña <code>*</code>
                        </label>
                        <div>
                          <Form.Control
                            type="number"
                            size="lg"
                            className="h-auto"
                            onChange={handleChangeContrasena}
                            required
                          />
                        </div>
                      </Form.Group>
                      <Form.Group>
                        <label className="col-form-label">
                          Confirmar contraseña <code>*</code>
                        </label>
                        <div>
                          <Form.Control
                            type="number"
                            size="lg"
                            className="h-auto"
                            onChange={handleChangeContrasenaConfirmar}
                            required
                          />
                        </div>
                      </Form.Group>
                      <div className="mt-3">
                        <button
                          type="button"
                          className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                          onClick={handleUpdatePassword}
                        >
                          Actualizar contraseña
                        </button>
                      </div>
                      <div className="auth-link text-left mt-3">
                        <span className="text-black">
                          ¿Ya tienes una cuenta?{" "}
                        </span>
                        <Link to="/iniciarSesion" className="text-primary">
                          Iniciar sesión
                        </Link>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecuperarContrasena;
