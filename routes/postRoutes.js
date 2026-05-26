const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
    createPost,
    getPosts,
    deletePost,
    likePost
} = require("../controllers/postController");

router.post("/", auth, createPost);

router.get("/", getPosts);

router.delete("/:id", auth, deletePost);

router.post("/like/:id", auth, likePost);

module.exports = router;