import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { Card } from '../components/ui/Card';

export const PublicFormRedirect: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const prods = await api.getProducts();
        if (prods && prods.length > 0) {
          setProducts(prods);
        } else {
          setError("No products available to create a form.");
        }
      } catch (err) {
        setError("Could not load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="text-red-500">{error}</Card>
      </div>
    );
  }

  if (products.length > 0) {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    return <Navigate to={`/form/${randomProduct.nama_produk.toLowerCase()}`} replace />;
  }
  
  // Fallback in case something unexpected happens
  return <Navigate to="/login" replace />;
};
