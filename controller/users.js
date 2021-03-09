const db = require('../lib/db');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

exports.create = (req, res) => {
    const password = req.body.password;

    bcrypt.hash(password, 10,(err, hash) => {
        const sql =`INSERT INTO users(id, user_name, email, password, visibility, last_login, created_at) 
        VALUES(${db.escape(uuid.v4())}, ${db.escape(req.body.userName)}, 
        ${db.escape(req.body.email)}, ${db.escape(hash)}, 
        ${db.escape(req.body.visibility)}, null, now());`;
        db.query(sql, (err, result) => {
            if(err){
                res.status(500).send({msg: err});
            } else {
                res.status(201).send({msg: `${req.body.userName} was created`})
            }
        });
    });
}

exports.login = (req, res) => {
    const {userName, password} = req.body;
    if(!userName || !password){
        return res.status(400).send({msg: 'Missing username or password'});
    }
    const sql = `SELECT password, id FROM users WHERE LOWER(user_name) = LOWER(${db.escape(userName)})`;
    db.query(sql, (err, result) => {
        if(err) {
            return res.status(500).send({msg: 'Internal error'});
        }
        if(!result.length) {
            return res.status(401).send({msg: 'Username or password incorrect'});
        }
        if(!bcrypt.compareSync(password, result[0]['password'])) {
            return res.status(401).send({msg: 'Username or password incorrect'});
        }
        const token = jwt.sign(
            { id: result[0]['id']},
            'dadawafasfEEAFAEafeaar234r3qw',
            { expiresIn: '1d'}
        );

        const sql = `UPDATE users SET last_login = now() WHERE LOWER(user_name) = LOWER(${db.escape(userName)});`;
        db.query(sql, (err, result) => {
            if(err) console.log(err);
        });

        return res.status(200).cookie('token', token).send({msg: 'logged in', user: userName});
    });
    
}

exports.update = (req, res) => {
    const { userName, newUserName, newEmail, newPassword, newVisibility } = req.body;
    let sql = `UPDATE users SET`;
    if (newUserName) {
        //already exists
        sql +=` user_name = ${db.escape(newUserName)},`;
    }
    if (newEmail){
        sql +=` email = ${db.escape(newEmail)},`;
    }
    if (newPassword) {
          const hash = bcrypt.hashSync(newPassword, 10);
        sql +=` password = ${db.escape(hash)},`;
    }
    if (newVisibility || newVisibility === 'public' || newVisibility === 'private') {
        sql +=` visibility = ${db.escape(newVisibility)},`;
    }

    sql = sql.slice(0, -1);
    sql +=` WHERE LOWER(user_name) = LOWER(${db.escape(req.body.userName)})`;

    db.query(sql,(err, result) => {
        console.log(sql);
        if(err){ 
            console.log(err)
            return res.status(500).send({msg: 'can not update'})
        }
        return res.status(200).send({msg: `updated user ${userName}`})
    });
}

exports.deleteUser = (req, res) => {
    const sql = `DELETE FROM users WHERE LOWER(user_name) = LOWER(${db.escape(req.body.userName)})`;
    db.query(sql, (err, result) => {
        if(err){
            res.status(500).send({msg: `${req.body.userName} could not be deleted`});
        } else {
            res.status(200).send({msg: `${req.body.userName} was deleted`});
        }
    })
};