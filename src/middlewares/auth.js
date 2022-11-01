export default function (req, res, next) {
  if (req?.headers?.integration_hash !== process.env.INTEGRATION_HASH) {
    return res.status(401).send({
      message: 'Not authorized',
    });
  }

  return next();
}
