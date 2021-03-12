exports.requirementsFullfilled = (req, res, next) => {
  const { title } = req.body;
  if (!title) return res.status(400).send({ msg: "title is missing" });
  next();
};
