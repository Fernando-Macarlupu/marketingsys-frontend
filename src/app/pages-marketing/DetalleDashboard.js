import React, { useEffect, useState } from "react";
import {
  Form,
  Tabs,
  Tab,
  FormGroup,
  Modal,
  CloseButton,
} from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import bsCustomFileInput from "bs-custom-file-input";
import { Line, Bar, Doughnut, Pie, Scatter } from "react-chartjs-2";

const DetalleDashboard = () => {
  const history = useHistory();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [mostrarCargaDatos, setMostrarCargaDatos] = useState(false);
  const [mostrarDatos, setMostrarDatos] = useState(true);

  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [mostrarCarga, setMostrarCarga] = useState(false);
  const [cadena, setCadena] = useState("");
  const [reportes, setReportes] = useState([]);
  const [propietario, setPropietario] = useState(0);

  const [idDashboard, setIdDashboard] = useState(0);

  const [nuevoComponenteReporte, setNuevoComponenteReporte] = useState({
    id: 0,
    nombre: "",
    tipo: "",
  });
  const [nuevoComponenteReporteTipo, setNuevoComponenteReporteTipo] =
    useState("");

  const [mostrarAgregarComponente, setMostrarAgregarComponente] =
    useState(false);

  const [filtros, setFiltros] = useState([]);
  const [nuevoFiltro, setNuevoFiltro] = useState({});
  const [nuevoFiltroPropiedad, setNuevoFiltroPropiedad] = useState("");
  const [nuevoFiltroEvaluacion, setNuevoFiltroEvaluacion] = useState("");
  const [nuevoFiltroEvaluacionValor, setNuevoFiltroEvaluacionValor] =
    useState(null);

  const [nuevoFiltroFecha, setNuevoFiltroFecha] = useState(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [principal, setPrincipal] = useState(false);
  const [columnas, setColumnas] = useState([]);
  const [filas, setFilas] = useState([]);
  const [componentes, setComponentes] = useState([]);

  const [tipo, setTipo] = useState("0");

  const [nuevoComponenteTipo, setNuevoComponenteTipo] = useState("0");
  const [nuevoComponenteOrganizado, setNuevoComponenteOrganizado] =
    useState("plan-estado");
  const [nuevoComponenteValores, setNuevoComponenteValores] =
    useState("cantidad");
  const [nuevoComponenteTitulo, setNuevoComponenteTitulo] = useState("");
  const [nuevoComponenteSubTitulo, setNuevoComponenteSubTitulo] = useState("");

  const [opcionesEvaluacion, setOpcionesEvaluacion] = useState([]);

  const [mostrarTablaElementos, setMostrarTablaElementos] = useState(false);
  const [mostrarCargaElementos, setMostrarCargaElementos] = useState(false);

  const [usuarioLogueado, setUsuarioLogueado] = useState({});

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  const doughnutPieOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (nombre == "") alert("Ingrese el nombre del dashboard");
    else {
      setShow(true);
    }
  };
  const handleMostrarAgregarComponente = () =>
    setMostrarAgregarComponente(!mostrarAgregarComponente);

  const handleChangeTipoComponente = (event) => {
    setNuevoComponenteTipo(event.target.value);
  };
  const handleChangeNuevoComponenteOrganizado = (event) => {
    setNuevoComponenteOrganizado(event.target.value);
  };
  const handleChangeNuevoComponenteValores = (event) => {
    setNuevoComponenteValores(event.target.value);
  };

  const handleChangeCadena = (event) => {
    //console.log(event.target.value);
    setCadena(event.target.value);
  };

  const agregarComponente = () => {
    if (nuevoComponenteReporte.id == 0)
      alert("Asigne un reporte al componente");

    api
      .post("crearComponenteInforme", {
        idReporte: nuevoComponenteReporte.id,
        tipo: nuevoComponenteTipo,
        ejex: nuevoComponenteOrganizado,
        ejey: nuevoComponenteValores,
        propietario: propietario,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setComponentes([
          ...componentes,
          {
            id: 0,
            tipo: String(nuevoComponenteTipo),
            titulo: nuevoComponenteTitulo,
            subtitulo: nuevoComponenteSubTitulo,
            labels: data["labels"],
            cantidades: data["cantidades"],
          },
        ]);
        setNuevoComponenteReporte({
          id: 0,
          nombre: "",
          tipo: "",
        });
        setNuevoComponenteReporteTipo("");
        setNuevoComponenteTipo("0");
        setNuevoComponenteOrganizado("plan-estado");
        setNuevoComponenteValores("cantidad");
        setNuevoComponenteTitulo("");
        setNuevoComponenteSubTitulo("");
        setMostrarAgregarComponente(false);
        setMostrarTabla(false);
      })
      .catch((err) => alert(err));
  };

  const buscarReportes = () => {
    //console.log("esto es la cadena")
    console.log(cadena);
    setMostrarTabla(false);
    setMostrarCarga(true);
    api
      .post("filtrarReportes", {
        cadena: cadena,
        fechaCreacionIni: "",
        fechaCreacionFin: "",
        fechaModificacionIni: "",
        fechaModificacionFin: "",
        propietario: propietario,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setReportes(data);
        setMostrarCarga(false);
        setMostrarTabla(true);
      })
      .catch((err) => alert(err));
  };

  const buscarReportesCadena = (event) => {
    event.preventDefault();
    buscarReportes();
  };

  const handleAsignarReporte = (id, nombre, tipo) => () => {
    setNuevoComponenteReporte({
      id: id,
      nombre: nombre,
      tipo: tipo,
    });
    setNuevoComponenteReporteTipo(tipo);
    if (tipo == "0") setNuevoComponenteOrganizado("plan-estado");
    else if (tipo == "1") setNuevoComponenteOrganizado("programa-estado");
    else if (tipo == "2") setNuevoComponenteOrganizado("campana-estado");
    else if (tipo == "3") setNuevoComponenteOrganizado("recurso-estado");
    else if (tipo == "4") setNuevoComponenteOrganizado("oportunidad-estado");
    else if (tipo == "5") setNuevoComponenteOrganizado("contacto-estado");
    else if (tipo == "6") setNuevoComponenteOrganizado("empresa-tipo");
  };

  const handleEliminarComponentes = (componente) => () => {
    console.log("se va a eliminar");
    setComponentes((prev) => prev.filter((el) => el !== componente));
    //console.log(event.target.value);
  };

  const fechasEnterosOpciones = [
    { id: "0", nombre: "Igual" },
    { id: "1", nombre: "Menor" },
    { id: "2", nombre: "Mayor" },
    { id: "3", nombre: "Menor o igual" },
    { id: "4", nombre: "Mayor o igual" },
  ];
  const cadenasOpciones = [{ id: "5", nombre: "Contiene" }];
  const otrosOpciones = [{ id: "0", nombre: "Igual" }];

  const handleChangeTipo = (event) => {
    //aviso si esta seguro de cambiar
    setTipo(event.target.value);
    setOpcionesEvaluacion([]);
    setNuevoFiltroEvaluacion("");
    const propiedad = document.getElementById("propiedadFiltroNuevo");
    const evaluacion = document.getElementById("evaluacionFiltroNuevo");
    propiedad.value = "";
    evaluacion.value = "";
    setFiltros([]);
    setFilas([]);
    setColumnas([]);
  };

  const handleChangePropiedadFiltro = (event) => {
    //setAspectoIndicador(event.target.value);
    if (event.target.value == "") {
      setOpcionesEvaluacion([]);
      setNuevoFiltroEvaluacion("");
    } else if (
      event.target.value == "nombreCompleto" ||
      event.target.value == "correo" ||
      event.target.value == "telefono" ||
      event.target.value == "paisDir" ||
      event.target.value == "estadoDir" ||
      event.target.value == "ciudadDir" ||
      event.target.value == "direccionDir" ||
      event.target.value == "empresaNombre" ||
      event.target.value == "nombre" ||
      event.target.value == "sector" ||
      event.target.value == "contactoNombre" ||
      event.target.value == "descripcion" ||
      event.target.value == "sponsor"
    ) {
      setOpcionesEvaluacion(cadenasOpciones);
      setNuevoFiltroEvaluacion("cadena");
    } else if (
      event.target.value == "fechaCreacion" ||
      event.target.value == "inicioVigencia" ||
      event.target.value == "finVigencia" ||
      event.target.value == "fechaPublicacion"
    ) {
      setOpcionesEvaluacion(fechasEnterosOpciones);
      setNuevoFiltroEvaluacion("fecha");
    } else if (
      event.target.value == "cantEmpleados" ||
      event.target.value == "presupuesto" ||
      event.target.value == "importe"
    ) {
      setOpcionesEvaluacion(fechasEnterosOpciones);
      setNuevoFiltroEvaluacion("entero");
    } else if (
      event.target.value == "calificado" ||
      event.target.value == "empresa" ||
      event.target.value == "contacto"
    ) {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("booleano");
    } else if (event.target.value == "estado" && tipo == "5") {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("contacto-estado");
    } else if (event.target.value == "tipo" && tipo == "6") {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("empresa-tipo");
    } else if (event.target.value == "servicioRed") {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("red");
    } else if (
      event.target.value == "estado" &&
      (tipo == "0" || tipo == "1" || tipo == "2" || tipo == "3" || tipo == "4")
    ) {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("marketing-estado");
    } else if (event.target.value == "tipo" && tipo == "2") {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("campana-tipo");
    } else if (event.target.value == "tipo" && tipo == "3") {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("recurso-tipo");
    } else if (event.target.value == "tipo" && tipo == "4") {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("oportunidad-tipo");
    } else if (event.target.value == "etapa" && tipo == "4") {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("oportunidad-etapa");
    }
  };

  const handleAgregarFiltros = () => {
    const propiedad = document.getElementById("propiedadFiltroNuevo");
    const evaluacion = document.getElementById("evaluacionFiltroNuevo");
    const valorEvaluacion = document.getElementById(
      "valorEvaluacionFiltroNuevo"
    );

    if (
      propiedad.value == "fechaCreacion" ||
      propiedad.value == "inicioVigencia" ||
      propiedad.value == "finVigencia"
    ) {
      if (
        propiedad.value == "" ||
        evaluacion.value == "" ||
        nuevoFiltroFecha == null
      )
        return;
    } else {
      if (
        propiedad.value == "" ||
        evaluacion.value == "" ||
        valorEvaluacion.value == "" ||
        valorEvaluacion.value == null
      )
        return;
    }

    let valorEvaluacionValue = null;
    if (
      propiedad.value == "fechaCreacion" ||
      propiedad.value == "inicioVigencia" ||
      propiedad.value == "finVigencia"
    ) {
      valorEvaluacionValue = nuevoFiltroFecha;
    } else {
      valorEvaluacionValue = valorEvaluacion.value;
    }

    if (
      propiedad.value == "fechaCreacion" ||
      propiedad.value == "inicioVigencia" ||
      propiedad.value == "finVigencia"
    ) {
      valorEvaluacionValue =
        valorEvaluacionValue.getDate() +
        "-" +
        parseInt(valorEvaluacionValue.getMonth() + 1) +
        "-" +
        valorEvaluacionValue.getFullYear();
    }
    //console.log(redSocial.value);
    //console.log(nombreUsuario.value);
    setNuevoFiltro({
      propiedad: propiedad.value,
      evaluacion: evaluacion.value,
      valorEvaluacion: valorEvaluacionValue,
      nombre: propiedad.options[propiedad.selectedIndex].text,
    });
    //console.log(nuevaRed);
    for (let index = 0; index < filtros.length; index++) {
      const element = filtros[index];
      if (
        element["propiedad"] == propiedad.value &&
        element["evaluacion"] == evaluacion.value &&
        element["valorEvaluacion"] == valorEvaluacionValue
      )
        return;
    }
    setFiltros([
      ...filtros,
      {
        propiedad: propiedad.value,
        evaluacion: evaluacion.value,
        valorEvaluacion: valorEvaluacionValue,
        nombre: propiedad.options[propiedad.selectedIndex].text,
      },
    ]);
    if (
      propiedad.value == "fechaCreacion" ||
      propiedad.value == "inicioVigencia" ||
      propiedad.value == "finVigencia"
    ) {
      setNuevoFiltroFecha(null);
    } else if (
      propiedad.value == "cantEmpleados" ||
      propiedad.value == "presupuesto" ||
      propiedad.value == "importe"
    ) {
      valorEvaluacion.value = 0;
    } else {
      valorEvaluacion.value = "";
    }

    propiedad.value = "";
    evaluacion.value = "";
    setNuevoFiltroEvaluacion("");
    //console.log(redes);
  };

  const handleEliminarFiltros =
    (propiedad, evaluacion, valorEvaluacion) => () => {
      setFiltros((prev) =>
        prev.filter(
          (el) =>
            el.propiedad + el.evaluacion + el.valorEvaluacion !==
            propiedad + evaluacion + valorEvaluacion
        )
      );
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
    } else if (propiedad == "estado" && tipo == "5") {
      if (valorEvaluacion == "0") respuesta += "Suscriptor";
      else if (valorEvaluacion == "1") respuesta += "Lead";
      else if (valorEvaluacion == "2") respuesta += "Oportunidad";
      else if (valorEvaluacion == "3") respuesta += "Cliente";
    } else if (propiedad == "tipo" && tipo == "6") {
      if (valorEvaluacion == "0") respuesta += "Cliente potencial";
      else if (valorEvaluacion == "1") respuesta += "Socio";
      else if (valorEvaluacion == "2") respuesta += "Revendedor";
      else if (valorEvaluacion == "3") respuesta += "Proveedor";
    } else if (propiedad == "servicioRed") {
      if (valorEvaluacion == "0") respuesta += "Facebook";
      else if (valorEvaluacion == "1") respuesta += "Linkedin";
      else if (valorEvaluacion == "2") respuesta += "Instagram";
    } else if (
      propiedad == "estado" &&
      (tipo == "0" || tipo == "1" || tipo == "2" || tipo == "3" || tipo == "4")
    ) {
      if (valorEvaluacion == "0") respuesta += "No vigente";
      else if (valorEvaluacion == "1") respuesta += "Vigente";
    } else if (propiedad == "tipo" && tipo == "2") {
      if (valorEvaluacion == "0") respuesta += "Campaña de programa";
      else if (valorEvaluacion == "1") respuesta += "Campaña stand-alone";
    } else if (propiedad == "tipo" && tipo == "3") {
      if (valorEvaluacion == "0") respuesta += "Correo";
      else if (valorEvaluacion == "1") respuesta += "Publicación";
      else if (valorEvaluacion == "2") respuesta += "Página web";
    } else if (propiedad == "tipo" && tipo == "4") {
      if (valorEvaluacion == "0") respuesta += "Negocio existente";
      else if (valorEvaluacion == "1") respuesta += "Nuevo negocio";
    } else if (propiedad == "etapa" && tipo == "4") {
      if (valorEvaluacion == "0") respuesta += "Calificación";
      else if (valorEvaluacion == "1") respuesta += "Necesidad de análisis";
      else if (valorEvaluacion == "2") respuesta += "Propuesta";
      else if (valorEvaluacion == "3") respuesta += "Negociación";
      else if (valorEvaluacion == "4") respuesta += "Perdida";
      else if (valorEvaluacion == "5") respuesta += "Ganada";
    } else {
      respuesta += valorEvaluacion;
    }
    return respuesta;
    //console.log(event.target.value);
  };

  const handleAplicarFiltros = () => {
    let fechaHoy = "",
      fecha = new Date();
    fechaHoy =
      fecha.getDate() +
      "-" +
      parseInt(fecha.getMonth() + 1) +
      "-" +
      fecha.getFullYear();
    let cuerpo = {
      tipo: tipo,
      fechaHoy: fechaHoy,
      propietario: propietario, //falta
      filtros: filtros,
    };
    console.log("cuerpo a subir");
    console.log(cuerpo);
    setMostrarTablaElementos(false);
    setMostrarCargaElementos(true);
    api
      .post("aplicarFiltrosReporte", cuerpo)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCargaElementos(false);
        setMostrarTablaElementos(true);
        //setShow(false);
        setColumnas(data["columnas"]);
        setFilas(data["filas"]);
      })
      .catch((err) => alert(err));
  };

  const guardarDashboard = () => {
    let cuerpo = {
      idDashboard: idDashboard,
      nombre: nombre,
      descripcion: descripcion,
      principal: principal,
      propietario: propietario, //falta
      filtros: filtros,
      componentes: componentes,
    };
    console.log("cuerpo a subir");
    console.log(cuerpo);
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .post("registrarDashboard", cuerpo)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCargaDatos(false);
        setMostrarDatos(true);
        setShow(false);
        history.push({
          pathname: "/informes",
          state: { dashboardGuardado: true },
        });
      })
      .catch((err) => alert(err));
  };

  const cargarDashboard = () => {
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .get(`detalleDashboard/${location.state.idDashboard}`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setIdDashboard(parseInt(data["idDashboard"]));
        setNombre(data["nombre"]);
        setDescripcion(data["descripcion"]);
        setPrincipal(data["principal"]);
        setPropietario(parseInt(data["propietario"]));
        setFiltros(data["filtros"]);
        setComponentes(data["componentes"]);
        setMostrarCargaDatos(false);
        setMostrarDatos(true);
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
    cargarDashboard();
  }, []);

  const componentDidMount = () => {
    bsCustomFileInput.init();
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
              <h3 className="page-title"> Detalle de dashboard </h3>
            </div>
            <div className="justify-content-between align-items-center tab-transparent">
              <Tabs defaultActiveKey="Datos" className="nav">
                <Tab eventKey="Datos" title="Datos del dashboard">
                  <div className="row">
                    <div className="col-12 grid-margin">
                      <div className="card">
                        <div className="card-body">
                          <div className="row">
                            <h4 className="card-title col-md-8">
                              Datos de dashboard
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
                                    Nombre<code>*</code>
                                  </label>
                                  <div className="col-sm-12">
                                    <Form.Control
                                      type="text"
                                      value={nombre}
                                      onChange={({ target }) =>
                                        setNombre(target.value)
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
                                    Descripción
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
                              <div className="col-md-4">
                                <Form.Group>
                                  <div class="custom-control custom-switch">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      id="calificadoValor"
                                      checked={principal}
                                      onChange={(e) => {
                                        setPrincipal(!principal);
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      for="calificadoValor"
                                    >
                                      Dashboard de la pantalla principal
                                    </label>
                                  </div>
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
                                      pathname: "/informes",
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
                </Tab>
                <Tab eventKey="Estructura" title="Estructura del dashboard">
                  <div className="row">
                    <h4 className="card-title col-md-8"></h4>
                    <div className="col-md-4">
                      <Form.Group>
                        <div className="text-right">
                          <button
                            className="btn btn-primary"
                            onClick={handleMostrarAgregarComponente}
                          >
                            Agregar componente
                          </button>
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    {componentes.map((componente) => (
                      <div className="col-md-6">
                        {componente["tipo"] == "0" && (
                          <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-md-12">
                                    <CloseButton
                                      className="float-md-right"
                                      onClick={handleEliminarComponentes(
                                        componente
                                      )}
                                    />
                                  </div>
                                </div>
                                <h4 className="card-title">
                                  {componente["titulo"]}
                                </h4>
                                <h5 className="card-subtitle">
                                  {componente["subtitulo"]}
                                </h5>
                                <Bar
                                  data={{
                                    labels: componente["labels"],
                                    datasets: [
                                      {
                                        label: "",
                                        data: componente["cantidades"],
                                        backgroundColor: [
                                          "rgba(255, 99, 132, 0.2)",
                                          "rgba(54, 162, 235, 0.2)",
                                          "rgba(255, 206, 86, 0.2)",
                                          "rgba(75, 192, 192, 0.2)",
                                          "rgba(153, 102, 255, 0.2)",
                                          "rgba(255, 159, 64, 0.2)",
                                        ],
                                        borderColor: [
                                          "rgba(255,99,132,1)",
                                          "rgba(54, 162, 235, 1)",
                                          "rgba(255, 206, 86, 1)",
                                          "rgba(75, 192, 192, 1)",
                                          "rgba(153, 102, 255, 1)",
                                          "rgba(255, 159, 64, 1)",
                                        ],
                                        borderWidth: 1,
                                        fill: false,
                                      },
                                    ],
                                  }}
                                  options={options}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {componente["tipo"] == "1" && (
                          <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-md-12">
                                    <CloseButton
                                      className="float-md-right"
                                      onClick={handleEliminarComponentes(
                                        componente
                                      )}
                                    />
                                  </div>
                                </div>
                                <h4 className="card-title">
                                  {componente["titulo"]}
                                </h4>
                                <h5 className="card-subtitle">
                                  {componente["subtitulo"]}
                                </h5>
                                <Line
                                  data={{
                                    labels: componente["labels"],
                                    datasets: [
                                      {
                                        label: "",
                                        data: componente["cantidades"],
                                        backgroundColor: [
                                          "rgba(255, 99, 132, 0.2)",
                                          "rgba(54, 162, 235, 0.2)",
                                          "rgba(255, 206, 86, 0.2)",
                                          "rgba(75, 192, 192, 0.2)",
                                          "rgba(153, 102, 255, 0.2)",
                                          "rgba(255, 159, 64, 0.2)",
                                        ],
                                        borderColor: [
                                          "rgba(255,99,132,1)",
                                          "rgba(54, 162, 235, 1)",
                                          "rgba(255, 206, 86, 1)",
                                          "rgba(75, 192, 192, 1)",
                                          "rgba(153, 102, 255, 1)",
                                          "rgba(255, 159, 64, 1)",
                                        ],
                                        borderWidth: 1,
                                        fill: false,
                                      },
                                    ],
                                  }}
                                  options={options}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {componente["tipo"] == "2" && (
                          <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-md-12">
                                    <CloseButton
                                      className="float-md-right"
                                      onClick={handleEliminarComponentes(
                                        componente
                                      )}
                                    />
                                  </div>
                                </div>
                                <h4 className="card-title">
                                  {componente["titulo"]}
                                </h4>
                                <h5 className="card-subtitle">
                                  {componente["subtitulo"]}
                                </h5>
                                <Pie
                                  data={{
                                    datasets: [
                                      {
                                        data: componente["cantidades"],
                                        backgroundColor: [
                                          "rgba(255, 99, 132, 0.5)",
                                          "rgba(54, 162, 235, 0.5)",
                                          "rgba(255, 206, 86, 0.5)",
                                          "rgba(75, 192, 192, 0.5)",
                                          "rgba(153, 102, 255, 0.5)",
                                          "rgba(255, 159, 64, 0.5)",
                                        ],
                                        borderColor: [
                                          "rgba(255,99,132,1)",
                                          "rgba(54, 162, 235, 1)",
                                          "rgba(255, 206, 86, 1)",
                                          "rgba(75, 192, 192, 1)",
                                          "rgba(153, 102, 255, 1)",
                                          "rgba(255, 159, 64, 1)",
                                        ],
                                      },
                                    ],
                                    labels: componente["labels"],
                                  }}
                                  options={doughnutPieOptions}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() =>
                          history.push({
                            pathname: "/informes",
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
                </Tab>
              </Tabs>
            </div>
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                <h4 className="card-title" style={{ color: "#000000" }}>
                  Guardar dashboard
                </h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5 className="card-title" style={{ color: "#000000" }}>
                ¿Desea guardar el dashboard?
              </h5>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-outline-primary" onClick={handleClose}>
                Cancelar
              </button>

              <button className="btn btn-primary" onClick={guardarDashboard}>
                Guardar
              </button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={mostrarAgregarComponente}
            onHide={handleMostrarAgregarComponente}
            dialogClassName="custom-modal-style"
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <h4 className="card-title" style={{ color: "#000000" }}>
                  Agregar componente
                </h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-md-12">
                  <Form.Group>
                    <label className="col-sm-12 col-form-label">Tipo</label>
                    <div className="col-sm-12">
                      <select
                        className="form-control"
                        value={nuevoComponenteTipo}
                        onChange={handleChangeTipoComponente}
                      >
                        <option value={"0"} selected>
                          Gráfico de barras
                        </option>
                        <option value={"1"}>Gráfico lineal</option>
                        <option value={"2"}>Gráfico circular</option>
                      </select>
                    </div>
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <Form.Group>
                    <label className="col-md-12 col-form-label">Reporte</label>
                    <div className="col-md-12">
                      <Form.Control
                        type="text"
                        value={nuevoComponenteReporte.nombre}
                      />
                    </div>
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-10">
                  <Form.Group>
                    <div className="search-field col-sm-10">
                      <form
                        className="d-flex align-items-center h-100"
                        onSubmit={buscarReportesCadena}
                      >
                        <div className="input-group">
                          <div className="input-group-prepend bg-white">
                            <i className="input-group-text border-0 mdi mdi-magnify"></i>
                          </div>
                          <input
                            type="text"
                            className="form-control bg-white border-0"
                            placeholder="Nombre del reporte"
                            onChange={handleChangeCadena}
                          />
                        </div>
                      </form>
                    </div>
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group>
                    <div className="text-right">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={buscarReportes}
                      >
                        Buscar
                      </button>
                    </div>
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  {mostrarCarga && (
                    <div className="row h-100">
                      <div className="col-sm-12 my-auto">
                        <div className="circle-loader"></div>
                      </div>
                    </div>
                  )}
                  {mostrarTabla && (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Fecha de creación</th>
                            <th>Fecha de modificación</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportes.map((reporte) => (
                            <tr key={reporte["id"]}>
                              <td>{reporte["nombre"]}</td>
                              <td>{reporte["fechaCreacion"]}</td>
                              <td>{reporte["fechaModificacion"]}</td>
                              <td>
                                <button
                                  type="button"
                                  onClick={handleAsignarReporte(
                                    reporte["id"],
                                    reporte["nombre"],
                                    reporte["tipo"]
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
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <Form.Group>
                    <label className="col-sm-12 col-form-label">Título</label>
                    <div className="col-sm-12">
                      <Form.Control
                        type="text"
                        value={nuevoComponenteTitulo}
                        onChange={({ target }) =>
                          setNuevoComponenteTitulo(target.value)
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
                      Subtítulo
                    </label>
                    <div className="col-sm-12">
                      <Form.Control
                        type="text"
                        value={nuevoComponenteSubTitulo}
                        onChange={({ target }) =>
                          setNuevoComponenteSubTitulo(target.value)
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
                      Organizado por
                    </label>
                    <div className="col-sm-12">
                      {nuevoComponenteReporteTipo == "0" && (
                        <select
                          className="form-control"
                          value={nuevoComponenteOrganizado}
                          onChange={handleChangeNuevoComponenteOrganizado}
                        >
                          <option value={"plan-estado"} selected>
                            Estado del plan
                          </option>
                        </select>
                      )}
                      {nuevoComponenteReporteTipo == "1" && (
                        <select
                          className="form-control"
                          value={nuevoComponenteOrganizado}
                          onChange={handleChangeNuevoComponenteOrganizado}
                        >
                          <option value={"programa-estado"} selected>
                            Estado del programa
                          </option>
                        </select>
                      )}
                      {nuevoComponenteReporteTipo == "2" && (
                        <select
                          className="form-control"
                          value={nuevoComponenteOrganizado}
                          onChange={handleChangeNuevoComponenteOrganizado}
                        >
                          <option value={"campana-estado"} selected>
                            Estado de la campaña{" "}
                          </option>
                          <option value={"campana-tipo"}>
                            Tipo de la campaña
                          </option>
                        </select>
                      )}
                      {nuevoComponenteReporteTipo == "3" && (
                        <select
                          className="form-control"
                          value={nuevoComponenteOrganizado}
                          onChange={handleChangeNuevoComponenteOrganizado}
                        >
                          <option value={"recurso-estado"} selected>
                            Estado del recurso
                          </option>
                          <option value={"recurso-tipo"}>
                            Tipo del recurso
                          </option>
                        </select>
                      )}
                      {nuevoComponenteReporteTipo == "4" && (
                        <select
                          className="form-control"
                          value={nuevoComponenteOrganizado}
                          onChange={handleChangeNuevoComponenteOrganizado}
                        >
                          <option value={"oportunidad-estado"} selected>
                            Estado de la oportunidad
                          </option>
                          <option value={"oportunidad-tipo"}>
                            Tipo de la oportunidad
                          </option>
                          <option value={"oportunidad-etapa"}>
                            Etapa de la oportunidad
                          </option>
                        </select>
                      )}
                      {nuevoComponenteReporteTipo == "5" && (
                        <select
                          className="form-control"
                          value={nuevoComponenteOrganizado}
                          onChange={handleChangeNuevoComponenteOrganizado}
                        >
                          <option value={"contacto-estado"} selected>
                            Estado del contacto
                          </option>
                        </select>
                      )}
                      {nuevoComponenteReporteTipo == "6" && (
                        <select
                          className="form-control"
                          value={nuevoComponenteOrganizado}
                          onChange={handleChangeNuevoComponenteOrganizado}
                        >
                          <option value={"empresa-tipo"} selected>
                            Tipo de empresa
                          </option>
                        </select>
                      )}
                    </div>
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <Form.Group>
                    <label className="col-sm-12 col-form-label">Valores</label>
                    <div className="col-sm-12">
                      <select
                        className="form-control"
                        value={nuevoComponenteValores}
                        onChange={handleChangeNuevoComponenteValores}
                      >
                        <option value={"cantidad"} selected>
                          Cantidad de registros
                        </option>
                      </select>
                    </div>
                  </Form.Group>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-outline-primary"
                onClick={handleMostrarAgregarComponente}
              >
                Cancelar
              </button>

              <button className="btn btn-primary" onClick={agregarComponente}>
                Agregar
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default DetalleDashboard;
