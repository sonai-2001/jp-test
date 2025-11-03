import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getProductsFilters } from '@/app/services/Product/ProductApi';
import { MdOutlineClear, MdExpandMore, MdExpandLess } from 'react-icons/md';

// Update the interface in PermanentFilterSidebar.tsx
interface PermanentFilterSidebarProps {
  setCategory: (category: string) => void;
  setBrand: (brand: string) => void;
  setIndustry: (industry: string) => void;
  search: string;
  setSearch: (search: string) => void;
  sortType: string;
  setSortType: (sortType: string) => void;
  setSort: (sort: boolean) => void;
  setNewest: (newest: boolean) => void;
  setBestseller: (bestseller: boolean) => void;
  sort: boolean;
  newest: boolean;
  bestseller: boolean;
  hideCategory?: boolean; // Hide category filter
  hideBrand?: boolean;    // Hide brand filter
  hideIndustry?: boolean; // Hide industry filter
  hideSort?: boolean;     // Hide sort options
}

function PermanentFilterSidebar({
  setCategory,
  setBrand,
  setIndustry,
  search,
  setSearch,
  sortType,
  setSortType,
  setSort,
  setNewest,
  setBestseller,
  sort,
  newest,
  bestseller,
  hideCategory = false,
  hideBrand = false,
  hideIndustry = false,
  hideSort = false,
}: PermanentFilterSidebarProps) {
  const { register, reset, watch } = useForm({
    defaultValues: {
      category: [] as string[],
      brand: [] as string[],
      industry: [] as string[],
    },
  });

  const [CategoryList, setCategoryList] = useState<any[]>([]);
  const [BrandList, setBrandList] = useState<any[]>([]);
  const [IndustryList, setIndustryList] = useState<any[]>([]);

  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [brandExpanded, setBrandExpanded] = useState(true);
  const [industryExpanded, setIndustryExpanded] = useState(true);
  const [sortExpanded, setSortExpanded] = useState(false);

  const watchedCategory = watch('category');
  const watchedBrand = watch('brand');
  const watchedIndustry = watch('industry');

  const toCSV = (v: unknown) => {
    if (Array.isArray(v)) return v.join(',');
    if (typeof v === 'string') return v;
    return '';
  };

  const ResetAllFilters = () => {
    reset({
      category: hideCategory ? undefined : [],
      brand: hideBrand ? undefined : [],
      industry: hideIndustry ? undefined : [],
    });
    if (!hideCategory) setCategory('');
    if (!hideBrand) setBrand('');
    if (!hideIndustry) setIndustry('');
    setSearch('');
    if (!hideSort) setSortType('');
  };

  const getData = async () => {
    try {
      const filter: any = await getProductsFilters();
      if (!hideCategory) setCategoryList(filter?.categories || []);
      if (!hideBrand) setBrandList(filter?.brands || []);
      if (!hideIndustry) setIndustryList(filter?.industries || []);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  useEffect(() => {
    getData();
  }, [hideCategory, hideBrand, hideIndustry]);

  useEffect(() => {
    if (!hideCategory) setCategory(toCSV(watchedCategory));
  }, [watchedCategory, setCategory, hideCategory]);

  useEffect(() => {
    if (!hideBrand) setBrand(toCSV(watchedBrand));
  }, [watchedBrand, setBrand, hideBrand]);

  useEffect(() => {
    if (!hideIndustry) setIndustry(toCSV(watchedIndustry));
  }, [watchedIndustry, setIndustry, hideIndustry]);

  const handleSortChange = (newSortType: string) => {
    if (hideSort) return;
    
    setSortType(newSortType);

    if (newSortType === 'name_asc' || newSortType === 'name_desc') {
      setSort(!sort);
    } else if (newSortType === 'Newest Arrivals') {
      setNewest(!newest);
    } else if (newSortType === 'Bestseller') {
      setBestseller(!bestseller);
    }
  };

  // Check if any filters are visible (for showing "Clear All" button)
  const hasVisibleFilters = !hideCategory || !hideBrand || !hideIndustry || !hideSort;

  return (
    <div
      className="bg-white border-end h-100"
      style={{ width: '300px', position: 'sticky', top: '0', maxHeight: '100vh', overflowY: 'auto' }}
    >
      {/* Header */}
      <div className="p-3 border-bottom bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-dark">Filters & Search</h5>
          {hasVisibleFilters && (
            <button className="btn btn-sm btn-outline-secondary" onClick={ResetAllFilters} style={{ fontSize: '12px' }}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div className="p-3 border-bottom">
        <label className="form-label fw-semibold text-dark mb-2">Search Products</label>
        <div className="position-relative">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value || '')}
            className="form-control"
            style={{ paddingRight: '35px' }}
          />
          {search && (
            <MdOutlineClear
              onClick={() => setSearch('')}
              className="position-absolute"
              style={{ top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6c757d', fontSize: '18px' }}
            />
          )}
        </div>
      </div>

      {/* Sort Section */}
      {!hideSort && (
        <div className="border-bottom">
          <button
            type="button"
            className="btn btn-link w-100 d-flex align-items-center justify-content-between p-3 text-decoration-none text-dark fw-semibold"
            onClick={() => setSortExpanded(!sortExpanded)}
          >
            <span>Sort By</span>
            {sortExpanded ? <MdExpandLess /> : <MdExpandMore />}
          </button>

          {sortExpanded && (
            <div className="px-3 pb-3">
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className={`btn btn-sm text-start ${sortType === 'name_asc' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => handleSortChange('name_asc')}
                >
                  Product Name: A to Z
                </button>
                <button
                  type="button"
                  className={`btn btn-sm text-start ${sortType === 'name_desc' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => handleSortChange('name_desc')}
                >
                  Product Name: Z to A
                </button>
                <button
                  type="button"
                  className={`btn btn-sm text-start ${sortType === 'Newest Arrivals' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => handleSortChange('Newest Arrivals')}
                >
                  Newest Arrivals
                </button>
                <button
                  type="button"
                  className={`btn btn-sm text-start ${sortType === 'Bestseller' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => handleSortChange('Bestseller')}
                >
                  Bestseller
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Filter - Conditionally rendered */}
      {!hideCategory && (
        <div className="border-bottom">
          <button
            type="button"
            className="btn btn-link w-100 d-flex align-items-center justify-content-between p-3 text-decoration-none text-dark fw-semibold"
            onClick={() => setCategoryExpanded(!categoryExpanded)}
          >
            <span>Category</span>
            {categoryExpanded ? <MdExpandLess /> : <MdExpandMore />}
          </button>

          {categoryExpanded && (
            <div className="px-3 pb-3">
              <div style={{ maxHeight: CategoryList.length > 12 ? '300px' : 'auto', overflowY: CategoryList.length > 12 ? 'auto' : 'visible' }}>
                {CategoryList.map((cate: any) => (
                  <div key={cate?._id} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      {...register('category')}
                      type="checkbox"
                      value={cate?._id}
                      id={`category_${cate?._id}`}
                    />
                    <label className="form-check-label" htmlFor={`category_${cate?._id}`} style={{ fontSize: '14px', cursor: 'pointer' }} title={cate?.category}>
                      {cate?.category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Brand Filter - Conditionally rendered */}
      {!hideBrand && (
        <div className="border-bottom">
          <button
            type="button"
            className="btn btn-link w-100 d-flex align-items-center justify-content-between p-3 text-decoration-none text-dark fw-semibold"
            onClick={() => setBrandExpanded(!brandExpanded)}
          >
            <span>Brand</span>
            {brandExpanded ? <MdExpandLess /> : <MdExpandMore />}
          </button>

          {brandExpanded && (
            <div className="px-3 pb-3">
              <div style={{ maxHeight: BrandList.length > 12 ? '300px' : 'auto', overflowY: BrandList.length > 12 ? 'auto' : 'visible' }}>
                {BrandList.map((brand: any) => (
                  <div key={brand?._id} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      {...register('brand')}
                      type="checkbox"
                      value={brand?._id}
                      id={`brand_${brand?._id}`}
                    />
                    <label className="form-check-label" htmlFor={`brand_${brand?._id}`} style={{ fontSize: '14px', cursor: 'pointer' }} title={brand?.brandName}>
                      {brand?.brandName}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Industry Filter - Conditionally rendered */}
      {!hideIndustry && (
        <div className="border-bottom">
          <button
            type="button"
            className="btn btn-link w-100 d-flex align-items-center justify-content-between p-3 text-decoration-none text-dark fw-semibold"
            onClick={() => setIndustryExpanded(!industryExpanded)}
          >
            <span>Industry</span>
            {industryExpanded ? <MdExpandLess /> : <MdExpandMore />}
          </button>

          {industryExpanded && (
            <div className="px-3 pb-3">
              <div style={{ maxHeight: IndustryList.length > 12 ? '300px' : 'auto', overflowY: IndustryList.length > 12 ? 'auto' : 'visible' }}>
                {IndustryList.map((ind: any) => (
                  <div key={ind?._id} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      {...register('industry')}
                      type="checkbox"
                      value={ind?._id}
                      id={`industry_${ind?._id}`}
                    />
                    <label className="form-check-label" htmlFor={`industry_${ind?._id}`} style={{ fontSize: '14px', cursor: 'pointer' }} title={ind?.industry}>
                      {ind?.industry}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PermanentFilterSidebar;

