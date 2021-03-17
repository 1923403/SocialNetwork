exports.requirementsFullfilled = (req, res, next) => {
  console.log(req.body);
  const { title } = req.body;
  if (!title) return res.status(400).send({ msg: "title is missing" });
  next();
};
