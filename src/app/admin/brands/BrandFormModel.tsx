import { createBrand, updateBrand } from '@/app/services/Brands/BrandApi';
import { getCatalogues } from '@/app/services/Catalogue/CatalogueApi';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

function BrandFormModel({
  userModel,
  setSectorFormCloseModel,
  getSectorData,
}: {
  userModel: any;
  setSectorFormCloseModel: any;
  getSectorData: any;
}) {
  const [catalogueList, setCatalogueList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // Handle catalogue selection -> set catalogueFile (string URL) based on selected catalogue
  const handleCatalogueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setValue('catalogueFile', '');
      return;
    }
    const selected = catalogueList.find((c: any) => c._id === selectedId);
    setValue('catalogueFile', selected?.catalogueFile || '');
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    if (getSectorData?._id) formData.append('id', getSectorData?._id);

    formData.append('brandName', data.brandName);
    formData.append('brandImageAlt', data.brandImageAlt || ''); // NEW: Add alt tag

    // Append selected catalogue ID and derived catalogue file URL (string)
    if (data.selectedCatalogue) formData.append('selectedCatalogue', data.selectedCatalogue);
    if (data.catalogueFile) formData.append('catalogueFile', data.catalogueFile);

    // Brand image (file or existing URL)
    if (data.brandImage && data.brandImage.length > 0) {
      if (data.brandImage[0] instanceof File) {
        formData.append('brandImage', data.brandImage[0]);
      } else {
        formData.append('brandImage', watch('brandImage'));
      }
    }

    try {
      const response = getSectorData ? await updateBrand(formData) : await createBrand(formData);
      const responseData = await response;

      if (responseData.status) {
        getSectorData = {};
        setSectorFormCloseModel();
      }
    } catch (error) {
      console.error(error, 'Error submitting form:');
    }
  };

  const getCataloguesList = async () => {
    setIsLoading(true);
    try {
      const data = await getCatalogues();
      setCatalogueList(
        data?.map((item: any, i: number) => ({
          ...item,
          index: i + 1,
          id: item?._id,
        }))
      );
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (getSectorData) {
      reset({
        _id: getSectorData?._id,
        brandName: getSectorData?.brandName,
        brandImage: getSectorData?.brandImage,
        brandImageAlt: getSectorData?.brandImageAlt || '', // NEW: Set alt tag
        // Pre-fill catalogue fields if present on brand
        selectedCatalogue: getSectorData?.selectedCatalogue || '',
        catalogueFile: getSectorData?.catalogueFile || '',
      });
    } else {
      reset({
        brandImageAlt: '', // NEW: Initialize alt tag
      });
    }
  }, [getSectorData, reset]);

  useEffect(() => {
    getCataloguesList();
  }, []);

  return (
    <Modal
      show={userModel}
      onHide={() => {
        getSectorData = {};
        setSectorFormCloseModel();
      }}
      style={{ display: 'block' }}
    >
      <Modal.Header className="modal-header" closeButton>
        <h5 className="modal-title fw-bold" id="expaddLabel">
          Brand
        </h5>
      </Modal.Header>
      <Modal.Body>
        <div className="deadline-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-3">
              <label>
                Brand Name<span className="text-danger">*</span>
              </label>
              <input
                {...register('brandName', { required: true })}
                type="text"
                className="form-control"
                placeholder="Brand Name"
              />
              {errors?.brandName && <span className="text-danger">This field is required</span>}
            </div>

          

            {/* Select Catalogue */}
            <div className="form-group mb-3">
              <label>
                Select Catalogue<span className="text-danger">*</span>
              </label>
              <select
                {...register('selectedCatalogue', { required: 'Please select a catalogue' })}
                className="form-control"
                onChange={handleCatalogueChange}
                disabled={isLoading}
              >
                <option value="">{isLoading ? 'Loading catalogues...' : 'Select a catalogue'}</option>
                {catalogueList.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.catalogueName}
                  </option>
                ))}
              </select>
              {errors?.selectedCatalogue && (
                <span className="text-danger">{errors?.selectedCatalogue?.message as string}</span>
              )}

              {/* Show selected file link */}
              {watch('catalogueFile') && (
                <div className="mt-2">
                  <small className="text-muted">Selected file: </small>
                  <a
                    href={watch('catalogueFile')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    View Catalogue
                  </a>
                </div>
              )}
            </div>

            {/* Hidden field to store the selected catalogue file URL (string) */}
            <input {...register('catalogueFile')} type="hidden" />

            <div className="form-group mb-3">
              <label>
                Brand Image<span className="text-danger">*</span>
              </label>
              <div>
                <input
                  {...register('brandImage', {
                    required: watch('brandImage')?.length ? false : 'This field is required',
                    validate: (value) => {
                      if (typeof value === 'string') return true;
                      if (!value || value.length === 0) return 'Image file is required';
                      if (!value[0]?.type?.startsWith('image/')) return 'Only image files are allowed';
                      return true;
                    },
                  })}
                  type="file"
                  className="form-control"
                  accept="image/*"
                />
                {watch('brandImage') &&
                  typeof watch('brandImage') === 'string' &&
                  watch('brandImage')?.includes('amazonaws.com') && (
                    <Image
                      src={watch('brandImage')}
                      width={100}
                      height={100}
                      alt={watch('brandImageAlt') || `${watch('brandName') || 'brand'} image`} // NEW: Use alt tag
                      unoptimized
                      className="img-thumbnail mt-2"
                    />
                  )}
                {watch('brandImage') && watch('brandImage')[0] instanceof File && (
                  <Image
                    src={URL.createObjectURL(watch('brandImage')[0])}
                    width={100}
                    height={100}
                    alt={watch('brandImageAlt') || `${watch('brandName') || 'brand'} image`} // NEW: Use alt tag
                    unoptimized
                    className="img-thumbnail mt-2"
                  />
                )}
              </div>
              {errors?.brandImage && (
                <span className="text-danger">{(errors?.brandImage?.message as String) || ''}</span>
              )}
            </div>
              {/* NEW: Brand Image Alt Tag */}
            <div className="form-group mb-3">
              <label>Brand Image Alt Text</label>
              <input
                {...register('brandImageAlt')}
                type="text"
                className="form-control"
                placeholder="Enter alt text for brand image (SEO)"
              />
            </div>

            <div className="d-flex justify-content-between mt-3">
              <button
                onClick={() => {
                  setSectorFormCloseModel();
                }}
                type="button"
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default BrandFormModel;