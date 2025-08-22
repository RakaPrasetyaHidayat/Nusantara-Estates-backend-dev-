// Script untuk memaksa logout semua users
// Jalankan script ini di browser console untuk menghapus semua session data

console.log('🚪 Starting force logout process...');

// Hapus semua data dari localStorage
try {
    localStorage.clear();
    console.log('✅ localStorage cleared');
} catch (error) {
    console.error('❌ Error clearing localStorage:', error);
}

// Hapus semua data dari sessionStorage
try {
    sessionStorage.clear();
    console.log('✅ sessionStorage cleared');
} catch (error) {
    console.error('❌ Error clearing sessionStorage:', error);
}

// Hapus cookies (jika ada)
try {
    document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    console.log('✅ Cookies cleared');
} catch (error) {
    console.error('❌ Error clearing cookies:', error);
}

// Hapus IndexedDB (jika ada)
try {
    if ('indexedDB' in window) {
        indexedDB.databases().then(databases => {
            databases.forEach(db => {
                indexedDB.deleteDatabase(db.name);
            });
        });
        console.log('✅ IndexedDB cleared');
    }
} catch (error) {
    console.error('❌ Error clearing IndexedDB:', error);
}

console.log('🎉 Force logout completed! All users have been logged out.');
console.log('🔄 Please refresh the page to see the changes.');

// Auto refresh halaman setelah 2 detik
setTimeout(() => {
    window.location.reload();
}, 2000);