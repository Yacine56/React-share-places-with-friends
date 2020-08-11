import React, { useState } from "react";
import MainHeader from "./MainHeader";
import { Link } from "react-router-dom";
import './MainNavigation.css'
import NavLinks from "./NavLinks";
import SideDrawer from './SideDrawer'
import Backdrop from "../UIelements/Backdrop";

const MainNavigation = (props) => {
const [drawerOpen,setDrawerOpen]=useState(false)

const draweropen=()=>{
    setDrawerOpen(true)
}
const drawerclose=()=>{
    setDrawerOpen(false)
}

  return (
      <React.Fragment>
   {drawerOpen && <Backdrop onClick={drawerclose} />}
    <SideDrawer show={drawerOpen} onClick={drawerclose}>
        <NavLinks />
    </SideDrawer>
    
    <MainHeader>
      <button className="main-navigation__menu-btn" onClick={draweropen}>
         <span />
        <span />
        <span />
      </button>
      <h1 className="main-navigation__title">
        <Link to="/">Travoliro</Link>
      </h1>
      <nav className='main-navigation__header-nav'>
     <NavLinks />
     </nav>
    </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
