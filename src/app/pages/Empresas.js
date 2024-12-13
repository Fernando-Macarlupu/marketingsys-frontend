import React, { useEffect, useState } from "react";
import { Form, Modal, Alert, Pagination } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import "react-datepicker/dist/react-datepicker.css";

const Empresas = () => {
  const location = useLocation();
  const history = useHistory();
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
  const [tipo, setTipo] = useState("");
  const [empresas, setEmpresas] = useState([]);
  const [empresaEliminar, setEmpresaEliminar] = useState(0);
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
    if (location.state == null) console.log("La empresa guardada es null");
    else {
      if (location.state.empresaGuardada == true) {
        setMostrarMensajeExito(true);
        setTimeout(() => {
          setMostrarMensajeExito(false);
        }, 5000);
      } else {
        if (location.state.empresasCargadas == true) {
          setMostrarMensajeExitoCarga(true);
          setTimeout(() => {
            setMostrarMensajeExitoCarga(false);
          }, 5000);
        }
      }
    }
    setUsuarioLogueado(JSON.parse(usuario));
    buscarEmpresasInicial(JSON.parse(usuario)["idCuenta"]);
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

  const buscarEmpresasInicial = (idCuenta) => {
    //console.log("esto es la cadena")
    console.log(cadena);
    let paginasCont = 0;
    setMostrarTabla(false);
    setMostrarCarga(true);
    api
      .post("filtrarEmpresas", {
        cadena: "",
        tipo: "",
        fechaCreacionIni: "",
        fechaCreacionFin: "",
        fechaModificacionIni: "",
        fechaModificacionFin: "",
        propietario: idCuenta,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCarga(false);
        setEmpresas(data);
        if (data.length != null && data.length > 0) {
          paginasCont = Math.ceil(data.length / maxPage);
          setCountPage(paginasCont);
          cargarPaginas(paginasCont);
          setActualPage(1);
        }
        setMostrarTabla(true);
      })
      .catch((err) => alert(err));
  };

  const buscarEmpresas = () => {
    //console.log("esto es la cadena")
    console.log(cadena);
    let fechaCreacionIni = "",
      fechaCreacionFin = "",
      fechaModificacionIni = "",
      fechaModificacionFin = "",
      paginasCont = 0;

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
      .post("filtrarEmpresas", {
        cadena: cadena,
        tipo: tipo,
        fechaCreacionIni: fechaCreacionIni,
        fechaCreacionFin: fechaCreacionFin,
        fechaModificacionIni: fechaModificacionIni,
        fechaModificacionFin: fechaModificacionFin,
        propietario: usuarioLogueado["idCuenta"],
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCarga(false);
        setEmpresas(data);
        if (data.length != null && data.length > 0) {
          paginasCont = Math.ceil(data.length / maxPage);
          setCountPage(paginasCont);
          cargarPaginas(paginasCont);
          setActualPage(1);
        }
        setMostrarTabla(true);
      })
      .catch((err) => alert(err));
  };

  const buscarEmpresasCadena = (event) => {
    event.preventDefault();
    buscarEmpresas();
  };

  const handleVerDetalle = (id, event) => {
    console.log(id);
    if (event.target.value == 1) {
      console.log("Ver detalle");
      event.target.value = 0;
      history.push({
        pathname: "/detalleEmpresa",
        state: { idEmpresa: id },
      });
    }
    if (event.target.value == 2) {
      console.log("Eliminar");
      event.target.value = 0;
      setEmpresaEliminar(id);
      setShow(true);
    }
  };

  const handleEliminarEmpresas = (id) => {
    setEmpresas((prev) => prev.filter((el) => el.id !== id));
    //console.log(event.target.value);
  };

  const eliminarEmpresa = () => {
    api
      .delete(`eliminarEmpresa/${empresaEliminar}`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        handleEliminarEmpresas(empresaEliminar);
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

  return (
    <div>
      <div className="row">
        <div className="page-header col-md-5">
          <h3 className="page-title"> Empresas </h3>
        </div>
        <div className="page-header col-md-3">
          <Alert
            show={mostrarMensajeExito}
            variant="success"
            className="small text-center"
          >
            {" "}
            <i className="px-2 mdi mdi-check-circle"></i>
            Empresa registrada correctamente
          </Alert>
          <Alert
            show={mostrarMensajeExitoCarga}
            variant="success"
            className="small text-center"
          >
            {" "}
            <i className="px-2 mdi mdi-check-circle"></i>
            Empresas cargadas correctamente
          </Alert>
        </div>
        <div className="col-md-2">
          <Form.Group>
            <div className="text-right">
              <button
                className="btn btn-primary"
                onClick={() => history.push({ pathname: "/cargarEmpresas" })}
              >
                Cargar empresas
              </button>
            </div>
          </Form.Group>
        </div>
        <div className="col-md-2">
          <Form.Group>
            <div className="text-right">
              <button
                className="btn btn-primary"
                onClick={() => history.push({ pathname: "/crearEmpresa" })}
              >
                Nueva empresa
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
                  onSubmit={buscarEmpresasCadena}
                >
                  <div className="input-group">
                    <div className="input-group-prepend bg-white">
                      <i className="input-group-text border-0 mdi mdi-magnify"></i>
                    </div>
                    <input
                      type="text"
                      className="form-control bg-white border-0"
                      placeholder="Nombre, telefono o sector de la empresa"
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
                  Tipo de empresa
                </option>
                <option value={""}>Todos los tipos</option>
                <option value={"0"}>Cliente potencial</option>
                <option value={"1"}>Socio</option>
                <option value={"2"}>Revendedor</option>
                <option value={"3"}>Proveedor</option>
              </select>
            </Form.Group>
          </div>
          <div className="col-md-2">
            <Form.Group>
              <div className="text-right">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={buscarEmpresas}
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
          {mostrarTabla && empresas.length > 0 && (
            <div>
              <div
                className="table-responsive"
                style={{ height: "500px", overflow: "auto" }}
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Teléfono</th>
                      <th>Sector</th>
                      <th>Tipo</th>
                      <th>Fecha de creación</th>
                      <th>Fecha de modificación</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {empresas
                      .slice((actualPage - 1) * maxPage, actualPage * maxPage)
                      .map((empresa) => (
                        <tr key={empresa["id"]}>
                          <td>{empresa["nombre"]}</td>
                          <td>{empresa["telefono"]}</td>
                          <td>{empresa["sector"]}</td>
                          <td>{empresa["tipo"]}</td>
                          <td>{empresa["fechaCreacion"]}</td>
                          <td>{empresa["fechaModificacion"]}</td>
                          <td>
                            {" "}
                            <select
                              className="select-menu"
                              onChange={(e) =>
                                handleVerDetalle(empresa["id"], e)
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
          {mostrarTabla && empresas.length == 0 && (
            <Form.Group>
              <label className="col-sm-12 col-form-label">
                No se han encontrado empresas
              </label>
            </Form.Group>
          )}
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="card-title" style={{ color: "#000000" }}>
              Eliminar empresa
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="card-title" style={{ color: "#000000" }}>
            ¿Desea eliminar la empresa?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-primary" onClick={handleClose}>
            Cancelar
          </button>
          <Link className="nav-link" to="/empresas">
            <button className="btn btn-primary" onClick={eliminarEmpresa}>
              Eliminar
            </button>
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Empresas;
