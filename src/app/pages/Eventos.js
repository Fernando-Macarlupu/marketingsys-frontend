import React, { useEffect, useState } from "react";
import { Tabs, Tab, Form, Modal, Alert } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import "react-datepicker/dist/react-datepicker.css";

const Eventos = () => {
  const history = useHistory();
  const [startDateCreate, setStartDateCreate] = useState(new Date());
  const [endDateCreate, setEndDateCreate] = useState(new Date());
  const [actividades, setActividades] = useState([]);
  const [errores, setErrores] = useState([]);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [mostrarCarga, setMostrarCarga] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState({});

  const handleChangeStartCreate = (date) => {
    setStartDateCreate(date);
  };
  const handleChangeEndCreate = (date) => {
    setEndDateCreate(date);
  };

  const buscarActividades = () => {
    //console.log("esto es la cadena")
    let fechaIni = "",
      fechaFin = "";

    fechaIni =
      startDateCreate.getDate() +
      "-" +
      parseInt(startDateCreate.getMonth() + 1) +
      "-" +
      startDateCreate.getFullYear();
    fechaFin =
      endDateCreate.getDate() +
      "-" +
      parseInt(endDateCreate.getMonth() + 1) +
      "-" +
      endDateCreate.getFullYear();
    setMostrarTabla(false);
    setMostrarCarga(true);
    api
      .post("filtrarLogs", {
        tipo: "0",
        fechaIni: fechaIni,
        fechaFin: fechaFin,
        propietario: usuarioLogueado["idCuenta"],
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setActividades(data);
        setMostrarCarga(false);
        setMostrarTabla(true);
      })
      .catch((err) => alert(err));
  };

  const buscarErrores = () => {
    //console.log("esto es la cadena")
    let fechaIni = "",
      fechaFin = "";

    fechaIni =
      startDateCreate.getDate() +
      "-" +
      parseInt(startDateCreate.getMonth() + 1) +
      "-" +
      startDateCreate.getFullYear();
    fechaFin =
      endDateCreate.getDate() +
      "-" +
      parseInt(endDateCreate.getMonth() + 1) +
      "-" +
      endDateCreate.getFullYear();
    setMostrarTabla(false);
    setMostrarCarga(true);
    api
      .post("filtrarLogs", {
        tipo: "1",
        fechaIni: fechaIni,
        fechaFin: fechaFin,
        propietario: usuarioLogueado["idCuenta"],
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setErrores(data);
        setMostrarCarga(false);
        setMostrarTabla(true);
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
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Registro de eventos </h3>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="justify-content-between align-items-center tab-transparent">
            <Tabs defaultActiveKey="Actividades" className="nav">
              <Tab eventKey="Actividades" title="Actividades">
                <div>
                  <div className="row">
                    <div className="page-header col-md-5">
                      <h3 className="page-title"> Actividades </h3>
                    </div>
                    <div className="page-header col-md-3"></div>
                    <div className="col-md-2"></div>
                    <div className="col-md-2"></div>
                  </div>
                  <form className="forms-sample">
                    <div className="row">
                      <div className="col-md-8">
                        <Form.Group className="row">
                          <label className="col-sm-4 col-form-label">
                            Fecha de actividades
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
                    </div>
                    <div className="row">
                      <div className="col-md-6"></div>
                      <div className="col-md-4"></div>
                      <div className="col-md-2">
                        <Form.Group>
                          <div className="text-right">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={buscarActividades}
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
                                <th>Fecha y hora</th>
                                <th>Fuente</th>
                                <th>Descripción</th>
                              </tr>
                            </thead>
                            <tbody>
                              {actividades.map((actividad) => (
                                <tr key={actividad["id"]}>
                                  <td>{actividad["fechaHora"]}</td>
                                  <td>{actividad["fuente"]}</td>
                                  <td>{actividad["descripcion"]}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="Errores" title="Errores">
                <div>
                  <div className="row">
                    <div className="page-header col-md-5">
                      <h3 className="page-title"> Errores </h3>
                    </div>
                    <div className="page-header col-md-3"></div>
                    <div className="col-md-2"></div>
                    <div className="col-md-2"></div>
                  </div>
                  <form className="forms-sample">
                    <div className="row">
                      <div className="col-md-8">
                        <Form.Group className="row">
                          <label className="col-sm-4 col-form-label">
                            Fecha de errores
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
                    </div>
                    <div className="row">
                      <div className="col-md-6"></div>
                      <div className="col-md-4"></div>
                      <div className="col-md-2">
                        <Form.Group>
                          <div className="text-right">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={buscarErrores}
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
                                <th>Fecha y hora</th>
                                <th>Código</th>
                                <th>Fuente</th>
                                <th>Descripción</th>
                              </tr>
                            </thead>
                            <tbody>
                              {errores.map((error) => (
                                <tr key={error["id"]}>
                                  <td>{error["fechaHora"]}</td>
                                  <td>{error["codigo"]}</td>
                                  <td>{error["fuente"]}</td>
                                  <td>{error["descripcion"]}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Eventos;
