-- bannana.id — MySQL schema
-- Generated from prisma/schema.prisma
-- No FK constraints: relationMode = "prisma" (Prisma handles referential integrity in app layer)

-- NOTE: Do NOT run CREATE DATABASE here.
-- On shared hosting (Hostinger etc.), create the database via the control panel first,
-- then select it before running this file (or use phpMyAdmin and select the DB from the dropdown).

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
  UNIQUE KEY `Page_slug_key`              (`slug`),
  INDEX         `Page_userId_idx`         (`userId`),
  INDEX         `Page_slug_isPublished_idx` (`slug`, `isPublished`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Block` (
  `id`         VARCHAR(191)                                          NOT NULL,
  `pageId`     VARCHAR(191)                                          NOT NULL,
  `type`       ENUM('LINK','HEADER','SOCIAL','EMBED','IMAGE','DIVIDER') NOT NULL,
  `title`      VARCHAR(191)                                              NULL,
  `url`        TEXT                                                      NULL,
  `position`   INT                                                   NOT NULL,
  `isEnabled`  TINYINT(1)                                            NOT NULL DEFAULT 1,
  `config`     JSON                                                  NOT NULL,
  `clickCount` INT                                                   NOT NULL DEFAULT 0,
  `createdAt`  DATETIME(3)                                           NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`  DATETIME(3)                                           NOT NULL,
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
