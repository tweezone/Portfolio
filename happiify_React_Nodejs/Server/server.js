const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const path=require('path');

const md5 = require('md5');
const HTTP_PORT = process.env.PORT || 8088;

// Create logs for the running server
const log = require("./logs/service/log");
log.configure();
app.use(log.logsInServer());

app.use(bodyParser.json());
app.use(cors());

app.use(express.static('assets'));

const dataService = require('./service/data-service');
const data=dataService();

const multer  = require('multer');
const func = require('./service/func-service');
const fs=require('fs-extra');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = `./assets/upload/${func.getNowFormatDate()}`;
        fs.mkdirsSync(path);
        cb(null, path)
    },
    filename: function (req, file, cb) { 
        cb(null, Date.now() + file.originalname.slice(-(file.originalname.length-file.originalname.lastIndexOf('.')))); 
    }
});
let upload=multer({storage});

const ffmpeg = require('ffmpeg');

// ******************************************************************************************************************
// LOG-IN ***********************************************************************************************************
app.post("/", (req,res)=>{
    data.logIn(req.body)
        .then((results)=>{
            let password_md5=md5(req.body.password);
            if(password_md5 == results[0].encrypt_password){
                res.json("Success");
            }
            else{
                res.json("fault");
            }            
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

// ******************************************************************************************************************
// DOCUMNET MANAGEMENT***********************************************************************************************
//////////////////// Documents
app.get("/documents", (req,res) => {
    data.getAllDocs()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//WITH UPLOADING FILES ----------------------------------------------------------------------------
app.post("/documents/add", upload.single('image'), (req,res)=>{
    req.body.feature_image_url= 'assets/upload/'+ func.getNowFormatDate() + '/' + req.file.filename;
    data.insertDoc(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/documents/update", upload.single('image'), (req,res)=>{
    if(req.file){
        req.body.feature_image_url= 'assets/upload/'+ func.getNowFormatDate() + '/' + req.file.filename;
    }
    data.updateDoc(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
    });
});
//-------------------------------------------------------------------------------------------------

app.put("/documents/delete", (req,res)=>{
    data.deleteDoc(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

/////////////// Documents - Comments
app.get("/documents/comments", (req,res) => {
    data.getAllDocComments()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/documents/comments/delete", (req,res)=>{
    data.deleteDocComment(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Documents - Categories
app.get("/documents/categories", (req,res) => {
    data.getAllDocCategories()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.post("/documents/categories/add", (req,res)=>{
    data.insertDocCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/documents/categories/update", (req,res)=>{
    data.updateDocCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/documents/categories/delete", (req,res)=>{
    data.deleteDocCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

// ******************************************************************************************************************
// VIDEO MANAGEMENT**************************************************************************************************
/////////////////// Videos
app.get("/videos", (req,res) => {
    data.getAllVideos()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//WITH UPLOADING FILES ----------------------------------------------------------------------------
const multiUpload1=upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]);
app.post("/videos/add", multiUpload1, (req,res)=>{
    req.body.videoPath = 'assets/upload/'+ func.getNowFormatDate() + '/' + req.files.video[0].filename;
    if(req.files.image){
        req.body.coverImage = 'assets/upload/'+ func.getNowFormatDate() + '/' + req.files.image[0].filename;
        data.insertVideo(req.body)
            .then((results)=>{
                res.json(results);
            })
            .catch((err)=>{
                log.logger("cheese").error(err);
                res.status(500).end();
        });
    }
    else{
        var process = new ffmpeg(req.body.videoPath);
        process.then(video=> {
            video.fnExtractFrameToJPG('assets/upload/'+ func.getNowFormatDate(), {
                //start_time: '00:00:20',
                //every_n_seconds: 1,
                every_n_frames: 100,
                //frame_rate : 1,
                number : 2,
                file_name : Date.now().toString()
            }, (error, files)=>{
                if (!error){
                    req.body.coverImage = files[files.length-1];
                    data.insertVideo(req.body)
                    .then((results)=>{
                        res.json(results);
                    })
                    .catch((err)=>{
                        log.logger("cheese").error(err);
                        res.status(500).end();
                    });
                }
            });
        }, (err)=> {
            log.logger("cheese").error(err);
        })
        .catch ((err)=> {
            log.logger("cheese").error(err);
        });
    }
});

app.put("/videos/update", multiUpload1, (req,res)=>{
    if(req.files.image){
        req.body.coverImage = 'assets/upload/' + func.getNowFormatDate() + '/' + req.files.image[0].filename;
    }
    if(req.files.video){
        req.body.videoPath = 'assets/upload/' + func.getNowFormatDate() + '/' + req.files.video[0].filename;
    }
    data.updateVideo(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});
//-------------------------------------------------------------------------------------------------

app.put("/videos/delete", (req,res)=>{
    data.deleteVideo(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

/////////////// Videos - Comments
app.get("/videos/comments", (req,res) => {
    data.getAllVideoComments()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/videos/comments/delete", (req,res)=>{
    data.deleteVideoComment(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Videos - Categories
app.get("/videos/categories", (req,res) => {
    data.getAllVideoCategories()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.post("/videos/categories/add", (req,res)=>{
    data.insertVideoCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/videos/categories/update", (req,res)=>{
    data.updateVideoCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/videos/categories/delete", (req,res)=>{
    data.deleteVideoCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

// ******************************************************************************************************************
// EVENT MANAGEMENT**************************************************************************************************
//////////////////// Events
app.get("/events", (req,res) => {
    data.getAllEvents()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.get("/event/:eventId", (req,res) => {
    data.getEventById(req.params.eventId)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//WITH UPLOADING FILES ----------------------------------------------------------------------------
app.post("/events/add", upload.single('image_add'), (req,res)=>{
    req.body.image = 'assets/upload/'+ func.getNowFormatDate() + '/' + req.file.filename;
    data.insertEvent(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
    });
});

app.put("/events/update", upload.single('image_update'), (req,res)=>{
    if(req.file){
        req.body.image = 'assets/upload/'+ func.getNowFormatDate() + '/' + req.file.filename;
    }
    data.updateEvent(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});
//-------------------------------------------------------------------------------------------------

app.put("/events/delete", (req,res)=>{
    data.deleteEvent(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Events - Categories
app.get("/events/categories", (req,res) => {
    data.getAllEventCategories()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.post("/events/categories/add", (req,res)=>{
    data.insertEventCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/events/categories/update", (req,res)=>{
    data.updateEventCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/events/categories/delete", (req,res)=>{
    data.deleteEventCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Event - Comments
app.get("/events/comments", (req,res) => {
    data.getAllEventComments()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/events/comments/delete", (req,res)=>{
    data.deleteEventComment(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

// ******************************************************************************************************************
// LESSON MANAGEMENT***********************************************************************************************
//////////////////// Lessons
app.get("/lessons", (req,res) => {
    data.getAllLessons()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//WITH UPLOADING FILES ----------------------------------------------------------------------------
const multiUpload2=upload.fields([{ name: 'image', maxCount: 1 }, { name: 'uploadFiles', maxCount: 50 }]);
app.post("/lessons/add", multiUpload2, (req,res)=>{
    req.body.image = 'assets/upload/'+ func.getNowFormatDate() + '/' + req.files.image[0].filename;
    const filesName=[];
    if(req.files.uploadFiles !== undefined){
        req.files.uploadFiles.forEach(one=>filesName.push('assets/upload/'.concat(func.getNowFormatDate(), '/', one.filename)));
    }
    
    data.insertLesson(req.body, filesName)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/lessons/update", upload.single('lessonImage'), (req,res)=>{
    if(req.file){
        req.body.image = 'assets/upload/'+ func.getNowFormatDate() + '/' + req.file.filename;
    }
    data.updateLesson(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});
//-------------------------------------------------------------------------------------------------

app.put("/lessons/delete", (req,res)=>{
    data.deleteLesson(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Lessons - Comments
app.get("/lessons/comments", (req,res) => {
    data.getAllLessonComments()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/lessons/comments/delete", (req,res)=>{
    data.deleteLessonComment(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Lessons - Categories
app.get("/lessons/categories", (req,res) => {
    data.getAllLessonCategories()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.post("/lessons/categories/add", (req,res)=>{
    data.insertLessonCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/lessons/categories/update", (req,res)=>{
    data.updateLessonCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/lessons/categories/delete", (req,res)=>{
    data.deleteLessonCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Lessons - Sections on ONE lesson
app.get("/lessons/sections", (req,res) => {
    data.getAllLessonSections()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/lessons/sections/delete", (req,res)=>{
    data.deleteLessonSection(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

// ******************************************************************************************************************
// QUESTION MANAGEMENT***********************************************************************************************
//////////////////// Questions
app.get("/questions", (req,res) => {
    data.getAllQuestions()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//WITH UPLOADING FILES ----------------------------------------------------------------------------
const multiUpload3=upload.fields([{ name: 'image', maxCount: 1 }, { name: 'files', maxCount: 50 }]);
app.post("/questions/add", multiUpload3, (req,res)=>{
    req.files.image? (req.body.cover_image = 'assets/upload/'+ func.getNowFormatDate() + '/' + req.files.image[0].filename): (req.body.cover_image = '');
    const filesName=[];
    
    if(req.files.files !== undefined){
        filesName.push(req.body.cover_image);
        req.files.files.forEach(one=>filesName.push('assets/upload/'.concat(func.getNowFormatDate(), '/', one.filename)));
    }

    data.insertQuestion(req.body, filesName)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/questions/update", upload.single('image'), (req,res)=>{
    if(req.file){
        req.body.cover_image = 'assets/upload/'+ func.getNowFormatDate() + '/' + req.file.filename;
    }    
    data.updateQuestion(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});
//-------------------------------------------------------------------------------------------------

app.put("/questions/delete", (req,res)=>{
    data.deleteQuestion(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});
//////////////////// Questions - Images on ONE question
app.get("/questions/images", (req,res) => {
    data.getAllQuestionImages()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/questions/images/delete", (req,res)=>{
    data.deleteQuestionImage(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Questions - Categories
app.get("/questions/categories", (req,res) => {
    data.getAllQuestionCategories()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.post("/questions/categories/add", (req,res)=>{
    data.insertQuestionCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/questions/categories/update", (req,res)=>{
    data.updateQuestionCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/questions/categories/delete", (req,res)=>{
    data.deleteQuestionCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Questions - Answers on ONE question
app.get("/questions/answers", (req,res) => {
    data.getAllQuestionAnswers()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/questions/answers/delete", (req,res)=>{
    data.deleteQuestionAnswer(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//WITH UPLOADING FILES ----------------------------------------------------------------------------
app.post("/questions/answers/add", upload.array('uploadFiles', 10), (req,res)=>{
    const filesName=[];
    if(req.files !== undefined){
        req.files.forEach(one=>filesName.push('assets/upload/'.concat(func.getNowFormatDate(), '/', one.filename)));
    }
    data.insertQuestionAnswer(req.body, filesName)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/questions/answers/update", upload.array('uploadFiles', 10), (req,res)=>{
    const filesName=[];
    if(req.files !== undefined){
        req.files.forEach(one=>filesName.push('assets/upload/'.concat(func.getNowFormatDate(), '/', one.filename)));
    }
    data.updateQuestionAnswer(req.body, filesName)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});
//-------------------------------------------------------------------------------------------------

////////////////////// Questions - Answers - Images---------------------------------------------------------------------------------------------------
app.get("/questions/answers/images", (req,res) => {
    data.getAllQuestionAnswersImages()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/questions/answers/images/delete", (req,res)=>{
    data.deleteQuestionAnswerImage(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//WITH UPLOADING FILES ----------------------------------------------------------------------------
app.post("/questions/answers/images/add", upload.array('uploadFiles', 10), (req,res)=>{
    const filesName = [];
    if(req.files !== undefined){
        req.files.forEach(one=>filesName.push('assets/upload/'.concat(func.getNowFormatDate(), '/', one.filename)));
    }
    data.insertQuestionAnswerImages(req.body, filesName)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});
//---------------------------------------------------------------------------------------------------
// ******************************************************************************************************************
// PRODUCT MANAGEMENT ***********************************************************************************************
//////////////////// Products
app.get("/products", (req,res) => {
    data.getAllProducts()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//WITH UPLOADING FILES ----------------------------------------------------------------------------
app.post("/products/add", upload.array('uploadImages', 50), (req,res)=>{
    const imageNames=[];
    if(req.files !== undefined){
        req.files.forEach(one=>imageNames.push('assets/upload/'.concat(func.getNowFormatDate(), '/', one.filename)));
    }
    imageNames.length === 0? req.body.images = '' : req.body.images = imageNames[0];
    
    data.insertProduct(req.body, imageNames)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/products/update", upload.array('uploadImages', 50), (req,res)=>{
    const imageNames=[];
    if(req.files !== undefined){
        req.files.forEach(one=>imageNames.push('assets/upload/'.concat(func.getNowFormatDate(), '/', one.filename)));
    }
    const updateImages=JSON.parse(req.body.updateImages)
    if(updateImages.length === 0){
        if(imageNames.length === 0){
            req.body.images = '';
        }
        else{
            req.body.images = imageNames[0]
        }
    }
    else{
        req.body.images = updateImages[0].image;
    }
    data.updateProduct(req.body, imageNames)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});
//-------------------------------------------------------------------------------------------------

app.put("/products/delete", (req,res)=>{
    data.deleteProduct(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Products - Categories
app.get("/products/categories", (req,res) => {
    data.getAllProductCategories()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.get("/products/categories/match", (req,res) => {
    data.getProductCategorieMatches()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//WITH UPLOADING FILES ----------------------------------------------------------------------------
app.post("/products/categories/add", upload.single('imageFile'), (req,res)=>{
    if(req.file){
        req.body.image = 'assets/upload/'+ func.getNowFormatDate() + '/' + req.file.filename;
    } 
    data.insertProductCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/products/categories/update", upload.single('imageFile'), (req,res)=>{
    if(req.file){
        req.body.image = 'assets/upload/'+ func.getNowFormatDate() + '/' + req.file.filename;
    }
    data.updateProductCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});
//-------------------------------------------------------------------------------------------------
app.put("/products/categories/delete", (req,res)=>{
    data.deleteProductCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Products - Attributes
app.get("/products/attributes", (req,res) => {
    data.getAllProductAttributes()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.get("/products/attributes/match", (req,res) => {
    data.getProductAttributeMatches()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.post("/products/attributes/add", (req,res)=>{
    data.insertProductAttribute(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/products/attributes/update", (req,res)=>{
    data.updateProductAttribute(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/products/attributes/delete", (req,res)=>{
    data.deleteProductAttribute(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Products - Attribute Groups
app.get("/products/attribute_groups", (req,res) => {
    data.getAllProductAttributeGroups()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.post("/products/attribute_groups/add", (req,res)=>{
    data.insertProductAttributeGroup(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/products/attribute_groups/update", (req,res)=>{
    data.updateProductAttributeGroup(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/products/attribute_groups/delete", (req,res)=>{
    data.deleteProductAttributeGroup(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Products - tax
app.get("/products/tax_class", (req,res) => {
    data.getProductsTaxeClasses()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Products - images
app.get("/products/images", (req,res) => {
    data.getProductsImages()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.get("/products/images/search?", (req,res) => {
    data.getOneProductImages(req.query.productId)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Products - Manufacturers
app.get("/products/manufacturers", (req,res) => {
    data.getAllManufacturers()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Products - Brands
app.get("/products/brands", (req,res) => {
    data.getAllBrands()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

// ******************************************************************************************************************
// HEALTH MANAGEMENT ************************************************************************************************
//////////////////// Doctors
app.get("/health/doctors", (req,res) => {
    data.getAllDoctors()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/health/doctors/delete", (req,res)=>{
    data.deleteDoctors(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.post("/health/doctors/add", upload.single('uploadImage'), (req,res)=>{
    req.body.image = req.file? 'assets/upload/'+ func.getNowFormatDate() + '/' + req.file.filename : '';
    data.insertDoctor(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/health/doctors/update", upload.single('uploadImage'), (req,res)=>{
    req.body.image = req.file? 'assets/upload/'+ func.getNowFormatDate() + '/' + req.file.filename : '';
    data.updateDoctor(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Doctors' Categories
app.get("/health/doctors/categories", (req,res) => {
    data.getAllDoctorCategories()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/health/doctors/categories/delete", (req,res)=>{
    data.deleteDoctorCategories(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.post("/health/doctors/categories/add", upload.single('uploadImage'), (req,res)=>{
    if(req.file){
        req.body.image = 'assets/upload/'+ func.getNowFormatDate() + '/' + req.file.filename;
    } 
    data.insertDoctorCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/health/doctors/categories/update", upload.single('uploadImage'), (req,res)=>{
    if(req.file){
        req.body.image = 'assets/upload/'+ func.getNowFormatDate() + '/' + req.file.filename;
    } 
    data.updateDoctorCategory(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

// ******************************************************************************************************************
// USERS ************************************************************************************************************
//////////////////// Users
app.get("/users", (req,res) => {
    data.getAllUsers()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/users/delete", (req,res)=>{
    data.deleteUser(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//WITH UPLOADING FILES ----------------------------------------------------------------------------
app.post("/users/add", upload.single('imageFile'), (req,res)=>{
    if(req.body.image !== ''){
        req.body.image = 'assets/upload/'+ func.getNowFormatDate() + '/' + req.file.filename;
    }
    else{
        req.body.image = 'assets/default/default_user.png';
    }
    req.body.password = md5(req.body.password);
    if(req.body.birthday === ''){
        req.body.birthday = '1900-01-01';
    }
    data.insertUser(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/users/update", upload.single('imageFile'), (req,res)=>{
    if(req.file){
        req.body.image= 'assets/upload/'+ func.getNowFormatDate() + '/' + req.file.filename;
    }
    if(req.body.password !== ''){
        req.body.password = md5(req.body.password);
    }
    if(req.body.birthday === ''){
        req.body.birthday = '1900-01-01';
    }
    data.updateUser(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
    });
});
//-------------------------------------------------------------------------------------------------
//////////////////// Users - Marriage
app.get("/users/marriage", (req,res) => {
    data.getUsersMarriageStatus()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Users - Role
app.get("/users/roles", (req,res) => {
    data.getUsersRoles()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/users/roles/delete", (req,res)=>{
    data.deleteRole(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.post("/users/roles/add", (req,res)=>{
    data.insertRole(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/users/roles/update", (req,res)=>{
    data.updateRole(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
    });
});

//////////////////// Users - Permission
app.get("/users/permissions", (req,res) => {
    data.getAllPermissions()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.post("/users/permissions/add2", (req,res)=>{
    data.insertPermission2(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/users/permissions/delete2", (req,res)=>{
    data.deletePermission2(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/users/permissions/update2", (req,res)=>{
    data.updatePermission2(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
    });
});

app.put("/users/permissions/delete1", (req,res)=>{
    data.deletePermission1(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.post("/users/permissions/add1", (req,res)=>{
    data.insertPermission1(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/users/permissions/update1", (req,res)=>{
    data.updatePermission1(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
    });
});

app.get("/users/groups_permissions", (req,res) => {
    data.getUsersRolesPermissions()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

// ******************************************************************************************************************
// LOCATION ***********************************************************************************************************
//////////////////// Country
app.get("/location/countries/enable", (req,res) => {
    data.getEnableCountries()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.get("/location/countries/all", (req,res) => {
    data.getAllCountries()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/location/countries/update", (req,res) => {
    data.updateCountriesDisnabled(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// Province / State
app.get("/location/provinces", (req,res) => {
    data.getAllProvinces()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.get("/location/province/:provinceId", (req,res) => {
    data.getProvinceById(req.params.provinceId)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/location/provinces/delete", (req,res)=>{
    data.deleteProvinces(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.post("/location/provinces/add", (req,res)=>{
    data.addProvince(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/location/province/:provinceId", (req,res)=>{
    data.updateProvinceById(req.params.provinceId, req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//////////////////// City
app.get("/location/cities", (req,res) => {
    data.getAllCities()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.get("/location/city/:cityId", (req,res) => {
    data.getCityById(req.params.cityId)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/location/cities/delete", (req,res)=>{
    data.deleteCities(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.post("/location/cities/add", (req,res)=>{
    data.addCity(req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

app.put("/location/city/:cityId", (req,res)=>{
    data.updateCityById(req.params.cityId, req.body)
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

// ******************************************************************************************************************
// CURRENCIES *******************************************************************************************************
//////////////////// Currencies
app.get("/currencies", (req,res) => {
    data.getAllCurrencies()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

// ******************************************************************************************************************
// LANGUAGES ********************************************************************************************************
//////////////////// Languages
app.get("/languages", (req,res) => {
    data.getAllLanguages()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

// ******************************************************************************************************************
// DICTIONARY *******************************************************************************************************
//////////////////// Dictionary
app.get("/dictionary", (req,res) => {
    data.getAllDictionaryItems()
        .then((results)=>{
            res.json(results);
        })
        .catch((err)=>{
            log.logger("cheese").error(err);
            res.status(500).end();
        });
});

//*******************************************************************************************************************
// SUPPORT FOR EMBEDDED EDITOR UPLOADING AN IMAGE *******************************************************************
app.post("/editor/add/image", upload.single('image'), (req,res)=>{
    const imageInDoc = 'assets/upload/'+ func.getNowFormatDate() + '/' + req.file.filename;
    res.send(imageInDoc);
});

// ******************************************************************************************************************
// SUPPORT FOR THE DISPLAY OF VIDEOS OR IMAGES UPLOADED TO THE SERVER ***********************************************
app.get("/display/video/:file?", (req, res)=>{
    res.sendFile(path.join(__dirname, req.query.file));
});

app.get("/display/image/:file?", (req, res)=>{
    res.sendFile(path.join(__dirname, req.query.file));
});

// ******************************************************************************************************************
// SERVER RUNNING ***************************************************************************************************

// Catch-All 404 error
app.use((req, res) => {
    res.status(404).end();
});

app.listen(HTTP_PORT, ()=>{
    console.log("Server listening on: " + HTTP_PORT);
    log.logger("cheese").info("Server listening on: " + HTTP_PORT);
});

/*
process.on('warning', (warn) => {
    log.logger("cheese").warn("Warning (Func: server.js/process.on) at:\n", warn.name, "\n", warn.message, "\n", warn.stack);
  });

process.on('unhandledRejection', (reason, p) => {
    log.logger("cheese").error('Unhandled Rejection (Func: server.js/process.on) at:', p, 'reason:', reason);
  });
//*/

// This is a rude way to get the error message, in the future improve it.
process.on('uncaughtException', (err)=>{
    log.logger("cheese").fatal(err);
});

/*
process.on('exit', (code) => {
    log.logger("cheese").fatal(`About to exit with code: ${code}`);
    log.logsShutDown;
});
//*/