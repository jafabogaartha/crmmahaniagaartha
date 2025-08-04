
import { Role, User, Product, Package, Lead, LeadStage, FinalStatus, FollowUpStatus, HandleCustomerData, Target, PaymentMethod, Note } from '../types';

// --- MOCK DATABASE ---

let users: User[] = [
  { id: 'u1', username: 'angger', nama_lengkap: 'Angger', role: Role.SUPER_ADMIN, nomor_wa: '6281234567890', aktif: true, avatar: 'https://i.pravatar.cc/150?u=angger' },
  { id: 'u2', username: 'berliana', nama_lengkap: 'Berliana', role: Role.ADMIN, nomor_wa: '6285155145788', aktif: true, avatar: 'https://i.pravatar.cc/150?u=berliana' },
  { id: 'u3', username: 'livia', nama_lengkap: 'Livia', role: Role.ADMIN, nomor_wa: '6285117505788', aktif: true, avatar: 'https://i.pravatar.cc/150?u=livia' },
  { id: 'u4', username: 'reka', nama_lengkap: 'Reka', role: Role.ADMIN, nomor_wa: '6282324159922', aktif: false, avatar: 'https://i.pravatar.cc/150?u=reka' },
  { id: 'u5', username: 'selly', nama_lengkap: 'Selly', role: Role.HANDLE_CUSTOMER, nomor_wa: '6289876543210', aktif: true, avatar: 'https://i.pravatar.cc/150?u=selly' },
];

let products: Product[] = [
  { id: 'p1', nama_produk: 'youneedmie' },
  { id: 'p2', nama_produk: 'kopiibukota' },
];

let packages: Package[] = [
  { id: 'pkg1', product_id: 'p1', nama_paket: 'Paket Super Hemat', harga_default: 50000 },
  { id: 'pkg2', product_id: 'p1', nama_paket: 'Paket Hemat', harga_default: 75000 },
  { id: 'pkg3', product_id: 'p1', nama_paket: 'Paket Portable', harga_default: 125000 },
  { id: 'pkg4', product_id: 'p1', nama_paket: 'Paket Koper', harga_default: 250000 },
  { id: 'pkg5', product_id: 'p2', nama_paket: 'Kopi Susu Literan', harga_default: 80000 },
  { id: 'pkg6', product_id: 'p2', nama_paket: 'Paket Meeting', harga_default: 200000 },
];

let leads: Lead[] = [
  { id: 'l1', waktu: '2024-07-28T10:00:00Z', nama: 'Budi Santoso', nomor_wa: '62811111111', sumber_lead: 'Instagram', product_id: 'p1', paket_id: 'pkg1', harga: 50000, assigned_to: 'u2', stage: LeadStage.CLOSING, tanggal_closing: '2024-07-29', metode_bayar: PaymentMethod.FULL_TRANSFER, status: FinalStatus.SELESAI, notes: [], next_follow_up: '', inquiry_text: 'Saya mau tanya-tanya dulu soal paket ini.' },
  { id: 'l2', waktu: '2024-07-28T11:00:00Z', nama: 'Citra Lestari', nomor_wa: '62822222222', sumber_lead: 'TikTok', product_id: 'p1', paket_id: 'pkg3', harga: 125000, assigned_to: 'u3', stage: LeadStage.ON_PROGRESS, status: FinalStatus.BELUM_SELESAI, notes: [{id: 'n1', text: 'Minta dihubungi lagi besok jam 2 siang.', authorId: 'u3', authorName: 'Livia', timestamp: '2024-07-28T11:05:00Z'}], next_follow_up: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate() + 1).padStart(2, '0')}T14:00`, inquiry_text: 'Apakah bisa custom isinya?' },
  { id: 'l3', waktu: '2024-07-28T12:30:00Z', nama: 'Doni Firmansyah', nomor_wa: '62833333333', sumber_lead: 'Facebook', product_id: 'p2', paket_id: 'pkg5', harga: 80000, assigned_to: 'u2', stage: LeadStage.LOSS, status: FinalStatus.BELUM_SELESAI, notes: [], next_follow_up: '', inquiry_text: 'Ada promo apa untuk kopi literan?' },
  { id: 'l4', waktu: '2024-07-29T09:00:00Z', nama: 'Eka Putri', nomor_wa: '62844444444', sumber_lead: 'Website', product_id: 'p2', paket_id: 'pkg6', harga: 200000, assigned_to: 'u3', stage: LeadStage.CLOSING, tanggal_closing: '2024-07-30', metode_bayar: PaymentMethod.DP, nominal_dp: 50000, status: FinalStatus.BELUM_SELESAI, notes: [], next_follow_up: '', inquiry_text: 'Bisa kirim hari ini?' },
  { id: 'l5', waktu: '2024-07-29T14:00:00Z', nama: 'Fajar Nugraha', nomor_wa: '62855555555', sumber_lead: 'Instagram', product_id: 'p1', paket_id: 'pkg4', harga: 250000, assigned_to: 'u2', stage: LeadStage.ON_PROGRESS, status: FinalStatus.BELUM_SELESAI, notes: [], next_follow_up: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}T09:00`, inquiry_text: 'Lokasi di mana ya?' },
  { id: 'l6', waktu: '2024-07-30T10:00:00Z', nama: 'Gita Amelia', nomor_wa: '62866666666', sumber_lead: 'TikTok', product_id: 'p1', paket_id: 'pkg2', harga: 75000, assigned_to: 'u3', stage: LeadStage.CLOSING, tanggal_closing: '2024-07-30', metode_bayar: PaymentMethod.COD, status: FinalStatus.SELESAI, notes: [], next_follow_up: '', inquiry_text: 'Saya tertarik dengan paket hemat.' },
];

let handleCustomerData: HandleCustomerData[] = leads
  .filter(l => l.stage === LeadStage.CLOSING && l.status === FinalStatus.SELESAI)
  .map(l => ({
    ...l,
    lead_id: l.id,
    status_fu: FollowUpStatus.BELUM,
  }));

let targets: Target[] = [
    { user_id: 'u2', target_harian: 2, target_bulanan: 20 },
    { user_id: 'u3', target_harian: 2, target_bulanan: 25 },
    { user_id: 'u4', target_harian: 1, target_bulanan: 15 },
];


// --- MOCK API FUNCTIONS ---

const mockApiCall = <T,>(data: T, delay = 500): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));

export const api = {
  login: async (username: string): Promise<User | null> => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    return mockApiCall(user || null, 300);
  },

  getUsers: async (): Promise<User[]> => mockApiCall(users),
  
  updateUserStatus: async (userId: string, aktif: boolean): Promise<User> => {
      let updatedUser: User | undefined;
      users = users.map(u => {
          if (u.id === userId) {
              updatedUser = { ...u, aktif };
              return updatedUser;
          }
          return u;
      });
      if (!updatedUser) throw new Error("User not found");
      return mockApiCall(updatedUser);
  },
  
  getAdmins: async (): Promise<User[]> => mockApiCall(users.filter(u => u.role === Role.ADMIN)),

  getProducts: async (): Promise<Product[]> => mockApiCall(products),

  getPackages: async (): Promise<Package[]> => mockApiCall(packages),
  
  getPackagesByProductId: async (productId: string): Promise<Package[]> => mockApiCall(packages.filter(p => p.product_id === productId)),

  getLeads: async (): Promise<Lead[]> => mockApiCall(leads),
  
  getLeadsByAdminId: async (adminId: string): Promise<Lead[]> => mockApiCall(leads.filter(l => l.assigned_to === adminId)),

  getHandleCustomerData: async (): Promise<HandleCustomerData[]> => mockApiCall(handleCustomerData),

  updateLead: async (updatedLeadData: Lead): Promise<Lead> => {
    const leadIndex = leads.findIndex(l => l.id === updatedLeadData.id);
    if (leadIndex === -1) throw new Error("Lead not found");
    
    // Preserve existing notes and add new ones if any
    const existingLead = leads[leadIndex];
    const newNotes = updatedLeadData.notes.filter(n => !existingLead.notes.some(en => en.id === n.id));

    const updatedLead = {
        ...existingLead,
        ...updatedLeadData,
        notes: [...existingLead.notes, ...newNotes]
    };
    
    leads[leadIndex] = updatedLead;

    // Sync with handleCustomerData
    if (updatedLead.stage === LeadStage.CLOSING && updatedLead.status === FinalStatus.SELESAI) {
      if (!handleCustomerData.some(hc => hc.lead_id === updatedLead.id)) {
        handleCustomerData.push({ ...updatedLead, lead_id: updatedLead.id, status_fu: FollowUpStatus.BELUM });
      }
    }
    return mockApiCall(updatedLead);
  },
  
  updateHandleCustomer: async (updatedHc: HandleCustomerData): Promise<HandleCustomerData> => {
    handleCustomerData = handleCustomerData.map(hc => hc.id === updatedHc.id ? updatedHc : hc);
    return mockApiCall(updatedHc);
  },
  
  getTargets: async (): Promise<Target[]> => mockApiCall(targets),

  updateTarget: async (updatedTarget: Target): Promise<Target> => {
    targets = targets.map(t => t.user_id === updatedTarget.user_id ? updatedTarget : t);
    return mockApiCall(updatedTarget);
  },

  updateProduct: async (updatedProduct: Product): Promise<Product> => {
    products = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    return mockApiCall(updatedProduct);
  },
  
  updatePackage: async (updatedPackage: Package): Promise<Package> => {
    packages = packages.map(p => p.id === updatedPackage.id ? updatedPackage : p);
    return mockApiCall(updatedPackage);
  },

  addProduct: async (newProductData: { nama_produk: string }): Promise<Product> => {
    const newProduct: Product = {
        id: `p${Date.now()}`,
        nama_produk: newProductData.nama_produk,
    };
    products.push(newProduct);
    return mockApiCall(newProduct);
  },

  addPackage: async (newPackageData: { product_id: string; nama_paket: string; harga_default: number }): Promise<Package> => {
      const newPackage: Package = {
          id: `pkg${Date.now()}`,
          ...newPackageData
      };
      packages.push(newPackage);
      return mockApiCall(newPackage);
  },

  addLead: async (newLeadData: { nama: string; nomor_wa: string; sumber_lead: string; product_id: string; inquiry_text: string; }): Promise<{newLead: Lead, assignedAdmin: User}> => {
    const activeAdmins = users.filter(u => u.role === Role.ADMIN && u.aktif);
    if(activeAdmins.length === 0) {
        throw new Error("No active admins available for lead assignment.");
    }

    // Duplicate detection
    const existingLead = leads.find(l => l.nomor_wa.replace(/\D/g, '') === newLeadData.nomor_wa.replace(/\D/g, ''));
    const systemNotes: Note[] = [];
    if (existingLead) {
        const duplicateNote: Note = {
            id: `n_sys_${Date.now()}`,
            text: `[SYSTEM] Potential duplicate of lead: ${existingLead.nama} (ID: ${existingLead.id})`,
            authorId: 'system',
            authorName: 'System',
            timestamp: new Date().toISOString()
        };
        systemNotes.push(duplicateNote);
    }

    // Simple Round Robin
    const lastAssignedLead = [...leads].reverse().find(lead => activeAdmins.some(a => a.id === lead.assigned_to));
    const lastAssignedAdminId = lastAssignedLead?.assigned_to;
    const lastAssignedAdminIndex = activeAdmins.findIndex(admin => admin.id === lastAssignedAdminId);

    const nextAdminIndex = (lastAssignedAdminIndex + 1) % activeAdmins.length;
    const assignedAdmin = activeAdmins[nextAdminIndex];
      
    const newLead: Lead = {
        id: `l${Date.now()}`,
        waktu: new Date().toISOString(),
        stage: LeadStage.ON_PROGRESS,
        status: FinalStatus.BELUM_SELESAI,
        assigned_to: assignedAdmin.id,
        notes: systemNotes,
        paket_id: '',
        harga: 0,
        ...newLeadData,
    };
    leads.push(newLead);
    return mockApiCall({ newLead, assignedAdmin });
  }
};
