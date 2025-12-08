-- =====================================================
-- Customer 360 Dashboard Migration
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Extend customers table with new fields
ALTER TABLE customers ADD COLUMN IF NOT EXISTS nickname TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS line_user_id TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS tier VARCHAR(20) DEFAULT 'Standard';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS address JSONB;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS referral_id UUID REFERENCES customers(id);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE customers ADD COLUMN IF NOT EXISTS tax_id TEXT;

-- 2. Customer Notes table (for Smart Notes in Zone 4)
CREATE TABLE IF NOT EXISTS customer_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;

-- Policies for customer_notes
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON customer_notes;
CREATE POLICY "Enable read access for authenticated users" ON customer_notes 
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON customer_notes;
CREATE POLICY "Enable insert access for authenticated users" ON customer_notes 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update access for authenticated users" ON customer_notes;
CREATE POLICY "Enable update access for authenticated users" ON customer_notes 
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON customer_notes;
CREATE POLICY "Enable delete access for authenticated users" ON customer_notes 
  FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Customer Products on Hand (auto-created from transactions)
CREATE TABLE IF NOT EXISTS customer_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  transaction_id UUID REFERENCES transactions(id),
  transaction_item_id UUID REFERENCES transaction_items(id),
  quantity INTEGER DEFAULT 1,
  installation_date DATE DEFAULT CURRENT_DATE,
  warranty_end_date DATE,
  next_service_date DATE,
  status VARCHAR(20) DEFAULT 'active', -- active, expired, serviced
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE customer_products ENABLE ROW LEVEL SECURITY;

-- Policies for customer_products
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON customer_products;
CREATE POLICY "Enable read access for authenticated users" ON customer_products 
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON customer_products;
CREATE POLICY "Enable insert access for authenticated users" ON customer_products 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update access for authenticated users" ON customer_products;
CREATE POLICY "Enable update access for authenticated users" ON customer_products 
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON customer_products;
CREATE POLICY "Enable delete access for authenticated users" ON customer_products 
  FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Activity Logs (Unified Timeline)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- order, chat, call, auto
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC, -- For order type
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies for activity_logs
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON activity_logs;
CREATE POLICY "Enable read access for authenticated users" ON activity_logs 
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON activity_logs;
CREATE POLICY "Enable insert access for authenticated users" ON activity_logs 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. Trigger to auto-create customer_products from transaction_items
CREATE OR REPLACE FUNCTION auto_create_customer_product()
RETURNS TRIGGER AS $$
DECLARE
  v_customer_id UUID;
  v_product products%ROWTYPE;
  v_warranty_days INTEGER;
  v_service_days INTEGER;
BEGIN
  -- Get customer_id from the transaction
  SELECT customer_id INTO v_customer_id 
  FROM transactions 
  WHERE id = NEW.transaction_id;

  -- Get product details
  SELECT * INTO v_product 
  FROM products 
  WHERE id = NEW.product_id;

  -- Calculate dates based on usage_duration_days
  v_warranty_days := COALESCE(v_product.usage_duration_days, 365);
  v_service_days := COALESCE(v_product.usage_duration_days, 30);

  -- Insert customer_product record
  INSERT INTO customer_products (
    customer_id,
    product_id,
    transaction_id,
    transaction_item_id,
    quantity,
    installation_date,
    warranty_end_date,
    next_service_date,
    status
  ) VALUES (
    v_customer_id,
    NEW.product_id,
    NEW.transaction_id,
    NEW.id,
    NEW.quantity,
    CURRENT_DATE,
    CURRENT_DATE + v_warranty_days,
    CURRENT_DATE + v_service_days,
    'active'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_transaction_item_created ON transaction_items;
CREATE TRIGGER on_transaction_item_created
  AFTER INSERT ON transaction_items
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_customer_product();

-- 6. Trigger to auto-create activity_log from transactions
CREATE OR REPLACE FUNCTION auto_create_activity_log_from_transaction()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_logs (
    customer_id,
    type,
    title,
    description,
    amount,
    metadata
  ) VALUES (
    NEW.customer_id,
    'order',
    'ซื้อสินค้า',
    'สร้างรายการซื้อใหม่',
    NEW.total_amount,
    jsonb_build_object('transaction_id', NEW.id, 'payment_method', NEW.payment_method)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_transaction_created_log ON transactions;
CREATE TRIGGER on_transaction_created_log
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_activity_log_from_transaction();
