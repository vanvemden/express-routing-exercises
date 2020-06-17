const express = require("express");
const ExpressError = require("./expressError");

const app = express();

// for processing JSON:
app.use(express.json());

// for processing forms:
app.use(express.urlencoded({ extended: true }));


app.get("/mean", function (req, res, next) {

  if(!req.query["nums"]){
    throw new ExpressError("no number passed.", 400);
  }

  try {
    const nums = req.query["nums"].split(",");
    const mean = nums.reduce((mean, val) => {
      if (isNaN(val)) {
        throw new ExpressError(`${val} is not a number`, 400);
      } else {
        return (mean + parseInt(val));
      }
    }, 0) / nums.length;
    return res.json({ operation: "mean", value: mean });

  } catch (err) {
    return next(err);
  }
});

app.get("/median", function(req, res, next) {

  if(!req.query["nums"]){
    throw new ExpressError("no number passed.", 400);
  }

  const nums = req.query["nums"].split(",");
  const median = nums.sort(function(a, b){return a-b});
  
  for(let i = 0; i < median.length; i++) {
    if(isNaN(median[i])) {
      throw new ExpressError(`${median[i]} is not a number`, 400);
    } else {
      median[i] = Number(median[i]);
    }
  }

  let middle = Math.floor(median.length / 2);
  let result;
  if(median.length % 2 === 0) {
    result = (median[middle] + median[middle - 1]) / 2;
  } else {
    result = median[middle];
  }

  return res.json({ operation: "median", value: result });

});

app.get("/mode", function(req,res,next) {

  if(!req.query["nums"]){
    throw new ExpressError("no number passed.", 400);
  }
  
  const nums = req.query["nums"].split(",")
  let freqCounter = {};
  let maxCount = 0;
  let current = 0;

  for(let i = 0; i < nums.length; i++) {
    let val = nums[i];
    if(isNaN(val)) {
      throw new ExpressError(`${val} is not a number`, 400);
    } else {
      freqCounter[val] ? freqCounter[val]++ : freqCounter[val] = 1;
      if(freqCounter[val] > current) {
        maxCount = val;
        current = freqCounter[val];
      }
    }
  }

  return res.json({ operation: "mode", value: maxCount });
  
})

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