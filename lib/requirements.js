exports.usernameRequirementsFulfilled = function (userName) {
  return !(userName.length > 100 || userName.length < 6);
};

exports.emailRequirementsFulfilled = function (email) {
  return !(
    email.length > 100 ||
    email.length < 5 ||
    !email.includes("@") ||
    !email.includes(".")
  );
};

exports.passwordRequirementsFulfilled = function (password) {
  return !(password.length > 255 || password.length < 8);
};

exports.visibilityRequirementsFulfilled = function (visibility) {
  return !(visibility !== "public" && visibility !== "private");
};
