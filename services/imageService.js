const supabase = require("../config/supabase");

async function getAllImages() {
  const { data, error } = await supabase
    .from("images")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

async function createImage(body) {
  const { data, error } = await supabase
    .from("images")
    .insert([body]);

  if (error) throw error;
  return data;
}

async function getImageById(id) {
  const { data, error } = await supabase
    .from("images")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

async function updateImageById(id, updateData) {
  const { data, error } = await supabase
    .from("images")
    .update(updateData)
    .eq("id", id);

  if (error) throw error;
  return data;
}

async function deleteImageById(id) {
  // Ambil data gambar dulu
  const { data: img, error: findError } = await supabase
    .from("images")
    .select("*")
    .eq("id", id)
    .single();

  if (findError) throw findError;
  if (!img) throw new Error("Image not found");

  // Hapus file dari Supabase Storage
  const { error: storageError } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .remove([img.fileName]);

  if (storageError) {
    console.log("⚠️ Gagal hapus file dari storage:", storageError);
  }

  // Hapus row dari tabel
  const { data, error } = await supabase
    .from("images")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return data;
}

module.exports = {
  getAllImages,
  createImage,
  getImageById,
  updateImageById,
  deleteImageById
};
