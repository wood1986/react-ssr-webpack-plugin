function ReactSSRResponse(res, result) {
  const {body, statusCode} = result;
  res.writeHead(
    statusCode,
    {
      "Content-Type": body.startsWith("<!DOCTYPE html>") ? "text/html" : "text/plain",
    }
  );
  res.end(body);
  return;
}

module.exports = {
  ReactSSRResponse,
};
