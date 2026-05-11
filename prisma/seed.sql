-- ============================================================
-- bannana.id — Sample Seed Data
-- Paste this directly in phpMyAdmin > SQL tab
-- (select your database first from the left sidebar)
--
-- Accounts (password: Bannana@2025):
--   halo@bannana.id   → andi_kreasi  (USER)
--   admin@bannana.id  → admin_bannana (ADMIN)
--   sasa@example.com  → sasa_writes  (USER)
-- ============================================================

SET NAMES utf8mb4;

-- ── Users ─────────────────────────────────────────────────────────────────

INSERT INTO `User` (`id`,`email`,`username`,`passwordHash`,`emailVerified`,`role`,`deletedAt`,`createdAt`,`updatedAt`) VALUES
('uid_andi',  'halo@bannana.id',  'andi_kreasi',   '$2a$12$PCrlM4qHC0HnzNUJX39bzOZwSw2zXnEmJeCXDMCCp6NdYXDf0kgze', NOW(), 'USER',  NULL, NOW(), NOW()),
('uid_admin', 'admin@bannana.id', 'admin_bannana', '$2a$12$PCrlM4qHC0HnzNUJX39bzOZwSw2zXnEmJeCXDMCCp6NdYXDf0kgze', NOW(), 'ADMIN', NULL, NOW(), NOW()),
('uid_sasa',  'sasa@example.com', 'sasa_writes',   '$2a$12$PCrlM4qHC0HnzNUJX39bzOZwSw2zXnEmJeCXDMCCp6NdYXDf0kgze', NOW(), 'USER',  NULL, NOW(), NOW());

-- ── Profiles ──────────────────────────────────────────────────────────────

INSERT INTO `Profile` (`id`,`userId`,`displayName`,`bio`,`avatarUrl`,`avatarIcon`,`tags`,`socialLinks`,`createdAt`,`updatedAt`) VALUES
(
  'prof_andi', 'uid_andi', 'Andi Pratama',
  'Halo! Aku host di @designtalks, founder startup marketing, & suka bantu UMKM tampil keren online.',
  NULL, 'User',
  '["Design","Startup","Podcast","Marketing"]',
  '[{"label":"Instagram","url":"https://instagram.com/andi_kreasi","icon":"Instagram","color":"#E1306C"},{"label":"YouTube","url":"https://youtube.com/@andi_kreasi","icon":"Youtube","color":"#FF0000"},{"label":"Twitter","url":"https://twitter.com/andi_kreasi","icon":"Twitter","color":"#1DA1F2"}]',
  NOW(), NOW()
),
(
  'prof_admin', 'uid_admin', 'bannana Admin',
  'Platform admin account.',
  NULL, 'Shield',
  '["Admin"]',
  '[]',
  NOW(), NOW()
),
(
  'prof_sasa', 'uid_sasa', 'Sasa Maharani',
  'Penulis & content creator. Berbagi cerita, tips menulis, dan rekomendasi buku.',
  NULL, 'PenLine',
  '["Menulis","Buku","Content"]',
  '[{"label":"Instagram","url":"https://instagram.com/sasa_writes","icon":"Instagram","color":"#E1306C"},{"label":"TikTok","url":"https://tiktok.com/@sasa_writes","icon":"Music","color":"#010101"}]',
  NOW(), NOW()
);

-- ── Pages ─────────────────────────────────────────────────────────────────

INSERT INTO `Page` (`id`,`userId`,`title`,`slug`,`theme`,`isPublished`,`customCss`,`viewCount`,`uniqueVisitors`,`createdAt`,`updatedAt`) VALUES
('pg_andi_main', 'uid_andi', 'Link Utama',            'andi_kreasi',  'classic',    1, NULL, 12432, 847,  DATE_SUB(NOW(), INTERVAL 29 DAY), NOW()),
('pg_andi_pod',  'uid_andi', 'Podcast & Konten',       'andi-podcast', 'night',      1, NULL,  3201, 298,  DATE_SUB(NOW(), INTERVAL 14 DAY), NOW()),
('pg_andi_draf', 'uid_andi', 'Halaman Baru (Draft)',   'andi-draft',   'blueberry',  0, NULL,     0,   0,  DATE_SUB(NOW(), INTERVAL  7 DAY), NOW()),
('pg_sasa',      'uid_sasa', 'Sasa''s Corner',         'sasa-writes',  'vanilla',    1, NULL,  5890, 412,  DATE_SUB(NOW(), INTERVAL 20 DAY), NOW());

-- ── Blocks — page1 andi_kreasi (all 6 types) ──────────────────────────────

INSERT INTO `Block` (`id`,`pageId`,`type`,`title`,`url`,`position`,`isEnabled`,`config`,`clickCount`,`createdAt`,`updatedAt`) VALUES
('blk_a01', 'pg_andi_main', 'HEADER', 'Halo! Selamat datang 👋',         NULL,                                      1, 1, '{"subtitle":"Semua link favoritku ada di sini","align":"center"}', 0,    NOW(), NOW()),
('blk_a02', 'pg_andi_main', 'SOCIAL', 'Temukan aku di',                  NULL,                                      2, 1, '{"socials":[{"label":"Instagram","url":"https://instagram.com/andi_kreasi","icon":"Instagram","color":"#E1306C"},{"label":"YouTube","url":"https://youtube.com/@andi_kreasi","icon":"Youtube","color":"#FF0000"},{"label":"Twitter","url":"https://twitter.com/andi_kreasi","icon":"Twitter","color":"#1DA1F2"}]}', 0, NOW(), NOW()),
('blk_a03', 'pg_andi_main', 'LINK',   'Portfolio Terbaru 2026',          'https://andi.design/portfolio',            3, 1, '{"subtitle":"Lihat semua karya & project terbaikku","icon":"★","bg":"var(--b-100)","color":"var(--b-700)"}', 1240, NOW(), NOW()),
('blk_a04', 'pg_andi_main', 'LINK',   'YouTube Channel',                 'https://youtube.com/@andi_kreasi',         4, 1, '{"subtitle":"Tutorial desain & marketing mingguan","icon":"▶","bg":"#FEE2D5","color":"#C05621"}', 980, NOW(), NOW()),
('blk_a05', 'pg_andi_main', 'IMAGE',  'Banner Kelas Desain',             NULL,                                      5, 1, '{"imageUrl":"https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600","subtitle":"Kelas desain online batch 3 — daftar sekarang!"}', 0, NOW(), NOW()),
('blk_a06', 'pg_andi_main', 'EMBED',  'Episode Terbaru Podcast',         'https://open.spotify.com/episode/example', 6, 1, '{"subtitle":"Dengarkan episode terbaru Design Talks"}', 154, NOW(), NOW()),
('blk_a07', 'pg_andi_main', 'DIVIDER', NULL,                             NULL,                                      7, 1, '{}', 0, NOW(), NOW()),
('blk_a08', 'pg_andi_main', 'LINK',   'Hubungi Aku — Kolaborasi',        'mailto:halo@andi.design',                  8, 1, '{"subtitle":"Terbuka untuk project & partnership","icon":"✉","bg":"#E0E7FF","color":"#4338CA"}', 267, NOW(), NOW());

-- ── Blocks — page2 andi-podcast ───────────────────────────────────────────

INSERT INTO `Block` (`id`,`pageId`,`type`,`title`,`url`,`position`,`isEnabled`,`config`,`clickCount`,`createdAt`,`updatedAt`) VALUES
('blk_p01', 'pg_andi_pod', 'HEADER', 'Design Talks Podcast 🎙️', NULL,                                          1, 1, '{"subtitle":"Episode tentang desain, startup & kreativitas","align":"center"}', 0,   NOW(), NOW()),
('blk_p02', 'pg_andi_pod', 'LINK',   'Spotify',                 'https://spotify.com/show/designtalks',         2, 1, '{"subtitle":"Dengarkan di Spotify","icon":"🎵","bg":"#1DB954","color":"#ffffff"}', 430, NOW(), NOW()),
('blk_p03', 'pg_andi_pod', 'LINK',   'Apple Podcasts',          'https://podcasts.apple.com/designtalks',        3, 1, '{"subtitle":"Dengarkan di Apple Podcasts","icon":"🎙","bg":"#8B5CF6","color":"#ffffff"}', 210, NOW(), NOW()),
('blk_p04', 'pg_andi_pod', 'DIVIDER', NULL,                     NULL,                                           4, 1, '{}', 0, NOW(), NOW()),
('blk_p05', 'pg_andi_pod', 'LINK',   'Newsletter Mingguan',     'https://andi.design/newsletter',                5, 1, '{"subtitle":"Tips desain & marketing tiap Senin","icon":"📬","bg":"#DBEAFE","color":"#1E40AF"}', 89, NOW(), NOW());

-- ── Blocks — page3 sasa-writes ────────────────────────────────────────────

INSERT INTO `Block` (`id`,`pageId`,`type`,`title`,`url`,`position`,`isEnabled`,`config`,`clickCount`,`createdAt`,`updatedAt`) VALUES
('blk_s01', 'pg_sasa', 'HEADER', 'Hi! Aku Sasa 📖',             NULL,                                       1, 1, '{"subtitle":"Penulis, pembaca buku, & content creator","align":"center"}', 0,   NOW(), NOW()),
('blk_s02', 'pg_sasa', 'SOCIAL', 'Ikuti aku',                   NULL,                                       2, 1, '{"socials":[{"label":"Instagram","url":"https://instagram.com/sasa_writes","icon":"Instagram","color":"#E1306C"},{"label":"TikTok","url":"https://tiktok.com/@sasa_writes","icon":"Music","color":"#010101"}]}', 0, NOW(), NOW()),
('blk_s03', 'pg_sasa', 'LINK',   'Blog & Artikel',              'https://sasawrites.com',                    3, 1, '{"subtitle":"Baca tulisan & review buku terbaru","icon":"✍️","bg":"#FEF9C3","color":"#78350F"}', 720, NOW(), NOW()),
('blk_s04', 'pg_sasa', 'LINK',   'Goodreads — Buku Favoritku',  'https://goodreads.com/sasa_writes',         4, 1, '{"subtitle":"Lihat daftar bacaan & review bukuku","icon":"📚","bg":"#F3E8FF","color":"#6B21A8"}', 340, NOW(), NOW()),
('blk_s05', 'pg_sasa', 'IMAGE',  'Book of the Month',           NULL,                                       5, 1, '{"imageUrl":"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600","subtitle":"Buku favorit bulan ini"}', 0, NOW(), NOW()),
('blk_s06', 'pg_sasa', 'LINK',   'TikTok BookTok',              'https://tiktok.com/@sasa_writes',           6, 1, '{"subtitle":"Video book review pendek & seru","icon":"🎬","bg":"#F0FDF4","color":"#15803D"}', 190, NOW(), NOW());

-- ── Analytics — 30 days of views + clicks for pg_andi_main ───────────────
-- (one view row + 3 click rows per day keeps the chart populated)

INSERT INTO `Analytics` (`id`,`pageId`,`blockId`,`event`,`referrer`,`userAgent`,`country`,`device`,`createdAt`) VALUES
('an_v01','pg_andi_main',NULL,'view','https://instagram.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 30 DAY)),
('an_v02','pg_andi_main',NULL,'view','https://google.com',  'Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 29 DAY)),
('an_v03','pg_andi_main',NULL,'view',NULL,                  'Mozilla/5.0','MY','desktop',DATE_SUB(NOW(),INTERVAL 28 DAY)),
('an_v04','pg_andi_main',NULL,'view','https://twitter.com', 'Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 27 DAY)),
('an_v05','pg_andi_main',NULL,'view','https://instagram.com','Mozilla/5.0','SG','desktop',DATE_SUB(NOW(),INTERVAL 26 DAY)),
('an_v06','pg_andi_main',NULL,'view',NULL,                  'Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 25 DAY)),
('an_v07','pg_andi_main',NULL,'view','https://google.com',  'Mozilla/5.0','ID','tablet',DATE_SUB(NOW(),INTERVAL 24 DAY)),
('an_v08','pg_andi_main',NULL,'view','https://instagram.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 23 DAY)),
('an_v09','pg_andi_main',NULL,'view',NULL,                  'Mozilla/5.0','MY','mobile',DATE_SUB(NOW(),INTERVAL 22 DAY)),
('an_v10','pg_andi_main',NULL,'view','https://twitter.com', 'Mozilla/5.0','ID','desktop',DATE_SUB(NOW(),INTERVAL 21 DAY)),
('an_v11','pg_andi_main',NULL,'view','https://instagram.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 20 DAY)),
('an_v12','pg_andi_main',NULL,'view',NULL,                  'Mozilla/5.0','US','desktop',DATE_SUB(NOW(),INTERVAL 19 DAY)),
('an_v13','pg_andi_main',NULL,'view','https://google.com',  'Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 18 DAY)),
('an_v14','pg_andi_main',NULL,'view','https://instagram.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 17 DAY)),
('an_v15','pg_andi_main',NULL,'view',NULL,                  'Mozilla/5.0','MY','desktop',DATE_SUB(NOW(),INTERVAL 16 DAY)),
('an_v16','pg_andi_main',NULL,'view','https://twitter.com', 'Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 15 DAY)),
('an_v17','pg_andi_main',NULL,'view','https://instagram.com','Mozilla/5.0','SG','mobile',DATE_SUB(NOW(),INTERVAL 14 DAY)),
('an_v18','pg_andi_main',NULL,'view',NULL,                  'Mozilla/5.0','ID','tablet',DATE_SUB(NOW(),INTERVAL 13 DAY)),
('an_v19','pg_andi_main',NULL,'view','https://google.com',  'Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 12 DAY)),
('an_v20','pg_andi_main',NULL,'view','https://instagram.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 11 DAY)),
('an_v21','pg_andi_main',NULL,'view',NULL,                  'Mozilla/5.0','MY','desktop',DATE_SUB(NOW(),INTERVAL 10 DAY)),
('an_v22','pg_andi_main',NULL,'view','https://twitter.com', 'Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL  9 DAY)),
('an_v23','pg_andi_main',NULL,'view','https://instagram.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL  8 DAY)),
('an_v24','pg_andi_main',NULL,'view',NULL,                  'Mozilla/5.0','SG','desktop',DATE_SUB(NOW(),INTERVAL  7 DAY)),
('an_v25','pg_andi_main',NULL,'view','https://google.com',  'Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL  6 DAY)),
('an_v26','pg_andi_main',NULL,'view','https://instagram.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL  5 DAY)),
('an_v27','pg_andi_main',NULL,'view',NULL,                  'Mozilla/5.0','MY','tablet',DATE_SUB(NOW(),INTERVAL  4 DAY)),
('an_v28','pg_andi_main',NULL,'view','https://twitter.com', 'Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL  3 DAY)),
('an_v29','pg_andi_main',NULL,'view','https://instagram.com','Mozilla/5.0','ID','desktop',DATE_SUB(NOW(),INTERVAL  2 DAY)),
('an_v30','pg_andi_main',NULL,'view',NULL,                  'Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL  1 DAY)),
-- clicks on LINK blocks
('an_c01','pg_andi_main','blk_a03','click','https://instagram.com','Mozilla/5.0','ID','mobile', DATE_SUB(NOW(),INTERVAL 30 DAY)),
('an_c02','pg_andi_main','blk_a04','click',NULL,               'Mozilla/5.0','ID','mobile', DATE_SUB(NOW(),INTERVAL 29 DAY)),
('an_c03','pg_andi_main','blk_a08','click','https://google.com','Mozilla/5.0','MY','desktop',DATE_SUB(NOW(),INTERVAL 28 DAY)),
('an_c04','pg_andi_main','blk_a03','click','https://instagram.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 27 DAY)),
('an_c05','pg_andi_main','blk_a04','click',NULL,               'Mozilla/5.0','SG','desktop',DATE_SUB(NOW(),INTERVAL 26 DAY)),
('an_c06','pg_andi_main','blk_a06','click','https://twitter.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 25 DAY)),
('an_c07','pg_andi_main','blk_a03','click',NULL,               'Mozilla/5.0','ID','tablet', DATE_SUB(NOW(),INTERVAL 24 DAY)),
('an_c08','pg_andi_main','blk_a04','click','https://instagram.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 23 DAY)),
('an_c09','pg_andi_main','blk_a08','click',NULL,               'Mozilla/5.0','MY','mobile', DATE_SUB(NOW(),INTERVAL 22 DAY)),
('an_c10','pg_andi_main','blk_a03','click','https://google.com','Mozilla/5.0','ID','desktop',DATE_SUB(NOW(),INTERVAL 21 DAY)),
('an_c11','pg_andi_main','blk_a04','click','https://instagram.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 20 DAY)),
('an_c12','pg_andi_main','blk_a06','click',NULL,               'Mozilla/5.0','US','desktop',DATE_SUB(NOW(),INTERVAL 19 DAY)),
('an_c13','pg_andi_main','blk_a03','click','https://instagram.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 18 DAY)),
('an_c14','pg_andi_main','blk_a04','click',NULL,               'Mozilla/5.0','MY','mobile', DATE_SUB(NOW(),INTERVAL 17 DAY)),
('an_c15','pg_andi_main','blk_a08','click','https://twitter.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 16 DAY)),
('an_c16','pg_andi_main','blk_a03','click','https://instagram.com','Mozilla/5.0','SG','desktop',DATE_SUB(NOW(),INTERVAL 15 DAY)),
('an_c17','pg_andi_main','blk_a04','click',NULL,               'Mozilla/5.0','ID','mobile', DATE_SUB(NOW(),INTERVAL 14 DAY)),
('an_c18','pg_andi_main','blk_a06','click','https://google.com','Mozilla/5.0','ID','tablet', DATE_SUB(NOW(),INTERVAL 13 DAY)),
('an_c19','pg_andi_main','blk_a03','click','https://instagram.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 12 DAY)),
('an_c20','pg_andi_main','blk_a04','click',NULL,               'Mozilla/5.0','MY','desktop',DATE_SUB(NOW(),INTERVAL 11 DAY)),
('an_c21','pg_andi_main','blk_a08','click','https://twitter.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL 10 DAY)),
('an_c22','pg_andi_main','blk_a03','click','https://instagram.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL  9 DAY)),
('an_c23','pg_andi_main','blk_a04','click',NULL,               'Mozilla/5.0','ID','mobile', DATE_SUB(NOW(),INTERVAL  8 DAY)),
('an_c24','pg_andi_main','blk_a06','click','https://instagram.com','Mozilla/5.0','SG','desktop',DATE_SUB(NOW(),INTERVAL  7 DAY)),
('an_c25','pg_andi_main','blk_a03','click',NULL,               'Mozilla/5.0','ID','mobile', DATE_SUB(NOW(),INTERVAL  6 DAY)),
('an_c26','pg_andi_main','blk_a04','click','https://google.com','Mozilla/5.0','MY','tablet', DATE_SUB(NOW(),INTERVAL  5 DAY)),
('an_c27','pg_andi_main','blk_a08','click','https://instagram.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL  4 DAY)),
('an_c28','pg_andi_main','blk_a03','click',NULL,               'Mozilla/5.0','ID','desktop',DATE_SUB(NOW(),INTERVAL  3 DAY)),
('an_c29','pg_andi_main','blk_a04','click','https://twitter.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL  2 DAY)),
('an_c30','pg_andi_main','blk_a03','click','https://instagram.com','Mozilla/5.0','ID','mobile',DATE_SUB(NOW(),INTERVAL  1 DAY));

-- ── Sessions ──────────────────────────────────────────────────────────────

INSERT INTO `Session` (`id`,`userId`,`tokenHash`,`csrfToken`,`expiresAt`,`createdAt`) VALUES
('sess_andi', 'uid_andi', '6452d140f151edf68e9badf1889cf8cb74eb6893e1f82623ec453b8405bd7c63', 'fcbc29c7655883b4242bd5714f84d1533f6d345fe3123a187b95e6efce828059', DATE_ADD(NOW(), INTERVAL 7 DAY), NOW()),
('sess_sasa', 'uid_sasa', 'e363673ecd87d097935a12b3302b8428124df368d971737f0d889c4ed8372ccc', '857bdb44802ef6e61d86e31d358cc8751787527a881539daebfa52629f3321aa', DATE_ADD(NOW(), INTERVAL 3 DAY), NOW());

-- ── API Keys ──────────────────────────────────────────────────────────────

INSERT INTO `ApiKey` (`id`,`userId`,`name`,`keyHash`,`scopes`,`lastUsedAt`,`createdAt`,`revokedAt`) VALUES
('apik_andi', 'uid_andi', 'Integrasi Zapier', '44ef6d7ba221fc76f550297f9292ba780c818893efccd33f4226fc2ae2eea487', '["analytics:read","pages:read"]', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW(), NULL);

-- ── Audit Logs ────────────────────────────────────────────────────────────

INSERT INTO `AuditLog` (`id`,`userId`,`action`,`metadata`,`createdAt`) VALUES
('alog_01', 'uid_andi', 'user.register',  '{"email":"halo@bannana.id"}',                            DATE_SUB(NOW(),INTERVAL 30 DAY)),
('alog_02', 'uid_andi', 'page.create',    '{"slug":"andi_kreasi"}',                                 DATE_SUB(NOW(),INTERVAL 29 DAY)),
('alog_03', 'uid_andi', 'page.publish',   '{"slug":"andi_kreasi","isPublished":true}',               DATE_SUB(NOW(),INTERVAL 28 DAY)),
('alog_04', 'uid_andi', 'block.create',   '{"type":"LINK","title":"Portfolio Terbaru"}',             DATE_SUB(NOW(),INTERVAL 27 DAY)),
('alog_05', 'uid_andi', 'page.create',    '{"slug":"andi-podcast"}',                                DATE_SUB(NOW(),INTERVAL 14 DAY)),
('alog_06', 'uid_andi', 'profile.update', '{"fields":["bio","tags"]}',                              DATE_SUB(NOW(),INTERVAL  7 DAY)),
('alog_07', 'uid_andi', 'page.update',    '{"slug":"andi_kreasi","fields":["title"]}',               DATE_SUB(NOW(),INTERVAL  3 DAY)),
('alog_08', 'uid_andi', 'apikey.create',  '{"name":"Integrasi Zapier"}',                            DATE_SUB(NOW(),INTERVAL  2 DAY)),
('alog_09', 'uid_andi', 'user.login',     '{"ip":"127.0.0.1"}',                                     DATE_SUB(NOW(),INTERVAL  1 DAY));