"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { getProducts } from "@/app/services/Product/ProductApi";
import { staticPages } from "./staticPages";
import { getCategories } from "@/app/services/Category/CategoryApi";
import { getBrands } from "@/app/services/Brands/BrandApi";
import { getIndustries } from "@/app/services/Industry/IndustryApi";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  slug1?: string;
}

interface CategoryRow {
  id: string;
  category: string;
  slug?: string;
  slug1?: string;
}

interface BrandRow {
  id: string;
  name: string;
  slug: string;
  slug1?: string;
}

interface IndustryRow {
  id: string;
  industry: string;
  slug?: string;
  slug1?: string;
}

function SeoListPage() {
  const router = useRouter();
  const [productRows, setProductRows] = useState<ProductRow[]>([]);
  const [categoryRows, setCategoryRows] = useState<CategoryRow[]>([]);
  const [brandRows, setBrandRows] = useState<BrandRow[]>([]);
  const [industryRows, setIndustryRows] = useState<IndustryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState("");

  // Get base URL on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const result: any = await getProducts();
      const rows: ProductRow[] = result.map((item: any) => ({
        id: item._id,
        name: item.ProductName,
        slug: item.slug,
        slug1: baseUrl ? `${baseUrl}/products/${item.slug}` : `/products/${item.slug}`,
      }));
      setProductRows(rows);
    } catch (error) {
      setProductRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const result: any = await getCategories();
      const rows: CategoryRow[] = result.map((item: any) => ({
        id: item._id,
        category: item.category,
        slug: item.slug,
        slug1: baseUrl ? `${baseUrl}/categories/${item.slug}` : `/categories/${item.slug}`,
      }));
      setCategoryRows(rows);
    } catch (error) {
      setCategoryRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const result: any = await getBrands();
      const rows: BrandRow[] = result.map((item: any) => ({
        id: item._id,
        name: item.brandName,
        slug: item.slug,
        slug1: baseUrl ? `${baseUrl}/brands/${item.slug}` : `/brands/${item.slug}`,
      }));
      setBrandRows(rows);
    } catch (error) {
      setBrandRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIndustries = async () => {
    setIsLoading(true);
    try {
      const result: any = await getIndustries();
      const rows: IndustryRow[] = result.map((item: any) => ({
        id: item._id,
        industry: item.industry,
        slug: item.slug,
        slug1: baseUrl ? `${baseUrl}/industries/${item.slug}` : `/industries/${item.slug}`,
      }));
      setIndustryRows(rows);
    } catch (error) {
      setIndustryRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all data
  useEffect(() => {
    if (baseUrl) {
      fetchProducts();
      fetchCategories();
      fetchBrands();
      fetchIndustries();
    }
  }, [baseUrl]);

  // Static pages table columns
  const staticColumns: GridColDef[] = [
    { field: "name", headerName: "Page Name", width: 200 },
    { field: "slug1", headerName: "Slug", width: 300 },
    {
      field: "action",
      headerName: "Manage SEO",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outline-primary"
          onClick={() => router.push(`/admin/seo/${params.row.slug}`)}
        >
          Manage SEO
        </Button>
      ),
    },
  ];

  // Product table columns
  const productColumns: GridColDef[] = [
    { field: "name", headerName: "Product Name", width: 200 },
    { field: "slug1", headerName: "Slug", width: 300 },
    {
      field: "action",
      headerName: "Manage SEO",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outline-primary"
          onClick={() => router.push(`/admin/seo/${params.row.slug}`)}
        >
          Manage SEO
        </Button>
      ),
    },
  ];

  const categoryColumns: GridColDef[] = [
    { field: "category", headerName: "Category Name", width: 200 },
    { field: "slug1", headerName: "Url", width: 300 },
    {
      field: "action",
      headerName: "Manage SEO",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outline-primary"
          onClick={() => router.push(`/admin/seo/${params.row.slug}`)}
        >
          Manage SEO
        </Button>
      ),
    },
  ];

  const brandColumns: GridColDef[] = [
    { field: "name", headerName: "Brand Name", width: 200 },
    { field: "slug1", headerName: "Url", width: 300 },
    {
      field: "action",
      headerName: "Manage SEO",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outline-primary"
          onClick={() => router.push(`/admin/seo/${params.row.slug}`)}
        >
          Manage SEO
        </Button>
      ),
    },
  ];

  const industryColumns: GridColDef[] = [
    { field: "industry", headerName: "Industry Name", width: 200 },
    { field: "slug1", headerName: "Url", width: 300 },
    {
      field: "action",
      headerName: "Manage SEO",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outline-primary"
          onClick={() => router.push(`/admin/seo/${params.row.slug}`)}
        >
          Manage SEO
        </Button>
      ),
    },
  ];

  // Add id to static pages for DataGrid with dynamic base URL
  const staticRows = staticPages.map((page) => ({
    id: page.slug,
    name: page.name,
    slug1: baseUrl ? `${baseUrl}/${page.slug}` : `/${page.slug}`,
    slug: page.slug ? page.slug : "/landing-page",
  }));

  return (
    <section>
      <div className="container">
        <h2 className="mb-4">SEO Management</h2>

        {/* Static Pages */}
        <div className="mb-5">
          <h4>Static Pages</h4>
          <DataGrid
            rows={staticRows}
            columns={staticColumns}
            pagination
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 25]}
            sx={{
              border: "none",
              marginBottom: 2,
              "& .MuiDataGrid-root": { border: "none" },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #e0e0e0",
                backgroundColor: "#f8f9fa",
                justifyContent: "center",
                padding: "8px 16px",
              },
              "& .MuiTablePagination-root": { overflow: "visible" },
              "& .MuiTablePagination-toolbar": {
                minHeight: "48px",
                paddingLeft: "8px",
                paddingRight: "8px",
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                margin: "0",
                fontSize: "14px",
              },
              "& .MuiTablePagination-select": {
                paddingTop: "8px",
                paddingBottom: "8px",
              },
              "& .MuiIconButton-root": { padding: "8px" },
            }}
          />
        </div>

        {/* Products */}
        <div className="mb-5">
          <h4>Products</h4>
          {isLoading ? (
            <div className="text-center" style={{ height: "200px" }}>
              <Spinner animation="border" role="status" />
            </div>
          ) : (
            <DataGrid
              rows={productRows}
              columns={productColumns}
              pagination
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10, 25]}
              sx={{
                border: "none",
                "& .MuiDataGrid-root": { border: "none" },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid #e0e0e0",
                  backgroundColor: "#f8f9fa",
                  justifyContent: "center",
                  padding: "8px 16px",
                },
                "& .MuiTablePagination-root": { overflow: "visible" },
                "& .MuiTablePagination-toolbar": {
                  minHeight: "48px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                  margin: "0",
                  fontSize: "14px",
                },
                "& .MuiTablePagination-select": {
                  paddingTop: "8px",
                  paddingBottom: "8px",
                },
                "& .MuiIconButton-root": { padding: "8px" },
              }}
            />
          )}
        </div>

        {/* Categories */}
        <div className="mb-5">
          <h4>Categories</h4>
          {isLoading ? (
            <div className="text-center" style={{ height: "200px" }}>
              <Spinner animation="border" role="status" />
            </div>
          ) : (
            <DataGrid
              rows={categoryRows}
              columns={categoryColumns}
              pagination
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10, 25]}
              sx={{
                border: "none",
                "& .MuiDataGrid-root": { border: "none" },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid #e0e0e0",
                  backgroundColor: "#f8f9fa",
                  justifyContent: "center",
                  padding: "8px 16px",
                },
                "& .MuiTablePagination-root": { overflow: "visible" },
                "& .MuiTablePagination-toolbar": {
                  minHeight: "48px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                  margin: "0",
                  fontSize: "14px",
                },
                "& .MuiTablePagination-select": {
                  paddingTop: "8px",
                  paddingBottom: "8px",
                },
                "& .MuiIconButton-root": { padding: "8px" },
              }}
            />
          )}
        </div>

        {/* Brands */}
        <div className="mb-5">
          <h4>Brands</h4>
          {isLoading ? (
            <div className="text-center" style={{ height: "200px" }}>
              <Spinner animation="border" role="status" />
            </div>
          ) : (
            <DataGrid
              rows={brandRows}
              columns={brandColumns}
              pagination
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10, 25]}
              sx={{
                border: "none",
                "& .MuiDataGrid-root": { border: "none" },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid #e0e0e0",
                  backgroundColor: "#f8f9fa",
                  justifyContent: "center",
                  padding: "8px 16px",
                },
                "& .MuiTablePagination-root": { overflow: "visible" },
                "& .MuiTablePagination-toolbar": {
                  minHeight: "48px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                  margin: "0",
                  fontSize: "14px",
                },
                "& .MuiTablePagination-select": {
                  paddingTop: "8px",
                  paddingBottom: "8px",
                },
                "& .MuiIconButton-root": { padding: "8px" },
              }}
            />
          )}
        </div>

        {/* Industries */}
        <div className="mb-5">
          <h4>Industries</h4>
          {isLoading ? (
            <div className="text-center" style={{ height: "200px" }}>
              <Spinner animation="border" role="status" />
            </div>
          ) : (
            <DataGrid
              rows={industryRows}
              columns={industryColumns}
              pagination
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10, 25]}
              sx={{
                border: "none",
                "& .MuiDataGrid-root": { border: "none" },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid #e0e0e0",
                  backgroundColor: "#f8f9fa",
                  justifyContent: "center",
                  padding: "8px 16px",
                },
                "& .MuiTablePagination-root": { overflow: "visible" },
                "& .MuiTablePagination-toolbar": {
                  minHeight: "48px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                  margin: "0",
                  fontSize: "14px",
                },
                "& .MuiTablePagination-select": {
                  paddingTop: "8px",
                  paddingBottom: "8px",
                },
                "& .MuiIconButton-root": { padding: "8px" },
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default SeoListPage;