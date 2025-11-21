const {
  getAllImages,
  createImage,
  deleteImage
} = require("../services/imageService");

const supabase = require("../config/supabase");
const { v4: uuid } = require("uuid");

module.exports = {
  index: async (req, res) => {
    try {
      const images = await getAllImages();
      res.render("images/index", { images });
    } catch (err) {
      res.send(err.message);
    }
  },

  store: async (req, res) => {
    try {
      const { judul, bulan, keterangan, link, detail } = req.body;

      // Pastikan ada file
      if (!req.file) {
        return res.status(400).send("File gambar tidak ditemukan.");
      }

      // 🔥 Upload ke Supabase
      const fileName = `foto-${uuid()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        console.log(uploadError);
        return res.status(500).send("Gagal upload gambar ke Supabase");
      }

      // Dapatkan Public URL
      const { data: publicUrl } = supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .getPublicUrl(fileName);

      // Simpan DB lewat service
      await createImage({
        judul,
        bulan,
        keterangan,
        link,
        detail,
        foto: publicUrl.publicUrl,
        fileName: fileName
      });

      res.redirect("/images");

    } catch (err) {
      res.send(err.message);
    }
  },

  destroy: async (req, res) => {
    try {
      // 🔥 Hapus via service (nanti service yang hapus dari Supabase juga)
      await deleteImage(req.params.id);

      res.redirect("/images");
    } catch (err) {
      res.send(err.message);
    }
  }
};
