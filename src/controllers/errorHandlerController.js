const sendSuccessResponse = async (res, data) => {
  return res.status(200).send({
    data,
  });
};

const sendErrorResponse = async (res, err) => {
  return res.status(400).send({
    err,
  });
};

module.exports = { sendSuccessResponse, sendErrorResponse };
