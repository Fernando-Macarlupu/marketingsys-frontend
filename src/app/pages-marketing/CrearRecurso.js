import React, { useRef, useEffect, useState } from "react";
import { Tabs, Tab, Form, FormGroup, Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import bsCustomFileInput from "bs-custom-file-input";
import LandingPageEditor from "./LandingPageEditor";
import plantilla2 from "./plantilla2.json";

const CrearRecurso = () => {
  const history = useHistory();
  const emailEditorRef = useRef(null);
  const landingEditorRef = useRef(null);
  const [show, setShow] = useState(false);
  const [mostrarCargaDatos, setMostrarCargaDatos] = useState(false);
  const [mostrarDatos, setMostrarDatos] = useState(true);
  const [step, setStep] = useState(1);

  const [mostrarTablaIndicadores, setMostrarTablaIndicadores] = useState(false);
  const [mostrarCargaIndicadores, setMostrarCargaIndicadores] = useState(false);

  const [propietario, setPropietario] = useState(0);

  const [descripcion, setDescripcion] = useState("");
  const [presupuesto, setPresupuesto] = useState(0.0);
  const [tipo, setTipo] = useState("0");

  const [mostrarBuscarCampanas, setMostrarBuscarCampanas] = useState(false);
  const [campana, setCampana] = useState({ id: 0, descripcion: "" });
  const [campanaCadena, setCampanaCadena] = useState("");
  const [mostrarTablaCampanas, setMostrarTablaCampanas] = useState(false);
  const [mostrarCargaCampanas, setMostrarCargaCampanas] = useState(false);
  const [campanasBusqueda, setCampanasBusqueda] = useState([]);

  const [inicioVigencia, setInicioVigencia] = useState(null);
  const [finVigencia, setFinVigencia] = useState(null);

  const [indicadorCadena, setIndicadorCadena] = useState("");
  const [aspectoIndicador, setAspectoIndicador] = useState("");
  const [tipoIndicador, setTipoIndicador] = useState("");
  const [indicadores, setIndicadores] = useState([]);
  const [indicadoresBusqueda, setIndicadoresBusqueda] = useState([]);

  const [mostrarTablaContactos, setMostrarTablaContactos] = useState(false);
  const [mostrarCargaContactos, setMostrarCargaContactos] = useState(false);
  const [contactoCadena, setContactoCadena] = useState("");
  // const [tipoContacto, setTipoContacto] = useState("");
  const [contactos, setContactos] = useState([]);
  const [contactosBusqueda, setContactosBusqueda] = useState([]);

  const [servicioRedSocial, setServicioRedSocial] = useState("");
  const [usuarioRedSocial, setUsuarioRedSocial] = useState("");
  const [fechaPublicacionRedSocial, setFechaPublicacionRedSocial] =
    useState(null);
  const [horaPublicacionRedSocial, setHoraPublicacionRedSocial] =
    useState(null);
  const [audienciaRedSocial, setAudienciaRedSocial] = useState("");
  const [contenidoRedSocial, setContenidoRedSocial] = useState("");

  const [correosUsuario, setCorreosUsuario] = useState([]);
  const [remitenteCorreo, setRemitenteCorreo] = useState("");
  const [remitenteContrasena, setRemitenteContrasena] = useState("");
  const [asuntoCorreo, setAsuntoCorreo] = useState("");
  const [fechaPublicacionCorreo, setFechaPublicacionCorreo] = useState(null);
  const [horaPublicacionCorreo, setHoraPublicacionCorreo] = useState(null);
  const [contenidoCorreo, setContenidoCorreo] = useState(null);

  const [contenidoGuardar, setContenidoGuardar] = useState(null);
  const [contenidoGuardarHTML, setContenidoGuardarHTML] = useState(null);

  const [titulo, setTitulo] = useState("");
  const [dominio, setDominio] = useState("");
  const [complementoDominio, setComplementoDominio] = useState("");
  const [contenidoLanding, setContenidoLanding] = useState(null);
  const [contenidoGuardarLanding, setContenidoGuardarLanding] = useState(null);
  const [contenidoGuardarLandingHTML, setContenidoGuardarLandingHTML] =
    useState(null);

  const [usuarioLogueado, setUsuarioLogueado] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (descripcion == "") alert("Ingrese la descripción de la estrategia");
    else {
      if (tipo == "0") {
        if (remitenteCorreo == "") alert("Ingrese el remitente del correo");
        else {
          if (fechaPublicacionCorreo == null)
            alert("Ingrese la fecha de publicación del correo");
          else {
            if (horaPublicacionCorreo == null)
              alert("Ingrese la hora de publicación del correo");
            else {
              if (asuntoCorreo == "") alert("Ingrese el asunto del correo");
              else {
                if (emailEditorRef != null) {
                  if (emailEditorRef.current != null) {
                    const unlayer = emailEditorRef.current.editor;
                    if (unlayer != null) {
                      unlayer.exportHtml((data) => {
                        const { design, html } = data;
                        setContenidoGuardar(design);
                        setContenidoGuardarHTML(html);
                      });
                    }
                  }
                }
                setShow(true);
              }
            }
          }
        }
      } else if (tipo == "2") {
        if (dominio == "") alert("Ingrese el dominio de la página web");
        else {
          if (landingEditorRef != null) {
            if (landingEditorRef.current != null) {
              const unlayer = landingEditorRef.current.editor;
              if (unlayer != null) {
                unlayer.exportHtml((data) => {
                  const { design, html } = data;
                  setContenidoGuardarLanding(design);
                  setContenidoGuardarLandingHTML(html);
                });
              }
            }
          }
          setShow(true);
        }
      }
    }
  };

  const handleNext = () => {
    if (tipo == "0") setStep(2);
    else if (tipo == "1") setStep(3);
    else if (tipo == "2") setStep(4);
  };

  const handlePrevious = () => {
    setStep(1);
  };

  const handleChangeInicioVigencia = (date) => setInicioVigencia(date);
  const handleChangeFinVigencia = (date) => setFinVigencia(date);

  const handleChangeRemitente = (event) => {
    //buscar la contra y setearla tambien setear el remitente
    setRemitenteCorreo(event.target.value);
    let cont = "";
    for (let index = 0; index < correosUsuario.length; index++) {
      const element = correosUsuario[index];
      if (element["direccion"] == event.target.value) {
        cont = element["contrasena"];
      }
    }
    setRemitenteContrasena(cont);
  };

  const handleBuscarCampanas = () =>
    setMostrarBuscarCampanas(!mostrarBuscarCampanas);

  const buscarCampanas = () => {
    //console.log("esto es la cadena")

    let fechaHoy = "",
      fecha = new Date();

    fechaHoy =
      fecha.getDate() +
      "-" +
      parseInt(fecha.getMonth() + 1) +
      "-" +
      fecha.getFullYear();
    setMostrarTablaCampanas(false);
    setMostrarCargaCampanas(true);
    api
      .post("filtrarCampanas", {
        cadena: campanaCadena,
        tipo: "",
        estado: "",
        fechaHoy: fechaHoy,
        fechaVigenciaIni: "",
        fechaVigenciaFin: "",
        propietario: usuarioLogueado["idCuenta"],
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setCampanasBusqueda(data);
        setMostrarCargaCampanas(false);
        setMostrarTablaCampanas(true);
      })
      .catch((err) => alert(err));
  };

  const buscarCampanasCadena = (event) => {
    event.preventDefault();
    buscarCampanas();
  };

  const handleAsignarCampana = (id, descripcion, estado, tipo) => () => {
    setCampana({
      id: id,
      descripcion: descripcion,
      estado: estado,
      tipo: tipo,
    });
    //console.log(event.target.value);
  };

  const handleAgregarIndicadores =
    (id, nombre, aspecto, tipo, calculoAutomatico) => () => {
      for (let index = 0; index < indicadores.length; index++) {
        const element = indicadores[index];
        if (element["id"] == id) return;
      }
      setIndicadores([
        ...indicadores,
        {
          id: id,
          nombre: nombre,
          aspecto: aspecto,
          tipo: tipo,
          calculoAutomatico: calculoAutomatico,
          valor: 0.0,
        },
      ]);
    };

  const handleValorIndicadores = (event, id) => () => {
    const indicadoresLista = [];
    for (let index = 0; index < indicadores.length; index++) {
      const element = indicadores[index];
      if (element["id"] == id) element["valor"] = event.target.value;
      indicadoresLista.push(element);
    }
    setIndicadores(indicadoresLista);
  };

  const handleEliminarIndicadores = (id) => () => {
    console.log("se va a eliminar");
    setIndicadores((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
  };

  const handleChangeTipoRecurso = (event) => {
    setTipo(event.target.value);
  };

  const buscarIndicadores = () => {
    //console.log("esto es la cadena")
    let tipoBusqueda = "";
    if (tipoIndicador != "") {
      if (aspectoIndicador == "1" && tipoIndicador == "0")
        tipoBusqueda = "0"; //programa
      else if (aspectoIndicador == "1" && tipoIndicador == "1")
        tipoBusqueda = "1"; //campaña stand-alone
      else if (aspectoIndicador == "2" && tipoIndicador == "0")
        tipoBusqueda = "2"; //campaña de programa
      else if (aspectoIndicador == "2" && tipoIndicador == "1")
        tipoBusqueda = "3"; //campaña stand-alone
      else if (aspectoIndicador == "3" && tipoIndicador == "0")
        tipoBusqueda = "4"; //correo
      else if (aspectoIndicador == "3" && tipoIndicador == "1")
        tipoBusqueda = "5"; //publicacion
      else if (aspectoIndicador == "3" && tipoIndicador == "2")
        tipoBusqueda = "6"; //pagina web
    }
    setMostrarTablaIndicadores(false);
    setMostrarCargaIndicadores(true);
    api
      .post("filtrarIndicadores", {
        cadena: indicadorCadena,
        aspecto: aspectoIndicador,
        tipo: tipoBusqueda,
        fechaCreacionIni: "",
        fechaCreacionFin: "",
        fechaModificacionIni: "",
        fechaModificacionFin: "",
        propietario: usuarioLogueado["idCuenta"],
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setIndicadoresBusqueda(data);
        setMostrarCargaIndicadores(false);
        setMostrarTablaIndicadores(true);
      })
      .catch((err) => alert(err));
  };

  const buscarIndicadoresCadena = (event) => {
    event.preventDefault();
    buscarIndicadores();
  };

  const handleAgregarContactos =
    (id, correo, nombreCompleto, empresa) => () => {
      for (let index = 0; index < contactos.length; index++) {
        const element = contactos[index];
        if (element["id"] == id) return;
      }
      setContactos([
        ...contactos,
        {
          id: id,
          correo: correo,
          nombreCompleto: nombreCompleto,
          empresa: empresa,
        },
      ]);
    };

  const handleEliminarContactos = (id) => () => {
    console.log("se va a eliminar");
    setContactos((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
  };

  const buscarContactos = () => {
    //console.log("esto es la cadena")
    setMostrarTablaContactos(false);
    setMostrarCargaContactos(true);
    api
      .post("filtrarContactos", {
        cadena: contactoCadena,
        estado: "",
        fechaCreacionIni: "",
        fechaCreacionFin: "",
        fechaModificacionIni: "",
        fechaModificacionFin: "",
        propietario: usuarioLogueado["idCuenta"],
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setContactosBusqueda(data);
        setMostrarCargaContactos(false);
        setMostrarTablaContactos(true);
      })
      .catch((err) => alert(err));
  };

  const buscarContactosCadena = (event) => {
    event.preventDefault();
    buscarContactos();
  };

  const guardarRecurso = () => {
    let fechaVigenciaIni = "",
      fechaVigenciaFin = "",
      fechaPublicacion = "";

    if (inicioVigencia != null) {
      fechaVigenciaIni =
        inicioVigencia.getDate() +
        "-" +
        parseInt(inicioVigencia.getMonth() + 1) +
        "-" +
        inicioVigencia.getFullYear();
    }
    if (finVigencia != null) {
      fechaVigenciaFin =
        finVigencia.getDate() +
        "-" +
        parseInt(finVigencia.getMonth() + 1) +
        "-" +
        finVigencia.getFullYear();
    }

    let cuerpo = {
      idRecurso: 0,
      idCampana: campana.id,
      tipo: tipo, //0: de programa, 1: stand-alone
      descripcion: descripcion,
      presupuesto: presupuesto,
      inicioVigencia: fechaVigenciaIni,
      finVigencia: fechaVigenciaFin,
      estado: "",
      propietario: usuarioLogueado["idCuenta"],
      indicadores: indicadores,
      contactos: [],
    };

    if (tipo == "0") {
      if (fechaPublicacionCorreo != null) {
        fechaPublicacion =
          fechaPublicacionCorreo.getDate() +
          "-" +
          parseInt(fechaPublicacionCorreo.getMonth() + 1) +
          "-" +
          fechaPublicacionCorreo.getFullYear();
      }
      //correo
      cuerpo["fechaPublicacion"] = fechaPublicacion;
      cuerpo["horaPublicacion"] = horaPublicacionCorreo; //cambiar formato
      cuerpo["asuntoCorreo"] = asuntoCorreo;
      cuerpo["remitenteCorreo"] = remitenteCorreo;
      cuerpo["remitenteContrasena"] = remitenteContrasena;
      cuerpo["contactos"] = contactos;
      cuerpo["contenido"] = JSON.stringify(contenidoGuardar);
      cuerpo["contenidoHTML"] = contenidoGuardarHTML;
    } else if (tipo == "1") {
      cuerpo["fechaPublicacion"] = fechaPublicacionRedSocial; //cambiar formato
      cuerpo["horaPublicacion"] = horaPublicacionRedSocial; //cambiar formato
      cuerpo["servicioRedSocial"] = servicioRedSocial;
      cuerpo["usuarioRedSocial"] = usuarioRedSocial;
      cuerpo["audienciaRedSocial"] = audienciaRedSocial;
      cuerpo["contenido"] = contenidoRedSocial;
    } else if (tipo == "2") {
      cuerpo["titulo"] = titulo;
      cuerpo["dominio"] = dominio;
      cuerpo["complementoDominio"] = complementoDominio;
      cuerpo["contenido"] = JSON.stringify(contenidoGuardarLanding);
      cuerpo["contenidoHTML"] = contenidoGuardarLandingHTML;
    }
    console.log("cuerpo a subir");
    console.log(cuerpo);
    //setShow(false);
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .post("registrarRecurso", cuerpo)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCargaDatos(false);
        setMostrarDatos(true);
        setShow(false);
        history.push({
          pathname: "/tacticas",
          state: { recursoGuardado: true },
        });
      })
      .catch((err) => alert(err));
  };

  const cargarCorreos = (id) => {
    api
      .get(`correosUsuario/${id}`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setCorreosUsuario(data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    let usuario = localStorage.getItem("marketingSYSusuario");
    let usuarioPropiedades = {};
    if (usuario == null) {
      history.push({
        pathname: "/iniciarSesion",
      });
      return;
    }
    usuarioPropiedades = JSON.parse(usuario);
    setUsuarioLogueado(usuarioPropiedades);
    cargarCorreos(usuarioPropiedades["idUsuario"]);
  }, []);

  const componentDidMount = () => {
    bsCustomFileInput.init();
  };

  const [opcionesTipoVariable, setOpcionesTipoVariable] = useState([
    { id: "", nombre: "Tipo" },
  ]);

  const planOpciones = [{ id: "", nombre: "Todos los tipos" }];
  const estrategiaOpciones = [
    { id: "", nombre: "Todos los tipos" },
    { id: "0", nombre: "Programa" },
    { id: "1", nombre: "Campaña stand-alone" },
  ];
  const campanaOpciones = [
    { id: "", nombre: "Todos los tipos" },
    { id: "0", nombre: "Campaña de programa" },
    { id: "1", nombre: "Campaña stand-alone" },
  ];
  const recursoOpciones = [
    { id: "", nombre: "Todos los tipos" },
    { id: "0", nombre: "Correo" },
    { id: "1", nombre: "Publicación" },
    { id: "3", nombre: "Página web" },
  ];

  const handleChangeAspectoVariable = (event) => {
    setAspectoIndicador(event.target.value);
    if (event.target.value == "") setOpcionesTipoVariable(planOpciones);
    else if (event.target.value == "0") setOpcionesTipoVariable(planOpciones);
    else if (event.target.value == "1")
      setOpcionesTipoVariable(estrategiaOpciones);
    else if (event.target.value == "2")
      setOpcionesTipoVariable(campanaOpciones);
    else if (event.target.value == "3")
      setOpcionesTipoVariable(recursoOpciones);
  };

  return (
    <>
      {mostrarCargaDatos && (
        <div className="row h-100">
          <div className="col-sm-12 my-auto">
            <div className="circle-loader"></div>
          </div>
        </div>
      )}
      {mostrarDatos && (
        <div>
          <div>
            <div className="page-header">
              <h3 className="page-title"> Nuevo recurso </h3>
            </div>
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    {step == 1 && (
                      <div>
                        <div className="row">
                          <div className="col-md-6 border-top border-4 border-secondary">
                            <Form.Group className="pt-3">
                              <label className="col-sm-12 font-weight-bold">
                                1. Datos del recurso
                              </label>
                              <label className="col-sm-12">
                                Ingrese los datos del recurso
                              </label>
                            </Form.Group>
                          </div>
                          <div className="col-md-6">
                            <Form.Group className="pt-3">
                              <label
                                className="col-sm-12 font-weight-bold"
                                style={{ color: "#A2A9B0" }}
                              >
                                2. Contenido del recurso
                              </label>
                              <label
                                className="col-sm-12"
                                style={{ color: "#A2A9B0" }}
                              >
                                Configure el contenido del recurso
                              </label>
                            </Form.Group>
                          </div>
                        </div>
                        <div className="row">
                          <h4 className="card-title col-md-8">
                            Datos de recurso
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
                                  Descripción<code>*</code>
                                </label>
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="text"
                                    value={descripcion}
                                    onChange={({ target }) =>
                                      setDescripcion(target.value)
                                    }
                                  />
                                </div>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group className="row">
                                <label className="col-sm-8 col-form-label">
                                  Campaña asociada
                                </label>
                                <div className="col-sm-4">
                                  <button
                                    type="button"
                                    className="btn btn-link float-sm-right"
                                    onClick={handleBuscarCampanas}
                                  >
                                    Buscar campañas
                                  </button>
                                </div>
                                <div className="col-md-12">
                                  <Form.Group>
                                    <div className="col-sm-12">
                                      <Form.Control
                                        type="text"
                                        value={campana.descripcion}
                                      />
                                    </div>
                                  </Form.Group>
                                </div>
                                {mostrarBuscarCampanas && (
                                  <div className="col-md-12">
                                    <Form.Group>
                                      <div className="search-field col-sm-12">
                                        <form
                                          className="d-flex align-items-center h-100"
                                          onSubmit={buscarCampanasCadena}
                                        >
                                          <div className="input-group">
                                            <div className="input-group-prepend bg-white">
                                              <i className="input-group-text border-0 mdi mdi-magnify"></i>
                                            </div>
                                            <input
                                              type="text"
                                              className="form-control bg-white border-0"
                                              placeholder="Descripción"
                                              value={campanaCadena}
                                              onChange={({ target }) =>
                                                setCampanaCadena(target.value)
                                              }
                                            />
                                          </div>
                                          <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={buscarCampanas}
                                          >
                                            Buscar
                                          </button>
                                        </form>
                                      </div>
                                    </Form.Group>
                                  </div>
                                )}
                              </Form.Group>
                              {mostrarBuscarCampanas && (
                                <Form.Group className="row">
                                  <div className="col-sm-12">
                                    <div className="table-responsive">
                                      {mostrarTablaCampanas && (
                                        <table className="table">
                                          <thead>
                                            <tr>
                                              <th>Descripción</th>
                                              <th>Tipo</th>
                                              <th>Estado</th>
                                              <th></th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {campanasBusqueda.map((campana) => (
                                              <tr key={campana["id"]}>
                                                <td>
                                                  {campana["descripcion"]}
                                                </td>
                                                <td>{campana["tipo"]}</td>
                                                <td>{campana["estado"]}</td>
                                                <td>
                                                  <button
                                                    type="button"
                                                    onClick={handleAsignarCampana(
                                                      campana["id"],
                                                      campana["descripcion"],
                                                      campana["tipo"],
                                                      campana["estado"]
                                                    )}
                                                  >
                                                    <i
                                                      className="mdi mdi-plus"
                                                      style={{ color: "black" }}
                                                    ></i>
                                                  </button>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      )}
                                    </div>
                                  </div>
                                </Form.Group>
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  Tipo
                                </label>
                                <div className="col-sm-12">
                                  <select
                                    className="form-control"
                                    value={tipo}
                                    onChange={handleChangeTipoRecurso}
                                  >
                                    <option value={"0"} selected>
                                      Correo
                                    </option>
                                    <option value={"1"}>Publicación</option>
                                    <option value={"2"}>Página web</option>
                                  </select>
                                </div>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  Presupuesto
                                </label>
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="number"
                                    value={presupuesto}
                                    onChange={({ target }) =>
                                      setPresupuesto(target.value)
                                    }
                                  />
                                </div>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  Inicio de vigencia
                                </label>
                                <div className="col-sm-12">
                                  <div className="customDatePickerWidth">
                                    <DatePicker
                                      className="form-control w-100"
                                      selected={inicioVigencia}
                                      onChange={handleChangeInicioVigencia}
                                      dateFormat="dd/MM/yyyy"
                                    />
                                  </div>
                                </div>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  Fin de vigencia
                                </label>
                                <div className="col-sm-12">
                                  <div className="customDatePickerWidth">
                                    <DatePicker
                                      className="form-control w-100"
                                      selected={finVigencia}
                                      onChange={handleChangeFinVigencia}
                                      dateFormat="dd/MM/yyyy"
                                    />
                                  </div>
                                </div>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  Indicadores
                                </label>
                              </Form.Group>
                              {indicadores.length == 0 ? (
                                <Form.Group>
                                  <label className="col-sm-12 col-form-label">
                                    No se han registrado indicadores
                                  </label>
                                </Form.Group>
                              ) : (
                                <Form.Group>
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>Nombre</th>
                                          <th>Aspecto-Tipo</th>
                                          <th>Automatización</th>
                                          <th>Valor</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {indicadores.map((indicador) => (
                                          <tr key={indicador["id"]}>
                                            <td>{indicador["nombre"]}</td>
                                            <td>
                                              {indicador["aspecto"] +
                                                " - " +
                                                indicador["tipo"]}
                                            </td>
                                            <td>
                                              {indicador["calculoAutomatico"]}
                                            </td>
                                            <td>
                                              <input
                                                type={"number"}
                                                placeholder="Agregar valor"
                                                className="form-control"
                                                onChange={(event) =>
                                                  handleValorIndicadores(
                                                    event,
                                                    indicador["id"]
                                                  )
                                                }
                                                value={indicador["valor"]}
                                              />
                                            </td>
                                            <td>
                                              <button
                                                style={{ marginLeft: "auto" }}
                                                type="button"
                                              >
                                                <i
                                                  className="mdi mdi-delete"
                                                  style={{ color: "black" }}
                                                  onClick={handleEliminarIndicadores(
                                                    indicador["id"]
                                                  )}
                                                ></i>
                                              </button>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </Form.Group>
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <Form.Group>
                                <div className="search-field col-sm-12">
                                  <form
                                    className="d-flex align-items-center h-100"
                                    onSubmit={buscarIndicadoresCadena}
                                  >
                                    <div className="input-group">
                                      <div className="input-group-prepend bg-white">
                                        <i className="input-group-text border-0 mdi mdi-magnify"></i>
                                      </div>
                                      <input
                                        type="text"
                                        className="form-control bg-white border-0"
                                        placeholder="Nombre"
                                        value={indicadorCadena}
                                        onChange={({ target }) =>
                                          setIndicadorCadena(target.value)
                                        }
                                      />
                                    </div>
                                  </form>
                                </div>
                              </Form.Group>
                            </div>

                            <div className="col-md-3">
                              <Form.Group>
                                <select
                                  className="form-control col-sm-11"
                                  onChange={handleChangeAspectoVariable}
                                >
                                  <option value="" disabled selected hidden>
                                    Aspecto
                                  </option>
                                  <option value={""}>Todos los aspectos</option>
                                  <option value={"0"}>Plan</option>
                                  <option value={"1"}>Estrategia</option>
                                  <option value={"2"}>Campaña</option>
                                  <option value={"3"}>Recurso</option>
                                </select>
                              </Form.Group>
                            </div>

                            <div className="col-md-2">
                              <Form.Group>
                                <select
                                  className="form-control col-sm-11"
                                  onChange={({ target }) =>
                                    setTipoIndicador(target.value)
                                  }
                                >
                                  {opcionesTipoVariable.map(
                                    ({ id, nombre }) => (
                                      <option value={id}>{nombre}</option>
                                    )
                                  )}
                                </select>
                              </Form.Group>
                            </div>

                            <div className="col-md-1">
                              <Form.Group>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={buscarIndicadores}
                                >
                                  Buscar
                                </button>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                {mostrarCargaIndicadores && (
                                  <div className="row h-100">
                                    <div className="col-sm-12 my-auto">
                                      <div className="circle-loader"></div>
                                    </div>
                                  </div>
                                )}
                                {mostrarTablaIndicadores && (
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>Nombre</th>
                                          <th>Aspecto-Tipo</th>
                                          <th>Automatización</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {indicadoresBusqueda.map(
                                          (indicador) => (
                                            <tr key={indicador["id"]}>
                                              <td>{indicador["nombre"]}</td>
                                              <td>
                                                {indicador["aspecto"] +
                                                  " - " +
                                                  indicador["tipo"]}
                                              </td>
                                              <td>
                                                {indicador["calculoAutomatico"]}
                                              </td>
                                              <td>
                                                <button
                                                  type="button"
                                                  onClick={handleAgregarIndicadores(
                                                    indicador["id"],
                                                    indicador["nombre"],
                                                    indicador["aspecto"],
                                                    indicador["tipo"],
                                                    indicador[
                                                      "calculoAutomatico"
                                                    ]
                                                  )}
                                                >
                                                  <i
                                                    className="mdi mdi-plus"
                                                    style={{ color: "black" }}
                                                  ></i>
                                                </button>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() =>
                                  history.push({
                                    pathname: "/tacticas",
                                  })
                                }
                              >
                                Salir
                              </button>
                            </div>
                            <div className="col-md-6">
                              <button
                                type="button"
                                className="btn btn-primary float-sm-right"
                                onClick={handleNext}
                              >
                                Siguiente
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}

                    {step == 2 && (
                      <div>
                        <div className="row">
                          <div className="col-md-6">
                            <Form.Group className="pt-3">
                              <label
                                className="col-sm-12 font-weight-bold"
                                style={{ color: "#A2A9B0" }}
                              >
                                1. Datos del recurso
                              </label>
                              <label
                                className="col-sm-12"
                                style={{ color: "#A2A9B0" }}
                              >
                                Ingrese los datos del recurso
                              </label>
                            </Form.Group>
                          </div>
                          <div className="col-md-6 border-top border-4 border-secondary">
                            <Form.Group className="pt-3">
                              <label className="col-sm-12 font-weight-bold">
                                2. Contenido del recurso
                              </label>
                              <label className="col-sm-12">
                                Configure el contenido del recurso
                              </label>
                            </Form.Group>
                          </div>
                        </div>
                        <div className="row">
                          <h4 className="card-title col-md-8">
                            Contenido del recurso
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
                          <div className="justify-content-between align-items-center tab-transparent">
                            <Tabs
                              defaultActiveKey="Configuracion"
                              className="nav"
                            >
                              <Tab
                                eventKey="Configuracion"
                                title="Configuración"
                              >
                                <div className="row">
                                  <div className="col-md-12">
                                    <Form.Group>
                                      <label className="col-sm-12 col-form-label">
                                        Correo del remitente <code>*</code>
                                      </label>
                                      <div className="col-sm-12">
                                        <select
                                          className="form-control"
                                          value={remitenteCorreo}
                                          onChange={handleChangeRemitente}
                                        >
                                          <option
                                            value={""}
                                            disabled
                                            selected
                                            hidden
                                          >
                                            Seleccione un correo
                                          </option>
                                          {correosUsuario.map(
                                            ({ direccion }) => (
                                              <option value={direccion}>
                                                {direccion}
                                              </option>
                                            )
                                          )}
                                        </select>
                                      </div>
                                    </Form.Group>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-6">
                                    <Form.Group>
                                      <label className="col-sm-12 col-form-label">
                                        Fecha de publicación <code>*</code>
                                      </label>
                                      <div className="col-sm-12">
                                        <div className="customDatePickerWidth">
                                          <DatePicker
                                            className="form-control w-100"
                                            selected={fechaPublicacionCorreo}
                                            onChange={(date) =>
                                              setFechaPublicacionCorreo(date)
                                            }
                                            dateFormat="dd/MM/yyyy"
                                          />
                                        </div>
                                      </div>
                                    </Form.Group>
                                  </div>
                                  <div className="col-md-6">
                                    <Form.Group>
                                      <label className="col-sm-12 col-form-label">
                                        Hora de publicación <code>*</code>
                                      </label>
                                      <div className="col-sm-12">
                                        <Form.Control
                                          type="time"
                                          value={horaPublicacionCorreo}
                                          onChange={({ target }) =>
                                            setHoraPublicacionCorreo(
                                              target.value
                                            )
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
                                        Asunto <code>*</code>
                                      </label>
                                      <div className="col-sm-12">
                                        <Form.Control
                                          type="text"
                                          value={asuntoCorreo}
                                          onChange={({ target }) =>
                                            setAsuntoCorreo(target.value)
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
                                        Destinatarios
                                      </label>
                                    </Form.Group>
                                    {contactos.length == 0 ? (
                                      <Form.Group>
                                        <label className="col-sm-12 col-form-label">
                                          No se han registrado destinatarios
                                        </label>
                                      </Form.Group>
                                    ) : (
                                      <Form.Group>
                                        <div className="table-responsive">
                                          <table className="table">
                                            <thead>
                                              <tr>
                                                <th>Correo</th>
                                                <th>Nombre completo</th>
                                                <th>Empresa</th>
                                                <th></th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {contactos.map((contacto) => (
                                                <tr key={contacto["id"]}>
                                                  <td>{contacto["correo"]}</td>
                                                  <td>
                                                    {contacto["nombreCompleto"]}
                                                  </td>
                                                  <td>{contacto["empresa"]}</td>
                                                  <td>
                                                    <button
                                                      style={{
                                                        marginLeft: "auto",
                                                      }}
                                                      type="button"
                                                    >
                                                      <i
                                                        className="mdi mdi-delete"
                                                        style={{
                                                          color: "black",
                                                        }}
                                                        onClick={handleEliminarContactos(
                                                          contacto["id"]
                                                        )}
                                                      ></i>
                                                    </button>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </Form.Group>
                                    )}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-11">
                                    <Form.Group>
                                      <div className="search-field col-sm-7">
                                        <form
                                          className="d-flex align-items-center h-100"
                                          onSubmit={buscarContactosCadena}
                                        >
                                          <div className="input-group">
                                            <div className="input-group-prepend bg-white">
                                              <i className="input-group-text border-0 mdi mdi-magnify"></i>
                                            </div>
                                            <input
                                              type="text"
                                              className="form-control bg-white border-0"
                                              placeholder="Nombres, apellidos o correo"
                                              value={contactoCadena}
                                              onChange={({ target }) =>
                                                setContactoCadena(target.value)
                                              }
                                            />
                                          </div>
                                        </form>
                                      </div>
                                    </Form.Group>
                                  </div>
                                  <div className="col-md-1">
                                    <Form.Group>
                                      <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={buscarContactos}
                                      >
                                        Buscar
                                      </button>
                                    </Form.Group>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-12">
                                    <Form.Group>
                                      {mostrarCargaContactos && (
                                        <div className="row h-100">
                                          <div className="col-sm-12 my-auto">
                                            <div className="circle-loader"></div>
                                          </div>
                                        </div>
                                      )}
                                      {mostrarTablaContactos && (
                                        <div className="table-responsive">
                                          <table className="table">
                                            <thead>
                                              <tr>
                                                <th>Correo</th>
                                                <th>Nombre completo</th>
                                                <th>Empresa</th>
                                                <th></th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {contactosBusqueda.map(
                                                (contacto) => (
                                                  <tr key={contacto["id"]}>
                                                    <td>
                                                      {contacto["correo"]}
                                                    </td>
                                                    <td>
                                                      {
                                                        contacto[
                                                          "persona__nombreCompleto"
                                                        ]
                                                      }
                                                    </td>
                                                    <td>
                                                      {contacto["empresa"]}
                                                    </td>
                                                    <td>
                                                      <button
                                                        type="button"
                                                        onClick={handleAgregarContactos(
                                                          contacto["id"],
                                                          contacto["correo"],
                                                          contacto[
                                                            "persona__nombreCompleto"
                                                          ],
                                                          contacto["empresa"]
                                                        )}
                                                      >
                                                        <i
                                                          className="mdi mdi-plus"
                                                          style={{
                                                            color: "black",
                                                          }}
                                                        ></i>
                                                      </button>
                                                    </td>
                                                  </tr>
                                                )
                                              )}
                                            </tbody>
                                          </table>
                                        </div>
                                      )}
                                    </Form.Group>
                                  </div>
                                </div>
                              </Tab>
                              <Tab eventKey="Contenido" title="Contenido">
                                <div className="row">
                                  <div className="col-md-12">
                                    <Form.Group>
                                      <label className="col-sm-12 col-form-label">
                                        Contenido del correo<code>*</code>
                                      </label>
                                      <div className="col-sm-12">
                                        <LandingPageEditor
                                          emailEditorRef={emailEditorRef}
                                          contenidoCorreo={contenidoCorreo}
                                          setContenidoCorreo={
                                            setContenidoCorreo
                                          }
                                        />
                                      </div>
                                    </Form.Group>
                                  </div>
                                </div>
                              </Tab>
                            </Tabs>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={handlePrevious}
                              >
                                Volver
                              </button>
                            </div>
                            <div className="col-md-6">
                              <button
                                type="button"
                                className="btn btn-primary float-sm-right"
                                onClick={handleShow}
                              >
                                Guardar
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                    {step == 3 && (
                      <div>
                        <div className="row">
                          <div className="col-md-6">
                            <Form.Group className="pt-3">
                              <label
                                className="col-sm-12 font-weight-bold"
                                style={{ color: "#A2A9B0" }}
                              >
                                1. Datos del recurso
                              </label>
                              <label
                                className="col-sm-12"
                                style={{ color: "#A2A9B0" }}
                              >
                                Ingrese los datos del recurso
                              </label>
                            </Form.Group>
                          </div>
                          <div className="col-md-6 border-top border-4 border-secondary">
                            <Form.Group className="pt-3">
                              <label className="col-sm-12 font-weight-bold">
                                2. Contenido del recurso
                              </label>
                              <label className="col-sm-12">
                                Configure el contenido del recurso
                              </label>
                            </Form.Group>
                          </div>
                        </div>
                        <div className="row">
                          <h4 className="card-title col-md-8">
                            Contenido del recurso
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
                            <div className="col-md-6">
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  Red social
                                </label>
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="text"
                                    value={servicioRedSocial}
                                    //onChange={({ target }) =>
                                    //  setPresupuesto(target.value)
                                    //}
                                  />
                                </div>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  Usuario de red social
                                </label>
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="text"
                                    value={usuarioRedSocial}
                                    //onChange={({ target }) =>
                                    //  setPresupuesto(target.value)
                                    //}
                                  />
                                </div>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  Fecha de publicación
                                </label>
                                <div className="col-sm-12">
                                  <div className="customDatePickerWidth">
                                    <DatePicker
                                      className="form-control w-100"
                                      selected={fechaPublicacionRedSocial}
                                      onChange={(date) =>
                                        setFechaPublicacionRedSocial(date)
                                      }
                                      dateFormat="dd/MM/yyyy"
                                    />
                                  </div>
                                </div>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  Hora de publicación
                                </label>
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="time"
                                    value={horaPublicacionRedSocial}
                                    //onChange={({ target }) =>
                                    //  setPresupuesto(target.value)
                                    //}
                                  />
                                </div>
                              </Form.Group>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  Audiencia <code>*</code>
                                </label>
                                <div className="col-sm-12">
                                  <select
                                    className="form-control"
                                    onChange={({ target }) =>
                                      setAudienciaRedSocial(target.value)
                                    }
                                  >
                                    <option value={"0"} selected>
                                      Público en general
                                    </option>
                                    <option value={"1"}>Seguidores</option>
                                  </select>
                                </div>
                              </Form.Group>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  Contenido de la publicación<code>*</code>
                                </label>
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="text"
                                    //value={descripcion}
                                    //onChange={({ target }) =>
                                    //  setDescripcion(target.value)
                                    //}
                                  />
                                </div>
                              </Form.Group>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={handlePrevious}
                              >
                                Volver
                              </button>
                            </div>
                            <div className="col-md-6">
                              <button
                                type="button"
                                className="btn btn-primary float-sm-right"
                                onClick={handleShow}
                              >
                                Guardar
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                    {step == 4 && (
                      <div>
                        <div className="row">
                          <div className="col-md-6">
                            <Form.Group className="pt-3">
                              <label
                                className="col-sm-12 font-weight-bold"
                                style={{ color: "#A2A9B0" }}
                              >
                                1. Datos del recurso
                              </label>
                              <label
                                className="col-sm-12"
                                style={{ color: "#A2A9B0" }}
                              >
                                Ingrese los datos del recurso
                              </label>
                            </Form.Group>
                          </div>
                          <div className="col-md-6 border-top border-4 border-secondary">
                            <Form.Group className="pt-3">
                              <label className="col-sm-12 font-weight-bold">
                                2. Contenido del recurso
                              </label>
                              <label className="col-sm-12">
                                Configure el contenido del recurso
                              </label>
                            </Form.Group>
                          </div>
                        </div>
                        <div className="row">
                          <h4 className="card-title col-md-8">
                            Contenido del recurso
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
                          <div className="justify-content-between align-items-center tab-transparent">
                            <Tabs
                              defaultActiveKey="Configuracion"
                              className="nav"
                            >
                              <Tab
                                eventKey="Configuracion"
                                title="Configuración"
                              >
                                <div className="row">
                                  <div className="col-md-12">
                                    <Form.Group>
                                      <label className="col-sm-12 col-form-label">
                                        Título de la página
                                      </label>
                                      <div className="col-sm-12">
                                        <Form.Control
                                          type="text"
                                          value={titulo}
                                          onChange={({ target }) =>
                                            setTitulo(target.value)
                                          }
                                        />
                                      </div>
                                    </Form.Group>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-6">
                                    <Form.Group>
                                      <label className="col-sm-12 col-form-label">
                                        Dominio de URL <code>*</code>
                                      </label>
                                      <div className="col-sm-12">
                                        <Form.Control
                                          type="text"
                                          value={dominio}
                                          onChange={({ target }) =>
                                            setDominio(target.value)
                                          }
                                        />
                                      </div>
                                    </Form.Group>
                                  </div>
                                  <div className="col-md-6">
                                    <Form.Group>
                                      <label className="col-sm-12 col-form-label">
                                        Complemento de URL
                                      </label>
                                      <div className="col-sm-12">
                                        <Form.Control
                                          type="text"
                                          value={complementoDominio}
                                          onChange={({ target }) =>
                                            setComplementoDominio(target.value)
                                          }
                                        />
                                      </div>
                                    </Form.Group>
                                  </div>
                                </div>
                              </Tab>
                              <Tab eventKey="Contenido" title="Contenido">
                                <div className="row">
                                  <div className="col-md-12">
                                    <Form.Group>
                                      <label className="col-sm-12 col-form-label">
                                        Contenido de la página<code>*</code>
                                      </label>
                                      <div className="col-sm-12">
                                        <LandingPageEditor
                                          emailEditorRef={landingEditorRef}
                                          contenidoCorreo={contenidoLanding}
                                          setContenidoCorreo={
                                            setContenidoLanding
                                          }
                                        />
                                      </div>
                                    </Form.Group>
                                  </div>
                                </div>
                              </Tab>
                            </Tabs>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={handlePrevious}
                              >
                                Volver
                              </button>
                            </div>
                            <div className="col-md-6">
                              <button
                                type="button"
                                className="btn btn-primary float-sm-right"
                                onClick={handleShow}
                              >
                                Guardar
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                <h4 className="card-title" style={{ color: "#000000" }}>
                  Guardar recurso
                </h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5 className="card-title" style={{ color: "#000000" }}>
                ¿Desea guardar el recurso?
              </h5>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-outline-primary" onClick={handleClose}>
                Cancelar
              </button>

              <button className="btn btn-primary" onClick={guardarRecurso}>
                Guardar
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default CrearRecurso;
