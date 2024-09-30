const { check, validationResult } = require("express-validator");

exports.validateUser = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please input your name")
    .isLength({ min: 3, max: 50 }),
  check("email").normalizeEmail().isEmail().withMessage("Invalid Email"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password must be at least 8 characters")
    .isLength({ min: 8, max: 1044 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "i"
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
    ),
];
exports.validate = (req, res, next) => {
  const errors = validationResult(req).array();
  if (!errors.length) return next();
  res.status(400).json({ error: errors[0].msg });
};
