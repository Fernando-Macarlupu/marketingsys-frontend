import React, { Component } from "react";
// import Modeler from 'bpmn-js';
import Modeler from 'bpmn-js/lib/Modeler';
import diagramXML from "./newDiagram.bpmn";

class ModelerCreator extends Component {
  constructor() {
    super();
    
  }
  handleDiagram = async () => {
  const response = await fetch('/newDiagram.bpmn');
  const xmlString = await response.text();
  console.log(xmlString);
  }

  componentDidMount() {
    this.diagramModeler = new Modeler({
      container: "#js-canvas"
    });
    const hola = `<?xml version="1.0" encoding="UTF-8"?>
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
</bpmn2:definitions>
`
    console.log("diagramModeler: ", this.diagramModeler);
    console.log(hola);

    // diagramModeler.attachTo('js-canvas-container');
     this.diagramModeler.importXML(hola, err => {
       if (err){ console.log("error al hacer importxml");console.error(err);}
       else {
         console.log("New diagram is ready");
       }
     });
  }

  render() {
    return <div id="js-canvas" />;
  }
}

export default ModelerCreator;
