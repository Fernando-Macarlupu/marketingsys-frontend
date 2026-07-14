import React, { useEffect, useState } from "react";
import { Form, Modal, Alert, Pagination } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import "react-datepicker/dist/react-datepicker.css";

const Campanas = () => {
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
  const [campanas, setCampanas] = useState([]);
  const [campanaEliminar, setCampanaEliminar] = useState(0);
  const [mostrarMensajeExito, setMostrarMensajeExito] = useState(false);
  const [mostrarMensajeExitoCarga, setMostrarMensajeExitoCarga] =
    useState(false);

    const [actualPage, setActualPage] = useState(1);
  const [countPage, setCountPage] = useState(0);
  const [pages, setPages] = useState([]);
  const maxPage = 10;

  const handleClose = () => setShow(false);

  useEffect(() => {
    let usuario = localStorage.getItem("marketingSYSusuario");
    if (usuario == null) {
      history.push({
        pathname: "/iniciarSesion",
      });
      return;
    }
    if (location.state == null) console.log("La campana guardada es null");
    else {
      if (location.state.campanaGuardada == true) {
        setMostrarMensajeExito(true);
        setTimeout(() => {
          setMostrarMensajeExito(false);
        }, 5000);
      }
    }
    setUsuarioLogueado(JSON.parse(usuario));
    buscarCampanasInicial(JSON.parse(usuario)["idCuenta"]);
  }, []);

  const cargarPaginas = (paginasCont) => {
    let paginas = [];
    for (let i = 0; i < paginasCont; i++) {
      paginas.push(
        <Pagination.Item onClick={setActualPage(i + 1)}>
          {i + 1}
        </Pagination.Item>
      );
    }
    setPages(paginas);
  };

  const buscarCampanasInicial = (idCuenta) => {
    //console.log("esto es la cadena")
    console.log(cadena);
    let fechaVigenciaIni = "", paginasCont = 0,
      fechaVigenciaFin = "",
      fechaHoy = "",
      fecha = new Date();

    fechaHoy =
      fecha.getDate() +
      "-" +
      parseInt(fecha.getMonth() + 1) +
      "-" +
      fecha.getFullYear();

    setMostrarTabla(false);
    setMostrarCarga(true);
    api
      .post("filtrarCampanas", {
        cadena: "",
        estado: "",
        tipo: "",
        fechaHoy: fechaHoy,
        fechaVigenciaIni: "",
        fechaVigenciaFin: "",
        propietario: idCuenta,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setCampanas(data);
        if (data.length != null && data.length > 0) {
          paginasCont = Math.ceil(data.length / maxPage);
          setCountPage(paginasCont);
          cargarPaginas(paginasCont);
          setActualPage(1);
        }
        setMostrarCarga(false);
        setMostrarTabla(true);
      })
      .catch((err) => alert(err));
  };


  const buscarCampanas = () => {
    //console.log("esto es la cadena")
    console.log(cadena);
    let fechaVigenciaIni = "", paginasCont = 0,
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
      .post("filtrarCampanas", {
        cadena: cadena,
        estado: estado,
        tipo: tipo,
        fechaHoy: fechaHoy,
        fechaVigenciaIni: fechaVigenciaIni,
        fechaVigenciaFin: fechaVigenciaFin,
        propietario: usuarioLogueado["idCuenta"],
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setCampanas(data);
        if (data.length != null && data.length > 0) {
          paginasCont = Math.ceil(data.length / maxPage);
          setCountPage(paginasCont);
          cargarPaginas(paginasCont);
          setActualPage(1);
        }
        setMostrarCarga(false);
        setMostrarTabla(true);
      })
      .catch((err) => alert(err));
  };

  const buscarCampanasCadena = (event) => {
    event.preventDefault();
    buscarCampanas();
  };

  const handleVerDetalle = (id, event) => {
    console.log(id);
    if (event.target.value == 1) {
      console.log("Ver detalle");
      event.target.value = 0;
      history.push({
        pathname: "/detalleCampana",
        state: { idCampana: id },
      });
    }
    if (event.target.value == 2) {
      console.log("Eliminar");
      event.target.value = 0;
      setCampanaEliminar(id);
      setShow(true);
    }
  };

  const handleEliminarCampanas = (id) => {
    setCampanas((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
  };

  const eliminarCampana = () => {
    api
      .delete(`eliminarCampana/${campanaEliminar}`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        handleEliminarCampanas(campanaEliminar);
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
          <h3 className="page-title"> Campañas </h3>
        </div>
        <div className="page-header col-md-3">
          <Alert
            show={mostrarMensajeExito}
            variant="success"
            className="small text-center"
          >
            {" "}
            <i className="px-2 mdi mdi-check-circle"></i>
            Campaña registrada correctamente
          </Alert>
        </div>
        <div className="col-md-2">
          <Form.Group>
            <div className="text-right">
              <button
                className="btn btn-primary"
                onClick={() => history.push({ pathname: "/crearCampana" })}
              >
                Nueva campaña
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
                  Estado de la campaña
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
                  onSubmit={buscarCampanasCadena}
                >
                  <div className="input-group">
                    <div className="input-group-prepend bg-white">
                      <i className="input-group-text border-0 mdi mdi-magnify"></i>
                    </div>
                    <input
                      type="text"
                      className="form-control bg-white border-0"
                      placeholder="Descripción de la campaña"
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
                  Tipo de campaña
                </option>
                <option value={""}>Todos los tipos</option>
                <option value={"0"}>Campaña de programa</option>
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
                  onClick={buscarCampanas}
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
          {mostrarTabla && campanas.length>0 && ( <div>
            <div className="table-responsive" style={{ height: "500px", overflow: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th>Presupuesto S/</th>
                    <th>Estado</th>
                    <th>Inicio de vigencia</th>
                    <th>Fin de vigencia</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {campanas.slice((actualPage - 1) * maxPage, actualPage * maxPage).map((campana) => (
                    <tr key={campana["id"]}>
                      <td>{campana["descripcion"]}</td>
                      <td>{campana["tipo"]}</td>
                      <td>{campana["presupuesto"]}</td>
                      <td>{campana["estado"]}</td>
                      <td>{campana["inicioVigencia"]}</td>
                      <td>{campana["finVigencia"]}</td>
                      <td>
                        {" "}
                        <select
                          className="select-menu"
                          onChange={(e) => handleVerDetalle(campana["id"], e)}
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
                          <div className="row">
                          <Pagination className="mx-auto">
                            {pages.map((_, index) => {
                              return (
                                <Pagination.Item
                                  onClick={() => setActualPage(index + 1)}
                                  key={index + 1}
                                  active={index + 1 === actualPage}
                                >
                                  {index + 1}
                                </Pagination.Item>
                              );
                            })}
                          </Pagination>
                        </div> </div>
          )}
          {mostrarTabla && campanas.length == 0 && (
            <Form.Group>
              <label className="col-sm-12 col-form-label">
                No se han encontrado campañas
              </label>
            </Form.Group>
          )}
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="card-title" style={{ color: "#000000" }}>
              Eliminar campaña
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="card-title" style={{ color: "#000000" }}>
            ¿Desea eliminar la campaña?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-primary" onClick={handleClose}>
            Cancelar
          </button>
          <Link className="nav-link" to="/tacticas">
            <button className="btn btn-primary" onClick={eliminarCampana}>
              Eliminar
            </button>
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Campanas;
