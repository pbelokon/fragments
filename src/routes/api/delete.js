const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    let id = req.params.id;
    await Fragment.delete(req.user, id);
    res.status(200).json(createSuccessResponse(200));
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
};
