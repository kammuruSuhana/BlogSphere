const db = require("../config/db");

exports.addComment = (req,res)=>{

    const {
        comment,
        post_id
    } = req.body;

    db.query(
        "INSERT INTO comments(comment,user_id,post_id) VALUES(?,?,?)",
        [comment,req.user.id,post_id],
        (err,result)=>{

            res.json({
                message:"Comment Added"
            });

        }
    );
};

exports.getComments = (req,res)=>{

    db.query(
        `SELECT comments.*, users.username
         FROM comments
         JOIN users
         ON comments.user_id = users.id
         WHERE post_id=?`,
        [req.params.postId],
        (err,result)=>{

            res.json(result);

        }
    );
};