import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";

const CATEGORIES = ["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];

const formatDateForInput = (dateValue) => {
  if (!dateValue) return "";
  const value = String(dateValue);

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const dayFirstDate = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (dayFirstDate) {
    const [, day, month, year] = dayFirstDate;
    return `${year}-${month}-${day}`;
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "";
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });
  const { refreshData } = useContext(AppContext);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    let isActive = true;
    let imageObjectUrl;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/product/${id}`);
        const productData = response.data;
        if (!isActive) return;
        setProduct(productData);

        const productCategory = CATEGORIES.find(
          (category) => category.toLowerCase() === String(productData.category || "").toLowerCase()
        ) || productData.category || "";

        setUpdateProduct({
          id: productData.id ?? null,
          name: productData.name ?? "",
          description: productData.description ?? "",
          brand: productData.brand ?? "",
          price: productData.price ?? "",
          category: productCategory,
          releaseDate: formatDateForInput(productData.releaseDate),
          productAvailable: Boolean(productData.productAvailable),
          stockQuantity: productData.stockQuantity ?? "",
        });
        // Show editable product fields immediately; image loading is independent.
        setLoading(false);

        if (productData.imageName) {
          try {
            const responseImage = await axios.get(
              `${baseUrl}/api/product/${id}/imageFile`,
              { responseType: "blob" }
            );
            if (!isActive) return;
            const imageFile = new File(
              [responseImage.data],
              productData.imageName,
              { type: responseImage.data.type }
            );
            setImage(imageFile);
            imageObjectUrl = URL.createObjectURL(imageFile);
            setImagePreview(imageObjectUrl);
          } catch (imgError) {
            console.error("Error fetching image:", imgError);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        if (isActive) alert("Failed to fetch product details. Please check the console.");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }

    // Cleanup function
    return () => {
      isActive = false;
      if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    };
  }, [id, baseUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!updateProduct.name || !updateProduct.price) {
      alert("Please fill in name and price");
      return;
    }

    try {
      // Prepare the product data with proper date format
      const productToSubmit = { ...updateProduct };
      
      // Convert date from yyyy-MM-dd (input format) to dd-MM-yyyy (backend format)
      if (productToSubmit.releaseDate) {
        const [year, month, day] = productToSubmit.releaseDate.split('-');
        productToSubmit.releaseDate = `${day}-${month}-${year}`;
        console.log("Date converted for backend:", productToSubmit.releaseDate);
      }

      console.log("Submitting product:", productToSubmit);

      const formData = new FormData();
      
      // Append image if present
      if (image) {
        formData.append("imageFile", image);
      }
      
      // Append product data as JSON blob
      const productBlob = new Blob([JSON.stringify(productToSubmit)], { type: "application/json" });
      formData.append("product", productBlob);
      
      // Debug: Log what's being sent
      console.log("Product JSON being sent:", JSON.stringify(productToSubmit, null, 2));

      const response = await axios.put(
        `${baseUrl}/api/product/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
    );
      await refreshData(true);

      console.log("Product updated successfully:", response.data);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error during product update:", error);
      console.error("Error response:", error.response?.data);
      alert(`Failed to update product: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Revoke old preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <div className="update-product-container">
        <div className="center-container" style={{ marginTop: "7rem" }}>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="update-product-container">
      <div className="center-container" style={{ marginTop: "7rem" }}>
        <h1>Update Product</h1>
        <form className="row g-3 pt-1" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Name</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={product.name || "Enter product name"}
              value={updateProduct.name}
              onChange={handleChange}
              name="name"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Brand</h6>
            </label>
            <input
              type="text"
              name="brand"
              className="form-control"
              placeholder={product.brand || "Enter brand"}
              value={updateProduct.brand}
              onChange={handleChange}
              id="brand"
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              <h6>Description</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={product.description || "Enter description"}
              name="description"
              onChange={handleChange}
              value={updateProduct.description}
              id="description"
            />
          </div>
          <div className="col-5">
            <label className="form-label">
              <h6>Price</h6>
            </label>
            <input
              type="number"
              className="form-control"
              onChange={handleChange}
              value={updateProduct.price}
              placeholder={product.price || "0.00"}
              name="price"
              id="price"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Category</h6>
            </label>
            <select
              className="form-select"
              value={updateProduct.category}
              onChange={handleChange}
              name="category"
              id="category"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Release Date</h6>
            </label>
            <input
              type="date"
              className="form-control"
              value={updateProduct.releaseDate}
              name="releaseDate"
              onChange={handleChange}
              id="releaseDate"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Stock Quantity</h6>
            </label>
            <input
              type="number"
              className="form-control"
              onChange={handleChange}
              placeholder={product.stockQuantity || "0"}
              value={updateProduct.stockQuantity}
              name="stockQuantity"
              id="stockQuantity"
              min="0"
            />
          </div>

          <div className="col-md-8">
            <label className="form-label">
              <h6>Image</h6>
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt={product.imageName || "Product"}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  padding: "5px",
                  margin: "0",
                  display: "block",
                }}
              />
            )}
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              name="imageUrl"
              id="imageUrl"
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                id="gridCheck"
                checked={updateProduct.productAvailable}
                onChange={(e) =>
                  setUpdateProduct((prev) => ({ 
                    ...prev, 
                    productAvailable: e.target.checked 
                  }))
                }
              />
              <label className="form-check-label" htmlFor="gridCheck">
                Product Available
              </label>
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
