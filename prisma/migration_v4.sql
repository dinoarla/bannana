-- Migration v4: Add per-page avatar URL
ALTER TABLE Page ADD COLUMN avatarUrl MEDIUMTEXT NULL AFTER customCss;
