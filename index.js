const express = require("express");
const app = require("express")();
const axios = require("axios");
require("dotenv").config();

const port = 3000;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIyMjQzNjEwLCJpYXQiOjE3MjIyNDMzMTAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImJjNGY0ZGJjLTI3ZjMtNGE5ZS1iODdjLTI3OTgyOTQ2NzVmYiIsInN1YiI6Im1heWFuay5hcm9yYTFAcy5hbWl0eS5lZHUifSwiY29tcGFueU5hbWUiOiJBTUlUWSBVTklWRVJTSVRZIE5PSURBIiwiY2xpZW50SUQiOiJiYzRmNGRiYy0yN2YzLTRhOWUtYjg3Yy0yNzk4Mjk0Njc1ZmIiLCJjbGllbnRTZWNyZXQiOiJwdm9uaFJ6dExBSmtHUXlTIiwib3duZXJOYW1lIjoiTWF5YW5rIEFyb3JhIiwib3duZXJFbWFpbCI6Im1heWFuay5hcm9yYTFAcy5hbWl0eS5lZHUiLCJyb2xsTm8iOiJBMjMwNTIyMTMyNSJ9.6W07rlRIHAStT3vHGHZzFXkcMp-2sQpBvfpKNoig95k";

const windowSize = 10;


let windowCurrState = [];


async function fetchNumbers(numberid) {
  try {
    const response = await axios.get(`http://20.244.56.144/test/${numberid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching numbers:", error);
    return [];
  }
}

function calculateAverage(numbers) {
  if (numbers.length === 0) {
    return 0;
  }
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}


app.get("/numbers/:numberId", async (req, res) => {
  const numberId = req.params.numberId;
  let type;

  if (numberId === "e") {
    type = "even";
  } else if (numberId === "p") {
    type = "primes";
  } else if (numberId === "f") {
    type = "fibo";
  } else if (numberId === "r") {
    type = "rand";
  }
  const numbers = await fetchNumbers(type);


  const windowPrevState = [...windowCurrState];
  windowCurrState = [...windowCurrState, ...numbers.numbers];


  windowCurrState = windowCurrState.slice(-windowSize);

  const average = calculateAverage(windowCurrState);

  
  const response = {
    windowPrevState,
    windowCurrState,
    numbers: numbers.numbers,
    avg: average,
  };

  res.json(response);
});

app.listen(port, () => {
  console.log(`Average Calculator microservice listening on port ${port}`);
});
