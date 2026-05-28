-- ============================================================
-- bannana.id — Migration v3
-- Run in phpMyAdmin > SQL tab (select your database first)
-- ============================================================

CREATE TABLE IF NOT EXISTS `Post` (
  `id`          VARCHAR(191) NOT NULL,
  `title`       VARCHAR(191) NOT NULL,
  `slug`        VARCHAR(191) NOT NULL,
  `excerpt`     TEXT             NULL,
  `content`     LONGTEXT     NOT NULL DEFAULT '',
  `coverUrl`    TEXT             NULL,
  `tags`        JSON         NOT NULL,
  `status`      VARCHAR(20)  NOT NULL DEFAULT 'draft',
  `type`        VARCHAR(20)  NOT NULL DEFAULT 'blog',
  `authorId`    VARCHAR(191) NOT NULL,
  `publishedAt` DATETIME         NULL,
  `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`   DATETIME(3)  NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Post_slug_key` (`slug`),
  INDEX `Post_status_type_idx` (`status`, `type`),
  INDEX `Post_publishedAt_idx` (`publishedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
