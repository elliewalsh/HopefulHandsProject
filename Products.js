import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Products.css';
import DeleteDonation from './DeleteDonation';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  const history = useHistory();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5321/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = (productId) => {
    setProducts(products.filter(product => product._id !== productId));
  };

  const handleUpdate = (productId) => {
    history.push(`/update/${productId}`);
  };

  const filteredProducts = products.filter((product) =>
    product.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <div className="text"> Products </div>
        <div className="underline"></div>
        <div className="searchContainerAdmin">
          <input
            type="search"
            placeholder="Search for Product"
            className="searchbarforproductsAdmin"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Description</th>
              <th>Category</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.product}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                <td>
                  {product.imageUrls &&
                    product.imageUrls.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={`http://localhost:3000/${imageUrl}`}
                        alt={product.product}
                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                      />
                    ))}
                </td>
                <td>
                  <button className="btn btn-success" onClick={() => handleUpdate(product._id)}>
                    Update
                  </button>
                  <DeleteDonation productId={product._id} onDelete={handleDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;
