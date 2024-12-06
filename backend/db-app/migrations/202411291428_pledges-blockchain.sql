ALTER TABLE
    pledges
ADD COLUMN blockchain_status TEXT NOT NULL DEFAULT 'None',
ADD COLUMN transaction_hash TEXT;
