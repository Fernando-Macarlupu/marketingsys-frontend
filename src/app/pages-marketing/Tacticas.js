import React, { Component } from 'react'
import {Tabs, Tab } from 'react-bootstrap';
export class Tacticas extends Component {
    render() {
      return (
        <div>
            <div className="page-header">
            <h3 className="page-title"> Tácticas </h3>
            </div>
            <div className="row">
            <div className="col-md-12">
              <div className="justify-content-between align-items-center tab-transparent">
                <Tabs defaultActiveKey="Campanas" className="nav">
                    <Tab eventKey="Campanas" title="Campañas">
                    <p></p>
                    </Tab>
                    <Tab eventKey="Recursos" title="Recursos">
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
export default Tacticas