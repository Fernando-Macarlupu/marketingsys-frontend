import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import api from "../api";
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState({});
  
  return (
    <div>
      <div className="row">
        <div className="page-header col-md-8">
          <h3 className="page-title"> Dashboard </h3>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
