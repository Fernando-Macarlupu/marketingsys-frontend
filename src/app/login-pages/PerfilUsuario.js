import React, { Component, useState, useEffect } from "react";
import { Tabs, Tab, Form, Button, Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import api from "../api";

const PerfilUsuario = () => {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState({});
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [idUsuario, setIdUsuario] = useState(0);
  const [cuenta, setCuenta] = useState({});
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("");
  const [foto, setFoto] = useState("");
  const [esAdministrador, setEsAdministrador] = useState(false);
  const [correos, setCorreos] = useState([]);
  const [redes, setRedes] = useState([]);
  const [politicas, setPoliticas] = useState([]);
  const [correosNoDisponibles, setCorreosNoDisponibles] = useState([]);
  const [nombreCompleto, setNombreCompleto] = useState("");

  const [nuevaRed, setNuevaRed] = useState({});

  const handleClose = () => setShow(false);

  const cambiarMostrarContrasena = (e) => {
    e.preventDefault();
    setMostrarContrasena(!mostrarContrasena);
  };

  const cargarUsuario = (usuario) => {
    api
      .get(`detalleUsuario/${parseInt(usuario["idUsuario"])}`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setIdUsuario(parseInt(usuario["idUsuario"]));
        setCuenta({
          id: parseInt(data["cuentaUsuario"]["id"]),
          nombre: data["cuentaUsuario"]["nombre"],
          expiracionCuenta: data["cuentaUsuario"]["expiracionCuenta"],
          diasExpiracioncuenta: parseInt(
            data["cuentaUsuario"]["diasExpiracioncuenta"]
          ),
        });
        setNombreCompleto(data["nombreCompleto"]);
        setNombreUsuario(data["nombreUsuario"]);
        setContrasena(data["contrasena"]);
        setRol(data["rol"]);
        setFoto(data["foto"]);
        setEsAdministrador(Boolean(data["esAdministrador"]));
        setCorreos(data["correos"]);
        setRedes(data["redes"]);
        setPoliticas(data["politicas"]);
        setCorreosNoDisponibles(data["correosNoDisponibles"]);
      })
      .catch((err) => alert(err));
  };

  const handleShow = () => {
    if (nombreCompleto == "") alert("Ingrese el nombre completo del contacto");
    else {
      if (nombreUsuario == "") alert("Ingrese un nombre de usuario");
      else {
        if (contrasena == "") alert("Ingrese una contraseña");
        else setShow(true);
      }
    }
  };

  const handleGuardarPerfil = (e) => {
    e.preventDefault();
    let cuentaGuardar = cuenta;
    let fechaGuardar = new Date(cuenta["expiracionCuenta"]);
    cuentaGuardar["expiracionCuenta"] =
    fechaGuardar.getDate() +
      "-" +
      parseInt(fechaGuardar.getMonth() + 1) +
      "-" +
      fechaGuardar.getFullYear();
    const usuarioGuardar = {
      idUsuario: idUsuario,
      cuentaUsuario: cuentaGuardar,
      nombreCompleto: nombreCompleto,
      nombreUsuario: nombreUsuario,
      contrasena: contrasena,
      foto: foto,
      rol: rol,
      esAdministrador: esAdministrador,
      correos: correos,
      redes: redes,
      politicas: politicas,
    };

    api
      .post("registrarUsuario", usuarioGuardar)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setShow(false);
      })
      .catch((err) => alert(err));
  };

  const handleAgregarRedes = () => {
    const redSocial = document.getElementById("redSocialNueva");
    const nombreUsuario = document.getElementById("nombreUsuarioNuevo");
    //console.log(redSocial.value);
    //console.log(nombreUsuario.value);
    setNuevaRed({
      redSocial: redSocial.value,
      nombreUsuario: nombreUsuario.value,
    });
    //console.log(nuevaRed);
    for (let index = 0; index < redes.length; index++) {
      const element = redes[index];
      if (
        element["redSocial"] == redSocial.value &&
        element["nombreUsuario"] == nombreUsuario.value
      )
        return;
    }
    setRedes([
      ...redes,
      {
        redSocial: redSocial.value,
        nombreUsuario: nombreUsuario.value,
      },
    ]);
    redSocial.value = "";
    nombreUsuario.value = "";
  };

  const mostrarRedSocial = (redSocial, nombreUsuario) => {
    let resultado = "";
    if (redSocial == "0") resultado += "Facebook - ";
    else {
      if (redSocial == "1") resultado += "Linkedin - ";
      else {
        if (redSocial == "2") resultado += "Instagram - ";
      }
    }
    if (nombreUsuario != "") resultado += nombreUsuario;
    return resultado;
  };

  const handleEliminarRedes = (redUsuario) => () => {
    setRedes((prev) =>
      prev.filter((el) => el.redSocial + el.nombreUsuario !== redUsuario)
    );
    //console.log(event.target.value);
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
    cargarUsuario(JSON.parse(usuario));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Perfil de usuario </h3>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="justify-content-between align-items-center tab-transparent">
            <Tabs defaultActiveKey="Perfil" className="nav">
              <Tab eventKey="Perfil" title="Editar perfil">
                <div className="row">
                  <div className="col-12 grid-margin">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <h4 className="card-title col-md-8">
                            Datos de usuario
                          </h4>
                          <div className="col-md-4">
                            <Form.Group>
                              <label className="col-form-label float-md-right">
                                <code>*</code> Información obligatoria
                              </label>
                            </Form.Group>
                          </div>
                        </div>
                        <form className="form-sample">
                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  Nombre completo<code>*</code>
                                </label>
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="text"
                                    value={nombreCompleto}
                                    onChange={({ target }) =>
                                      setNombreCompleto(target.value)
                                    }
                                  />
                                </div>
                              </Form.Group>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  Nombre de usuario<code>*</code>
                                </label>
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="text"
                                    value={nombreUsuario}
                                    onChange={({ target }) =>
                                      setNombreUsuario(target.value)
                                    }
                                  />
                                </div>
                              </Form.Group>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-11">
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  Contraseña<code>*</code>
                                </label>
                                <div className="col-sm-12">
                                  <Form.Control
                                    type={
                                      mostrarContrasena ? "text" : "password"
                                    }
                                    value={contrasena}
                                    onChange={({ target }) =>
                                      setContrasena(target.value)
                                    }
                                    className="col-sm-11"
                                  />
                                </div>
                              </Form.Group>
                            </div>
                            <div className="col-md-1">
                              <Form.Group>
                                <Button
                                  onClick={(e) => cambiarMostrarContrasena(e)}
                                  className={
                                    mostrarContrasena
                                      ? "mdi mdi-eye-off col-sm-12"
                                      : "mdi mdi-eye col-sm-12"
                                  }
                                ></Button>
                              </Form.Group>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  Rol<code></code>
                                </label>
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="text"
                                    value={rol}
                                    onChange={({ target }) =>
                                      setRol(target.value)
                                    }
                                  />
                                </div>
                              </Form.Group>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6"></div>
                            <div className="col-md-6">
                              <button
                                type="button"
                                className="btn btn-primary float-sm-right"
                                onClick={handleShow}
                              >
                                Guardar cambios
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="Cuentas" title="Cuentas asociadas">
                <div className="row">
                  <div className="col-12 grid-margin">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <h4 className="card-title col-md-8">Correos</h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 grid-margin">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <h4 className="card-title col-md-8">
                            Redes sociales
                          </h4>
                          <div className="col-md-4">
                            <Form.Group>
                              <button
                                type="button"
                                className="btn btn-link float-sm-right"
                                onClick={handleAgregarRedes}
                              >
                                Agregar nueva red social
                              </button>
                            </Form.Group>
                          </div>
                        </div>
                        <form className="form-sample">
                          <div className="row">
                            <div className="col-md-6">
                              <Form.Group className="row">
                                <div className="col-md-6">
                                  <Form.Group>
                                    <div className="col-sm-12">
                                      <select
                                        className="form-control"
                                        id="redSocialNueva"
                                      >
                                        <option
                                          value={""}
                                          disabled
                                          selected
                                          hidden
                                        >
                                          Red social
                                        </option>
                                        <option value={"0"}>Facebook</option>
                                        <option value={"1"}>Linkedin</option>
                                        <option value={"2"}>Instagram</option>
                                      </select>
                                    </div>
                                  </Form.Group>
                                </div>
                                <div className="col-md-6">
                                  <Form.Group>
                                    <div className="col-sm-12">
                                      <Form.Control
                                        type="text"
                                        id="nombreUsuarioNuevo"
                                        placeholder="Nombre de usuario"
                                      />
                                    </div>
                                  </Form.Group>
                                </div>
                              </Form.Group>

                              {redes.map(({ redSocial, nombreUsuario }) => (
                                <div
                                  className="row"
                                  key={redSocial + nombreUsuario}
                                >
                                  <div className="col-md-12">
                                    <Form.Group>
                                      <label
                                        className="col-sm-12"
                                        style={{ display: "flex" }}
                                      >
                                        {mostrarRedSocial(
                                          redSocial,
                                          nombreUsuario
                                        )}
                                        <button
                                          style={{ marginLeft: "auto" }}
                                          type="button"
                                        >
                                          <i
                                            className="mdi mdi-delete"
                                            style={{ color: "black" }}
                                            onClick={handleEliminarRedes(
                                              redSocial + nombreUsuario
                                            )}
                                          ></i>
                                        </button>
                                      </label>
                                    </Form.Group>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6"></div>
                            <div className="col-md-6">
                              <button
                                type="button"
                                className="btn btn-primary float-sm-right"
                                onClick={handleShow}
                              >
                                Guardar cambios
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="Politicas" title="Políticas de seguridad">
                <p></p>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="card-title" style={{ color: "#000000" }}>
              Guardar perfil
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="card-title" style={{ color: "#000000" }}>
            ¿Desea guardar los datos del perfil?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-primary" onClick={handleClose}>
            Cancelar
          </button>

          <button className="btn btn-primary" onClick={handleGuardarPerfil}>
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default PerfilUsuario;
