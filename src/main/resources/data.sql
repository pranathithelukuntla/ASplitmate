-- Insert default categories if not present (idempotent for restarts)
INSERT INTO categories (name) VALUES ('Food') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Travel') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Rent') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Shopping') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Utilities') ON CONFLICT (name) DO NOTHING;
