if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://wburr89:Jan141989!@scribble-o5a4v.mongodb.net/admin?retryWrites=true&w=majority"
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost/scrbble-dev" };
}
