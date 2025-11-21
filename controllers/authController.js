const bcrypt = require("bcryptjs");
const { findUserByUsername, createUser } = require("../services/userService");

module.exports = {
  // Halaman login
  loginPage: (req, res) => {
    res.render("auth/login");
  },

  // Login
  login: async (req, res) => {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);

    if (!user) return res.send("User tidak ditemukan");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Password salah");

    // Simpan user di session
    req.session.user = user;

    // Redirect berdasarkan role
    if (user.role === 'admin') {
      res.redirect("/admin/foto"); // admin ke dashboard admin
    } else {
      res.redirect("/home");       // user biasa ke halaman home
    }
  },

  // Halaman register
  registerPage: (req, res) => {
    res.render("auth/register");
  },

  // Register
  register: async (req, res) => {
    const { nama_user, username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    try {
      await createUser({ nama_user, username, password: hash, role: 'user' });
      res.redirect("/auth/login"); // pastikan path absolute
    } catch (err) {
      res.send(err.message);
    }
  },

  // Logout
  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.log(err);
        return res.redirect('/');
      }
      res.clearCookie('connect.sid'); // hapus cookie session
      res.redirect('/auth/login');    // arahkan ke login
    });
  }
};
