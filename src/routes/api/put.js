const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    const contentTypeHeader = req.get('Content-Type').toLowerCase();

    if (fragment.type === contentTypeHeader) {
      await fragment.setData(req.body);
      await fragment.save();

      res.status(200).json(
        createSuccessResponse({
          status: 'ok',
          fragment: fragment,
        })
      );
    } else {
      res.status(415).json(createErrorResponse(415, 'Fragment of this type can not be edited'));
      return;
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, err));
  }
};
