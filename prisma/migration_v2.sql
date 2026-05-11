-- ============================================================
-- bannana.id — Migration v2
-- Run in phpMyAdmin > SQL tab (select your database first)
-- ============================================================

-- Notification preferences per user
CREATE TABLE IF NOT EXISTS `UserNotifPrefs` (
  `id` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(36) NOT NULL,
  `emailWeekly` TINYINT(1) NOT NULL DEFAULT 1,
  `alertHighClick` TINYINT(1) NOT NULL DEFAULT 1,
  `productUpdates` TINYINT(1) NOT NULL DEFAULT 0,
  `tipsTutorial` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subscription / billing plan
CREATE TABLE IF NOT EXISTS `Subscription` (
  `id` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(36) NOT NULL,
  `plan` VARCHAR(20) NOT NULL DEFAULT 'free',
  `billingCycle` VARCHAR(10) NOT NULL DEFAULT 'monthly',
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',
  `midtransOrderId` VARCHAR(100) NULL,
  `midtransPaymentType` VARCHAR(50) NULL,
  `currentPeriodStart` DATETIME NULL,
  `currentPeriodEnd` DATETIME NULL,
  `cancelledAt` DATETIME NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
