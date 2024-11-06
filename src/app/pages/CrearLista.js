import React, { useEffect, useState } from "react";
import { Form, FormGroup, Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import bsCustomFileInput from "bs-custom-file-input";

const CrearLista = () => {
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
  const [objeto, setObjeto] = useState("0");
  const [tipo, setTipo] = useState("0");

  const [opcionesEvaluacion, setOpcionesEvaluacion] = useState([]);

  const [elementos, setElementos] = useState([]);
  const [mostrarTablaElementos, setMostrarTablaElementos] = useState(false);
  const [mostrarCargaElementos, setMostrarCargaElementos] = useState(false);

  const [usuarioLogueado, setUsuarioLogueado] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (nombre == "") alert("Ingrese el nombre de la lista");
    else {
      if (objeto == "") alert("Ingrese el objeto de la lista");
      else {
        if (tipo == "") alert("Ingrese el tipo de la lista");
        else setShow(true);
      }
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

  const handleChangeObjeto = (event) => {
    //aviso si esta seguro de cambiar
    setObjeto(event.target.value);
    setOpcionesEvaluacion([]);
    setNuevoFiltroEvaluacion("");
    const propiedad = document.getElementById("propiedadFiltroNuevo");
    const evaluacion = document.getElementById("evaluacionFiltroNuevo");
    propiedad.value = "";
    evaluacion.value = "";
    setFiltros([]);
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
      event.target.value == "contactoNombre"
    ) {
      setOpcionesEvaluacion(cadenasOpciones);
      setNuevoFiltroEvaluacion("cadena");
    } else if (event.target.value == "fechaCreacion") {
      setOpcionesEvaluacion(fechasEnterosOpciones);
      setNuevoFiltroEvaluacion("fecha");
    } else if (event.target.value == "cantEmpleados") {
      setOpcionesEvaluacion(fechasEnterosOpciones);
      setNuevoFiltroEvaluacion("entero");
    } else if (
      event.target.value == "calificado" ||
      event.target.value == "empresa" ||
      event.target.value == "contacto"
    ) {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("booleano");
    } else if (event.target.value == "estado") {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("estado");
    } else if (event.target.value == "tipo") {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("tipo");
    } else if (event.target.value == "servicioRed") {
      setOpcionesEvaluacion(otrosOpciones);
      setNuevoFiltroEvaluacion("red");
    }
  };

  const handleAgregarFiltros = () => {
    const propiedad = document.getElementById("propiedadFiltroNuevo");
    const evaluacion = document.getElementById("evaluacionFiltroNuevo");
    const valorEvaluacion = document.getElementById(
      "valorEvaluacionFiltroNuevo"
    );
    let valorEvaluacionValue = null;
    if (propiedad.value == "fechaCreacion") {
      valorEvaluacionValue = nuevoFiltroFecha;
    } else {
      valorEvaluacionValue = valorEvaluacion.value;
    }
    if (
      propiedad.value == "" ||
      evaluacion.value == "" ||
      valorEvaluacionValue == "" ||
      valorEvaluacionValue == null ||
      valorEvaluacionValue == 0
    )
      return;
    if (propiedad.value == "fechaCreacion") {
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
      },
    ]);
    if (propiedad.value == "fechaCreacion") {
      setNuevoFiltroFecha(null);
    } else if (propiedad.value == "cantEmpleados") {
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

  const handleAplicarFiltros = () => {
    let cuerpo = {
      objeto: objeto,
      propietario: usuarioLogueado["idCuenta"], //falta
      filtros: filtros,
    };
    console.log("cuerpo a subir");
    console.log(cuerpo);
    setMostrarTablaElementos(false);
    setMostrarCargaElementos(true);
    api
      .post("aplicarFiltrosLista", cuerpo)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCargaElementos(false);
        setMostrarTablaElementos(true);
        //setShow(false);
        setElementos(data);
      })
      .catch((err) => alert(err));

  };

  const guardarLista = () => {
    let cuerpo = {
      idLista: 0,
      nombre: nombre,
      descripcion: descripcion,
      tipo: tipo,
      objeto: objeto,
      tamano: elementos.length,
      propietario: usuarioLogueado["idCuenta"], //falta
      filtros: filtros,
      elementos: elementos
    };
    console.log("cuerpo a subir");
    console.log(cuerpo);
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .post("registrarLista", cuerpo)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCargaDatos(false);
        setMostrarDatos(true);
        setShow(false);
        history.push({
          pathname: "/listas",
          state: { listaGuardada: true },
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
              <h3 className="page-title"> Nueva lista </h3>
            </div>
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <h4 className="card-title col-md-8">Datos de lista</h4>
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
                        <div className="col-md-6">
                          <Form.Group>
                            <label className="col-sm-12 col-form-label">
                              Objeto<code>*</code>
                            </label>
                            <div className="col-sm-12">
                              <select
                                className="form-control"
                                onChange={handleChangeObjeto}
                              >
                                <option value={"0"} selected>
                                  Contacto
                                </option>
                                <option value={"1"}>Empresa</option>
                              </select>
                            </div>
                          </Form.Group>
                        </div>
                        <div className="col-md-6">
                          <Form.Group>
                            <label className="col-sm-12 col-form-label">
                              Tipo<code>*</code>
                            </label>
                            <div className="col-sm-12">
                              <select
                                className="form-control"
                                onChange={({ target }) => setTipo(target.value)}
                              >
                                <option value={"0"} selected>
                                  Estática
                                </option>
                                <option value={"1"}>Activa</option>
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
                                  {objeto == "0" ? (
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
                                  ) : (
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
                                  {nuevoFiltroEvaluacion == "estado" ? (
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
                                  {nuevoFiltroEvaluacion == "tipo" ? (
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
                                </div>
                              </Form.Group>
                            </div>
                          </Form.Group>

                          {filtros.map(
                            ({ propiedad, evaluacion, valorEvaluacion }) => (
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
                                      {propiedad +
                                        " - " +
                                        evaluacion +
                                        " - " +
                                        valorEvaluacion}
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
                                            <th>Id</th>
                                            <th>Fecha creación</th>
                                            <th>Fecha modificación</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {elementos.map(
                                            (elemento) => (
                                              <tr key={elemento["id"]}>
                                                <td>{elemento["id"]}</td>
                                                <td>
                                                  {elemento["fechaCreacion"]}
                                                </td>
                                                <td>
                                                  {elemento["fechaModificacion"]}
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
                                pathname: "/listas",
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
                  Guardar lista
                </h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5 className="card-title" style={{ color: "#000000" }}>
                ¿Desea guardar la lista?
              </h5>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-outline-primary" onClick={handleClose}>
                Cancelar
              </button>

              <button className="btn btn-primary" onClick={guardarLista}>
                Guardar
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default CrearLista;
