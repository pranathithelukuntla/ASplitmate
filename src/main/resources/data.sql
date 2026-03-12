-- Insert default categories if not present (idempotent for restarts)
INSERT IGNORE INTO categories (name) VALUES ('Food');
INSERT IGNORE INTO categories (name) VALUES ('Travel');
INSERT IGNORE INTO categories (name) VALUES ('Rent');
INSERT IGNORE INTO categories (name) VALUES ('Shopping');
INSERT IGNORE INTO categories (name) VALUES ('Utilities');
