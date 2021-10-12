const express = require('express')
const profile = require('./models/profile.js')
const Question = require('./models/question.js')
const exam = require('./models/exams.js')
const db = require('mongodb')

const app = express()
const ejs = require('ejs')
require('dotenv/config')
require('./db/mongoose')
const  otpGenerator = require('otp-generator')
const path = require('path')
const { sendOtpMail , otp } = require('./email/account')
const bodyParser = require('body-parser')
const router = require('./routers/profiles')
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('views', path.join(__dirname, '../views'))
app.set('views engine','ejs')

app.get('/', async (req,res) => {
    res.render('login.ejs')
})
app.post('/', (req,res) => {
   
   
    profile.findOne({email : req.body.email,  password : req.body.password},(error,user) => {
        console.log(user)
       if(user == null)
       {
        console.log('user not in database')
        res.send("User not exists").status(201)
       }
       else{
        res.redirect('/dashboard')
       }
    })
    
 })

app.get('/register', (req,res) => {
    res.render('register.ejs')
})

app.post('/register',  (req,res) => {
    
    const user = new profile({
        name : req.body.name,
        email : req.body.email,
        mobile :req.body.mobile,
        address :  req.body.address,
        password :  req.body.password
    } )
    const cnfpass = req.body.cnfpass
    if(cnfpass === req.body.password)
    {

        user.save().then(()=>{

            res.redirect('/')

         }).catch((e)=>{
             console.log(e)
             res.send(e)
             
            })
        }
       else{
        res.send("password and confirm password should be same")
       }
    
    })
     
app.post('/profile',  (req,res) => {
    

    profile.findOneAndUpdate({email : req.body.email}, {$set: {name : req.body.name, password :  req.body.password,name : req.body.name,mobile :req.body.mobile,address :  req.body.address,}}, {new: true}, (err,user) => {
        if (err)
         { throw new Error(err) }
        else { console.log("Updated");
        

     }
      });  
    
    const cnfpass = req.body.cnfpassword
    if(cnfpass === req.body.password)
    {
            res.redirect('/dashboard')

    }
   else{
    res.send("password and confirm password should be same")
   }

})

app.get('/dashboard', (req,res) => {
    res.render('dashbord.ejs')
})
app.get('/profile', (req,res) => {
    res.render('profile.ejs')
})
app.get('/students', (req,res) => {
    profile.find({}, (error, user) => {
        
        
            res.render('Students.ejs', {userlist : user})
         

        })
        

    })
    

app.get('/otp', (req,res) => {
    res.render('otp.ejs')

})
app.get('/forgot' , (req,res) => {
    res.render('forgot.ejs')   
})
app.get('/exam' , (req,res) => {
    res.render('create-exam.ejs')   
})
app.get('/new_exam' , (req,res) => {
    res.render('create-new-exam.ejs')   
})
app.get('/questions' , (req,res) => {
    res.render('create-questions.ejs')   
})

 app.post('/forgot' , async (req,res) => {
     console.log("dwa",req.body)
     let email = req.body.email;
     console.log("vszwa",email)
     const user = await profile.findOne({email : email})

     if(!user){
    sendOtpMail(email,otp)
    res.redirect('/otp?email='+email)
    
    }
   
    
})

app.post('/otp' , async (req,res) => {
    const user = await profile.findOne({email : req.body.user-email})
    

   
})
app.use(router)
app.listen(port, () => {
    console.log(`Port is set on  ${port} `)
}) 