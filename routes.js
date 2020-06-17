const express = require("express");
const ExpressError = require("./expressError");

const app = express();

// for processing JSON:
app.use(express.json());

// for processing forms:
app.use(express.urlencoded({ extended: true }));


app.get("/mean", function (req, res, next) {
  try {
    const nums = req.query["nums"].split(",");
    const mean = nums.reduce((mean, val) => {
      if (isNaN(val)) {
        throw new ExpressError("Invalid number", 400);
      } else {
        return (mean + parseInt(val));
      }
    }, 0) / nums.length;
    return res.json({ operation: "mean", value: mean });

  } catch (err) {
    return next(err);
  }
});


app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status }
  });
});

app.listen(3000, function () {
  console.log("App on port 3000");
});