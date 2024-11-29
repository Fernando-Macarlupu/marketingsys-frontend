import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import "react-datepicker/dist/react-datepicker.css";
import { Line, Bar, Doughnut, Pie, Scatter } from "react-chartjs-2";

const Dashboard = () => {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState({});
  const [mostrarCargaDatos, setMostrarCargaDatos] = useState(false);
  const [mostrarDatos, setMostrarDatos] = useState(true);
  const [componentes, setComponentes] = useState([]);

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  const doughnutPieOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const cargarDashboard = (id) => {
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .get(`detalleDashboardPrincipal/${id}`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        if(Object.keys(data).length>0) {
          setComponentes(data["componentes"]);
        }
        setMostrarCargaDatos(false);
        setMostrarDatos(true);
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
    cargarDashboard(usuarioPropiedades['idCuenta']);
  }, []);
  
  return (
    <div>
      <div className="row">
        <div className="page-header col-md-8">
          <h3 className="page-title"> Dashboard </h3>
        </div>
      </div>
      <div className="row">
                    {componentes.map((componente) => (
                      <div className="col-md-6">
                        {componente["tipo"] == "0" && (
                          <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                              <div className="card-body">
                                <h4 className="card-title">
                                  {componente["titulo"]}
                                </h4>
                                <h5 className="card-subtitle">
                                  {componente["subtitulo"]}
                                </h5>
                                <Bar
                                  data={{
                                    labels: componente["labels"],
                                    datasets: [
                                      {
                                        label: "",
                                        data: componente["cantidades"],
                                        backgroundColor: [
                                          "rgba(255, 99, 132, 0.2)",
                                          "rgba(54, 162, 235, 0.2)",
                                          "rgba(255, 206, 86, 0.2)",
                                          "rgba(75, 192, 192, 0.2)",
                                          "rgba(153, 102, 255, 0.2)",
                                          "rgba(255, 159, 64, 0.2)",
                                        ],
                                        borderColor: [
                                          "rgba(255,99,132,1)",
                                          "rgba(54, 162, 235, 1)",
                                          "rgba(255, 206, 86, 1)",
                                          "rgba(75, 192, 192, 1)",
                                          "rgba(153, 102, 255, 1)",
                                          "rgba(255, 159, 64, 1)",
                                        ],
                                        borderWidth: 1,
                                        fill: false,
                                      },
                                    ],
                                  }}
                                  options={options}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {componente["tipo"] == "1" && (
                          <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                              <div className="card-body">
                                <h4 className="card-title">
                                  {componente["titulo"]}
                                </h4>
                                <h5 className="card-subtitle">
                                  {componente["subtitulo"]}
                                </h5>
                                <Line
                                  data={{
                                    labels: componente["labels"],
                                    datasets: [
                                      {
                                        label: "",
                                        data: componente["cantidades"],
                                        backgroundColor: [
                                          "rgba(255, 99, 132, 0.2)",
                                          "rgba(54, 162, 235, 0.2)",
                                          "rgba(255, 206, 86, 0.2)",
                                          "rgba(75, 192, 192, 0.2)",
                                          "rgba(153, 102, 255, 0.2)",
                                          "rgba(255, 159, 64, 0.2)",
                                        ],
                                        borderColor: [
                                          "rgba(255,99,132,1)",
                                          "rgba(54, 162, 235, 1)",
                                          "rgba(255, 206, 86, 1)",
                                          "rgba(75, 192, 192, 1)",
                                          "rgba(153, 102, 255, 1)",
                                          "rgba(255, 159, 64, 1)",
                                        ],
                                        borderWidth: 1,
                                        fill: false,
                                      },
                                    ],
                                  }}
                                  options={options}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {componente["tipo"] == "2" && (
                          <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                              <div className="card-body">
                                <h4 className="card-title">
                                  {componente["titulo"]}
                                </h4>
                                <h5 className="card-subtitle">
                                  {componente["subtitulo"]}
                                </h5>
                                <Pie
                                  data={{
                                    datasets: [
                                      {
                                        data: componente["cantidades"],
                                        backgroundColor: [
                                          "rgba(255, 99, 132, 0.5)",
                                          "rgba(54, 162, 235, 0.5)",
                                          "rgba(255, 206, 86, 0.5)",
                                          "rgba(75, 192, 192, 0.5)",
                                          "rgba(153, 102, 255, 0.5)",
                                          "rgba(255, 159, 64, 0.5)",
                                        ],
                                        borderColor: [
                                          "rgba(255,99,132,1)",
                                          "rgba(54, 162, 235, 1)",
                                          "rgba(255, 206, 86, 1)",
                                          "rgba(75, 192, 192, 1)",
                                          "rgba(153, 102, 255, 1)",
                                          "rgba(255, 159, 64, 1)",
                                        ],
                                      },
                                    ],
                                    labels: componente["labels"],
                                  }}
                                  options={doughnutPieOptions}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
    </div>
  );
};
export default Dashboard;
