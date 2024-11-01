import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import bsCustomFileInput from "bs-custom-file-input";

const DetalleEmpresa = () => {
  const history = useHistory();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState({});

  const [mostrarBuscarContactos, setMostrarBuscarContactos] = useState(false);
  const [mostrarTabla, setMostrarTabla] = useState(false);

  const [cadenaBuscarContacto, setCadenaBuscarContacto] = useState("");
  const [contactosBusqueda, setContactosBusqueda] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [nuevoContacto, setNuevoContacto] = useState({});

  const [direcciones, setDirecciones] = useState([]);
  const [nuevaDireccion, setNuevaDireccion] = useState("");
  const [direccionPrincipal, setDireccionPrincipal] = useState({});

  const [telefonos, setTelefonos] = useState([]);
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [telefonoPrincipal, setTelefonoPrincipal] = useState("");

  //const [redes, setRedes] = useState([]);
  //const [nuevaRed, setNuevaRed] = useState({});

  const [idEmpresa, setIdEmpresa] = useState(0);
  const [propietario, setPropietario] = useState(0);
  const [nombre, setNombre] = useState("");
  const [sector, setSector] = useState("");
  const [cantEmpleados, setCantEmpleados] = useState(0);
  //const [correo, setCorreo] = useState("");
  const [tipo, setTipo] = useState("0");
  //const [calificado, setCalificado] = useState(false);

  const [nombresNoDisponibles, setNombresNoDisponibles] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (nombre == "") alert("Ingrese el nombre de la empresa");
    else {
      if (tipo == "") alert("Ingrese el tipo de la empresa");
      else {
        if (nombresNoDisponibles.includes(String(nombre)))
          alert(
            "El nombre de la empresa ya ha sido registrado, ingrese otro nombre"
          );
        else setShow(true);
      }
    }
  };

  const handleBuscarContactos = () => setMostrarBuscarContactos(true);

  const handleAgregarTelefonos = () => {
    if (nuevoTelefono == "") return;
    for (let index = 0; index < telefonos.length; index++) {
      const element = telefonos[index];
      if (element["numero"] == nuevoTelefono) return;
    }
    setTelefonos([...telefonos, { numero: nuevoTelefono, principal: false }]);
    setNuevoTelefono("");
  };

  const handleAgregarDirecciones = () => {
    const paisDireccion = document.getElementById("direccionPaisNuevo");
    const estadoDireccion = document.getElementById("direccionEstadoNuevo");
    const ciudadDireccion = document.getElementById("direccionCiudadNuevo");
    const detalleireccion = document.getElementById("direccionDetalleNuevo");
    if (
      paisDireccion.value == "" &&
      estadoDireccion.value == "" &&
      ciudadDireccion.value == "" &&
      detalleireccion.value == ""
    )
      return;
    setNuevaDireccion({
      pais: paisDireccion.value,
      estado: estadoDireccion.value,
      ciudad: ciudadDireccion.value,
      direccion: detalleireccion.value,
    });
    for (let index = 0; index < direcciones.length; index++) {
      const element = direcciones[index];
      if (
        element["pais"] == paisDireccion.value &&
        element["estado"] == estadoDireccion.value &&
        element["ciudad"] == ciudadDireccion.value &&
        element["direccion"] == detalleireccion.value
      )
        return;
    }
    setDirecciones([
      ...direcciones,
      {
        pais: paisDireccion.value,
        estado: estadoDireccion.value,
        ciudad: ciudadDireccion.value,
        direccion: detalleireccion.value,
      },
    ]);
    paisDireccion.value = "";
    estadoDireccion.value = "";
    ciudadDireccion.value = "";
    detalleireccion.value = "";
  };

  const mostrarDireccion = (pais, estado, ciudad, direccion) => {
    let resultado = "";
    if (pais != "") {
      if (estado == "" && ciudad == "" && direccion == "") resultado += pais;
      else resultado += pais + ", ";
    }
    if (estado != "") {
      if (ciudad == "" && direccion == "") resultado += estado;
      else resultado += estado + ", ";
    }
    if (ciudad != "") {
      if (direccion == "") resultado += ciudad;
      else resultado += ciudad + ", ";
    }
    if (direccion != "") {
      resultado += direccion;
    }
    return resultado;
  };


  const handleChangeNombre = (event) => {
    //console.log(event.target.value);
    setNombre(event.target.value);
  };

  const handleChangeSector = (event) => {
    //console.log(event.target.value);
    setSector(event.target.value);
  };

  const handleChangeTipo = (event) => {
    //console.log(event.target.value);
    setTipo(event.target.value);
  };

  const handleChangeCantEmpleados = (event) => {
    //console.log(event.target.value);
    setCantEmpleados(event.target.value);
  };

  const handleChangeNuevoTelefono = (event) => {
    //console.log(event.target.value);
    setNuevoTelefono(event.target.value);
  };

  const handleChangeNuevaDireccion = (event) => {
    //console.log(event.target.value);
    setNuevaDireccion(event.target.value);
  };

  const handleEliminarTelefonos = (numero) => () => {
    setTelefonos((prev) => prev.filter((el) => el.numero !== numero));
    //console.log(event.target.value);
  };

  const handleEliminarDirecciones = (direccion) => () => {
    console.log("se va a eliminar");
    console.log(direccion);
    setDirecciones((prev) =>
      prev.filter(
        (el) =>
          el.pais +
            "&&" +
            el.estado +
            "&&" +
            el.ciudad +
            "&&" +
            el.direccion !==
          direccion
      )
    );
    //console.log(event.target.value);
  };

  const handleChangeCadenaContacto = (event) => {
    //console.log(event.target.value);
    setCadenaBuscarContacto(event.target.value);
  };

  const buscarContactos = () => {
    setMostrarTabla(true);
    api
      .post("filtrarContactos", {
        cadena: cadenaBuscarContacto,
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
      })
      .catch((err) => alert(err));
  };

  const buscarContactosCadena = (event) => {
    event.preventDefault();
    buscarContactos();
  };

  const handleAgregarContactos = (id, nombre) => () => {
    for (let index = 0; index < contactos.length; index++) {
      const element = contactos[index];
      if (element["id"] == id) return;
    }
    setContactos([...contactos, { id: id, nombre: nombre, contacto: id }]);
  };

  const handleEliminarContactos = (id) => () => {
    setContactos((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
  };

  const cargarEmpresa = () => {
    api
      .get(`detalleEmpresa/${location.state.idEmpresa}`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setIdEmpresa(parseInt(data["idEmpresa"]));
        setNombre(data["nombre"]);
        setSector(data["sector"]);
        setCantEmpleados(data["cantEmpleados"]);
        setTipo(data["tipo"]);
        setPropietario(parseInt(data["propietario"]));
        setTelefonos(data["telefonos"]);
        setDirecciones(data["direcciones"]);
        setNombresNoDisponibles(data["empresasNoDisponibles"]);

        let contactosGuardados = [];
        if(data["contactos"]!=[]){
            for (let index = 0; index < data["contactos"].length; index++) {
                const element = data["contactos"][index];
                contactosGuardados.push({ id: parseInt(element["contacto"]), nombre: String(element["nombreCompleto"]), contacto: parseInt(element["contacto"]) });
            }
        }
        setContactos(contactosGuardados);

        
        const elementoDir = document.getElementById("direccionPrincipal");
        elementoDir.value = "";
        for (let index = 0; index < data["direcciones"].length; index++) {
          const element = data["direcciones"][index];
          if (element["principal"] == true) {
            console.log("encontro principal de dir");
            console.log(element["direccion"]);
            elementoDir.value =  element["pais"] + "&&" + element["estado"] + "&&" + element["ciudad"] + "&&" + element["direccion"];
          }
        }
        const elementoTel = document.getElementById("telefonoPrincipal");
        elementoTel.value = "";
        for (let index = 0; index < data["telefonos"].length; index++) {
          const element = data["telefonos"][index];
          if (element["principal"] == true) {
            console.log("encontro principal de tel");
            console.log(element["numero"]);
            elementoTel.value = element["numero"];
          }
        }
        
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    let usuario = localStorage.getItem("marketingSYSusuario");
    if (usuario == null) {
      history.push({
        pathname: "/iniciarSesion",
      });
      return;
    }
    setUsuarioLogueado(JSON.parse(usuario));
    cargarEmpresa();
  }, []);

  const guardarEmpresa = () => {
    //console.log("esto es la cadena")
    //asignar principal telefono
    let direccionesGuardar = direcciones;
    const elementoDir = document.getElementById("direccionPrincipal");
    if (elementoDir.value != "") {
      const elementsDir = elementoDir.value.split("&&");
      setDireccionPrincipal({
        pais: elementsDir[0],
        estado: elementsDir[1],
        ciudad: elementsDir[2],
        direccion: elementsDir[3],
      });
      console.log("dir principal");
      console.log(elementoDir.value);
      for (let index = 0; index < direcciones.length; index++) {
        const element = direcciones[index];
        direccionesGuardar[index]["principal"] = false;
        if (
          element["pais"] == elementsDir[0] &&
          element["estado"] == elementsDir[1] &&
          element["ciudad"] == elementsDir[2] &&
          element["direccion"] == elementsDir[3]
        ) {
          console.log("encontro principal de dir");
          direccionesGuardar[index]["principal"] = true;
        }
      }
    } else {
      setDireccionPrincipal({});
      for (let index = 0; index < direcciones.length; index++) {
        direccionesGuardar[index]["principal"] = false;
      }
    }

    //asignar principal telefono
    let telefonosGuardar = telefonos;
    const elementoTel = document.getElementById("telefonoPrincipal");
    setTelefonoPrincipal(elementoTel.value);
    for (let index = 0; index < telefonos.length; index++) {
      const element = telefonos[index];
      telefonosGuardar[index]["principal"] = false;
      if (element["numero"] == elementoTel.value) {
        console.log("encontro principal de tel");
        telefonosGuardar[index]["principal"] = true;
      }
    }
    let cuerpo = {
      idEmpresa: idEmpresa,
      nombre: nombre,
      sector: sector,
      cantEmpleados: cantEmpleados,
      tipo: tipo,
      propietario: propietario,
      telefonos: telefonosGuardar,
      direcciones: direccionesGuardar,
      correo: {},
      redes: [],
      actividades: [],
      contactos: contactos,
    };
    console.log("cuerpo a subir");
    console.log(cuerpo);
    //setShow(false);

    api
      .post("registrarEmpresa", cuerpo)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setShow(false);
        history.push({
          pathname: "/empresas",
          state: { empresaGuardada: true, empresasCargadas: false }
        });
      })
      .catch((err) => alert(err));
  };

  const componentDidMount = () => {
    bsCustomFileInput.init();
  };
  return (
    <>
      <div>
        <div className="page-header">
          <h3 className="page-title"> Detalle de empresa </h3>
        </div>
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <h4 className="card-title col-md-8">Datos de empresa</h4>
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
                          Nombre<code>*</code>
                        </label>
                        <div className="col-sm-12">
                          <Form.Control
                            type="text"
                            value={nombre}
                            onChange={handleChangeNombre}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <label className="col-sm-12 col-form-label">
                          Sector
                        </label>
                        <div className="col-sm-12">
                          <Form.Control
                            type="text"
                            value={sector}
                            onChange={handleChangeSector}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group>
                        <label className="col-sm-12 col-form-label">
                          Cantidad de empleados
                        </label>
                        <div className="col-sm-12">
                          <Form.Control
                            type="number"
                            value={cantEmpleados}
                            onChange={handleChangeCantEmpleados}
                          />
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
                            value={tipo}
                            onChange={handleChangeTipo}
                          >
                            <option value={"0"}>
                              Cliente potencial
                            </option>
                            <option value={"1"}>Socio</option>
                            <option value={"2"}>Revendedor</option>
                            <option value={"3"}>Proveedor</option>
                          </select>
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group>
                        <label className="col-sm-12 col-form-label">
                          Dirección principal
                        </label>
                        <div className="col-sm-12">
                          <select
                            className="form-control"
                            id="direccionPrincipal"
                          >
                            <option value={""}>
                              Sin dirección principal
                            </option>
                            {direcciones.map(
                              ({ pais, estado, ciudad, direccion }) => (
                                <option
                                  key={
                                    pais +
                                    "&&" +
                                    estado +
                                    "&&" +
                                    ciudad +
                                    "&&" +
                                    direccion
                                  }
                                  value={
                                    pais +
                                    "&&" +
                                    estado +
                                    "&&" +
                                    ciudad +
                                    "&&" +
                                    direccion
                                  }
                                >
                                  {mostrarDireccion(
                                    pais,
                                    estado,
                                    ciudad,
                                    direccion
                                  )}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <label className="col-sm-12 col-form-label">
                          Teléfono principal
                        </label>
                        <div className="col-sm-12">
                          <select
                            className="form-control"
                            id="telefonoPrincipal"
                          >
                            <option value={""} selected>
                              Sin teléfono principal
                            </option>
                            {telefonos.map(({ numero }) => (
                              <option key={numero} value={numero}>
                                {numero}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <label className="col-sm-7 col-form-label">
                          Direcciones
                        </label>
                        <div className="col-sm-5">
                          <button
                            type="button"
                            className="btn btn-link float-sm-right"
                            onClick={handleAgregarDirecciones}
                          >
                            Agregar nueva dirección
                          </button>
                        </div>

                        <div className="col-md-3">
                          <Form.Group>
                            <div className="col-sm-12">
                              <Form.Control
                                type="text"
                                id="direccionPaisNuevo"
                                placeholder="País"
                              />
                            </div>
                          </Form.Group>
                        </div>
                        <div className="col-md-5">
                          <Form.Group>
                            <div className="col-sm-12">
                              <Form.Control
                                type="text"
                                id="direccionEstadoNuevo"
                                placeholder="Estado/Provincia/Región"
                              />
                            </div>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <div className="col-sm-12">
                              <Form.Control
                                type="text"
                                id="direccionCiudadNuevo"
                                placeholder="Ciudad"
                              />
                            </div>
                          </Form.Group>
                        </div>
                        <div className="col-md-12">
                          <Form.Group>
                            <div className="col-sm-12">
                              <Form.Control
                                type="text"
                                id="direccionDetalleNuevo"
                                placeholder="Dirección"
                              />
                            </div>
                          </Form.Group>
                        </div>
                      </Form.Group>

                      {direcciones.map(
                        ({ pais, estado, ciudad, direccion }) => (
                          <div
                            className="row"
                            key={
                              pais +
                              "&&" +
                              estado +
                              "&&" +
                              ciudad +
                              "&&" +
                              direccion
                            }
                          >
                            <div className="col-md-12">
                              <Form.Group>
                                <label
                                  className="col-sm-12"
                                  style={{ display: "flex" }}
                                >
                                  {mostrarDireccion(
                                    pais,
                                    estado,
                                    ciudad,
                                    direccion
                                  )}
                                  <button
                                    style={{ marginLeft: "auto" }}
                                    type="button"
                                  >
                                    <i
                                      className="mdi mdi-delete"
                                      style={{ color: "black" }}
                                      onClick={handleEliminarDirecciones(
                                        pais +
                                          "&&" +
                                          estado +
                                          "&&" +
                                          ciudad +
                                          "&&" +
                                          direccion
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
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <label className="col-sm-7 col-form-label">
                          Teléfonos
                        </label>
                        <div className="col-sm-5">
                          <button
                            type="button"
                            className="btn btn-link float-sm-right"
                            onClick={handleAgregarTelefonos}
                          >
                            Agregar nuevo teléfono
                          </button>
                        </div>

                        <div className="col-md-12">
                          <Form.Group>
                            <div className="col-sm-12">
                              <Form.Control
                                type="text"
                                placeholder="Número de teléfono"
                                onChange={handleChangeNuevoTelefono}
                                value={nuevoTelefono}
                              />
                            </div>
                          </Form.Group>
                        </div>
                      </Form.Group>

                      {telefonos.map(({ numero }) => (
                        <div className="row" key={numero}>
                          <div className="col-md-12">
                            <Form.Group>
                              <label
                                className="col-sm-12"
                                style={{ display: "flex" }}
                              >
                                {numero}
                                <button
                                  type="button"
                                  style={{ marginLeft: "auto" }}
                                >
                                  <i
                                    className="mdi mdi-delete"
                                    style={{ color: "black" }}
                                    onClick={handleEliminarTelefonos(numero)}
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
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <label className="col-sm-8 col-form-label">
                          Contactos
                        </label>
                        <div className="col-sm-4">
                          <button
                            type="button"
                            className="btn btn-link float-sm-right"
                            onClick={handleBuscarContactos}
                          >
                            Buscar contactos
                          </button>
                        </div>
                        </Form.Group>

                        {contactos.map(({ id, nombre, contacto }) => (
                          <div key={id} className="row">
                            <div className="col-md-12">
                              <Form.Group>
                                <label
                                  className="col-sm-12"
                                  style={{ display: "flex" }}
                                >
                                  {nombre}
                                  <button
                                    type="button"
                                    style={{ marginLeft: "auto" }}
                                  >
                                    <i
                                      className="mdi mdi-delete"
                                      style={{ color: "black" }}
                                      onClick={handleEliminarContactos(id)}
                                    ></i>
                                  </button>
                                </label>
                              </Form.Group>
                            </div>
                          </div>
                        ))}

                        {mostrarBuscarContactos && (
                          <div className="col-md-12">
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
                                      placeholder="Nombres, apellidos, telefono o correo"
                                      onChange={handleChangeCadenaContacto}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={buscarContactos}
                                  >
                                    Buscar
                                  </button>
                                </form>
                              </div>
                            </Form.Group>
                          </div>
                        )}
                      
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <div className="table-responsive">
                            {mostrarTabla && (
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th>Nombre completo</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {contactosBusqueda.map((contacto) => (
                                    <tr
                                      key={
                                        String(contacto["id"]) + " - busqueda"
                                      }
                                    >
                                      <td>
                                        {contacto["persona__nombreCompleto"]}
                                      </td>
                                      <td>{contacto["correo"]}</td>
                                      <td>{contacto["telefono"]}</td>
                                      <td>
                                        <button
                                          type="button"
                                          onClick={handleAgregarContactos(
                                            contacto["id"],
                                            contacto["persona__nombreCompleto"]
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
                      <Link className="nav-link" to="/empresas">
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
              Guardar empresa
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="card-title" style={{ color: "#000000" }}>
            ¿Desea guardar la empresa?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-primary" onClick={handleClose}>
            Cancelar
          </button>
          
            <button className="btn btn-primary" onClick={guardarEmpresa}>
              Guardar
            </button>
          
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DetalleEmpresa;
