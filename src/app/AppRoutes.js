import React, { Component, Suspense, lazy, useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Spinner from "../app/shared/Spinner";

const Dashboard = lazy(() => import("./dashboard/Dashboard"));

const IniciarSesion = lazy(() => import("./login-pages/Login"));
const RegistrarCuenta = lazy(() => import("./login-pages/Register"));

const PerfilUsuario = lazy(() => import("./login-pages/PerfilUsuario"));

const Contactos = lazy(() => import("./pages/Contactos"));
const Empresas = lazy(() => import("./pages/Empresas"));
const Listas = lazy(() => import("./pages/Listas"));

const CrearContacto = lazy(() => import("./pages/CrearContacto"));
const CrearEmpresa = lazy(() => import("./pages/CrearEmpresa"));

const CargarContactos = lazy(() => import("./pages/CargarContactos"));
const CargarEmpresas = lazy(() => import("./pages/CargarEmpresas"));

const DetalleContacto = lazy(() => import("./pages/DetalleContacto"));
const DetalleEmpresa = lazy(() => import("./pages/DetalleEmpresa"));

const Indicadores = lazy(() => import("./pages-marketing/Indicadores"));
const Planes = lazy(() => import("./pages-marketing/Planes"));
const Estrategias = lazy(() => import("./pages-marketing/Estrategias"));
const Tacticas = lazy(() => import("./pages-marketing/Tacticas"));
const Flujos = lazy(() => import("./pages-marketing/Flujos"));
const Oportunidades = lazy(() => import("./pages-marketing/Oportunidades"));
const Informes = lazy(() => import("./pages-marketing/Informes"));

const Eventos = lazy(() => import("./pages/Eventos"));

const Buttons = lazy(() => import("./basic-ui/Buttons"));
const Dropdowns = lazy(() => import("./basic-ui/Dropdowns"));
const Typography = lazy(() => import("./basic-ui/Typography"));

const BasicElements = lazy(() => import("./form-elements/BasicElements"));

const BasicTable = lazy(() => import("./tables/BasicTable"));

const Mdi = lazy(() => import("./icons/Mdi"));

const ChartJs = lazy(() => import("./charts/ChartJs"));

const Error404 = lazy(() => import("./error-pages/Error404"));
const Error500 = lazy(() => import("./error-pages/Error500"));

const Login = lazy(() => import("./user-pages/Login"));
const Register1 = lazy(() => import("./user-pages/Register"));

const AppRoutes = () => {
  const [logueado, setLogueado] = useState(
    () => localStorage.getItem("marketingSYSusuario") !== null
  );

  useEffect(() => {
    console.log("este es el valor despues de login")
    console.log(logueado);
    localStorage.setItem(
      "marketingSYSusuario_logueado",
      JSON.stringify(logueado)
    );
  }, [logueado]);

  const logIn = () => setLogueado(true);
  const logOut = () => setLogueado(false);

  return (
    <Suspense fallback={<Spinner />}>
      <Switch>
        <Route path="/iniciarSesion" component={IniciarSesion} />
        
        <Route path="/dashboard" component={Dashboard} />

        <Route path="/registrarCuenta" component={RegistrarCuenta} />

        <Route path="/perfilUsuario" component={PerfilUsuario} />

        <Route path="/contactos" component={Contactos} />
        <Route path="/crearContacto" component={CrearContacto} />
        <Route path="/detalleContacto" component={DetalleContacto} />
        <Route path="/cargarContactos" component={CargarContactos} />

        <Route path="/empresas" component={Empresas} />
        <Route path="/crearEmpresa" component={CrearEmpresa} />
        <Route path="/detalleEmpresa" component={DetalleEmpresa} />
        <Route path="/cargarEmpresas" component={CargarEmpresas} />
        <Route path="/listas" component={Listas} />

        <Route path="/indicadores" component={Indicadores} />
        <Route path="/planes" component={Planes} />
        <Route path="/estrategias" component={Estrategias} />
        <Route path="/tacticas" component={Tacticas} />
        <Route path="/flujos" component={Flujos} />
        <Route path="/oportunidades" component={Oportunidades} />
        <Route path="/informes" component={Informes} />

        <Route path="/eventos" component={Eventos} />

        <Route path="/basic-ui/buttons" component={Buttons} />
        <Route path="/basic-ui/dropdowns" component={Dropdowns} />
        <Route path="/basic-ui/typography" component={Typography} />

        <Route path="/tables/basic-table" component={BasicTable} />

        <Route path="/form-Elements/basic-elements" component={BasicElements} />

        <Route path="/icons/mdi" component={Mdi} />

        <Route path="/charts/chart-js" component={ChartJs} />

        <Route path="/user-pages/login-1" component={Login} />
        <Route path="/user-pages/register-1" component={Register1} />

        <Route path="/error-pages/error-404" component={Error404} />
        <Route path="/error-pages/error-500" component={Error500} />

        <Redirect to="/iniciarSesion" />
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;
