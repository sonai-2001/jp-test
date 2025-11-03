"use client";
import React, { useEffect, useState } from "react";
import { getProductsFilter } from "@/app/services/Product/ProductApi";
import { Product } from "@/types/product";
import ProductItem from "@/app/components/ProductItem/ProductItem";
import loader_img from "../../../../../../public/assets/img/loader_img.png";
import Image from "next/image";
import SeoContentSection from "@/app/components/ContentDescription";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import PermanentFilterSidebar from "@/app/components/ProductItem/FilterModel";

interface Props {
  slug: string;
}

const IndustryProductsPage: React.FC<Props> = ({ slug }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  console.log("🚀 ~ IndustryProductsPage ~ products:", products);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sortType, setSortType] = useState("");
  const [sort, setSort] = useState(false);
  const [newest, setNewest] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [industries, setIndustries] = useState<any[]>([]);
  const [seo, setSeo] = useState<{ contentDescription?: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Optional: fetch all industries (used to check if search matches a different industry)
  useEffect(() => {
    fetch("/api/industry")
      .then((res) => res.json())
      .then((data) => {
        // API may return array directly or an object; normalize
        const list = Array.isArray(data) ? data : data?.industries || [];
        setIndustries(list);
      })
      .catch(() => setIndustries([]));
  }, []);

  // Load SEO content keyed by the industry slug (aligns with your brand page pattern)
  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/seo/${slug}`
        );
        const seoData = await res.json();
        setSeo(seoData);
      } catch {
        setSeo(null);
      }
    };
    fetchSeo();
  }, [slug]);

  // If user types a search that exactly matches a different industry name, show empty results (mirrors brand page behavior)
  const isSearchAnotherIndustry = industries.some(
    (ind) =>
      ind.slug !== slug &&
      (ind.industry || "").toLowerCase() === search.trim().toLowerCase()
  );

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    let sortUrl = "";
    if (sortType == "name_asc") sortUrl = `&sort=name_asc`;
    if (sortType == "name_desc") sortUrl = `&sort=name_desc`;
    if (sortType == "Newest Arrivals") sortUrl = "&newest=true";
    if (sortType == "Bestseller") sortUrl = "&bestseller=true";

    try {
      const data = await getProductsFilter(
        `?search=${search || ""}&industrySlug=${slug}&category=${category}&brand=${brand}${
          sortUrl ? sortUrl : ""
        }&page=${page}&limit=${limit}`
      );
      setProducts(data?.products || []);
      setPage(data?.page || 1);
      setLimit(data?.limit || 12);
      setTotalPages(data?.totalPages || 0);
      setTotalProducts(data?.totalProducts || 0);
    } catch (err: any) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isSearchAnotherIndustry) {
      fetchProducts();
    } else {
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, search, category, brand, sortType, page, limit, industries]);

  // Pagination handlers
  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages =
      typeof window !== "undefined" && window.innerWidth < 576 ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`btn px-2 px-sm-3 py-2 me-1 mb-1 ${
              page === i ? "btn-primary" : "btn-outline-secondary"
            }`}
            style={{
              borderRadius: "8px",
              minWidth: "36px",
              fontSize: "14px",
              fontWeight: page === i ? "600" : "400",
            }}
          >
            {i}
          </button>
        );
      }
    } else {
      let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`btn px-2 px-sm-3 py-2 me-1 mb-1 ${
              page === i ? "btn-primary" : "btn-outline-secondary"
            }`}
            style={{
              borderRadius: "8px",
              minWidth: "36px",
              fontSize: "14px",
              fontWeight: page === i ? "600" : "400",
            }}
          >
            {i}
          </button>
        );
      }
    }

    return buttons;
  };

  return (
    <>
      <style jsx>{`
        .mobile-sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1040;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-sidebar-overlay.show {
          opacity: 1;
          visibility: visible;
        }

        .mobile-sidebar {
          position: fixed;
          top: 0;
          left: -100%;
          width: 85%;
          max-width: 320px;
          height: 100vh;
          background: white;
          z-index: 1050;
          transition: left 0.3s ease;
          overflow-y: auto;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }

        .mobile-sidebar.show {
          left: 0;
        }

        .filter-toggle-btn {
          background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .filter-toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .desktop-sidebar {
          position: sticky;
          top: 20px;
          padding-right: 15px;
          margin-bottom: 30px;
          padding-bottom: 50px;
        }

        .desktop-sidebar > div {
          overflow: visible !important;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          justify-items: center;
        }

        @media (max-width: 767px) {
          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }
        }

        .hero-banner-modern {
          background: linear-gradient(120deg, #e0e7ff 0%, #f0fdfa 100%);
          border-radius: 18px;
          margin-bottom: 32px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
          position: relative;
          overflow: hidden;
        }

        .hero-banner-modern .hero-content {
          padding: 32px 0;
        }

        .hero-banner-modern p,
        .hero-banner-modern .lead {
          color: #334155;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .hero-banner-modern .info-card {
          background: rgba(255, 255, 255, 0.85);
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: box-shadow 0.2s;
        }

        .hero-banner-modern .info-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px) scale(1.02);
        }

        .hero-banner-modern .info-card i {
          font-size: 2rem;
          opacity: 0.85;
        }

        @media (max-width: 991px) {
          .hero-banner-modern .hero-content {
            padding: 20px 0;
          }
          .hero-banner-modern .info-card {
            padding: 18px;
          }
        }

        @media (max-width: 575px) {
          .hero-banner-modern {
            border-radius: 10px;
            margin-bottom: 18px;
          }
          .hero-banner-modern .hero-content {
            padding: 10px 0;
          }
          .hero-banner-modern .info-card {
            padding: 12px;
          }
        }

        .product-card-wrapper {
          height: 100%;
        }

        .product-card-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.3s ease;
        }

        .product-card-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .main-content-area {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .desktop-sidebar::-webkit-scrollbar {
          display: none;
        }

        .desktop-sidebar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .results-header {
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }
      `}</style>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`mobile-sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${sidebarOpen ? "show" : ""}`}>
        <div
          className="p-3 border-bottom sticky-top bg-white"
          style={{ zIndex: 1 }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">Filters</h6>
            <button
              className="btn-close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close"
            />
          </div>
        </div>
        <div className="p-3">
          <PermanentFilterSidebar
            setCategory={setCategory}
            setBrand={setBrand}
            setIndustry={() => {}} // Empty function since we don't need industry filter
            search={search}
            setSearch={setSearch}
            sortType={sortType}
            setSortType={setSortType}
            setSort={setSort}
            setNewest={setNewest}
            setBestseller={setBestseller}
            sort={sort}
            newest={newest}
            bestseller={bestseller}
            hideIndustry={true} // Hide industry filter
          />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="hero-banner-modern py-5">
        <div className="container-fluid">
          <div className="hero-content">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="info-card p-4 h-100 text-center">
                      <div className="mb-3">
                        <i
                          className="fas fa-search text-primary"
                          style={{ fontSize: "32px" }}
                        />
                      </div>
                      <h6 className="fw-bold mb-2">Easy Selection</h6>
                      <p className="small mb-0">
                        Choose products and click "View Product" to start your
                        enquiry
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="info-card p-4 h-100 text-center">
                      <div className="mb-3">
                        <i
                          className="fas fa-user text-success"
                          style={{ fontSize: "32px" }}
                        />
                      </div>
                      <h6 className="fw-bold mb-2">Update Profile</h6>
                      <p className="small mb-0">
                        Ensure your profile is updated before placing enquiries
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="info-card p-4 h-100 text-center">
                      <div className="mb-3">
                        <i
                          className="fas fa-rupee-sign text-warning"
                          style={{ fontSize: "32px" }}
                        />
                      </div>
                      <h6 className="fw-bold mb-2">Competitive Pricing</h6>
                      <p className="small mb-0">
                        Pricing starts from Rs 100 - Rs 1,00,000 with
                        transparent quotes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-4">
        <div className="container-fluid">
          <div className="row g-0">
            {/* Desktop Sidebar */}
            <div className="col-auto d-none d-lg-block">
              <div className="desktop-sidebar">
                <PermanentFilterSidebar
                  setCategory={setCategory}
                  setBrand={setBrand}
                  setIndustry={() => {}} // Empty function since we don't need industry filter
                  search={search}
                  setSearch={setSearch}
                  sortType={sortType}
                  setSortType={setSortType}
                  setSort={setSort}
                  setNewest={setNewest}
                  setBestseller={setBestseller}
                  sort={sort}
                  newest={newest}
                  bestseller={bestseller}
                  hideIndustry={true} // Hide industry filter
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col main-content-area">
              <div className="px-3 px-lg-4">
                {/* Mobile Filter Button */}
                <div className="d-lg-none mb-3">
                  <button
                    className="filter-toggle-btn w-100"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <i className="fas fa-filter me-2"></i>
                    Filters & Sort
                  </button>
                </div>

                {/* Results Header - Removed search field */}
                <div className="results-header d-flex justify-content-between align-items-center mb-4 p-3">
                  <div>
                    <h5 className="mb-1 fw-bold text-primary">
                      <i className="fas fa-box me-2" />
                      Products
                    </h5>
                    <div className="small text-muted">
                      <span className="badge bg-primary me-2">
                        {totalProducts}
                      </span>
                      results found
                      {search && (
                        <span className="ms-1">
                          for "<strong>{search}</strong>"
                        </span>
                      )}
                      {(category || brand) && (
                        <span className="ms-1">with selected filters</span>
                      )}
                    </div>
                  </div>
                  <div className="d-none d-sm-block">
                    <small className="text-muted bg-light px-3 py-2 rounded-pill">
                      Page {page} of {totalPages}
                    </small>
                  </div>
                </div>

                {/* Loading */}
                {loading && (
                  <div className="loading-container text-center">
                    <div className="custom-spinner mb-3" />
                    <Image
                      src={loader_img}
                      alt="loader"
                      width={60}
                      height={60}
                      className="mb-3"
                    />
                    <p className="text-muted">Loading amazing products...</p>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="text-center py-5">
                    <div className="alert alert-danger d-inline-block" role="alert">
                      <i className="fas fa-exclamation-triangle me-2" />
                      <strong>Oops!</strong> {error}
                    </div>
                  </div>
                )}

                {/* Products */}
                {!loading && !error && (
                  <>
                    {products.length > 0 ? (
                      <>
                        <div className="product-grid">
                          {products.map((p: Product) => (
                            <div key={p?._id} className="w-100">
                              <div className="product-card-wrapper h-100">
                                <div className="product-card-container h-100">
                                  <ProductItem product={p} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="pagination-container mt-5">
                            <div className="d-flex flex-column align-items-center">
                              <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 mb-3">
                                <button
                                  onClick={handlePrevious}
                                  disabled={page === 1}
                                  className="btn btn-outline-primary px-3 px-sm-4 py-2"
                                  style={{ borderRadius: "8px", fontWeight: "500" }}
                                >
                                  <i className="fas fa-chevron-left me-1 d-none d-sm-inline" />
                                  Prev
                                </button>
                                {renderPaginationButtons()}
                                <button
                                  onClick={handleNext}
                                  disabled={page === totalPages}
                                  className="btn btn-outline-primary px-3 px-sm-4 py-2"
                                  style={{ borderRadius: "8px", fontWeight: "500" }}
                                >
                                  Next
                                  <i className="fas fa-chevron-right ms-1 d-none d-sm-inline" />
                                </button>
                              </div>
                              <small className="text-muted">
                                Showing {(page - 1) * limit + 1} to{" "}
                                {Math.min(page * limit, totalProducts)} of{" "}
                                {totalProducts} products
                              </small>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-5">
                        <div className="no-results-icon">
                          <i className="fas fa-search" />
                        </div>
                        <h4 className="text-muted mb-3">No products found</h4>
                        <p className="text-muted mb-4">
                          We couldn't find any products matching your criteria.
                          <br className="d-none d-sm-block" />
                          Try adjusting your search or filter options.
                        </p>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => {
                            setSearch("");
                            setCategory("");
                            setBrand("");
                            setSortType("");
                          }}
                        >
                          <i className="fas fa-refresh me-2" />
                          Clear All Filters
                        </button>
                      </div>
                    )}
                    {seo?.contentDescription && (
                      <SeoContentSection
                        contentDescription={seo?.contentDescription}
                      />
                    )}
                    {/* Contact Info */}
                    <div
                      className="text-center p-5"
                      style={{
                        backgroundColor: "#123c7d",
                        borderRadius: "10px",
                        marginTop: "80px",
                      }}
                    >
                      <h2 className="fw-bold text-white mb-3">
                        Need Help Finding The Right Products?
                      </h2>
                      <p className="text-white mb-4" style={{ fontSize: "16px" }}>
                        Not sure which CNC machining tools are right for your
                        operations? Our experts are here to help. We take the time
                        to understand your unique requirements, recommend the most
                        suitable products, and provide ongoing support to ensure
                        maximum efficiency. Get in touch with Jaypee Associates
                        today for tailored recommendations.
                      </p>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "white",
                          color: "black",
                          fontWeight: "bold",
                          borderRadius: "5px",
                          textTransform: "none",
                          px: 4,
                          "&:hover": { backgroundColor: "#f8f9fa" },
                        }}
                        onClick={() => router.push("/contactus")}
                      >
                        Contact Us
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndustryProductsPage;