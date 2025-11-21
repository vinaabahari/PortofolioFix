const { getAllImages, createImage, getImageById, updateImageById, deleteImageById } = require("../services/imageService");
const supabase = require("../config/supabase");
const { v4: uuid } = require('uuid');

const adminController = {

  // Tampilkan halaman admin + daftar foto
  getAdmin: async (req, res) => {
    try {
      const images = await getAllImages();
      res.render("admin", { images, filter: null });
    } catch (error) {
      console.error("❌ Gagal memuat halaman admin:", error);
      res.status(500).send("Terjadi kesalahan saat memuat halaman admin.");
    }
  },

  // Tambah foto baru
  addPhoto: async (req, res) => {
    try {
      const { judul, bulan, keterangan, link, detail } = req.body;

      // === UPLOAD KE SUPABASE STORAGE ===
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `foto-${uuid()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        console.log("Upload Error:", uploadError);
        return res.status(500).send("Gagal upload gambar ke Supabase");
      }

      // Ambil public URL
      const { data: publicUrl } = supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .getPublicUrl(fileName);

      // === SIMPAN KE DATABASE TANPA fileName ===
      await createImage({
        judul,
        bulan,
        keterangan,
        link,
        detail,
        foto: publicUrl.publicUrl
      });

      console.log("✅ Foto ditambahkan:", judul);
      res.redirect("/admin/foto");

    } catch (error) {
      console.error("❌ Gagal menyimpan foto:", error);
      res.status(500).send("Gagal menyimpan foto");
    }
  },

  // Form edit foto
  editForm: async (req, res) => {
    try {
      const image = await getImageById(req.params.id);
      res.render("edit", { image });
    } catch (error) {
      console.error("❌ Gagal memuat form edit:", error);
      res.status(500).send("Terjadi kesalahan saat memuat form edit.");
    }
  },

  // Update foto
  updatePhoto: async (req, res) => {
    try {
      const { judul, bulan, keterangan, link, detail } = req.body;
      const updateData = { judul, bulan, keterangan, link, detail };

      // Jika ada foto baru
      if (req.file) {
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `foto-${uuid()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
          });

        if (uploadError) return res.status(500).send("Gagal upload gambar baru");

        const { data: publicUrl } = supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .getPublicUrl(fileName);

        updateData.foto = publicUrl.publicUrl;
      }

      await updateImageById(req.params.id, updateData);
      res.redirect("/admin/foto");

    } catch (error) {
      console.error("❌ Gagal update foto:", error);
      res.status(500).send("Gagal update foto");
    }
  },

  // Hapus foto
  deletePhoto: async (req, res) => {
    try {
      await deleteImageById(req.params.id);
      res.redirect("/admin/foto");
    } catch (error) {
      console.error("❌ Gagal hapus foto:", error);
      res.status(500).send("Gagal hapus foto");
    }
  }

};

module.exports = adminController;
