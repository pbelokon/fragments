const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');
// TODO: Add support for more content types
const contentTypeHeader = [
  {
    id: '.txt',
    contentType: 'text/plain',
  },
];

module.exports = async (req, res) => {
  const ext = path.extname(req.params.id);
  const id = path.basename(req.params.id, ext);
  let fragment;

  logger.info({ id, ext }, 'GET /api/fragments/:id');

  try {
    fragment = await Fragment.byId(req.user, id);
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Could not find Fragment')).end();
    return;
  }

  try {
    if (!ext) {
      res.setHeader('content-type', fragment.type);
      res.status(200).send(await fragment.getData());
      return;
    }
    const typeCheck = contentTypeHeader.find((extension) => extension.id === ext.toLowerCase());
    if (!typeCheck) {
      res
        .status(415)
        .json(createErrorResponse(415, fragment.type + ' cannot be returned as a ' + ext));
      return;
    }

    if (fragment.formats.includes(typeCheck.contentType)) {
      res.setHeader('content-type', typeCheck.contentType);
      // Here we are just return the data because we are dealing with plain text
      // TODO do a proper conversion
      res.status(200).send(await fragment.getData());
    }
  } catch (err) {
    logger.debug({ err });
    res.status(400).json(createErrorResponse(400, 'An unexpected error had occurred'));
  }
};
