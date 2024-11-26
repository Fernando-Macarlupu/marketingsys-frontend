import React, { useEffect, useState } from "react";
import { Tabs, Tab, Form, FormGroup, Modal } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import bsCustomFileInput from "bs-custom-file-input";

const DetalleOportunidad = () => {
  const history = useHistory();
  const location = useLocation();
  const [idOportunidad, setIdOportunidad] = useState(0);
  const [show, setShow] = useState(false);
  const [mostrarCargaDatos, setMostrarCargaDatos] = useState(false);
  const [mostrarDatos, setMostrarDatos] = useState(true);


  const [mostrarBuscarCampanas, setMostrarBuscarCampanas] = useState(false);
  const [campana, setCampana] = useState({ id: 0, descripcion: "" });
  const [campanaCadena, setCampanaCadena] = useState("");
  const [mostrarTablaCampanas, setMostrarTablaCampanas] = useState(false);
  const [mostrarCargaCampanas, setMostrarCargaCampanas] = useState(false);
  const [campanasBusqueda, setCampanasBusqueda] = useState([]);

  const [propietario, setPropietario] = useState(0);

  const [descripcion, setDescripcion] = useState("");
  const [importe, setImporte] = useState(0.0);
  const [tipo, setTipo] = useState("0");
  const [etapa, setEtapa] = useState("0");

  const [inicioVigencia, setInicioVigencia] = useState(null);
  const [finVigencia, setFinVigencia] = useState(null);

  const [mostrarTablaContactos, setMostrarTablaContactos] = useState(false);
  const [mostrarCargaContactos, setMostrarCargaContactos] = useState(false);
  const [contactoCadena, setContactoCadena] = useState("");
  // const [tipoContacto, setTipoContacto] = useState("");
  const [contactos, setContactos] = useState([]);
  const [contactosBusqueda, setContactosBusqueda] = useState([]);

  const [usuarioLogueado, setUsuarioLogueado] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (descripcion == "") alert("Ingrese la descripción de la estrategia");
    else {
      if(inicioVigencia==null || finVigencia==null) alert("Ingrese las fechas de inicio y fin de vigencia de la oportunidad");
      else{setShow(true);}
    }
  };

  const handleChangeInicioVigencia = (date) => setInicioVigencia(date);
  const handleChangeFinVigencia = (date) => setFinVigencia(date);

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
        propietario: propietario,
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

  const handleChangeTipo = (event) => {
    setTipo(event.target.value);
  };

  const handleChangeEtapa = (event) => {
    setEtapa(event.target.value);
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
      propietario: propietario,
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

  const guardarOportunidad = () => {
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
      idOportunidad: idOportunidad,
      idCampana: campana.id,
      tipo: tipo, //0: programa, 1: stand-alone
      etapa: etapa,
      descripcion: descripcion,
      importe: importe,
      inicioVigencia: fechaVigenciaIni,
      finVigencia: fechaVigenciaFin,
      estado: "",
      propietario: propietario,
      contactos: contactos,
    };
    console.log("cuerpo a subir");
    console.log(cuerpo);
    //setShow(false);
    setMostrarDatos(false);
    setMostrarCargaDatos(true);

    api
      .post("registrarOportunidad", cuerpo)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCargaDatos(false);
        setMostrarDatos(true);
        setShow(false);
        history.push({
          pathname: "/oportunidades",
          state: { oportunidadGuardada: true },
        });
      })
      .catch((err) => alert(err));
  };

  const cargarOportunidad = () => {
    setMostrarDatos(false);
    setMostrarCargaDatos(true);

      api
        .get(`detalleOportunidad/${location.state.idOportunidad}`)
        .then((res) => res.data)
        .then((data) => {
          console.log(data);
          setIdOportunidad(parseInt(data["idOportunidad"]));
          if (data["idCampana"] != 0)
            setCampana({
              id: parseInt(data["idCampana"]),
              descripcion: data["descripcionCampana"],
            });
          setDescripcion(data["descripcion"]);
          setTipo(data["tipo"]);
          setEtapa(data["etapa"]);
          setImporte(data["importe"]);
          setInicioVigencia(new Date(data["inicioVigencia"]));
          setFinVigencia(new Date(data["finVigencia"]));
          setPropietario(parseInt(data["propietario"]));
          setContactos(data["contactos"]);
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
    cargarOportunidad();
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
              <h3 className="page-title"> Detalle de oportunidad </h3>
            </div>
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <h4 className="card-title col-md-8">
                        Datos de la oportunidad
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
                        <div className="col-md-6">
                          <Form.Group>
                            <label className="col-sm-12 col-form-label">
                              Etapa
                            </label>
                            <div className="col-sm-12">
                              <select
                              value={etapa}
                                className="form-control"
                                onChange={handleChangeEtapa}
                              >
                                <option value={"0"}>
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
                            </div>
                          </Form.Group>
                        </div>
                        <div className="col-md-6">
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
                                            <td>{campana["descripcion"]}</td>
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
                              value={tipo}
                                className="form-control"
                                onChange={handleChangeTipo}
                              >
                                <option value={"0"}>
                                  Negocio existente
                                </option>
                                <option value={"1"}>Nuevo negocio</option>
                              </select>
                            </div>
                          </Form.Group>
                        </div>
                        <div className="col-md-6">
                          <Form.Group>
                            <label className="col-sm-12 col-form-label">
                              Importe
                            </label>
                            <div className="col-sm-12">
                              <Form.Control
                                type="number"
                                value={importe}
                                onChange={({ target }) =>
                                  setImporte(target.value)
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
                                      <label className="col-sm-12 col-form-label">
                                        Contactos y empresas
                                      </label>
                                    </Form.Group>
                                    {contactos.length == 0 ? (
                                      <Form.Group>
                                        <label className="col-sm-12 col-form-label">
                                          No se han registrado contactos y empresas
                                        </label>
                                      </Form.Group>
                                    ) : (
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
                                                          contacto["persona__nombreCompleto"],
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

                      <div className="row">
                        <div className="col-md-6">
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() =>
                              history.push({
                                pathname: "/oportunidades",
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
                  Guardar oportunidad
                </h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5 className="card-title" style={{ color: "#000000" }}>
                ¿Desea guardar la oportunidad?
              </h5>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-outline-primary" onClick={handleClose}>
                Cancelar
              </button>

              <button className="btn btn-primary" onClick={guardarOportunidad}>
                Guardar
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default DetalleOportunidad;
