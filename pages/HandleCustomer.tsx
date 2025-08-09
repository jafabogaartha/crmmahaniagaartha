import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { api } from '../services/api';
import type { HandleCustomerData } from '../types';

export function HandleCustomer() {
  const [handleCustomerData, setHandleCustomerData] = useState<HandleCustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHandleCustomerData();
  }, []);

  const loadHandleCustomerData = async () => {
    try {
      setLoading(true);
      const data = await api.getHandleCustomerData();
      setHandleCustomerData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load handle customer data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFollowUpStatus = async (id: string, status: 'Sudah' | 'Belum') => {
    try {
      await api.updateHandleCustomerFollowUp(id, status);
      await loadHandleCustomerData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update follow-up status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <Button onClick={loadHandleCustomerData} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Handle Customer</h1>
        <Button onClick={loadHandleCustomerData} variant="outline">
          Refresh
        </Button>
      </div>

      {handleCustomerData.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No customer data to handle</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {handleCustomerData.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.lead?.nama || 'Unknown Customer'}
                  </h3>
                  <p className="text-gray-600">{item.lead?.nomor_wa}</p>
                </div>
                <Badge variant={item.status_fu === 'Sudah' ? 'success' : 'warning'}>
                  {item.status_fu === 'Sudah' ? 'Followed Up' : 'Pending Follow Up'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Product</p>
                  <p className="font-medium">{item.lead?.product?.nama_produk || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Package</p>
                  <p className="font-medium">{item.lead?.package?.nama_paket || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">
                    {item.lead?.harga ? `Rp ${item.lead.harga.toLocaleString('id-ID')}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Follow Up</p>
                  <p className="font-medium">
                    {item.tanggal_fu_terakhir 
                      ? new Date(item.tanggal_fu_terakhir).toLocaleDateString('id-ID')
                      : 'Never'
                    }
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleUpdateFollowUpStatus(item.id, 'Sudah')}
                  variant={item.status_fu === 'Sudah' ? 'outline' : 'primary'}
                  size="sm"
                >
                  Mark as Followed Up
                </Button>
                <Button
                  onClick={() => handleUpdateFollowUpStatus(item.id, 'Belum')}
                  variant={item.status_fu === 'Belum' ? 'outline' : 'secondary'}
                  size="sm"
                >
                  Mark as Pending
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}