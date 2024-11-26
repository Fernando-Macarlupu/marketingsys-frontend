import React, { useEffect, useState } from "react";
import { Form, FormGroup, Modal, Alert } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import bsCustomFileInput from "bs-custom-file-input";

const DetalleIndicador = () => {
  const history = useHistory();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [mostrarBuscarEmpresas, setMostrarBuscarEmpresas] = useState(false);
  const [mostrarTablaVariables, setMostrarTablaVariables] = useState(false);
  const [sintaxis, setSintaxis] = useState(false);
  const [mostrarMensajeFormula, setMostrarMensajeFormula] = useState(false);
  const [mostrarCargaDatos, setMostrarCargaDatos] = useState(false);
  const [mostrarDatos, setMostrarDatos] = useState(true);

  const [variablesBusqueda, setVariablesBusqueda] = useState([]);

  const [idIndicador, setIdIndicador] = useState(0);
  const [propietario, setPropietario] = useState(0);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [formula, setFormula] = useState("");
  const [tipo, setTipo] = useState("");
  const [variables, setVariables] = useState([]);

  const [automatica, setAutomatica] = useState(false);
  const [automatizado, setAutomatizado] = useState(false);

  const [usuarioLogueado, setUsuarioLogueado] = useState({});

  const [mostrarBuscarAsociaciones, setMostrarBuscarAsociaciones] =
    useState(false);
  const [mostrarTablaAsociaciones, setMostrarTablaAsociaciones] =
    useState(false);
  const [mostrarCargaAsociaciones, setMostrarCargaAsociaciones] =
    useState(false);
  const [asociacionCadena, setAsociacionCadena] = useState("");
  const [asociacionEstado, setAsociacionEstado] = useState("");
  const [asociaciones, setAsociaciones] = useState([]);
  const [asociacionesBusqueda, setAsociacionesBusqueda] = useState([]);

  const [mostrarBuscarVariables, setMostrarBuscarVariables] = useState(false);

  const [variableCadena, setVariableCadena] = useState("");
  const [variableTipo, setVariableTipo] = useState("");

  const handleAgregarAsociaciones = (id, descripcion, estado) => () => {
    for (let index = 0; index < asociaciones.length; index++) {
      const element = asociaciones[index];
      if (element["id"] == id) return;
    }
    setAsociaciones([
      ...asociaciones,
      {
        id: id,
        descripcion: descripcion,
        estado: estado,
        valor: 0.0,
      },
    ]);
  };
  const handleEliminarAsociaciones = (id) => () => {
    setAsociaciones((prev) => prev.filter((el) => el.id !== id));
  };

  const buscarPlanes = () => {
    let fechaHoy = "",
      fecha = new Date();

    fechaHoy =
      fecha.getDate() +
      "-" +
      parseInt(fecha.getMonth() + 1) +
      "-" +
      fecha.getFullYear();
    setMostrarTablaAsociaciones(false);
    setMostrarCargaAsociaciones(true);
    api
      .post("filtrarPlanes", {
        cadena: asociacionCadena,
        estado: asociacionEstado,
        fechaHoy: fechaHoy,
        fechaVigenciaIni: "",
        fechaVigenciaFin: "",
        propietario: propietario,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setAsociacionesBusqueda(data);
        setMostrarCargaAsociaciones(false);
        setMostrarTablaAsociaciones(true);
      })
      .catch((err) => alert(err));
  };
  const buscarPlanesCadena = (event) => {
    event.preventDefault();
    buscarPlanes();
  };

  const buscarProgramas = () => {
    let fechaHoy = "",
      fecha = new Date();

    fechaHoy =
      fecha.getDate() +
      "-" +
      parseInt(fecha.getMonth() + 1) +
      "-" +
      fecha.getFullYear();
    setMostrarTablaAsociaciones(false);
    setMostrarCargaAsociaciones(true);
    api
      .post("filtrarEstrategias", {
        cadena: asociacionCadena,
        estado: asociacionEstado,
        tipo: "0",
        fechaHoy: fechaHoy,
        fechaVigenciaIni: "",
        fechaVigenciaFin: "",
        propietario: propietario,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setAsociacionesBusqueda(data);
        setMostrarCargaAsociaciones(false);
        setMostrarTablaAsociaciones(true);
      })
      .catch((err) => alert(err));
  };
  const buscarProgramasCadena = (event) => {
    event.preventDefault();
    buscarProgramas();
  };

  const buscarCampanasStandalone = () => {
    let fechaHoy = "",
      fecha = new Date();

    fechaHoy =
      fecha.getDate() +
      "-" +
      parseInt(fecha.getMonth() + 1) +
      "-" +
      fecha.getFullYear();
    setMostrarTablaAsociaciones(false);
    setMostrarCargaAsociaciones(true);
    api
      .post("filtrarCampanas", {
        cadena: asociacionCadena,
        estado: asociacionEstado,
        tipo: "1",
        fechaHoy: fechaHoy,
        fechaVigenciaIni: "",
        fechaVigenciaFin: "",
        propietario: propietario,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setAsociacionesBusqueda(data);
        setMostrarCargaAsociaciones(false);
        setMostrarTablaAsociaciones(true);
      })
      .catch((err) => alert(err));
  };
  const buscarCampanasStandaloneCadena = (event) => {
    event.preventDefault();
    buscarCampanasStandalone();
  };

  const buscarCampanasPrograma = () => {
    let fechaHoy = "",
      fecha = new Date();

    fechaHoy =
      fecha.getDate() +
      "-" +
      parseInt(fecha.getMonth() + 1) +
      "-" +
      fecha.getFullYear();
    setMostrarTablaAsociaciones(false);
    setMostrarCargaAsociaciones(true);
    api
      .post("filtrarCampanas", {
        cadena: asociacionCadena,
        estado: asociacionEstado,
        tipo: "0",
        fechaHoy: fechaHoy,
        fechaVigenciaIni: "",
        fechaVigenciaFin: "",
        propietario: propietario,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setAsociacionesBusqueda(data);
        setMostrarCargaAsociaciones(false);
        setMostrarTablaAsociaciones(true);
      })
      .catch((err) => alert(err));
  };
  const buscarCampanasProgramaCadena = (event) => {
    event.preventDefault();
    buscarCampanasPrograma();
  };

  const buscarCorreos = () => {
    let fechaHoy = "",
      fecha = new Date();

    fechaHoy =
      fecha.getDate() +
      "-" +
      parseInt(fecha.getMonth() + 1) +
      "-" +
      fecha.getFullYear();
    setMostrarTablaAsociaciones(false);
    setMostrarCargaAsociaciones(true);
    api
      .post("filtrarRecursos", {
        cadena: asociacionCadena,
        estado: asociacionEstado,
        tipo: "0",
        fechaHoy: fechaHoy,
        fechaVigenciaIni: "",
        fechaVigenciaFin: "",
        propietario: propietario,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setAsociacionesBusqueda(data);
        setMostrarCargaAsociaciones(false);
        setMostrarTablaAsociaciones(true);
      })
      .catch((err) => alert(err));
  };
  const buscarCorreosCadena = (event) => {
    event.preventDefault();
    buscarCorreos();
  };

  const buscarPublicaciones = () => {
    let fechaHoy = "",
      fecha = new Date();

    fechaHoy =
      fecha.getDate() +
      "-" +
      parseInt(fecha.getMonth() + 1) +
      "-" +
      fecha.getFullYear();
    setMostrarTablaAsociaciones(false);
    setMostrarCargaAsociaciones(true);
    api
      .post("filtrarRecursos", {
        cadena: asociacionCadena,
        estado: asociacionEstado,
        tipo: "1",
        fechaHoy: fechaHoy,
        fechaVigenciaIni: "",
        fechaVigenciaFin: "",
        propietario: propietario,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setAsociacionesBusqueda(data);
        setMostrarCargaAsociaciones(false);
        setMostrarTablaAsociaciones(true);
      })
      .catch((err) => alert(err));
  };
  const buscarPublicacionesCadena = (event) => {
    event.preventDefault();
    buscarPublicaciones();
  };

  const buscarPaginas = () => {
    let fechaHoy = "",
      fecha = new Date();

    fechaHoy =
      fecha.getDate() +
      "-" +
      parseInt(fecha.getMonth() + 1) +
      "-" +
      fecha.getFullYear();
    setMostrarTablaAsociaciones(false);
    setMostrarCargaAsociaciones(true);
    api
      .post("filtrarRecursos", {
        cadena: asociacionCadena,
        estado: asociacionEstado,
        tipo: "2",
        fechaHoy: fechaHoy,
        fechaVigenciaIni: "",
        fechaVigenciaFin: "",
        propietario: propietario,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setAsociacionesBusqueda(data);
        setMostrarCargaAsociaciones(false);
        setMostrarTablaAsociaciones(true);
      })
      .catch((err) => alert(err));
  };
  const buscarPaginasCadena = (event) => {
    event.preventDefault();
    buscarPaginas();
  };

  const handleValorIndicadores = (id, event) => {
    const asociacionesLista = [];
    console.log(id);
    for (let index = 0; index < asociaciones.length; index++) {
      const element = asociaciones[index];
      if (element["id"] == id) element["valor"] = event.target.value;
      asociacionesLista.push(element);
    }
    console.log(asociacionesLista);
    setAsociaciones(asociacionesLista);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (nombre == "") alert("Ingrese el nombre del indicador");
    else {
      if (tipo == "") alert("Seleccione un tipo de asociación del indicador");
      else {
        let abreviaturas = [];
        let variablesEmpleadas = [];
        let operaciones = ["+", "-", "*", "/", "^", "(", ")"];
        for (let index = 0; index < variables.length; index++) {
          const element = variables[index];
          abreviaturas.push(element["abreviatura"]);
        }
        const elementos = formula.trim().split(" ");
        let formulaCambio = "";

        console.log(elementos);
        for (let index = 0; index < elementos.length; index++) {
          const element = elementos[index];
          if (
            !abreviaturas.includes(element) &&
            !operaciones.includes(element)
          ) {
            setSintaxis(false);
            alert(
              "La fórmula incluye términos que no son variables u operadores"
            );
          } else if (abreviaturas.includes(element)) {
            variablesEmpleadas.push(element);
            formulaCambio = formulaCambio + "1";
          } else if (operaciones.includes(element)) {
            formulaCambio = formulaCambio + element;
          }
        }

        try {
          eval(formulaCambio);
          setSintaxis(true);
        setShow(true);
        } catch (e) {
          setSintaxis(false);
          alert("La fórmula no puede ser evaluada");
        }
      }
    }
  };

  const handleAgregarVariables =
    (id, nombre, tipo, automatica, abreviatura) => () => {
      let automaticaVariables = true;
      for (let index = 0; index < variables.length; index++) {
        const element = variables[index];
        if (element["id"] == id) return;
        if (!element["automatica"]) {
          automaticaVariables = false;
          setAutomatizado(false);
        }
      }
      setVariables([
        ...variables,
        {
          id: id,
          nombre: nombre,
          tipo: tipo,
          automatica: automatica,
          abreviatura: abreviatura,
        },
      ]);
      console.log("valor de automatica");
      console.log(automatica);
      if (!automatica) {
        automaticaVariables = false;
        setAutomatizado(false);
      }
      setAutomatica(automaticaVariables);
    };

  const handleEliminarVariables = (id) => () => {
    let automaticaVariables = true;
    for (let index = 0; index < variables.length; index++) {
      const element = variables[index];
      if (!element["automatica"] && element["id"] != id) {
        automaticaVariables = false;
        setAutomatizado(false);
      }
    }
    setAutomatica(automaticaVariables);
    setVariables((prev) => prev.filter((el) => el.id !== id));
  };

  const handleChangeTipo = (event) => {
    setTipo(event.target.value);
    setVariables([]);
    setVariablesBusqueda([]);
    setMostrarBuscarVariables(false);
    setMostrarTablaVariables(false);
    setMostrarBuscarAsociaciones(false);
    setMostrarTablaAsociaciones(false);
    setMostrarCargaAsociaciones(false);
    setAsociacionCadena("");
    setAsociacionEstado("");
    setAsociaciones([]);
    setAsociacionesBusqueda([]);
    setFormula("");
  };

  const handleChangeAutomatizado = (event) => {
    setAutomatizado(!automatizado);
  };

  const buscarVariables = () => {
    setMostrarTablaVariables(true);
    api
      .post("filtrarVariables", {
        cadena: variableCadena,
        tipo: tipo,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setVariablesBusqueda(data);
      })
      .catch((err) => alert(err));
  };

  const buscarVariablesCadena = (event) => {
    event.preventDefault();
    buscarVariables();
  };

  const handleAgregarEnFormula = (event) => {
    setFormula(formula + event.target.value + " ");
    event.target.value = "";
  };

  const comprobarSintaxis = () => {
    let abreviaturas = [];
    let variablesEmpleadas = [];
    let operaciones = ["+", "-", "*", "/", "^", "(", ")"];
    for (let index = 0; index < variables.length; index++) {
      const element = variables[index];
      abreviaturas.push(element["abreviatura"]);
    }
    const elementos = formula.trim().split(" ");
    let formulaCambio = "";

    console.log(elementos);
    for (let index = 0; index < elementos.length; index++) {
      const element = elementos[index];
      if (!abreviaturas.includes(element) && !operaciones.includes(element)) {
        setSintaxis(false);
        alert("La fórmula incluye términos que no son variables u operadores");
      } else if (abreviaturas.includes(element)) {
        variablesEmpleadas.push(element);
        formulaCambio = formulaCambio + "1";
      } else if (operaciones.includes(element)) {
        formulaCambio = formulaCambio + element;
      }
    }

    try {
      eval(formulaCambio);
      setMostrarMensajeFormula(true);
        setTimeout(() => {
          setMostrarMensajeFormula(false);
        }, 5000);
    setSintaxis(true);
    } catch (e) {
      setSintaxis(false);
      alert("La fórmula no puede ser evaluada");
    }
  };

  const guardarIndicador = () => {
    let cuerpo = {
      idIndicador: idIndicador,
      nombre: nombre,
      descripcion: descripcion,
      formula: formula,
      tipo: tipo,
      automatica: automatica,
      calculoAutomatico: automatizado,
      propietario: propietario,
      variables: variables,
      asociaciones: asociaciones,
    };
    console.log("cuerpo a subir");
    console.log(cuerpo);
    api
      .post("registrarIndicador", cuerpo)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setShow(false);
        history.push({
          pathname: "/indicadores",
          state: { indicadorGuardado: true },
        });
      })
      .catch((err) => alert(err));
  };

  const cargarIndicador = () => {
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .get(`detalleIndicador/${location.state.idIndicador}`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setIdIndicador(parseInt(data["idIndicador"]));
        setNombre(data["nombre"]);
        setDescripcion(data["descripcion"]);
        setFormula(data["formula"]);
        setTipo(data["tipo"]);
        setAutomatica(data["automatica"]);
        setAutomatizado(data["calculoAutomatico"]);
        setPropietario(parseInt(data["propietario"]));
        setVariables(data["variables"]);
        setAsociaciones(data["asociaciones"]);
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
    cargarIndicador();
    //cargarCorreosNoDisponibles(usuarioPropiedades["idCuenta"]);
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
          <h3 className="page-title"> Detalle de indicador </h3>
        </div>
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <h4 className="card-title col-md-8">Datos de indicador</h4>
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
                            onChange={({ target }) => setNombre(target.value)}
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
                          Asociado a <code>*</code>
                        </label>
                        <div className="col-sm-12">
                          <select
                            className="form-control"
                            value={tipo}
                            onChange={handleChangeTipo}
                          >
                            <option value="" disabled selected hidden>
                              Seleccionar asociación
                            </option>
                            <option value={"0"}>Plan</option>
                            <option value={"1"}>Programa</option>
                            <option value={"2"}>Campaña stand-alone</option>
                            <option value={"3"}>Campaña de programa</option>
                            <option value={"4"}>Correo</option>
                            <option value={"5"}>Publicación</option>
                            <option value={"6"}>Página web</option>
                          </select>
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
                            checked={automatizado}
                            onChange={handleChangeAutomatizado}
                            disabled={!automatica}
                          />
                          <label
                            className="custom-control-label"
                            for="calificadoValor"
                          >
                            Habilitado para automatización
                          </label>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-8">
                      <Form.Group>
                        <label>
                          <span className="icon-bg">
                            <i
                              className="mdi mdi-alert-circle-outline"
                              style={{ color: "#E4A11B" }}
                            ></i>
                          </span>
                          <span>
                            El indicador estará habilitado para automatización
                            en caso todas sus variables lo estén
                          </span>
                        </label>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <Form.Group>
                        <label className="col-sm-7 col-form-label">
                          Variables
                        </label>
                        <button
                          type="button"
                          className="btn btn-link float-sm-right"
                          onClick={() => {
                            if (tipo != "")
                              setMostrarBuscarVariables(
                                !mostrarBuscarVariables
                              );
                          }}
                        >
                          Buscar variables
                        </button>
                      </Form.Group>
                    </div>
                  </div>
                  {variables.length == 0 ? (
                    <Form.Group>
                      <label className="col-sm-12 col-form-label">
                        No se han registrado variables
                      </label>
                    </Form.Group>
                  ) : (
                    <div className="row">
                      <div className="col-md-12">
                        <Form.Group>
                          <div className="col-sm-12">
                            <div className="table-responsive">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Automatización habilitada</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {variables.map((variable) => (
                                    <tr key={variable["id"]}>
                                      <td>{variable["nombre"]}</td>
                                      <td>{variable["tipo"]}</td>
                                      <td>
                                        {variable["automatica"] ? "Sí" : "No"}
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          onClick={handleEliminarVariables(
                                            variable["id"]
                                          )}
                                        >
                                          <i
                                            className="mdi mdi-delete"
                                            style={{ color: "black" }}
                                          ></i>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </Form.Group>
                      </div>
                    </div>
                  )}

                  {mostrarBuscarVariables && (
                    <div>
                      <div className="row">
                        <div className="col-md-11">
                          <Form.Group>
                            <div className="search-field col-sm-8">
                              <form
                                className="d-flex align-items-center h-100"
                                onSubmit={buscarVariablesCadena}
                              >
                                <div className="input-group">
                                  <div className="input-group-prepend bg-white">
                                    <i className="input-group-text border-0 mdi mdi-magnify"></i>
                                  </div>
                                  <input
                                    type="text"
                                    className="form-control bg-white border-0"
                                    placeholder="Nombre"
                                    value={variableCadena}
                                    onChange={({ target }) =>
                                      setVariableCadena(target.value)
                                    }
                                  />
                                </div>
                              </form>
                            </div>
                          </Form.Group>
                        </div>

                        {/* <div className="col-md-4">
                          <Form.Group>
                            <select
                              className="form-control col-sm-11"
                              onChange={({ target }) =>
                                setVariableTipo(target.value)
                              }
                            >
                              <option value="" disabled selected hidden>
                                Tipo
                              </option>
                              <option value={""}>Todos</option>
                              <option value={"0"}>Plan</option>
                              <option value={"1"}>Programa</option>
                              <option value={"2"}>Campaña stand-alone</option>
                              <option value={"3"}>Campaña de programa</option>
                              <option value={"4"}>Correo</option>
                              <option value={"5"}>Publicación</option>
                              <option value={"6"}>Página web</option>
                            </select>
                          </Form.Group>
                        </div> */}

                        <div className="col-md-1">
                          <Form.Group>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={buscarVariables}
                            >
                              Buscar
                            </button>
                          </Form.Group>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <Form.Group>
                            <div className="col-sm-12">
                              <div className="table-responsive">
                                {mostrarTablaVariables && (
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th>Nombre</th>
                                        <th>Tipo</th>
                                        <th>Automatización habilitada</th>
                                        <th></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {variablesBusqueda.map((variable) => (
                                        <tr
                                          key={
                                            String(variable["id"]) +
                                            " - busqueda"
                                          }
                                        >
                                          <td>{variable["nombre"]}</td>
                                          <td>{variable["tipo"]}</td>
                                          <td>
                                            {variable["automatica"]
                                              ? "Sí"
                                              : "No"}
                                          </td>
                                          <td>
                                            <button
                                              type="button"
                                              onClick={handleAgregarVariables(
                                                variable["id"],
                                                variable["nombre"],
                                                variable["tipo"],
                                                variable["automatica"],
                                                variable["abreviatura"]
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
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group>
                        <label className="col-sm-12 col-form-label">
                          Agregar variable a la fórmula
                        </label>
                        <div className="col-sm-12">
                          <select
                            className="form-control"
                            onChange={handleAgregarEnFormula}
                          >
                            <option value={""} disabled selected hidden>
                              Seleccionar variable
                            </option>
                            {variables.map(({ nombre, abreviatura }) => (
                              <option value={abreviatura}>
                                {nombre + " (" + abreviatura + ")"}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <label className="col-sm-12 col-form-label">
                          Agregar operador a la fórmula
                        </label>
                        <div className="col-sm-12">
                          <select
                            className="form-control"
                            onChange={handleAgregarEnFormula}
                          >
                            <option value={""} disabled selected hidden>
                              Seleccionar operador
                            </option>
                            <option value={"+"}>+</option>
                            <option value={"-"}>-</option>
                            <option value={"*"}>*</option>
                            <option value={"/"}>/</option>
                            <option value={"^"}>^</option>
                            <option value={"("}>{"("}</option>
                            <option value={")"}>{")"}</option>
                          </select>
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Form.Group>
                        <label className="col-sm-12 col-form-label">
                          Fórmula de cálculo
                        </label>
                        <div className="col-sm-12">
                          <Form.Control
                            type="text"
                            value={formula}
                            onChange={({ target }) => setFormula(target.value)}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-2">
                      <Form.Group>
                      <div className="col-sm-12">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={comprobarSintaxis}
                        >
                          Comprobar sintáxis
                        </button>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-3">
                      <Form.Group>
                    <Alert
                      show={mostrarMensajeFormula}
                      variant="success"
                      className="small text-center"
                    >
                      {" "}
                      <i className="px-2 mdi mdi-check-circle"></i>
                      Fórmula validada correctamente
                    </Alert>
                    </Form.Group>
                    </div>
                    <div className="col-md-7">
                      <Form.Group>
                        <label>
                          <span className="icon-bg">
                            <i
                              className="mdi mdi-alert-circle-outline"
                              style={{ color: "#E4A11B" }}
                            ></i>
                          </span>
                          <span>
                            La fórmula debe contener abreviaturas de las
                            variables y operadores separados por espacios
                          </span>
                        </label>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Form.Group>
                        <label className="col-sm-12 col-form-label">
                          Asignaciones
                        </label>
                      </Form.Group>
                    </div>
                  </div>
                  {tipo == "0" && (
                    <div>
                      <div className="row">
                        <div className="col-md-12">
                          <Form.Group>
                            <label className="col-sm-7 col-form-label">
                              Planes
                            </label>
                            <button
                              type="button"
                              className="btn btn-link float-sm-right"
                              onClick={() =>
                                setMostrarBuscarAsociaciones(
                                  !mostrarBuscarAsociaciones
                                )
                              }
                            >
                              Buscar planes
                            </button>
                          </Form.Group>
                          {asociaciones.length == 0 ? (
                            <Form.Group>
                              <label className="col-sm-12 col-form-label">
                                No se han registrado planes
                              </label>
                            </Form.Group>
                          ) : (
                            <Form.Group>
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Descripción</th>
                                      <th>Estado</th>
                                      <th>Valor</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {asociaciones.map((asociacion) => (
                                      <tr key={asociacion["id"]}>
                                        <td>{asociacion["descripcion"]}</td>
                                        <td>{asociacion["estado"]}</td>
                                        <td>
                                          <input
                                            type={"number"}
                                            placeholder="Agregar valor"
                                            className="form-control"
                                            disabled={automatizado}
                                            onChange={(e) =>
                                              handleValorIndicadores(
                                                asociacion["id"],
                                                e
                                              )
                                            }
                                            value={asociacion["valor"]}
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
                                              onClick={handleEliminarAsociaciones(
                                                asociacion["id"]
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

                      {mostrarBuscarAsociaciones && (
                        <div>
                          <div className="row">
                            <div className="col-md-7">
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
                                        value={asociacionCadena}
                                        onChange={({ target }) =>
                                          setAsociacionCadena(target.value)
                                        }
                                      />
                                    </div>
                                  </form>
                                </div>
                              </Form.Group>
                            </div>

                            <div className="col-md-4">
                              <Form.Group>
                                <select
                                  className="form-control col-sm-11"
                                  onChange={({ target }) =>
                                    setAsociacionEstado(target.value)
                                  }
                                >
                                  <option value="" disabled selected hidden>
                                    Estado
                                  </option>
                                  <option value={""}>Todos los estados</option>
                                  <option value={"0"}>No vigente</option>
                                  <option value={"1"}>Vigente</option>
                                </select>
                              </Form.Group>
                            </div>

                            <div className="col-md-1">
                              <Form.Group>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={buscarPlanes}
                                >
                                  Buscar
                                </button>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                {mostrarCargaAsociaciones && (
                                  <div className="row h-100">
                                    <div className="col-sm-12 my-auto">
                                      <div className="circle-loader"></div>
                                    </div>
                                  </div>
                                )}
                                {mostrarTablaAsociaciones && (
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>Descripción</th>
                                          <th>Estado</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {asociacionesBusqueda.map(
                                          (asociacion) => (
                                            <tr key={asociacion["id"]}>
                                              <td>
                                                {asociacion["descripcion"]}
                                              </td>
                                              <td>{asociacion["estado"]}</td>
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
                                                    onClick={handleAgregarAsociaciones(
                                                      asociacion["id"],
                                                      asociacion["descripcion"],
                                                      asociacion["estado"]
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
                    </div>
                  )}
                  {tipo == "1" && (
                    <div>
                      <div className="row">
                        <div className="col-md-12">
                          <Form.Group>
                            <label className="col-sm-7 col-form-label">
                              Programas
                            </label>
                            <button
                              type="button"
                              className="btn btn-link float-sm-right"
                              onClick={() =>
                                setMostrarBuscarAsociaciones(
                                  !mostrarBuscarAsociaciones
                                )
                              }
                            >
                              Buscar programas
                            </button>
                          </Form.Group>
                          {asociaciones.length == 0 ? (
                            <Form.Group>
                              <label className="col-sm-12 col-form-label">
                                No se han registrado programas
                              </label>
                            </Form.Group>
                          ) : (
                            <Form.Group>
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Descripción</th>
                                      <th>Estado</th>
                                      <th>Valor</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {asociaciones.map((asociacion) => (
                                      <tr key={asociacion["id"]}>
                                        <td>{asociacion["descripcion"]}</td>
                                        <td>{asociacion["estado"]}</td>
                                        <td>
                                          <input
                                            type={"number"}
                                            placeholder="Agregar valor"
                                            className="form-control"
                                            disabled={automatizado}
                                            onChange={(e) =>
                                              handleValorIndicadores(
                                                asociacion["id"],
                                                e
                                              )
                                            }
                                            value={asociacion["valor"]}
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
                                              onClick={handleEliminarAsociaciones(
                                                asociacion["id"]
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

                      {mostrarBuscarAsociaciones && (
                        <div>
                          <div className="row">
                            <div className="col-md-7">
                              <Form.Group>
                                <div className="search-field col-sm-12">
                                  <form
                                    className="d-flex align-items-center h-100"
                                    onSubmit={buscarProgramasCadena}
                                  >
                                    <div className="input-group">
                                      <div className="input-group-prepend bg-white">
                                        <i className="input-group-text border-0 mdi mdi-magnify"></i>
                                      </div>
                                      <input
                                        type="text"
                                        className="form-control bg-white border-0"
                                        placeholder="Descripción"
                                        value={asociacionCadena}
                                        onChange={({ target }) =>
                                          setAsociacionCadena(target.value)
                                        }
                                      />
                                    </div>
                                  </form>
                                </div>
                              </Form.Group>
                            </div>

                            <div className="col-md-4">
                              <Form.Group>
                                <select
                                  className="form-control col-sm-11"
                                  onChange={({ target }) =>
                                    setAsociacionEstado(target.value)
                                  }
                                >
                                  <option value="" disabled selected hidden>
                                    Estado
                                  </option>
                                  <option value={""}>Todos los estados</option>
                                  <option value={"0"}>No vigente</option>
                                  <option value={"1"}>Vigente</option>
                                </select>
                              </Form.Group>
                            </div>

                            <div className="col-md-1">
                              <Form.Group>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={buscarProgramas}
                                >
                                  Buscar
                                </button>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                {mostrarCargaAsociaciones && (
                                  <div className="row h-100">
                                    <div className="col-sm-12 my-auto">
                                      <div className="circle-loader"></div>
                                    </div>
                                  </div>
                                )}
                                {mostrarTablaAsociaciones && (
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>Descripción</th>
                                          <th>Estado</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {asociacionesBusqueda.map(
                                          (asociacion) => (
                                            <tr key={asociacion["id"]}>
                                              <td>
                                                {asociacion["descripcion"]}
                                              </td>
                                              <td>{asociacion["estado"]}</td>
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
                                                    onClick={handleAgregarAsociaciones(
                                                      asociacion["id"],
                                                      asociacion["descripcion"],
                                                      asociacion["estado"]
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
                    </div>
                  )}
                  {tipo == "2" && (
                    <div>
                      <div className="row">
                        <div className="col-md-12">
                          <Form.Group>
                            <label className="col-sm-7 col-form-label">
                              Campañas stand-alone
                            </label>
                            <button
                              type="button"
                              className="btn btn-link float-sm-right"
                              onClick={() =>
                                setMostrarBuscarAsociaciones(
                                  !mostrarBuscarAsociaciones
                                )
                              }
                            >
                              Buscar campañas
                            </button>
                          </Form.Group>
                          {asociaciones.length == 0 ? (
                            <Form.Group>
                              <label className="col-sm-12 col-form-label">
                                No se han registrado campañas
                              </label>
                            </Form.Group>
                          ) : (
                            <Form.Group>
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Descripción</th>
                                      <th>Estado</th>
                                      <th>Valor</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {asociaciones.map((asociacion) => (
                                      <tr key={asociacion["id"]}>
                                        <td>{asociacion["descripcion"]}</td>
                                        <td>{asociacion["estado"]}</td>
                                        <td>
                                          <input
                                            type={"number"}
                                            placeholder="Agregar valor"
                                            className="form-control"
                                            disabled={automatizado}
                                            onChange={(e) =>
                                              handleValorIndicadores(
                                                asociacion["id"],
                                                e
                                              )
                                            }
                                            value={asociacion["valor"]}
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
                                              onClick={handleEliminarAsociaciones(
                                                asociacion["id"]
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

                      {mostrarBuscarAsociaciones && (
                        <div>
                          <div className="row">
                            <div className="col-md-7">
                              <Form.Group>
                                <div className="search-field col-sm-12">
                                  <form
                                    className="d-flex align-items-center h-100"
                                    onSubmit={buscarCampanasStandaloneCadena}
                                  >
                                    <div className="input-group">
                                      <div className="input-group-prepend bg-white">
                                        <i className="input-group-text border-0 mdi mdi-magnify"></i>
                                      </div>
                                      <input
                                        type="text"
                                        className="form-control bg-white border-0"
                                        placeholder="Descripción"
                                        value={asociacionCadena}
                                        onChange={({ target }) =>
                                          setAsociacionCadena(target.value)
                                        }
                                      />
                                    </div>
                                  </form>
                                </div>
                              </Form.Group>
                            </div>

                            <div className="col-md-4">
                              <Form.Group>
                                <select
                                  className="form-control col-sm-11"
                                  onChange={({ target }) =>
                                    setAsociacionEstado(target.value)
                                  }
                                >
                                  <option value="" disabled selected hidden>
                                    Estado
                                  </option>
                                  <option value={""}>Todos los estados</option>
                                  <option value={"0"}>No vigente</option>
                                  <option value={"1"}>Vigente</option>
                                </select>
                              </Form.Group>
                            </div>

                            <div className="col-md-1">
                              <Form.Group>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={buscarCampanasStandalone}
                                >
                                  Buscar
                                </button>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                {mostrarCargaAsociaciones && (
                                  <div className="row h-100">
                                    <div className="col-sm-12 my-auto">
                                      <div className="circle-loader"></div>
                                    </div>
                                  </div>
                                )}
                                {mostrarTablaAsociaciones && (
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>Descripción</th>
                                          <th>Estado</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {asociacionesBusqueda.map(
                                          (asociacion) => (
                                            <tr key={asociacion["id"]}>
                                              <td>
                                                {asociacion["descripcion"]}
                                              </td>
                                              <td>{asociacion["estado"]}</td>
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
                                                    onClick={handleAgregarAsociaciones(
                                                      asociacion["id"],
                                                      asociacion["descripcion"],
                                                      asociacion["estado"]
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
                    </div>
                  )}
                  {tipo == "3" && (
                    <div>
                      <div className="row">
                        <div className="col-md-12">
                          <Form.Group>
                            <label className="col-sm-7 col-form-label">
                              Campañas de programa
                            </label>
                            <button
                              type="button"
                              className="btn btn-link float-sm-right"
                              onClick={() =>
                                setMostrarBuscarAsociaciones(
                                  !mostrarBuscarAsociaciones
                                )
                              }
                            >
                              Buscar campañas
                            </button>
                          </Form.Group>
                          {asociaciones.length == 0 ? (
                            <Form.Group>
                              <label className="col-sm-12 col-form-label">
                                No se han registrado campañas
                              </label>
                            </Form.Group>
                          ) : (
                            <Form.Group>
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Descripción</th>
                                      <th>Estado</th>
                                      <th>Valor</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {asociaciones.map((asociacion) => (
                                      <tr key={asociacion["id"]}>
                                        <td>{asociacion["descripcion"]}</td>
                                        <td>{asociacion["estado"]}</td>
                                        <td>
                                          <input
                                            type={"number"}
                                            placeholder="Agregar valor"
                                            className="form-control"
                                            disabled={automatizado}
                                            onChange={(e) =>
                                              handleValorIndicadores(
                                                asociacion["id"],
                                                e
                                              )
                                            }
                                            value={asociacion["valor"]}
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
                                              onClick={handleEliminarAsociaciones(
                                                asociacion["id"]
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

                      {mostrarBuscarAsociaciones && (
                        <div>
                          <div className="row">
                            <div className="col-md-7">
                              <Form.Group>
                                <div className="search-field col-sm-12">
                                  <form
                                    className="d-flex align-items-center h-100"
                                    onSubmit={buscarCampanasProgramaCadena}
                                  >
                                    <div className="input-group">
                                      <div className="input-group-prepend bg-white">
                                        <i className="input-group-text border-0 mdi mdi-magnify"></i>
                                      </div>
                                      <input
                                        type="text"
                                        className="form-control bg-white border-0"
                                        placeholder="Descripción"
                                        value={asociacionCadena}
                                        onChange={({ target }) =>
                                          setAsociacionCadena(target.value)
                                        }
                                      />
                                    </div>
                                  </form>
                                </div>
                              </Form.Group>
                            </div>

                            <div className="col-md-4">
                              <Form.Group>
                                <select
                                  className="form-control col-sm-11"
                                  onChange={({ target }) =>
                                    setAsociacionEstado(target.value)
                                  }
                                >
                                  <option value="" disabled selected hidden>
                                    Estado
                                  </option>
                                  <option value={""}>Todos los estados</option>
                                  <option value={"0"}>No vigente</option>
                                  <option value={"1"}>Vigente</option>
                                </select>
                              </Form.Group>
                            </div>

                            <div className="col-md-1">
                              <Form.Group>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={buscarCampanasPrograma}
                                >
                                  Buscar
                                </button>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                {mostrarCargaAsociaciones && (
                                  <div className="row h-100">
                                    <div className="col-sm-12 my-auto">
                                      <div className="circle-loader"></div>
                                    </div>
                                  </div>
                                )}
                                {mostrarTablaAsociaciones && (
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>Descripción</th>
                                          <th>Estado</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {asociacionesBusqueda.map(
                                          (asociacion) => (
                                            <tr key={asociacion["id"]}>
                                              <td>
                                                {asociacion["descripcion"]}
                                              </td>
                                              <td>{asociacion["estado"]}</td>
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
                                                    onClick={handleAgregarAsociaciones(
                                                      asociacion["id"],
                                                      asociacion["descripcion"],
                                                      asociacion["estado"]
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
                    </div>
                  )}
                  {tipo == "4" && (
                    <div>
                      <div className="row">
                        <div className="col-md-12">
                          <Form.Group>
                            <label className="col-sm-7 col-form-label">
                              Correos
                            </label>
                            <button
                              type="button"
                              className="btn btn-link float-sm-right"
                              onClick={() =>
                                setMostrarBuscarAsociaciones(
                                  !mostrarBuscarAsociaciones
                                )
                              }
                            >
                              Buscar correos
                            </button>
                          </Form.Group>
                          {asociaciones.length == 0 ? (
                            <Form.Group>
                              <label className="col-sm-12 col-form-label">
                                No se han registrado correos
                              </label>
                            </Form.Group>
                          ) : (
                            <Form.Group>
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Descripción</th>
                                      <th>Estado</th>
                                      <th>Valor</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {asociaciones.map((asociacion) => (
                                      <tr key={asociacion["id"]}>
                                        <td>{asociacion["descripcion"]}</td>
                                        <td>{asociacion["estado"]}</td>
                                        <td>
                                          <input
                                            type={"number"}
                                            placeholder="Agregar valor"
                                            className="form-control"
                                            disabled={automatizado}
                                            onChange={(e) =>
                                              handleValorIndicadores(
                                                asociacion["id"],
                                                e
                                              )
                                            }
                                            value={asociacion["valor"]}
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
                                              onClick={handleEliminarAsociaciones(
                                                asociacion["id"]
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

                      {mostrarBuscarAsociaciones && (
                        <div>
                          <div className="row">
                            <div className="col-md-7">
                              <Form.Group>
                                <div className="search-field col-sm-12">
                                  <form
                                    className="d-flex align-items-center h-100"
                                    onSubmit={buscarCorreosCadena}
                                  >
                                    <div className="input-group">
                                      <div className="input-group-prepend bg-white">
                                        <i className="input-group-text border-0 mdi mdi-magnify"></i>
                                      </div>
                                      <input
                                        type="text"
                                        className="form-control bg-white border-0"
                                        placeholder="Descripción"
                                        value={asociacionCadena}
                                        onChange={({ target }) =>
                                          setAsociacionCadena(target.value)
                                        }
                                      />
                                    </div>
                                  </form>
                                </div>
                              </Form.Group>
                            </div>

                            <div className="col-md-4">
                              <Form.Group>
                                <select
                                  className="form-control col-sm-11"
                                  onChange={({ target }) =>
                                    setAsociacionEstado(target.value)
                                  }
                                >
                                  <option value="" disabled selected hidden>
                                    Estado
                                  </option>
                                  <option value={""}>Todos los estados</option>
                                  <option value={"0"}>No vigente</option>
                                  <option value={"1"}>Vigente</option>
                                </select>
                              </Form.Group>
                            </div>

                            <div className="col-md-1">
                              <Form.Group>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={buscarCorreos}
                                >
                                  Buscar
                                </button>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                {mostrarCargaAsociaciones && (
                                  <div className="row h-100">
                                    <div className="col-sm-12 my-auto">
                                      <div className="circle-loader"></div>
                                    </div>
                                  </div>
                                )}
                                {mostrarTablaAsociaciones && (
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>Descripción</th>
                                          <th>Estado</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {asociacionesBusqueda.map(
                                          (asociacion) => (
                                            <tr key={asociacion["id"]}>
                                              <td>
                                                {asociacion["descripcion"]}
                                              </td>
                                              <td>{asociacion["estado"]}</td>
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
                                                    onClick={handleAgregarAsociaciones(
                                                      asociacion["id"],
                                                      asociacion["descripcion"],
                                                      asociacion["estado"]
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
                    </div>
                  )}
                  {tipo == "5" && (
                    <div>
                      <div className="row">
                        <div className="col-md-12">
                          <Form.Group>
                            <label className="col-sm-7 col-form-label">
                              Publicaciones
                            </label>
                            <button
                              type="button"
                              className="btn btn-link float-sm-right"
                              onClick={() =>
                                setMostrarBuscarAsociaciones(
                                  !mostrarBuscarAsociaciones
                                )
                              }
                            >
                              Buscar publicaciones
                            </button>
                          </Form.Group>
                          {asociaciones.length == 0 ? (
                            <Form.Group>
                              <label className="col-sm-12 col-form-label">
                                No se han registrado publicaciones
                              </label>
                            </Form.Group>
                          ) : (
                            <Form.Group>
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Descripción</th>
                                      <th>Estado</th>
                                      <th>Valor</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {asociaciones.map((asociacion) => (
                                      <tr key={asociacion["id"]}>
                                        <td>{asociacion["descripcion"]}</td>
                                        <td>{asociacion["estado"]}</td>
                                        <td>
                                          <input
                                            type={"number"}
                                            placeholder="Agregar valor"
                                            className="form-control"
                                            disabled={automatizado}
                                            onChange={(e) =>
                                              handleValorIndicadores(
                                                asociacion["id"],
                                                e
                                              )
                                            }
                                            value={asociacion["valor"]}
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
                                              onClick={handleEliminarAsociaciones(
                                                asociacion["id"]
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

                      {mostrarBuscarAsociaciones && (
                        <div>
                          <div className="row">
                            <div className="col-md-7">
                              <Form.Group>
                                <div className="search-field col-sm-12">
                                  <form
                                    className="d-flex align-items-center h-100"
                                    onSubmit={buscarPublicacionesCadena}
                                  >
                                    <div className="input-group">
                                      <div className="input-group-prepend bg-white">
                                        <i className="input-group-text border-0 mdi mdi-magnify"></i>
                                      </div>
                                      <input
                                        type="text"
                                        className="form-control bg-white border-0"
                                        placeholder="Descripción"
                                        value={asociacionCadena}
                                        onChange={({ target }) =>
                                          setAsociacionCadena(target.value)
                                        }
                                      />
                                    </div>
                                  </form>
                                </div>
                              </Form.Group>
                            </div>

                            <div className="col-md-4">
                              <Form.Group>
                                <select
                                  className="form-control col-sm-11"
                                  onChange={({ target }) =>
                                    setAsociacionEstado(target.value)
                                  }
                                >
                                  <option value="" disabled selected hidden>
                                    Estado
                                  </option>
                                  <option value={""}>Todos los estados</option>
                                  <option value={"0"}>No vigente</option>
                                  <option value={"1"}>Vigente</option>
                                </select>
                              </Form.Group>
                            </div>

                            <div className="col-md-1">
                              <Form.Group>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={buscarPublicaciones}
                                >
                                  Buscar
                                </button>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                {mostrarCargaAsociaciones && (
                                  <div className="row h-100">
                                    <div className="col-sm-12 my-auto">
                                      <div className="circle-loader"></div>
                                    </div>
                                  </div>
                                )}
                                {mostrarTablaAsociaciones && (
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>Descripción</th>
                                          <th>Estado</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {asociacionesBusqueda.map(
                                          (asociacion) => (
                                            <tr key={asociacion["id"]}>
                                              <td>
                                                {asociacion["descripcion"]}
                                              </td>
                                              <td>{asociacion["estado"]}</td>
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
                                                    onClick={handleAgregarAsociaciones(
                                                      asociacion["id"],
                                                      asociacion["descripcion"],
                                                      asociacion["estado"]
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
                    </div>
                  )}
                  {tipo == "6" && (
                    <div>
                      <div className="row">
                        <div className="col-md-12">
                          <Form.Group>
                            <label className="col-sm-7 col-form-label">
                              Página web
                            </label>
                            <button
                              type="button"
                              className="btn btn-link float-sm-right"
                              onClick={() =>
                                setMostrarBuscarAsociaciones(
                                  !mostrarBuscarAsociaciones
                                )
                              }
                            >
                              Buscar páginas
                            </button>
                          </Form.Group>
                          {asociaciones.length == 0 ? (
                            <Form.Group>
                              <label className="col-sm-12 col-form-label">
                                No se han registrado páginas
                              </label>
                            </Form.Group>
                          ) : (
                            <Form.Group>
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Descripción</th>
                                      <th>Estado</th>
                                      <th>Valor</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {asociaciones.map((asociacion) => (
                                      <tr key={asociacion["id"]}>
                                        <td>{asociacion["descripcion"]}</td>
                                        <td>{asociacion["estado"]}</td>
                                        <td>
                                          <input
                                            type={"number"}
                                            placeholder="Agregar valor"
                                            className="form-control"
                                            disabled={automatizado}
                                            onChange={(e) =>
                                              handleValorIndicadores(
                                                asociacion["id"],
                                                e
                                              )
                                            }
                                            value={asociacion["valor"]}
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
                                              onClick={handleEliminarAsociaciones(
                                                asociacion["id"]
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

                      {mostrarBuscarAsociaciones && (
                        <div>
                          <div className="row">
                            <div className="col-md-7">
                              <Form.Group>
                                <div className="search-field col-sm-12">
                                  <form
                                    className="d-flex align-items-center h-100"
                                    onSubmit={buscarPaginasCadena}
                                  >
                                    <div className="input-group">
                                      <div className="input-group-prepend bg-white">
                                        <i className="input-group-text border-0 mdi mdi-magnify"></i>
                                      </div>
                                      <input
                                        type="text"
                                        className="form-control bg-white border-0"
                                        placeholder="Descripción"
                                        value={asociacionCadena}
                                        onChange={({ target }) =>
                                          setAsociacionCadena(target.value)
                                        }
                                      />
                                    </div>
                                  </form>
                                </div>
                              </Form.Group>
                            </div>

                            <div className="col-md-4">
                              <Form.Group>
                                <select
                                  className="form-control col-sm-11"
                                  onChange={({ target }) =>
                                    setAsociacionEstado(target.value)
                                  }
                                >
                                  <option value="" disabled selected hidden>
                                    Estado
                                  </option>
                                  <option value={""}>Todos los estados</option>
                                  <option value={"0"}>No vigente</option>
                                  <option value={"1"}>Vigente</option>
                                </select>
                              </Form.Group>
                            </div>

                            <div className="col-md-1">
                              <Form.Group>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={buscarPaginas}
                                >
                                  Buscar
                                </button>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                {mostrarCargaAsociaciones && (
                                  <div className="row h-100">
                                    <div className="col-sm-12 my-auto">
                                      <div className="circle-loader"></div>
                                    </div>
                                  </div>
                                )}
                                {mostrarTablaAsociaciones && (
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>Descripción</th>
                                          <th>Estado</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {asociacionesBusqueda.map(
                                          (asociacion) => (
                                            <tr key={asociacion["id"]}>
                                              <td>
                                                {asociacion["descripcion"]}
                                              </td>
                                              <td>{asociacion["estado"]}</td>
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
                                                    onClick={handleAgregarAsociaciones(
                                                      asociacion["id"],
                                                      asociacion["descripcion"],
                                                      asociacion["estado"]
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
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-6">
                      <Link className="nav-link" to="/indicadores">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                        >
                          Salir
                        </button>
                      </Link>
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
              Guardar indicador
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="card-title" style={{ color: "#000000" }}>
            ¿Desea guardar el indicador?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-primary" onClick={handleClose}>
            Cancelar
          </button>

          <button className="btn btn-primary" onClick={guardarIndicador}>
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
      </div>)}
    </>
  );
};

export default DetalleIndicador;
