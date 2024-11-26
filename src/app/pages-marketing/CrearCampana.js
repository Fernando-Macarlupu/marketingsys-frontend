import React, { useEffect, useState } from "react";
import { Tabs, Tab, Form, FormGroup, Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import bsCustomFileInput from "bs-custom-file-input";

const CrearCampana = () => {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [mostrarCargaDatos, setMostrarCargaDatos] = useState(false);
  const [mostrarDatos, setMostrarDatos] = useState(true);
  const [mostrarListaDetalle, setMostrarListaDetalle] = useState(false);
  const [mostrarBuscarListas, setMostrarBuscarListas] = useState(false);
  const [mostrarBuscarRecursos, setMostrarBuscarRecursos] = useState(false);

  const [mostrarBuscarIndicadores, setMostrarBuscarIndicadores] =
    useState(false);

  const [mostrarTablaIndicadores, setMostrarTablaIndicadores] = useState(false);
  const [mostrarCargaIndicadores, setMostrarCargaIndicadores] = useState(false);

  const [propietario, setPropietario] = useState(0);

  const [descripcion, setDescripcion] = useState("");
  const [sponsor, setSponsor] = useState("");
  const [presupuesto, setPresupuesto] = useState(0.0);
  const [tipo, setTipo] = useState("0");
  const [mostrarBuscarPlanes, setMostrarBuscarPlanes] = useState(false);
  const [plan, setPlan] = useState({ id: 0, descripcion: "" });
  const [planCadena, setPlanCadena] = useState("");
  const [mostrarTablaPlanes, setMostrarTablaPlanes] = useState(false);
  const [planesBusqueda, setPlanesBusqueda] = useState([]);

  const [mostrarBuscarEstrategias, setMostrarBuscarEstrategias] =
    useState(false);
  const [estrategia, setEstrategia] = useState({ id: 0, descripcion: "" });
  const [estrategiaCadena, setEstrategiaCadena] = useState("");
  const [mostrarTablaEstrategias, setMostrarTablaEstrategias] = useState(false);
  const [mostrarCargaEstrategias, setMostrarCargaEstrategias] = useState(false);
  const [estrategiasBusqueda, setEstrategiasBusqueda] = useState([]);

  const [inicioVigencia, setInicioVigencia] = useState(null);
  const [finVigencia, setFinVigencia] = useState(null);

  const [indicadorCadena, setIndicadorCadena] = useState("");
  const [aspectoIndicador, setAspectoIndicador] = useState("");
  const [tipoIndicador, setTipoIndicador] = useState("2");
  const [indicadores, setIndicadores] = useState([]);
  const [indicadoresBusqueda, setIndicadoresBusqueda] = useState([]);

  const [estrategiaTipo, setEstrategiaTipo] = useState("");
  const [estrategiaEstado, setEstrategiaEstado] = useState("");
  const [estrategias, setEstrategias] = useState([]);

  const [listaCadena, setListaCadena] = useState("");
  const [listaId, setListaId] = useState(0);
  const [listaFiltros, setListaFiltros] = useState([]);
  const [listaFiltrosBusqueda, setListaFiltrosBusqueda] = useState([]);
  const [listaElementos, setListaElementos] = useState([]);
  const [listaIdBusqueda, setListaIdBusqueda] = useState(0);
  const [listaElementosBusqueda, setListaElementosBusqueda] = useState([]);
  const [listasBusqueda, setListasBusqueda] = useState([]);
  const [mostrarTablaListas, setMostrarTablaListas] = useState(false);
  const [mostrarCargaListas, setMostrarCargaListas] = useState(false);

  const [recursoCadena, setRecursoCadena] = useState("");
  const [recursoTipo, setRecursoTipo] = useState("");
  const [recursoEstado, setRecursoEstado] = useState("");
  const [recursos, setRecursos] = useState([]);
  const [recursosBusqueda, setRecursosBusqueda] = useState([]);
  const [mostrarTablaRecursos, setMostrarTablaRecursos] = useState(false);
  const [mostrarCargaRecursos, setMostrarCargaRecursos] = useState(false);

  const [contactos, setContactos] = useState([]);
  const [cadenaBuscarContacto, setCadenaBuscarContacto] = useState("");
  const [contactosBusqueda, setContactosBusqueda] = useState([]);
  const [mostrarTablaContactos, setMostrarTablaContactos] = useState(false);
  const [mostrarCargaContactos, setMostrarCargaContactos] = useState(false);
  const [mostrarBuscarParticipantes, setMostrarBuscarParticipantes] =
    useState(false);

  const [usuarioLogueado, setUsuarioLogueado] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (descripcion == "") alert("Ingrese la descripción de la campaña");
    else {
      if(inicioVigencia==null || finVigencia==null) alert("Ingrese las fechas de inicio y fin de vigencia de la campaña");
      else{setShow(true);}
    }
  };

  const mostrarIndicadorTipo = (tipo) => {
    if (tipo == "0") return "Plan";
    else if (tipo == "1") return "Programa";
    else if (tipo == "2") return "Campaña stand-alone";
    else if (tipo == "3") return "Campaña de programa";
    else if (tipo == "4") return "Correo";
    else if (tipo == "5") return "Publicación";
    else if (tipo == "6") return "Página web";
  };

  const handleChangeInicioVigencia = (date) => setInicioVigencia(date);
  const handleChangeFinVigencia = (date) => setFinVigencia(date);

  const handleBuscarPlanes = () => setMostrarBuscarPlanes(!mostrarBuscarPlanes);

  const buscarPlanes = () => {
    //console.log("esto es la cadena")

    let fechaHoy = "",
      fecha = new Date();

    fechaHoy =
      fecha.getDate() +
      "-" +
      parseInt(fecha.getMonth() + 1) +
      "-" +
      fecha.getFullYear();
    setMostrarTablaPlanes(true);
    api
      .post("filtrarPlanes", {
        cadena: planCadena,
        estado: "",
        fechaHoy: fechaHoy,
        fechaVigenciaIni: "",
        fechaVigenciaFin: "",
        propietario: usuarioLogueado["idCuenta"],
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setPlanesBusqueda(data);
      })
      .catch((err) => alert(err));
  };

  const buscarPlanesCadena = (event) => {
    event.preventDefault();
    buscarPlanes();
  };

  const handleAsignarPlan = (id, descripcion, estado) => () => {
    setPlan({ id: id, descripcion: descripcion, estado: estado });
    //console.log(event.target.value);
  };

  const handleBuscarEstrategias = () =>
    setMostrarBuscarEstrategias(!mostrarBuscarEstrategias);

  const buscarEstrategias = () => {
    //console.log("esto es la cadena")

    let fechaHoy = "",
      fecha = new Date();

    fechaHoy =
      fecha.getDate() +
      "-" +
      parseInt(fecha.getMonth() + 1) +
      "-" +
      fecha.getFullYear();
    setMostrarTablaEstrategias(false);
    setMostrarCargaEstrategias(true);
    api
      .post("filtrarEstrategias", {
        cadena: estrategiaCadena,
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
        setEstrategiasBusqueda(data);
        setMostrarCargaEstrategias(false);
        setMostrarTablaEstrategias(true);
      })
      .catch((err) => alert(err));
  };

  const buscarEstrategiasCadena = (event) => {
    event.preventDefault();
    buscarEstrategias();
  };

  const handleAsignarEstrategia = (id, descripcion, estado, tipo) => () => {
    setEstrategia({
      id: id,
      descripcion: descripcion,
      estado: estado,
      tipo: tipo,
    });
    //console.log(event.target.value);
  };

  const buscarListas = () => {
    //console.log("esto es la cadena")
    setMostrarTablaListas(false);
    setMostrarCargaListas(true);
    api
      .post("filtrarListas", {
        cadena: listaCadena,
        tipo: "",
        objeto: "0",
        fechaCreacionIni: "",
        fechaCreacionFin: "",
        fechaModificacionIni: "",
        fechaModificacionFin: "",
        propietario: usuarioLogueado["idCuenta"],
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setListasBusqueda(data);
        setMostrarCargaListas(false);
        setMostrarTablaListas(true);
      })
      .catch((err) => alert(err));
  };

  const buscarListasCadena = (event) => {
    event.preventDefault();
    buscarListas();
  };

  const handleAsignarLista = () => {
    setListaId(listaIdBusqueda);
    setListaFiltros(listaFiltrosBusqueda);
    setListaElementos(listaElementosBusqueda);
    setMostrarListaDetalle(false);
  };

  const asignarTargetParticipantes = () => {
    const contactosLista = [];
    const idsParticipantes = [];
    for (let index = 0; index < contactos.length; index++) {
      const element = contactos[index];
      idsParticipantes.push(element["id"]);
      contactosLista.push(element);
    }
    for (let index = 0; index < listaElementos.length; index++) {
      const element = listaElementos[index];
      if (!idsParticipantes.includes(element["id"])) {
        contactosLista.push(element);
      }
    }
    setContactos(contactosLista);
  };

  const handleVerDetalleLista = (id) => () => {
    console.log("hizo el ver detalle");
    api
      .get(`detalleLista/${id}`)
      .then((res) => res.data)
      .then((data) => {
        console.log("finalizo el ver detalle");
        console.log(data);
        setListaIdBusqueda(id);
        setListaFiltrosBusqueda(data["filtros"]);
        setListaElementosBusqueda(data["elementos"]);
        setMostrarListaDetalle(true);
      })
      .catch((err) => alert(err));
  };

  const handleEliminarLeads = (id) => () => {
    console.log("se va a eliminar");
    setListaElementos((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
  };

  const mostrarFiltros = (propiedad, evaluacion, valorEvaluacion, nombre) => {
    let respuesta = "";
    respuesta += nombre + " - ";
    if (evaluacion == "0") respuesta += "Igual - ";
    else if (evaluacion == "1") respuesta += "Menor - ";
    else if (evaluacion == "2") respuesta += "Mayor - ";
    else if (evaluacion == "3") respuesta += "Menor o igual - ";
    else if (evaluacion == "4") respuesta += "Mayor o igual - ";
    else if (evaluacion == "5") respuesta += "Contiene - ";

    if (
      propiedad == "calificado" ||
      propiedad == "empresa" ||
      propiedad == "contacto"
    ) {
      if (valorEvaluacion == "0") respuesta += "No";
      else respuesta += "Sí";
    } else if (propiedad == "estado") {
      if (valorEvaluacion == "0") respuesta += "Suscriptor";
      else if (valorEvaluacion == "1") respuesta += "Lead";
      else if (valorEvaluacion == "2") respuesta += "Oportunidad";
      else if (valorEvaluacion == "3") respuesta += "Cliente";
    } else if (propiedad == "tipo") {
      if (valorEvaluacion == "0") respuesta += "Cliente potencial";
      else if (valorEvaluacion == "1") respuesta += "Socio";
      else if (valorEvaluacion == "2") respuesta += "Revendedor";
      else if (valorEvaluacion == "3") respuesta += "Proveedor";
    } else if (propiedad == "servicioRed") {
      if (valorEvaluacion == "0") respuesta += "Facebook";
      else if (valorEvaluacion == "1") respuesta += "Linkedin";
      else if (valorEvaluacion == "2") respuesta += "Instagram";
    } else {
      respuesta += valorEvaluacion;
    }
    return respuesta;
    //console.log(event.target.value);
  };

  const handleAgregarIndicadores =
    (id, nombre, tipo, calculoAutomatico) => () => {
      for (let index = 0; index < indicadores.length; index++) {
        const element = indicadores[index];
        if (element["id"] == id) return;
      }
      setIndicadores([
        ...indicadores,
        {
          id: id,
          nombre: nombre,
          tipo: tipo,
          calculoAutomatico: calculoAutomatico,
          valor: 0.0,
        },
      ]);
    };

  const handleValorIndicadores = (id, event) => {
    const indicadoresLista = [];
    console.log(id);
    for (let index = 0; index < indicadores.length; index++) {
      const element = indicadores[index];
      if (element["id"] == id) element["valor"] = event.target.value;
      indicadoresLista.push(element);
    }
    console.log(indicadoresLista);
    setIndicadores(indicadoresLista);
  };

  const handleEliminarIndicadores = (id) => () => {
    console.log("se va a eliminar");
    setIndicadores((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
  };

  const handleAgregarRecursos = (id, descripcion, tipo, estado) => () => {
    for (let index = 0; index < recursos.length; index++) {
      const element = recursos[index];
      if (element["id"] == id) return;
    }
    setRecursos([
      ...recursos,
      {
        id: id,
        descripcion: descripcion,
        tipo: tipo,
        estado: estado,
      },
    ]);
  };

  const handleEliminarRecursos = (id) => () => {
    console.log("se va a eliminar");
    setRecursos((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
  };

  const handleChangeTipoEstrategia = (event) => {
    setTipo(event.target.value);
  };

  const buscarIndicadores = () => {
    //console.log("esto es la cadena")
    // let tipoBusqueda = "";
    // if (tipoIndicador != "") {
    //   if (aspectoIndicador == "1" && tipoIndicador == "0")
    //     tipoBusqueda = "0"; //programa
    //   else if (aspectoIndicador == "1" && tipoIndicador == "1")
    //     tipoBusqueda = "1"; //campaña stand-alone
    //   else if (aspectoIndicador == "2" && tipoIndicador == "0")
    //     tipoBusqueda = "2"; //campaña de programa
    //   else if (aspectoIndicador == "2" && tipoIndicador == "1")
    //     tipoBusqueda = "3"; //campaña stand-alone
    //   else if (aspectoIndicador == "3" && tipoIndicador == "0")
    //     tipoBusqueda = "4"; //correo
    //   else if (aspectoIndicador == "3" && tipoIndicador == "1")
    //     tipoBusqueda = "5"; //publicacion
    //   else if (aspectoIndicador == "3" && tipoIndicador == "2")
    //     tipoBusqueda = "6"; //pagina web
    //}
    setMostrarTablaIndicadores(false);
    setMostrarCargaIndicadores(true);
    api
      .post("filtrarIndicadores", {
        cadena: indicadorCadena,
        tipo: tipoIndicador,
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

  const buscarRecursos = () => {
    //console.log("esto es la cadena")
    let fechaHoy = "",
      fecha = new Date();

    fechaHoy =
      fecha.getDate() +
      "-" +
      parseInt(fecha.getMonth() + 1) +
      "-" +
      fecha.getFullYear();
    setMostrarTablaRecursos(false);
    setMostrarCargaRecursos(true);
    api
      .post("filtrarRecursos", {
        cadena: recursoCadena,
        tipo: recursoTipo,
        estado: recursoEstado,
        fechaHoy: fechaHoy,
        fechaVigenciaIni: "",
        fechaVigenciaFin: "",
        propietario: usuarioLogueado["idCuenta"],
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setRecursosBusqueda(data);
        setMostrarCargaRecursos(false);
        setMostrarTablaRecursos(true);
      })
      .catch((err) => alert(err));
  };

  const buscarRecursosCadena = (event) => {
    event.preventDefault();
    buscarRecursos();
  };

  const guardarCampana = () => {
    let fechaVigenciaIni = "",
      fechaVigenciaFin = "";

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
      idCampana: 0,
      idEstrategia: estrategia.id,
      idPlan: plan.id,
      tipo: tipo, //0: de programa, 1: stand-alone
      descripcion: descripcion,
      sponsor: sponsor,
      presupuesto: presupuesto,
      inicioVigencia: fechaVigenciaIni,
      finVigencia: fechaVigenciaFin,
      estado: "",
      propietario: usuarioLogueado["idCuenta"],
      indicadores: indicadores,
      estrategias: estrategias,
      leads: listaId,
      contactos: contactos,
      recursos: recursos,
    };
    console.log("cuerpo a subir");
    console.log(cuerpo);
    //setShow(false);
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .post("registrarCampana", cuerpo)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCargaDatos(false);
        setMostrarDatos(true);
        setShow(false);
        history.push({
          pathname: "/tacticas",
          state: { campanaGuardada: true },
        });
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

  const handleChangeTipoVariable = (event) => {
    setTipoIndicador(event.target.value);
  };

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

  const buscarContactos = () => {
    setMostrarTablaContactos(false);
    setMostrarCargaContactos(true);
    api
      .post("filtrarContactos", {
        cadena: cadenaBuscarContacto,
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

  const handleAgregarContactos = (contacto) => () => {
    for (let index = 0; index < contactos.length; index++) {
      const element = contactos[index];
      if (element["id"] == contacto["id"]) return;
    }
    setContactos([...contactos, contacto]);
  };

  const handleEliminarContactos = (id) => () => {
    setContactos((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
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
              <h3 className="page-title"> Nueva campaña </h3>
            </div>
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <h4 className="card-title col-md-8">Datos de campaña</h4>
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
                        <div className="col-md-6">
                          <Form.Group>
                            <label className="col-sm-12 col-form-label">
                              Tipo
                            </label>
                            <div className="col-sm-12">
                              <select
                              value={tipo}
                                className="form-control"
                                onChange={handleChangeTipoEstrategia}
                              >
                                <option value={"0"} selected>
                                  Campaña de programa
                                </option>
                                <option value={"1"}>Campaña stand-alone</option>
                              </select>
                            </div>
                          </Form.Group>
                        </div>
                        <div className="col-md-6">
                          {tipo == "1" ? (
                            <Form.Group className="row">
                              <label className="col-sm-8 col-form-label">
                                Plan asociado
                              </label>
                              <div className="col-sm-4">
                                <button
                                  type="button"
                                  className="btn btn-link float-sm-right"
                                  onClick={handleBuscarPlanes}
                                >
                                  Buscar planes
                                </button>
                              </div>
                              <div className="col-md-12">
                                <Form.Group>
                                  <div className="col-sm-12">
                                    <Form.Control
                                      type="text"
                                      value={plan.descripcion}
                                    />
                                  </div>
                                </Form.Group>
                              </div>
                              {mostrarBuscarPlanes && (
                                <div className="col-md-12">
                                  <Form.Group>
                                    <div className="search-field col-sm-12">
                                      <form
                                        className="d-flex align-items-center h-100"
                                        onSubmit={buscarPlanesCadena}
                                      >
                                        <div className="input-group">
                                          <div className="input-group-prepend bg-white">
                                            <i className="input-group-text border-0 mdi mdi-magnify"></i>
                                          </div>
                                          <input
                                            type="text"
                                            className="form-control bg-white border-0"
                                            placeholder="Descripción"
                                            value={planCadena}
                                            onChange={({ target }) =>
                                              setPlanCadena(target.value)
                                            }
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={buscarPlanes}
                                        >
                                          Buscar
                                        </button>
                                      </form>
                                    </div>
                                  </Form.Group>
                                </div>
                              )}
                            </Form.Group>
                          ) : (
                            <Form.Group className="row">
                              <label className="col-sm-8 col-form-label">
                                Estrategia asociada
                              </label>
                              <div className="col-sm-4">
                                <button
                                  type="button"
                                  className="btn btn-link float-sm-right"
                                  onClick={handleBuscarEstrategias}
                                >
                                  Buscar estrategias
                                </button>
                              </div>
                              <div className="col-md-12">
                                <Form.Group>
                                  <div className="col-sm-12">
                                    <Form.Control
                                      type="text"
                                      value={estrategia.descripcion}
                                    />
                                  </div>
                                </Form.Group>
                              </div>
                              {mostrarBuscarEstrategias && (
                                <div className="col-md-12">
                                  <Form.Group>
                                    <div className="search-field col-sm-12">
                                      <form
                                        className="d-flex align-items-center h-100"
                                        onSubmit={buscarEstrategiasCadena}
                                      >
                                        <div className="input-group">
                                          <div className="input-group-prepend bg-white">
                                            <i className="input-group-text border-0 mdi mdi-magnify"></i>
                                          </div>
                                          <input
                                            type="text"
                                            className="form-control bg-white border-0"
                                            placeholder="Descripción"
                                            value={estrategiaCadena}
                                            onChange={({ target }) =>
                                              setEstrategiaCadena(target.value)
                                            }
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={buscarEstrategias}
                                        >
                                          Buscar
                                        </button>
                                      </form>
                                    </div>
                                  </Form.Group>
                                </div>
                              )}
                            </Form.Group>
                          )}

                          {mostrarBuscarPlanes && (
                            <Form.Group className="row">
                              <div className="col-sm-12">
                                <div className="table-responsive">
                                  {mostrarTablaPlanes && (
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>Descripción</th>
                                          <th>Estado</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {planesBusqueda.map((estrategia) => (
                                          <tr key={estrategia["id"]}>
                                            <td>{estrategia["descripcion"]}</td>
                                            <td>{estrategia["estado"]}</td>
                                            <td>
                                              <button
                                                type="button"
                                                onClick={handleAsignarPlan(
                                                  estrategia["id"],
                                                  estrategia["descripcion"],
                                                  estrategia["estado"]
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

                          {mostrarBuscarEstrategias && (
                            <Form.Group className="row">
                              <div className="col-sm-12">
                                <div className="table-responsive">
                                  {mostrarTablaEstrategias && (
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
                                        {estrategiasBusqueda.map(
                                          (estrategia) => (
                                            <tr key={estrategia["id"]}>
                                              <td>
                                                {estrategia["descripcion"]}
                                              </td>
                                              <td>{estrategia["tipo"]}</td>
                                              <td>{estrategia["estado"]}</td>
                                              <td>
                                                <button
                                                  type="button"
                                                  onClick={handleAsignarEstrategia(
                                                    estrategia["id"],
                                                    estrategia["descripcion"],
                                                    estrategia["tipo"],
                                                    estrategia["estado"]
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
                              Sponsor
                            </label>
                            <div className="col-sm-12">
                              <Form.Control
                                type="text"
                                value={sponsor}
                                onChange={({ target }) =>
                                  setSponsor(target.value)
                                }
                              />
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
                              Inicio de vigencia <code>*</code>
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
                              Fin de vigencia <code>*</code>
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
                            <label className="col-sm-7 col-form-label">
                              Target
                            </label>
                            <button
                              type="button"
                              className="btn btn-link float-sm-right"
                              onClick={() =>
                                setMostrarBuscarListas(!mostrarBuscarListas)
                              }
                            >
                              Buscar listas
                            </button>
                          </Form.Group>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12">
                          {listaFiltros.length == 0 ? (
                            ""
                          ) : (
                            <Form.Group>
                              <label className="col-sm-12 col-form-label">
                              Características
                              </label>
                              {listaFiltros.map(
                                ({
                                  propiedad,
                                  evaluacion,
                                  valorEvaluacion,
                                  nombre,
                                }) => (
                                  <div
                                    className="row"
                                    key={
                                      propiedad + evaluacion + valorEvaluacion
                                    }
                                  >
                                    <div className="col-md-12">
                                      <Form.Group>
                                        <label
                                          className="col-sm-12"
                                          style={{ display: "flex" }}
                                        >
                                          {mostrarFiltros(
                                            propiedad,
                                            evaluacion,
                                            valorEvaluacion,
                                            nombre
                                          )}
                                        </label>
                                      </Form.Group>
                                    </div>
                                  </div>
                                )
                              )}
                            </Form.Group>
                          )}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12">
                          {listaElementos.length == 0 ? (
                            <Form.Group>
                              <label className="col-sm-12 col-form-label">
                                No se han registrado targets
                              </label>
                            </Form.Group>
                          ) : (
                            <Form.Group>
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Nombre completo</th>
                                      <th>Estado</th>
                                      <th>Correo</th>
                                      <th>Empresa</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {listaElementos.map((elemento) => (
                                      <tr key={elemento["id"]}>
                                        <td>
                                          {elemento["persona__nombreCompleto"]}
                                        </td>
                                        <td>{elemento["estado"]}</td>
                                        <td>{elemento["correo"]}</td>
                                        <td>{elemento["empresa"]}</td>
                                        <td>
                                          <button
                                            style={{ marginLeft: "auto" }}
                                            type="button"
                                          >
                                            <i
                                              className="mdi mdi-delete"
                                              style={{ color: "black" }}
                                              onClick={handleEliminarLeads(
                                                elemento["id"]
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

                      {mostrarBuscarListas && (
                        <div>
                          <div className="row">
                            <div className="col-md-11">
                              <Form.Group>
                                <div className="search-field col-sm-8">
                                  <form
                                    className="d-flex align-items-center h-100"
                                    onSubmit={buscarListasCadena}
                                  >
                                    <div className="input-group">
                                      <div className="input-group-prepend bg-white">
                                        <i className="input-group-text border-0 mdi mdi-magnify"></i>
                                      </div>
                                      <input
                                        type="text"
                                        className="form-control bg-white border-0"
                                        placeholder="Nombre"
                                        value={listaCadena}
                                        onChange={({ target }) =>
                                          setListaCadena(target.value)
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
                                  onClick={buscarListas}
                                >
                                  Buscar
                                </button>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                {mostrarCargaListas && (
                                  <div className="row h-100">
                                    <div className="col-sm-12 my-auto">
                                      <div className="circle-loader"></div>
                                    </div>
                                  </div>
                                )}
                                {mostrarTablaListas && (
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>Nombre</th>
                                          <th>Objeto</th>
                                          <th>Tipo</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {listasBusqueda.map((lista) => (
                                          <tr key={lista["id"]}>
                                            <td>{lista["nombre"]}</td>
                                            <td>{lista["objeto"]}</td>
                                            <td>{lista["tipo"]}</td>
                                            <td>
                                              <button
                                                style={{
                                                  marginLeft: "auto",
                                                }}
                                                type="button"
                                              >
                                                <i
                                                  className="mdi mdi-eye"
                                                  style={{ color: "black" }}
                                                  onClick={handleVerDetalleLista(
                                                    lista["id"]
                                                  )}
                                                ></i>
                                              </button>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="justify-content-between align-items-center tab-transparent">
                        <Tabs defaultActiveKey="Indicadores" className="nav">
                          <Tab eventKey="Indicadores" title="Indicadores">
                            <div className="row">
                              <div className="col-md-12">
                                <Form.Group>
                                  <label className="col-sm-7 col-form-label">
                                    Indicadores
                                  </label>

                                  <button
                                    type="button"
                                    className="btn btn-link float-sm-right"
                                    onClick={() =>
                                      setMostrarBuscarIndicadores(
                                        !mostrarBuscarIndicadores
                                      )
                                    }
                                  >
                                    Buscar indicadores
                                  </button>
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
                                            <th>Tipo</th>
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
                                                {mostrarIndicadorTipo(
                                                  indicador["tipo"]
                                                )}
                                              </td>
                                              <td>
                                                {indicador["calculoAutomatico"]
                                                  ? "Habilitada"
                                                  : "No habilitada"}
                                              </td>
                                              <td>
                                                <input
                                                  type={"number"}
                                                  placeholder="Agregar valor"
                                                  className="form-control"
                                                  disabled={
                                                    indicador[
                                                      "calculoAutomatico"
                                                    ]
                                                  }
                                                  onChange={(e) =>
                                                    handleValorIndicadores(
                                                      indicador["id"],
                                                      e
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
                            {mostrarBuscarIndicadores && (
                              <div>
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

                                  <div className="col-md-5">
                                    <Form.Group>
                                      <select
                                        className="form-control col-sm-11"
                                        onChange={handleChangeTipoVariable}
                                        value={tipoIndicador}
                                      >
                                        <option value={"2"}>
                                          Campaña stand-alone
                                        </option>
                                        <option value={"3"}>
                                          Campaña de programa
                                        </option>
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
                                                <th>Tipo</th>
                                                <th>Automatización</th>
                                                <th></th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {indicadoresBusqueda.map(
                                                (indicador) => (
                                                  <tr key={indicador["id"]}>
                                                    <td>
                                                      {indicador["nombre"]}
                                                    </td>
                                                    <td>
                                                      {mostrarIndicadorTipo(
                                                        indicador["tipo"]
                                                      )}
                                                    </td>
                                                    <td>
                                                      {indicador[
                                                        "calculoAutomatico"
                                                      ]
                                                        ? "Habilitada"
                                                        : "No habilitada"}
                                                    </td>
                                                    <td>
                                                      <button
                                                        type="button"
                                                        onClick={handleAgregarIndicadores(
                                                          indicador["id"],
                                                          indicador["nombre"],
                                                          indicador["tipo"],
                                                          indicador[
                                                            "calculoAutomatico"
                                                          ]
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
                              </div>
                            )}
                          </Tab>
                          <Tab eventKey="Detalle" title="Recursos">
                            <div className="row">
                              <div className="col-md-12">
                                <Form.Group>
                                <label className="col-sm-7 col-form-label">
                                      Recursos
                                    </label>
                                    <button
                                      type="button"
                                      className="btn btn-link float-sm-right"
                                      onClick={() =>
                                        setMostrarBuscarRecursos(
                                          !mostrarBuscarRecursos
                                        )
                                      }
                                    >
                                      Buscar recursos
                                    </button>
                                </Form.Group>
                                {recursos.length == 0 ? (
                                  <Form.Group>
                                    <label className="col-sm-12 col-form-label">
                                      No se han registrado recursos
                                    </label>
                                  </Form.Group>
                                ) : (
                                  <div className="table-responsive">
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
                                        {recursos.map((recurso) => (
                                          <tr key={recurso["id"]}>
                                            <td>{recurso["descripcion"]}</td>
                                            <td>{recurso["tipo"]}</td>
                                            <td>{recurso["estado"]}</td>
                                            <td>
                                              <button
                                                style={{ marginLeft: "auto" }}
                                                type="button"
                                              >
                                                <i
                                                  className="mdi mdi-delete"
                                                  style={{ color: "black" }}
                                                  onClick={handleEliminarRecursos(
                                                    recurso["id"]
                                                  )}
                                                ></i>
                                              </button>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </div>

                            {mostrarBuscarRecursos && (
                                <div>
                                  <div className="row">
                                    <div className="col-md-7">
                                      <Form.Group>
                                        <div className="search-field col-sm-12">
                                          <form
                                            className="d-flex align-items-center h-100"
                                            onSubmit={buscarRecursosCadena}
                                          >
                                            <div className="input-group">
                                              <div className="input-group-prepend bg-white">
                                                <i className="input-group-text border-0 mdi mdi-magnify"></i>
                                              </div>
                                              <input
                                                type="text"
                                                className="form-control bg-white border-0"
                                                placeholder="Descripción"
                                                value={recursoCadena}
                                                onChange={({ target }) =>
                                                  setRecursoCadena(target.value)
                                                }
                                              />
                                            </div>
                                          </form>
                                        </div>
                                      </Form.Group>
                                    </div>

                                    <div className="col-md-2">
                                      <Form.Group>
                                        <select
                                          className="form-control col-sm-11"
                                          onChange={({ target }) =>
                                            setRecursoTipo(target.value)
                                          }
                                        >
                                          <option
                                            value=""
                                            disabled
                                            selected
                                            hidden
                                          >
                                            Tipo
                                          </option>
                                          <option value={""}>
                                            Todos los tipos
                                          </option>
                                          <option value={"0"}>Correo</option>
                                          <option value={"1"}>
                                            Publicación
                                          </option>
                                          <option value={"2"}>
                                            Página web
                                          </option>
                                        </select>
                                      </Form.Group>
                                    </div>

                                    <div className="col-md-2">
                                      <Form.Group>
                                        <select
                                          className="form-control col-sm-11"
                                          onChange={({ target }) =>
                                            setRecursoEstado(target.value)
                                          }
                                        >
                                          <option
                                            value=""
                                            disabled
                                            selected
                                            hidden
                                          >
                                            Estado
                                          </option>
                                          <option value={""}>
                                            Todos los estados
                                          </option>
                                          <option value={"0"}>
                                            No vigente
                                          </option>
                                          <option value={"1"}>Vigente</option>
                                        </select>
                                      </Form.Group>
                                    </div>

                                    <div className="col-md-1">
                                      <Form.Group>
                                        <button
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={buscarRecursos}
                                        >
                                          Buscar
                                        </button>
                                      </Form.Group>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <Form.Group>
                                        {mostrarCargaRecursos && (
                                          <div className="row h-100">
                                            <div className="col-sm-12 my-auto">
                                              <div className="circle-loader"></div>
                                            </div>
                                          </div>
                                        )}
                                        {mostrarTablaRecursos && (
                                          <div className="table-responsive">
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
                                                {recursosBusqueda.map(
                                                  (recurso) => (
                                                    <tr key={recurso["id"]}>
                                                      <td>
                                                        {recurso["descripcion"]}
                                                      </td>
                                                      <td>{recurso["tipo"]}</td>
                                                      <td>
                                                        {recurso["estado"]}
                                                      </td>
                                                      <td>
                                                        <button
                                                          style={{
                                                            marginLeft: "auto",
                                                          }}
                                                          type="button"
                                                        >
                                                          <i
                                                            className="mdi mdi-plus"
                                                            style={{
                                                              color: "black",
                                                            }}
                                                            onClick={handleAgregarRecursos(
                                                              recurso["id"],
                                                              recurso[
                                                                "descripcion"
                                                              ],
                                                              recurso["tipo"],
                                                              recurso["estado"]
                                                            )}
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
                                </div>
                              )}
                          </Tab>
                          <Tab eventKey="Participantes" title="Participantes">
                            <div className="row">
                              <div className="col-md-12">
                                <Form.Group>
                                  <label className="col-sm-7 col-form-label">
                                    Participantes
                                  </label>
                                  <button
                                    type="button"
                                    className="btn btn-link float-sm-right"
                                    onClick={() =>
                                      setMostrarBuscarParticipantes(
                                        !mostrarBuscarParticipantes
                                      )
                                    }
                                  >
                                    Buscar participantes
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-link float-sm-right"
                                    onClick={asignarTargetParticipantes}
                                  >
                                    Agregar desde target
                                  </button>
                                </Form.Group>
                                {contactos.length == 0 ? (
                                  <Form.Group>
                                    <label className="col-sm-12 col-form-label">
                                      No se han registrado participantes
                                    </label>
                                  </Form.Group>
                                ) : (
                                  <Form.Group>
                                    <div className="table-responsive">
                                      <table className="table">
                                        <thead>
                                          <tr>
                                            <th>Nombre completo</th>
                                            <th>Estado</th>
                                            <th>Correo</th>
                                            <th>Empresa</th>
                                            <th></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {contactos.map((contacto) => (
                                            <tr key={contacto["id"]}>
                                              <td>
                                                {
                                                  contacto[
                                                    "persona__nombreCompleto"
                                                  ]
                                                }
                                              </td>
                                              <td>{contacto["estado"]}</td>
                                              <td>{contacto["correo"]}</td>
                                              <td>{contacto["empresa"]}</td>
                                              <td>
                                                <button
                                                  style={{ marginLeft: "auto" }}
                                                  type="button"
                                                >
                                                  <i
                                                    className="mdi mdi-delete"
                                                    style={{ color: "black" }}
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
                            {mostrarBuscarParticipantes && (
                              <div>
                                <div className="row">
                                  <div className="col-md-11">
                                    <Form.Group>
                                      <div className="search-field col-sm-12">
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
                                              value={cadenaBuscarContacto}
                                              onChange={({ target }) =>
                                                setCadenaBuscarContacto(
                                                  target.value
                                                )
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
                                                <th>Nombre completo</th>
                                                <th>Estado</th>
                                                <th>Correo</th>
                                                <th>Empresa</th>
                                                <th></th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {contactosBusqueda.map(
                                                (contacto) => (
                                                  <tr key={contacto["id"]}>
                                                    <td>
                                                      {
                                                        contacto[
                                                          "persona__nombreCompleto"
                                                        ]
                                                      }
                                                    </td>
                                                    <td>
                                                      {contacto["estado"]}
                                                    </td>
                                                    <td>
                                                      {contacto["correo"]}
                                                    </td>
                                                    <td>
                                                      {contacto["empresa"]}
                                                    </td>
                                                    <td>
                                                      <button
                                                        style={{
                                                          marginLeft: "auto",
                                                        }}
                                                        type="button"
                                                      >
                                                        <i
                                                          className="mdi mdi-plus"
                                                          style={{
                                                            color: "black",
                                                          }}
                                                          onClick={handleAgregarContactos(
                                                            contacto
                                                          )}
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
                              </div>
                            )}
                          </Tab>
                        </Tabs>
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
                            onClick={handleShow}
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                <h4 className="card-title" style={{ color: "#000000" }}>
                  Guardar campaña
                </h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5 className="card-title" style={{ color: "#000000" }}>
                ¿Desea guardar la campaña?
              </h5>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-outline-primary" onClick={handleClose}>
                Cancelar
              </button>

              <button className="btn btn-primary" onClick={guardarCampana}>
                Guardar
              </button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={mostrarListaDetalle}
            onHide={() => setMostrarListaDetalle(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <h4 className="card-title" style={{ color: "#000000" }}>
                  Detalle de lista
                </h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-md-12">
                  <Form.Group className="row">
                    <label className="col-sm-8 col-form-label">
                      Detalle de lista
                    </label>
                    <div className="col-sm-4">
                      <button
                        type="button"
                        className="btn btn-link float-sm-right"
                        onClick={handleAsignarLista}
                      >
                        Asignar lista
                      </button>
                    </div>
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Nombre completo</th>
                        <th>Estado</th>
                        <th>Correo</th>
                        <th>Empresa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaElementosBusqueda.map((elemento) => (
                        <tr key={elemento["id"]}>
                          <td>{elemento["persona__nombreCompleto"]}</td>
                          <td>{elemento["estado"]}</td>
                          <td>{elemento["correo"]}</td>
                          <td>{elemento["empresa"]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-outline-primary"
                onClick={() => setMostrarListaDetalle(false)}
              >
                Cancelar
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default CrearCampana;
