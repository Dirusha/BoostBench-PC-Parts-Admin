import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/products/productActions";
import { Link } from "react-router-dom";
import { store } from "../../app/store";

// components

export default function ProductManagement() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [newProduct, setNewProduct] = React.useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    imageUrl: "",
  });
  const [editProduct, setEditProduct] = React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState(null);

  const token = store.getState().auth.token;

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = items.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input changes for new/edit product
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editProduct) {
      setEditProduct({ ...editProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // Create product
  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("product", JSON.stringify(newProduct));
    if (selectedImage) formData.append("image", selectedImage);

    try {
      const response = await fetch("http://localhost:9000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        dispatch(fetchProducts());
        setNewProduct({ name: "", description: "", price: "", quantity: "", imageUrl: "" });
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("product", JSON.stringify(editProduct));
    if (selectedImage) formData.append("image", selectedImage);

    try {
      const response = await fetch(`http://localhost:9000/api/products/${editProduct.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        dispatch(fetchProducts());
        setEditProduct(null);
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`http://localhost:9000/api/products/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          dispatch(fetchProducts());
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">Product Management</h6>
            <button
              className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setEditProduct(null)}
            >
              Add New Product
            </button>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          {/* Search Bar */}
          <div className="relative w-full mb-3">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearch}
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            />
          </div>
          {/* Product Form */}
          {(editProduct || !editProduct) && (
            <form onSubmit={editProduct ? handleUpdate : handleCreate}>
              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editProduct ? editProduct.name : newProduct.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      required
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="description"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      value={editProduct ? editProduct.description : newProduct.description}
                      onChange={handleInputChange}
                      placeholder="Description"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="price"
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={editProduct ? editProduct.price : newProduct.price}
                      onChange={handleInputChange}
                      placeholder="Price"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      required
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="quantity"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={editProduct ? editProduct.quantity : newProduct.quantity}
                      onChange={handleInputChange}
                      placeholder="Quantity"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      required
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="image"
                    >
                      Image
                    </label>
                    <input
                      type="file"
                      id="image"
                      onChange={handleImageChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                >
                  {editProduct ? "Update" : "Create"}
                </button>
                {editProduct && (
                  <button
                    type="button"
                    onClick={() => setEditProduct(null)}
                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ml-1 ease-linear transition-all duration-150"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
          {/* Product Grid */}
          <h6 className="text-blueGray-400 text-sm mt-6 mb-6 font-bold uppercase">
            Product List
          </h6>
          <div className="flex flex-wrap">
            {filteredProducts.map((product) => (
              <div key={product.id} className="w-full lg:w-4/12 px-4 mb-6">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-center">
                      <img
                        alt={product.name}
                        src={product.imageUrl}
                        className="w-32 h-32 mx-auto rounded-full shadow-lg"
                      />
                      <h5 className="text-blueGray-700 text-xl font-bold mt-4">
                        {product.name}
                      </h5>
                      <p className="text-blueGray-600 mt-2 mb-4">
                        {product.description}
                      </p>
                      <p className="text-blueGray-600 font-bold">
                        Price: ${product.price}
                      </p>
                      <p className="text-blueGray-600 font-bold">
                        Quantity: {product.quantity}
                      </p>
                    </div>
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setEditProduct(product)}
                        className="bg-yellow-500 text-white active:bg-yellow-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ml-1 ease-linear transition-all duration-150"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {loading && <p className="text-center text-blueGray-600">Loading...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
        </div>
      </div>
    </>
  );
}