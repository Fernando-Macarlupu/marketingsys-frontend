import React, { useEffect, useState } from "react";
import { Form, Modal, Alert } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import "react-datepicker/dist/react-datepicker.css";

const Listas = () => {
  const history = useHistory();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [mostrarCarga, setMostrarCarga] = useState(false);

  const [usuarioLogueado, setUsuarioLogueado] = useState({});
  const [startDateCreate, setStartDateCreate] = useState(new Date());
  const [endDateCreate, setEndDateCreate] = useState(new Date());
  const [startDateModify, setStartDateModify] = useState(new Date());
  const [endDateModify, setEndDateModify] = useState(new Date());
  const [buscarFechas, setBuscarFechas] = useState(0);
  const [cadena, setCadena] = useState("");
  const [listas, setListas] = useState([]);
  const [listaEliminar, setListaEliminar] = useState(0);
  const [mostrarMensajeExito, setMostrarMensajeExito] = useState(false);
  const [mostrarMensajeExitoCarga, setMostrarMensajeExitoCarga] =
    useState(false);

  useEffect(() => {
    let usuario = localStorage.getItem("marketingSYSusuario");
    if (usuario == null) {
      history.push({
        pathname: "/iniciarSesion",
      });
      return;
    }
    if (location.state == null) console.log("La lista guardada es null");
    else {
      if (location.state.listaGuardada == true) {
        setMostrarMensajeExito(true);
        setTimeout(() => {
          setMostrarMensajeExito(false);
        }, 5000);
      }
    }
    setUsuarioLogueado(JSON.parse(usuario));
  }, []);

  // state = {
  //   startDateCreate: new Date(),
  //   endDateCreate: new Date(),
  //   startDateModify: new Date(),
  //   endDateModify: new Date(),
  //   buscarFechas: 0,
  //   cadena: "",
  //   estado: "",
  //   contactos: [],
  // };
  
  const buscarListas = () => {
    //console.log("esto es la cadena")
    console.log(cadena);
    let fechaCreacionIni = "",
      fechaCreacionFin = "",
      fechaModificacionIni = "",
      fechaModificacionFin = "";

    if (buscarFechas == 1 || buscarFechas == 3) {
      console.log("buscar por fecha de crea");
      fechaCreacionIni =
        startDateCreate.getDate() +
        "-" +
        parseInt(startDateCreate.getMonth() + 1) +
        "-" +
        startDateCreate.getFullYear();
      fechaCreacionFin =
        endDateCreate.getDate() +
        "-" +
        parseInt(endDateCreate.getMonth() + 1) +
        "-" +
        endDateCreate.getFullYear();
      console.log(fechaCreacionIni);
      console.log(fechaCreacionFin);
    }
    if (buscarFechas == 2 || buscarFechas == 3) {
      console.log("buscar por fecha de modif");
      fechaModificacionIni =
        startDateModify.getDate() +
        "-" +
        parseInt(startDateModify.getMonth() + 1) +
        "-" +
        startDateModify.getFullYear();
      fechaModificacionFin =
        endDateModify.getDate() +
        "-" +
        parseInt(endDateModify.getMonth() + 1) +
        "-" +
        endDateModify.getFullYear();
      console.log(fechaModificacionIni);
      console.log(fechaModificacionFin);
    }
    setMostrarTabla(false);
    setMostrarCarga(true);
    api
      .post("filtrarListas", {
        cadena: cadena,
        fechaCreacionIni: fechaCreacionIni,
        fechaCreacionFin: fechaCreacionFin,
        fechaModificacionIni: fechaModificacionIni,
        fechaModificacionFin: fechaModificacionFin,
        propietario: usuarioLogueado["idCuenta"],
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setListas(data);
        setMostrarCarga(false);
        setMostrarTabla(true);
      })
      .catch((err) => alert(err));
  };

  const buscarListasCadena = (event) => {
    event.preventDefault();
    buscarListas();
  };

  const handleChangeCadena = (event) => {
    //console.log(event.target.value);
    setCadena(event.target.value);
  };

  const handleChangeBuscarFechas = (event) => {
    console.log(event.target.value);
    setBuscarFechas(event.target.value);
  };

  const handleChangeStartCreate = (date) => {
    setStartDateCreate(date);
  };
  const handleChangeEndCreate = (date) => {
    setEndDateCreate(date);
  };
  const handleChangeStartModify = (date) => {
    setStartDateModify(date);
  };
  const handleChangeEndModify = (date) => {
    setEndDateModify(date);
  };

  const handleClose = () => setShow(false);

  const handleEliminarListas = (id) => () => {
    setListas((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
  };

  const eliminarLista = () => {
    api
      .delete(`eliminarLista/${listaEliminar}`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        //handleEliminarContactos(contactoEliminar);
        setShow(false);
      })
      .catch((err) => alert(err));
  };

  const handleVerDetalle = (id, event) => {
    console.log(id);
    if (event.target.value == 1) {
      console.log("Ver detalle");
      event.target.value = 0;
      history.push({
        pathname: "/detalleLista",
        state: { idLista: id },
      });
    }
    if (event.target.value == 2) {
      console.log("Eliminar");
      event.target.value = 0;
      setListaEliminar(id);
      setShow(true);
      // api
      // .delete(`eliminarContacto/${id}`)
      // .then((res) => res.data)
      // .then((data) => {
      //   console.log(data);
      // })
      // .catch((err) => alert(err));
    }
  };

  return (
    <div>
      <div className="row">
        <div className="page-header col-md-7">
          <h3 className="page-title"> Listas </h3>
        </div>
        <div className="page-header col-md-3">
          <Alert
            show={mostrarMensajeExito}
            variant="success"
            className="small text-center"
          >
            {" "}
            <i className="px-2 mdi mdi-check-circle"></i>
            Lista registrada correctamente
          </Alert>
        </div>
        <div className="col-md-2">
          <Form.Group>
            <div className="text-right">
              <button
                className="btn btn-primary"
                onClick={() => history.push({ pathname: "/crearLista" })}
              >
                Nueva lista
              </button>
            </div>
          </Form.Group>
        </div>
      </div>
      <form className="forms-sample">
        <div className="row">
          <div className="col-md-3">
            <Form.Group className="row">
              <select
                className="form-control col-sm-11"
                onChange={handleChangeBuscarFechas}
              >
                <option value="" disabled selected hidden>
                  Buscar por fechas
                </option>
                <option value={0}>Todas las fechas</option>
                <option value={1}>Por fecha de creación</option>
                <option value={2}>Por fecha de modificación</option>
                <option value={3}>Por fecha de creación y modificación</option>
              </select>
            </Form.Group>
          </div>
          <div className="col-md-4">
            <Form.Group className="row">
              <label className="col-sm-4 col-form-label">
                Fecha de creación
              </label>
              <div className="col-sm-4">
                <DatePicker
                  className="form-control w-100"
                  selected={startDateCreate}
                  onChange={handleChangeStartCreate}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div className="col-sm-4">
                <DatePicker
                  className="form-control w-100"
                  selected={endDateCreate}
                  onChange={handleChangeEndCreate}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </Form.Group>
          </div>
          <div className="col-md-5">
            <Form.Group className="row">
              <label className="col-sm-4 col-form-label">
                Fecha de modificación
              </label>
              <div className="col-sm-4">
                <DatePicker
                  className="form-control w-100"
                  selected={startDateModify}
                  onChange={handleChangeStartModify}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div className="col-sm-4">
                <DatePicker
                  className="form-control w-100"
                  selected={endDateModify}
                  onChange={handleChangeEndModify}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </Form.Group>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Form.Group className="row">
              <div className="search-field col-sm-10">
                <form
                  className="d-flex align-items-center h-100"
                  onSubmit={buscarListasCadena}
                >
                  <div className="input-group">
                    <div className="input-group-prepend bg-white">
                      <i className="input-group-text border-0 mdi mdi-magnify"></i>
                    </div>
                    <input
                      type="text"
                      className="form-control bg-white border-0"
                      placeholder="Nombre de la lista"
                      onChange={handleChangeCadena}
                    />
                  </div>
                </form>
              </div>
            </Form.Group>
          </div>
          <div className="col-md-2">
            <Form.Group className="row">
              <select
                className="form-control col-sm-10"
                //onChange={handleChangeTipo}
              >
                <option value="" disabled selected hidden>
                  Ojbeto de lista
                </option>
                <option value={""}>Todos los objetos</option>
                <option value={"0"}>Contacto</option>
                <option value={"1"}>Empresa</option>
              </select>
            </Form.Group>
          </div>
          <div className="col-md-2">
            <Form.Group className="row">
              <select
                className="form-control col-sm-10"
                //onChange={handleChangeTipo}
              >
                <option value="" disabled selected hidden>
                  Tipo de lista
                </option>
                <option value={""}>Todos los tipos</option>
                <option value={"0"}>Estática</option>
                <option value={"1"}>Activa</option>
              </select>
            </Form.Group>
          </div>
          <div className="col-md-2">
            <Form.Group>
              <div className="text-right">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={buscarListas}
                >
                  Buscar
                </button>
              </div>
            </Form.Group>
          </div>
        </div>
      </form>
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
                  <th>Objeto</th>
                  <th>Tamaño</th>
                  <th>Tipo</th>
                  <th>Fecha de creación</th>
                  <th>Fecha de modificación</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listas.map((lista) => (
                  <tr key={lista["id"]}>
                    <td>{lista["nombre"]}</td>
                    <td>{lista["objeto"]}</td>
                    <td>{lista["tamano"]}</td>
                    <td>{lista["tipo"]}</td>
                    <td>{lista["fechaCreacion"]}</td>
                    <td>{lista["fechaModificacion"]}</td>
                    <td>
                      <select
                        className="form-control"
                        onChange={(e) => handleVerDetalle(lista["id"], e)}
                      >
                        <option value={0} disabled selected hidden>
                          ...
                        </option>
                        <option value={1}>Ver detalle</option>
                        <option value={2}>Eliminar</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="card-title" style={{ color: "#000000" }}>
              Eliminar lista
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="card-title" style={{ color: "#000000" }}>
            ¿Desea eliminar la lista?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-primary" onClick={handleClose}>
            Cancelar
          </button>
          <Link className="nav-link" to="/listas">
            <button className="btn btn-primary" onClick={eliminarLista}>
              Eliminar
            </button>
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Listas;
