import User from "../models/user.model.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
import ApiError from "../utils/api-error.js";
import { sendEmail } from "../utils/mail.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save((validateBeforeSave = false));
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens",
      [error.message],
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with given email or username already exists",
      [],
    );
  }
  const user = await User.create({
    username,
    email,
    password,
    isEmailVerified: false,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  //send verification email
  await sendEmail({
    email: user?.email,
    subject: "Please verify your email for FixMyRide",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocal}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry",
  );
  if (!createdUser) {
    throw new ApiError(500, "User registration failed", []);
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        "User registered successfully and verification email has been sent on your email ",
        { user: createdUser },
        [],
      ),
    );
});

export { registerUser };
