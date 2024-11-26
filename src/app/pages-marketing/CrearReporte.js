import React, { useEffect, useState } from "react";
import { Form, FormGroup, Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import bsCustomFileInput from "bs-custom-file-input";

const CrearReporte = () => {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [mostrarCargaDatos, setMostrarCargaDatos] = useState(false);
  const [mostrarDatos, setMostrarDatos] = useState(true);

  const [filtros, setFiltros] = useState([]);
  const [nuevoFiltro, setNuevoFiltro] = useState({});
  const [nuevoFiltroPropiedad, setNuevoFiltroPropiedad] = useState("");
  const [nuevoFiltroEvaluacion, setNuevoFiltroEvaluacion] = useState("");
  const [nuevoFiltroEvaluacionValor, setNuevoFiltroEvaluacionValor] =
    useState(null);

  const [nuevoFiltroFecha, setNuevoFiltroFecha] = useState(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [columnas, setColumnas] = useState([]);
  const [filas, setFilas] = useState([]);

  const [tipo, setTipo] = useState("0");

  const [opcionesEvaluacion, setOpcionesEvaluacion] = useState([]);

  const [mostrarTablaElementos, setMostrarTablaElementos] = useState(false);
  const [mostrarCargaElementos, setMostrarCargaElementos] = useState(false);

  const [usuarioLogueado, setUsuarioLogueado] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (nombre == "") alert("Ingrese el nombre del reporte");
    else {
      if (tipo == "") alert("Ingrese el tipo del reporte");
      else setShow(true);
    }
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
    } else if (event.target.value == "fechaCreacion"||
        event.target.value == "inicioVigencia" ||
        event.target.value == "finVigencia" ||
        event.target.value == "fechaPublicacion") {
      setOpcionesEvaluacion(fechasEnterosOpciones);
      setNuevoFiltroEvaluacion("fecha");
    } else if (event.target.value == "cantEmpleados"||
        event.target.value == "presupuesto" ||
        event.target.value == "importe") {
      setOpcionesEvaluacion(fechasEnterosOpciones);
      setNuevoFiltroEvaluacion("entero");
    } else if (
      event.target.value == "calificado" ||
      event.target.value == "empresa" ||
      event.target.value == "contacto"
    ) {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("booleano");
    } else if (event.target.value == "estado" && tipo=="5") {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("contacto-estado");
    } else if (event.target.value == "tipo" && tipo=="6") {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("empresa-tipo");
    } else if (event.target.value == "servicioRed") {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("red");
    }else if (event.target.value == "estado" && (tipo=="0" || tipo=="1" || tipo=="2" || tipo=="3" || tipo=="4")) {
        setOpcionesEvaluacion(otrosOpciones);
        setNuevoFiltroEvaluacion("marketing-estado");
      }
      else if (event.target.value == "tipo" && (tipo=="2")) {
        setOpcionesEvaluacion(otrosOpciones);
        setNuevoFiltroEvaluacion("campana-tipo");
      }
      else if (event.target.value == "tipo" && (tipo=="3")) {
        setOpcionesEvaluacion(otrosOpciones);
        setNuevoFiltroEvaluacion("recurso-tipo");
      }
      else if (event.target.value == "tipo" && (tipo=="4")) {
        setOpcionesEvaluacion(otrosOpciones);
        setNuevoFiltroEvaluacion("oportunidad-tipo");
      }
      else if (event.target.value == "etapa" && (tipo=="4")) {
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

    if (propiedad.value == "fechaCreacion" || propiedad.value == "inicioVigencia" || propiedad.value == "finVigencia") {
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
    if (propiedad.value == "fechaCreacion" || propiedad.value == "inicioVigencia" || propiedad.value == "finVigencia") {
      valorEvaluacionValue = nuevoFiltroFecha;
    } else {
      valorEvaluacionValue = valorEvaluacion.value;
    }

    if (propiedad.value == "fechaCreacion" || propiedad.value == "inicioVigencia" || propiedad.value == "finVigencia") {
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
    if (propiedad.value == "fechaCreacion" || propiedad.value == "inicioVigencia" || propiedad.value == "finVigencia") {
      setNuevoFiltroFecha(null);
    } else if (propiedad.value == "cantEmpleados" || propiedad.value == "presupuesto" || propiedad.value == "importe") {
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

    const mostrarColumnas = (columna) => {
      if (columna == 'plan-descripcion') return "Plan: Descripción";
      else if (columna == 'plan-sponsor') return "Plan: Sponsor";
      else if (columna == 'plan-presupuesto') return "Plan: Presupuesto";
      else if (columna == 'plan-inicioVigencia') return "Plan: Inicio de vigencia";
      else if (columna == 'plan-finVigencia') return "Plan: Fin de vigencia";
      else if (columna == 'plan-estado') return "Plan: Estado";
      else if (columna == 'plan-fechaCreacion') return "Plan: Fecha de creación";
      else if (columna == 'plan-fechaModificacion') return "Plan: Fecha de modificación";
      else if (columna == 'programa-descripcion') return "Programa: Descripción";
      else if (columna == 'programa-tipo') return "Programa: Tipo";
      else if (columna == 'programa-sponsor') return "Programa: Sponsor";
      else if (columna == 'programa-presupuesto') return "Programa: Presupuesto";
      else if (columna == 'programa-inicioVigencia') return "Programa: Inicio de vigencia";
      else if (columna == 'programa-finVigencia') return "Programa: Fin de vigencia";
      else if (columna == 'programa-estado') return "Programa: Estado";
      else if (columna == 'programa-fechaCreacion') return "Programa: Fecha de creación";
      else if (columna == 'programa-fechaModificacion') return "Programa: Fecha de modificación";
      else if (columna == 'campana-descripcion') return "Campaña: Descripción";
      else if (columna == 'campana-tipo') return "Campaña: Tipo";
      else if (columna == 'campana-sponsor') return "Campaña: Sponsor";
      else if (columna == 'campana-presupuesto') return "Campaña: Presupuesto";
      else if (columna == 'campana-inicioVigencia') return "Campaña: Inicio de vigencia";
      else if (columna == 'campana-finVigencia') return "Campaña: Fin de vigencia";
      else if (columna == 'campana-estado') return "Campaña: Estado";
      else if (columna == 'campana-fechaCreacion') return "Campaña: Fecha de creación";
      else if (columna == 'campana-fechaModificacion') return "Campaña: Fecha de modificación";
      else if (columna == 'recurso-descripcion') return "Recurso: Descripción";
      else if (columna == 'recurso-tipo') return "Recurso: Tipo";
      else if (columna == 'recurso-presupuesto') return "Recurso: Presupuesto";
      else if (columna == 'recurso-inicioVigencia') return "Recurso: Inicio de vigencia";
      else if (columna == 'recurso-finVigencia') return "Recurso: Fin de vigencia";
      else if (columna == 'recurso-estado') return "Recurso: Estado";
      else if (columna == 'recurso-fechaCreacion') return "Recurso: Fecha de creación";
      else if (columna == 'recurso-fechaModificacion') return "Recurso: Fecha de modificación";
      else if (columna == 'oportunidad-descripcion') return "Oportunidad: Descripción";
      else if (columna == 'oportunidad-tipo') return "Oportunidad: Tipo";
      else if (columna == 'oportunidad-etapa') return "Oportunidad: Etapa";
      else if (columna == 'oportunidad-importe') return "Oportunidad: Importe";
      else if (columna == 'oportunidad-inicioVigencia') return "Oportunidad: Inicio de vigencia";
      else if (columna == 'oportunidad-finVigencia') return "Oportunidad: Fin de vigencia";
      else if (columna == 'oportunidad-estado') return "Oportunidad: Estado";
      else if (columna == 'oportunidad-fechaCreacion') return "Oportunidad: Fecha de creación";
      else if (columna == 'oportunidad-fechaModificacion') return "Oportunidad: Fecha de modificación";
      else if (columna == 'contacto-nombreCompleto') return "Contacto: Nombre completo";
      else if (columna == 'contacto-estado') return "Contacto: Estado";
      else if (columna == 'contacto-fechaCreacion') return "Contacto: Fecha de creación";
      else if (columna == 'contacto-fechaModificacion') return "Contacto: Fecha de modificación";
      else if (columna == 'contacto-empresa') return "Contacto: Empresa";
      else if (columna == 'empresa-nombre') return "Empresa: Nombre";
      else if (columna == 'empresa-sector') return "Empresa: Sector";
      else if (columna == 'empresa-fechaCreacion') return "Empresa: Fecha de creación";
      else if (columna == 'empresa-fechaModificacion') return "Empresa: Fecha de modificación";
      else if (columna == 'empresa-tipo') return "Empresa: Tipo";
    }

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
    } else if (propiedad == "estado" && tipo=="5") {
      if (valorEvaluacion == "0") respuesta += "Suscriptor";
      else if (valorEvaluacion == "1") respuesta += "Lead";
      else if (valorEvaluacion == "2") respuesta += "Oportunidad";
      else if (valorEvaluacion == "3") respuesta += "Cliente";
    } else if (propiedad == "tipo"  && tipo=="6") {
      if (valorEvaluacion == "0") respuesta += "Cliente potencial";
      else if (valorEvaluacion == "1") respuesta += "Socio";
      else if (valorEvaluacion == "2") respuesta += "Revendedor";
      else if (valorEvaluacion == "3") respuesta += "Proveedor";
    } else if (propiedad == "servicioRed") {
      if (valorEvaluacion == "0") respuesta += "Facebook";
      else if (valorEvaluacion == "1") respuesta += "Linkedin";
      else if (valorEvaluacion == "2") respuesta += "Instagram";
    } else if (propiedad == "estado" && (tipo=="0" || tipo=="1" || tipo=="2" || tipo=="3" || tipo=="4")) {
        if (valorEvaluacion == "0") respuesta += "No vigente";
        else if (valorEvaluacion == "1") respuesta += "Vigente";
      }
      else if (propiedad == "tipo" && tipo=="2") {
        if (valorEvaluacion == "0") respuesta += "Campaña de programa";
        else if (valorEvaluacion == "1") respuesta += "Campaña stand-alone";
      }
      else if (propiedad == "tipo" && tipo=="3") {
        if (valorEvaluacion == "0") respuesta += "Correo";
        else if (valorEvaluacion == "1") respuesta += "Publicación";
        else if (valorEvaluacion == "2") respuesta += "Página web";
      }
      else if (propiedad == "tipo" && tipo=="4") {
        if (valorEvaluacion == "0") respuesta += "Negocio existente";
        else if (valorEvaluacion == "1") respuesta += "Nuevo negocio";
      }
      else if (propiedad == "etapa" && tipo=="4") {
        if (valorEvaluacion == "0") respuesta += "Calificación";
        else if (valorEvaluacion == "1") respuesta += "Necesidad de análisis";
        else if (valorEvaluacion == "2") respuesta += "Propuesta";
        else if (valorEvaluacion == "3") respuesta += "Negociación";
        else if (valorEvaluacion == "4") respuesta += "Perdida";
        else if (valorEvaluacion == "5") respuesta += "Ganada";
      }
    else {
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
      propietario: usuarioLogueado["idCuenta"], //falta
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
        setColumnas(data['columnas']);
        setFilas(data['filas']);
      })
      .catch((err) => alert(err));
  };

  const guardarReporte = () => {
    let cuerpo = {
      idReporte: 0,
      nombre: nombre,
      descripcion: descripcion,
      tipo: tipo,
      propietario: usuarioLogueado["idCuenta"], //falta
      filtros: filtros,
      columnas: columnas,
      filas: filas,
    };
    console.log("cuerpo a subir");
    console.log(cuerpo);
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .post("registrarReporte", cuerpo)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCargaDatos(false);
        setMostrarDatos(true);
        setShow(false);
        history.push({
          pathname: "/informes",
          state: { reporteGuardado: true },
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
              <h3 className="page-title"> Nuevo reporte </h3>
            </div>
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <h4 className="card-title col-md-8">Datos de reporte</h4>
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
                        <div className="col-md-12">
                          <Form.Group>
                            <label className="col-sm-12 col-form-label">
                              Tipo<code>*</code>
                            </label>
                            <div className="col-sm-12">
                              <select
                                className="form-control"
                                onChange={handleChangeTipo}
                              >
                                <option value={"0"} selected>
                                  Plan
                                </option>
                                <option value={"1"}>Programa</option>
                                <option value={"2"}>Campaña</option>
                                <option value={"3"}>Recurso</option>
                                <option value={"4"}>Oportunidad</option>
                                <option value={"5"}>Contacto</option>
                                <option value={"6"}>Empresa</option>
                              </select>
                            </div>
                          </Form.Group>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12">
                          <Form.Group className="row">
                            <label className="col-sm-7 col-form-label">
                              Filtros
                            </label>
                            <div className="col-sm-5">
                              <button
                                type="button"
                                className="btn btn-link float-sm-right"
                                onClick={handleAgregarFiltros}
                              >
                                Agregar nuevo filtro
                              </button>
                            </div>
                            <div className="col-md-4">
                              <Form.Group>
                                <div className="col-sm-12">
                                  {tipo == "0" && (
                                    <select
                                      className="form-control"
                                      id="propiedadFiltroNuevo"
                                      onChange={handleChangePropiedadFiltro}
                                    >
                                      <option
                                        value={""}
                                        disabled
                                        selected
                                        hidden
                                      >
                                        Propiedad
                                      </option>
                                      <option value={"descripcion"}>
                                        Descripción
                                      </option>
                                      <option value={"sponsor"}>Sponsor</option>
                                      <option value={"presupuesto"}>
                                        Presupuesto
                                      </option>
                                      <option value={"estado"}>Estado</option>
                                      <option value={"inicioVigencia"}>
                                        Inicio de vigencia
                                      </option>
                                      <option value={"finVigencia"}>
                                        Fin de vigencia
                                      </option>
                                      <option value={"fechaCreacion"}>
                                        Fecha de creación
                                      </option>
                                    </select>
                                  )}
                                  {tipo == "1" && (
                                    <select
                                      className="form-control"
                                      id="propiedadFiltroNuevo"
                                      onChange={handleChangePropiedadFiltro}
                                    >
                                      <option
                                        value={""}
                                        disabled
                                        selected
                                        hidden
                                      >
                                        Propiedad
                                      </option>
                                      <option value={"descripcion"}>
                                        Descripción
                                      </option>
                                      <option value={"sponsor"}>Sponsor</option>
                                      <option value={"presupuesto"}>
                                        Presupuesto
                                      </option>
                                      <option value={"estado"}>Estado</option>
                                      <option value={"inicioVigencia"}>
                                        Inicio de vigencia
                                      </option>
                                      <option value={"finVigencia"}>
                                        Fin de vigencia
                                      </option>
                                      <option value={"fechaCreacion"}>
                                        Fecha de creación
                                      </option>
                                    </select>
                                  )}
                                  {tipo == "2" && (
                                    <select
                                      className="form-control"
                                      id="propiedadFiltroNuevo"
                                      onChange={handleChangePropiedadFiltro}
                                    >
                                      <option
                                        value={""}
                                        disabled
                                        selected
                                        hidden
                                      >
                                        Propiedad
                                      </option>
                                      <option value={"descripcion"}>
                                        Descripción
                                      </option>
                                      <option value={"tipo"}>Tipo</option>
                                      <option value={"sponsor"}>Sponsor</option>
                                      <option value={"presupuesto"}>
                                        Presupuesto
                                      </option>
                                      <option value={"estado"}>Estado</option>
                                      <option value={"inicioVigencia"}>
                                        Inicio de vigencia
                                      </option>
                                      <option value={"finVigencia"}>
                                        Fin de vigencia
                                      </option>
                                      <option value={"fechaCreacion"}>
                                        Fecha de creación
                                      </option>
                                    </select>
                                  )}
                                  {tipo == "3" && (
                                    <select
                                      className="form-control"
                                      id="propiedadFiltroNuevo"
                                      onChange={handleChangePropiedadFiltro}
                                    >
                                      <option
                                        value={""}
                                        disabled
                                        selected
                                        hidden
                                      >
                                        Propiedad
                                      </option>
                                      <option value={"descripcion"}>
                                        Descripción
                                      </option>
                                      <option value={"tipo"}>Tipo</option>
                                      <option value={"sponsor"}>Sponsor</option>
                                      <option value={"presupuesto"}>
                                        Presupuesto
                                      </option>
                                      <option value={"estado"}>Estado</option>
                                      <option value={"inicioVigencia"}>
                                        Inicio de vigencia
                                      </option>
                                      <option value={"finVigencia"}>
                                        Fin de vigencia
                                      </option>
                                      <option value={"fechaCreacion"}>
                                        Fecha de creación
                                      </option>
                                    </select>
                                  )}
                                  {tipo == "4" && (
                                    <select
                                      className="form-control"
                                      id="propiedadFiltroNuevo"
                                      onChange={handleChangePropiedadFiltro}
                                    >
                                      <option
                                        value={""}
                                        disabled
                                        selected
                                        hidden
                                      >
                                        Propiedad
                                      </option>
                                      <option value={"descripcion"}>
                                        Descripción
                                      </option>
                                      <option value={"tipo"}>Tipo</option>
                                      <option value={"etapa"}>Etapa</option>
                                      <option value={"importe"}>Importe</option>
                                      <option value={"estado"}>Estado</option>
                                      <option value={"inicioVigencia"}>
                                        Inicio de vigencia
                                      </option>
                                      <option value={"finVigencia"}>
                                        Fin de vigencia
                                      </option>
                                      <option value={"fechaCreacion"}>
                                        Fecha de creación
                                      </option>
                                    </select>
                                  )}
                                  {tipo == "5" && (
                                    <select
                                      className="form-control"
                                      id="propiedadFiltroNuevo"
                                      onChange={handleChangePropiedadFiltro}
                                    >
                                      <option
                                        value={""}
                                        disabled
                                        selected
                                        hidden
                                      >
                                        Propiedad
                                      </option>
                                      <option value={"nombreCompleto"}>
                                        Nombre completo
                                      </option>

                                      <option value={"estado"}>Estado</option>
                                      <option value={"calificado"}>
                                        Calificado para campañas
                                      </option>

                                      <option value={"correo"}>Correo</option>
                                      <option value={"telefono"}>
                                        Teléfono
                                      </option>
                                      <option value={"paisDir"}>
                                        Dirección - País
                                      </option>
                                      <option value={"estadoDir"}>
                                        Dirección - Estado/Región
                                      </option>
                                      <option value={"ciudadDir"}>
                                        Dirección - Ciudad
                                      </option>
                                      <option value={"direccionDir"}>
                                        Dirección completa
                                      </option>

                                      <option value={"servicioRed"}>
                                        Red social
                                      </option>

                                      <option value={"empresa"}>
                                        Tiene empresa
                                      </option>
                                      <option value={"empresaNombre"}>
                                        Nombre de empresa
                                      </option>
                                      <option value={"fechaCreacion"}>
                                        Fecha de creación
                                      </option>
                                    </select>
                                  )}
                                  {tipo == "6" && (
                                    <select
                                      className="form-control"
                                      id="propiedadFiltroNuevo"
                                      onChange={handleChangePropiedadFiltro}
                                    >
                                      <option
                                        value={""}
                                        disabled
                                        selected
                                        hidden
                                      >
                                        Propiedad
                                      </option>
                                      <option value={"nombre"}>Nombre</option>
                                      <option value={"sector"}>Sector</option>
                                      <option value={"cantEmpleados"}>
                                        Cantidad de empleados
                                      </option>

                                      <option value={"tipo"}>Tipo</option>

                                      <option value={"telefono"}>
                                        Teléfono
                                      </option>
                                      <option value={"paisDir"}>
                                        Dirección - País
                                      </option>
                                      <option value={"estadoDir"}>
                                        Dirección - Estado/Región
                                      </option>
                                      <option value={"ciudadDir"}>
                                        Dirección - Ciudad
                                      </option>
                                      <option value={"direccionDir"}>
                                        Dirección completa
                                      </option>

                                      <option value={"contacto"}>
                                        Tiene contactos
                                      </option>
                                      <option value={"contactoNombre"}>
                                        Nombre completo de contacto
                                      </option>

                                      <option value={"fechaCreacion"}>
                                        Fecha de creación
                                      </option>
                                    </select>
                                  )}
                                </div>
                              </Form.Group>
                            </div>
                            <div className="col-md-4">
                              <Form.Group>
                                <div className="col-sm-12">
                                  <select
                                    className="form-control col-sm-11"
                                    id="evaluacionFiltroNuevo"
                                  >
                                    <option value={""} disabled selected hidden>
                                      Evaluación
                                    </option>
                                    {opcionesEvaluacion.map(
                                      ({ id, nombre }) => (
                                        <option value={id}>{nombre}</option>
                                      )
                                    )}
                                  </select>
                                </div>
                              </Form.Group>
                            </div>
                            <div className="col-md-4">
                              <Form.Group>
                                <div className="col-sm-12">
                                  {nuevoFiltroEvaluacion == "cadena" ? (
                                    <Form.Control
                                      type="text"
                                      id="valorEvaluacionFiltroNuevo"
                                      placeholder="Valor de evaluación"
                                    />
                                  ) : (
                                    ""
                                  )}
                                  {nuevoFiltroEvaluacion == "entero" ? (
                                    <Form.Control
                                      type="number"
                                      id="valorEvaluacionFiltroNuevo"
                                      placeholder="Valor de evaluación"
                                    />
                                  ) : (
                                    ""
                                  )}
                                  {nuevoFiltroEvaluacion == "fecha" ? (
                                    <DatePicker
                                      id="valorEvaluacionFiltroNuevo"
                                      className="form-control w-100"
                                      selected={nuevoFiltroFecha}
                                      onChange={(date) => {
                                        setNuevoFiltroFecha(date);
                                      }}
                                      dateFormat="dd/MM/yyyy"
                                    />
                                  ) : (
                                    ""
                                  )}
                                  {nuevoFiltroEvaluacion == "booleano" ? (
                                    <select
                                      className="form-control"
                                      id="valorEvaluacionFiltroNuevo"
                                      //onChange={handleChangePropiedadFiltro}
                                    >
                                      <option value={"0"} selected>
                                        No
                                      </option>
                                      <option value={"1"}>Sí</option>
                                    </select>
                                  ) : (
                                    ""
                                  )}
                                  {nuevoFiltroEvaluacion ==
                                  "contacto-estado" ? (
                                    <select
                                      className="form-control"
                                      id="valorEvaluacionFiltroNuevo"
                                      //onChange={handleChangePropiedadFiltro}
                                    >
                                      <option value={"0"} selected>
                                        Suscriptor
                                      </option>
                                      <option value={"1"}>Lead</option>
                                      <option value={"2"}>Oportunidad</option>
                                      <option value={"3"}>Cliente</option>
                                    </select>
                                  ) : (
                                    ""
                                  )}
                                  {nuevoFiltroEvaluacion == "empresa-tipo" ? (
                                    <select
                                      className="form-control"
                                      id="valorEvaluacionFiltroNuevo"
                                      //onChange={handleChangePropiedadFiltro}
                                    >
                                      <option value={"0"} selected>
                                        Cliente potencial
                                      </option>
                                      <option value={"1"}>Socio</option>
                                      <option value={"2"}>Revendedor</option>
                                      <option value={"3"}>Proveedor</option>
                                    </select>
                                  ) : (
                                    ""
                                  )}
                                  {nuevoFiltroEvaluacion == "red" ? (
                                    <select
                                      className="form-control"
                                      id="valorEvaluacionFiltroNuevo"
                                      //onChange={handleChangePropiedadFiltro}
                                    >
                                      <option value={"0"} selected>
                                        Facebook
                                      </option>
                                      <option value={"1"}>Linkedin</option>
                                      <option value={"2"}>Instagram</option>
                                    </select>
                                  ) : (
                                    ""
                                  )}
                                  {nuevoFiltroEvaluacion ==
                                  "marketing-estado" ? (
                                    <select
                                      className="form-control"
                                      id="valorEvaluacionFiltroNuevo"
                                      //onChange={handleChangePropiedadFiltro}
                                    >
                                      <option value={"0"} selected>
                                        No vigente
                                      </option>
                                      <option value={"1"}>Vigente</option>
                                    </select>
                                  ) : (
                                    ""
                                  )}
                                  {nuevoFiltroEvaluacion == "campana-tipo" ? (
                                    <select
                                      className="form-control"
                                      id="valorEvaluacionFiltroNuevo"
                                      //onChange={handleChangePropiedadFiltro}
                                    >
                                      <option value={"0"} selected>
                                        Campaña de programa
                                      </option>
                                      <option value={"1"}>
                                        Campaña stand-alone
                                      </option>
                                    </select>
                                  ) : (
                                    ""
                                  )}
                                  {nuevoFiltroEvaluacion == "recurso-tipo" ? (
                                    <select
                                      className="form-control"
                                      id="valorEvaluacionFiltroNuevo"
                                      //onChange={handleChangePropiedadFiltro}
                                    >
                                      <option value={"0"} selected>
                                        Correo
                                      </option>
                                      <option value={"1"}>Publicación</option>
                                      <option value={"2"}>Página web</option>
                                    </select>
                                  ) : (
                                    ""
                                  )}
                                  {nuevoFiltroEvaluacion ==
                                  "oportunidad-tipo" ? (
                                    <select
                                      className="form-control"
                                      id="valorEvaluacionFiltroNuevo"
                                      //onChange={handleChangePropiedadFiltro}
                                    >
                                      <option value={"0"} selected>
                                        Negocio existente
                                      </option>
                                      <option value={"1"}>Nuevo negocio</option>
                                    </select>
                                  ) : (
                                    ""
                                  )}
                                  {nuevoFiltroEvaluacion ==
                                  "oportunidad-etapa" ? (
                                    <select
                                      className="form-control"
                                      id="valorEvaluacionFiltroNuevo"
                                      //onChange={handleChangePropiedadFiltro}
                                    >
                                      <option value={"0"} selected>
                                        Calificación
                                      </option>
                                      <option value={"1"}>
                                        Necesidad de análisis
                                      </option>
                                      <option value={"2"}>Propuesta</option>
                                      <option value={"3"}>Negociación</option>
                                      <option value={"4"}>Perdida</option>
                                      <option value={"5"}>Ganada</option>
                                    </select>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </Form.Group>
                            </div>
                          </Form.Group>

                          {filtros.map(
                            ({
                              propiedad,
                              evaluacion,
                              valorEvaluacion,
                              nombre,
                            }) => (
                              <div
                                className="row"
                                key={propiedad + evaluacion + valorEvaluacion}
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
                                      <button
                                        style={{ marginLeft: "auto" }}
                                        type="button"
                                      >
                                        <i
                                          className="mdi mdi-delete"
                                          style={{ color: "black" }}
                                          onClick={handleEliminarFiltros(
                                            propiedad,
                                            evaluacion,
                                            valorEvaluacion
                                          )}
                                        ></i>
                                      </button>
                                    </label>
                                  </Form.Group>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12">
                          <Form.Group className="row">
                            <label className="col-sm-7 col-form-label">
                              Elementos
                            </label>
                            <div className="col-sm-5">
                              <button
                                type="button"
                                className="btn btn-link float-sm-right"
                                onClick={handleAplicarFiltros}
                              >
                                Aplicar filtros
                              </button>
                            </div>
                          </Form.Group>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12">
                          <Form.Group>
                            {mostrarCargaElementos && (
                              <div className="row h-100">
                                <div className="col-sm-12 my-auto">
                                  <div className="circle-loader"></div>
                                </div>
                              </div>
                            )}
                            {mostrarTablaElementos && (
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      {columnas.map((columna) => (
                                        <th>{mostrarColumnas(columna)}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filas.map((fila) => (
                                      <tr>
                                        {Object.keys(fila).map(
                                          (key) => (
                                            <td>{fila[key][1]}</td>
                                          )
                                        )}
                                      </tr>
                                    ))}
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
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                <h4 className="card-title" style={{ color: "#000000" }}>
                  Guardar reporte
                </h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5 className="card-title" style={{ color: "#000000" }}>
                ¿Desea guardar el reporte?
              </h5>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-outline-primary" onClick={handleClose}>
                Cancelar
              </button>

              <button className="btn btn-primary" onClick={guardarReporte}>
                Guardar
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default CrearReporte;
