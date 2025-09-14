import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
const healthcheck = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "Server is healthy"));
});
export default healthcheck;
