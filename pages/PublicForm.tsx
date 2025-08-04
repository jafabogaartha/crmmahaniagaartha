import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

export const PublicForm: React.FC = () => {
    const { productNameUrl } = useParams<{ productNameUrl: string }>();
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({ name: '', whatsapp: '', source: 'Instagram', inquiryText: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const prods = await api.getProducts();
                const currentProduct = prods.find(p => p.nama_produk.toLowerCase() === productNameUrl?.toLowerCase());
                if (currentProduct) {
                    setSelectedProduct(currentProduct);
                } else {
                    // Jika produk tidak ditemukan, arahkan ke URL formulir default untuk produk acak
                    navigate('/form', { replace: true });
                }
            } catch (err) {
                setError('Failed to load form data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [productNameUrl, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct || !formData.name || !formData.whatsapp || !formData.inquiryText) {
            setError('Please fill all required fields.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const { assignedAdmin } = await api.addLead({
                nama: formData.name,
                nomor_wa: formData.whatsapp,
                sumber_lead: formData.source,
                product_id: selectedProduct.id,
                inquiry_text: formData.inquiryText
            });
            
            const message = encodeURIComponent(`Hallo kak, saya mau bertanya tentang produk "${selectedProduct.nama_produk}".\n\nPertanyaan saya: ${formData.inquiryText}`);
            window.location.href = `https://wa.me/${assignedAdmin.nomor_wa}?text=${message}`;

        } catch (err) {
            const e = err as Error;
            setError(`Submission failed: ${e.message}`);
            setSubmitting(false);
        }
    };
    
    if (loading) return (
      <div className="flex justify-center items-center min-h-screen">
          <Spinner />
      </div>
    );

    if (error && !selectedProduct) return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <Card><p className="text-red-500">{error}</p></Card>
        </div>
    );
    
    return (
        <div className="flex justify-center items-center min-h-screen bg-base-100 dark:bg-base-dark p-4">
            <Card className="w-full max-w-2xl mx-auto shadow-neo dark:shadow-dark-neo">
                <h2 className="text-2xl font-bold text-center mb-2">Form Pertanyaan: <span className="text-primary capitalize">{selectedProduct?.nama_produk}</span></h2>
                <p className="text-center text-gray-500 mb-6">Isi formulir di bawah ini dan kami akan segera menghubungi Anda.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="font-bold">Nama</label>
                        <input type="text" name="name" onChange={handleInputChange} required className="w-full p-2 border-2 rounded mt-1 dark:bg-dark-card border-neutral dark:border-dark-content/50" />
                    </div>
                    <div>
                        <label className="font-bold">Nomor WhatsApp</label>
                        <input type="tel" name="whatsapp" onChange={handleInputChange} required className="w-full p-2 border-2 rounded mt-1 dark:bg-dark-card border-neutral dark:border-dark-content/50" placeholder="e.g., 628123456789" />
                    </div>
                     <div>
                        <label className="font-bold">Sumber Informasi</label>
                        <select name="source" value={formData.source} onChange={handleInputChange} required className="w-full p-2 border-2 rounded mt-1 dark:bg-dark-card border-neutral dark:border-dark-content/50">
                            <option>Instagram</option>
                            <option>TikTok</option>
                            <option>Facebook</option>
                            <option>Website</option>
                            <option>Rekomendasi Teman</option>
                            <option>Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label className="font-bold">Apa yang ingin ditanyakan?</label>
                        <textarea name="inquiryText" onChange={handleInputChange} required rows={4} className="w-full p-2 border-2 rounded mt-1 dark:bg-dark-card border-neutral dark:border-dark-content/50"></textarea>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? 'Mengirim...' : 'Kirim & Lanjut ke WhatsApp'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};