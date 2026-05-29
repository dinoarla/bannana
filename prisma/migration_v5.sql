-- Migration v5: Add per-page bio override
ALTER TABLE Page ADD COLUMN bio TEXT NULL AFTER title;
