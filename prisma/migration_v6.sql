-- Migration v6: Per-page Pro customization fields
ALTER TABLE Page
  ADD COLUMN displayName VARCHAR(100) NULL,
  ADD COLUMN website VARCHAR(255) NULL,
  ADD COLUMN socialLinks TEXT NULL;
