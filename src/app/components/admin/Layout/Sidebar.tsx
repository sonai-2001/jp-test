'use client'
import { useState } from "react";
import "./Sidebar.scss";
import { IoMenu } from "react-icons/io5";
import { IoLogoNpm } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { BiGridAlt } from "react-icons/bi";
import { IoIosLogOut } from "react-icons/io";
import Link from "next/link";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`layout ${isOpen ? "body-pd" : ""}`}>  
      <header className="header">
        <div className="header_toggle" onClick={toggleNavbar}>
          <IoMenu className={isOpen ? "bx-x" : ""} />
        </div>
        <div className="header_img">
          <img src="https://i.imgur.com/hczKIze.jpg" alt="Profile" />
        </div>
      </header>
      
      <nav className={`l-navbar ${isOpen ? "show" : ""}`}>
        <div>
          <Link href="#" className="nav_logo">
            <IoLogoNpm className="nav_logo-icon" />
            <span className="nav_logo-name">BBBootstrap</span>
          </Link>
          <div className="nav_list">
            
            <Link 
               href="/admin/dasboard" 
               className={`nav_link ${active === "Dashboard" ? "active" : ""}`} 
               onClick={() => setActive("Dashboard")}
             >
              <BiGridAlt />
               <span className="nav_name">Dashboard</span>
             </Link>
             <Link 
                href="/admin/users" 
                className={`nav_link ${active === "Users" ? "active" : ""}`} 
                onClick={() => setActive("Users")}
              >
               <FaUsers />
                <span className="nav_name">Users</span>
              </Link>
          </div>
        </div>
        <Link href="#" className="nav_link">
          <IoIosLogOut />
          <span className="nav_name">Sign Out</span>
        </Link>
      </nav>
      
      <div className="main-container">
        <h4>Main Components</h4>
      </div>
    </div>
  );
}
