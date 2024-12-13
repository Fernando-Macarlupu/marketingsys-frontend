import React, { useEffect, useState } from "react";
import { Form, Modal, Button, Collapse, Card } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import bsCustomFileInput from "bs-custom-file-input";

const DetalleContacto = () => {
  const history = useHistory();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [mostrarCargaDatos, setMostrarCargaDatos] = useState(false);
  const [mostrarDatos, setMostrarDatos] = useState(false);
  const [open, setOpen] = useState(false);

  const [campanas, setCampanas] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [oportunidades, setOportunidades] = useState([]);

  const [mostrarBuscarEmpresas, setMostrarBuscarEmpresas] = useState(false);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [cadenaBuscarEmpresa, setCadenaBuscarEmpresa] = useState("");
  const [empresasBusqueda, setEmpresasBusqueda] = useState([]);
  const [empresa, setEmpresa] = useState({ id: 0, nombre: "" });

  const [direcciones, setDirecciones] = useState([]);
  const [nuevaDireccion, setNuevaDireccion] = useState("");
  const [direccionPrincipal, setDireccionPrincipal] = useState({});

  const [telefonos, setTelefonos] = useState([]);
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [telefonoPrincipal, setTelefonoPrincipal] = useState("");

  const [redes, setRedes] = useState([]);
  const [nuevaRed, setNuevaRed] = useState({});

  const [idContacto, setIdContacto] = useState(0);
  const [idPersona, setIdPersona] = useState(0);
  const [propietario, setPropietario] = useState(0);
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [estado, setEstado] = useState("0");
  const [calificado, setCalificado] = useState(false);
  const [calificadoHabilitado, setCalificadoHabilitado] = useState(false);

  const [usuarioLogueado, setUsuarioLogueado] = useState({});

  const [correosNoDisponibles, setCorreosNoDisponibles] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (nombreCompleto == "") alert("Ingrese el nombre completo del contacto");
    else {
      if (estado == "") alert("Ingrese el estado del contacto");
      else {
        if (correosNoDisponibles.includes(String(correo)))
          alert(
            "El correo del contacto ya ha sido registrado, ingrese otro correo"
          );
        else setShow(true);
      }
    }
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

  const handleAgregarTelefonos = () => {
    if (nuevoTelefono == "") return;
    for (let index = 0; index < telefonos.length; index++) {
      const element = telefonos[index];
      if (element["numero"] == nuevoTelefono) return;
    }
    setTelefonos([...telefonos, { numero: nuevoTelefono, principal: false }]);
    setNuevoTelefono("");
  };

  const handleAgregarRedes = () => {
    const redSocial = document.getElementById("redSocialNueva");
    const nombreUsuario = document.getElementById("nombreUsuarioNuevo");
    //console.log(redSocial.value);
    //console.log(nombreUsuario.value);
    setNuevaRed({
      redSocial: redSocial.value,
      nombreUsuario: nombreUsuario.value,
    });
    //console.log(nuevaRed);
    for (let index = 0; index < redes.length; index++) {
      const element = redes[index];
      if (
        element["redSocial"] == redSocial.value &&
        element["nombreUsuario"] == nombreUsuario.value
      )
        return;
    }
    setRedes([
      ...redes,
      {
        redSocial: redSocial.value,
        nombreUsuario: nombreUsuario.value,
      },
    ]);
    redSocial.value = "";
    nombreUsuario.value = "";

    //console.log(redes);
  };

  const mostrarRedSocial = (redSocial, nombreUsuario) => {
    let resultado = "", icono = "";
    if (redSocial == "0"){ 
      icono = "mdi mdi-facebook"; 
      resultado += "Facebook - ";
    }
    else {
      if (redSocial == "1"){
        icono = "mdi mdi-linkedin"; 
        resultado += "Linkedin - ";
      }
      else {
        if (redSocial == "2"){
          icono = "mdi mdi-instagram"; 
          resultado += "Instagram - ";
        }
      }
    }
    if (nombreUsuario != "") resultado += nombreUsuario;
    return (
      <div>
        <i className={icono} style={{ padding: 10 }}></i>
        {resultado}
      </div>
    );
  };

  const handleChangeNombreCompleto = (event) => {
    //console.log(event.target.value);
    setNombreCompleto(event.target.value);
  };

  const handleChangeCalificado = (event) => {
    //console.log(event.target.value);
    //console.log("cambio a");
    //console.log(!calificado);
    setCalificado(!calificado);
    //setNombreCompleto(event.target.value);
  };

  const handleChangeCorreo = (event) => {
    //console.log(event.target.value);
    setCorreo(event.target.value);
  };

  const handleChangeEstado = (event) => {
    //console.log(event.target.value);
    setEstado(event.target.value);
  };

  const handleChangeNuevaDireccion = (event) => {
    //console.log(event.target.value);
    setNuevaDireccion(event.target.value);
  };

  const handleChangeNuevoTelefono = (event) => {
    //console.log(event.target.value);
    setNuevoTelefono(event.target.value);
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

  // const handleEliminarDirecciones = (direccion) => () => {
  //   setDirecciones((prev) => prev.filter((el) => el.direccion !== direccion));
  //   //console.log(event.target.value);
  // };

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
  };

  const handleEliminarTelefonos = (numero) => () => {
    setTelefonos((prev) => prev.filter((el) => el.numero !== numero));
    //console.log(event.target.value);
  };

  const handleEliminarRedes = (redUsuario) => () => {
    setRedes((prev) =>
      prev.filter((el) => el.redSocial + el.nombreUsuario !== redUsuario)
    );
    //console.log(event.target.value);
  };

  const handleChangeCadenaEmpresa = (event) => {
    //console.log(event.target.value);
    setCadenaBuscarEmpresa(event.target.value);
  };

  const buscarEmpresas = () => {
    //console.log("esto es la cadena")
    setMostrarTabla(true);
    api
      .post("filtrarEmpresas", {
        cadena: cadenaBuscarEmpresa,
        tipo: "",
        fechaCreacionIni: "",
        fechaCreacionFin: "",
        fechaModificacionIni: "",
        fechaModificacionFin: "",
        propietario: propietario,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setEmpresasBusqueda(data);
      })
      .catch((err) => alert(err));
  };

  const buscarEmpresasCadena = (event) => {
    event.preventDefault();
    buscarEmpresas();
  };

  const handleAsignarEmpresa = (id, nombre) => () => {
    setEmpresa({ id: id, nombre: nombre });
    //console.log(event.target.value);
  };

  const cargarContacto = () => {
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .get(`detalleContacto/${location.state.idContacto}`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCargaDatos(false);
        setMostrarDatos(true);
        setIdContacto(parseInt(data["idContacto"]));
        setIdPersona(parseInt(data["idPersona"]));
        setNombreCompleto(data["nombreCompleto"]); //seteo en el input
        setCalificado(data["calificado"]); //seteo en el input
        setEstado(data["estado"]); //
        setPropietario(parseInt(data["propietario"]));
        setTelefonos(data["telefonos"]);
        setDirecciones(data["direcciones"]);
        setCorreo(data["correo"]["direccion"]);
        setRedes(data["redes"]);
        setEmpresa({});
        setCorreosNoDisponibles(data["correosNoDisponibles"]);
        setCampanas(data["campanas"]);
        setRecursos(data["recursos"]);
        setOportunidades(data["oportunidades"]);

        if (data["empresas"] != []) {
          setEmpresa({
            id: data["empresas"][0]["empresa"],
            nombre: data["empresas"][0]["nombre"],
          });
        }

        if (data["calificado"] == true) {
          setCalificadoHabilitado(true);
        }

        const elementoDir = document.getElementById("direccionPrincipal");
        elementoDir.value = "";
        for (let index = 0; index < data["direcciones"].length; index++) {
          const element = data["direcciones"][index];
          if (element["principal"] == true) {
            console.log("encontro principal de dir");
            console.log(element["direccion"]);
            elementoDir.value =
              element["pais"] +
              "&&" +
              element["estado"] +
              "&&" +
              element["ciudad"] +
              "&&" +
              element["direccion"];
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
        //setCorreosNoDisponibles
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
    cargarContacto();
  }, []);

  const guardarContacto = () => {
    //asignar principal direcciones
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
      idContacto: idContacto,
      nombreCompleto: nombreCompleto,
      calificado: calificado,
      estado: estado,
      propietario: propietario, //falta
      telefonos: telefonosGuardar,
      direcciones: direccionesGuardar,
      correo: {
        direccion: correo,
      },
      redes: redes,
      empresas: [
        {
          empresa: empresa["id"],
        },
      ],
      actividades: [],
    };
    console.log("cuerpo a subir");
    console.log(cuerpo);
    //setShow(false);

    api
      .post("registrarContacto", cuerpo)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setShow(false);
        history.push({
          pathname: "/contactos",
          state: { contactoGuardado: true, contactosCargados: false },
        });
      })
      .catch((err) => alert(err));
  };

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
              <h3 className="page-title"> Detalle de contacto </h3>
            </div>
            <div className="row">
              <div className="col-8 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <h4 className="card-title col-md-8">Datos de contacto</h4>
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
                              Nombre completo<code>*</code>
                            </label>
                            <div className="col-sm-12">
                              <Form.Control
                                type="text"
                                onChange={handleChangeNombreCompleto}
                                value={nombreCompleto}
                              />
                            </div>
                          </Form.Group>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <Form.Group>
                            <label className="col-sm-12 col-form-label">
                              Correo
                            </label>
                            <div className="col-sm-12">
                              <Form.Control
                                type="email"
                                onChange={handleChangeCorreo}
                                value={correo}
                              />
                            </div>
                          </Form.Group>
                        </div>
                        <div className="col-md-6">
                          <Form.Group>
                            <label className="col-sm-12 col-form-label">
                              Estado<code>*</code>
                            </label>
                            <div className="col-sm-12">
                              <select
                                className="form-control"
                                onChange={handleChangeEstado}
                                value={estado}
                              >
                                <option value={"0"}>Suscriptor</option>
                                <option value={"1"}>Lead</option>
                                <option value={"2"}>Oportunidad</option>
                                <option value={"3"}>Cliente</option>
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
                                checked={calificado}
                                onChange={handleChangeCalificado}
                                disabled={calificadoHabilitado}
                              />
                              <label
                                className="custom-control-label"
                                for="calificadoValor"
                              >
                                Contacto calificado para campañas de marketing
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
                                Al guardar el contacto con esta opción
                                seleccionada, ya no se podrá deseleccionar
                              </span>
                            </label>
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
                                <option value={""}>
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
                                        onClick={handleEliminarTelefonos(
                                          numero
                                        )}
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
                              Empresa
                            </label>
                            <div className="col-sm-4">
                              <button
                                type="button"
                                className="btn btn-link float-sm-right"
                                onClick={handleBuscarEmpresas}
                              >
                                Buscar empresas
                              </button>
                            </div>
                            <div className="col-md-12">
                              <Form.Group>
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="text"
                                    value={empresa.nombre}
                                  />
                                </div>
                              </Form.Group>
                            </div>
                            {mostrarBuscarEmpresas && (
                              <div className="col-md-12">
                                <Form.Group>
                                  <div className="search-field col-sm-12">
                                    <form
                                      className="d-flex align-items-center h-100"
                                      onSubmit={buscarEmpresasCadena}
                                    >
                                      <div className="input-group">
                                        <div className="input-group-prepend bg-white">
                                          <i className="input-group-text border-0 mdi mdi-magnify"></i>
                                        </div>
                                        <input
                                          type="text"
                                          className="form-control bg-white border-0"
                                          placeholder="Nombre, telefono o sector"
                                          onChange={handleChangeCadenaEmpresa}
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={buscarEmpresas}
                                      >
                                        Buscar
                                      </button>
                                    </form>
                                  </div>
                                </Form.Group>
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group className="row">
                            <div className="col-sm-12">
                              <div className="table-responsive">
                                {mostrarTabla && (
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th>Nombre</th>
                                        <th>Teléfono</th>
                                        <th>Sector</th>
                                        <th></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {empresasBusqueda.map((empresa) => (
                                        <tr key={empresa["id"]}>
                                          <td>{empresa["nombre"]}</td>
                                          <td>{empresa["telefono"]}</td>
                                          <td>{empresa["sector"]}</td>
                                          <td>
                                            <button
                                              type="button"
                                              onClick={handleAsignarEmpresa(
                                                empresa["id"],
                                                empresa["nombre"]
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
                        <div className="col-md-6">
                          <Form.Group className="row">
                            <label className="col-sm-7 col-form-label">
                              Redes sociales
                            </label>
                            <div className="col-sm-5">
                              <button
                                type="button"
                                className="btn btn-link float-sm-right"
                                onClick={handleAgregarRedes}
                              >
                                Agregar nueva red social
                              </button>
                            </div>
                            <div className="col-md-6">
                              <Form.Group>
                                <div className="col-sm-12">
                                  <select
                                    className="form-control"
                                    id="redSocialNueva"
                                  >
                                    <option value={""} disabled selected hidden>
                                      Red social
                                    </option>
                                    <option value={"0"}>Facebook</option>
                                    <option value={"1"}>Linkedin</option>
                                    <option value={"2"}>Instagram</option>
                                  </select>
                                </div>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group>
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="text"
                                    id="nombreUsuarioNuevo"
                                    placeholder="Nombre de usuario"
                                  />
                                </div>
                              </Form.Group>
                            </div>
                          </Form.Group>

                          {redes.map(({ redSocial, nombreUsuario }) => (
                            <div
                              className="row"
                              key={redSocial + nombreUsuario}
                            >
                              <div className="col-md-12">
                                <Form.Group>
                                  <label
                                    className="col-sm-12"
                                    style={{ display: "flex" }}
                                  >
                                    {mostrarRedSocial(redSocial, nombreUsuario)}
                                    <button
                                      style={{ marginLeft: "auto" }}
                                      type="button"
                                    >
                                      <i
                                        className="mdi mdi-delete"
                                        style={{ color: "black" }}
                                        onClick={handleEliminarRedes(
                                          redSocial + nombreUsuario
                                        )}
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
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() =>
                              history.push({
                                pathname: "/contactos",
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
              <div className="col-4 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <h4 className="card-title col-md-8">Actividades</h4>
                      </div>
                      <form className="form-sample">
                        <div className="row">
                          <div className="col-md-12">
                            <Form.Group>
                            <h5 className="col-sm-12 card-subtitle" style={{color: "black"}}>
                                Campañas registradas
                              </h5>
                            </Form.Group>

                            
                            {campanas.length == 0 ? (
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  El contacto no tiene campañas registradas
                                </label>
                              </Form.Group>
                            ) : (
                              <Form.Group>
                                <div className="col-sm-12">
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Descripción</th>
                                      <th>Tipo</th>
                                      <th>Estado</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {campanas.map((campana) => (
                                      <tr>
                                        <td>{campana["descripcion"]}</td>
                                        <td>{campana["tipo"]}</td>
                                        <td>{campana["estado"]}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              </div>
                              </Form.Group>
                            )}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-12">
                            <Form.Group>
                            <h5 className="col-sm-12 card-subtitle" style={{color: "black"}}>
                                Recursos registrados
                              </h5>
                            </Form.Group>
                            {recursos.length == 0 ? (
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  El contacto no tiene recursos registrados
                                </label>
                              </Form.Group>
                            ) : (
                              <Form.Group>
                                <div className="col-sm-12">
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Descripción</th>
                                      <th>Tipo</th>
                                      <th>Estado</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {recursos.map((recurso) => (
                                      <tr>
                                        <td>{recurso["descripcion"]}</td>
                                        <td>{recurso["tipo"]}</td>
                                        <td>{recurso["estado"]}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              </div>
                              </Form.Group>
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <Form.Group>
                            <h5 className="col-sm-12 card-subtitle" style={{color: "black"}}>
                                Oportunidades registradas
                                </h5>
                            </Form.Group>
                            {oportunidades.length == 0 ? (
                              <Form.Group>
                                <label className="col-sm-12 col-form-label">
                                  El contacto no tiene oportunidades registradas
                                </label>
                              </Form.Group>
                            ) : (
                              <Form.Group>
                                <div className="col-sm-12">
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Descripción</th>
                                      <th>Etapa</th>
                                      <th>Estado</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {oportunidades.map((oportunidad) => (
                                      <tr>
                                        <td>{oportunidad["descripcion"]}</td>
                                        <td>{oportunidad["etapa"]}</td>
                                        <td>{oportunidad["estado"]}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              </div>
                              </Form.Group>
                            )}
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
                  Guardar contacto
                </h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5 className="card-title" style={{ color: "#000000" }}>
                ¿Desea guardar el contacto?
              </h5>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-outline-primary" onClick={handleClose}>
                Cancelar
              </button>

              <button className="btn btn-primary" onClick={guardarContacto}>
                Guardar
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default DetalleContacto;
