const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
const API_URL = process.env.API_URL;

module.exports = async (req, res) => {
  const contentTypeHeader = req.get('Content-Type').toLowerCase();
  logger.debug({ contentTypeHeader });

  if (!contentTypeHeader || !Fragment.isSupportedType(contentTypeHeader)) {
    res.status(415).json(createErrorResponse(415, 'Unsupported Type'));
    return;
  }

  try {
    const fragment = new Fragment({ ownerId: req.user, type: contentTypeHeader });
    await fragment.setData(req.body);

    const fragmentURL = new URL(`/v1/fragments/${fragment.id}`, API_URL);
    res.setHeader('Location', fragmentURL.href);
    res.status(201).json(
      createSuccessResponse({
        fragment,
      })
    );
  } catch (error) {
    res.status(400).json(createErrorResponse(400, error));
  }
};
