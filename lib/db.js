const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'social_network'
});
connection.connect();

async function exists(table, column, value) {
    const sql = `SELECT ${column} FROM ${table} WHERE LOWER(${column}) = LOWER(${connection.escape(value)});`;
    await connection.query(sql, (err, result) => {
        if(result.length > 0)
            return true;
        else 
            return false;
    });
}

module.exports = {connection, exists};


// const sql = `SELECT user_name FROM users WHERE LOWER(user_name) = ${db.escape(userName.toLowerCase())}`;
//     db.query(sql, (err, result) => {
//       console.log(result)
//       if(result.length > 0){
//           console.log("username")
//         return res.status(409).send({msg: `${userName} already exists!`});
//       } else {
//           const sql = `SELECT email FROM users WHERE LOWER(email) = ${db.escape(email.toLowerCase())}`;
//           db.query(sql, (err, result) => {
//             console.log(result)
//             if(result.length > 0) {
//                 console.log("email")
//               res.status(409).send({msg: `${email} already exists!`});
//             } else {
//               next();
//             }
//           });
//       }
//     });  