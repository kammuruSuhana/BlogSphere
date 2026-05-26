const db = require("../config/db");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

/* REGISTER */

exports.register = async(req,res)=>{

    try{

        const {
            username,
            email,
            password
        } = req.body;

        if(!username || !email || !password){

            return res.json({
                message:"Fill all fields"
            });
        }

        const hashedPassword =
        await bcrypt.hash(password,10);

        db.query(

            "INSERT INTO users(username,email,password) VALUES(?,?,?)",

            [
                username,
                email,
                hashedPassword
            ],

            (err,result)=>{

                if(err){

                    console.log(err);

                    return res.status(500).json({
                        message:"Registration Failed"
                    });
                }

                res.json({
                    message:"Registered Successfully"
                });

            }
        );

    }catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server Error"
        });

    }
};

/* LOGIN */

exports.login = (req,res)=>{

    const {
        email,
        password
    } = req.body;

    db.query(

        "SELECT * FROM users WHERE email=?",

        [email],

        async(err,result)=>{

            if(err){

                console.log(err);

                return res.status(500).json(err);
            }

            if(result.length === 0){

                return res.json({
                    message:"User Not Found"
                });
            }

            const user = result[0];

            const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );

            if(!validPassword){

                return res.json({
                    message:"Wrong Password"
                });
            }

            const token = jwt.sign(

                {
                    id:user.id
                },

                "SECRETKEY",

                {
                    expiresIn:"7d"
                }
            );

            res.json({

                message:"Login Successful",

                token,

                user
            });

        }
    );
};