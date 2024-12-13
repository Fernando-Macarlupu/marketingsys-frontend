import React, { useEffect, useState } from "react";
import { Form, Modal, Alert, Pagination } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import "react-datepicker/dist/react-datepicker.css";

const Reportes = () => {
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
  const [reportes, setReportes] = useState([]);
  const [reporteEliminar, setReporteEliminar] = useState(0);
  const [mostrarMensajeExito, setMostrarMensajeExito] = useState(false);
  const [mostrarMensajeExitoCarga, setMostrarMensajeExitoCarga] =
    useState(false);
  
  const [actualPage, setActualPage] = useState(1);
  const [countPage, setCountPage] = useState(0);
  const [pages, setPages] = useState([]);
  const maxPage = 10;

  useEffect(() => {
    let usuario = localStorage.getItem("marketingSYSusuario");
    if (usuario == null) {
      history.push({
        pathname: "/iniciarSesion",
      });
      return;
    }
    if (location.state == null) console.log("El reporte guardado es null");
    else {
      if (location.state.reporteGuardado == true) {
        setMostrarMensajeExito(true);
        setTimeout(() => {
          setMostrarMensajeExito(false);
        }, 5000);
      }
    }
    setUsuarioLogueado(JSON.parse(usuario));
    buscarReportesInicial(JSON.parse(usuario)["idCuenta"]);
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

  const buscarReportesInicial = (idCuenta) => {
    //console.log("esto es la cadena")
    console.log(cadena);
    let fechaCreacionIni = "", paginasCont=0,
      fechaCreacionFin = "",
      fechaModificacionIni = "",
      fechaModificacionFin = "";
    setMostrarTabla(false);
    setMostrarCarga(true);
    api
      .post("filtrarReportes", {
        cadena: "",
        fechaCreacionIni: "",
        fechaCreacionFin: "",
        fechaModificacionIni: "",
        fechaModificacionFin: "",
        propietario: idCuenta,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setReportes(data);
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
  
  const buscarReportes = () => {
    //console.log("esto es la cadena")
    console.log(cadena);
    let fechaCreacionIni = "", paginasCont=0,
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
      .post("filtrarReportes", {
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
        setReportes(data);
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

  const buscarReportesCadena = (event) => {
    event.preventDefault();
    buscarReportes();
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

  const handleEliminarReportes = (id) => {
    setReportes((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
  };

  const eliminarReporte = () => {
    api
      .delete(`eliminarReporte/${reporteEliminar}`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        handleEliminarReportes(reporteEliminar);
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
        pathname: "/detalleReporte",
        state: { idReporte: id },
      });
    }
    if (event.target.value == 2) {
      console.log("Eliminar");
      event.target.value = 0;
      setReporteEliminar(id);
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
          <h3 className="page-title"> Reportes </h3>
        </div>
        <div className="page-header col-md-3">
          <Alert
            show={mostrarMensajeExito}
            variant="success"
            className="small text-center"
          >
            {" "}
            <i className="px-2 mdi mdi-check-circle"></i>
            Reporte registrado correctamente
          </Alert>
        </div>
        <div className="col-md-2">
          <Form.Group>
            <div className="text-right">
              <button
                className="btn btn-primary"
                onClick={() => history.push({ pathname: "/crearReporte" })}
              >
                Nuevo reporte
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
          <div className="col-md-10">
            <Form.Group className="row">
              <div className="search-field col-sm-6">
                <form
                  className="d-flex align-items-center h-100"
                  onSubmit={buscarReportesCadena}
                >
                  <div className="input-group">
                    <div className="input-group-prepend bg-white">
                      <i className="input-group-text border-0 mdi mdi-magnify"></i>
                    </div>
                    <input
                      type="text"
                      className="form-control bg-white border-0"
                      placeholder="Nombre del reporte"
                      onChange={handleChangeCadena}
                    />
                  </div>
                </form>
              </div>
            </Form.Group>
          </div>
          <div className="col-md-2">
            <Form.Group>
              <div className="text-right">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={buscarReportes}
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
          {mostrarTabla && reportes.length>0 && ( <div>
          <div className="table-responsive" style={{ height: "500px", overflow: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fecha de creación</th>
                  <th>Fecha de modificación</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reportes.slice((actualPage - 1) * maxPage, actualPage * maxPage).map((reporte) => (
                  <tr key={reporte["id"]}>
                    <td>{reporte["nombre"]}</td>
                    <td>{reporte["fechaCreacion"]}</td>
                    <td>{reporte["fechaModificacion"]}</td>
                    <td>
                      <select
                        className="select-menu"
                        onChange={(e) => handleVerDetalle(reporte["id"], e)}
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
        </div>
        </div>
          )}
          {mostrarTabla && reportes.length == 0 && (
            <Form.Group>
              <label className="col-sm-12 col-form-label">
                No se han encontrado reportes
              </label>
            </Form.Group>
          )}
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="card-title" style={{ color: "#000000" }}>
              Eliminar reporte
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="card-title" style={{ color: "#000000" }}>
            ¿Desea eliminar el reporte?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-primary" onClick={handleClose}>
            Cancelar
          </button>
          <Link className="nav-link" to="/informes">
            <button className="btn btn-primary" onClick={eliminarReporte}>
              Eliminar
            </button>
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Reportes;
