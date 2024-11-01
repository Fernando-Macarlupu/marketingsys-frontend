import React, { Component } from 'react'
import {Tabs, Tab } from 'react-bootstrap';
export class Eventos extends Component {
    render() {
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
                    <p></p>
                    </Tab>
                    <Tab eventKey="Errores" title="Errores">
                    <p></p>
                    </Tab>
                    </Tabs>
              </div>
            </div>
          </div>
        </div>
      )
    }
}
export default Eventos