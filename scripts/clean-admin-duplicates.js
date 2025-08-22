import pool from '../server/db.js';

const cleanAdminDuplicates = async () => {
  try {
    console.log('🧹 Cleaning admin duplicates from database...');
    
    // Cek user dengan kredensial admin
    const [adminUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      ['NE Administrator', 'kenzani@gmail.com']
    );
    
    console.log('Found admin-related users:', adminUsers);
    
    if (adminUsers.length > 0) {
      console.log('🗑️ Removing admin duplicates from database...');
      
      // Hapus user dengan kredensial admin dari database
      const [result] = await pool.query(
        'DELETE FROM users WHERE username = ? OR email = ?',
        ['NE Administrator', 'kenzani@gmail.com']
      );
      
      console.log(`✅ Removed ${result.affectedRows} admin duplicate(s) from database`);
      console.log('ℹ️ Admin will now be handled by hardcoded credentials only');
    } else {
      console.log('✅ No admin duplicates found in database');
    }
    
    // Verifikasi
    const [remainingUsers] = await pool.query('SELECT * FROM users');
    console.log(`📊 Remaining users in database: ${remainingUsers.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning admin duplicates:', error);
    process.exit(1);
  }
};

cleanAdminDuplicates();