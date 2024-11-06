import React, { useEffect, useState } from "react";
import { Tabs, Tab, Form, FormGroup, Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import bsCustomFileInput from "bs-custom-file-input";

const CrearPlan = () => {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [mostrarCargaDatos, setMostrarCargaDatos] = useState(false);
  const [mostrarDatos, setMostrarDatos] = useState(true);

  const [mostrarTablaEstrategias, setMostrarTablaEstrategias] = useState(false);
  const [mostrarCargaEstrategias, setMostrarCargaEstrategias] = useState(false);
  const [mostrarTablaIndicadores, setMostrarTablaIndicadores] = useState(false);
  const [mostrarCargaIndicadores, setMostrarCargaIndicadores] = useState(false);

  const [propietario, setPropietario] = useState(0);

  const [descripcion, setDescripcion] = useState("");
  const [sponsor, setSponsor] = useState("");
  const [presupuesto, setPresupuesto] = useState(0.0);

  const [inicioVigencia, setInicioVigencia] = useState(null);
  const [finVigencia, setFinVigencia] = useState(null);

  const [indicadorCadena, setIndicadorCadena] = useState("");
  const [aspectoIndicador, setAspectoIndicador] = useState("");
  const [tipoIndicador, setTipoIndicador] = useState("");
  const [indicadores, setIndicadores] = useState([]);
  const [indicadoresBusqueda, setIndicadoresBusqueda] = useState([]);

  const [estrategiaCadena, setEstrategiaCadena] = useState("");
  const [estrategiaTipo, setEstrategiaTipo] = useState("");
  const [estrategiaEstado, setEstrategiaEstado] = useState("");
  const [estrategias, setEstrategias] = useState([]);
  const [estrategiasBusqueda, setEstrategiasBusqueda] = useState([]);

  const [usuarioLogueado, setUsuarioLogueado] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (descripcion == "") alert("Ingrese la descripción del plan");
    else {
      setShow(true);
    }
  };

  const handleChangeInicioVigencia = (date) => setInicioVigencia(date);
  const handleChangeFinVigencia = (date) => setFinVigencia(date);

  const handleAgregarIndicadores =
    (id, nombre, aspecto, tipo, automatizacion) => () => {
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
          automatizacion: automatizacion,
        },
      ]);
    };

  const handleEliminarIndicadores = (id) => () => {
    console.log("se va a eliminar");
    setIndicadores((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
  };

  const handleAgregarEstrategias = (id, descripcion, tipo, estado) => () => {
    for (let index = 0; index < estrategias.length; index++) {
      const element = estrategias[index];
      if (element["id"] == id) return;
    }
    setEstrategias([
      ...estrategias,
      {
        id: id,
        descripcion: descripcion,
        tipo: tipo,
        estado: estado,
      },
    ]);
  };

  const handleEliminarEstrategias = (id) => () => {
    console.log("se va a eliminar");
    setEstrategias((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
  };

  const buscarIndicadores = () => {
    //console.log("esto es la cadena")
    let tipoBusqueda = "";
    if(tipoIndicador!=""){
      if(aspectoIndicador=="1" && tipoIndicador=="0") tipoBusqueda = "0" //programa
      else if(aspectoIndicador=="1" && tipoIndicador=="1") tipoBusqueda = "1" //campaña stand-alone
      else if(aspectoIndicador=="2" && tipoIndicador=="0") tipoBusqueda = "2" //campaña de programa
      else if(aspectoIndicador=="2" && tipoIndicador=="1") tipoBusqueda = "3" //campaña stand-alone
      else if(aspectoIndicador=="3" && tipoIndicador=="0") tipoBusqueda = "4" //correo
      else if(aspectoIndicador=="3" && tipoIndicador=="1") tipoBusqueda = "5" //publicacion
      else if(aspectoIndicador=="3" && tipoIndicador=="2") tipoBusqueda = "6" //pagina web
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
        tipo: estrategiaTipo,
        estado: estrategiaEstado,
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

  const guardarPlan = () => {
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
      idPlan: 0,
      descripcion: descripcion,
      sponsor: sponsor,
      presupuesto: presupuesto,
      inicioVigencia: fechaVigenciaIni,
      finVigencia: fechaVigenciaFin,
      estado: "",
      propietario: usuarioLogueado["idCuenta"],
      indicadores: indicadores,
      estrategias: estrategias,
    };
    console.log("cuerpo a subir");
    console.log(cuerpo);
    //setShow(false);
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .post("registrarPlan", cuerpo)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCargaDatos(false);
        setMostrarDatos(true);
        setShow(false);
        history.push({
          pathname: "/planes",
          state: { planGuardado: true },
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
              <h3 className="page-title"> Nuevo plan </h3>
            </div>
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <h4 className="card-title col-md-8">Datos de plan</h4>
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

                      <div className="justify-content-between align-items-center tab-transparent">
                        <Tabs defaultActiveKey="Indicadores" className="nav">
                          <Tab eventKey="Indicadores" title="Indicadores">
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
                                        {indicadores.map((indicador) => (
                                          <tr key={indicador["id"]}>
                                            <td>{indicador["nombre"]}</td>
                                            <td>
                                              {indicador["aspecto"] +
                                                " - " +
                                                indicador["tipo"]}
                                            </td>
                                            <td>
                                              {indicador["automatizacion"]}
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
                                    <option value={""}>
                                      Todos los aspectos
                                    </option>
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
                                                  {indicador["automatizacion"]}
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
                                                        "automatizacion"
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
                          </Tab>
                          <Tab eventKey="Estrategias" title="Estrategias">
                            <div className="row">
                              <div className="col-md-12">
                                <Form.Group>
                                  <label className="col-sm-12 col-form-label">
                                    Estrategias
                                  </label>
                                </Form.Group>
                                {estrategias.length == 0 ? (
                                  <Form.Group>
                                    <label className="col-sm-12 col-form-label">
                                      No se han registrado estrategias
                                    </label>
                                  </Form.Group>
                                ) : (
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>Descripción</th>
                                          <th>Estado</th>
                                          <th>Tipo</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {estrategias.map((estrategia) => (
                                          <tr key={estrategia["id"]}>
                                            <td>{estrategia["descripcion"]}</td>
                                            <td>{estrategia["tipo"]}</td>
                                            <td>{estrategia["estado"]}</td>
                                            <td>
                                              <button
                                                style={{ marginLeft: "auto" }}
                                                type="button"
                                              >
                                                <i
                                                  className="mdi mdi-delete"
                                                  style={{ color: "black" }}
                                                  onClick={handleEliminarEstrategias(
                                                    estrategia["id"]
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

                            <div className="row">
                              <div className="col-md-7">
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
                                    </form>
                                  </div>
                                </Form.Group>
                              </div>

                              <div className="col-md-2">
                                <Form.Group>
                                  <select
                                    className="form-control col-sm-11"
                                    onChange={({ target }) =>
                                      setEstrategiaTipo(target.value)
                                    }
                                  >
                                    <option value="" disabled selected hidden>
                                      Tipo
                                    </option>
                                    <option value={""}>Todos los tipos</option>
                                    <option value={"0"}>Programa</option>
                                    <option value={"1"}>
                                      Campaña stand-alone
                                    </option>
                                  </select>
                                </Form.Group>
                              </div>

                              <div className="col-md-2">
                                <Form.Group>
                                  <select
                                    className="form-control col-sm-11"
                                    onChange={({ target }) =>
                                      setEstrategiaEstado(target.value)
                                    }
                                  >
                                    <option value="" disabled selected hidden>
                                      Estado
                                    </option>
                                    <option value={""}>
                                      Todos los estados
                                    </option>
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
                                    onClick={buscarEstrategias}
                                  >
                                    Buscar
                                  </button>
                                </Form.Group>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-md-12">
                                <Form.Group>
                                  {mostrarCargaEstrategias && (
                                    <div className="row h-100">
                                      <div className="col-sm-12 my-auto">
                                        <div className="circle-loader"></div>
                                      </div>
                                    </div>
                                  )}
                                  {mostrarTablaEstrategias && (
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
                                                    style={{
                                                      marginLeft: "auto",
                                                    }}
                                                    type="button"
                                                  >
                                                    <i
                                                      className="mdi mdi-delete"
                                                      style={{ color: "black" }}
                                                      onClick={handleAgregarEstrategias(
                                                        estrategia["id"],
                                                        estrategia[
                                                          "descripcion"
                                                        ],
                                                        estrategia["tipo"],
                                                        estrategia["estado"]
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
                                pathname: "/planes",
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
                  Guardar plan
                </h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5 className="card-title" style={{ color: "#000000" }}>
                ¿Desea guardar el plan?
              </h5>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-outline-primary" onClick={handleClose}>
                Cancelar
              </button>

              <button className="btn btn-primary" onClick={guardarPlan}>
                Guardar
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default CrearPlan;
