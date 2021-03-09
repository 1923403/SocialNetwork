const db = require('../lib/db');

exports.alreadyExists = (req, res, next) =>{
    const { userName, email } = req.body;
    const sql = `SELECT user_name FROM users WHERE LOWER(user_name) = ${db.escape(userName.toLowerCase())}`;
    db.query(sql, (err, result) => {
      console.log(result)
      if(result.length > 0){
          console.log("username")
        return res.status(409).send({msg: `${userName} already exists!`});
      } else {
          const sql = `SELECT email FROM users WHERE LOWER(email) = ${db.escape(email.toLowerCase())}`;
          db.query(sql, (err, result) => {
            console.log(result)
            if(result.length > 0) {
                console.log("email")
              res.status(409).send({msg: `${email} already exists!`});
            } else {
              next();
            }
          });
      }
    });  
};

exports.isValid = (req, res, next) => {
  const { userName, email, password, visibility } = req.body;

  if (userName.length > 100 || userName.length < 6) {
    return res.status(406).send({msg: `${userName} does not meet requirements!`});
  }

  if (email.length > 100 || email.length < 5 || !email.includes('@') || !email.includes('.')) {
    return res.status(406).send({msg: `${email} does not meet requirements!`});
  }

  if (password.length > 255 || password.length < 8) {
    return res.status(406).send({msg: `${password} does not meet requirements!`});
  }

  if (visibility !== 'public' && visibility !== 'private') {
    return res.status(406).send({msg: `${visibility} does not meet requirements!`});
  }

  next()
}

exports.isAvailable = (req, res, next) => {
  const { userName, email, password, visibility } = req.body;

  if (!userName) {
    return res.status(400).send({msg: "'userName' is missing!"});
  }

  if (!email) {
    return res.status(400).send({msg: "'email' is missing!"});
  }

  if (!password) {
    return res.status(400).send({msg: "'password' is missing!"});
  }

  if (!visibility) {
    return res.status(400).send({msg: "'visibility' is missing!"});
  }
  next();
};

exports.validateUpdate = (req, res, next) => {
  const { newUserName, newEmail, newPassword, newVisibility } = req.body;

  if (newUserName.length > 100 || newUserName.length < 6) {
    return res.status(406).send({msg: `${newUserName} does not meet requirements!`});
  }
  if(db.exists('users', 'user_name', newUserName)) {
    return res.status(406).send({msg: `${newUserName} already exists!`});
  }
  
  if (newEmail.length > 100 || newEmail.length < 5 || !newEmail.includes('@') || !newEmail.includes('.')) {
    return res.status(406).send({msg: `${newEmail} does not meet requirements!`});
  }
  if(db.exists('users', 'email', newEmail)) {
    return res.status(406).send({msg: `${newUserName} already exists!`});
  }

  if (newPassword.length > 255 || newPassword.length < 8) {
    return res.status(406).send({msg: `${newPassword} does not meet requirements!`});
  }

  if (newVisibility !== 'public' && newVisibility !=='private') {
    return res.status(406).send({msg: `${newVisibility} yes not meet requirements!`});
  }

  next()
}