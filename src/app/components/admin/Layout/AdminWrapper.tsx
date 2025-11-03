// src\app\admin\AdminWrapper.tsx
// 'use client'
// import React from 'react';
// import "./Sidebar.scss";
// function AdminWrapper({ children }: { children: React.ReactNode }) {

//   return (
//     <>
//       {children}
//     </>
//   );
// }

// export default AdminWrapper;

// src\app\admin\AdminWrapper.tsx
"use client";
import React, { useState, useEffect } from "react";
import "./Sidebar.scss";
import { IoMenu } from "react-icons/io5";
// import { IoLogoNpm } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { BiGridAlt } from "react-icons/bi";
import { IoIosLogOut } from "react-icons/io";
import Link from "next/link";
import { setUser } from "@/app/services/redux/features/userSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  MdOutlinePayment,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaListCheck } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
// import { CgProfile } from "react-icons/cg";
import { PiInvoiceBold } from "react-icons/pi";
import { MdPermMedia } from "react-icons/md";
import { TbAdjustmentsQuestion } from "react-icons/tb";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { GrCatalog } from "react-icons/gr";

function AdminWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageRoute = pathname.split("/");
  const isLoginPage = pageRoute[pageRoute.length - 1] !== "admin";
  const { userData } = useSelector((state: any) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [active, setActive] = useState(pageRoute[pageRoute.length - 1]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isLoginPage) {
      !localStorage?.getItem("jid") && router.push("/admin");
    }
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logOut = () => {
    localStorage.removeItem("jtoken");
    localStorage.removeItem("jid");
    localStorage.removeItem("type");
    localStorage.removeItem("image");
    dispatch(setUser(null));
    router.push("/admin");
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoginPage ? (
        <div className={`layout ${isOpen ? "body-pd" : ""}`}>
          <header className="header">
            <div className="header_toggle" onClick={toggleNavbar}>
              <IoMenu className={isOpen ? "bx-x" : ""} />
            </div>
            <React.Fragment>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    {userData?.image ? (
                      <Avatar sx={{ width: 32, height: 32 }}>
                        <img
                          style={{ width: 32, height: 32 }}
                          src={userData?.image}
                          alt="Profile"
                        />
                      </Avatar>
                    ) : (
                      <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  onClick={() => {
                    router.push("/admin/admin-profile");
                    setActive("admin-profile");
                  }}
                >
                  {userData?.image ? (
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <img
                        style={{ width: 32, height: 32 }}
                        src={userData?.image}
                        alt="Profile"
                      />
                    </Avatar>
                  ) : (
                    <Avatar />
                  )}
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={logOut}>
                  <ListItemIcon>
                    <IoIosLogOut style={{ fontSize: "26px" }} />
                  </ListItemIcon>
                  Sign Out
                </MenuItem>
              </Menu>
            </React.Fragment>
          </header>
          <nav className={`l-navbar ${isOpen ? "show_sidebar" : ""}`}>
            <div>
              {window.innerWidth > 768 && isOpen ? (
                <Link href="/admin/dashboard" className="nav_logo">
                  <Image
                    src="/assets/img/Jaypee_Associates_WhiteText.svg"
                    alt="logo"
                    width={165}
                    height={55}
                    unoptimized
                  />
                </Link>
              ) : (
                <div
                  className="header_toggle text-center ps-2 pb-3"
                  onClick={toggleNavbar}
                >
                  <AiOutlineClose className={"text-white ms-1"} />
                </div>
              )}

              <div className="nav_list">
                <Link
                  href="/admin/dashboard"
                  className={`nav_link ${
                    active === "dashboard" ? "active" : ""
                  }`}
                  onClick={() => setActive("dashboard")}
                >
                  <BiGridAlt />
                  <span className="nav_name">Dashboard</span>
                </Link>
                <Link
                  href="/admin/brands"
                  className={`nav_link ${active === "brands" ? "active" : ""}`}
                  onClick={() => setActive("brands")}
                >
                  <BiGridAlt />
                  <span className="nav_name">Brands</span>
                </Link>
                <Link
                  href="/admin/categories"
                  className={`nav_link ${
                    active === "categories" ? "active" : ""
                  }`}
                  onClick={() => setActive("categories")}
                >
                  <BiSolidCategoryAlt />
                  <span className="nav_name">Categories</span>
                </Link>
                <Link
                  href="/admin/industries"
                  className={`nav_link ${
                    active === "industries" ? "active" : ""
                  }`}
                  onClick={() => setActive("industries")}
                >
                  <BiSolidCategoryAlt />
                  <span className="nav_name">Industries</span>
                </Link>
                <Link
                  href="/admin/listed-products"
                  className={`nav_link ${
                    active === "listed-products" ? "active" : ""
                  }`}
                  onClick={() => setActive("listed-products")}
                >
                  <MdOutlineProductionQuantityLimits />
                  <span className="nav_name">Listed Products</span>
                </Link>
                <Link
                  href="/admin/all-enquiry"
                  className={`nav_link ${
                    active === "all-enquiry" ? "active" : ""
                  }`}
                  onClick={() => setActive("all-enquiry")}
                >
                  <FaListCheck />
                  <span className="nav_name">All Enquiry</span>
                </Link>

                <Link
                  href="/admin/payment-method"
                  className={`nav_link ${
                    active === "payment-method" ? "active" : ""
                  }`}
                  onClick={() => setActive("payment-method")}
                >
                  <MdOutlinePayment />
                  <span className="nav_name">payment Details</span>
                </Link>

                <Link
                  href="/admin/invoice-details"
                  className={`nav_link ${
                    active === "invoice-details" ? "active" : ""
                  }`}
                  onClick={() => setActive("invoice-details")}
                >
                  <PiInvoiceBold />
                  <span className="nav_name">Invoice Details</span>
                </Link>
                <Link
                  href="/admin/users"
                  className={`nav_link ${active === "users" ? "active" : ""}`}
                  onClick={() => setActive("users")}
                >
                  <FaUsers />
                  <span className="nav_name">Users</span>
                </Link>

                <Link
                  href="/admin/connect-us"
                  className={`nav_link ${
                    active === "connect-us" ? "active" : ""
                  }`}
                  onClick={() => setActive("connect-us")}
                >
                  <FaUsers />
                  <span className="nav_name">Connect Us</span>
                </Link>

                <Link
                  href="/admin/media"
                  className={`nav_link ${active === "media" ? "active" : ""}`}
                  onClick={() => setActive("media")}
                >
                  <MdPermMedia />
                  <span className="nav_name">Media</span>
                </Link>

                <Link
                  href="/admin/catalogue"
                  className={`nav_link ${
                    active === "catalogue" ? "active" : ""
                  }`}
                  onClick={() => setActive("catalogue")}
                >
                  <GrCatalog />
                  <span className="nav_name">Catalogue</span>
                </Link>
                <Link
                  href="/admin/faq"
                  className={`nav_link ${active === "faq" ? "active" : ""}`}
                  onClick={() => setActive("faq")}
                >
                  <TbAdjustmentsQuestion />
                  <span className="nav_name">FAQ</span>
                </Link>
                <Link
                  href="/admin/seo"
                  className={`nav_link ${active === "seo" ? "active" : ""}`}
                  onClick={() => setActive("seo")}
                >
                  <TbAdjustmentsQuestion />
                  <span className="nav_name">SEO</span>
                </Link>
                <Link
                  href="/admin/testimonials"
                  className={`nav_link ${
                    active === "testimonials" ? "active" : ""
                  }`}
                  onClick={() => setActive("testimonials")}
                >
                  <TbAdjustmentsQuestion />
                  <span className="nav_name">Testimonials</span>
                </Link>
                <Link
                  href="/admin/team"
                  className={`nav_link ${active === "team" ? "active" : ""}`}
                  onClick={() => setActive("team")}
                >
                  <TbAdjustmentsQuestion />
                  <span className="nav_name">Teams</span>
                </Link>
                <Link
                  href="/admin/about"
                  className={`nav_link ${active === "about" ? "active" : ""}`}
                  onClick={() => setActive("about")}
                >
                  <TbAdjustmentsQuestion />
                  <span className="nav_name">About</span>
                </Link>
                <Link
                  href="/admin/Home"
                  className={`nav_link ${active === "Home" ? "active" : ""}`}
                  onClick={() => setActive("Home")}
                >
                  <TbAdjustmentsQuestion />
                  <span className="nav_name">Home</span>
                </Link>

                <Link
                  href="/admin/contact"
                  className={`nav_link ${active === "contact" ? "active" : ""}`}
                  onClick={() => setActive("contact")}
                >
                  <TbAdjustmentsQuestion />
                  <span className="nav_name">Contact</span>
                </Link>
              </div>
            </div>
          </nav>
          <div className={`${!active ? "main-container" : ""} pt-4`}>
            {children}
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}

export default AdminWrapper;
