const supabase = require("../config/supabase");

const homeController = {
  getHome: async (req, res) => {
    try {
      const { data: images, error } = await supabase
        .from("images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      res.render("home", { images });
    } catch (error) {
      console.error("❌ Gagal memuat halaman utama:", error.message);
      res.status(500).send("Terjadi kesalahan saat memuat halaman utama.");
    }
  },

  getByMonth: async (req, res) => {
    try {
      const month = req.params.month;

      const { data: images, error } = await supabase
        .from("images")
        .select("*")
        .eq("bulan", month)
        .order("created_at", { ascending: false });

      if (error) throw error;

      res.render("bulan", { images, month });
    } catch (error) {
      console.error("❌ Gagal memuat data berdasarkan bulan:", error.message);
      res.status(500).send("Terjadi kesalahan saat memuat data bulan.");
    }
  }
};

module.exports = homeController;
