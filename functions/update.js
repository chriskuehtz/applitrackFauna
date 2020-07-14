const faunadb = require("faunadb");

const q = faunadb.query;

exports.handler = (event, context) => {
  /* configure faunaDB Client with our secret */
  console.log("went to /functions");
  //console.log(event);

  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  });
  const req = JSON.parse(event.body);
  console.log("req:", req);

  return client
    .query(
      q.Update(q.Ref(q.Collection("entries"), req.ref), {
        data: req.data,
      })
    )
    .then((response) => {
      console.log("inner call", response);
      return {
        message: "success",
        statusCode: 200,
        body: JSON.stringify(response),
      };
    })
    .catch((error) => {
      console.log("error", error);
      return {
        message: "error",
        statusCode: 400,
        body: JSON.stringify(error),
      };
    });
};
