const notFound = (req, res, next) => {
  res.status(404).json({ error: `Cesta ${req.originalUrl} nebyla nalezena.` });
};

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;

  if (status >= 500) {
    console.error("[ERROR]", err);
  }

  // Surface Mongoose validation messages in a readable form.
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(" ") });
  }

  res.status(status).json({ error: err.message || "Něco se pokazilo." });
};

module.exports = { notFound, errorHandler };
