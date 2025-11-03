"use client";
import React, { useState } from "react";
import cx from "./Header.module.scss";
import Image from "next/image";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setUser } from "@/app/services/redux/features/userSlice";

const AdminHeader: React.FC = () => {
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const pathname = usePathname();
    const router = useRouter();
    const isLogin = localStorage.getItem("jid")
    // Check if current page is coming-soon

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const logOut = () => {
        localStorage.removeItem('jtoken');
        localStorage.removeItem('jid');
        localStorage.removeItem('type');
        localStorage.removeItem('image');
        dispatch(setUser(null));
        router.push('/admin');
    }

    return (
        <div className={`${cx.header_main}`}>
            <div className="container">
                <div className="row">
                    <div className={cx.header_menu}>
                        <div className={cx.header_logo}>
                            <Link href={`${localStorage.getItem('jtoken') ? "/admin/dashboard" : "/admin"}`}>
                                <Image
                                    src="/assets/img/jaypee_associates_header.png"
                                    alt="logo"
                                    width={60}
                                    height={60}
                                    unoptimized
                                />
                            </Link>
                        </div>
                        <button className={cx.mobile_toggle} onClick={toggleMenu}>
                            {isMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                        <nav className={`${cx.nav_menu} ${isMenuOpen ? cx.open : ""}`}>
                            <ul>
                                {isLogin &&
                                    <>
                                        <li>
                                            <Link
                                                href="/admin/users"
                                                className={pathname.includes("/users") ? cx.active : ""}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Users
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/admin/listed-products"
                                                className={pathname.includes("/listed-products") ? cx.active : ""}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Products
                                            </Link>
                                        </li>
                                    </>
                                }
                                <li>
                                    <Link
                                        href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}`}
                                        className={pathname.includes("/articles") ? cx.active : ""}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Blogs
                                    </Link>
                                </li>
                                {isLogin && <li>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="link" id="dropdown-basic" className={`${pathname.includes("/signin") || pathname.includes("/signup") ? cx.active : ""} ${cx.dropdown_toggle}`}>
                                            Account
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => router.push('/admin/dashboard')} >Dashboard</Dropdown.Item>
                                            <Dropdown.Item onClick={() => router.push('/admin/all-enquiry')} >Enquiry</Dropdown.Item>
                                            <Dropdown.Item onClick={() => router.push('/admin/brands')} >Brands</Dropdown.Item>
                                            <Dropdown.Item onClick={() => router.push('/admin/categories')} >Categories</Dropdown.Item>
                                            <Dropdown.Item onClick={logOut}>Sign Out</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </li>}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHeader;