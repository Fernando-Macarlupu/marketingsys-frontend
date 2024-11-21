import React, { useRef, useState } from "react";

import packageJson from "../../../package.json";
import EmailEditor from 'react-email-editor';
import plantilla from "./plantilla.json";
import opciones from "./opcionesTraduccion.json";

const LandingPageEditor = (props) => {
  //const emailEditorRef = useRef(null);
  const [preview, setPreview] = useState(false);

  const saveDesign = (event) => {
    event.preventDefault();
    if (props.emailEditorRef.current != null) {
      const unlayer = props.emailEditorRef.current.editor;

      if (unlayer != null) {
        unlayer.saveDesign((design) => {
          console.log("saveDesign", design);
          alert("Design JSON has been logged in your developer console.");
        });
      }
    }
  };

  const exportHtml = (event) => {
    event.preventDefault();
    if (props.emailEditorRef.current != null) {
      const unlayer = props.emailEditorRef.current.editor;
      console.log("se esta exportando a HTML")
      if (unlayer != null) {
        unlayer.exportHtml((data) => {
          const { design, html } = data;
          console.log(html);
          alert("Output HTML has been logged in your developer console.");
        });
      }
    }
  };

  const togglePreview = () => {
    if (props.emailEditorRef.current != null) {
      const unlayer = props.emailEditorRef.current.editor;

      if (preview) {
        if (unlayer != null) {
          unlayer.hidePreview();
          setPreview(false);
        }
      } else {
        if (unlayer != null) {
          unlayer.showPreview("desktop");
          setPreview(true);
        }
      }
    }
  };

  const onDesignLoad = (data) => {
    console.log("onDesignLoad", data);
  };

  const onLoad = (unlayer) => {
    console.log("onLoad", unlayer);
    unlayer.addEventListener("design:loaded", onDesignLoad);
    if(props.contenidoCorreo == null){
      unlayer.loadDesign(plantilla);
    }
    else{
      unlayer.loadDesign(props.contenidoCorreo);
    }
  };

  const onReady = (unlayer) => {
    console.log("onReady", unlayer);
  };

  const handleUpdateDesign = (unlayer) =>{
    if (unlayer != null) {
      unlayer.saveDesign((design) => {
        console.log("se guardo el diseño");
        props.setContenidoCorreo(design);
      });
    }
  }

  return (
    <div className="landing-container">
       {/* <div className="landing-barra">
        <h1>React Email Editor v{packageJson.version} (Demo)</h1>

        <button onClick={togglePreview}>
          {preview ? "Hide" : "Show"} Preview
        </button>
        <button onClick={saveDesign}>Save Design</button>
        <button onClick={exportHtml}>Export HTML</button>
      </div> */}

      <React.StrictMode>
        <EmailEditor
          ref={props.emailEditorRef}
          onLoad={onLoad}
          onReady={onReady}
          options={{
            version: "latest",
            locale: 'en-US',
          translations: {
            'en-US': opciones
          },
            appearance: {
              theme: "modern_light",
            },
          }}
        />
      </React.StrictMode>
    </div>
  );
};

export default LandingPageEditor;
