import React, { useEffect, useState } from "react";
import { Form, Modal, Alert } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import "react-datepicker/dist/react-datepicker.css";

const Oportunidades = () => {
  const location = useLocation();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [mostrarCarga, setMostrarCarga] = useState(false);

  const [usuarioLogueado, setUsuarioLogueado] = useState({});
  const [startDateActive, setStartDateActive] = useState(new Date());
  const [endDateActive, setEndDateActive] = useState(new Date());
  const [startDateModify, setStartDateModify] = useState(new Date());
  const [endDateModify, setEndDateModify] = useState(new Date());
  const [buscarFechas, setBuscarFechas] = useState(0);
  const [cadena, setCadena] = useState("");
  const [etapa, setEtapa] = useState("");
  const [estado, setEstado] = useState("");
  const [oportunidades, setOportunidades] = useState([]);
  const [oportunidadEliminar, setOportunidadEliminar] = useState(0);
  const [mostrarMensajeExito, setMostrarMensajeExito] = useState(false);
  const [mostrarMensajeExitoCarga, setMostrarMensajeExitoCarga] =
    useState(false);

  const handleClose = () => setShow(false);

  useEffect(() => {
    let usuario = localStorage.getItem("marketingSYSusuario");
    if (usuario == null) {
      history.push({
        pathname: "/iniciarSesion",
      });
      return;
    }
    if (location.state == null) console.log("La oportunidad guardada es null");
    else {
      if (location.state.oportunidadGuardada == true) {
        setMostrarMensajeExito(true);
        setTimeout(() => {
          setMostrarMensajeExito(false);
        }, 5000);
      }
    }
    setUsuarioLogueado(JSON.parse(usuario));
  }, []);

  const buscarOportunidades = () => {
    //console.log("esto es la cadena")
    console.log(cadena);
    let fechaVigenciaIni = "",
      fechaVigenciaFin = "",
      fechaHoy = "",
      fecha = new Date();

    fechaHoy =
      fecha.getDate() +
      "-" +
      parseInt(fecha.getMonth() + 1) +
      "-" +
      fecha.getFullYear();
      if (estado == "2" && buscarFechas == 1) {
        fechaVigenciaIni =
          startDateActive.getDate() +
          "-" +
          parseInt(startDateActive.getMonth() + 1) +
          "-" +
          startDateActive.getFullYear();
        fechaVigenciaFin =
          endDateActive.getDate() +
          "-" +
          parseInt(endDateActive.getMonth() + 1) +
          "-" +
          endDateActive.getFullYear();
      }

    setMostrarTabla(false);
    setMostrarCarga(true);
    api
      .post("filtrarOportunidades", {
        cadena: cadena,
        estado: estado,
        etapa: etapa,
        fechaHoy: fechaHoy,
        fechaVigenciaIni: fechaVigenciaIni,
        fechaVigenciaFin: fechaVigenciaFin,
        propietario: usuarioLogueado["idCuenta"],
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setOportunidades(data);
        setMostrarCarga(false);
        setMostrarTabla(true);
      })
      .catch((err) => alert(err));
  };

  const buscarOportunidadesCadena = (event) => {
    event.preventDefault();
    buscarOportunidades();
  };

  const handleVerDetalle = (id, event) => {
    console.log(id);
    if (event.target.value == 1) {
      console.log("Ver detalle");
      event.target.value = 0;
      history.push({
        pathname: "/detalleOportunidad",
        state: { idOportunidad: id },
      });
    }
    if (event.target.value == 2) {
      console.log("Eliminar");
      event.target.value = 0;
      setOportunidadEliminar(id);
      setShow(true);
    }
  };

  const handleEliminarOportunidades = (id) => {
    setOportunidades((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
  };

  const eliminarOportunidad = () => {
    api
      .delete(`eliminarOportunidad/${oportunidadEliminar}`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        handleEliminarOportunidades(oportunidadEliminar);
        setShow(false);
      })
      .catch((err) => alert(err));
  };

  const handleChangeCadena = (event) => {
    //console.log(event.target.value);
    setCadena(event.target.value);
  };

  const handleChangeBuscarFechas = (event) => {
    console.log(event.target.value);
    setBuscarFechas(event.target.value);
  };

  const handleChangeEtapa = (event) => {
    console.log(event.target.value);
    setEtapa(event.target.value);
  };

  const handleChangeEstado = (event) => {
    console.log(event.target.value);
    setEstado(event.target.value);
  };

  const handleChangeStartActive = (date) => {
    setStartDateActive(date);
  };
  const handleChangeEndActive = (date) => {
    setEndDateActive(date);
  };

  return (
    <div>
      <div className="row">
        <div className="page-header col-md-7">
          <h3 className="page-title"> Oportunidades </h3>
        </div>
        <div className="page-header col-md-3">
          <Alert
            show={mostrarMensajeExito}
            variant="success"
            className="small text-center"
          >
            {" "}
            <i className="px-2 mdi mdi-check-circle"></i>
            Oportunidad registrada correctamente
          </Alert>
        </div>
        <div className="col-md-2">
          <Form.Group>
            <div className="text-right">
              <button
                className="btn btn-primary"
                onClick={() => history.push({ pathname: "/crearOportunidad" })}
              >
                Nueva oportunidad
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
                className="form-control col-sm-10"
                onChange={handleChangeEstado}
              >
                <option value="" disabled selected hidden>
                  Estado de la oportunidad
                </option>
                <option value={""}>Todos los estados</option>
                <option value={"0"}>No vigente</option>
                <option value={"1"}>Vigente</option>
                <option value={"2"}>Vigencia por fechas</option>
              </select>
            </Form.Group>
          </div>

          <div className="col-md-3">
            <Form.Group className="row">
              <select
                className="form-control col-sm-10"
                onChange={handleChangeBuscarFechas}
              >
                <option value="" disabled selected hidden>
                  Buscar por fechas
                </option>
                <option value={0}>Todas las fechas</option>
                <option value={1}>Por fecha de vigencia</option>
              </select>
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group className="row">
              <label className="col-sm-4 col-form-label">
                Fecha de vigencia
              </label>
              <div className="col-sm-4">
                <DatePicker
                  className="form-control w-100"
                  selected={startDateActive}
                  onChange={handleChangeStartActive}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div className="col-sm-4">
                <DatePicker
                  className="form-control w-100"
                  selected={endDateActive}
                  onChange={handleChangeEndActive}
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
                  onSubmit={buscarOportunidadesCadena}
                >
                  <div className="input-group">
                    <div className="input-group-prepend bg-white">
                      <i className="input-group-text border-0 mdi mdi-magnify"></i>
                    </div>
                    <input
                      type="text"
                      className="form-control bg-white border-0"
                      placeholder="Descripción de la oportunidad"
                      onChange={handleChangeCadena}
                    />
                  </div>
                </form>
              </div>
            </Form.Group>
          </div>
          

          <div className="col-md-4">
            <Form.Group className="row">
              <select
                className="form-control col-sm-6"
                onChange={handleChangeEtapa}
              >
                <option value="" disabled selected hidden>
                  Etapa de la oportunidad
                </option>
                <option value={""}>Todas las etapas</option>
                <option value={"0"}>Calificación</option>
                <option value={"1"}>Necesidad de análisis</option>
                <option value={"2"}>Propuesta</option>
                <option value={"3"}>Negociación</option>
                <option value={"4"}>Perdida</option>
                <option value={"5"}>Ganada</option>
              </select>
            </Form.Group>
          </div>

          <div className="col-md-2">
            <Form.Group>
              <div className="text-right">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={buscarOportunidades}
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
                    <th>Descripción</th>
                    <th>Etapa</th>
                    <th>Estado</th>
                    <th>Inicio de vigencia</th>
                    <th>Fin de vigencia</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {oportunidades.map((oportunidad) => (
                    <tr key={oportunidad["id"]}>
                      <td>{oportunidad["descripcion"]}</td>
                      <td>{oportunidad["etapa"]}</td>
                      <td>{oportunidad["estado"]}</td>
                      <td>{oportunidad["inicioVigencia"]}</td>
                      <td>{oportunidad["finVigencia"]}</td>
                      <td>
                        {" "}
                        <select
                          className="form-control"
                          onChange={(e) => handleVerDetalle(oportunidad["id"], e)}
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
              Eliminar oportunidad
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="card-title" style={{ color: "#000000" }}>
            ¿Desea eliminar la oportunidad?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-primary" onClick={handleClose}>
            Cancelar
          </button>
          <Link className="nav-link" to="/tacticas">
            <button className="btn btn-primary" onClick={eliminarOportunidad}>
              Eliminar
            </button>
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Oportunidades;
