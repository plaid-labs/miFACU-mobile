import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Tus claves reales (Ya configuradas)
const supabaseUrl = 'https://lyyljkrkyiqjxuwsnzhx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eWxqa3JreWlxanh1d3Nuemh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NjUyMzEsImV4cCI6MjA4MzI0MTIzMX0.FZAsAc-GDT7hipQyGPYfRyEH-hHs4w1RqmtcALOCZY4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});