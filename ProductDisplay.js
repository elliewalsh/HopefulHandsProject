import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ProductDisplay.css';

function ProductDisplay() {
    const [products, setProductDisplay] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const history = useHistory();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');

    useEffect(() => {
        const fetchProductDisplay = async () => {
            try {
                const response = await axios.get('http://localhost:5321/products');
                if (category) {
                    // Filter products based on category if provided
                    const filteredProducts = response.data.filter(product => product.category === category);
                    setProductDisplay(filteredProducts);
                } else {
                    setProductDisplay(response.data);
                }
            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDisplay();
    }, [category]);

    const handleMessageClick = (event) => {
        event.stopPropagation();
        history.push('/chatbox');
    };

    // Filter products based on search query
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
                <div className="searchContainer">
                    <input 
                        type="search"
                        placeholder="Search for Product" 
                        className="searchbarforproducts"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <div className="product-grid">
                    {filteredProducts.map((product) => (
                        <Link key={product._id} to={`/productinfo/${product._id}`} className="product-card">
                            <div className="product-image">
                                {product.imageUrls && product.imageUrls.map((imageUrl, index) => (
                                    <img
                                        key={index}
                                        src={`http://localhost:3000/${imageUrl}`}
                                        alt={product.product}
                                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                                    />
                                ))}
                            </div>
                            <div className="product-details">
                                <h3>{product.product}</h3>
                                <p>{product.description}</p>
                                <p>{product.category}</p>
                                <div className="product-actions">
                                    <button onClick={(event) => handleMessageClick(event)} className="button button-update">
                                        Message Donator
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductDisplay;
