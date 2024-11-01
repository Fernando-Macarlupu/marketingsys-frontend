import React, { Component } from 'react'
import {Tabs, Tab } from 'react-bootstrap';
export class Informes extends Component {
  render() {
    return (
      <div>
          <div className="page-header">
          <h3 className="page-title"> Informes y reportes </h3>
          </div>
          <div className="row">
          <div className="col-md-12">
            <div className="justify-content-between align-items-center tab-transparent">
              <Tabs defaultActiveKey="Informes" className="nav">
                  <Tab eventKey="Informes" title="Informes">
                  <p></p>
                  </Tab>
                  <Tab eventKey="Reportes" title="Reportes">
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
export default Informes