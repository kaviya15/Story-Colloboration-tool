const sendSuccessResponse = async (res, data) => {
  return res.status(200).send({
    data,
  });
};

const sendErrorResponse = async (res, err) => {
  return res.status(400).send({
    error: err.message,
  });
};

module.exports = { sendSuccessResponse, sendErrorResponse };
