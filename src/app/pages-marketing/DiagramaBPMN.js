import { useEffect, useRef, useState } from 'react';
import Modeler from 'bpmn-js/lib/Modeler';
// eslint-disable-next-line import/no-webpack-loader-syntax
import diagramXML from '!!raw-loader!./diagram.bpmn';
import customModdleExtension from './moddle/custom.json';

import PropertiesView from './properties-panel/PropertiesView'

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "./diagramaStyles.css"

const DiagramaBPMN = (props) => {
//function DiagramaBPMN() {  
  // const container = useRef(null);
  // const [ modeler, setModeler ] = useState(null)

  let modelerInstance = null

  useEffect(() => {
    if (modelerInstance) return

    modelerInstance = new Modeler({
      container: props.container.current,
      moddleExtensions: {
        custom: customModdleExtension
      },
      keyboard: {
        bindTo: document.body
      }
    });
    modelerInstance
      .importXML(props.diagramXML)
      .then(({ warnings }) => {
        if (warnings.length) {
          console.warn(warnings);
        }
  
        modelerInstance
          .get("canvas")
          .zoom("fit-viewport");
      });  

    props.setModeler(modelerInstance)

    return () => {
      props.modeler?.destroy();
    }
  }, [])

  const handleExport = (e) => {
    e.preventDefault();
    props.modeler.saveXML({ format: true }).then(({ xml, error }) => {
      if (error) {
        console.error(error);
        return;
      }

      console.log('UPDATE XML:', xml)
    });
  }

  return (
    <div className="modeler-parent">
      <div id="modeler-container" ref={props.container} className='border'></div>
      {/* <div id="properties-container">
        <button onClick={handleExport}>Export BPMN</button>
        {props.modeler && 
          <PropertiesView modeler={ props.modeler } />
        }
      </div> */}
    </div>
  );
}

export default DiagramaBPMN;