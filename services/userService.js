const supabase = require("../config/supabase");

async function findUserByUsername(username) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) return null;
  return data;
}

async function createUser(body) {
  const { data, error } = await supabase
    .from("users")
    .insert([body]);

  if (error) throw error;
  return data;
}

module.exports = {
  findUserByUsername,
  createUser
};
