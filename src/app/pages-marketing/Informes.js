import React, { Component } from 'react'
import {Tabs, Tab } from 'react-bootstrap';
import Dashboards from "./Dashboards";
import Reportes from "./Reportes";
const Informes = () => {
  return (
      <div>
          <div className="page-header">
          <h3 className="page-title"> Informes y reportes </h3>
          </div>
          <div className="row">
          <div className="col-md-12">
            <div className="justify-content-between align-items-center tab-transparent">
              <Tabs defaultActiveKey="Dashboards" className="nav">
                  <Tab eventKey="Dashboards" title="Dashboards">
                  <Dashboards></Dashboards>
                  </Tab>
                  <Tab eventKey="Reportes" title="Reportes">
                  <Reportes></Reportes>
                  </Tab>
                  </Tabs>
            </div>
          </div>
        </div>
      </div>
    )
  
}
export default Informes