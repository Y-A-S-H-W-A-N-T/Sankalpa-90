
const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const jwt = require('jsonwebtoken');

const multer=require('multer');
const ejs=require('ejs');
const cookieParser=require('cookie-parser');
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

const secretKey = 'HelloguyshowAreu';

app.use(cookieParser());
app.use(express.json())
app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.get('/login',(req,res)=>{
    res.render('login');
})

mongoose.connect('mongodb+srv://BigDeal:CG1lW2FZSG2BCH3D@cluster0.3kbqs43.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser:true}).then((res)=>{
    console.log('mongoose db connected');
  }).catch((err)=>{
    console.log(err,'errr')})

    const userSchema= new mongoose.Schema({
        firstname:{
           type: String,
           allowNull:true
        },
        lastname:{
            type: String,
            allowNull:true
         },
        idNumber:{
            type: Number,
            allowNull:true
         },
        email:{
            type: String,
            allowNull:true
         },
        password:{
            type: String,
            allowNull:true
         },
        image:{
            type: String,
            allowNull:true
         },
         Qualification:{
            type: String,
            allowNull:true
         },
         phNumber:{
            type: Number,
            allowNull:true
         },
    
    },{
        timestamps:true
    })

const User=mongoose.model('Users',userSchema)


const storage = multer.diskStorage({
    destination:  '../uploads',
    filename: function (req, files, cb) {
      cb(null, Date.now() + '-' + files.originalname);
    }
  });
const upload = multer({ storage: storage });



app.post('/registers', upload.array('image'),async(req,res)=>{
   
    try{
         console.log(req.body)
        // console.log('runiing here',req.files.filename)

        var users= new User({
            email:req.body.username,
            password:req.body.password,
            firstname:req.body.fname,
            lastname:req.body.lname,
            phNumber:req.body.color,
            Qualification:req.body.txtColor,
            idNumber:req.body.age,
            image:req.files[0].filename,
       });
        users.save();
        res.redirect('/login')
       
    }catch(err){
        console.log(err,'errrr')
    }
        });


const checkAuth = (req, res, next)=> {
    const authHeader = req.cookies.__token;
    console.log(authHeader,'authHeader');
    const token = req.cookies.__token;
    if(!token){
        res.redirect("/login")
        return false
    }
    jwt.verify(token, secretKey, async(err,decoded) => {
        if(err) throw err;
        console.log(decoded)
        if(decoded.ID){
            await User.findOne({
                _id:decoded.ID
            }).then((response)=>{
                console.log(response,'response')
                req.user=response;
                next()
            }).catch((errs)=>{
                console.log(errs)
            })
        }else{
            res.send('Invalid signature');
            return redirect('/login')
        }
   
   
    })
  }
  app.use('/uploads', express.static('../uploads'));

app.get('/test',checkAuth,(req,res,next)=>{
    console.log('this is home',req.user);
    if(req.user){
        console.log(req.user)
        // res.render("secrets",{Fname:req.user.firstname,
        //     Lname:req.user.lastname,
        //     Email:req.user.email,
        //     Age:req.user.Age,
        //     Image:req.user.image,
        //     Color:req.user.btncolor,
        //     txtColor:req.user.txtColor,
        // });
        // console.log(req.user.btncolorcolor)
        res.send(req.user)
    }else{
        res.redirect('/login')
    }
    res.send("Hello this is acoount")
});
app.get('/logout',(req,res)=>{
    res.clearCookie('__token');
    return res.redirect('/login');
})


app.post('/login',async(req,res)=>{
       
        try{
            const result= await User.findOne({email:req.body.username, password:req.body.password});
            console.log(result);
            if(result==null){
                return res.redirect("/login");
            }
            else{
                const token = jwt.sign({ID:result._id}, secretKey, { expiresIn: '1h' });
                console.log(`Hence the generated token:${token}`);
                res.cookie('__token',token);
                // console.log(res);
                res.redirect('/test');

            }
        }
        catch(err){
            console.log(err);
            return res.send(err);
        }
});

app.get("/getall",async(req,res)=>{
    const result=await User.find()
    //const jsonArray = JSON.parse(result);
    res.render("account",{result:result})
     

})





app.listen('4000',function(){
    console.log("Server running at Server running at http://127.0.0.1:4000/");
})

