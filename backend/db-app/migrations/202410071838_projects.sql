CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $body$
BEGIN
    NEW."updated_at" = now();
    RETURN NEW;
END;
$body$ LANGUAGE 'plpgsql';

CREATE TABLE projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id),
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    contract_address TEXT NOT NULL,
    payment_address TEXT NOT NULL,
    blurb TEXT NOT NULL,
    category TEXT NOT NULL,
    funding_goal NUMERIC(78, 0) NOT NULL,
    start_time BIGINT NOT NULL,
    duration BIGINT NOT NULL,
    total_pledged NUMERIC(78, 0) NOT NULL,
    backer_count INT NOT NULL DEFAULT 0,
    base_currency TEXT NOT NULL,
    rewards_order TEXT[] NOT NULL DEFAULT ARRAY[''],
    status TEXT NOT NULL,
    blockchain_status TEXT NOT NULL,
    transaction_hash TEXT,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TRIGGER projects_modified_column
BEFORE UPDATE ON projects FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TABLE rewards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    project_id uuid NOT NULL REFERENCES projects(id),
    delivery_time BIGINT,
    price NUMERIC(78, 0) NOT NULL,
    backer_limit INTEGER NOT NULL,
    backer_count INTEGER NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TRIGGER rewards_modified_column
BEFORE UPDATE ON rewards FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TABLE reward_assets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reward_id uuid REFERENCES rewards(id),
    user_id uuid NOT NULL REFERENCES users(id),
    size BIGINT NOT NULL DEFAULT 0,
    name TEXT NOT NULL,
    content_type TEXT NOT NULL,
    state TEXT NOT NULL,
    upload_expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TRIGGER reward_assets_modified_column
BEFORE UPDATE ON reward_assets FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TABLE project_assets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES projects(id),
    user_id uuid NOT NULL REFERENCES users(id),
    size BIGINT NOT NULL DEFAULT 0,
    name TEXT NOT NULL,
    content_type TEXT NOT NULL,
    state TEXT NOT NULL,
    upload_expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TRIGGER project_assets_modified_column
BEFORE UPDATE ON project_assets FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TABLE pledges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES projects(id),
    user_id uuid NOT NULL REFERENCES users(id),
    comment TEXT NOT NULL DEFAULT '',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TRIGGER pledges_modified_column
BEFORE UPDATE ON pledges FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TABLE pledge_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pledge_id uuid NOT NULL REFERENCES pledges(id),
    reward_id uuid NOT NULL REFERENCES rewards(id),
    quantity INTEGER NOT NULL,
    paid_price NUMERIC(78, 0) NOT NULL,
    paid_currency TEXT NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TRIGGER pledge_items_modified_column
BEFORE UPDATE ON pledge_items FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();
