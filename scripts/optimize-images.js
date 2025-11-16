#!/usr/bin/env node

import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const BACKUP_DIR = join(PUBLIC_DIR, 'originals');

// Target max file size: 500KB for regular images, 1MB for hero images
const MAX_SIZE_KB = 500;
const MAX_HERO_SIZE_KB = 1000;

async function ensureBackupDir() {
  try {
    await mkdir(BACKUP_DIR, { recursive: true });
    console.log('✓ Backup directory created/verified\n');
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

async function optimizeImage(filePath, filename) {
  const ext = extname(filename).toLowerCase();

  // Only process jpg/jpeg/png images
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return;
  }

  console.log(`\n📸 Processing: ${filename}`);

  const baseName = basename(filename, ext);
  const outputWebP = join(PUBLIC_DIR, `${baseName}.webp`);
  const outputJpg = join(PUBLIC_DIR, `${baseName}.jpg`);

  // Determine quality based on filename
  const isHero = filename.includes('hero') || filename.includes('bg');
  const maxSize = isHero ? MAX_HERO_SIZE_KB : MAX_SIZE_KB;

  try {
    // Get original file size
    const stats = await sharp(filePath).stats();
    const metadata = await sharp(filePath).metadata();
    const originalSizeMB = (metadata.size / 1024 / 1024).toFixed(2);

    console.log(`  Original: ${originalSizeMB}MB (${metadata.width}x${metadata.height})`);

    // Optimize to WebP (best compression)
    let webpQuality = 85;
    let webpBuffer;
    let webpSize;

    do {
      webpBuffer = await sharp(filePath)
        .resize({ width: Math.min(metadata.width, 2400), withoutEnlargement: true })
        .webp({ quality: webpQuality, effort: 6 })
        .toBuffer();

      webpSize = webpBuffer.length / 1024;

      if (webpSize > maxSize && webpQuality > 60) {
        webpQuality -= 5;
      } else {
        break;
      }
    } while (webpQuality >= 60);

    await sharp(webpBuffer).toFile(outputWebP);
    console.log(`  ✓ WebP: ${(webpSize / 1024).toFixed(2)}MB (quality: ${webpQuality})`);

    // Also create optimized JPG (fallback)
    let jpgQuality = 80;
    let jpgBuffer;
    let jpgSize;

    do {
      jpgBuffer = await sharp(filePath)
        .resize({ width: Math.min(metadata.width, 2400), withoutEnlargement: true })
        .jpeg({ quality: jpgQuality, progressive: true })
        .toBuffer();

      jpgSize = jpgBuffer.length / 1024;

      if (jpgSize > maxSize && jpgQuality > 60) {
        jpgQuality -= 5;
      } else {
        break;
      }
    } while (jpgQuality >= 60);

    await sharp(jpgBuffer).toFile(outputJpg);
    console.log(`  ✓ JPG: ${(jpgSize / 1024).toFixed(2)}MB (quality: ${jpgQuality})`);

    const savings = ((1 - (webpSize / 1024) / originalSizeMB) * 100).toFixed(1);
    console.log(`  💾 Saved: ${savings}% (using WebP)`);

  } catch (error) {
    console.error(`  ✗ Error processing ${filename}:`, error.message);
  }
}

async function main() {
  console.log('🎨 Image Optimization Tool\n');
  console.log('━'.repeat(50));

  await ensureBackupDir();

  const files = await readdir(PUBLIC_DIR);
  const imageFiles = files.filter(f => {
    const ext = extname(f).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext);
  });

  console.log(`Found ${imageFiles.length} images to optimize\n`);

  for (const file of imageFiles) {
    await optimizeImage(join(PUBLIC_DIR, file), file);
  }

  console.log('\n' + '━'.repeat(50));
  console.log('\n✨ All images optimized!');
  console.log('\n💡 Next steps:');
  console.log('  1. Update components to use .webp images');
  console.log('  2. Add <picture> tags with WebP + JPG fallback');
  console.log('  3. Original files are in public/originals/');
}

main().catch(console.error);
