const pool = require("../db/db");

exports.createBlog = async (req, res) => {
  const { title, content } = req.body;

  const result = await pool.query(
    `INSERT INTO blogs (user_id, title, content)
     VALUES ($1,$2,$3) RETURNING *`,
    [req.userId, title, content]
  );

  res.json(result.rows[0]);
};

exports.getBlogs = async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM blogs WHERE user_id=$1 ORDER BY created_at DESC`,
    [req.userId]
  );

  res.json(result.rows);
};

exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  await pool.query(
    `UPDATE blogs SET title=$1, content=$2 WHERE id=$3 AND user_id=$4`,
    [title, content, id, req.userId]
  );

  res.json({ success: true });
};

exports.deleteBlog = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    `DELETE FROM blogs WHERE id=$1 AND user_id=$2`,
    [id, req.userId]
  );

  res.json({ success: true });
};
