"use client";
import React, { useEffect, useState, useRef } from "react";
import cx from "./Header.module.scss";
import Image from "next/image";
import Link from "next/link";
import { FaBars, FaShoppingCart, FaTimes, FaChevronRight } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/app/services/redux/features/userSlice";
import SignInModel from "../Signin/SignInModel";
import { getOneUser } from "@/app/services/User/User";
import { getCategories } from "@/app/services/Category/CategoryApi";
import { getBrands } from "@/app/services/Brands/BrandApi";
import { getProductsFilters } from "@/app/services/Product/ProductApi";
import { getIndustries } from "@/app/services/Industry/IndustryApi"; // NEW

type CategoryOption = {
  value: string; // id
  label: string;
  slug: string;
  hasProducts?: boolean; // derived
};

// Custom Hook: Detect Touch Device
const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const checkTouch = () => {
      const hasTouchScreen =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0;
      setIsTouch(hasTouchScreen);
    };
    checkTouch();
  }, []);
  return isTouch;
};

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modelType, setModelType] = useState("");
  const [showModel, setShowModel] = useState(false);

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [industries, setIndustries] = useState<CategoryOption[]>([]); // NEW

  // Mega Menu State with improved hover handling
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<"category" | "brand" | "industry">("category");

  // Refs and timers for smooth hover experience
  const megaMenuRef = useRef<HTMLLIElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect touch device
  const isTouchDevice = useIsTouchDevice();

  // Cart & Auth
  const carts = useSelector((state: any) => state.addToCart?.data);
  const { userData } = useSelector((state: any) => state.user);
  const isLogin =
    `${userData?._id}` === localStorage.getItem("jid") &&
    localStorage.getItem("jid") !== null;
  const pathname = usePathname();
  const router = useRouter();

  // Close modal
  const closeModel = () => setShowModel(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Improved hover handlers for smooth mega menu
  const handleMouseEnter = () => {
    if (isTouchDevice) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (!showMegaMenu) {
      showTimeoutRef.current = setTimeout(() => {
        setShowMegaMenu(true);
      }, 100);
    }
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setShowMegaMenu(false);
    }, 150);
  };

  const handleMegaMenuMouseEnter = () => {
    if (isTouchDevice) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleMegaMenuMouseLeave = () => {
    if (isTouchDevice) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setShowMegaMenu(false);
    }, 150);
  };

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    };
  }, []);

  // Fetch data
  const getAllCategories = async () => {
    try {
      const [data, filter] = await Promise.all([getCategories(), getProductsFilters()]);

      const filterCats = (filter?.categories || []) as Array<{ _id?: string; id?: string; slug?: string }>;
      const idSet = new Set(
        filterCats
          .map((c) => (c?._id || c?.id || "").toString().trim())
          .filter(Boolean)
      );
      const slugSet = new Set(
        filterCats
          .map((c) => (c?.slug || "").toString().trim().toLowerCase())
          .filter(Boolean)
      );

      setCategories(
        data.map((item: any) => {
          const id = (item?._id || item?.id || "").toString().trim();
          const slug = (item?.slug || "").toString().trim().toLowerCase();
          const hasProducts = idSet.has(id) || slugSet.has(slug);
          return {
            value: id,
            label: item?.category,
            slug: item?.slug,
            hasProducts,
          } as CategoryOption;
        })
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories((prev) => (prev.length ? prev : []));
    }
  };

  const getAllIndustries = async () => {
    try {
      const [data, filter] = await Promise.all([getIndustries(), getProductsFilters()]);

      const filterInds = (filter?.industries || []) as Array<{ _id?: string; id?: string; slug?: string }>;
      const idSet = new Set(
        filterInds
          .map((i) => (i?._id || i?.id || "").toString().trim())
          .filter(Boolean)
      );
      const slugSet = new Set(
        filterInds
          .map((i) => (i?.slug || "").toString().trim().toLowerCase())
          .filter(Boolean)
      );

      setIndustries(
        data.map((item: any) => {
          const id = (item?._id || item?.id || "").toString().trim();
          const slug = (item?.slug || "").toString().trim().toLowerCase();
          const hasProducts = idSet.has(id) || slugSet.has(slug);
          return {
            value: id,
            label: item?.industry, // field from Industry model
            slug: item?.slug,
            hasProducts,
          } as CategoryOption;
        })
      );
    } catch (error) {
      console.error("Error fetching industries:", error);
      setIndustries((prev) => (prev.length ? prev : []));
    }
  };

  const getAllBrands = async () => {
    try {
      const data = await getBrands();
      setBrands(
        data.map((item: any) => ({
          value: item?._id,
          label: item?.brandName,
          slug: item?.slug,
        }))
      );
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllIndustries(); // NEW
    getAllBrands();
  }, []);

  // Auth logic
  const logOut = () => {
    localStorage.removeItem("jtoken");
    localStorage.removeItem("jid");
    localStorage.removeItem("type");
    localStorage.removeItem("image");
    localStorage.removeItem("email");
    dispatch(setUser(null));
    router.push("/");
  };

  const localId = localStorage.getItem("jid");
  const handleGetUser = async () => {
    try {
      const response = await getOneUser(`${localStorage.getItem("jid")}`);
      if (response) dispatch(setUser(response));
      if (response?.image) localStorage.setItem("image", response.image);
    } catch (error) {
      logOut();
      console.error("Error in GET /api/productUser:", error);
    }
  };

  if (localId && localId.length > 0 && `${userData?._id}` !== `${localId}`) {
    handleGetUser();
  }

  if (
    (localStorage.getItem("jid") === null || localStorage.getItem("jid") === "") &&
    userData?._id != null
  ) {
    logOut();
  }

  const totalQuantities = carts.reduce(
    (sum: any, item: any) => sum + (item.quantity || 0),
    0
  );

  // Render submenu
  const renderSubMenu = (items: any[], type: string) => {
    const firstThree = items.slice(0, 3);
    const hasMore = items.length > 3;

    return (
      <div className={cx.megaSubMenuContainer}>
        <ul className={cx.megaSubMenu}>
          {firstThree.map((item) => {
            const disabled =
              (type === "categories" || type === "industries") && item?.hasProducts === false; // disable for both

            return (
              <li
                key={item.value}
                className={cx.megaItem}
                data-disabled={disabled ? "true" : undefined}
                aria-disabled={disabled ? true : undefined}
                title={disabled ? "No products" : undefined}
              >
                {disabled ? (
                  <span
                    className={cx.megaItemLink}
                    role="link"
                    aria-disabled="true"
                    style={{
                      cursor: "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span>{item.label}</span>
                    <FaChevronRight className={cx.itemIcon} />
                  </span>
                ) : (
                  <Link
                    href={`/${type}/${item.slug}`}
                    onClick={() => {
                      setShowMegaMenu(false);
                      setIsMenuOpen(false);
                    }}
                    className={cx.megaItemLink}
                  >
                    <span>{item.label}</span>
                    <FaChevronRight className={cx.itemIcon} />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        {hasMore && (
          <div className={cx.seeMoreContainer}>
            <Link
              href={`/${type}`}
              onClick={() => {
                setShowMegaMenu(false);
                setIsMenuOpen(false);
              }}
              className={cx.seeMoreLink}
            >
              View All {type === "categories" ? "Categories" : type === "brands" ? "Brands" : "Industries"} ({items.length})
            </Link>
          </div>
        )}
      </div>
    );
  };

  // Click outside to close mega menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (megaMenuRef.current && !megaMenuRef.current.contains(target)) {
        setShowMegaMenu(false);
      }
    };

    if (showMegaMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMegaMenu]);

  return (
    <>
      <div
        className={`${cx.header_main} ${pathname.includes("coming-soon") ? cx.coming_soon_header : ""}`}
      >
        <div className="container">
          <div className="row">
            <div className={cx.header_menu}>
              <div className={cx.header_logo}>
                <Link href="/">
                  <Image
                    src="/assets/img/Jaypee_Associates_WhiteText.svg"
                    alt="logo"
                    width={1000}
                    height={1000}
                    unoptimized
                  />
                </Link>
              </div>

              <button className={cx.mobile_toggle} onClick={toggleMenu}>
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>

              <nav className={`${cx.nav_menu} ${isMenuOpen ? cx.open : ""}`}>
                <ul>
                  {/* Products with Smooth Mega Menu */}
                  <li
                    className={`${cx.megaMenuWrapper} ${showMegaMenu ? cx.isOpen : ""}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    ref={megaMenuRef}
                  >
                    <Link
                      href="/request-product-quotes"
                      className={`${cx.productsLink} ${
                        pathname.includes("/request-product-quotes") || pathname.includes("/products")
                          ? cx.active
                          : ""
                      }`}
                      aria-expanded={showMegaMenu}
                      onClick={(e) => {
                        if (isTouchDevice) {
                          // Toggle mega menu on mobile instead of navigating
                          e.preventDefault();
                          setActiveTab("category");
                          setShowMegaMenu((prev) => !prev);
                          return;
                        }
                        // Desktop: close menus and allow navigation
                        setIsMenuOpen(false);
                        setShowMegaMenu(false);
                      }}
                    >
                      Products
                    </Link>

                    <div
                      className={`${cx.megaMenu} ${showMegaMenu ? cx.open : cx.closed}`}
                      onMouseEnter={handleMegaMenuMouseEnter}
                      onMouseLeave={handleMegaMenuMouseLeave}
                    >
                      {/* Close Button on Mobile */}
                      {isTouchDevice && (
                        <button
                          className={cx.closeMegaBtn}
                          onClick={() => setShowMegaMenu(false)}
                          aria-label="Close mega menu"
                        >
                          ×
                        </button>
                      )}

                      {/* Tabs */}
                      <div className={cx.megaTabs}>
                        <h4 className={cx.megaTitle}>Browse Products</h4>
                        <button
                          className={`${cx.megaTab} ${activeTab === "category" ? cx.activeTab : ""}`}
                          onClick={() => setActiveTab("category")}
                        >
                          <span>By Categories</span>
                          <FaChevronRight className={cx.tabIcon} />
                        </button>
                        <button
                          className={`${cx.megaTab} ${activeTab === "brand" ? cx.activeTab : ""}`}
                          onClick={() => setActiveTab("brand")}
                        >
                          <span>By Brands</span>
                          <FaChevronRight className={cx.tabIcon} />
                        </button>
                        <button
                          className={`${cx.megaTab} ${activeTab === "industry" ? cx.activeTab : ""}`}
                          onClick={() => setActiveTab("industry")}
                        >
                          <span>By Industries</span>
                          <FaChevronRight className={cx.tabIcon} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className={cx.megaContent}>
                        <div className={cx.megaContentHeader}>
                          <h5>
                            {activeTab === "category" && "Product Categories"}
                            {activeTab === "brand" && "Popular Brands"}
                            {activeTab === "industry" && "Industries We Serve"}
                          </h5>
                        </div>
                        {activeTab === "category" && renderSubMenu(categories, "categories")}
                        {activeTab === "brand" && renderSubMenu(brands, "brands")}
                        {activeTab === "industry" && renderSubMenu(industries, "industries")}
                      </div>
                    </div>
                  </li>

                  {/* Other Nav Items */}
                  <li>
                    <Link
                      href="/catalogues"
                      className={pathname.includes("/catalogues") ? cx.active : ""}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Catalogues
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}`}
                      className={pathname.includes("/articles") ? cx.active : ""}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Blogs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contactus"
                      className={pathname.includes("/contactus") ? cx.active : ""}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about-us"
                      className={pathname.includes("/about-us") ? cx.active : ""}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About Us
                    </Link>
                  </li>

                  {/* Cart */}
                  <li>
                    <Link
                      href="/my-cart"
                      className={pathname.includes("/my-cart") ? cx.active : ""}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className={cx.cartIconWrapper}>
                        <FaShoppingCart size={20} />
                        {carts?.length > 0 && (
                          <span className={cx.cartBadge}>{totalQuantities}</span>
                        )}
                      </div>
                    </Link>
                  </li>

                  {/* Profile Dropdown */}
                  <li className="headerProfileDropDown">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="link"
                        id="dropdown-basic"
                        className={`${cx.dropdown_toggle} ${
                          pathname.includes("/signin") || pathname.includes("/signup")
                            ? cx.active
                            : ""
                        }`}
                      >
                        <Image
                          src={userData?.image ? userData?.image : "/assets/img/userProfile.png"}
                          alt="User Profile"
                          width={35}
                          height={35}
                          unoptimized
                          className={cx.headerProfile_img}
                        />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {isLogin && (
                          <Dropdown.Item onClick={() => router.push("/user-profile")}>
                            Profile
                          </Dropdown.Item>
                        )}
                        {isLogin && (
                          <Dropdown.Item onClick={() => router.push("/my-enquiry")}>
                            My Enquiries
                          </Dropdown.Item>
                        )}
                        {!isLogin && (
                          <Dropdown.Item
                            onClick={() => {
                              setModelType("SignIn");
                              setShowModel(true);
                            }}
                          >
                            Sign-In
                          </Dropdown.Item>
                        )}
                        {!isLogin && (
                          <Dropdown.Item
                            onClick={() => {
                              setModelType("SignUp");
                              setShowModel(true);
                            }}
                          >
                            Sign-Up
                          </Dropdown.Item>
                        )}
                        {isLogin && <Dropdown.Item onClick={logOut}>Sign Out</Dropdown.Item>}
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Sign-In Modal */}
        <SignInModel showModel={showModel} closeModel={closeModel} data={modelType} />
      </div>
    </>
  );
};

export default Header;