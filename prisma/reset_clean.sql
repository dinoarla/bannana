-- ============================================================
-- bannana.id — Clean Reset Script
-- Drops all tables and recreates schema with ONLY the admin user.
-- Run in phpMyAdmin > SQL tab (select your database first).
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `EmailVerificationToken`;
DROP TABLE IF EXISTS `PasswordResetToken`;
DROP TABLE IF EXISTS `Notification`;
DROP TABLE IF EXISTS `UserNotifPrefs`;
DROP TABLE IF EXISTS `Subscription`;
DROP TABLE IF EXISTS `AuditLog`;
DROP TABLE IF EXISTS `ApiKey`;
DROP TABLE IF EXISTS `Session`;
DROP TABLE IF EXISTS `Analytics`;
DROP TABLE IF EXISTS `Block`;
DROP TABLE IF EXISTS `Page`;
DROP TABLE IF EXISTS `Profile`;
DROP TABLE IF EXISTS `User`;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Core schema (schema.sql)
-- ============================================================

CREATE TABLE `User` (
  `id`            VARCHAR(191)              NOT NULL,
  `email`         VARCHAR(191)              NOT NULL,
  `username`      VARCHAR(191)              NOT NULL,
  `passwordHash`  VARCHAR(191)              NOT NULL,
  `emailVerified` DATETIME(3)                   NULL,
  `role`          ENUM('USER','ADMIN')      NOT NULL DEFAULT 'USER',
  `deletedAt`     DATETIME(3)                   NULL,
  `createdAt`     DATETIME(3)              NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`     DATETIME(3)              NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key`    (`email`),
  UNIQUE KEY `User_username_key` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Profile` (
  `id`          VARCHAR(191) NOT NULL,
  `userId`      VARCHAR(191) NOT NULL,
  `displayName` VARCHAR(191) NOT NULL,
  `bio`         TEXT             NULL,
  `avatarUrl`   TEXT             NULL,
  `avatarIcon`  VARCHAR(191)     NULL,
  `tags`        JSON         NOT NULL,
  `website`     VARCHAR(500)     NULL,
  `socialLinks` JSON         NOT NULL,
  `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`   DATETIME(3)  NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Profile_userId_key` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Page` (
  `id`             VARCHAR(191) NOT NULL,
  `userId`         VARCHAR(191) NOT NULL,
  `title`          VARCHAR(191) NOT NULL,
  `slug`           VARCHAR(191) NOT NULL,
  `theme`          VARCHAR(191) NOT NULL DEFAULT 'classic',
  `isPublished`    TINYINT(1)   NOT NULL DEFAULT 0,
  `customCss`      TEXT             NULL,
  `viewCount`      INT          NOT NULL DEFAULT 0,
  `uniqueVisitors` INT          NOT NULL DEFAULT 0,
  `createdAt`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`      DATETIME(3)  NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Page_slug_key`                (`slug`),
  INDEX         `Page_userId_idx`           (`userId`),
  INDEX         `Page_slug_isPublished_idx` (`slug`, `isPublished`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Block` (
  `id`         VARCHAR(191)                                                    NOT NULL,
  `pageId`     VARCHAR(191)                                                    NOT NULL,
  `type`       ENUM('LINK','HEADER','SOCIAL','EMBED','IMAGE','DIVIDER')        NOT NULL,
  `title`      VARCHAR(191)                                                        NULL,
  `url`        TEXT                                                                NULL,
  `position`   INT                                                             NOT NULL,
  `isEnabled`  TINYINT(1)                                                      NOT NULL DEFAULT 1,
  `config`     JSON                                                            NOT NULL,
  `clickCount` INT                                                             NOT NULL DEFAULT 0,
  `createdAt`  DATETIME(3)                                                     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`  DATETIME(3)                                                     NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Block_pageId_position_idx`  (`pageId`, `position`),
  INDEX `Block_pageId_isEnabled_idx` (`pageId`, `isEnabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Analytics` (
  `id`        VARCHAR(191) NOT NULL,
  `pageId`    VARCHAR(191) NOT NULL,
  `blockId`   VARCHAR(191)     NULL,
  `event`     VARCHAR(191) NOT NULL,
  `referrer`  TEXT             NULL,
  `userAgent` TEXT             NULL,
  `country`   VARCHAR(191)     NULL,
  `device`    VARCHAR(191)     NULL,
  `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Analytics_pageId_createdAt_idx`  (`pageId`,  `createdAt`),
  INDEX `Analytics_blockId_createdAt_idx` (`blockId`, `createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Session` (
  `id`        VARCHAR(191) NOT NULL,
  `userId`    VARCHAR(191) NOT NULL,
  `tokenHash` VARCHAR(191) NOT NULL,
  `csrfToken` VARCHAR(191) NOT NULL,
  `expiresAt` DATETIME(3)  NOT NULL,
  `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Session_tokenHash_key` (`tokenHash`),
  INDEX       `Session_userId_idx`   (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ApiKey` (
  `id`         VARCHAR(191) NOT NULL,
  `userId`     VARCHAR(191) NOT NULL,
  `name`       VARCHAR(191) NOT NULL,
  `keyHash`    VARCHAR(191) NOT NULL,
  `scopes`     JSON         NOT NULL,
  `lastUsedAt` DATETIME(3)      NULL,
  `createdAt`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `revokedAt`  DATETIME(3)      NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ApiKey_keyHash_key` (`keyHash`),
  INDEX       `ApiKey_userId_idx` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `AuditLog` (
  `id`        VARCHAR(191) NOT NULL,
  `userId`    VARCHAR(191) NOT NULL,
  `action`    VARCHAR(191) NOT NULL,
  `metadata`  JSON         NOT NULL,
  `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `AuditLog_userId_idx` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Migration v2 tables (migration_v2.sql)
-- ============================================================

CREATE TABLE `UserNotifPrefs` (
  `id`             VARCHAR(36) NOT NULL,
  `userId`         VARCHAR(36) NOT NULL,
  `emailWeekly`    TINYINT(1)  NOT NULL DEFAULT 1,
  `alertHighClick` TINYINT(1)  NOT NULL DEFAULT 1,
  `productUpdates` TINYINT(1)  NOT NULL DEFAULT 0,
  `tipsTutorial`   TINYINT(1)  NOT NULL DEFAULT 1,
  `createdAt`      DATETIME    NOT NULL,
  `updatedAt`      DATETIME    NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Subscription` (
  `id`                   VARCHAR(36)  NOT NULL,
  `userId`               VARCHAR(36)  NOT NULL,
  `plan`                 VARCHAR(20)  NOT NULL DEFAULT 'free',
  `billingCycle`         VARCHAR(10)  NOT NULL DEFAULT 'monthly',
  `status`               VARCHAR(20)  NOT NULL DEFAULT 'active',
  `midtransOrderId`      VARCHAR(100)     NULL,
  `midtransPaymentType`  VARCHAR(50)      NULL,
  `currentPeriodStart`   DATETIME         NULL,
  `currentPeriodEnd`     DATETIME         NULL,
  `cancelledAt`          DATETIME         NULL,
  `createdAt`            DATETIME     NOT NULL,
  `updatedAt`            DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Runtime-created tables (created on first use by the app)
-- ============================================================

CREATE TABLE `EmailVerificationToken` (
  `id`        VARCHAR(36)  PRIMARY KEY,
  `userId`    VARCHAR(36)  NOT NULL,
  `tokenHash` VARCHAR(64)  NOT NULL UNIQUE,
  `expiresAt` DATETIME     NOT NULL,
  `usedAt`    DATETIME         NULL,
  `createdAt` DATETIME     NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `PasswordResetToken` (
  `id`        VARCHAR(36)  NOT NULL,
  `userId`    VARCHAR(36)  NOT NULL,
  `tokenHash` VARCHAR(64)  NOT NULL,
  `expiresAt` DATETIME     NOT NULL,
  `usedAt`    DATETIME         NULL,
  `createdAt` DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_token` (`tokenHash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Notification` (
  `id`        VARCHAR(36)  PRIMARY KEY,
  `userId`    VARCHAR(36)  NOT NULL,
  `type`      VARCHAR(50)  NOT NULL DEFAULT 'system',
  `title`     VARCHAR(255) NOT NULL,
  `body`      TEXT             NULL,
  `href`      VARCHAR(500)     NULL,
  `readAt`    DATETIME         NULL,
  `createdAt` DATETIME     NOT NULL,
  INDEX `idx_notif_user`    (`userId`),
  INDEX `idx_notif_created` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Admin user only — password: Bannana@2025
-- ============================================================

INSERT INTO `User` (`id`, `email`, `username`, `passwordHash`, `emailVerified`, `role`, `deletedAt`, `createdAt`, `updatedAt`)
VALUES (
  'uid_admin',
  'admin@bannana.id',
  'admin_bannana',
  '$2a$12$PCrlM4qHC0HnzNUJX39bzOZwSw2zXnEmJeCXDMCCp6NdYXDf0kgze',
  NOW(),
  'ADMIN',
  NULL,
  NOW(),
  NOW()
);

INSERT INTO `Profile` (`id`, `userId`, `displayName`, `bio`, `avatarUrl`, `avatarIcon`, `tags`, `website`, `socialLinks`, `createdAt`, `updatedAt`)
VALUES (
  'pro_admin',
  'uid_admin',
  'bannana Admin',
  NULL,
  NULL,
  NULL,
  '["Admin"]',
  NULL,
  '[]',
  NOW(),
  NOW()
);
