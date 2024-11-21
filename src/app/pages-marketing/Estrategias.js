import React, { useEffect, useState } from "react";
import { Form, Modal, Alert } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import "react-datepicker/dist/react-datepicker.css";

const Estrategias = () => {
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
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");
  const [estrategias, setEstrategias] = useState([]);
  const [estrategiaEliminar, setEstrategiaEliminar] = useState(0);
  const [tipoEstrategiaEliminar, setTipoEstrategiaEliminar] = useState("");
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
    if (location.state == null) console.log("La estrategia guardada es null");
    else {
      if (location.state.estrategiaGuardada == true) {
        setMostrarMensajeExito(true);
        setTimeout(() => {
          setMostrarMensajeExito(false);
        }, 5000);
      }
    }
    setUsuarioLogueado(JSON.parse(usuario));
  }, []);

  const buscarEstrategias = () => {
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
      .post("filtrarEstrategias", {
        cadena: cadena,
        tipo: tipo,
        estado: estado,
        fechaHoy: fechaHoy,
        fechaVigenciaIni: fechaVigenciaIni,
        fechaVigenciaFin: fechaVigenciaFin,
        propietario: usuarioLogueado["idCuenta"],
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setEstrategias(data);
        setMostrarCarga(false);
        setMostrarTabla(true);
      })
      .catch((err) => alert(err));
  };

  const buscarEstrategiasCadena = (event) => {
    event.preventDefault();
    buscarEstrategias();
  };

  const handleVerDetalle = (id, tipo, event) => {
    let idTipo = "";
    if (tipo == "Programa") idTipo = "0";
    else idTipo = "1";
    console.log(id);
    if (event.target.value == 1) {
      console.log("Ver detalle");
      event.target.value = 0;
      history.push({
        pathname: "/detalleEstrategia",
        state: { idEstrategia: id, tipo: idTipo },
      });
    }
    if (event.target.value == 2) {
      console.log("Eliminar");
      event.target.value = 0;
      setEstrategiaEliminar(id);
      setTipoEstrategiaEliminar(idTipo);
      setShow(true);
    }
  };

  const handleEliminarEstrategias = (id) => {
    setEstrategias((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
  };

  const eliminarEstrategia = () => {
    if (tipoEstrategiaEliminar == "0")
      api
        .delete(`eliminarEstrategia/${estrategiaEliminar}`)
        .then((res) => res.data)
        .then((data) => {
          console.log(data);
          handleEliminarEstrategias(estrategiaEliminar);
          setShow(false);
        })
        .catch((err) => alert(err));
    else {
      if (tipoEstrategiaEliminar == "1")
        api
          .delete(`eliminarCampana/${estrategiaEliminar}`)
          .then((res) => res.data)
          .then((data) => {
            console.log(data);
            //handleEliminarEmpresas(empresaEliminar);
            setShow(false);
          })
          .catch((err) => alert(err));
    }
  };

  const handleChangeCadena = (event) => {
    //console.log(event.target.value);
    setCadena(event.target.value);
  };

  const handleChangeBuscarFechas = (event) => {
    console.log(event.target.value);
    setBuscarFechas(event.target.value);
  };

  const handleChangeTipo = (event) => {
    console.log(event.target.value);
    setTipo(event.target.value);
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
          <h3 className="page-title"> Estrategias </h3>
        </div>
        <div className="page-header col-md-3">
          <Alert
            show={mostrarMensajeExito}
            variant="success"
            className="small text-center"
          >
            {" "}
            <i className="px-2 mdi mdi-check-circle"></i>
            Estrategia registrada correctamente
          </Alert>
        </div>
        <div className="col-md-2">
          <Form.Group>
            <div className="text-right">
              <button
                className="btn btn-primary"
                onClick={() => history.push({ pathname: "/crearEstrategia" })}
              >
                Nueva estrategia
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
                  Estado de la estrategia
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
                  onSubmit={buscarEstrategiasCadena}
                >
                  <div className="input-group">
                    <div className="input-group-prepend bg-white">
                      <i className="input-group-text border-0 mdi mdi-magnify"></i>
                    </div>
                    <input
                      type="text"
                      className="form-control bg-white border-0"
                      placeholder="Descripción de la estrategia"
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
                onChange={handleChangeTipo}
              >
                <option value="" disabled selected hidden>
                  Tipo de estrategia
                </option>
                <option value={""}>Todos los tipos</option>
                <option value={"0"}>Programa</option>
                <option value={"1"}>Campaña stand-alone</option>
              </select>
            </Form.Group>
          </div>

          <div className="col-md-2">
            <Form.Group>
              <div className="text-right">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={buscarEstrategias}
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
                    <th>Tipo</th>
                    <th>Sponsor</th>
                    <th>Presupuesto S/</th>
                    <th>Estado</th>
                    <th>Inicio de vigencia</th>
                    <th>Fin de vigencia</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {estrategias.map((estrategia) => (
                    <tr key={estrategia["id"] + estrategia["tipo"]}>
                      <td>{estrategia["descripcion"]}</td>
                      <td>{estrategia["tipo"]}</td>
                      <td>{estrategia["sponsor"]}</td>
                      <td>{estrategia["presupuesto"]}</td>
                      <td>{estrategia["estado"]}</td>
                      <td>{estrategia["inicioVigencia"]}</td>
                      <td>{estrategia["finVigencia"]}</td>
                      <td>
                        {" "}
                        <select
                          className="form-control"
                          onChange={(e) =>
                            handleVerDetalle(
                              estrategia["id"],
                              estrategia["tipo"],
                              e
                            )
                          }
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
              Eliminar estrategia
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="card-title" style={{ color: "#000000" }}>
            ¿Desea eliminar la estrategia?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-primary" onClick={handleClose}>
            Cancelar
          </button>
          <Link className="nav-link" to="/estrategias">
            <button className="btn btn-primary" onClick={eliminarEstrategia}>
              Eliminar
            </button>
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Estrategias;
