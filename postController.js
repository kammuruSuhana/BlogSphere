const db = require("../config/db");

exports.createPost = (req,res)=>{

    const {
        title,
        content,
        image
    } = req.body;

    db.query(
        "INSERT INTO posts(title,content,image,user_id) VALUES(?,?,?,?)",
        [title,content,image,req.user.id],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"Post Created"
            });

        }
    );
};

exports.getPosts = (req,res)=>{

    db.query(
        `SELECT posts.*, users.username
         FROM posts
         JOIN users
         ON posts.user_id = users.id
         ORDER BY posts.id DESC`,
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );
};

exports.deletePost = (req,res)=>{

    db.query(
        "DELETE FROM posts WHERE id=?",
        [req.params.id],
        (err,result)=>{

            res.json({
                message:"Post Deleted"
            });

        }
    );
};

exports.likePost = (req,res)=>{

    db.query(
        "INSERT INTO likes(user_id,post_id) VALUES(?,?)",
        [req.user.id,req.params.id],
        (err,result)=>{

            res.json({
                message:"Liked ❤️"
            });

        }
    );
};