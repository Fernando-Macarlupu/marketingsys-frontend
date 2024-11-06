import React, { useEffect, useState } from "react";
import { Tabs, Tab,Form, Modal, Alert } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import "react-datepicker/dist/react-datepicker.css";
import Campanas from "./Campanas";
import Recursos from "./Recursos";

const Tacticas = () => {

  
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
                    <Campanas></Campanas>
                    </Tab>
                    <Tab eventKey="Recursos" title="Recursos">
                    <Recursos></Recursos>
                    </Tab>
                    </Tabs>
              </div>
            </div>
          </div>
        </div>
      )
}
export default Tacticas