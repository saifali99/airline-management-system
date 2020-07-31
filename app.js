const exp=require('express');
//const uuid = require('uuid');
const { v4: uuidv4 } = require('uuid');
var bodyParser = require('body-parser');
var session=require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var cookieParser = require('cookie-parser')
var mysql      = require('mysql');
var path = require('path');
var nodemailer = require('nodemailer');
const app=exp();
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'nodemysql',
  clearExpired: true //auto remove expired session tuples from db 
});
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
var sessionStore = new MySQLStore({}, connection);
var user='zain';
var pass='123';
module.exports.connection=connection;
var airlinePrototype=require("./controllers/airline.js").airlinePrototype;


app.set('view engine', 'ejs');
app.use(exp.static('public'));
//app.use(exp.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	genid: (req) => {
    console.log('Creating session Id');
    return uuidv4(); // use UUIDs for session IDs
  },
	name:'Session-Cookie',
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  store:sessionStore,
  cookie: {secure: false,maxAge: 5*60*100000 }//session cookie expire after 5 mins
}));

app.get("/Createdb",(req,res)=>
{
  connection.query("CREATE DATABASE nodemysql", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

//****************** GET ROUTES **************************//
app.get("/Airline_Index",(req,res)=>{
    console.log("session is:"+req.session.id);
      if(req.session.loggedin == true)
        {
        let post = "SELECT Airline_Name , Airline_ID , Airline_Owner , Airline_Origin , Airline_Abbreviation , Established_Year  FROM airline WHERE AIRLINE_ID = ?";
        let sql = connection.query(post,[req.session.user],(error,results,fields)=>
       {
          if(error)
          {
            res.render("Airline_Login.ejs",{I:0});
          }
          else
          {
            if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
            {
              req.session.username = results[0].Airline_Name;
              console.log(results , "Hello");
              res.render("Airline_Profile.ejs" , {F:results,I:2});

            }
            else
              res.render("Airline_Login.ejs",{I:0});
          }
  
       });
        }
      else    
      res.render("Airline_Index.ejs");
});
app.get("/Airline_Verification",(req,res)=>{  
      if(req.session.loggedin == true)
        {
        let post = "SELECT Airline_Name , Airline_ID , Airline_Owner , Airline_Origin , Airline_Abbreviation , Established_Year  FROM airline WHERE AIRLINE_ID = ?";
        let sql = connection.query(post,[req.session.user],(error,results,fields)=>
       {
          if(error)
          {
            res.render("Airline_Login.ejs",{I:0});
          }
          else
          {
            if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
            {
              req.session.username = results[0].Airline_Name;
              console.log(results , "Hello");
              res.render("Airline_Profile.ejs" , {F:results,I:2});

            }
            else
              res.render("Airline_Login.ejs",{I:0});
          }
  
       });
        }
      else    
    res.render("Airline_Verification.ejs",{I:2});
});
app.get("/Airline_Add_Flight",(req,res)=>{
  if(req.session.loggedin == true)
      res.render("Airline_Add_Flight.ejs",{N:req.session.username,I:2});
  else
     {
        console.log(req.session.loggedin);
        res.render("Airline_Index.ejs");
     }   
});
app.get("/Airline_Cancel_Flight",(req,res)=>{
  if(req.session.loggedin)
      res.render("Airline_Cancel_Flight.ejs",{N:req.session.username,I:2});
  else
     res.render("Airline_Index.ejs"); 
});
app.get("/Airline_Profile",(req,res)=>{
  if(req.session.loggedin)
      {
        let post = "SELECT Airline_Name , Airline_ID , Airline_Owner , Airline_Origin , Airline_Abbreviation , Established_Year  FROM airline WHERE AIRLINE_ID = ?";
        let sql = connection.query(post,[req.session.user],(error,results,fields)=>
       {
          if(error)
          {
            res.render("Airline_Login.ejs",{I:0});
          }
          else
          {
            if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
            {
              req.session.username = results[0].Airline_Name;
              console.log(results , "Hello");
              res.render("Airline_Profile.ejs" , {F:results,I:2});

            }
            else
              res.render("Airline_Login.ejs",{I:0});
          }
  
       });
      }  
  else
     res.render("Airline_Index.ejs"); 
});
app.get("/Airline_Delay_Flight",(req,res)=>{
  if(req.session.loggedin)
      res.render("Airline_Delay_Flight.ejs",{N:req.session.username,I:2});
  else
     res.render("Airline_Index.ejs"); 
});
app.get("/Airline_Flight_Discount",(req,res)=>{
  if(req.session.loggedin)
      res.render("Flight_Discount.ejs",{N:req.session.username,I:2});
  else
     res.render("Airline_Index.ejs"); 
});

app.get("/Airline_Flight_Scheduled",(req,res)=>{
  if(req.session.loggedin)
    {
    var D = new Date();  
    let post="select DISTINCT a.Airline_Name , t.Flight_Number ,t.Flight_Source ,t.Flight_Destination ,t.DEPARTURE_TIME ,t.ARRIVAL_TIME ,t1.NO_OF_SEATS AS S1 ,t1.PRICE AS P1 ,t2.NO_OF_SEATS AS S2 , t2.PRICE AS P2 from AIRLINE a, FLIGHT t ,FLIGHT_class t1 ,FLIGHT_class t2 where t1.FLIGHT_NUMBER = t.FLIGHT_NUMBER AND t1.FLIGHT_NUMBER = t2.FLIGHT_NUMBER AND t2.FLIGHT_NUMBER = t.FLIGHT_NUMBER AND t1.FLIGHT_CLASS <> t2.FLIGHT_CLASS AND t1.FLIGHT_CLASS = 'Business Class' AND t2.FLIGHT_CLASS = 'Economy Class' and t.Airline_ID = a.Airline_ID and t.FLIGHT_STATUS = 'Y' and a.Airline_ID = ? and t1.DEPARTURE_TIME = t2.DEPARTURE_TIME and t1.DEPARTURE_TIME = t.DEPARTURE_TIME and t.DEPARTURE_TIME = t2.DEPARTURE_TIME";
    let sql = connection.query(post,[req.session.user],(err, result, fields)=> {
      if (err) throw err;
      console.log(result ,req.session.username);
      res.render('Airline_Flight_Scheduled.ejs',{N:req.session.username,F:result});
    });
    }
  else
     res.render("Airline_Index.ejs"); 
});
app.get("/Airline_Flight_History",(req,res)=>{
  if(req.session.loggedin)
    {
    var D = new Date();  
    let post="select DISTINCT a.Airline_Name , t.Flight_Number ,t.Flight_Source ,t.Flight_Destination ,t.DEPARTURE_TIME ,t.ARRIVAL_TIME ,t1.NO_OF_SEATS AS S1 ,t1.PRICE AS P1 ,t2.NO_OF_SEATS AS S2 , t2.PRICE AS P2 from AIRLINE a, FLIGHT t ,FLIGHT_class t1 ,FLIGHT_class t2 where t1.FLIGHT_NUMBER = t.FLIGHT_NUMBER AND t1.FLIGHT_NUMBER = t2.FLIGHT_NUMBER AND t2.FLIGHT_NUMBER = t.FLIGHT_NUMBER AND t1.FLIGHT_CLASS <> t2.FLIGHT_CLASS AND t1.FLIGHT_CLASS = 'Business Class' AND t2.FLIGHT_CLASS = 'Economy Class' and t.Airline_ID = a.Airline_ID and a.Airline_ID = ? and t1.DEPARTURE_TIME = t2.DEPARTURE_TIME and t1.DEPARTURE_TIME = t.DEPARTURE_TIME and t.DEPARTURE_TIME = t2.DEPARTURE_TIME";
    let sql = connection.query(post,[req.session.user],(err, result, fields)=> {
      if (err) throw err;
      console.log(result ,req.session.username);
      res.render('Airline_Flight_History.ejs',{N:req.session.username,F:result});
    });
    }
  else
     res.render("Airline_Index.ejs"); 
});

//Airline_Flight_History
app.get("/Airline_Register",(req,res)=>{
  if(req.session.loggedin == true)
  {
        let post = "SELECT Airline_Name , Airline_ID , Airline_Owner , Airline_Origin , Airline_Abbreviation , Established_Year  FROM airline WHERE AIRLINE_ID = ?";
        let sql = connection.query(post,[req.session.user],(error,results,fields)=>
       {
          if(error)
          {
            res.render("Airline_Login.ejs",{I:0});
          }
          else
          {
            if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
            {
              req.session.username = results[0].Airline_Name;
              console.log(results , "Hello");
              res.render("Airline_Profile.ejs" , {F:results,I:2});

            }
            else
              res.render("Airline_Login.ejs",{I:0});
          }
  
       });
  }
  else    
  res.render("Airline_Register.ejs",{I:2});
});

app.get("/Airline_Login",(req,res)=>{
  if(req.session.loggedin == true)
  {
        let post = "SELECT Airline_Name , Airline_ID , Airline_Owner , Airline_Origin , Airline_Abbreviation , Established_Year  FROM airline WHERE AIRLINE_ID = ?";
        let sql = connection.query(post,[req.session.user],(error,results,fields)=>
       {
          if(error)
          {
            res.render("Airline_Login.ejs",{I:0});
          }
          else
          {
            if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
            {
              req.session.username = results[0].Airline_Name;
              console.log(results , "Hello");
              res.render("Airline_Profile.ejs" , {F:results,I:2});

            }
            else
              res.render("Airline_Login.ejs",{I:0});
          }
  
       });
  }
  else    
  res.render("Airline_Login.ejs",{I:2});
});
app.get("/Logout",(req,res)=>{
req.session.user = undefined;
req.session.loggedin = false; 
req.session.username = undefined;  
res.render("Airline_Index.ejs");
});

//****************** GET ROUTES **************************//


//****************** POST ROUTES **************************//


app.post("/Signup_Data",(req,res)=>
{
  
  var AirlineID1 = req.body.Airline_ID;
  var AirlineName1 = req.body.Airline_Name;
  var AirlineOwner = req.body.AirlineOwner; 
  var AirlineOrigin = req.body.AirlineOrigin;
  var AirlineAbbreviation = req.body.AirlineAbbrevation;
  var Established = req.body.AirlineEstablished;
  var AirlinePassword1 = req.body.Airline_Password;
  var Airline_Confirm = req.body.Airline_Password2;
  console.log(AirlineID1,AirlineName1,AirlinePassword1,Airline_Confirm);
  if(AirlinePassword1 == Airline_Confirm )
  {
    req.session.code = Math.floor((Math.random() * 100000) + 200000);
    var values = [AirlineID1,AirlineName1,AirlinePassword1,'N',AirlineOwner,AirlineOrigin,AirlineAbbreviation,Established,req.session.code];
    var sql = "INSERT INTO airline (Airline_ID, Airline_Name , Airline_Password ,Status,Airline_Owner , Airline_Origin , Airline_Abbreviation , Established_Year,Verification_Code) VALUES (?,?,?,?,?,?,?,?,?)";
    console.log(req.session.code);
    connection.query(sql,values, function (err, result) {
      if (err)
      { 
        console.log(err);
        message = "Signup Is Unsuccessful";
        res.render("Airline_Register.ejs",{I:0});
      }
      else
      { 

          var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'FlyHighTravellers@gmail.com',
            pass: 'flyhigh123'
          }
        });

        var mailOptions = {
          from: 'FlyHighTravellers@gmail.com',
          to: AirlineID1,
          subject:'This Mail Is Generated For University Project Purpose',
          text: `Your Verification code is:` + req.session.code ,
          //html: '<h1>Hello Partner</h1><p>Your Confirmation Code Is :1234567</p>'        
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error)
         {
            console.log(error);
          }
        else
         {
            console.log('Email sent: ' + info.response);
        }
      });
      res.render("Airline_Verification.ejs",{I:1}); 
    }  
  }); 
  } 
  else
  {
    res.render("Airline_Register.ejs",{I:0});
  }
});

app.post("/Login_Data",(req,res)=>
{
  var Airline_ID = req.body.ID;
  var Airline_Password = req.body.Password;
  console.log(Airline_ID);
  let message;
  let post = "SELECT AIRLINE_ID ,Airline_Name , Airline_Password , Status FROM airline WHERE AIRLINE_ID = ? AND AIRLINE_PASSWORD = ?";
  let sql = connection.query(post,[Airline_ID,Airline_Password],(error,results,fields)=>
       {
          if(error)
          {
            console.log("Error1");
            res.render("Airline_Login.ejs",{I:0});
          }
          else
          {
            if(results!=undefined && results.RowDataPacket != 0 && results.length != 0 && results[0].Status != 'N')
            {
              console.log("Part1");
              req.session.user = Airline_ID;
              req.session.loggedin = true; 
              console.log(results[0].Airline_Name);
              req.session.username = results[0].Airline_Name;
              let post = "SELECT Airline_Name , Airline_ID , Airline_Owner , Airline_Origin , Airline_Abbreviation , Established_Year  FROM airline WHERE AIRLINE_ID = ?";
              let sql = connection.query(post,[req.session.user],(error,results,fields)=>
              {
                if(error)
                {
                  console.log("Error2" , results);
                  res.render("Airline_Login.ejs",{I:0});
                }
                else
                {
                  if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
                  {

                    req.session.username = results[0].Airline_Name;
                    console.log(results , "Hello");
                    res.render("Airline_Profile.ejs" , {F:results,I:2});
                  }
                  else
                    {
                      console.log("Error3");
                      res.render("Airline_Login.ejs",{I:0});
                    }
                }
  
              });              
            }
            else
            {
              console.log("Error4");
              res.render("Airline_Login.ejs",{I:0});
            }
          }
  
       });
});  
 
//AirlineVerify
app.post("/AirlineVerify",(req,res)=>
{
  var Airline_ID = req.body.AirlineID;
  var Airline_Code = req.body.Vcode;
  console.log(Airline_ID , Airline_Code , req.session.code);

  let post = "SELECT Verification_Code , STATUS FROM airline WHERE AIRLINE_ID = ?";
  let sql = connection.query(post,[Airline_ID],(error,results,fields)=>
       {
        console.log(results);
          if(error)
          {
            res.render("Airline_Verification.ejs",{I:0});
          }
          else
          {
            if(results!=undefined && results.RowDataPacket != 0 && results.length != 0 && results[0].Status != 'Y')
            {

              if (results[0].Verification_Code == Airline_Code )
                {
                  console.log("hello" , results[0].Verification_Code ,Airline_Code );
                  let post = "Update AIRLINE SET STATUS = ? WHERE AIRLINE_ID = ? ";
                  let sql = connection.query(post,['Y',Airline_ID],(error,results,fields)=>
                    {
                      console.log(results);
                      if(error)
                      {
                        res.render("Airline_Verification.ejs",{I:0});
                      }
                      else
                      {
                        if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
                        {
                          res.render("Airline_Login.ejs" , {I:1});
                        }
                        else
                          res.render("Airline_Verification.ejs",{I:0});
                      }
                
                    });
                }
                else
                {
                  res.render("Airline_Verification.ejs",{I:0}); 
                }
            }
            else
              res.render("Airline_Verification.ejs",{I:0});
          }
  
       });
  });

app.post("/Change",(req,res)=>
{
  
  var AirlinePassword = req.body.OldPassword;
  var AirlinePassword1 = req.body.NewPassword;
  console.log(AirlinePassword,AirlinePassword1);
  var values = [AirlinePassword1,req.session.user,AirlinePassword];
  var sql = "Update AIRLINE SET AIRLINE_PASSWORD = ? WHERE AIRLINE_ID = ? AND AIRLINE_PASSWORD = ?";
  connection.query(sql,values, function (err, results) {
    if (err)
    { 
      console.log(err); 
    }
    else
    { 

      if(results!=undefined && results.RowDataPacket != 0 && results.length != 0 &&results.affectedRows!= 0)
      {  
        console.log(results);
        let post = "SELECT Airline_Name FROM airline WHERE AIRLINE_ID = ?";
        let sql = connection.query(post,[req.session.user],(error,results,fields)=>
       {
          if(error)
          {
            res.render("Airline_Login.ejs",{I:0});
          }
          else
          {
            if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
            {
              res.render("Airline_Profile.ejs" , {N:results[0].Airline_Name , I:1});


            }
            else
              res.render("Airline_Login.ejs",{I:0});
          }
  
       });
      }
      else
      {
        let post = "SELECT Airline_Name FROM airline WHERE AIRLINE_ID = ?";
        let sql = connection.query(post,[req.session.user],(error,results,fields)=>
       {
          if(error)
          {
            res.render("Airline_Login.ejs",{I:0});
          }
          else
          {
            if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
            {
              res.render("Airline_Profile.ejs" , {N:results[0].Airline_Name , I:0});


            }
            else
              res.render("Airline_Login.ejs",{I:0});
          }
  
       });
      }  
    } 
  });
  
});



app.post("/FlightAdd",(req,res)=>
{
  var Airline_ID = req.session.user;
  var Flight_Number = req.body.FlightNumber;
  var Flight_Source = req.body.FlightSource;
  var Flight_Destination = req.body.FlightDestination;
  var Flight_Departure = req.body.FlightDeparture;
  var Flight_Arrival = req.body.FlightArrival;
  var Flight_BClass = req.body.FlightBSeat;
  var Flight_EClass = req.body.FlightESeat;
  var Flight_BPrice = req.body.FlightBPrice;
  var Flight_EPrice = req.body.FlightEPrice;
  var today = new Date();
  var d1 = new Date(today.getFullYear() ,today.getMonth(),(today.getDate() +2),today.getHours(),today.getMinutes());
  Flight_Departure = new Date(Flight_Departure);
  Flight_Arrival = new Date(Flight_Arrival);

  if(Flight_Departure < Flight_Arrival && Flight_Departure > d1 ){
  console.log(Airline_ID);
  let message;
  let post = "INSERT INTO FLIGHT (FLIGHT_NUMBER, FLIGHT_SOURCE , FLIGHT_DESTINATION , DEPARTURE_TIME , ARRIVAL_TIME , AIRLINE_ID,FLIGHT_STATUS) VALUES (?,?,?,?,?,?,?)";
  let sql = connection.query(post,[Flight_Number,Flight_Source,Flight_Destination,Flight_Departure ,Flight_Arrival,Airline_ID,'Y'],(error,results,fields)=>
       {
          if(error)
          {
            console.log("Error1");
             res.render("Airline_Add_Flight.ejs",{N:req.session.username,I:0});
          }
          else
          {
              let post = "INSERT INTO FLIGHT_CLASS (FLIGHT_NUMBER,DEPARTURE_TIME, FLIGHT_CLASS , NO_OF_SEATS,PRICE ) VALUES (?,?,?,?,?)";
              let sql = connection.query(post,[Flight_Number,Flight_Departure,"Economy Class" ,Flight_EClass,Flight_EPrice],(error,results,fields)=>
              {
                if(error)
                {
                    console.log("Error2");
                    res.render("Airline_Add_Flight.ejs",{N:req.session.username,I:0});             
                }
                else
                {
                  let post = "INSERT INTO FLIGHT_CLASS (FLIGHT_NUMBER,DEPARTURE_TIME, FLIGHT_CLASS , NO_OF_SEATS,PRICE ) VALUES (?,?,?,?,?)";
                  let sql = connection.query(post,[Flight_Number,Flight_Departure,"Business Class" ,Flight_BClass,Flight_BPrice],(error,results,fields)=>
                  {
                    if(error)
                    {
                      console.log("Error3");
                      res.render("Airline_Add_Flight.ejs",{N:req.session.username,I:0});
                    }
                    else
                    {
                      res.render("Airline_Add_Flight.ejs",{N:req.session.username,I:1});
                    }
  
                  });
                }
  
              });
          }
  
       });
}
else
{
  res.render("Airline_Add_Flight.ejs",{N:req.session.username,I:0});
}
});  

app.post("/FlightCancel",(req,res)=>
{
  console.log(req.session.user);
  var Airline_ID = req.session.user;
  var Flight_Number = req.body.FlightNumber;
  var DepartureTime = req.body.DepartureTime;
  DepartureTime = new Date(DepartureTime);
  console.log(Airline_ID , DepartureTime);
  let message;
  let post = "DELETE FROM FLIGHT_CLASS WHERE Flight_Number = ? AND DEPARTURE_TIME = ?";
              let sql = connection.query(post,[Flight_Number,DepartureTime],(error,results,fields)=>
              {
                console.log(results);
                if(error)
                {
                    res.render("Airline_Cancel_Flight.ejs",{N:req.session.username,I:0});             
                }
                else
                {
                  if(results!=undefined && results.affectedRows != 0 && results.length != 0)
                    {
                      let post = "DELETE FROM FLIGHT WHERE FLIGHT_NUMBER = ? AND Airline_ID = ? AND DEPARTURE_TIME = ?";
                      let sql = connection.query(post,[Flight_Number,Airline_ID,DepartureTime],(error,results,fields)=>
                      {
                        console.log(results , req.body.FlightNumber);
                        if(error)
                        {
                          res.render("Airline_Cancel_Flight.ejs",{N:req.session.username,I:0});
                        }
                        else
                        {
                          if(results!=undefined && results.affectedRows != 0 && results.length != 0)
                          {
                            res.render("Airline_Cancel_Flight.ejs",{N:req.session.username,I:1});
                          }
                         else
                          {
                             res.render("Airline_Cancel_Flight.ejs",{N:req.session.username,I:0});
                          }  
                        }
  
                    });
                  }
                  else
                    res.render("Airline_Cancel_Flight.ejs",{N:req.session.username,I:0});   
                }
              });
});  

app.post("/FlightDelay",(req,res)=>
{
  console.log(req.session.user);
  var Airline_ID = req.session.user;
  var Flight_Number = req.body.FlightNumber;
  var Departure = req.body.Departure;
  var Arrival = req.body.Arrival;
  var OldDeparture = req.body.OldDeparture;
  console.log(Airline_ID);
  OldDeparture = new Date(OldDeparture);
  let message;
  let post = "UPDATE FLIGHT_CLASS SET DEPARTURE_TIME = ?,ARRIVAL_TIME = ? WHERE Flight_Number = ? AND Airline_ID = ? AND DEPARTURE_TIME = ?";
              let sql = connection.query(post,[Departure , Arrival , Flight_Number , Airline_ID , OldDeparture],(error,results,fields)=>
              {
                console.log(results);
                if(error)
                {
                    res.render("Airline_Delay_Flight.ejs",{N:req.session.username,I:0});             
                }
                else
                {
                  if(results!=undefined && results.affectedRows != 0 && results.length != 0)
                    {
                      let post = "UPDATE FLIGHT SET DEPARTURE_TIME = ?,ARRIVAL_TIME = ? WHERE Flight_Number = ? AND Airline_ID = ? AND DEPARTURE_TIME = ?";
                      let sql = connection.query(post,[Departure , Arrival , Flight_Number , Airline_ID , OldDeparture],(error,results,fields)=>
                      {
                        console.log(results);
                        if(error)
                        {
                            res.render("Airline_Delay_Flight.ejs",{N:req.session.username,I:0});             
                         }
                        else
                        {
                          if(results!=undefined && results.affectedRows != 0 && results.length != 0)
                          {
                      
                           res.render("Airline_Delay_Flight.ejs",{N:req.session.username,I:1}); 
                          }
                        else
                        {
                          res.render("Airline_Delay_Flight.ejs",{N:req.session.username,I:0});
                        }
  
                    
                  }   
                  });
                      
               }
                else
                {
                      res.render("Airline_Delay_Flight.ejs",{N:req.session.username,I:0});
               }
  
                    
                }   
              });
});              



app.post("/Discount",(req,res)=>
{
  console.log(req.session.user);
  var Airline_ID = req.session.user;
  var Flight_Number = req.body.FlightNumber;
  var Departure = req.body.Departure;
  var Flight_Class = req.body.FlightClass;
  var Discount = req.body.Discount;
  Discount = Discount / 100;
  console.log(Airline_ID);
  Departure = new Date(Departure);
  let message;
  let post = "UPDATE FLIGHT_CLASS SET Price = Price - Price * ? WHERE Flight_Number = ? AND DEPARTURE_TIME = ? AND Flight_Class = ?";
              let sql = connection.query(post,[Discount , Flight_Number, Departure , Flight_Class],(error,results,fields)=>
              {
                console.log(results);
                if(error)
                {
                    res.render("Flight_Discount.ejs",{N:req.session.username,I:0});             
                }
                else
                {
                  if(results!=undefined && results.affectedRows != 0 && results.length != 0)
                    {
                      
                      res.render("Flight_Discount.ejs",{N:req.session.username,I:1}); 
                    }
                    else
                    {
                      res.render("Flight_Discount.ejs",{N:req.session.username,I:0});
                    }   
                }

            });
});              













// --------------------------------------Passenger Portal ---------------------------------------------------------//
// ***************************************************************************************************************//

app.get("/Passenger_Ticket",(req,res)=>{
    req.session.Departure_Time = new Date(req.session.Departure_Time);
    req.session.Arrival_Time = new Date(req.session.Arrival_Time);
    console.log(req.session.customer,req.session.Departure_Time.toString());
    res.render("Passenger_Ticket.ejs",{A:req.session.Airline_ID,B:req.session.Flight_Source,C:req.session.ticket_code,D:req.session.Flight_Destination,E:req.session.customer,F:req.session.Flight_Class,G:req.session.Flight_Number,H:req.session.Departure_Time.toLocaleString(),I:req.session.Arrival_Time.toLocaleString()});
});



app.get("/Passenger_Index",(req,res)=>{
  if(req.session.customer != undefined)
    {
      console.log(req.session.customer);
      let post = "SELECT First_Name , Last_Name , Customer_ID ,CNIC,Contact_Number,Address FROM Customer WHERE Customer_ID = ?";
              let sql = connection.query(post,[req.session.user1],(error,results,fields)=>
              {
                if(error)
                {
                  console.log("Error2" , results);
                  res.render("Passenger_Login.ejs",{I:0});
                }
                else
                {
                  if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
                  {

                    req.session.customer = results[0].First_Name;
                    console.log(results , "Hello");
                    res.render("Passenger_Profile.ejs" , {F:results,I:2});
                  }
                  else
                    {
                      console.log("Error3");
                      res.render("Passenger_Login.ejs",{I:0});
                    }
                }
  
              }); 
    }
  else  
      res.render("Passenger_Index.ejs");
});
app.get("/Passenger_About",(req,res)=>{
  if (req.session.passenger)
    res.render("Passenger_About.ejs");
  else
    res.render("Passenger_Index.ejs");
});
app.get("/Passenger_Flight_View",(req,res)=>{
  if (req.session.passenger)
    {
    let post="select DISTINCT a.Airline_Name , t.Flight_Number ,t.Flight_Source ,t.Flight_Destination ,t.DEPARTURE_TIME ,t.ARRIVAL_TIME ,t1.Flight_Class , t1.NO_OF_SEATS AS S1 ,t1.PRICE AS P1  from AIRLINE a, FLIGHT t ,FLIGHT_class t1 where t1.FLIGHT_NUMBER = t.FLIGHT_NUMBER  AND  t.Airline_ID = a.Airline_ID and t.FLIGHT_STATUS = 'Y' and t1.DEPARTURE_TIME = t.DEPARTURE_TIME and t.FLIGHT_NUMBER = t1.FLIGHT_NUMBER and t1.NO_OF_SEATS > 0";
    let sql = connection.query(post,(err, result, fields)=> {
      if (err) throw err;
      console.log(result ,req.session.username);
      res.render('Passenger_Flight_View.ejs',{N:req.session.username,F:result});
    });
  }
  else
     res.render("Passenger_Index.ejs");
     
});
app.get("/Passenger_Book_Flight",(req,res)=>{
  if (req.session.passenger)
    res.render("Passenger_Book_Flight.ejs");
  else
    res.render("Passenger_Index.ejs");
});
app.get("/Passenger_Cancel_Flight",(req,res)=>{
  if (req.session.passenger)
  {
    let post="select DISTINCT a.Airline_Name , t.Flight_Number ,t.Flight_Source ,t.Flight_Destination ,t.DEPARTURE_TIME ,t.ARRIVAL_TIME ,t1.Flight_Class ,t1.PRICE AS P1 , t2.Ticket_ID from AIRLINE a, FLIGHT t ,FLIGHT_class t1 , ticket t2 , customer c where t1.FLIGHT_NUMBER = t.FLIGHT_NUMBER AND t.Airline_ID = a.Airline_ID and t.FLIGHT_STATUS = 'Y' and t1.DEPARTURE_TIME = t.DEPARTURE_TIME and t.FLIGHT_NUMBER = t1.FLIGHT_NUMBER and t2.Flight_Number = t1.Flight_Number and t2.DEPARTURE_TIME = t1.Departure_Time and t2.Flight_Class = t1.Flight_Class and c.customer_id = ?" ;
    let sql = connection.query(post,[req.session.user1],(err, result, fields)=> {
      if (err) throw err;
      console.log(result);
      res.render("Passenger_Cancel_Flight.ejs",{F:result});
    });

    
  }
  else
   res.render("Passenger_Index.ejs"); 
});
//

app.get("/Passenger_Flight_History",(req,res)=>{
  if (req.session.passenger)
  {
    let post="select DISTINCT a.Airline_Name , t.Flight_Number ,t.Flight_Source ,t.Flight_Destination ,t.DEPARTURE_TIME ,t.ARRIVAL_TIME ,t1.Flight_Class ,t1.PRICE AS P1 , t2.Ticket_ID from AIRLINE a, FLIGHT t ,FLIGHT_class t1 , ticket t2 , customer c where t1.FLIGHT_NUMBER = t.FLIGHT_NUMBER AND t.Airline_ID = a.Airline_ID  and t1.DEPARTURE_TIME = t.DEPARTURE_TIME and t.FLIGHT_NUMBER = t1.FLIGHT_NUMBER and t2.Flight_Number = t1.Flight_Number and t2.DEPARTURE_TIME = t1.Departure_Time and t2.Flight_Class = t1.Flight_Class and c.customer_id = ?" ;
    let sql = connection.query(post,[req.session.user1],(err, result, fields)=> {
      if (err) throw err;
      console.log(result);
      console.log(req.session.user1);
      res.render("Passenger_Flight_History.ejs",{F:result});
    });

    
  }
  else
   res.render("Passenger_Index.ejs"); 
});









app.get("/Passenger_Profile",(req,res)=>{
  console.log(req.session.passenger);
  if (req.session.passenger)
  {
              let post = "SELECT First_Name , Last_Name , Customer_ID ,CNIC,Contact_Number,Address FROM Customer WHERE Customer_ID = ?";
              let sql = connection.query(post,[req.session.user1],(error,results,fields)=>
              {
                if(error)
                {
                  console.log("Error2" , results);
                  res.render("Passenger_Login.ejs",{I:0});
                }
                else
                {
                  if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
                  {

                    req.session.customer = results[0].First_Name;
                    console.log(results , "Hello");
                    res.render("Passenger_Profile.ejs" , {F:results,I:2});
                  }
                  else
                    {
                      console.log("Error3");
                      res.render("Passenger_Login.ejs",{I:0});
                    }
                }
  
              }); 
  }
  else
   res.render("Passenger_Index.ejs");
});
app.get("/Passenger_Login",(req,res)=>{
    if(req.session.customer != undefined)
    {
      let post = "SELECT First_Name , Last_Name , Customer_ID ,CNIC,Contact_Number,Address FROM Customer WHERE Customer_ID = ?";
              let sql = connection.query(post,[req.session.user1],(error,results,fields)=>
              {
                if(error)
                {
                  console.log("Error2" , results);
                  res.render("Passenger_Login.ejs",{I:0});
                }
                else
                {
                  if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
                  {

                    req.session.customer = results[0].First_Name;
                    console.log(results , "Hello");
                    res.render("Passenger_Profile.ejs" , {F:results,I:2});
                  }
                  else
                    {
                      console.log("Error3");
                      res.render("Passenger_Login.ejs",{I:0});
                    }
                }
  
              }); 
      
    }
  else
    res.render("Passenger_Login.ejs",{I:2});
});
app.get("/Passenger_Verify",(req,res)=>{
    if(req.session.customer != undefined)
    {
      let post = "SELECT First_Name , Last_Name , Customer_ID ,CNIC,Contact_Number,Address FROM Customer WHERE Customer_ID = ?";
              let sql = connection.query(post,[req.session.user1],(error,results,fields)=>
              {
                if(error)
                {
                  console.log("Error2" , results);
                  res.render("Passenger_Login.ejs",{I:0});
                }
                else
                {
                  if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
                  {

                    req.session.customer = results[0].First_Name;
                    console.log(results , "Hello");
                    res.render("Passenger_Profile.ejs" , {F:results,I:2});
                  }
                  else
                    {
                      console.log("Error3");
                      res.render("Passenger_Login.ejs",{I:0});
                    }
                }
  
              }); 
    }
  else
      res.render("Passenger_Verify.ejs",{I:2});
});
app.get("/Passenger_Signup",(req,res)=>{
    if(req.session.customer != undefined)
      {
        let post = "SELECT First_Name , Last_Name , Customer_ID ,CNIC,Contact_Number,Address FROM Customer WHERE Customer_ID = ?";
              let sql = connection.query(post,[req.session.user1],(error,results,fields)=>
              {
                if(error)
                {
                  console.log("Error2" , results);
                  res.render("Passenger_Login.ejs",{I:0});
                }
                else
                {
                  if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
                  {

                    req.session.customer = results[0].First_Name;
                    console.log(results , "Hello");
                    res.render("Passenger_Profile.ejs" , {F:results,I:2});
                  }
                  else
                    {
                      console.log("Error3");
                      res.render("Passenger_Login.ejs",{I:0});
                    }
                }
  
              }); 
      }
  else
      res.render("Passenger_Signup.ejs",{I:2});
});
app.get("/Logout1",(req,res)=>{
req.session.customer = undefined;
req.session.passenger = false; 
//req.session.username = undefined;  
res.render("Passenger_Index.ejs");
});

app.post("/Passenger_Signup1",(req,res)=>{

var Customer_ID = req.body.email ;
var First_Name = req.body.firstname;
var Last_Name = req.body.lastname;
var CNIC = req.body.cnic;
var Contact_Number = req.body.contact;
var Address = req.body.address;
var Password = req.body.password;
var Confirm_Password = req.body.confirmPassword;
var PassportNumber = req.body.PassportNumber;

if(Confirm_Password == Password)
{

    req.session.code1 = Math.floor((Math.random() * 100000) + 200000);
    var values = [Customer_ID,First_Name,Last_Name,CNIC,Password,'N',req.session.code1,Contact_Number,Address,PassportNumber];
    var sql = "INSERT INTO Customer (Customer_ID,First_Name,Last_Name,CNIC,Password,STATUS,CODE,Contact_Number,Address,Passport_Number) VALUES (?,?,?,?,?,?,?,?,?,?)";
    console.log(req.session.code1);
    console.log(PassportNumber); 
    connection.query(sql,values, function (err, result) {
      if (err)
      { 
        console.log(err);
        res.render("Passenger_Signup.ejs",{I:0});
      }
      else
      { 

          var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'FlyHighTravellers@gmail.com',
            pass: 'flyhigh123'
          }
        });

        var mailOptions = {
          from: 'FlyHighTravellers@gmail.com',
          to: Customer_ID,
          subject:'This Mail Is Generated For University Project Purpose',
          text: `Your Verification code is:` + req.session.code1 ,
          //html: '<h1>Hello Partner</h1><p>Your Confirmation Code Is :1234567</p>'        
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error)
         {
            console.log(error);
          }
        else
         {
            console.log('Email sent: ' + info.response);
        }
      });
      res.render("Passenger_Verify.ejs",{I:1}); 
    }  
  }); 
  }   

else
{

  res.render("Passenger_Signup.ejs",{I:0});  

}



});




app.post("/Passenger_Verify1",(req,res)=>
{
  var Customer_ID = req.body.email;
  var Code = req.body.code;
  console.log(Customer_ID , Code , req.session.code1);

  let post = "SELECT Code , STATUS FROM Customer WHERE Customer_ID = ?";
  let sql = connection.query(post,[Customer_ID],(error,results,fields)=>
       {
        console.log(results);
          if(error)
          {
            res.render("Passenger_Verify.ejs",{I:0});
          }
          else
          {
            console.log(results[0].STATUS);
            if(results!=undefined && results.RowDataPacket != 0 && results.length != 0 && results[0].STATUS != 'Y')
            {

              console.log("Hye");
              if (results[0].Code == Code )
                {
                  console.log("hello" , results[0].Code ,Code );
                  let post = "Update Customer SET STATUS = ? WHERE Customer_ID = ? ";
                  let sql = connection.query(post,['Y',Customer_ID],(error,results,fields)=>
                    {
                      console.log(results);
                      if(error)
                      {
                        res.render("Passenger_Verify.ejs",{I:0});
                      }
                      else
                      {
                        if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
                        {
                          res.render("Passenger_Login.ejs",{I:1});
                        }
                        else
                          res.render("Passenger_Verify.ejs",{I:0});
                      }
                
                    });
                }
                else
                {
                  res.render("Passenger_Verify.ejs",{I:0}); 
                }
            }
            else
              res.render("Passenger_Verify.ejs",{I:0});
          }
  
       });
  });


app.post("/Passenger_Login1",(req,res)=>
{
  var Customer_ID = req.body.email;
  var Password = req.body.password;
  console.log(Customer_ID ,Password);
  let post = "SELECT Customer_ID ,First_Name , Password , STATUS FROM Customer WHERE Customer_ID = ? AND Password = ?";
  let sql = connection.query(post,[Customer_ID,Password],(error,results,fields)=>
       {
          if(error)
          {
            console.log("Error1");
            res.render("Passenger_Login.ejs",{I:0});
          }
          else
          {
            console.log(results);
            if(results!=undefined && results.RowDataPacket != 0 && results.length != 0 && results[0].STATUS != 'N')
            {
              console.log("Part1");
              req.session.user1 = Customer_ID;
              req.session.passenger = true; 
              console.log(results[0].FIRST_NAME,req.session.passenger);
              req.session.customer = results[0].First_Name;
              console.log(req.session.customer);


              let post = "SELECT First_Name , Last_Name , Customer_ID ,CNIC,Contact_Number,Address FROM Customer WHERE Customer_ID = ?";
              let sql = connection.query(post,[req.session.user1],(error,results,fields)=>
              {
                if(error)
                {
                  console.log("Error2" , results);
                  res.render("Passenger_Login.ejs",{I:0});
                }
                else
                {
                  if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
                  {

                    req.session.customer = results[0].FIRST_NAME;
                    console.log(results , "Hello");
                    res.render("Passenger_Profile.ejs" , {F:results,I:1});
                  }
                  else
                    {
                      console.log("Error3");
                      res.render("Passenger_Login.ejs",{I:0});
                    }
                }
  
              });              
            }
            else
            {
              console.log("Error4");
              res.render("Passenger_Login.ejs",{I:0});
            }
          }
  
       });
});  
 

 
app.post("/Book",(req,res)=>{
  var card = req.body.cardNumber;
  var Limit = req.body.cardLimiit;
  var seats = req.body.seats;
  if(seats > req.session.Seat || seats * req.session.Price > Limit)
  {
    console.log("Error1" );

    res.render("Passenger_Book_Flight.ejs");
  }
  else
  {
    console.log("Error2");
    console.log(seats);
    Limit = Limit - (seats * req.session.Price);
    req.session.Seat = req.session.Seat - seats ;
    console.log(req.session.Seat);
    req.session.Departure_Time = new Date(req.session.Departure_Time);
    console.log(req.session.Seat , req.session.Flight_Number , req.session.Airline_ID , req.session.Departure_Time ,req.session.Flight_Class); 
    let post = "UPDATE FLIGHT_CLASS SET  NO_OF_SEATS = ? WHERE Flight_Number = ? AND DEPARTURE_TIME = ? AND Flight_Class = ?";
    let sql = connection.query(post,[req.session.Seat, req.session.Flight_Number ,req.session.Departure_Time ,req.session.Flight_Class ],(error,results,fields)=>
                      {
                        console.log(results);
                        if(error)
                        {
                          
                            res.render("Passenger_Book_Flight.ejs");             
                         }
                        else
                        {
                          console.log("Error4");
                          if(results!=undefined && results.affectedRows != 0 && results.length != 0)
                          {
                            console.log(req.session.user1);
                            let post = "update Customer set Card_Number = ?,Balance = ?  where Customer_ID = ?";
                            let sql = connection.query(post,[card , Limit ,req.session.user1],(error,results,fields)=>
                            {
                              console.log(results);
                              if(error)
                              {
                                  console.log("Error6");
                                  res.render("Passenger_Book_Flight.ejs");             
                              }
                              else
                              {
                                if(results!=undefined && results.affectedRows != 0 && results.length != 0)
                              {
                                console.log("Error7");
                                var Ticket_Code = Math.floor((Math.random() * 100000) + 200000);
                                let post = "insert into ticket (Ticket_ID,Flight_Class,CUSTOMER_ID,FLIGHT_NUMBER,DEPARTURE_TIME,No_Of_Ticket) values(?,?,?,?,?,?)";
                                let sql = connection.query(post,[Ticket_Code,req.session.Flight_Class,req.session.user1,req.session.Flight_Number,req.session.Departure_Time,seats],(error,results,fields)=>
                                {
                                  console.log(results);
                                  if(error)
                                  {
                                    console.log("Error8");
                                    res.render("Passenger_Book_Flight.ejs");             
                                  }
                                  else
                                  {
                                    console.log("Error9");
                                    if(results!=undefined && results.affectedRows != 0 && results.length != 0)
                                  { 
                                    console.log("Error10");
                                    req.session.ticket_code = Ticket_Code;
                                    res.redirect("/Passenger_Ticket");  
                                  }
                                  else
                                  {
                                    console.log("Error11");
                                    res.render("Passenger_Book_Flight.ejs"); 
                                  }

                                  }   
                                });
                              }
                              else
                              {
                                console.log("Error12");
                                res.render("Passenger_Book_Flight.ejs"); 
                              }
  
                    
                              }   
                            });
                       
                          }
                        else
                        {
                          console.log("Error13");
                          res.render("Passenger_Book_Flight.ejs"); 
                        }
  
                    
                  }   
                  });

  }
});


app.get('/tripData1/:Airline_ID/:Flight_Number/:Flight_Source/:Flight_Destination/:Departure_Time/:Arrival_Time/:Flight_Class/:Price/:Seat',(req,res)=>{
req.session.Airline_ID = req.params.Airline_ID;
req.session.Flight_Number = req.params.Flight_Number;
req.session.Flight_Source = req.params.Flight_Source;
req.session.Flight_Destination = req.params.Flight_Destination;
req.session.Departure_Time = new Date (req.params.Departure_Time);
req.session.Arrival_Time = new Date (req.params.Arrival_Time);
req.session.Flight_Class = req.params.Flight_Class;
req.session.Price = parseInt(req.params.Price);
req.session.Seat = parseInt(req.params.Seat);
//console.log(req.params.Arrival_Time);
//console.log(req.params.Flight_Class);
res.send("<html></html>");
//console.log("Hello");
});




app.get('/CancelTrip/:Ticket_ID/:Flight_Source/:Flight_Destination/:Flight_Number/:Airline_Name/:DEPARTURE_TIME/:ARRIVAL_TIME/:Flight_Class/:Price',(req,res)=>{
req.session.Ticket_ID = req.params.Ticket_ID;
req.session.FlightSource = req.params.Flight_Source;
req.session.FlightDestination = req.params.Flight_Destination;
req.session.FlightNumber = req.params.Flight_Number;
req.session.AirlineName = Airline_Name;
req.session.DEP = new Date (req.params.DEPARTURE_TIME);
req.session.ARRIVALTIME = new Date (req.params.ARRIVALTIME);
req.session.FlightClass = req.params.Flight_Class;
req.session.P = parseInt(req.params.Price);
console.log("Hye1");
console.log(req.params);
console.log("Hye");
var tickets = 0;
let post = "select No_Of_Ticket from Ticket Where Ticket_ID = ?";
let sql = connection.query(post,[req.session.Ticket_ID],(error,results,fields)=>
  {
  if(error)
  {
    console.log("Error15");             
  }
  else
  {
    tickets = results[0].No_Of_Ticket;
  }
    console.log(tickets);
  }); 

  post = "delete from ticket where ticket_ID = ?";
  sql = connection.query(post,[req.session.Ticket_ID],(error,results,fields)=>
  {
    if(error)
    {
      console.log("Error16");             
    }
    else
    {
      if(results!=undefined && results.affectedRows != 0 && results.length != 0)
      { 
        console.log("Error2"); 
        let post = "UPDATE Flight_Class SET  NO_OF_SEATS = NO_OF_SEATS + ? where Flight_Number = ? and Departure_Time = ? and Flight_Class = ?";
        let sql = connection.query(post,[tickets,req.session.FlightNumber,req.session.DEP,req.session.FlightClass],(error,results,fields)=>
        {
          if(error)
          {
            console.log(tickets,req.session.FlightNumber,req.session.DEP,req.session.FlightClass);             
          }
          else
          {

            if(results!=undefined && results.affectedRows != 0 && results.length != 0)
            {  
              console.log("Error18"); 
              let post = "update customer set Balance = Balance + ? where Customer_ID = ?";
              let sql = connection.query(post,[tickets*req.session.P*0.75,req.session.user1],(error,results,fields)=>
              {
                if(error)
                {
                  console.log("Error18");             
                }
                else
                {
                  if(results!=undefined && results.affectedRows != 0 && results.length != 0)
                  {     

                      console.log("Success");
                  }
                  else
                  {
                    console.log("Error19");
                  }
                }   
              });
            }
            else
            {
              console.log("Error20");
            }
          }     
        });
      }
    }
  });      

res.send("<html></html>");
//console.log("Hello");
});









///selected

app.post("/selected",(req,res)=>{

    console.log(req.body.source,req.body.destination,req.body.data);
    console.log("Hello");
    let post="select DISTINCT a.Airline_Name , t.Flight_Number ,t.Flight_Source ,t.Flight_Destination ,t.DEPARTURE_TIME ,t.ARRIVAL_TIME ,t1.Flight_Class , t1.NO_OF_SEATS AS S1 ,t1.PRICE AS P1  from AIRLINE a, FLIGHT t ,FLIGHT_class t1 where t1.FLIGHT_NUMBER = t.FLIGHT_NUMBER  AND  t.Airline_ID = a.Airline_ID and t.FLIGHT_STATUS = 'Y' and t1.DEPARTURE_TIME = t.DEPARTURE_TIME and t.FLIGHT_NUMBER = t1.FLIGHT_NUMBER and t1.Departure_Time = ? and t1.Flight_Source = ? and t1.Flight_Destination = ?";
    let sql = connection.query(post,[req.body.source,req.body.destination,req.body.data],(err, result, fields)=> {
      if (err) throw err;
      //console.log(result ,req.session.username);
      res.render('Passenger_Flight_View.ejs',{N:req.session.username,F:result});
    });
     
});

















//**********************************************************************************************//
/***********************************************************************************************/


app.get("/Admin_Login",(req,res)=>{
  
  res.render("Admin_Login.ejs",{I:2});
 
});
app.get("/Admin_About",(req,res)=>{
  
  res.render("Admin_About.ejs");
 
});
app.get("/Logout2",(req,res)=>{
  
  res.render("Admin_Login.ejs",{I:2});
 
});




app.post("/LoginAdmin",(req,res)=>
{
  var email = req.body.ID;
  var password = req.body.Password;
  console.log(email+password);
  let post = "SELECT Admin_ID ,Admin_Password FROM Admin WHERE Admin_ID = ? AND Admin_Password = ?";
  let sql = connection.query(post,[email,password],(error,results,fields)=>
       {
          if(error)
          {
            res.render("Admin_Login.ejs",{I:0});
          }
          else
          {
            if(results!=undefined && results.RowDataPacket != 0 && results.length != 0 )
            {
               res.render("Admin_About.ejs");
            }
            else
            {
              res.render("Admin_Login.ejs",{I:0});
            }
          }  

});
}); 

app.get("/Admin_View_Current",(req,res)=>{

    let post="select DISTINCT a.Airline_Name , t.Flight_Number ,t.Flight_Source ,t.Flight_Destination ,t.DEPARTURE_TIME ,t.ARRIVAL_TIME ,t1.Flight_Class , t1.NO_OF_SEATS AS S1 ,t1.PRICE AS P1  from AIRLINE a, FLIGHT t ,FLIGHT_class t1 where t1.FLIGHT_NUMBER = t.FLIGHT_NUMBER  AND  t.Airline_ID = a.Airline_ID and t.FLIGHT_STATUS = 'Y' and t1.DEPARTURE_TIME = t.DEPARTURE_TIME and t.FLIGHT_NUMBER = t1.FLIGHT_NUMBER and t1.NO_OF_SEATS > 0";
    let sql = connection.query(post,(err, result, fields)=> {
      if (err) throw err;
      res.render('Admin_View_Current.ejs',{F:result});
    });  
});

app.get("/Admin_View_All_Flights",(req,res)=>{

    let post="select DISTINCT a.Airline_Name , t.Flight_Number ,t.Flight_Source ,t.Flight_Destination ,t.DEPARTURE_TIME ,t.ARRIVAL_TIME ,t1.Flight_Class , t1.NO_OF_SEATS AS S1 ,t1.PRICE AS P1  from AIRLINE a, FLIGHT t ,FLIGHT_class t1 where t1.FLIGHT_NUMBER = t.FLIGHT_NUMBER  AND  t.Airline_ID = a.Airline_ID  and t1.DEPARTURE_TIME = t.DEPARTURE_TIME and t.FLIGHT_NUMBER = t1.FLIGHT_NUMBER and t1.NO_OF_SEATS > 0";
    let sql = connection.query(post,(err, result, fields)=> {
      if (err) throw err;
      res.render('Admin_View_All_Flights.ejs',{F:result});
    });  
});

app.get("/Admin_View_Customer",(req,res)=>{

    let post="select DISTINCT Customer_ID , First_Name , Last_Name , CNIC, Contact_Number , Passport_Number , Status from Customer";
    let sql = connection.query(post,(err, result, fields)=> {
      if (err) throw err;
      res.render('Admin_View_Customer.ejs',{F:result});
    });  
});

app.get("/Admin_View_Airlines",(req,res)=>{

    let post="select DISTINCT Airline_ID ,Airline_Name , Airline_Origin , Airline_Owner , Airline_Abbreviation , Established_Year , Status From Airline ";
    let sql = connection.query(post,(err, result, fields)=> {
      if (err) throw err;
      res.render('Admin_View_Airlines.ejs',{F:result});
    });  
});





app.post("/CustDelete",(req,res)=>
{
  var customer = req.body.custID;
  let post = "DELETE FROM Ticket WHERE Customer_ID = ?";
              let sql = connection.query(post,[customer],(error,results,fields)=>
              {
                console.log(results);
                if(error)
                {
                    res.redirect("/Admin_View_Customer");             
                }
                else
                {

                      let post = "DELETE FROM Customer WHERE Customer_ID =  ?";
                      let sql = connection.query(post,[customer],(error,results,fields)=>
                      {
                        console.log(results);
                        if(error)
                        {
                          res.redirect("/Admin_View_Customer");
                        }
                        else
                        {
                          if(results!=undefined && results.affectedRows != 0 && results.length != 0)
                          {
                            res.redirect("/Admin_View_Customer");
                          }
                         else
                          {
                             res.redirect("/Admin_View_Customer");
                          }  
                        }
  
                    });
                   
                }
              });
});




///Remove

app.get("/Remove",(req,res)=>{

    let post="UPDATE Flight set Flight_Status = ? Where DEPARTURE_TIME < ?";
    let currentdate = new Date();
    let sql = connection.query(post,['N',currentdate],(err, result, fields)=> {
      if (err) throw err;
      res.redirect('/Admin_View_Current');
    });  
});








app.listen(3000,()=>{
console.log('Server listening on port 3000');

});
















