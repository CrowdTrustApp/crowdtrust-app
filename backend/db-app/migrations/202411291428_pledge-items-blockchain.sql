ALTER TABLE
    pledge_items
ADD COLUMN blockchain_status TEXT NOT NULL,
ADD COLUMN transaction_hash TEXT;
