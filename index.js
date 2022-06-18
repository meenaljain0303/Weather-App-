const http = require("http");
const fs=require("fs");
var requests = require("requests");

const homefile=fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempVal%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  
  return temperature;
}

const server= http.createServer((req,res) =>{
    if(req.url=="/")
    {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=73195d7f4ab6abd39715c66b27a19e04")
        .on("data",  (chunk) => {
          const objdata= JSON.parse(chunk);  // JSON format data converted to object 
          const arrData=[objdata]; //object passed in an array
          // console.log(arrData[0].main.temp); // data now which we will ahve will be array of an object.
          const realTimeData = arrData
          .map((val) => replaceVal(homefile, val))
          .join("");                       // whatever was showing in the terminal in array format will be hsown in the string fomrat now. 
          res.write(realTimeData);
          //console.log(realTimeData);

          
        })
        .on("end", (err) => {
          if (err) return console.log('connection closed due to errors', err);
          res.end();
          
        });
    } 
});

server.listen(8000, "127.0.0.1");
