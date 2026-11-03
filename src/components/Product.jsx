import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import { toast } from "react-toastify";
import unplugged from "../assets/unplugged.png";
import { useAuth } from "../auth/AuthContext";

const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, refreshData } = useContext(AppContext);
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    let isActive = true;
    let objectUrl;
    const cachedProduct = data.find((item) => String(item.id) === id);

    setProduct(cachedProduct || null);
    setImageUrl("");
    setIsProductLoading(!cachedProduct);
    setIsImageLoading(true);

    const loadImage = async (productData) => {
      if (productData.imageData) {
        const imageType = productData.imageType || "image/jpeg";
        const image = productData.imageData.startsWith("data:") || productData.imageData.startsWith("http")
          ? productData.imageData
          : `data:${imageType};base64,${productData.imageData}`;
        if (isActive) {
          setImageUrl(image);
        }
        return;
      }

      if (!productData.imageName) {
        if (isActive) {
          setImageUrl(unplugged);
          setIsImageLoading(false);
        }
        return;
      }

      try {
        const response = await axios.get(
          `${baseUrl}/api/product/${id}/imageFile`,
          { responseType: "blob" }
        );
        const nextObjectUrl = URL.createObjectURL(response.data);
        if (isActive) {
          objectUrl = nextObjectUrl;
          setImageUrl(nextObjectUrl);
        } else {
          URL.revokeObjectURL(nextObjectUrl);
        }
      } catch (error) {
        console.error("Error fetching product image:", error);
        if (isActive) {
          setImageUrl(unplugged);
          setIsImageLoading(false);
        }
      }
    };

    const loadProduct = async () => {
      try {
        // The catalog already has the product details, so use them immediately
        // when the user navigates from Home instead of waiting for another API call.
        if (cachedProduct) {
          await loadImage(cachedProduct);
          return;
        }

        const response = await axios.get(`${baseUrl}/api/product/${id}`);
        if (!isActive) return;
        setProduct(response.data);
        setIsProductLoading(false);
        await loadImage(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        if (isActive) {
          setProduct(null);
          setIsProductLoading(false);
          setImageUrl(unplugged);
          setIsImageLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isActive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, data, baseUrl]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`${baseUrl}/api/product/${id}`);
      removeFromCart(id);
      console.log("Product deleted successfully");
      toast.success("Product deleted successfully");
      refreshData(true);
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    toast.success("Product added to cart");
  };

  if (isProductLoading) {
    return (
      <div className="container mt-5 pt-5">
        <div className="row g-4 product-detail-skeleton" aria-busy="true">
          <span className="visually-hidden" role="status">Loading product details…</span>
          <div className="col-md-6">
            <div className="product-detail-image-skeleton loading-skeleton" />
          </div>
          <div className="col-md-6 pt-3">
            <div className="loading-skeleton skeleton-line skeleton-badge mb-4" />
            <div className="loading-skeleton skeleton-line skeleton-heading mb-3" />
            <div className="loading-skeleton skeleton-line skeleton-brand mb-4" />
            <div className="loading-skeleton skeleton-line mb-2" />
            <div className="loading-skeleton skeleton-line mb-2" />
            <div className="loading-skeleton skeleton-line skeleton-description mb-4" />
            <div className="loading-skeleton skeleton-line skeleton-price mb-4" />
            <div className="loading-skeleton skeleton-button mb-4" />
            <div className="loading-skeleton skeleton-line skeleton-brand" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5 pt-5">
        <div className="alert alert-warning" role="alert">Product details could not be loaded.</div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <div className="row">
        {/* Product Image */}
        <div className="col-md-6 mb-4">
          <div className="card border-0 product-detail-image-card">
            {isImageLoading && <div className="product-detail-image-skeleton loading-skeleton" aria-hidden="true" />}
            <img
              src={imageUrl || unplugged}
              alt={product.name}
              className="card-img-top img-fluid"
              style={{ maxHeight: "500px", objectFit: "contain", display: isImageLoading ? "none" : "block" }}
              onLoad={() => setIsImageLoading(false)}
              onError={(event) => {
                event.currentTarget.src = unplugged;
                setIsImageLoading(false);
              }}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-secondary">{product.category}</span>
            <small className="text-muted">
              Listed: {product.releaseDate}
            </small>
          </div>

          <h2 className="text-capitalize mb-1">{product.name}</h2>
          <p className="text-muted fst-italic mb-4">~ {product.brand}</p>

          <div className="mb-4">
            <h5 className="mb-2">Product Description:</h5>
            <p>{product.description}</p>
          </div>

          <h3 className="fw-bold mb-3">₹ {product.price}</h3>

          <div className="d-grid gap-2 mb-3">
            <button
              className="btn btn-primary btn-lg"
              onClick={handlAddToCart}
              disabled={!product.productAvailable || product.stockQuantity == 0}
            >
              {product.stockQuantity !== 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          <p className="mb-4">
            <span className="me-2">Stock Available:</span>
            <span className="fw-bold text-success">{product.stockQuantity}</span>
          </p>

          {user?.role === "admin" && (
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={handleEditClick}
              >
                <i className="bi bi-pencil me-1"></i>
                Update
              </button>

              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={deleteProduct}
              >
                <i className="bi bi-trash me-1"></i>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
