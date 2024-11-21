import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { Trans } from 'react-i18next';

class Sidebar extends Component {
  state = {};

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({[menuState] : false});
    } else if(Object.keys(this.state).length === 0) {
      this.setState({[menuState] : true});
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({[i]: false});
      });
      this.setState({[menuState] : true});
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({[i]: false});
    });

    const dropdownPaths = [
      {path:'/apps', state: 'appsMenuOpen'},
      {path:'/basic-ui', state: 'basicUiMenuOpen'},
      {path:'/advanced-ui', state: 'advancedUiMenuOpen'},
      {path:'/form-elements', state: 'formElementsMenuOpen'},
      {path:'/tables', state: 'tablesMenuOpen'},
      {path:'/maps', state: 'mapsMenuOpen'},
      {path:'/icons', state: 'iconsMenuOpen'},
      {path:'/charts', state: 'chartsMenuOpen'},
      {path:'/user-pages', state: 'userPagesMenuOpen'},
      {path:'/error-pages', state: 'errorPagesMenuOpen'},
      {path:'/general-pages', state: 'generalPagesMenuOpen'},
      {path:'/ecommerce', state: 'ecommercePagesMenuOpen'},
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({[obj.state] : true})
      }
    }));
 
  } 
  render () {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <ul className="nav">
          <li className={ this.isPathActive('/dashboard') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/dashboard">
              <span className="icon-bg"><i className="mdi mdi-home-variant menu-icon"></i></span>
              <span className="menu-title"><Trans>Principal</Trans></span>
            </Link>
          </li>
          <li className="nav-item nav-category"><Trans>Relación con el cliente</Trans></li>
          <li className={ this.isPathActive('/contactos') || this.isPathActive('/crearContacto') || this.isPathActive('/cargarContactos') || this.isPathActive('/detalleContacto')? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/contactos">
              <span className="icon-bg"><i className="mdi mdi-account-multiple menu-icon"></i></span>
              <span className="menu-title"><Trans>Contactos</Trans></span>
            </Link>
          </li>
          <li className={ this.isPathActive('/empresas') || this.isPathActive('/crearEmpresa') || this.isPathActive('/cargarEmpresas') || this.isPathActive('/detalleEmpresa')? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/empresas">
              <span className="icon-bg"><i className="mdi mdi-office-building menu-icon"></i></span>
              <span className="menu-title"><Trans>Empresas</Trans></span>
            </Link>
          </li>
          <li className={ this.isPathActive('/listas') || this.isPathActive('/crearLista') || this.isPathActive('/detalleLista')? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/listas">
              <span className="icon-bg"><i className="mdi mdi-view-list menu-icon"></i></span>
              <span className="menu-title"><Trans>Listas</Trans></span>
            </Link>
          </li>
          <li className="nav-item nav-category"><Trans>Marketing</Trans></li>
          <li className={ this.isPathActive('/indicadores') || this.isPathActive('/crearIndicador') || this.isPathActive('/detalleIndicador')? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/indicadores">
              <span className="icon-bg"><i className="mdi mdi-speedometer menu-icon"></i></span>
              <span className="menu-title"><Trans>Indicadores</Trans></span>
            </Link>
          </li>
          <li className={ this.isPathActive('/planes') || this.isPathActive('/crearPlan') || this.isPathActive('/detallePlan')? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/planes">
              <span className="icon-bg"><i className="mdi mdi-file menu-icon"></i></span>
              <span className="menu-title"><Trans>Planes</Trans></span>
            </Link>
          </li>
          <li className={ this.isPathActive('/estrategias') || this.isPathActive('/crearEstrategia') || this.isPathActive('/detalleEstrategia')? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/estrategias">
              <span className="icon-bg"><i className="mdi mdi-lightbulb menu-icon"></i></span>
              <span className="menu-title"><Trans>Estrategias</Trans></span>
            </Link>
          </li>
          <li className={ this.isPathActive('/tacticas') || this.isPathActive('/crearCampana') || this.isPathActive('/detalleCampana') || this.isPathActive('/crearRecurso') || this.isPathActive('/detalleRecurso')? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/tacticas">
              <span className="icon-bg"><i className="mdi mdi-clipboard-text menu-icon"></i></span>
              <span className="menu-title"><Trans>Tácticas</Trans></span>
            </Link>
          </li>
          <li className={ this.isPathActive('/flujos') || this.isPathActive('/crearFlujo') || this.isPathActive('/detalleFlujo')? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/flujos">
              <span className="icon-bg"><i className="mdi mdi-source-merge menu-icon"></i></span>
              <span className="menu-title"><Trans>Flujos de trabajo</Trans></span>
            </Link>
          </li>
          <li className={ this.isPathActive('/oportunidades') || this.isPathActive('/crearOportunidad') || this.isPathActive('/detalleOportunidad')? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/oportunidades">
              <span className="icon-bg"><i className="mdi mdi-view-list menu-icon"></i></span>
              <span className="menu-title"><Trans>Oportunidades</Trans></span>
            </Link>
          </li>
          <li className={ this.isPathActive('/informes') || this.isPathActive('/crearReporte') || this.isPathActive('/detalleReporte') || this.isPathActive('/crearDashboard') || this.isPathActive('/detalleDashboard')? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/informes">
              <span className="icon-bg"><i className="mdi mdi-view-list menu-icon"></i></span>
              <span className="menu-title"><Trans>Informes y reportes</Trans></span>
            </Link>
          </li>
          <li className="nav-item nav-category">Sistema</li>
          <li className={ this.isPathActive('/eventos') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/eventos">
              <span className="icon-bg"><i className="mdi mdi-history menu-icon"></i></span>
              <span className="menu-title"><Trans>Registro de eventos</Trans></span>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add className 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {
      
      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);