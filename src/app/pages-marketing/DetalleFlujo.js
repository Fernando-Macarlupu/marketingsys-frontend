import BpmnModeler from "bpmn-js/dist/bpmn-modeler.production.min.js";

import React, { useRef, useEffect, useState } from "react";
import { Tabs, Tab, Form, FormGroup, Modal } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
//import BpmnView from "./diagramViewer";
import DatePicker from "react-datepicker";
import api from "../api";
import bsCustomFileInput from "bs-custom-file-input";
//import ModelerCreator from "./diagramCreator/ModelerCreator";
import DiagramaBPMN from "./DiagramaBPMN";

const DetalleFlujo = () => {
  const history = useHistory();
  const location = useLocation();
  const container = useRef(null);
  const [modeler, setModeler] = useState(null);
  const [diagramXML, setDiagramXML] =
    useState(`<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:process id="Process_1" isExecutable="false">
    <bpmn2:startEvent id="StartEvent_1"/>
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`);

  const [show, setShow] = useState(false);
  const [bpmnViewer, setBpmnViewer] = useState(null);
  const editorModelo = useRef(null);
  const [mostrarCargaDatos, setMostrarCargaDatos] = useState(false);
  const [mostrarDatos, setMostrarDatos] = useState(true);


  const [idFlujo, setIdFlujo] = useState(0);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [contenido, setContenido] = useState("");

  const [usuarioLogueado, setUsuarioLogueado] = useState({});

  const [propietario, setPropietario] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (nombre == "") alert("Ingrese el nombre del flujo de trabajo");
    else {
      if (modeler != null) {
        modeler.saveXML({ format: true }).then(({ xml, error }) => {
          if (error) {
            console.error(error);
            return;
          }
          setContenido(xml);
          console.log("UPDATE XML:", xml);
        });
      }
      setShow(true);
    }
  };

  const guardarFlujo = () => {
    let cuerpo = {
      idFlujo: idFlujo,
      nombre: nombre,
      descripcion: descripcion,
      contenido: contenido,
      propietario: propietario,
    };
    console.log("cuerpo a subir");
    console.log(cuerpo);
    //setShow(false);
    setMostrarDatos(false);
    setMostrarCargaDatos(true);
    api
      .post("registrarFlujo", cuerpo)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setMostrarCargaDatos(false);
        setMostrarDatos(true);
        setShow(false);
        history.push({
          pathname: "/flujos",
          state: { flujoGuardado: true },
        });
      })
      .catch((err) => alert(err));
  };

  const cargarFlujo = () => {
    setMostrarDatos(false);
    setMostrarCargaDatos(true);

      api
        .get(`detalleFlujo/${location.state.idFlujo}`)
        .then((res) => res.data)
        .then((data) => {
          console.log(data);
          setIdFlujo(parseInt(data["idFlujo"]));
          setNombre(data["nombre"]);
          setDescripcion(data["descripcion"]);
          setPropietario(parseInt(data["propietario"]));
          if(data["contenido"]!="") setDiagramXML(data["contenido"]);
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
    cargarFlujo();
  }, []);

  const componentDidMount = () => {
    bsCustomFileInput.init();
    console.log("Holaaaa");
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
              <h3 className="page-title"> Detalle de flujo de trabajo </h3>
            </div>
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <h4 className="card-title col-md-8">
                        Datos del flujo de trabajo
                      </h4>
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
                              Nombre<code>*</code>
                            </label>
                            <div className="col-sm-12">
                              <Form.Control
                                type="text"
                                value={nombre}
                                onChange={({ target }) =>
                                  setNombre(target.value)
                                }
                              />
                            </div>
                          </Form.Group>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <Form.Group>
                            <label className="col-sm-12 col-form-label">
                              Descripción
                            </label>
                            <div className="col-sm-12">
                              <Form.Control
                                type="text"
                                value={descripcion}
                                onChange={({ target }) =>
                                  setDescripcion(target.value)
                                }
                              />
                            </div>
                          </Form.Group>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <Form.Group>
                            <label className="col-sm-12 col-form-label">
                              Configuración del flujo de trabajo<code>*</code>
                            </label>
                            <div className="col-sm-12">
                              <DiagramaBPMN
                                container={container}
                                modeler={modeler}
                                setModeler={setModeler}
                                diagramXML={diagramXML}
                              />
                            </div>
                          </Form.Group>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() =>
                              history.push({
                                pathname: "/flujos",
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
            </div>
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                <h4 className="card-title" style={{ color: "#000000" }}>
                  Guardar flujo
                </h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5 className="card-title" style={{ color: "#000000" }}>
                ¿Desea guardar el flujo?
              </h5>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-outline-primary" onClick={handleClose}>
                Cancelar
              </button>

              <button className="btn btn-primary" onClick={guardarFlujo}>
                Guardar
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default DetalleFlujo;
