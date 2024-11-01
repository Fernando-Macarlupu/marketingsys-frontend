import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Button, ProgressBar, Modal } from "react-bootstrap";
import bsCustomFileInput from "bs-custom-file-input";
import api from "../api";
import { parse } from "papaparse";
import { usePapaParse } from "react-papaparse";

const CargarContactos = () => {
  const posiblesCampos = [
    "Nombre completo",
    "Estado",
    "Correo",
    "Direcciones",
    "Telefonos",
    "Redes",
    "Empresa",
  ];
  const posiblesCamposIndividual = ["Nombre completo", "Estado", "Correo", "Empresa"];
  const posiblesCamposLista = [
    "Direcciones",
    "Telefonos",
    "Redes",
  ];

  const RespuestaBack = {
    "campos":[
      "campo1","campo2","campo3"
    ],
    "datos":[
      {"campo1": 1,"campo2": 2,"campo3": 3},
      {"campo1": 1,"campo2": 2,"campo3": 3},
      {"campo1": 1,"campo2": 2,"campo3": 3}
    ]
  }

  const history = useHistory();
  const [columnasVerificacion, setColumnasVerificacion] = useState([]);

  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});

  const [dataCarga, setDataCarga] = useState({});
  const [contactos, setContactos] = useState([]);

  const [data, setData] = useState([]);
  const [filas, setFilas] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [habilitado, setHabilitado] = useState(false);

  const [usuarioLogueado, setUsuarioLogueado] = useState({});

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


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


  function getExtension(filename) {
    return filename.split(".").pop();
  }

  const handleSaveConfirm = () =>{
    console.log(dataCarga);
     api
     .post("cargarContactos", dataCarga)
     .then((res) => res.data)
     .then((data) => {
       console.log(data);
       setShow(false);
       history.push({
        pathname: "/contactos",
        state: { contactoGuardado: false, contactosCargados: true }
      });
     })
     .catch((err) => alert(err));
  }

  const handleSave = () =>{
    console.log("verificacion");
    let columnasCopia = columnasVerificacion;
    console.log(columnasCopia);
    if(columnasCopia.includes("")){
      return alert("Finalice de asignar todos los campos");
    }
    else{
      //ASIGNAR LOS CAMPOS
      let filasGuardar = filas;
      for (let indexFila = 0; indexFila < filas.length; indexFila++) {
        for (let indexColumna = 0; indexColumna < columnas.length; indexColumna++) {
          if (columnas[indexColumna]["nombre"]!= columnasVerificacion[indexColumna]){
            console.log("diferencia");
            console.log(columnas[indexColumna]["nombre"]);
            console.log(columnasVerificacion[indexColumna]);
            filasGuardar[indexFila][String(columnasVerificacion[indexColumna])] = filasGuardar[indexFila][String(columnas[indexColumna]["nombre"])]; 
            delete filasGuardar[indexFila][String(columnas[indexColumna]["nombre"])];
          }
        }
      }
      setDataCarga({"campos": columnasVerificacion, "datos": filasGuardar, propietario: usuarioLogueado['idCuenta'],})
      console.log(dataCarga);
      setShow(true);
    }
  }

  const handleFile = (event) => {
    event.preventDefault();
    const fileToUpload = event.target.files[0];
    console.log(getExtension(fileToUpload["name"]));
    if (getExtension(fileToUpload["name"]) == "csv") {
      setFile(fileToUpload);
      setHabilitado(true);
    } else {
      alert("Seleccione un archivo en formato csv");
    }
  };

  const handleDropdown = (event) => {
    event.preventDefault();
    let columnasCopia = columnasVerificacion;
    columnasCopia[parseInt(event.target.id)] = event.target.value;
    setColumnasVerificacion(columnasCopia);
  };

  const handleParse = () => {
    // If user clicks the parse button without
    // a file we show a error
    if (!habilitado) return alert("Seleccione un archivo en formato csv");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = parse(target.result, {
        header: true,
      });
      const parsedData = csv.data;
      //console.log(parsedData);
      //const rows = Object.keys(parsedData[0]);

      let rows = [];
      for (let index = 0; index < parsedData.length - 1; index++) {
        const row = Object(parsedData[index]);
        rows.push(row);
      }
      console.log("filas leidas");
      console.log(rows);
      setFilas(rows);
      const columns = Object.keys(parsedData[0]);
      console.log(columns);

      let ColumnasInfo = [];
      let columnasVerif = []
      for (let index = 0; index < columns.length; index++) {
        let tipo = 0;
        let asignado = 0;
        if (posiblesCampos.includes(columns[index])) asignado = 1;
        if (posiblesCamposIndividual.includes(columns[index])) tipo = 1;
        else {
          if (posiblesCamposLista.includes(columns[index])) tipo = 2;
        }
        const column = {
          id: index,
          nombre: columns[index],
          tipo: tipo,
          asignado: asignado,
        };
        if(asignado==1){
          columnasVerif.push(columns[index]);
        }
        else{
          columnasVerif.push("");
        }
        
        ColumnasInfo.push(column);
      }

      setColumnasVerificacion(columnasVerif);
      setColumnas(ColumnasInfo);

      const res = rows.reduce((acc, e, i) => {
        return [...acc, [[e], columns[i]]];
      }, []);
      console.log(res);
      setData(res);
    };
    reader.readAsText(file);
  };

  const componentDidMount = () => {
    bsCustomFileInput.init();
  };

  const handleNext = () => {
    if (habilitado) {
      setStep(step + 1);
    } else {
      alert("Seleccione un archivo en formato csv");
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submission
  };

  const handleRegistrarContactos = (event) => {
    event.preventDefault();
    // handle form submission
  };

  return (
    <>
      <div>
        <div className="page-header">
          <h3 className="page-title"> Cargar contactos </h3>
        </div>
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                {step == 1 && (
                  <div>
                    <div className="row">
                      <div className="col-md-6 border-top border-4 border-secondary">
                        <Form.Group className="pt-3">
                          <label className="col-sm-12 font-weight-bold">
                            1. Carga de contactos
                          </label>
                          <label className="col-sm-12">
                            Seleccione el archivo para la carga de contactos
                          </label>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="pt-3">
                          <label
                            className="col-sm-12 font-weight-bold"
                            style={{ color: "#A2A9B0" }}
                          >
                            2. Asignación de campos
                          </label>
                          <label
                            className="col-sm-12"
                            style={{ color: "#A2A9B0" }}
                          >
                            Configure los campos de la lista cargada
                          </label>
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <h4 className="card-title col-md-8">
                        Carga de contactos
                      </h4>
                      <div className="col-md-4">
                        <Form.Group>
                          <label className="col-form-label float-md-right">
                            <code>*</code> Información obligatoria
                          </label>
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-9">
                        <Form.Group>
                          <label>
                            <span className="icon-bg">
                              <i
                                className="mdi mdi-alert-circle-outline"
                                style={{ color: "#E4A11B" }}
                              ></i>
                            </span>
                            <span>
                              La máxima cantidad de registros a cargar es 500
                            </span>
                          </label>
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <button
                            type="button"
                            className="btn btn-primary float-sm-right"
                          >
                            Descargar plantilla
                          </button>
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <Form.Group>
                          <label className="col-sm-12 col-form-label">
                            Archivo<code>*</code>
                          </label>
                          <div className="custom-file">
                            <Form.Control
                              type="file"
                              className="form-control visibility-hidden"
                              onChange={handleFile}
                              id="archivoContactos"
                              lang="es"
                            />
                            <label
                              className="custom-file-label"
                              htmlFor="archivoContactos"
                            >
                              {habilitado ? file.name : ""}
                            </label>
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group>
                          <label className="col-sm-12 col-form-label"></label>
                          <label className="col-sm-12 col-form-label"></label>
                          <label>
                            <span className="icon-bg">
                              <i
                                className="mdi mdi-alert-circle-outline"
                                style={{ color: "#E4A11B" }}
                              ></i>
                            </span>
                            <span>
                              El archivo subido debe estar en formato .csv
                            </span>
                          </label>
                        </Form.Group>
                      </div>

                      <div className="col-md-2">
                        <Form.Group>
                          <button
                            onClick={handleParse}
                            type="button"
                            className="btn btn-primary float-sm-right align-bottom"
                          >
                            Cargar lista
                          </button>
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <Form.Group>
                          <label className="col-sm-12 col-form-label">
                            Lista cargada
                          </label>
                          <div className="col-sm-12">
                            <div className="table-responsive">
                              <table className="table">
                                <thead>
                                  <tr>
                                    {columnas.map((columna) => (
                                      <th>{columna["nombre"]}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {filas.map((fila) => (
                                    <tr>
                                      {Object.entries(fila).map(([llave, valor]) => (
                                        <td>{valor}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                )}
                {step == 2 && (
                  <div>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="pt-3">
                          <label
                            className="col-sm-12 font-weight-bold"
                            style={{ color: "#A2A9B0" }}
                          >
                            1. Carga de contactos
                          </label>
                          <label
                            className="col-sm-12"
                            style={{ color: "#A2A9B0" }}
                          >
                            Seleccione el archivo para la carga de contactos
                          </label>
                        </Form.Group>
                      </div>
                      <div className="col-md-6 border-top border-4 border-secondary">
                        <Form.Group className="pt-3">
                          <label className="col-sm-12 font-weight-bold">
                            2. Asignación de campos
                          </label>
                          <label className="col-sm-12">
                            Configure los campos de la lista cargada
                          </label>
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <Form.Group>
                          <label>
                            <span className="icon-bg">
                              <i
                                className="mdi mdi-alert-circle-outline"
                                style={{ color: "#E4A11B" }}
                              ></i>
                            </span>
                            <span>
                              Si una propiedad tiene un valor que depende de
                              otro módulo y no se puede vincular con ningún
                              registro, se creará un nuevo registro en dicho
                              módulo
                            </span>
                          </label>
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <Form.Group>
                          <div className="col-sm-12">
                            <div className="table-responsive">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th>Encabezado de archivo</th>
                                    <th>Tipo de propiedad</th>
                                    <th>Propiedad de contacto</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {columnas.map((columna) => (
                                    <tr>
                                      <td>{columna["nombre"]}</td>
                                      <td>
                                        {columna["tipo"] == 0
                                          ? "Indefinido"
                                          : ""}
                                        {columna["tipo"] == 1
                                          ? "Individual"
                                          : ""}
                                        {columna["tipo"] == 2 ? "Lista" : ""}
                                      </td>
                                      <td>
                                        <div class="btn-group btn-group-md">
                                          {!posiblesCampos.includes(
                                            String(columna["nombre"])
                                          ) ? (
                                            <select
                                              className="form-control"
                                              id={String(columna["id"])}
                                              onChange={handleDropdown}
                                            >
                                              <option
                                                value=""
                                                disabled
                                                selected
                                                hidden
                                              >
                                                Seleccione una propiedad
                                              </option>
                                              <option value={"Nombre completo"}>Nombre completo</option>
                                              <option value={"Estado"}>Estado</option>
                                              <option value={"Correo"}>Correo</option>
                                              <option value={"Direcciones"}>Direcciones</option>
                                              <option value={"Telefonos"}>Telefonos</option>
                                              <option value={"Redes"}>Redes</option>
                                              <option value={"Empresa"}>Empresa</option>
                                            </select>
                                          ) : (
                                            <select
                                              className="form-control"
                                              id={String(columna["id"])}
                                              disabled
                                            >
                                              {String(columna["nombre"]) ==
                                              "Nombre completo" ? (
                                                <option selected>
                                                  Nombre completo
                                                </option>
                                              ) : (
                                                <option>Nombre completo</option>
                                              )}
                                              {String(columna["nombre"]) ==
                                              "Estado" ? (
                                                <option selected>Estado</option>
                                              ) : (
                                                <option>Estado</option>
                                              )}
                                              {String(columna["nombre"]) ==
                                              "Correo" ? (
                                                <option selected>
                                                  Correo
                                                </option>
                                              ) : (
                                                <option>Correo</option>
                                              )}
                                              {String(columna["nombre"]) ==
                                              "Direcciones" ? (
                                                <option selected>
                                                  Direcciones
                                                </option>
                                              ) : (
                                                <option>Direcciones</option>
                                              )}
                                              {String(columna["nombre"]) ==
                                              "Telefonos" ? (
                                                <option selected>
                                                  Telefonos
                                                </option>
                                              ) : (
                                                <option>Telefonos</option>
                                              )}
                                              {String(columna["nombre"]) ==
                                              "Redes" ? (
                                                <option selected>Redes</option>
                                              ) : (
                                                <option>Redes</option>
                                              )}
                                              {String(columna["nombre"]) ==
                                              "Empresa" ? (
                                                <option selected>
                                                  Empresa
                                                </option>
                                              ) : (
                                                <option>Empresa</option>
                                              )}
                                            </select>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                )}
                {step == 1 && (
                  <div className="row">
                    <div className="col-md-6">
                      <Link className="nav-link" to="/contactos">
                        <button className="btn btn-outline-primary">
                          Salir
                        </button>
                      </Link>
                    </div>
                    <div className="col-md-6">
                      <button
                        className="btn btn-primary float-sm-right"
                        onClick={handleNext}
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
                {step == 2 && (
                  <div className="row">
                    <div className="col-md-6">
                      <button
                        className="btn btn-outline-primary"
                        onClick={handlePrevious}
                      >
                        Volver
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button
                        type="button"
                        className="btn btn-primary float-sm-right"
                        onClick={handleSave}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="card-title" style={{ color: "#000000" }}>
              Cargar contactos
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="card-title" style={{ color: "#000000" }}>
            ¿Desea cargar los contactos?
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-primary" onClick={handleClose}>
            Cancelar
          </button>
          
            <button className="btn btn-primary" onClick={handleSaveConfirm}>
              Guardar
            </button>
          
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CargarContactos;
