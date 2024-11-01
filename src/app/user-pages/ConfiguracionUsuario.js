import React, { Component } from 'react'
import {Tabs, Tab } from 'react-bootstrap';
export class ConfiguracionUsuario extends Component {
    render() {
      return (
        <div>
            <div className="page-header">
            <h3 className="page-title"> Perfil de usuario </h3>
            </div>
            <div className="row">
            <div className="col-md-12">
              <div className="justify-content-between align-items-center tab-transparent">
                <Tabs defaultActiveKey="Perfil" className="nav">
                    <Tab eventKey="Perfil" title="Editar perfil">
                    <p>3</p>
                    </Tab>
                    <Tab eventKey="Cuentas" title="Cuentas asociadas">
                    <p>4</p>
                    </Tab>
                    <Tab eventKey="Politicas" title="Políticas de seguridad">
                    <p>4</p>
                    </Tab>
                    <Tab eventKey="Notificaciones" title="Notificaciones">
                    <p>4</p>
                    </Tab>
                    <Tab eventKey="Galeria" title="Galería">
                    <p>4</p>
                    </Tab>
                    <Tab eventKey="Dominios" title="Dominios">
                    <p>4</p>
                    </Tab>
                    </Tabs>
              </div>
            </div>
          </div>
        </div>
      )
    }
}
export default ConfiguracionUsuario