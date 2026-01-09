const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const pool = require("../db/db");

/**
 * @swagger
 * tags:
 *   name: Blog Posts
 *   description: Blog CRUD APIs
 */

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Add a blog post
 *     tags: [Blog Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;

  const result = await pool.query(
    `INSERT INTO blogs (user_id, title, content)
     VALUES ($1,$2,$3) RETURNING *`,
    [req.userId, title, content]
  );

  res.json(result.rows[0]);
});

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blog Posts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of blogs
 */
router.get("/", auth, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM blogs ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update a blog post
 *     tags: [Blog Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Blog updated
 *       404:
 *         description: Blog not found
 */
router.put("/:id", auth, async (req, res) => {
  const { title, content } = req.body;

  await pool.query(
    `UPDATE blogs SET title=$1, content=$2 WHERE id=$3 AND user_id=$4`,
    [title, content, req.params.id, req.userId]
  );

  res.json({ message: "Blog updated successfully" });
});

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Blog Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Blog deleted
 *       404:
 *         description: Blog not found
 */
router.delete("/:id", auth, async (req, res) => {
  await pool.query(
    "DELETE FROM blogs WHERE id=$1 AND user_id=$2",
    [req.params.id, req.userId]
  );

  res.json({ message: "Blog deleted successfully" });
});

module.exports = router;
