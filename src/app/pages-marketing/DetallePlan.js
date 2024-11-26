import React, { useEffect, useState } from "react";
import { Tabs, Tab, Form, FormGroup, Modal } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import bsCustomFileInput from "bs-custom-file-input";

const DetallePlan = () => {
  const history = useHistory();
  const location = useLocation();
  const [idPlan, setIdPlan] = useState(0);
  const [show, setShow] = useState(false);
  const [mostrarBuscarIndicadores, setMostrarBuscarIndicadores] =
    useState(false);
  const [mostrarBuscarEstrategias, setMostrarBuscarEstrategias] =
    useState(false);
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
  //const [aspectoIndicador, setAspectoIndicador] = useState("");
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
      if(inicioVigencia==null || finVigencia==null) alert("Ingrese las fechas de inicio y fin de vigencia del plan");
      else{setShow(true);}
    }
  };

  const handleChangeInicioVigencia = (date) => setInicioVigencia(date);
  const handleChangeFinVigencia = (date) => setFinVigencia(date);

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
    console.log(id)
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

  const mostrarIndicadorTipo = (tipo) => {
    if (tipo == "0") return "Plan";
    else if (tipo == "1") return "Programa";
    else if (tipo == "2") return "Campaña stand-alone";
    else if (tipo == "3") return "Campaña de programa";
    else if (tipo == "4") return "Correo";
    else if (tipo == "5") return "Publicación";
    else if (tipo == "6") return "Página web";
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
        tipo: "0",
        fechaCreacionIni: "",
        fechaCreacionFin: "",
        fechaModificacionIni: "",
        fechaModificacionFin: "",
        propietario: propietario,
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
        propietario: propietario,
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
      idPlan: idPlan,
      descripcion: descripcion,
      sponsor: sponsor,
      presupuesto: presupuesto,
      inicioVigencia: fechaVigenciaIni,
      finVigencia: fechaVigenciaFin,
      estado: "",
      propietario: propietario,
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


  const cargarPlan = () => {
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .get(`detallePlan/${location.state.idPlan}`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setIdPlan(parseInt(data["idPlan"]));
        setDescripcion(data["descripcion"]);
        setSponsor(data["sponsor"]);
        setPresupuesto(data["presupuesto"]);
        setInicioVigencia(new Date(data["inicioVigencia"]));
        setFinVigencia(new Date(data["finVigencia"]));
        setPropietario(parseInt(data["propietario"]));
        setIndicadores(data["indicadores"]);
        setEstrategias(data["estrategias"]);
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
    cargarPlan();
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
    // if (event.target.value == "") setOpcionesTipoVariable(planOpciones);
    // else if (event.target.value == "0") setOpcionesTipoVariable(planOpciones);
    // else if (event.target.value == "1")
    //   setOpcionesTipoVariable(estrategiaOpciones);
    // else if (event.target.value == "2")
    //   setOpcionesTipoVariable(campanaOpciones);
    // else if (event.target.value == "3")
    //   setOpcionesTipoVariable(recursoOpciones);
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
              <h3 className="page-title"> Detalle de plan </h3>
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
                                                {mostrarIndicadorTipo(indicador["tipo"])}
                                              </td>
                                              <td>
                                                {indicador[
                                                          "calculoAutomatico"
                                                        ]? "Habilitada":"No habilitada"}
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
                                                      indicador["id"], e
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
                                  <div className="col-md-11">
                                    <Form.Group>
                                      <div className="search-field col-sm-6">
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
                                                    {mostrarIndicadorTipo(indicador["tipo"])}
                                                    </td>
                                                    <td>
                                                      {
                                                        indicador[
                                                          "calculoAutomatico"
                                                        ]? "Habilitada":"No habilitada"
                                                      }
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
                          <Tab eventKey="Estrategias" title="Estrategias">
                            <div className="row">
                              <div className="col-md-12">
                                <Form.Group>
                                  <label className="col-sm-7 col-form-label">
                                    Estrategias
                                  </label>
                                  <button
                                    type="button"
                                    className="btn btn-link float-sm-right"
                                    onClick={() =>
                                      setMostrarBuscarEstrategias(
                                        !mostrarBuscarEstrategias
                                      )
                                    }
                                  >
                                    Buscar estrategias
                                  </button>
                                </Form.Group>
                                {estrategias.length == 0 ? (
                                  <Form.Group>
                                    <label className="col-sm-12 col-form-label">
                                      No se han registrado estrategias
                                    </label>
                                  </Form.Group>
                                ) : (
                                  <Form.Group>
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
                                          {estrategias.map((estrategia) => (
                                            <tr key={estrategia["id"]}>
                                              <td>
                                                {estrategia["descripcion"]}
                                              </td>
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
                                  </Form.Group>
                                )}
                              </div>
                            </div>

                            {mostrarBuscarEstrategias && (
                              <div>
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
                                                setEstrategiaCadena(
                                                  target.value
                                                )
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
                                                      {
                                                        estrategia[
                                                          "descripcion"
                                                        ]
                                                      }
                                                    </td>
                                                    <td>
                                                      {estrategia["tipo"]}
                                                    </td>
                                                    <td>
                                                      {estrategia["estado"]}
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

export default DetallePlan;
