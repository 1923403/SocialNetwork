const { db, exists } = require("../lib/db");
const {
  usernameRequirementsFulfilled,
  emailRequirementsFulfilled,
  passwordRequirementsFulfilled,
  visibilityRequirementsFulfilled,
} = require("../lib/requirements");

exports.isLoggedIn = (req, res, next) => {
  next();
}

exports.isOwner = (req, res, next) => {
  next();
}


exports.alreadyExists = async (req, res, next) => {
  const { userName, email } = req.body;
  if (await exists("users", "user_name", userName)) {
    return res.status(409).send({ msg: `${userName} already exists!` });
  }
  if (await exists("users", "email", email)) {
    res.status(409).send({ msg: `${email} already exists!` });
  }
  next();
};

exports.isValid = (req, res, next) => {
  const { userName, email, password, visibility } = req.body;

  if (!usernameRequirementsFulfilled(userName)) {
    return res
      .status(406)
      .send({ msg: `${userName} does not meet requirements!` });
  }

  if (!emailRequirementsFulfilled(email)) {
    return res
      .status(406)
      .send({ msg: `${email} does not meet requirements!` });
  }

  if (!passwordRequirementsFulfilled(password)) {
    return res
      .status(406)
      .send({ msg: `${password} does not meet requirements!` });
  }

  if (!visibilityRequirementsFulfilled(visibility)) {
    return res
      .status(406)
      .send({ msg: `${visibility} does not meet requirements!` });
  }

  next();
};

exports.isAvailable = (req, res, next) => {
  const { userName, email, password, visibility } = req.body;

  if (!userName) {
    return res.status(400).send({ msg: "'userName' is missing!" });
  }

  if (!email) {
    return res.status(400).send({ msg: "'email' is missing!" });
  }

  if (!password) {
    return res.status(400).send({ msg: "'password' is missing!" });
  }

  if (!visibility) {
    return res.status(400).send({ msg: "'visibility' is missing!" });
  }
  next();
};

exports.validateUpdate = async (req, res, next) => {
  const { newUserName, newEmail, newPassword, newVisibility } = req.body;
  if (newUserName) {
    if (!usernameRequirementsFulfilled(newUserName)) {
      return res
        .status(406)
        .send({ msg: `${newUserName} does not meet requirements!` });
    }

    if (await exists("users", "user_name", newUserName)) {
      return res.status(406).send({ msg: `${newUserName} already exists!` });
    }
  }
  if (newEmail) {
    if (!emailRequirementsFulfilled(newEmail)) {
      return res
        .status(406)
        .send({ msg: `${newEmail} does not meet requirements!` });
    }
    if (await exists("users", "email", newEmail)) {
      return res.status(406).send({ msg: `${newEmail} already exists!` });
    }
  }

  if (newPassword && !passwordRequirementsFulfilled(newPassword)) {
    return res
      .status(406)
      .send({ msg: `${newPassword} does not meet requirements!` });
  }

  if (newVisibility && !visibilityRequirementsFulfilled(newVisibility)) {
    return res
      .status(406)
      .send({ msg: `${newVisibility} yes not meet requirements!` });
  }

  next();
};
