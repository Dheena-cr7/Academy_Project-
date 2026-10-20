const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

/**
 * Kalaivani Sainik Academy — Automated Database Backup Script
 * Uses better-sqlite3 native online backup API for crash-consistent backups.
 */
async function runBackup() {
  const rootDir = path.join(__dirname, '..');
  const dbPath = path.join(rootDir, 'data', 'kalaivani.db');
  const backupDir = path.join(rootDir, 'backups');

  if (!fs.existsSync(dbPath)) {
    console.error(`[BACKUP ERROR] Database file not found at: ${dbPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `kalaivani-backup-${timestamp}.db`;
  const backupFilePath = path.join(backupDir, backupFileName);

  console.log(`[BACKUP] Starting online backup of ${dbPath}...`);
  const startTime = Date.now();

  try {
    const db = new Database(dbPath, { readonly: true, fileMustExist: true });

    // Perform safe online backup
    await db.backup(backupFilePath, {
      progress({ totalPages, remainingPages }) {
        const progress = (((totalPages - remainingPages) / totalPages) * 100).toFixed(1);
        process.stdout.write(`\r[BACKUP] Progress: ${progress}% (${totalPages - remainingPages}/${totalPages} pages)`);
      },
    });

    db.close();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const stats = fs.statSync(backupFilePath);
    const sizeKb = (stats.size / 1024).toFixed(1);

    console.log(`\n[BACKUP SUCCESS] Created backup: ${backupFileName} (${sizeKb} KB) in ${duration}s`);

    // Retention policy: Keep the last 14 backups, remove older ones
    cleanOldBackups(backupDir, 14);
  } catch (err) {
    console.error('\n[BACKUP FAILED]:', err);
    process.exit(1);
  }
}

function cleanOldBackups(backupDir, keepCount) {
  try {
    const files = fs
      .readdirSync(backupDir)
      .filter((f) => f.startsWith('kalaivani-backup-') && f.endsWith('.db'))
      .map((f) => ({
        name: f,
        path: path.join(backupDir, f),
        time: fs.statSync(path.join(backupDir, f)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time); // newest first

    if (files.length > keepCount) {
      const toDelete = files.slice(keepCount);
      for (const file of toDelete) {
        fs.unlinkSync(file.path);
        console.log(`[BACKUP ROTATION] Deleted old backup: ${file.name}`);
      }
    }
  } catch (err) {
    console.warn('[BACKUP ROTATION WARNING] Could not rotate old backups:', err.message);
  }
}

runBackup();
