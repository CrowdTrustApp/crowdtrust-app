ALTER TABLE
    projects
ADD
    COLUMN assets_order TEXT[] DEFAULT ARRAY[]::text[] NOT NULL;
