require('dotenv').config(); // load .env dulu
const bcrypt = require("bcrypt");
const { createUser } = require("./services/userService");

async function main() {
  try {
    // Data akun admin
    const adminData = {
      nama_user: "Admin1",
      username: "Admin1",
      password: await bcrypt.hash("Admin123", 10), // ganti password sesuai keinginan
      role: "admin"
    };

    // Simpan ke database
    await createUser(adminData);

    console.log("✅ Akun admin berhasil dibuat!");
  } catch (err) {
    console.error("❌ Gagal membuat akun admin:", err.message);
  } finally {
    process.exit();
  }
}

main();
