import React, { useEffect, useState } from "react";
import { Form, FormGroup, Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import bsCustomFileInput from "bs-custom-file-input";

const CrearIndicador = () => {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [mostrarBuscarEmpresas, setMostrarBuscarEmpresas] = useState(false);
  const [mostrarTablaVariables, setMostrarTablaVariables] = useState(false);

  const [variablesBusqueda, setVariablesBusqueda] = useState([]);

  const [cadenaBuscarEmpresa, setCadenaBuscarEmpresa] = useState("");
  const [empresasBusqueda, setEmpresasBusqueda] = useState([]);
  const [empresa, setEmpresa] = useState({ id: 0, nombre: "" });

  const [propietario, setPropietario] = useState(0);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [asociado, setAsociado] = useState("");
  const [variables, setVariables] = useState("");

  const [correo, setCorreo] = useState("");
  const [estado, setEstado] = useState("0");
  const [automatizado, setAutomatizado] = useState(false);

  const [correosNoDisponibles, setCorreosNoDisponibles] = useState([]);

  const [usuarioLogueado, setUsuarioLogueado] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (nombre == "") alert("Ingrese el nombre del indicador");
    // else {
    //   if (estado == "") alert("Ingrese el estado del contacto");
    //   else {
    //     if (correosNoDisponibles.includes(String(correo)))
    //       alert(
    //         "El correo del contacto ya ha sido registrado, ingrese otro correo"
    //       );
    //     else setShow(true);
    //   }
    // }
  };
  const handleBuscarEmpresas = () => setMostrarBuscarEmpresas(true);

  // const handleAgregarDirecciones = () => {
  //   for (let index = 0; index < direcciones.length; index++) {
  //     const element = direcciones[index];
  //     if (element["direccion"] == nuevaDireccion) return;
  //   }
  //   setDirecciones([
  //     ...direcciones,
  //     { direccion: nuevaDireccion, principal: false },
  //   ]);
  // };

  const handleAgregarVariables =
    (id, nombre, aspecto, tipo, automatizacion) => () => {
      for (let index = 0; index < variables.length; index++) {
        const element = variables[index];
        if (element["id"] == id) return;
      }
      setVariables([
        ...variables,
        {
          id: id,
          nombre: nombre,
          aspecto: aspecto,
          tipo: tipo,
          automatizacion: automatizacion,
        },
      ]);
    };

  const handleEliminarVariables = (id) => () => {
    setVariables((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
  };

  const handleChangeAutomatizado = (event) => {
    //console.log(event.target.value);
    //console.log("cambio a");
    //console.log(!calificado);
    setAutomatizado(!automatizado);
    //setNombreCompleto(event.target.value);
  };

  // const handleChangeNuevaRed = (event) => {
  //   //console.log(event.target.value);
  //   //const elemento = document.getElementById('redSocialNueva');
  //   setNuevaRed({redSocial: "", nombreUsuario: event.target.value});
  // };

  // const handleChangeDireccionPrincipal = (event) => {
  //   const elemento = document.getElementById('direccionPrincipal');
  //   console.log("esta es la principal");
  //   console.log(elemento.value);
  //   setDireccionPrincipal(elemento.value);
  // };

  const buscarVariables = () => {
    //console.log("esto es la cadena")
    setMostrarTablaVariables(true);
    api
      .post("filtrarVariables", {
        // cadena: cadenaBuscarEmpresa,
        // tipo: "",
        // fechaCreacionIni: "",
        // fechaCreacionFin: "",
        // fechaModificacionIni: "",
        // fechaModificacionFin: "",
        // propietario: usuarioLogueado["idCuenta"],
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

  const handleAsignarEmpresa = (id, nombre) => () => {
    setEmpresa({ id: id, nombre: nombre });
    //console.log(event.target.value);
  };

  const guardarIndicador = () => {
    //console.log("esto es la cadena")
    //asignar principal direcciones
    // let direccionesGuardar = direcciones;
    // const elementoDir = document.getElementById("direccionPrincipal");
    // if (elementoDir.value != "") {
    //   const elementsDir = elementoDir.value.split("&&");
    //   setDireccionPrincipal({
    //     pais: elementsDir[0],
    //     estado: elementsDir[1],
    //     ciudad: elementsDir[2],
    //     direccion: elementsDir[3],
    //   });
    //   console.log("dir principal");
    //   console.log(elementoDir.value);
    //   for (let index = 0; index < direcciones.length; index++) {
    //     const element = direcciones[index];
    //     direccionesGuardar[index]["principal"] = false;
    //     if (
    //       element["pais"] == elementsDir[0] &&
    //       element["estado"] == elementsDir[1] &&
    //       element["ciudad"] == elementsDir[2] &&
    //       element["direccion"] == elementsDir[3]
    //     ) {
    //       console.log("encontro principal de dir");
    //       direccionesGuardar[index]["principal"] = true;
    //     }
    //   }
    // } else {
    //   setDireccionPrincipal({});
    //   for (let index = 0; index < direcciones.length; index++) {
    //     direccionesGuardar[index]["principal"] = false;
    //   }
    // }

    // //asignar principal telefono
    // let telefonosGuardar = telefonos;
    // const elementoTel = document.getElementById("telefonoPrincipal");
    // setTelefonoPrincipal(elementoTel.value);
    // for (let index = 0; index < telefonos.length; index++) {
    //   const element = telefonos[index];
    //   telefonosGuardar[index]["principal"] = false;
    //   if (element["numero"] == elementoTel.value) {
    //     console.log("encontro principal de tel");
    //     telefonosGuardar[index]["principal"] = true;
    //   }
    // }
    // let empresasCargar = [];
    // if (empresa["id"] != 0)
    //   empresasCargar = [{
    //     empresa: empresa["id"],
    //   }];
    let cuerpo = {
      idIndicador: 0,
      nombre: nombre,
      //   calificado: calificado,
      //   estado: estado,
      //   propietario: usuarioLogueado["idCuenta"], //falta
      //   telefonos: telefonosGuardar,
      //   direcciones: direccionesGuardar,
      //   correo: {
      //     direccion: correo,
      //   },
      //   redes: redes,
      //   empresas: empresasCargar,
      //   actividades: [],
    };
    console.log("cuerpo a subir");
    console.log(cuerpo);
    //setShow(false);

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

  const cargarCorreosNoDisponibles = (idCuenta) => {
    console.log("este es el idCuenta");
    console.log(idCuenta);
    api
      .post("correosNoDisponibles", {
        tipo: "1",
        propietario: idCuenta,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setCorreosNoDisponibles(data);
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
    //cargarCorreosNoDisponibles(usuarioPropiedades["idCuenta"]);
  }, []);

  const componentDidMount = () => {
    bsCustomFileInput.init();
  };
  return (
    <>
      <div>
        <div className="page-header">
          <h3 className="page-title"> Nuevo indicador </h3>
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
                          Asociado a
                        </label>
                        <div className="col-sm-12">
                          <Form.Control type="text" value={asociado} />
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
                      <Form.Group className="row">
                        <label className="col-sm-8 col-form-label">
                          Variables
                        </label>
                      </Form.Group>

                      {variables.map(({ id, nombre, aspecto, tipo }) => (
                        <div key={id} className="row">
                          <div className="col-md-12">
                            <Form.Group>
                              <label
                                className="col-sm-12"
                                style={{ display: "flex" }}
                              >
                                {nombre + aspecto + tipo}
                                <button
                                  type="button"
                                  style={{ marginLeft: "auto" }}
                                >
                                  <i
                                    className="mdi mdi-delete"
                                    style={{ color: "black" }}
                                    onClick={handleEliminarVariables(id)}
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
                    <div className="col-md-12">
                      <Form.Group>
                        <div className="search-field col-sm-12">
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
                                //onChange={handleChangeCadenaVariable}
                              />
                            </div>
                            <select
                              className="form-control col-sm-11"
                              //onChange={handleChangeBuscarFechas}
                            >
                              <option value="" disabled selected hidden>
                                Aspecto
                              </option>
                              <option value={0}>Plan</option>
                              <option value={1}>Estrategia</option>
                              <option value={2}>Campaña</option>
                              <option value={3}>Recurso</option>
                            </select>
                            <select
                              className="form-control col-sm-11"
                              //onChange={handleChangeBuscarFechas}
                            >
                              <option value="" disabled selected hidden>
                                Tipo
                              </option>
                              <option value={0}>Programa</option>
                              <option value={1}>Campaña stand-alone</option>
                            </select>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={buscarVariables}
                            >
                              Buscar
                            </button>
                          </form>
                        </div>
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
                                    <th>Aspecto - Tipo</th>
                                    <th>Automatización habilitada</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {variablesBusqueda.map((variable) => (
                                    <tr
                                      key={
                                        String(variable["id"]) + " - busqueda"
                                      }
                                    >
                                      <td>{variable["nombre"]}</td>
                                      <td>
                                        {variable["aspecto"] + variable["tipo"]}
                                      </td>
                                      <td>{variable["automatizacion"]}</td>
                                      <td>
                                        <button
                                          type="button"
                                          onClick={handleAgregarVariables(
                                            variable["id"],
                                            variable["nombre"],
                                            variable["aspecto"],
                                            variable["tipo"],
                                            variable["automatizacion"]
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
    </>
  );
};

export default CrearIndicador;
