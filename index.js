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
    const location=result.name+" ("+result.sys.country+"):";

    const today = new Date();
    const daysOfWeek = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
    const dayOfWeek = daysOfWeek[today.getDay()];

    res.render("weather.ejs", { location:location,
                                result:result ,
                                windDirection:windDescription(result.wind.deg),
                                logo:"https://openweathermap.org/img/wn/"+result.weather[0].icon+"@2x.png",
                                sunState:sunRiSetConvert(result.sys.sunrise,result.sys.sunset),
                                today:dayOfWeek
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