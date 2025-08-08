
import React, { useEffect, useState, useMemo } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { AnalyticsChart } from '../components/dashboard/AnalyticsChart';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { Lead, LeadStage, AdminPerformance, Product, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { CurrencyDollarIcon, ChartBarIcon, ClipboardDocumentListIcon, UserGroupIcon, ClockIcon, SparklesIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import { Card } from '../components/ui/Card';

const iconClass = 'h-6 w-6 text-white';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [performance, setPerformance] = useState<AdminPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [filters, setFilters] = useState({ startDate: '', endDate: '', productId: '', adminId: '' });
  const [admins, setAdmins] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [allLeads, adminUsers, allProducts, revenueTargets] = await Promise.all([
          api.getLeads(),
          api.getAdmins(),
          api.getProducts(),
          api.getRevenueTargets(),
        ]);
        setLeads(allLeads);
        setAdmins(adminUsers);
        setProducts(allProducts);
        
        const performanceData = adminUsers.map(admin => {
            const adminLeads = allLeads.filter(l => l.assigned_to === admin.id);
            const adminClosing = adminLeads.filter(l => l.stage === LeadStage.CLOSING);
            const adminRevenueTarget = revenueTargets.find(t => t.user_id === admin.id) || { target_omzet_harian: 0, target_omzet_bulanan: 0 };
            const adminRevenue = adminClosing.reduce((sum, lead) => sum + (lead.harga || 0), 0);
            const todayRevenue = adminClosing.filter(l => new Date(l.tanggal_closing || 0).toDateString() === new Date().toDateString()).reduce((sum, lead) => sum + (lead.harga || 0), 0);
            return {
                adminId: admin.id,
                adminName: admin.nama_lengkap,
                totalLeads: adminLeads.length,
                totalClosing: adminClosing.length,
                closingRate: adminLeads.length > 0 ? (adminClosing.length / adminLeads.length) * 100 : 0,
                targetOmzetHarian: adminRevenueTarget.target_omzet_harian,
                pencapaianOmzetHarian: todayRevenue,
                targetOmzetBulanan: adminRevenueTarget.target_omzet_bulanan,
                pencapaianOmzetBulanan: adminRevenue,
            }
        });
        setPerformance(performanceData);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
        const leadDate = new Date(lead.waktu);
        const startDate = filters.startDate ? new Date(filters.startDate) : null;
        const endDate = filters.endDate ? new Date(filters.endDate) : null;
        if(startDate && leadDate < startDate) return false;
        if(endDate && leadDate > endDate) return false;
        if(filters.productId && lead.product_id !== filters.productId) return false;
        if(filters.adminId && lead.assigned_to !== filters.adminId) return false;
        return true;
    })
  }, [leads, filters]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({...prev, [e.target.name]: e.target.value}));
  }
  
  const handleExport = async () => {
    setExporting(true);
    try {
      const exportData = await api.exportLeads(filters);
      
      // Convert to CSV
      const headers = ['Timestamp', 'Name', 'WhatsApp', 'Source', 'Product', 'Package', 'Stage', 'Status', 'Price', 'Follow Up Status', 'Next Contact', 'Inquiry'];
      const csvContent = [
        headers.join(','),
        ...exportData.map(lead => [
          new Date(lead.waktu).toLocaleString(),
          `"${lead.nama}"`,
          lead.nomor_wa,
          `"${lead.sumber_lead}"`,
          lead.product_id,
          lead.paket_id || '',
          lead.stage,
          lead.status,
          lead.harga || 0,
          lead.follow_up_status,
          lead.next_contact_date ? new Date(lead.next_contact_date).toLocaleString() : '',
          `"${lead.inquiry_text || ''}"`
        ].join(','))
      ].join('\n');
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  const totalRevenue = filteredLeads
    .filter(l => l.stage === LeadStage.CLOSING)
    .reduce((sum, l) => sum + l.harga, 0);

  const totalLeads = filteredLeads.length;
  const totalClosing = filteredLeads.filter(l => l.stage === LeadStage.CLOSING).length;
  const conversionRate = totalLeads > 0 ? (totalClosing / totalLeads) * 100 : 0;
  
  const userPerformance = performance.find(p => p.adminId === user?.id);
  const userLeads = leads.filter(l => l.assigned_to === user?.id);
  
  const now = new Date();
  const upcomingFollowUps = userLeads.filter(l => l.next_follow_up && new Date(l.next_follow_up) > now && l.stage === LeadStage.ON_PROGRESS).sort((a,b) => new Date(a.next_follow_up!).getTime() - new Date(b.next_follow_up!).getTime());
  const overdueFollowUps = userLeads.filter(l => l.next_follow_up && new Date(l.next_follow_up) <= now && l.stage === LeadStage.ON_PROGRESS).sort((a,b) => new Date(a.next_follow_up!).getTime() - new Date(b.next_follow_up!).getTime());


  const salesByProductData = filteredLeads.reduce((acc, lead) => {
    const productName = products.find(p=>p.id === lead.product_id)?.nama_produk || 'Unknown';
    if (!acc[productName]) {
      acc[productName] = { name: productName, leads: 0, closing: 0 };
    }
    acc[productName].leads += 1;
    if (lead.stage === LeadStage.CLOSING) {
      acc[productName].closing += 1;
    }
    return acc;
  }, {} as { [key: string]: { name: string, leads: number, closing: number } });
  
  const salesBySourceData = filteredLeads.reduce((acc, lead) => {
    const sourceName = lead.sumber_lead;
    if (!acc[sourceName]) {
      acc[sourceName] = { name: sourceName, leads: 0, closing: 0 };
    }
    acc[sourceName].leads += 1;
    if (lead.stage === LeadStage.CLOSING) {
      acc[sourceName].closing += 1;
    }
    return acc;
  }, {} as { [key: string]: { name: string, leads: number, closing: number } });

  const dailyClosingData = filteredLeads.filter(l => l.stage === LeadStage.CLOSING && l.tanggal_closing).reduce((acc, lead) => {
      const date = new Date(lead.tanggal_closing!).toLocaleDateString('en-CA'); // YYYY-MM-DD
      if(!acc[date]){
          acc[date] = { date, closing: 0 }
      }
      acc[date].closing += 1;
      return acc;
  }, {} as {[key: string]: {date: string, closing: number}});


  return (
    <div className="space-y-6">
      {user?.role === 'superadmin' && (
        <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full p-2 border-2 rounded dark:bg-dark-card border-neutral dark:border-dark-content/50" />
                <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full p-2 border-2 rounded dark:bg-dark-card border-neutral dark:border-dark-content/50" />
                <select name="productId" value={filters.productId} onChange={handleFilterChange} className="w-full p-2 border-2 rounded dark:bg-dark-card border-neutral dark:border-dark-content/50">
                    <option value="">All Products</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.nama_produk}</option>)}
                </select>
                <select name="adminId" value={filters.adminId} onChange={handleFilterChange} className="w-full p-2 border-2 rounded dark:bg-dark-card border-neutral dark:border-dark-content/50">
                    <option value="">All Admins</option>
                    {admins.map(a => <option key={a.id} value={a.id}>{a.nama_lengkap}</option>)}
                </select>
                <Button onClick={handleExport} disabled={exporting} className="flex items-center justify-center">
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    {exporting ? 'Exporting...' : 'Export'}
                </Button>
            </div>
        </Card>
      )}

      {user?.role === 'admin' && (overdueFollowUps.length > 0 || upcomingFollowUps.length > 0) && (
        <Card>
            <h3 className="font-bold text-lg mb-2 flex items-center"><ClockIcon className="h-5 w-5 mr-2 text-primary"/>My Follow-ups</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <h4 className="font-semibold text-red-600">Overdue ({overdueFollowUps.length})</h4>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                        {overdueFollowUps.slice(0, 5).map(lead => (
                            <li key={lead.id}>{lead.nama} - <span className="text-gray-500">{new Date(lead.next_follow_up!).toLocaleString()}</span></li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-blue-600">Upcoming ({upcomingFollowUps.length})</h4>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                        {upcomingFollowUps.slice(0, 5).map(lead => (
                            <li key={lead.id}>{lead.nama} - <span className="text-gray-500">{new Date(lead.next_follow_up!).toLocaleString()}</span></li>
                        ))}
                    </ul>
                </div>
            </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user?.role === 'superadmin' && (
          <>
            <StatCard title="Total Revenue" value={`Rp ${totalRevenue.toLocaleString('id-ID')}`} icon={<CurrencyDollarIcon className={iconClass} />} colorClass="bg-green-500" />
            <StatCard title="Conversion Rate" value={`${conversionRate.toFixed(1)}%`} icon={<ChartBarIcon className={iconClass} />} colorClass="bg-blue-500" />
            <StatCard title="Total Leads" value={totalLeads.toString()} icon={<ClipboardDocumentListIcon className={iconClass} />} colorClass="bg-yellow-500" />
            <StatCard title="Total Closing" value={totalClosing.toString()} icon={<UserGroupIcon className={iconClass} />} colorClass="bg-purple-500" />
          </>
        )}
        {user?.role === 'admin' && userPerformance && (
          <>
            <StatCard title="My Leads" value={userPerformance.totalLeads.toString()} icon={<ClipboardDocumentListIcon className={iconClass} />} colorClass="bg-yellow-500"/>
            <StatCard title="My Closings" value={userPerformance.totalClosing.toString()} icon={<UserGroupIcon className={iconClass} />} colorClass="bg-purple-500" />
            <StatCard title="My Closing Rate" value={`${userPerformance.closingRate.toFixed(1)}%`} icon={<ChartBarIcon className={iconClass} />} colorClass="bg-blue-500" />
            <StatCard title="Revenue Today" value={`Rp ${userPerformance.pencapaianOmzetHarian.toLocaleString('id-ID')}`} icon={<CurrencyDollarIcon className={iconClass} />} colorClass="bg-green-500" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {user?.role === 'superadmin' &&
            <AnalyticsChart 
                title="Daily Closing" 
                data={Object.values(dailyClosingData).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
                type="line"
                xAxisKey="date"
                dataKeys={[{key: 'closing', color: '#8884d8'}]}
            />
         }
         <AnalyticsChart 
            title="Admin Performance" 
            data={performance}
            type="bar"
            xAxisKey="adminName"
            dataKeys={[{key: 'totalLeads', color: '#fb923c'}, {key: 'totalClosing', color: '#10b981'}, {key: 'pencapaianOmzetBulanan', color: '#8b5cf6'}]}
        />
        <AnalyticsChart 
            title="Sales by Product" 
            data={Object.values(salesByProductData)}
            type="bar"
            xAxisKey="name"
            dataKeys={[{key: 'leads', color: '#8884d8'}, {key: 'closing', color: '#82ca9d'}]}
        />
         {user?.role === 'superadmin' &&
            <AnalyticsChart 
                title="Lead Source Performance" 
                data={Object.values(salesBySourceData)}
                type="bar"
                xAxisKey="name"
                dataKeys={[{key: 'leads', color: '#ffc658'}, {key: 'closing', color: '#ff8042'}]}
            />
         }
      </div>
    </div>
  );
};