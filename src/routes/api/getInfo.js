const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  const id = req.params.id;
  let fragment;

  try {
    fragment = await Fragment.byId(req.user, id);
    createSuccessResponse(
      res.status(200).json({
        fragment: fragment,
      })
    );
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Could not find Fragment')).end();
    return;
  }
};
