const User = require("../models/user");
const {
  generateOTP,
  generateEmailTemplate,
  plainEmailTemplate,
  generatePasswordResetTemplate,
} = require("../utiles/mail");
const mailTransport = require("../utiles/mailTrap");
const VerificationToken = require("../models/verificationToken");
const { sendError, createRandomBytes } = require("../utiles/helper");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const ResetToken = require("../models/resetToken");
const crypto = require("crypto");
// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, "User with this email already exists");
    }
    const newUser = new User({
      name,
      email,
      password,
    });

    const OTP = generateOTP();
    const verificationToken = new VerificationToken({
      owner: newUser._id,
      token: OTP,
    });

    await newUser.save();
    await verificationToken.save();

    mailTransport().sendMail({
      from: "emailverification@email.com",
      to: newUser.email,
      subject: "Verify Your email",
      html: generateEmailTemplate(OTP),
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// SIGNIN
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email.trim() || !password.trim())
    return sendError(res, "Invalid Email or Password");
  const user = await User.findOne({ email });
  if (!user) return sendError(res, "Invalid Email or Password ");

  const isMatched = await user.comparePassword(password);
  if (!isMatched) return sendError(res, "Invalid Email/Password ");

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({
    success: true,
    user: { name: user.name, email: user.email, id: user.id, token },
  });
};
// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp.trim())
    return sendError(res, "Invalid request, misssing parameters!");

  if (!isValidObjectId(userId)) return sendError(res, "invalid user ID!");

  const user = await User.findById(userId);
  if (!user) return sendError(res, "User not Found please input valid user ID");

  if (user.verified) return sendError(res, "This account is already verified");

  const token = await VerificationToken.findOne({ owner: user._id });
  if (!token) return sendError(res, "Sorry user not found!");

  const isMatched = await token.compareToken(otp);
  if (!isMatched) return sendError(res, " Please provide a valid token!");

  user.verified = true;

  await VerificationToken.findByIdAndDelete(token._id);
  await user.save();

  mailTransport().sendMail({
    from: "emailverification@email.com",
    to: user.email,
    subject: "Email Verified Successfully",
    html: plainEmailTemplate("Your email has been verified successfully!"),
  });
  res.status(200).json({
    success: true,
    message: "Email verified successfully.",
    user: { name: user.name, email: user.email, id: user.id, token },
  });
};
// RESET PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, "Please provide a valid email!");
  const user = await User.findOne({ email: email });
  if (!user) return sendError(res, "User not Found");

  const existingToken = await ResetToken.findOne({ owner: user._id });
  if (existingToken)
    return sendError(res, "Token can only be request after one hour");

  const randomBytes = await createRandomBytes();
  const resetToken = new ResetToken({
    owner: user._id,
    token: randomBytes,
    expiresAt: Date.now() + 3600000,
  });

  await resetToken.save();

  mailTransport().sendMail({
    from: "passwordreset@email.com",
    to: user.email,
    subject: "Password Reset Request",
    html: generatePasswordResetTemplate(
      `http://localhost:3000/rest-password=${randomBytes}&id=${user.id}.`
    ),
  });
  res.status(200).json({ message: "Password reset token sent to your email." });
};
exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) sendError(res, "User not found!");
  const isSamePassword = await user.comparePassword(password);
  if (isSamePassword) return sendError(res, "New password must be different!");
  if (password.trim().length < 8 || password.trim().length > 20)
    return sendError(res, "Password must br 8 to 20 characters");

  user.password = password.trim();
  await user.save();

  await ResetToken.findByIdAndDelete({ owner: user._id });
  mailTransport().sendMail({
    from: "emailverification@email.com",
    to: user.email,
    subject: "Password Updated Successfully",
    html: passwordResetTemplate("Your Password have been reset successfully!"),
  });
  res.status(200).json({
    success: true,
    message: "Password Updated Successfully",
    user: { name: user.name, email: user.email, id: user.id, token },
  });
};
