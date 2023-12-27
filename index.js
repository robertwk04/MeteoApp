import express from "express";
import axios, { Axios } from "axios"
import bodyParser from "body-parser";
const app = express();
const port = 3000;
const apiKey="5656037c36571fd1e8c3b61cd3764b73";
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render("index.ejs");
});
app.post('/locatie',async(req,res)=>
{ 
  const city=req.body.city;
  try {
    const response =await axios.get('https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=5656037c36571fd1e8c3b61cd3764b73&units=metric&lang=ro');
    const result=response.data;
    const response2 =await axios.get("https://api.openweathermap.org/data/2.5/forecast?lat="+result.coord.lat+"&lon="+result.coord.lon+"&units=metric&lang=ro&appid=5656037c36571fd1e8c3b61cd3764b73");
    const result2=response2.data;

    //Current Weather Variables
    const location=result.name+" ("+result.sys.country+"):";
    const today = new Date();
    const daysOfWeek = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
    const dayOfWeek = daysOfWeek[today.getDay()];
    //Prognose
    var meteo5d=[[],[],[],[],[],[]];
    let i=0;
    let j=0;
    let day=today.getDay();
    meteo5d[j].push({day:"Azi"}); //day on first position
    while(i<result2.cnt)
    {//declaring variables for result2[i]
     var timestamp = result2.list[i].dt;
     var data = new Date(timestamp * 1000);
     var temp=result2.list[i].main.temp.toFixed(1);
     var description=result2.list[i].weather[0].description;
     var wind=result2.list[i].wind.speed;
     var logo="https://openweathermap.org/img/wn/"+result2.list[i].weather[0].icon+"@2x.png";

    if(!(day===data.getDay()))
      {j++;
       day=data.getDay();
       meteo5d[j].push({day:daysOfWeek[day]});
      }
     meteo5d[j].push({hour:data.getHours(),
                      temp:temp,
                      description:description,
                      wind:wind,
                      logo:logo});
     i++;
    }
    res.render("weather.ejs", { location:location,
                                result:result ,
                                windDirection:windDescription(result.wind.deg),
                                logo:"https://openweathermap.org/img/wn/"+result.weather[0].icon+"@2x.png",
                                sunState:sunRiSetConvert(result.sys.sunrise,result.sys.sunset),
                                today:dayOfWeek,
                                DataResult2:meteo5d
                              });
} catch (error) {
  console.error("Failed to make request:", error.message);
  res.render("index.ejs",{error:"Locatia '"+city+"' nu a fost gasita.Incearca sa schimbi denumirea"});
}
});

function  windDescription(degree){
  if (degree>337.5) return 'Din Nord';
  if (degree>292.5) return 'Din Nord-Vest';
  if(degree>247.5) return 'Din Vest';
  if(degree>202.5) return 'Din Sud-Vest';
  if(degree>157.5) return 'Din Sud';
  if(degree>122.5) return 'Din Sud-Est';
  if(degree>67.5) return 'Din Est';
  if(degree>22.5){return 'Din Nord-Est';}
  return 'Din Nord';
}
function sunRiSetConvert(sunriseTimestamp,sunsetTimestamp){

const sunriseDate = new Date(sunriseTimestamp * 1000);
const sunsetDate = new Date(sunsetTimestamp * 1000);

const sunriseHours = sunriseDate.getHours().toString();
const sunriseMinutes = sunriseDate.getMinutes().toString().padStart(2, '0');

const sunsetHours = sunsetDate.getHours().toString();
const sunsetMinutes = sunsetDate.getMinutes().toString().padStart(2, '0');

return {sunrise:sunriseHours+":"+sunriseMinutes,
  sunset:sunsetHours+":"+sunsetMinutes};
}


app.listen(port, () => console.log(`App listening on port ${port}!`));