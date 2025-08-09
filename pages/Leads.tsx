import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { KanbanBoard } from '../components/leads/KanbanBoard';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Lead, Product, Package, User, Obstacle, Promo } from '../types';

export default function Leads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leadsData, productsData, packagesData, usersData, obstaclesData, promosData] = await Promise.all([
        api.getLeads(),
        api.getProducts(),
        api.getPackages(),
        api.getUsers(),
        api.getObstacles(),
        api.getPromos()
      ]);
      
      setLeads(leadsData);
      setProducts(productsData);
      setPackages(packagesData);
      setUsers(usersData);
      setObstacles(obstaclesData);
      setPromos(promosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (leadData: Partial<Lead>) => {
    try {
      await api.addLead(leadData);
      await loadData();
      setShowAddModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add lead');
    }
  };

  const handleUpdateLead = async (id: string, leadData: Partial<Lead>) => {
    try {
      await api.updateLead(id, leadData);
      await loadData();
      setShowEditModal(false);
      setSelectedLead(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead');
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      await api.deleteLead(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete lead');
    }
  };

  const handleExportLeads = async () => {
    try {
      await api.exportLeads();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export leads');
    }
  };

  const filteredLeads = user?.role === 'superadmin' 
    ? leads 
    : leads.filter(lead => lead.assigned_to === user?.id);

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
          <Button onClick={loadData} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode(viewMode === 'kanban' ? 'table' : 'kanban')}
            variant="outline"
          >
            {viewMode === 'kanban' ? 'Table View' : 'Kanban View'}
          </Button>
          <Button onClick={handleExportLeads} variant="outline">
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            Add Lead
          </Button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <KanbanBoard
          leads={filteredLeads}
          products={products}
          packages={packages}
          users={users}
          obstacles={obstacles}
          promos={promos}
          onUpdateLead={handleUpdateLead}
          onDeleteLead={handleDeleteLead}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.nama}</div>
                        <div className="text-sm text-gray-500">{lead.nomor_wa}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {lead.product?.nama_produk || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={
                        lead.stage === 'Closing' ? 'success' :
                        lead.stage === 'Loss' ? 'error' : 'warning'
                      }>
                        {lead.stage}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.assigned_user?.nama_lengkap || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString('id-ID') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowEditModal(true);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteLead(lead.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}