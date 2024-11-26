import React, { Component, useState, useEffect } from "react";
import { Tabs, Tab, Form, Button, Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";

const PerfilUsuario = () => {
  const history = useHistory();
  const [show, setShow] = useState(false);

  const [mostrarGuardarCorreos, setMostrarGuardarCorreos] = useState(false);
  const [mostrarGuardarRedes, setMostrarGuardarRedes] = useState(false);
  const [mostrarGuardarPoliticas, setMostrarGuardarPoliticas] = useState(false);
  const [mostrarGuardarExpiracion, setMostrarGuardarExpiracion] = useState(false);

  const [usuarioLogueado, setUsuarioLogueado] = useState({});
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [idUsuario, setIdUsuario] = useState(0);
  const [cuenta, setCuenta] = useState({});
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("");
  const [foto, setFoto] = useState("");
  const [esAdministrador, setEsAdministrador] = useState(false);
  const [correosOriginales, setCorreosOriginales] = useState([]);
  const [correos, setCorreos] = useState([]);
  const [redesOriginales, setRedesOriginales] = useState([]);
  const [redes, setRedes] = useState([]);
  const [politicasOriginales, setPoliticasOriginales] = useState([]);
  const [politicas, setPoliticas] = useState([]);
  const [correosNoDisponibles, setCorreosNoDisponibles] = useState([]);
  

  const [nombreCompletoOriginal, setNombreCompletoOriginal] = useState("");
  const [nombreUsuarioOriginal, setNombreUsuarioOriginal] = useState("");
  const [contrasenaOriginal, setContrasenaOriginal] = useState("");
  const [rolOriginal, setRolOriginal] = useState("");

  const [nuevaRed, setNuevaRed] = useState({});
  const [expiracionCuenta, setExpiracionCuenta] = useState(null);
  const [creacionCuenta, setCreacionCuenta] = useState(null);
  const [expiracionCuentaOriginal, setExpiracionCuentaOriginal] = useState(null);
  const [diasExpiracionOriginal, setDiasExpiracionOriginal] = useState(null);


  const handleClose = () => setShow(false);
  const handleChangeFechaExpiracion = (date) => {
    setExpiracionCuenta(date);
    console.log(date);
    setCuenta({...cuenta, diasExpiracioncuenta: Math.round
      ((date.getTime() - creacionCuenta.getTime()) / (1000 * 3600 * 24))});

  };

  const handleCloseCorreos = () => setMostrarGuardarCorreos(false);
  const handleCloseRedes = () => setMostrarGuardarRedes(false);
  const handleClosePoliticas = () => setMostrarGuardarPoliticas(false);
  const handleCloseExpiracion = () => setMostrarGuardarExpiracion(false);

  const handleShowCorreos = () => setMostrarGuardarCorreos(true);
  const handleShowRedes = () => setMostrarGuardarRedes(true);
  const handleShowPoliticas = () => setMostrarGuardarPoliticas(true);
  const handleShowExpiracion = () => setMostrarGuardarExpiracion(true);

  const cambiarMostrarContrasena = (e) => {
    e.preventDefault();
    setMostrarContrasena(!mostrarContrasena);
  };

  const handleDiasExpiracion = (e) => {
    setCuenta({...cuenta, diasExpiracioncuenta: e.target.value});
    const fecha = new Date(creacionCuenta);
    fecha.setDate(creacionCuenta.getDate() + Number(e.target.value));
    setExpiracionCuenta(fecha);
  };

  const handleEstadoPolitica = (politica) => () => {
    let politicasLista = [];
    for (let index = 0; index < politicas.length; index++) {
      const element = politicas[index];
      if (element["id"] == politica["id"])
        element["estado"] = !politica["estado"];
      politicasLista.push(element);
    }
    setPoliticas(politicasLista);
  };

  const cargarUsuario = (usuario) => {
    let politicasListaOriginal = []
    api
      .get(`detalleUsuario/${parseInt(usuario["idUsuario"])}`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setIdUsuario(parseInt(usuario["idUsuario"]));
        setDiasExpiracionOriginal(parseInt(
          data["cuentaUsuario"]["diasExpiracioncuenta"]
        ));
        setCuenta({
          id: parseInt(data["cuentaUsuario"]["id"]),
          nombre: data["cuentaUsuario"]["nombre"],
          expiracionCuenta: data["cuentaUsuario"]["expiracionCuenta"],
          diasExpiracioncuenta: parseInt(
            data["cuentaUsuario"]["diasExpiracioncuenta"]
          ),
        });
        console.log(data["cuentaUsuario"]["expiracionCuenta"]);
        setExpiracionCuenta(new Date(data["cuentaUsuario"]["expiracionCuenta"]));
        setExpiracionCuentaOriginal(new Date(data["cuentaUsuario"]["expiracionCuenta"]));
        setCreacionCuenta(new Date(data["cuentaUsuario"]["fechaCreacion"]));
        setNombreCompleto(data["nombreCompleto"]);
        setNombreCompletoOriginal(data["nombreCompleto"]);
        setNombreUsuario(data["nombreUsuario"]);
        setNombreUsuarioOriginal(data["nombreUsuario"]);
        setContrasena(data["contrasena"]);
        setContrasenaOriginal(data["contrasena"]);
        setRol(data["rol"]);
        setRolOriginal(data["rol"]);
        setFoto(data["foto"]);
        setEsAdministrador(Boolean(data["esAdministrador"]));
        setCorreosOriginales(data["correos"]);
        setCorreos(data["correos"]);
        setRedesOriginales(data["redes"]);
        setRedes(data["redes"]);
        setPoliticas(data["politicas"]);
        for (let index = 0; index < data["politicas"].length; index++) {
          const element = data["politicas"][index]["estado"];
          politicasListaOriginal.push(element);
        }
        setPoliticasOriginales(politicasListaOriginal);
        setCorreosNoDisponibles(data["correosNoDisponibles"]);
      })
      .catch((err) => alert(err));
  };

  const handleShow = () => {
    setShow(true);
  };

  const cancelarCambiosDatos = () => {
    setNombreCompleto(nombreCompletoOriginal);
    setNombreUsuario(nombreUsuarioOriginal);
    setContrasena(contrasenaOriginal);
    setRol(rolOriginal);
  };
  const cancelarCambiosExpiracion = () => {
    setExpiracionCuenta(expiracionCuentaOriginal);
    setCuenta({...cuenta, diasExpiracioncuenta: diasExpiracionOriginal});
  };

  const cancelarCambiosPoliticas = () => {
    let politicasLista = [];
    for (let index = 0; index < politicas.length; index++) {
      const element = politicas[index];
      element["estado"] = politicasOriginales[index];
      politicasLista.push(element);
    }
    setPoliticas(politicasLista);
  };

  const handleGuardarDatos = () => {
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
      //cuentaUsuario: cuentaGuardar,
      nombreCompleto: nombreCompleto,
      nombreUsuario: nombreUsuario,
      contrasena: contrasena,
      foto: foto,
      rol: rol,
      esAdministrador: esAdministrador,
      guardarPerfil: "0",
      //correos: correos,
      //redes: redes,
      //politicas: politicas,
    };

    api
      .post("registrarUsuario", usuarioGuardar)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setNombreCompletoOriginal(nombreCompleto);
        setNombreUsuarioOriginal(nombreUsuario);
        setContrasenaOriginal(contrasena);
        setRolOriginal(rol);
        setShow(false);
      })
      .catch((err) => alert(err));
  };

  const handleGuardarPerfilCorreos = (e) => {
    e.preventDefault();
    const usuarioGuardar = {
      idUsuario: idUsuario,
      guardarPerfil: "1",
      correos: correos,
    };

    api
      .post("registrarUsuario", usuarioGuardar)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setCorreosOriginales(correos);
        setMostrarGuardarCorreos(false);
      })
      .catch((err) => alert(err));
  };

  const handleGuardarPerfilRedes = (e) => {
    e.preventDefault();
    const usuarioGuardar = {
      idUsuario: idUsuario,
      guardarPerfil: "2",
      redes: redes,
    };

    api
      .post("registrarUsuario", usuarioGuardar)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setRedesOriginales(redes);
        setMostrarGuardarRedes(false);
      })
      .catch((err) => alert(err));
  };

  const handleGuardarPerfilPoliticas = (e) => {
    e.preventDefault();
    let politicasListaOriginal = [];
    const usuarioGuardar = {
      idUsuario: idUsuario,
      guardarPerfil: "3",
      politicas: politicas,
    };

    api
      .post("registrarUsuario", usuarioGuardar)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        for (let index = 0; index < politicas.length; index++) {
          const element = politicas[index]["estado"];
          politicasListaOriginal.push(element);
        }
        setPoliticasOriginales(politicasListaOriginal);
        setMostrarGuardarPoliticas(false);
      })
      .catch((err) => alert(err));
  };


  const handleGuardarPerfilExpiracion = (e) => {
    e.preventDefault();
    let fechaExpiracion = "";

    if (expiracionCuenta != null) {
      fechaExpiracion =
      expiracionCuenta.getDate() +
        "-" +
        parseInt(expiracionCuenta.getMonth() + 1) +
        "-" +
        expiracionCuenta.getFullYear();
    }
    setCuenta({...cuenta, expiracionCuenta: fechaExpiracion});
    const usuarioGuardar = {
      idUsuario: idUsuario,
      cuentaUsuario: {...cuenta, expiracionCuenta: fechaExpiracion},
      guardarPerfil: "4",
    };

    api
      .post("registrarUsuario", usuarioGuardar)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setExpiracionCuentaOriginal(expiracionCuenta);
        setDiasExpiracionOriginal(cuenta['diasExpiracioncuenta']);
        setMostrarGuardarExpiracion(false);
      })
      .catch((err) => alert(err));
  };

  const handleAgregarCorreos = () => {
    const servicioCorreo = document.getElementById("correoServicioNuevo");
    const correo = document.getElementById("correoNuevo");
    if (correo.value == "" || servicioCorreo.value == "") return;
    //console.log(redSocial.value);
    //console.log(nombreUsuario.value);
    //console.log(nuevaRed);
    for (let index = 0; index < correos.length; index++) {
      const element = correos[index];
      if (
        element["direccion"] == correo.value &&
        element["servicio"] == servicioCorreo.value
      )
        return;
    }
    setCorreos([
      ...correos,
      {
        direccion: correo.value,
        servicio: servicioCorreo.value,
        contrasena: "",
      },
    ]);
    correo.value = "";
    servicioCorreo.value = "";
  };

  const handleAgregarRedes = () => {
    const redSocial = document.getElementById("redSocialNueva");
    const nombreUsuario = document.getElementById("nombreUsuarioNuevo");
    if (redSocial.value == "" || nombreUsuario.value == "") return;
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

  const mostrarCorreo = (servicio, direccion) => {
    let resultado = "";
    if (servicio == "0") resultado += "Cuenta de Google - Dirección: ";
    else {
      if (servicio == "1") resultado += "Cuenta de Microsoft - Dirección: ";
      else {
        resultado += "Cuenta de correo - Dirección: ";
      }
    }
    if (direccion != "") resultado += direccion;
    return resultado;
  };

  const mostrarRedSocial = (redSocial, nombreUsuario) => {
    let resultado = "";
    if (redSocial == "0")
      resultado += "Cuenta de Facebook - Nombre de usuario: ";
    else {
      if (redSocial == "1")
        resultado += "Cuenta de Linkedin - Nombre de usuario: ";
      else {
        if (redSocial == "2")
          resultado += "Cuenta de Instagram - Nombre de usuario: ";
      }
    }
    if (nombreUsuario != "") resultado += nombreUsuario;
    return resultado;
  };

  const handleEliminarCorreos = (direccion) => () => {
    setCorreos((prev) => prev.filter((el) => el.direccion !== direccion));
    //console.log(event.target.value);
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
                            <div className="col-md-12">
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
                                    className="col-sm-10 float-sm-left"
                                  />
                                  <Button
                                    onClick={(e) => cambiarMostrarContrasena(e)}
                                    className={
                                      mostrarContrasena
                                        ? "mdi mdi-eye-off col-sm-1 float-sm-right"
                                        : "mdi mdi-eye col-sm-1 float-sm-right"
                                    }
                                  ></Button>
                                </div>
                              </Form.Group>
                            </div>
                            <div className="col-md-1">
                              <Form.Group></Form.Group>
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
                                onClick={handleGuardarDatos}
                              >
                                Guardar cambios
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-primary float-sm-right"
                                onClick={cancelarCambiosDatos}
                              >
                                Cancelar cambios
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
                          <div className="col-md-4">
                            <Form.Group>
                              <button
                                type="button"
                                className="btn btn-link float-sm-right"
                                onClick={handleAgregarCorreos}
                              >
                                Agregar nuevo correo
                              </button>
                            </Form.Group>
                          </div>
                        </div>
                        <form className="form-sample">
                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group className="row">
                                <div className="col-md-4">
                                  <Form.Group>
                                    <div className="col-sm-12">
                                      <select
                                        className="form-control"
                                        id="correoServicioNuevo"
                                      >
                                        <option
                                          value={""}
                                          disabled
                                          selected
                                          hidden
                                        >
                                          Servicio de correo
                                        </option>
                                        <option value={"0"}>Google</option>
                                        <option value={"1"}>Microsoft</option>
                                      </select>
                                    </div>
                                  </Form.Group>
                                </div>
                                <div className="col-md-8">
                                  <Form.Group>
                                    <div className="col-sm-12">
                                      <Form.Control
                                        type="text"
                                        id="correoNuevo"
                                        placeholder="Dirección de correo"
                                      />
                                    </div>
                                  </Form.Group>
                                </div>
                              </Form.Group>

                              {correos.map(({ servicio, direccion }) => (
                                <div className="row" key={direccion}>
                                  <div className="col-md-12">
                                    <Form.Group>
                                      <label
                                        className="col-sm-12"
                                        style={{ display: "flex" }}
                                      >
                                        {mostrarCorreo(servicio, direccion)}
                                        <button
                                          style={{ marginLeft: "auto" }}
                                          type="button"
                                        >
                                          <i
                                            className="mdi mdi-delete"
                                            style={{ color: "black" }}
                                            onClick={handleEliminarCorreos(
                                              direccion
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
                                onClick={handleShowCorreos}
                              >
                                Guardar cambios
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-primary float-sm-right"
                                onClick={() => setCorreos(correosOriginales)}
                              >
                                Cancelar cambios
                              </button>
                            </div>
                          </div>
                        </form>
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
                            <div className="col-md-12">
                              <Form.Group className="row">
                                <div className="col-md-4">
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
                                <div className="col-md-8">
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
                                onClick={handleShowRedes}
                              >
                                Guardar cambios
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-primary float-sm-right"
                                onClick={() => setRedes(redesOriginales)}
                              >
                                Cancelar cambios
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
                <div className="row">
                <div className="col-12 grid-margin">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <h4 className="card-title col-md-8">Expiración de la cuenta</h4>
                        </div>
                        <form className="form-sample">
                          <div className="row">
                            <div className="col-md-6">
                              <Form.Group >
                                
                              <label className="col-sm-12 col-form-label">
                              Días de expiración de la cuenta
                            </label>
                            <div className="col-sm-12">
                              <Form.Control
                                type="number"
                                value={cuenta['diasExpiracioncuenta']}
                                onChange={
                                  handleDiasExpiracion
                                }
                              />
                            </div>
                              </Form.Group>
                            </div>


                            <div className="col-md-6">
                            <Form.Group>
                            <label className="col-sm-12 col-form-label">
                              Fecha de expiración
                            </label>
                            <div className="col-sm-12">
                              <div className="customDatePickerWidth">
                                <DatePicker
                                  className="form-control w-100"
                                  selected={expiracionCuenta}
                                  onChange={handleChangeFechaExpiracion}
                                  dateFormat="dd/MM/yyyy"
                                />
                              </div>
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
                                onClick={handleShowExpiracion}
                              >
                                Guardar cambios
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-primary float-sm-right"
                                onClick={cancelarCambiosExpiracion}
                              >
                                Cancelar cambios
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 grid-margin">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <h4 className="card-title col-md-12">
                            Políticas de contraseña
                          </h4>
                        </div>
                        <form className="form-sample">
                          <div className="row">
                            {politicas.map((politica) => (
                              <div className="col-md-12">
                                <Form.Group>
                                  <div class="custom-control custom-switch">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      id={politica["id"]}
                                      checked={politica['estado']}
                                      onChange={handleEstadoPolitica(
                                          politica)
                                      }
                                    />
                                    <label className="custom-control-label"
                                    for={politica["id"]}>
                                      {politica["nombre"]}
                                    </label>
                                  </div>
                                </Form.Group>
                              </div>
                            ))}
                          </div>

                          <div className="row">
                            <div className="col-md-6"></div>
                            <div className="col-md-6">
                              <button
                                type="button"
                                className="btn btn-primary float-sm-right"
                                onClick={handleShowPoliticas}
                              >
                                Guardar cambios
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-primary float-sm-right"
                                onClick={cancelarCambiosPoliticas}
                              >
                                Cancelar cambios
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
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

      <Modal show={mostrarGuardarCorreos} onHide={handleCloseCorreos}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="card-title" style={{ color: "#000000" }}>
              Guardar perfil
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="card-title" style={{ color: "#000000" }}>
            ¿Desea guardar los correos?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-outline-primary"
            onClick={handleCloseCorreos}
          >
            Cancelar
          </button>

          <button
            className="btn btn-primary"
            onClick={handleGuardarPerfilCorreos}
          >
            Guardar
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={mostrarGuardarRedes} onHide={handleCloseRedes}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="card-title" style={{ color: "#000000" }}>
              Guardar perfil
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="card-title" style={{ color: "#000000" }}>
            ¿Desea guardar las redes sociales?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-outline-primary"
            onClick={handleCloseRedes}
          >
            Cancelar
          </button>

          <button
            className="btn btn-primary"
            onClick={handleGuardarPerfilRedes}
          >
            Guardar
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={mostrarGuardarPoliticas} onHide={handleClosePoliticas}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="card-title" style={{ color: "#000000" }}>
              Guardar perfil
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="card-title" style={{ color: "#000000" }}>
            ¿Desea guardar las políticas de seguridad?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-outline-primary"
            onClick={handleClosePoliticas}
          >
            Cancelar
          </button>

          <button className="btn btn-primary" onClick={handleGuardarPerfilPoliticas}>
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
      <Modal show={mostrarGuardarExpiracion} onHide={handleCloseExpiracion}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="card-title" style={{ color: "#000000" }}>
              Guardar perfil
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="card-title" style={{ color: "#000000" }}>
            ¿Desea guardar los días y fecha de expiración?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-outline-primary"
            onClick={handleCloseExpiracion}
          >
            Cancelar
          </button>

          <button className="btn btn-primary" onClick={handleGuardarPerfilExpiracion}>
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default PerfilUsuario;
