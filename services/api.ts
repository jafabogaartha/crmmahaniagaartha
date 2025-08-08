import { supabase, handleSupabaseError } from '../lib/supabase';
import { Role, User, Product, Package, Lead, LeadStage, FinalStatus, FollowUpStatus, HandleCustomerData, RevenueTarget, PaymentMethod, Note, Obstacle, Promo, ShippingStatus } from '../types';

// Helper function to transform database rows to application types
const transformLead = (leadRow: any, notes: Note[] = []): Lead => ({
  id: leadRow.id,
  waktu: leadRow.waktu,
  nama: leadRow.nama,
  nomor_wa: leadRow.nomor_wa,
  sumber_lead: leadRow.sumber_lead,
  product_id: leadRow.product_id || '',
  paket_id: leadRow.paket_id || '',
  harga: leadRow.harga || 0,
  assigned_to: leadRow.assigned_to || '',
  stage: leadRow.stage as LeadStage,
  tanggal_closing: leadRow.tanggal_closing || '',
  metode_bayar: leadRow.metode_bayar as PaymentMethod,
  nominal_dp: leadRow.nominal_dp || 0,
  status: leadRow.status as FinalStatus,
  next_follow_up: leadRow.next_follow_up || '',
  inquiry_text: leadRow.inquiry_text || '',
  follow_up_status: leadRow.follow_up_status as FollowUpStatus,
  next_contact_date: leadRow.next_contact_date || '',
  obstacle_id: leadRow.obstacle_id || '',
  promo_id: leadRow.promo_id || '',
  shipping_status: leadRow.shipping_status as ShippingStatus,
  notes: notes
});

const transformUser = (userRow: any): User => ({
  id: userRow.id,
  username: userRow.username,
  nama_lengkap: userRow.nama_lengkap,
  role: userRow.role as Role,
  nomor_wa: userRow.nomor_wa,
  aktif: userRow.aktif,
  avatar: userRow.avatar
});

const transformHandleCustomerData = (hcRow: any, leadData: any): HandleCustomerData => ({
  ...transformLead(leadData),
  lead_id: hcRow.lead_id,
  status_fu: hcRow.status_fu as FollowUpStatus,
  tanggal_fu_terakhir: hcRow.tanggal_fu_terakhir || ''
});

export const api = {
  // Authentication
  login: async (username: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows returned
        handleSupabaseError(error, 'login');
      }

      return data ? transformUser(data) : null;
    } catch (error) {
      handleSupabaseError(error, 'login');
      return null;
    }
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('nama_lengkap');

      if (error) handleSupabaseError(error, 'getUsers');
      return data?.map(transformUser) || [];
    } catch (error) {
      handleSupabaseError(error, 'getUsers');
      return [];
    }
  },

  updateUserStatus: async (userId: string, aktif: boolean): Promise<User> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ aktif, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) handleSupabaseError(error, 'updateUserStatus');
      
      if (!data) {
        throw new Error('User not found or update failed');
      }
      
      return transformUser(data);
    } catch (error) {
      handleSupabaseError(error, 'updateUserStatus');
      throw error;
    }
  },

  getAdmins: async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', Role.ADMIN)
        .order('nama_lengkap');

      if (error) handleSupabaseError(error, 'getAdmins');
      return data?.map(transformUser) || [];
    } catch (error) {
      handleSupabaseError(error, 'getAdmins');
      return [];
    }
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('nama_produk');

      if (error) handleSupabaseError(error, 'getProducts');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'getProducts');
      return [];
    }
  },

  updateProduct: async (updatedProduct: Product): Promise<Product> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ 
          nama_produk: updatedProduct.nama_produk,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedProduct.id)
        .select()
        .single();

      if (error) handleSupabaseError(error, 'updateProduct');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'updateProduct');
      throw error;
    }
  },

  addProduct: async (newProductData: { nama_produk: string }): Promise<Product> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{ nama_produk: newProductData.nama_produk }])
        .select()
        .single();

      if (error) handleSupabaseError(error, 'addProduct');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'addProduct');
      throw error;
    }
  },

  // Packages
  getPackages: async (): Promise<Package[]> => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('nama_paket');

      if (error) handleSupabaseError(error, 'getPackages');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'getPackages');
      return [];
    }
  },

  getPackagesByProductId: async (productId: string): Promise<Package[]> => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('product_id', productId)
        .order('nama_paket');

      if (error) handleSupabaseError(error, 'getPackagesByProductId');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'getPackagesByProductId');
      return [];
    }
  },

  updatePackage: async (updatedPackage: Package): Promise<Package> => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update({ 
          nama_paket: updatedPackage.nama_paket,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedPackage.id)
        .select()
        .single();

      if (error) handleSupabaseError(error, 'updatePackage');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'updatePackage');
      throw error;
    }
  },

  addPackage: async (newPackageData: { product_id: string; nama_paket: string }): Promise<Package> => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert([newPackageData])
        .select()
        .single();

      if (error) handleSupabaseError(error, 'addPackage');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'addPackage');
      throw error;
    }
  },

  // Obstacles
  getObstacles: async (): Promise<Obstacle[]> => {
    try {
      const { data, error } = await supabase
        .from('obstacles')
        .select('*')
        .order('nama_hambatan');

      if (error) handleSupabaseError(error, 'getObstacles');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'getObstacles');
      return [];
    }
  },

  addObstacle: async (newObstacleData: { nama_hambatan: string }): Promise<Obstacle> => {
    try {
      const { data, error } = await supabase
        .from('obstacles')
        .insert([newObstacleData])
        .select()
        .single();

      if (error) handleSupabaseError(error, 'addObstacle');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'addObstacle');
      throw error;
    }
  },

  // Promos
  getPromos: async (): Promise<Promo[]> => {
    try {
      const { data, error } = await supabase
        .from('promos')
        .select('*')
        .order('nama_promo');

      if (error) handleSupabaseError(error, 'getPromos');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'getPromos');
      return [];
    }
  },

  addPromo: async (newPromoData: { nama_promo: string; deskripsi: string }): Promise<Promo> => {
    try {
      const { data, error } = await supabase
        .from('promos')
        .insert([newPromoData])
        .select()
        .single();

      if (error) handleSupabaseError(error, 'addPromo');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'addPromo');
      throw error;
    }
  },

  // Leads
  getLeads: async (): Promise<Lead[]> => {
    try {
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('waktu', { ascending: false });

      if (leadsError) handleSupabaseError(leadsError, 'getLeads');

      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .order('created_at');

      if (notesError) handleSupabaseError(notesError, 'getLeads - notes');

      // Group notes by lead_id
      const notesByLeadId = (notesData || []).reduce((acc, note) => {
        if (!acc[note.lead_id]) acc[note.lead_id] = [];
        acc[note.lead_id].push({
          id: note.id,
          text: note.text,
          authorId: note.author_id || 'system',
          authorName: note.author_name,
          timestamp: note.created_at
        });
        return acc;
      }, {} as Record<string, Note[]>);

      return (leadsData || []).map(lead => 
        transformLead(lead, notesByLeadId[lead.id] || [])
      );
    } catch (error) {
      handleSupabaseError(error, 'getLeads');
      return [];
    }
  },

  getLeadsByAdminId: async (adminId: string): Promise<Lead[]> => {
    try {
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('assigned_to', adminId)
        .order('waktu', { ascending: false });

      if (leadsError) handleSupabaseError(leadsError, 'getLeadsByAdminId');

      const leadIds = (leadsData || []).map(lead => lead.id);
      
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .in('lead_id', leadIds)
        .order('created_at');

      if (notesError) handleSupabaseError(notesError, 'getLeadsByAdminId - notes');

      // Group notes by lead_id
      const notesByLeadId = (notesData || []).reduce((acc, note) => {
        if (!acc[note.lead_id]) acc[note.lead_id] = [];
        acc[note.lead_id].push({
          id: note.id,
          text: note.text,
          authorId: note.author_id || 'system',
          authorName: note.author_name,
          timestamp: note.created_at
        });
        return acc;
      }, {} as Record<string, Note[]>);

      return (leadsData || []).map(lead => 
        transformLead(lead, notesByLeadId[lead.id] || [])
      );
    } catch (error) {
      handleSupabaseError(error, 'getLeadsByAdminId');
      return [];
    }
  },

  updateLead: async (updatedLeadData: Lead): Promise<Lead> => {
    try {
      // Update lead
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .update({
          nama: updatedLeadData.nama,
          nomor_wa: updatedLeadData.nomor_wa,
          sumber_lead: updatedLeadData.sumber_lead,
          product_id: updatedLeadData.product_id || null,
          paket_id: updatedLeadData.paket_id || null,
          harga: updatedLeadData.harga || 0,
          stage: updatedLeadData.stage,
          tanggal_closing: updatedLeadData.tanggal_closing || null,
          metode_bayar: updatedLeadData.metode_bayar || null,
          nominal_dp: updatedLeadData.nominal_dp || 0,
          status: updatedLeadData.status,
          next_follow_up: updatedLeadData.next_follow_up || null,
          inquiry_text: updatedLeadData.inquiry_text || '',
          follow_up_status: updatedLeadData.follow_up_status,
          next_contact_date: updatedLeadData.next_contact_date || null,
          obstacle_id: updatedLeadData.obstacle_id || null,
          promo_id: updatedLeadData.promo_id || null,
          shipping_status: updatedLeadData.shipping_status,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedLeadData.id)
        .select()
        .single();

      if (leadError) handleSupabaseError(leadError, 'updateLead');

      // Get existing notes
      const { data: existingNotes, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('lead_id', updatedLeadData.id)
        .order('created_at');

      if (notesError) handleSupabaseError(notesError, 'updateLead - get notes');

      // Find new notes to insert
      const existingNoteIds = new Set((existingNotes || []).map(n => n.id));
      const newNotes = updatedLeadData.notes.filter(note => !existingNoteIds.has(note.id));

      // Insert new notes
      if (newNotes.length > 0) {
        const { error: insertNotesError } = await supabase
          .from('notes')
          .insert(newNotes.map(note => ({
            id: note.id,
            lead_id: updatedLeadData.id,
            text: note.text,
            author_id: note.authorId === 'system' ? null : note.authorId,
            author_name: note.authorName
          })));

        if (insertNotesError) handleSupabaseError(insertNotesError, 'updateLead - insert notes');
      }

      // Get all notes for the response
      const { data: allNotes, error: allNotesError } = await supabase
        .from('notes')
        .select('*')
        .eq('lead_id', updatedLeadData.id)
        .order('created_at');

      if (allNotesError) handleSupabaseError(allNotesError, 'updateLead - get all notes');

      const notes: Note[] = (allNotes || []).map(note => ({
        id: note.id,
        text: note.text,
        authorId: note.author_id || 'system',
        authorName: note.author_name,
        timestamp: note.created_at
      }));

      return transformLead(leadData, notes);
    } catch (error) {
      handleSupabaseError(error, 'updateLead');
      throw error;
    }
  },

  addLead: async (newLeadData: { nama: string; nomor_wa: string; sumber_lead: string; product_id: string; inquiry_text: string; }): Promise<{newLead: Lead, assignedAdmin: User}> => {
    try {
      // Get active admins
      const { data: activeAdmins, error: adminsError } = await supabase
        .from('users')
        .select('*')
        .eq('role', Role.ADMIN)
        .eq('aktif', true)
        .order('nama_lengkap');

      if (adminsError) handleSupabaseError(adminsError, 'addLead - get admins');
      
      if (!activeAdmins || activeAdmins.length === 0) {
        throw new Error("No active admins available for lead assignment.");
      }

      // Check for duplicate leads
      const { data: existingLeads, error: duplicateError } = await supabase
        .from('leads')
        .select('id, nama, nomor_wa')
        .ilike('nomor_wa', `%${newLeadData.nomor_wa.replace(/\D/g, '')}%`);

      if (duplicateError) handleSupabaseError(duplicateError, 'addLead - check duplicates');

      // Simple Round Robin assignment
      const { data: lastLead, error: lastLeadError } = await supabase
        .from('leads')
        .select('assigned_to')
        .not('assigned_to', 'is', null)
        .order('waktu', { ascending: false })
        .limit(1)
        .maybeSingle();

      let assignedAdmin = activeAdmins[0]; // Default to first admin

      if (!lastLeadError && lastLead && lastLead.assigned_to) {
        const lastAssignedAdminIndex = activeAdmins.findIndex(admin => admin.id === lastLead.assigned_to);
        const nextAdminIndex = (lastAssignedAdminIndex + 1) % activeAdmins.length;
        assignedAdmin = activeAdmins[nextAdminIndex];
      }

      // Insert new lead
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert([{
          nama: newLeadData.nama,
          nomor_wa: newLeadData.nomor_wa,
          sumber_lead: newLeadData.sumber_lead,
          product_id: newLeadData.product_id,
          inquiry_text: newLeadData.inquiry_text,
          assigned_to: assignedAdmin.id,
          stage: LeadStage.ON_PROGRESS,
          status: FinalStatus.BELUM_SELESAI,
          follow_up_status: FollowUpStatus.BELUM_FOLLOW_UP,
          shipping_status: ShippingStatus.PENDING,
          harga: 0
        }])
        .select()
        .single();

      if (leadError) handleSupabaseError(leadError, 'addLead - insert lead');

      // Add system note for duplicates
      if (existingLeads && existingLeads.length > 0) {
        const duplicateNote = `[SYSTEM] Potential duplicate of lead: ${existingLeads[0].nama} (ID: ${existingLeads[0].id})`;
        
        const { error: noteError } = await supabase
          .from('notes')
          .insert([{
            lead_id: leadData.id,
            text: duplicateNote,
            author_id: null,
            author_name: 'System'
          }]);

        if (noteError) handleSupabaseError(noteError, 'addLead - insert duplicate note');
      }

      const newLead = transformLead(leadData, []);
      return { newLead, assignedAdmin: transformUser(assignedAdmin) };
    } catch (error) {
      handleSupabaseError(error, 'addLead');
      throw error;
    }
  },

  // Handle Customer Data
  getHandleCustomerData: async (): Promise<HandleCustomerData[]> => {
    try {
      const { data, error } = await supabase
        .from('handle_customer_data')
        .select(`
          *,
          leads (*)
        `)
        .order('created_at', { ascending: false });

      if (error) handleSupabaseError(error, 'getHandleCustomerData');

      return (data || []).map(hc => transformHandleCustomerData(hc, hc.leads));
    } catch (error) {
      handleSupabaseError(error, 'getHandleCustomerData');
      return [];
    }
  },

  updateHandleCustomer: async (updatedHc: HandleCustomerData): Promise<HandleCustomerData> => {
    try {
      const { data, error } = await supabase
        .from('handle_customer_data')
        .update({
          status_fu: updatedHc.status_fu,
          tanggal_fu_terakhir: updatedHc.tanggal_fu_terakhir || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedHc.id)
        .select(`
          *,
          leads (*)
        `)
        .single();

      if (error) handleSupabaseError(error, 'updateHandleCustomer');
      return transformHandleCustomerData(data, data.leads);
    } catch (error) {
      handleSupabaseError(error, 'updateHandleCustomer');
      throw error;
    }
  },

  // Revenue Targets
  getRevenueTargets: async (): Promise<RevenueTarget[]> => {
    try {
      const { data, error } = await supabase
        .from('revenue_targets')
        .select('*')
        .order('user_id');

      if (error) handleSupabaseError(error, 'getRevenueTargets');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'getRevenueTargets');
      return [];
    }
  },

  updateRevenueTarget: async (updatedTarget: RevenueTarget): Promise<RevenueTarget> => {
    try {
      const { data, error } = await supabase
        .from('revenue_targets')
        .update({
          target_omzet_harian: updatedTarget.target_omzet_harian,
          target_omzet_bulanan: updatedTarget.target_omzet_bulanan,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', updatedTarget.user_id)
        .select()
        .single();

      if (error) handleSupabaseError(error, 'updateRevenueTarget');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'updateRevenueTarget');
      throw error;
    }
  },

  // Export data
  exportLeads: async (filters?: { startDate?: string; endDate?: string; productId?: string; adminId?: string }): Promise<Lead[]> => {
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('waktu', { ascending: false });

      if (filters?.startDate) {
        query = query.gte('waktu', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('waktu', filters.endDate);
      }
      if (filters?.productId) {
        query = query.eq('product_id', filters.productId);
      }
      if (filters?.adminId) {
        query = query.eq('assigned_to', filters.adminId);
      }

      const { data: leadsData, error: leadsError } = await query;
      if (leadsError) handleSupabaseError(leadsError, 'exportLeads');

      const leadIds = (leadsData || []).map(lead => lead.id);
      
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .in('lead_id', leadIds)
        .order('created_at');

      if (notesError) handleSupabaseError(notesError, 'exportLeads - notes');

      // Group notes by lead_id
      const notesByLeadId = (notesData || []).reduce((acc, note) => {
        if (!acc[note.lead_id]) acc[note.lead_id] = [];
        acc[note.lead_id].push({
          id: note.id,
          text: note.text,
          authorId: note.author_id || 'system',
          authorName: note.author_name,
          timestamp: note.created_at
        });
        return acc;
      }, {} as Record<string, Note[]>);

      return (leadsData || []).map(lead => 
        transformLead(lead, notesByLeadId[lead.id] || [])
      );
    } catch (error) {
      handleSupabaseError(error, 'exportLeads');
      return [];
    }
  }
};