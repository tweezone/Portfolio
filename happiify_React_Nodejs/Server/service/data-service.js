const mysql = require('mysql');
const db = require('../config.db');
const func = require('./func-service');

const axios = require("axios");
const instance = axios.create({ timeout: 2000 });

var pool = mysql.createPool(db.config);

module.exports=function(){
    return{
        // ********************************************************************************************************************
        // LOG-IN *************************************************************************************************************
        logIn:(data)=>new Promise((resolve,reject) =>{
            const sql="SELECT encrypt_password FROM h1_users WHERE username= '" + data.username + "';";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: logIn" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        // ********************************************************************************************************************
        // DOCUMENT MANAGEMENT ************************************************************************************************
        //////////////////// Documents
        getAllDocs: ()=> new Promise((resolve,reject) =>{
            const sql="SELECT p.id, p.categories_id, c.categories_name, u.username, p.post_title, p.feature_image_url, p.post_content, p.create_time, p.modify_time FROM h1_users u JOIN h1_posts p ON (u.id = p.user_id) JOIN h1_post_categories_description c ON (c.categories_id = p.categories_id) WHERE p.active = 1;";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: getAllDocs" + " (" + __filename + ")");
                resolve(result);
            });
        }),      

        insertDoc: (body) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql =   "INSERT INTO h1_posts (user_id, categories_id, post_title, feature_image_url, post_content)" +
                        "VALUES ((SELECT id FROM h1_users WHERE username= '" +  data.username + "' )," +
                        "(SELECT categories_id FROM h1_post_categories_description WHERE categories_name = '" + data.category + "' ), '" +
                        data.post_title + "' , '" + data.feature_image_url + "' , '" + data.post_content + "');";
                                                                                                                                // RegExp - /(font-family.*?)[^>]*/ is for the style "font-family" pasted from Chrome.                        
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: insertDoc" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        updateDoc: (body) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql = "UPDATE h1_posts " + 
                        "SET    categories_id = (SELECT categories_id FROM h1_post_categories_description WHERE categories_name ='" +  data.category + "')," +
                                "post_title = '" +  data.post_title + "'," +
                                "feature_image_url =  '" +  data.feature_image_url + "'," +
                                "post_content = '" + data.post_content + "'," +
                                "update_by = (SELECT id FROM h1_users WHERE username= '" +  data.username + "' )," +
                                "modify_time = CURRENT_TIMESTAMP " +
                        "WHERE id = '" + data.id +"';";            
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updateDoc" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        deleteDoc: (data)=> new Promise((resolve,reject)=>{
            const sql = "UPDATE h1_posts " + 
                        "SET    active = '0'," +
                                "modify_time = CURRENT_TIMESTAMP " +
                        "WHERE id = '" + data.id +"';";                        
            pool.query(sql, function (err) {
                if (err) 
                    reject(err, "\n   at FUNC: deleteDoc" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        //////////////////// Documents - Comments
        getAllDocComments: () => new Promise((resolve, reject)=>{
            const sql="SELECT c.id, u.username, p.post_title, c.post_comments, p.create_time FROM h1_users u JOIN h1_posts p ON (u.id = p.user_id) JOIN h1_post_comments c ON (c.post_id = p.id) WHERE c.active = 1;";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: getAllDocComments" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        deleteDocComment: (data) => new Promise((resolve, reject)=>{
            const sql = "UPDATE h1_post_comments " +     // NOTE: The last blank space in this line is very important. If not, cannot be executed.
                        "SET    active = '0'" +
                        "WHERE id = '" + data.id +"';";                        
            pool.query(sql, function (err) {
                if (err) 
                    reject(err, "\n   at FUNC: deleteDocComment" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        //////////////////// Documents - Categories
        getAllDocCategories: ()=> new Promise((resolve,reject)=>{
            //const sql="SELECT d.categories_name AS 'title', c.categories_id AS 'key', c.parent_id FROM h1_post_categories_description d JOIN h1_post_categories c ON (d.categories_id = c.categories_id) WHERE c.active = 1 ORDER BY c.categories_id;";
            const sql="SELECT c.categories_id, d.categories_name AS 'name', c.parent_id FROM h1_post_categories_description d JOIN h1_post_categories c ON (d.categories_id = c.categories_id) WHERE c.active = 1;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllDocCategories" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        insertDocCategory: (body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1="INSERT INTO h1_post_categories (parent_id, categories_image) VALUES (" + data.pid + ", '" + data.image + "');";          
            pool.query(sql1, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: insertDocCategory - sql1" + " (" + __filename + ")");
                const sql2="INSERT INTO h1_post_categories_description (categories_id, categories_name) VALUES (" + result.insertId + ", '" + data.name + "');" ;
                pool.query(sql2, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: insertDocCategory - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                resolve("Success!");
            });
        }),

        updateDocCategory: (body)=>new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1="UPDATE h1_post_categories_description SET categories_name = '" + data.name + "' WHERE categories_id =" + data.id + ";";
            pool.query(sql1, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updateDocCategory - sql1" + " (" + __filename + ")");
                const sql2= data.image !== ""? 
                    ("UPDATE h1_post_categories SET categories_image = '" + data.image + "', last_modified = CURRENT_TIMESTAMP WHERE categories_id =" + data.id + ";"):
                    ("UPDATE h1_post_categories SET last_modified = CURRENT_TIMESTAMP WHERE categories_id =" + data.id + ";");
                pool.query(sql2, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: updateDocCategory - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                resolve("Success!");
            });
        }),

        deleteDocCategory:(data)=>new Promise((resolve,reject)=>{
            const sql = "UPDATE h1_post_categories SET active = '0', last_modified = CURRENT_TIMESTAMP WHERE categories_id =" + data.id + ";";
            pool.query(sql, function (err) {
                if (err) 
                    reject(err, "\n   at FUNC: deleteDocCategory" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        // ********************************************************************************************************************
        // VIDEO MANAGEMENT ***************************************************************************************************
        //////////////////// Videos
        getAllVideos: ()=> new Promise((resolve,reject) =>{
                                                // m.video_category_id is used for checking for deleting a category on which there are not videos. 
            const sql="SELECT v.id, u.username, m.video_category_id, c.category_name, v.video_title, v.video_description, v.cover_image_path, v.video_path, v.time_length FROM h1_users u JOIN h1_videos v ON (u.id = v.user_id) JOIN h1_video_category_mapping m ON (m.video_id = v.id) JOIN h1_video_category c ON (m.video_category_id = c.id) WHERE v.active = 1;";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: getAllVideos" + " (" + __filename + ")");
                resolve(result);
            });
        }),        
        
        insertVideo: (body) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1 =   "INSERT INTO h1_videos (user_id, video_title, video_description, cover_image_path, video_path, time_length)" +
                        "VALUES ((SELECT id FROM h1_users WHERE username= '" +  data.username + "' ), '" +
                        data.title + "' , '" + data.desc + "' , '"+ data.coverImage + "' , '"+ data.videoPath + "' , '" + data.timeLength + "');";
            pool.query(sql1, function (err, result) {
                if (err) 
                    reject(err, "\n   at FUNC: insertVideo - sql1" + " (" + __filename + ")");
                const sql2 = "INSERT INTO h1_video_category_mapping (video_category_id, video_id) VALUES ((SELECT id FROM h1_video_category WHERE category_name='" + data.category + "'),'" + result.insertId + "');";
                pool.query(sql2, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: insertVideo - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                resolve("Success!");
            });
        }),

        updateVideo: (body) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1 = "UPDATE h1_videos " + 
                        "SET    video_title = '" +  data.title + "'," +
                                "video_description = '" +  data.desc + "'," +
                                "cover_image_path =  '" +  data.coverImage + "'," +
                                "video_path = '" + data.videoPath + "'," +
                                "time_length = '" + data.timeLength + "'," +
                                "update_by = (SELECT id FROM h1_users WHERE username= '" +  data.username + "' )," +
                                "modify_time = CURRENT_TIMESTAMP " +
                        "WHERE id = '" + data.id +"';";            
            pool.query(sql1, (err)=>{
                if (err)
                    reject(err, "\n   at FUNC: updateVideo - sql1" + " (" + __filename + ")");
                const sql2 = "UPDATE h1_video_category_mapping SET video_category_id = (SELECT id FROM h1_video_category WHERE category_name= '" +  data.category + "' ) WHERE video_id= '" + data.id +"';";
                pool.query(sql2, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: updateVideo - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                resolve("Success!");
            });
        }),

        deleteVideo: (data)=> new Promise((resolve,reject)=>{
            const sql = "UPDATE h1_videos " + 
                        "SET    active = '0'," +
                                "modify_time = CURRENT_TIMESTAMP " +
                        "WHERE id = '" + data.id +"';";                        
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteVideo" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        //////////////////// Videos - Comments
        getAllVideoComments: () => new Promise((resolve, reject)=>{
            const sql="SELECT c.id, u.username, v.video_title, c.video_comments, c.create_time FROM h1_video_comments c JOIN h1_users u ON (u.id = c.user_id) JOIN h1_videos v ON (v.id = c.video_id) WHERE c.active = 1;";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: getAllVideoComments" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        deleteVideoComment: (data) => new Promise((resolve, reject)=>{
            const sql = "UPDATE h1_video_comments " +     // NOTE: The last blank space in this line is very important. If not, cannot be executed.
                        "SET    active = '0'" +
                        "WHERE id = '" + data.id +"';";                        
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteVideoComment" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        /////////////////// Videos - Categories
        getAllVideoCategories: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT id AS 'categories_id', category_name AS 'name', parent_id FROM h1_video_category WHERE active = 1;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllVideoCategories" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        insertVideoCategory: (body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql="INSERT INTO h1_video_category (parent_id, category_name) VALUES (" + data.pid + ", '" + data.name + "');";          
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: insertVideoCategory" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        updateVideoCategory: (body)=>new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql="UPDATE h1_video_category SET category_name = '" + data.name + "', modify_time = CURRENT_TIMESTAMP WHERE id =" + data.id + ";";
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updateVideoCategory" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        deleteVideoCategory:(data)=>new Promise((resolve,reject)=>{
            const sql = "UPDATE h1_video_category SET active = '0', modify_time = CURRENT_TIMESTAMP WHERE id =" + data.id + ";";
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteVideoCategory" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        // ********************************************************************************************************************
        // EVENT MANAGEMENT ***************************************************************************************************
        //////////////////// Events
        getAllEvents: ()=> new Promise((resolve,reject) =>{
            //const sql="SELECT e.id, u.username, e.events_title, t.events_type_name, e.events_type, e.events_description, e.events_costs, e.create_time, e.start_date, e.end_date, e.cover_image, e.member_limit, e.events_location, e.city_id, c.name, e.currencies_id, b.title FROM h1_users u JOIN h1_events e ON (u.id = e.user_id) JOIN h1_events_type t ON (e.events_type = t.id) JOIN h1_city c ON (e.city_id = c.id) JOIN h1_currencies b ON (e.currencies_id = b.currencies_id) WHERE e.active = 1;";
            const sql="SELECT e.id, u.username, e.events_title, e.events_type, e.events_description, e.events_costs, e.create_time, e.start_date, e.end_date, e.cover_image, e.member_limit, e.events_location, e.city_id, e.currencies_id FROM h1_users u JOIN h1_events e ON (u.id = e.user_id) WHERE e.active = 1;";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: getAllEvents" + " (" + __filename + ")");
                resolve(result);
            });
        }),
        
        getEventById: (id)=> new Promise((resolve,reject) =>{
            const sql="SELECT u.username, e.events_title, e.events_type, e.events_type, e.events_description, e.events_costs, e.create_time, e.start_date, e.end_date, e.cover_image, e.member_limit, e.events_location, e.city_id, e.city_id, e.currencies_id FROM h1_users u JOIN h1_events e ON (u.id = e.user_id) WHERE e.active = 1 AND e.id=" + id + ";";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: getEventById" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        insertEvent: (body) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql =   "INSERT INTO h1_events (user_id, events_title, events_location, start_date, end_date, cover_image, member_limit, events_type, events_description, events_costs, currencies_id, city_id)" +
                        "VALUES ((SELECT id FROM h1_users WHERE username= '" +  data.user + "' ), '" +
                        data.title + "' , '" + data.location + "' , '" + data.start + "' , '" + data.end + "' , '" + data.image + "' , '" + data.limit + "' , " + data.type + ", '" +                        
                        data.content + "' , '" + data.costs + "' , " + data.currency + " , " + data.city + ");"
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: insertEvent" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        updateEvent: (body) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);            
            const sql = "UPDATE h1_events " + 
                        "SET    events_type = " +  data.type + "," +
                                "events_title = '" +  data.title + "'," +
                                "events_costs =  '" +  data.costs + "'," +
                                "start_date = '" + data.start + "'," +
                                "end_date = '" + data.end + "'," +
                                "cover_image = '" + data.image + "'," +
                                "member_limit = '" + data.limit + "'," +
                                "events_location = '" + data.location + "'," +
                                "events_description = '" + data.content + "'," +
                                "currencies_id = '" + data.currency + "'," +
                                "city_id = " +  data.city + "," +
                                "update_by = (SELECT id FROM h1_users WHERE username= '" +  data.username + "' )," +
                                "update_time = CURRENT_TIMESTAMP " +
                        "WHERE id = '" + data.id +"';";            
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updateEvent" + " (" + __filename + ")");
                resolve("Success!");
                
            });
        }),

        deleteEvent: (data)=> new Promise((resolve,reject)=>{
            const sql = "UPDATE h1_events SET active = '0', update_time = CURRENT_TIMESTAMP  WHERE id = '" + data.id +"';";                        
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteEvent" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),
        
        ///////////////////// Events - Categories
        getAllEventCategories: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT id AS 'categories_id', events_type_name AS 'name', parent_id FROM h1_events_type WHERE active = 1;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllEventCategories" + " (" + __filename + ")");
                resolve(result);
            });
        }),
        
        insertEventCategory: (body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql="INSERT INTO h1_events_type (parent_id, events_type_name) VALUES (" + data.pid + ", '" + data.name + "');";          
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: insertEventCategory" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        updateEventCategory: (body)=>new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1="UPDATE h1_events_type SET events_type_name = '" + data.name + "', modify_time = CURRENT_TIMESTAMP WHERE id =" + data.id + ";";
            pool.query(sql1, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updateEventCategory" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        deleteEventCategory:(data)=>new Promise((resolve,reject)=>{
            const sql = "UPDATE h1_events_type SET active = '0', modify_time = CURRENT_TIMESTAMP WHERE id =" + data.id + ";";
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteEventCategory" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        ///////////////////// Events - Comments
        getAllEventComments: () => new Promise((resolve, reject)=>{
            const sql="SELECT c.id, u.username, e.events_title, c.comments, c.create_time FROM h1_events_comments c JOIN h1_users u ON (u.id = c.user_id) JOIN h1_events e ON (c.events_id = e.id) WHERE c.active = 1;";
            pool.query(sql, (err, result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllEventComments" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        deleteEventComment: (data) => new Promise((resolve, reject)=>{
            const sql = "UPDATE h1_events_comments " +     // NOTE: The last blank space in this line is very important. If not, cannot be executed.
                        "SET    active = '0'" +
                        "WHERE id = '" + data.id +"';";
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteEventComment" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        // ********************************************************************************************************************
        // LESSON MANAGEMENT ***************************************************************************************************
        //////////////////// Lessons
        getAllLessons: ()=> new Promise((resolve,reject) =>{
            const sql="SELECT l.id, u.username, l.categories_id, c.categories_name, l.title, l.cover_image, l.short_description, l.full_description, l.speaker, l.price, l.special_price, l.lessons_count, l.payment_type, l.attends_total, l.currencies_id, b.title AS 'currencies_name' FROM h1_users u JOIN h1_lessons l ON (u.id = l.user_id) JOIN h1_lesson_categories_description c ON (c.categories_id = l.categories_id) JOIN h1_currencies b ON (l.currencies_id = b.currencies_id) WHERE l.active = 1;";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: getAllLessons" + " (" + __filename + ")");
                resolve(result);
            });
        }),        

        insertLesson: (body, filesName) => new Promise((resolve,reject)=>{            
            const data = func.handleSpecialChar(body);
            const sql1 = "SELECT id, rcUserId, portrait FROM h1_users WHERE username = '" + data.user +"';";
            pool.query(sql1, (err, result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: insertLesson - sql1" + " (" + __filename + ")");
                // Create a chat group in the app (Yes, our mobile app.), and use the group_id to fill the table.
                instance.post(
                    db.config_chat_group,
                    {
                        "user_id": result[0].id,
                        "title": data.title,
                        "rcUserId": result[0].rcUserId,
                        "portrait": result[0].portrait
                    }
                ).then((info)=>{
                    const sql2 =   "INSERT INTO h1_lessons (user_id, categories_id, title, cover_image, short_description, full_description, speaker, price, special_price, lessons_count, payment_type, chat_groups_id, currencies_id)" +
                                "VALUES ((SELECT id FROM h1_users WHERE username= '" +  data.user + "' )," +
                                "(SELECT categories_id FROM h1_lesson_categories_description WHERE categories_name = '" + data.category + "' ), '" +
                                data.title + "' , '" + data.image + "' , '" + data.short_desc + "' , '" + data.full_desc + "' , '" + data.lecturer + "' , '" + data.price + "' , '" + data.special + "' , '" + data.sections + "' , '" + data.type + "' , " + info.data.group_id + ", " + data.currency + ");";
                    pool.query(sql2, (err, result)=>{  
                        if (err)
                            reject(`${err} \n   at FUNC: insertLesson - sql2 ( ${__filename})`);
                        if(filesName.length !== 0){
                            const titles = data.titleArray.split(',');
                            const descs = data.descArray.split(',');
                            const duras = data.duraArray.split(',');
                            for(let i=0; i<filesName.length; i++){
                                let sql3 = "INSERT INTO h1_lesson_lists (lesson_id, title, sub_title, media_file_url, media_info) VALUES (" + result.insertId + ", '" + titles[i] + "', '" + descs[i] + "', '" + filesName[i] + "', '" + duras[i] + "');";
                                pool.query(sql3, (err, result)=>{
                                    if (err) 
                                        reject(err, "\n   at FUNC: insertLesson - sql3" + " (" + __filename + ")");
                                    resolve("Success!");
                                });                                
                            }
                            resolve("Success!");
                        }
                        else{
                            resolve("Success!");
                        }                        
                    });
                }).catch(err=>{
                    reject(err, "\n   at FUNC: insertLesson - instance.post" + " (" + __filename + ")");
                });
                resolve("Success!");
            });
        }),

        updateLesson: (body) => new Promise((resolve,reject)=>{            
            const data = func.handleSpecialChar(body);
            const sql = "UPDATE h1_lessons " + 
                            "SET    categories_id = (SELECT categories_id FROM h1_lesson_categories_description WHERE categories_name ='" +  data.category + "')," +
                                    "title = '" +  data.title + "'," +
                                    "cover_image =  '" +  data.image + "'," +
                                    "short_description =  '" +  data.short_desc + "'," +
                                    "full_description =  '" +  data.full_desc + "'," +
                                    "speaker =  '" +  data.lecturer + "'," +
                                    "price = '" + data.price + "'," +
                                    "special_price = '" + data.special + "'," +
                                    "lessons_count = '" + data.sections + "'," +
                                    "payment_type = '" + data.type + "'," +
                                    "currencies_id = " + data.currency + "," +
                                    "update_by = (SELECT id FROM h1_users WHERE username= '" +  data.user + "' )," +
                                    "modify_time = CURRENT_TIMESTAMP " +
                            "WHERE id = '" + data.id +"';";
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updateLesson" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        deleteLesson: (data)=> new Promise((resolve,reject)=>{
            const sql = "UPDATE h1_lessons " + 
                        "SET    active = '0'," +
                                "modify_time = CURRENT_TIMESTAMP " +
                        "WHERE id = '" + data.id +"';";                        
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteLesson" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        ///////////////////// Lessons - Comments
        getAllLessonComments: () => new Promise((resolve, reject)=>{
            const sql="SELECT c.id, u.username, e.title, c.comments, c.create_time FROM h1_lesson_comments c JOIN h1_users u ON (u.id = c.user_id) JOIN h1_lessons e ON (c.lesson_id = e.id) WHERE c.active = 1;";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: getAllLessonComments" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        deleteLessonComment: (data) => new Promise((resolve, reject)=>{
            const sql = "UPDATE h1_lesson_comments " +     // NOTE: The last blank space in this line is very important. If not, cannot be executed.
                        "SET    active = '0'" +
                        "WHERE id = '" + data.id +"';";
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteLessonComment" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        ///////////////////// Lessons - Categories
        getAllLessonCategories: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT c.categories_id, d.categories_name AS 'name', c.parent_id FROM h1_lesson_categories_description d JOIN h1_lesson_categories c ON (d.categories_id = c.categories_id) WHERE c.active = 1;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllLessonCategories" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        insertLessonCategory: (body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);            
            const sql1="INSERT INTO h1_lesson_categories (parent_id, categories_image) VALUES (" + data.pid + ", '" + data.image + "');";          
            pool.query(sql1, (err,result)=>{
                if (err)
                    reject(err, "\n   at FUNC: insertLessonCategory - sql1" + " (" + __filename + ")");
                const sql2="INSERT INTO h1_lesson_categories_description (categories_id, categories_name) VALUES (" + result.insertId + ", '" + data.name + "');" ;
                pool.query(sql2, (err,result)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: insertLessonCategory - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                resolve("Success!");
            });
        }),

        updateLessonCategory: (body)=>new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1="UPDATE h1_lesson_categories_description SET categories_name = '" + data.name + "' WHERE categories_id =" + data.id + ";";
            pool.query(sql1, (err)=>{
                if (err)
                    reject(err, "\n   at FUNC: updateLessonCategory - sql1" + " (" + __filename + ")");
                const sql2= data.image !== ""? 
                    ("UPDATE h1_lesson_categories SET categories_image = '" + data.image + "', last_modified = CURRENT_TIMESTAMP WHERE categories_id =" + data.id + ";"):
                    ("UPDATE h1_lesson_categories SET last_modified = CURRENT_TIMESTAMP WHERE categories_id =" + data.id + ";");
                pool.query(sql2, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: updateLessonCategory - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                resolve("Success!");
            });
        }),

        deleteLessonCategory:(data)=>new Promise((resolve,reject)=>{
            const sql = "UPDATE h1_lesson_categories SET active = '0', last_modified = CURRENT_TIMESTAMP WHERE categories_id =" + data.id + ";";
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteLessonCategory" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        //////////////////// Lessons - Sections on ONE lesson
        getAllLessonSections: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT id, lesson_id, title, sub_title, media_file_url, media_info FROM h1_lesson_lists WHERE active = 1;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllLessonSections" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        deleteLessonSection:(data)=>new Promise((resolve,reject)=>{
            const sql1 = "UPDATE h1_lesson_lists SET active = '0' WHERE id =" + data.id + ";";
            pool.query(sql1, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteLessonSection - sql1" + " (" + __filename + ")");
                const sql2 = "UPDATE h1_lessons SET lessons_count = '" + (Number(data.sections)-1) + "' WHERE id =" + data.lesson_id + ";";
                pool.query(sql2, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: deleteLessonSection - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                resolve("Success!");
            });
        }),

        // ********************************************************************************************************************
        // QUESTION MANAGEMENT ************************************************************************************************
        //////////////////// Questions
        getAllQuestions: ()=> new Promise((resolve,reject) =>{
            const sql="SELECT q.id, q.categories_id AS 'tag_id', d.categories_name AS 'tags_name', u.username, q.title, q.cover_image, q.questions, q.total_answers, q.payable, c.title AS 'currency' FROM h1_users u JOIN h1_quizs q ON (u.id = q.user_id) JOIN h1_quiz_categories_description d ON (q.categories_id = d.categories_id) JOIN h1_currencies c ON(q.currency_id = c.currencies_id) WHERE q.active = 1 ORDER BY q.id;";
            pool.query(sql, (err, result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllQuestions" + " (" + __filename + ")");
                resolve(result);
            });
        }),        

        insertQuestion: (body, filesName) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1 =   "INSERT INTO h1_quizs (categories_id, user_id, title, questions, payable, cover_image, currency_id)" +
                        "VALUES ((SELECT categories_id FROM h1_quiz_categories_description WHERE categories_name= '" +  data.tag_name + "' ), " +
                        "(SELECT id FROM h1_users WHERE username= '" +  data.user + "' ), '" +
                        data.title + "' , '" + data.question + "' , '"+ data.payable + "' , '" + data.cover_image + "' , " + 
                        "(SELECT currencies_id FROM h1_currencies WHERE title = '" + data.currency + "'));";
            pool.query(sql1, (err, result)=>{
                if (err)
                    reject(err, "\n   at FUNC: insertQuestion - sql1" + " (" + __filename + ")");
                filesName.map(one=>{
                    let sql2 = "INSERT INTO h1_quiz_media_mapping (quizs_id, media_url, media_type) VALUES(" + result.insertId + ", '" + one + "', '" + one.slice(-(one.length-one.lastIndexOf('.')-1)) + "');"
                    pool.query(sql2, (err)=>{
                        if (err) 
                            reject(err, "\n   at FUNC: insertQuestion - sql2" + " (" + __filename + ")");
                        resolve("Success!");
                    });
                });
                resolve("Success!");
            });
        }),

        updateQuestion: (body) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);            
            let sql1 = "UPDATE h1_quizs " + 
                        "SET    categories_id = (SELECT categories_id FROM h1_quiz_categories_description WHERE categories_name= '" +  data.tag_name + "' ), " +
                                "title = '" +  data.title + "'," +
                                "cover_image =  '" +  data.cover_image + "'," +
                                "payable =  '" +  data.payable + "'," +
                                "currency_id =  (SELECT currencies_id FROM h1_currencies WHERE title= '" +  data.currency + "' )," +
                                "questions =  '" +  data.question + "'," +
                                "update_by = (SELECT id FROM h1_users WHERE username= '" +  data.user + "' )," +
                                "modify_time = CURRENT_TIMESTAMP " +
                        "WHERE id = '" + data.id +"';";            
            pool.query(sql1, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updateQuestion - sql1" + " (" + __filename + ")");
                // The cover_image is as the first image in the h1_quiz_media_mapping. So you have to update it according the order of the image on that quiz and it is the first one.
                const sql2 = "SELECT id FROM h1_quiz_media_mapping WHERE quizs_id = " + data.id + " ORDER BY id;"
                pool.query(sql2, (err, result)=>{
                    if (err)
                        reject(err, "\n   at FUNC: updateQuestion - sql2" + " (" + __filename + ")");
                    if(result.length !== 0){
                        const sql3 = "UPDATE h1_quiz_media_mapping SET media_url= '" + data.cover_image + "', media_type = '" + (data.cover_image).slice(-((data.cover_image).length-(data.cover_image).lastIndexOf('.')-1)) + "' WHERE id = " + result[0].id + ";";
                        pool.query(sql3, (err)=>{
                            if (err) 
                                reject(err, "\n   at FUNC: updateQuestion - sql3" + " (" + __filename + ")");
                            resolve("Success!");
                        });
                        resolve("Success!");
                    }
                    else{
                        resolve("No pictures in h1_quiz_media_mapping.")
                    }
                });
            });
        }),

        deleteQuestion: (data)=> new Promise((resolve,reject)=>{
            const sql = "UPDATE h1_quizs " + 
                        "SET    active = '0'," +
                                "modify_time = CURRENT_TIMESTAMP " +
                        "WHERE id = '" + data.id +"';";                        
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteQuestion" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        //////////////////// Questions - Images on ONE question
        getAllQuestionImages: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT id, quizs_id, media_url FROM h1_quiz_media_mapping WHERE active = 1;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllQuestionImages" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        deleteQuestionImage:(data)=>new Promise((resolve,reject)=>{
            const sql = "UPDATE h1_quiz_media_mapping SET active = '0' WHERE id =" + data.id + ";";
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteQuestionImage" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        ///////////////////// Questions - Categories
        getAllQuestionCategories: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT c.categories_id, c.parent_id, d.categories_name AS 'name' FROM h1_quiz_categories c JOIN h1_quiz_categories_description d ON(c.categories_id=d.categories_id) WHERE c.active = 1;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllQuestionTags" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        insertQuestionCategory: (body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql="INSERT INTO h1_quiz_categories (tags_name, tags_count) VALUES ('" + data.name + "', 0);";          
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: insertQuestionTag" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        updateQuestionCategory: (body)=>new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql="UPDATE h1_quiz_tags SET tags_name = '" + data.name + "' WHERE id =" + data.id + ";";
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updateQuestionTag" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        deleteQuestionCategory: (data)=>new Promise((resolve,reject)=>{
            const sql = "UPDATE h1_quiz_tags SET active = '0' WHERE id =" + data.id + ";";
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteQuestionTag" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        ///////////////////// Questions - Answers on ONE question
        getAllQuestionAnswers: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT a.id, a.quizs_id, u.username, a.answers FROM h1_users u JOIN h1_quiz_answers a ON (u.id = a.user_id) WHERE a.active = 1;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllQuestionAnswers" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        deleteQuestionAnswer: (data)=>new Promise((resolve,reject)=>{
            const sql1 = "UPDATE h1_quiz_answers SET active = '0' WHERE id =" + data.answer_id + ";";
            pool.query(sql1, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteQuestionAnswer - sql1" + " (" + __filename + ")");
                const sql2 = "UPDATE h1_quizs SET total_answers = '" + (Number(data.answers)-1) + "' WHERE id =" + data.question_id + ";";
                pool.query(sql2, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: deleteQuestionAnswer - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                resolve("Success!");
            });
        }),

        insertQuestionAnswer: (body, filesName) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1 = "INSERT INTO h1_quiz_answers (user_id, quizs_id, answers)" +
                        "VALUES ((SELECT id FROM h1_users WHERE username= '" +  data.username + "' ), '" +
                        data.questionId + "' , '" + data.content + "');";
            pool.query(sql1, (err, result)=>{
                if (err)
                    reject(err, "\n   at FUNC: insertQuestionAnswer - sql1" + " (" + __filename + ")");
                if(filesName.length !== 0){
                    filesName.map(one=>{
                        let sql2 = "INSERT INTO h1_quiz_answers_media_mapping (answers_id, media_url, media_type) VALUES(" + result.insertId + ", '" + one + "', '" + one.slice(-(one.length-one.lastIndexOf('.')-1)) + "');"
                        pool.query(sql2, (err)=>{
                            if (err) 
                                reject(err, "\n   at FUNC: insertQuestionAnswer - sql2" + " (" + __filename + ")");
                            let sql3 = "UPDATE h1_quizs SET total_answers = " + (+data.total_answers+1) + " WHERE id= " + data.questionId + ";";
                            pool.query(sql3, (err)=>{
                                if (err) 
                                    reject(err, "\n   at FUNC: insertQuestionAnswer - sql3(if)" + " (" + __filename + ")");
                                resolve("Success!");
                            });
                            resolve("Success!");
                        });
                    });
                    resolve("Success!");
                }
                else{
                    let sql3 = "UPDATE h1_quizs SET total_answers = " + (data.total_answers+1) + "WHERE id= " + data.questionId + ";";
                    pool.query(sql3, (err)=>{
                        if (err) 
                            reject(err, "\n   at FUNC: insertQuestionAnswer - sql3(else)" + " (" + __filename + ")");
                        resolve("Success!");
                    });
                    resolve("Success!");
                }
            });
        }),

        updateQuestionAnswer: (body, filesName) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1 = "UPDATE h1_quiz_answers SET answers= '" +  data.answer + "' WHERE id= '" + data.answerId + "';";
            pool.query(sql1, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updateQuestionAnswer - sql1" + " (" + __filename + ")");
                if(filesName.length !== 0){
                    filesName.map(one=>{
                        let sql2 = "INSERT INTO h1_quiz_answers_media_mapping (answers_id, media_url, media_type) VALUES('" + data.answerId + "', '" + one + "', '" + one.slice(-(one.length-one.lastIndexOf('.')-1)) + "');"
                      pool.query(sql2, (err)=>{
                            if (err) 
                                reject(err, "\n   at FUNC: updateQuestionAnswer - sql2" + " (" + __filename + ")");
                            resolve("Success!"); 
                        });
                    });
                    resolve("Success!");
                }
                else{
                    resolve("Success!");
                }
            });
        }),

        //////////////////// Questions - Answers - Images
        getAllQuestionAnswersImages: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT id, answers_id, media_url FROM h1_quiz_answers_media_mapping WHERE active = 1;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllQuestionAnswersImages" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        deleteQuestionAnswerImage:(data)=>new Promise((resolve,reject)=>{
            const sql = "UPDATE h1_quiz_answers_media_mapping SET active = '0' WHERE id =" + data.id + ";";
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteQuestionAnswerImage" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        insertQuestionAnswerImages: (body, filesName) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);            
            filesName.map(one=>{
                let sql = "INSERT INTO h1_quiz_answers_media_mapping (answers_id, media_url, media_type) VALUES(" + data.answerId + ", '" + one + "', '" + one.slice(-(one.length-one.lastIndexOf('.')-1)) + "');"
                pool.query(sql, (err)=>{
                    if (err) 
                            reject(err, "\n   at FUNC: insertQuestionAnswerImages" + " (" + __filename + ")");
                    resolve("Success!");
                });
            });
        }),

        // ********************************************************************************************************************
        // PRODUCT MANAGEMENT *************************************************************************************************
        //////////////////// Products
        getAllProducts: ()=> new Promise((resolve,reject) =>{
            const sql="SELECT p.products_id, p.products_image, p.products_ordered, p.manufacturers_id, p.brands_id, p.products_tax_class_id, p.products_weight, p.products_date_available, d.products_name, p.products_model, p.products_price, p.products_quantity, p.products_status, p.currencies_id, b.title, d.language_id, d.products_description, d.products_url FROM h1_shop_products p JOIN h1_shop_products_description d ON (p.products_id = d.products_id) JOIN h1_currencies b ON (p.currencies_id = b.currencies_id);";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: getAllProducts" + " (" + __filename + ")");
                resolve(result);
            });
        }),        

        insertProduct: (body, imageNames) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1 =  "INSERT INTO h1_shop_products (user_id, products_quantity, products_model, products_image, products_price, products_date_available, products_weight, products_status, products_tax_class_id, manufacturers_id, brands_id, products_ordered, currencies_id) " +
                          "VALUES ((SELECT id FROM h1_users WHERE username= '" +  data.user + "' ), " +
                          data.quantity + " , '" + data.model + "' , '"+ data.images + "' , " + data.price + " , '" + data.date + "' , " + data.weight + " , "+ data.status + " , " + data.taxClass_id + " , "+ data.manufacturer_id + " , " + data.brand_id + " , "+ data.ordered + " , " + data.currency_id +");";
            pool.query(sql1, (err, result)=>{
                if (err)
                    reject(err, "\n   at FUNC: insertProduct - sql1" + " (" + __filename + ")");
                const sql2 = "INSERT INTO h1_shop_products_description (products_id, language_id, products_name, products_description, products_url) " + 
                             "VALUE (" + result.insertId + ", " + data.lang_id + ", '" + data.name + "', '" + data.desc + "', '" + data.url + "');";
                pool.query(sql2, (err)=>{
                    if (err)
                        reject(err, "\n   at FUNC: insertProduct - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                
                JSON.parse(data.price_prefix).forEach(one =>{
                    const sql3 = "INSERT INTO h1_shop_products_attributes (products_id, options_id, options_values_id, options_values_price, price_prefix) " + 
                                 "VALUE (" + result.insertId + ", " + one.p + ", " + one.ov + ", " + one.value + ", '" + one.pre +"');";
                    pool.query(sql3, (err)=>{
                        if (err)
                            reject(err, "\n   at FUNC: insertProduct - sql3" + " (" + __filename + ")");
                        resolve("Success!");
                    });
                });
                JSON.parse(data.category).forEach(one =>{
                    const sql4 = "INSERT INTO h1_shop_products_to_categories (products_id, categories_id) " + 
                                 "VALUE (" + result.insertId + "," + one + ");";
                    pool.query(sql4, (err)=>{
                        if (err)
                            reject(err, "\n   at FUNC: insertProduct - sql4" + " (" + __filename + ")");
                        resolve("Success!");
                    });
                });
                imageNames.forEach(one=>{
                    const sql5 = "INSERT INTO h1_shop_products_images (products_id, image, htmlcontent, sort_order)" + 
                                 "VALUE (" + result.insertId + ", '" + one + "', '" + data.name + "', " + 10 + ");";
                    pool.query(sql5, (err)=>{
                        if (err)
                            reject(err, "\n   at FUNC: insertProduct - sql5" + " (" + __filename + ")");
                        resolve("Success!");
                    });
                });
                resolve("Success!");
            });
        }),

        updateProduct: (body, imageNames) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1 = "UPDATE h1_shop_products " + 
                        "SET    products_quantity = " +  data.quantity + "," +
                                "products_model =  '" +  data.model + "'," +
                                "products_image =  '" +  data.images + "'," +
                                "products_price =  " +  data.price + "," +
                                "products_date_available =  '" +  data.date + "'," +
                                "products_weight =  " +  data.weight + "," +
                                "products_status =  " +  data.status + "," +
                                "products_tax_class_id =  " +  data.taxClass_id + "," +
                                "manufacturers_id =  " +  data.manufacturer_id + "," +
                                "brands_id =  " +  data.brand_id + "," +
                                "products_ordered =  " +  data.ordered + "," +
                                "currencies_id =  " +  data.currency_id + "," +
                                "products_last_modified = CURRENT_TIMESTAMP " +
                        " WHERE products_id = '" + data.id +"';";            
            pool.query(sql1, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updateProduct - sql1" + " (" + __filename + ")");
                const sql2 = "UPDATE h1_shop_products_description " +
                                "SET    language_id = " +  data.lang_id + "," +
                                        "products_name =  '" +  data.name + "'," +
                                        "products_description =  '" +  data.desc + "'," +
                                        "products_url =  " +  data.url + 
                                " WHERE products_id = " + data.id +";";  
                pool.query(sql2, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: updateProduct - sql2" + " (" + __filename + ")");
                    resolve("Success!");                
                });
                const sql3 = "UPDATE h1_shop_products_attributes SET active = 0 WHERE products_id = " + data.id + ";";
                pool.query(sql3, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: updateProduct - sql3" + " (" + __filename + ")"); 
                    JSON.parse(data.price_prefix).forEach(one =>{
                        const sql4 = "INSERT INTO h1_shop_products_attributes (products_id, options_id, options_values_id, options_values_price, price_prefix) " + 
                                        "VALUE (" + data.id + ", " + one.p + ", " + one.ov + ", " + one.value + ", '" + one.pre +"');";
                        pool.query(sql4, (err)=>{
                            if (err)
                                reject(err, "\n   at FUNC: updateProduct - sql4" + " (" + __filename + ")");
                            resolve("Success!");
                        });
                    });
                    resolve("Success!");               
                });
                const sql5 = "UPDATE h1_shop_products_to_categories SET active = 0 WHERE products_id = " + data.id + ";";
                pool.query(sql5, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: updateProduct - sql5" + " (" + __filename + ")");
                    JSON.parse(data.category).forEach(one =>{
                        const sql6 = "INSERT INTO h1_shop_products_to_categories (products_id, categories_id) " + 
                                        "VALUE (" + data.id + "," + one + ");";
                        pool.query(sql6, (err, result)=>{
                            if (err)
                                reject(err, "\n   at FUNC: updateProduct - sql6" + " (" + __filename + ")");
                            resolve("Success!");
                        });
                        const sql7 = "UPDATE h1_shop_products_to_categories SET active = 1 WHERE products_id = " + data.id + " AND categories_id = " + one + ";";
                        pool.query(sql7, (err, result)=>{
                            if (err)
                                reject(err, "\n   at FUNC: updateProduct - sql7" + " (" + __filename + ")");
                            resolve("Success!");
                        });
                    });
                    resolve("Success!");
                });
                JSON.parse(data.deleteImageIds).forEach(one=>{
                    const sql8 = "UPDATE h1_shop_products_images " + 
                                "SET    active=0 " + 
                                "WHERE id = " + one + ";";
                    pool.query(sql8, (err)=>{
                        if (err) 
                            reject(err, "\n   at FUNC: updateProduct - sql8" + " (" + __filename + ")");
                        resolve("Success!");
                    });
                });
                imageNames.forEach(one=>{
                    const sql9 = "INSERT INTO h1_shop_products_images (products_id, image, htmlcontent, sort_order)" + 
                                 "VALUE (" + data.id + ", '" + one + "', '" + data.name + "', " + 10 + ");";
                    pool.query(sql9, (err)=>{
                        if (err)
                            reject(err, "\n   at FUNC: updateProduct - sql9" + " (" + __filename + ")");
                        resolve("Success!");
                    });
                });
                resolve("Success!");
            });
        }),

        deleteProduct: (data)=> new Promise((resolve,reject)=>{
            const sql = "UPDATE h1_shop_products " + 
                        "SET    products_status = '0'," +
                                "products_last_modified = CURRENT_TIMESTAMP " +   
                        "WHERE products_id = '" + data.id +"';";
                        
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteProduct" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        //////////////////// Products - Categories
        getAllProductCategories: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT c.categories_id, d.categories_name AS 'name', c.parent_id FROM h1_shop_categories_description d JOIN h1_shop_categories c ON (d.categories_id = c.categories_id) WHERE c.active = 1;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllProductCategories" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        getProductCategorieMatches: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT products_id, categories_id FROM h1_shop_products_to_categories WHERE active = 1;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getProductCategorieMatches" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        insertProductCategory: (body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1="INSERT INTO h1_shop_categories (parent_id, categories_image) VALUES (" + data.pid + ", '" + data.image + "');";          
            pool.query(sql1, (err,result)=>{
                if (err)
                    reject(err, "\n   at FUNC: insertProductCategory - sql1" + " (" + __filename + ")");
                const sql2="INSERT INTO h1_shop_categories_description (categories_id, categories_name) VALUES (" + result.insertId + ", '" + data.name + "');" ;
                pool.query(sql2, (err,result)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: insertProductCategory - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                resolve("Success!");
            });
        }),

        updateProductCategory: (body)=>new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1="UPDATE h1_shop_categories_description SET categories_name = '" + data.name + "' WHERE categories_id =" + data.id + ";";
            pool.query(sql1, (err)=>{
                if (err)
                    reject(err, "\n   at FUNC: updateProductCategory - sql1" + " (" + __filename + ")");
                const sql2= data.image !== ""?
                    ("UPDATE h1_shop_categories SET categories_image = '" + data.image + "', last_modified = CURRENT_TIMESTAMP WHERE categories_id =" + data.id + ";"):
                    ("UPDATE h1_shop_categories SET last_modified = CURRENT_TIMESTAMP WHERE categories_id =" + data.id + ";");
                pool.query(sql2, (err,result)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: updateProductCategory - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                resolve("Success!");
            });
        }),

        deleteProductCategory:(data)=>new Promise((resolve,reject)=>{
            const sql = "UPDATE h1_shop_categories SET active = '0', last_modified = CURRENT_TIMESTAMP WHERE categories_id =" + data.id + ";";
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: deleteProductCategory" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        //////////////////// Products - Attributes
        getAllProductAttributes: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT o.products_options_values_to_products_options_id, o.products_options_id, n.products_options_name, o.products_options_values_id, v.products_options_values_name, v.language_id, l.languages_name FROM h1_shop_products_options n RIGHT JOIN h1_shop_products_options_values_to_products_options o ON (n.products_options_id = o.products_options_id) LEFT JOIN h1_shop_products_options_values v ON (o.products_options_values_id = v.products_options_values_id) JOIN h1_languages l ON (v.language_id = l.id) WHERE n.active = 1 AND v.active = 1;"; 
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllProductAttributes" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        getProductAttributeMatches: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT a.products_id, a.options_id, a.options_values_id, a.options_values_price, a.price_prefix, o.products_options_values_to_products_options_id FROM h1_shop_products_attributes a JOIN h1_shop_products_options_values_to_products_options o ON(a.options_id = o.products_options_id && a.options_values_id = o.products_options_values_id) WHERE a.active = 1;"; 
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getProductAttributeMatches" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        insertProductAttribute: (body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1="INSERT INTO h1_shop_products_options_values (language_id, products_options_values_name) VALUES ((SELECT id FROM h1_languages WHERE languages_name = '" + data.language + "'), '" + data.name + "');";          
            pool.query(sql1, (err,result)=>{
                if (err)
                    reject(err, "\n   at FUNC: insertProductAttribute - sql1" + " (" + __filename + ")");
                const sql2="INSERT INTO h1_shop_products_options_values_to_products_options (products_options_values_id, products_options_id) VALUES (" + result.insertId + ", (SELECT products_options_id FROM h1_shop_products_options WHERE products_options_name = '" + data.group + "' AND active = 1));" ;
                pool.query(sql2, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: insertProductAttribute - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                resolve("Success!");
            });
        }),

        updateProductAttribute: (body)=>new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1="UPDATE h1_shop_products_options_values_to_products_options SET products_options_id = (SELECT products_options_id FROM h1_shop_products_options WHERE products_options_name = '" + data.group + "') WHERE products_options_values_to_products_options_id =" + data.id + ";";
            pool.query(sql1, (err)=>{
                if (err)
                    reject(err, "\n   at FUNC: updateProductAttribute - sql1" + " (" + __filename + ")");
                const sql2="UPDATE h1_shop_products_options_values SET language_id = (SELECT id FROM h1_languages WHERE languages_name = '" + data.language + "'), products_options_values_name = '" + data.name + "' WHERE products_options_values_id = (SELECT products_options_values_id FROM h1_shop_products_options_values_to_products_options WHERE products_options_values_to_products_options_id =" + data.id + ");";
                pool.query(sql2, (err,result)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: updateProductAttribute - sql2" + " (" + __filename + ")");
                    resolve(result);
                });
                resolve("Success!");
            });
        }),

        deleteProductAttribute:(data)=>new Promise((resolve,reject)=>{
            data.checkedIds.forEach(one=>{
                const sql = "UPDATE h1_shop_products_options_values SET active = '0' WHERE products_options_values_id = (SELECT products_options_values_id FROM h1_shop_products_options_values_to_products_options WHERE products_options_values_to_products_options_id ='" + one + "');";
                pool.query(sql, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: deleteProductAttribute" + " (" + __filename + ")");
                    resolve("Success!");
                });
            });
        }),

        //////////////////// Products - Attribute Groups
        getAllProductAttributeGroups: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT o.products_options_name, o.products_options_id, l.languages_name FROM h1_shop_products_options o JOIN h1_languages l ON (o.language_id = l.id) WHERE o.active = 1;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllProductAttributeGroups" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        insertProductAttributeGroup: (body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql="INSERT INTO h1_shop_products_options (language_id, products_options_name) VALUES ((SELECT id FROM h1_languages WHERE languages_name = '" + data.language + "'), '" + data.name + "');";          
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: insertProductAttributeGroup" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        updateProductAttributeGroup: (body)=>new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql="UPDATE h1_shop_products_options SET language_id = (SELECT id FROM h1_languages WHERE languages_name = '" + data.language + "'), products_options_name = '" + data.name + "' WHERE products_options_id = " + data.id + ";";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updateProductAttributeGroup" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        deleteProductAttributeGroup:(data)=>new Promise((resolve,reject)=>{
            data.checkedIds.forEach(one=>{
                const sql = "UPDATE h1_shop_products_options SET active = '0' WHERE products_options_id ='" + one + "';";
                pool.query(sql, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: deleteProductAttributeGroup" + " (" + __filename + ")");
                    resolve("Success!");
                });
            });
        }),

        //////////////////// Products - tax
        getProductsTaxeClasses: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT tax_class_id, tax_class_title FROM h1_shop_tax_class;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getProductTaxeClasses" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        //////////////////// Products - images
        getProductsImages: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT products_id, image, htmlcontent, sort_order FROM h1_shop_products_images WHERE active=1;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getProductTaxeClasses" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        getOneProductImages: ( id )=> new Promise((resolve,reject)=>{
            const sql="SELECT id, image FROM h1_shop_products_images WHERE active=1 AND products_id= " + id + ";";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getProductTaxeClasses" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        //////////////////// Products - Manufacturers
        getAllManufacturers: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT manufacturers_id, manufacturers_name, manufacturers_image FROM h1_shop_manufacturers;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllManufacturers" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        //////////////////// Products - Brands
        getAllBrands: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT id, brands_name, brands_logo FROM h1_shop_brands;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllBrands" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        // ********************************************************************************************************************
        // HEALTH MANAGEMENT **************************************************************************************************
        //////////////////// Doctors
        getAllDoctors: ()=> new Promise((resolve,reject) =>{
            const sql="SELECT d.id, u.username, d.name, d.image, d.title, d.education, d.qualification, d.doctor_categories_id, d.quiz_categories_id, d.city_id, d.major, d.achievement, c.categories_name, t.name AS 'city_name', l.languages_name FROM h1_users u JOIN h1_health_doctors d ON (u.id = d.user_id) JOIN h1_health_doctor_categories_description c ON (d.doctor_categories_id = c.categories_id) JOIN h1_city t ON (d.city_id = t.id) JOIN h1_quiz_categories_description q ON(q.categories_id = d.quiz_categories_id) JOIN h1_languages l ON(l.id = q.language_id) WHERE d.active = 1;";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: getAllDoctors" + " (" + __filename + ")");
                resolve(result);
            });
        }), 
        
        deleteDoctors:(data)=>new Promise((resolve,reject)=>{
            data.checkedIds.forEach(one=>{
                const sql = "UPDATE h1_health_doctors SET active = '0' WHERE id =" + one + ";";
                pool.query(sql, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: deleteDoctors" + " (" + __filename + ")");
                    resolve("Success!");
                });
            });
        }),

        insertDoctor: (body) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            // First, create a category in h1__quiz_categories(and update h1_quiz_categories_description);
            // Sencond, use the id of the category to create a doctor.
            const sql1 = "INSERT INTO h1_quiz_categories (categories_image, parent_id) VALUES('" + data.image + "', " + "7);";
            pool.query(sql1, (err, result)=> {
                if (err) 
                    reject(err, "\n   at FUNC: insertDoctor - sql1" + " (" + __filename + ")");
                const sql2 = "INSERT INTO h1_quiz_categories_description (categories_id, language_id, categories_name) VALUES(" + result.insertId + ", (SELECT id FROM h1_languages WHERE languages_name = '" + data.language + "'), '" + data.real_name + "');";
                pool.query(sql2, (err)=> {
                    if (err) 
                        reject(err, "\n   at FUNC: insertDoctor - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                const sql3 = "INSERT INTO h1_health_doctors (user_id, name, image, title, education, qualification, doctor_categories_id, quiz_categories_id, city_id, major, achievement)" +
                            "VALUES ((SELECT id FROM h1_users WHERE username= '" +  data.user_name + "' ), '" +
                            data.real_name + "' , '"  + data.image + "' , '" + data.title + "' , '" + data.edu + "' , '" + data.quali + "' , " + 
                            "(SELECT categories_id FROM h1_health_doctor_categories_description WHERE categories_name = '" + data.category + "'), " + 
                            result.insertId + ", " + data.city_id + " , '" + data.major + "' , '" + data.achiev + "');";
                pool.query(sql3, (err)=> {
                    if (err) 
                        reject(err, "\n   at FUNC: insertDoctor - sql3" + " (" + __filename + ")");
                    resolve("Success!");
                });
                resolve("Success!");
            });
        }),

        updateDoctor: (body)=> new Promise((resolve, reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1 = data.image !== ''? 
                ("UPDATE h1_health_doctors SET user_id= (SELECT id FROM h1_users WHERE username= '" +  data.user_name + "' ), name = '" + data.real_name + "', image = '" + data.image + "', title = '" + data.title + "', education = '" + data.edu + "', qualification = '" + data.quali + "', doctor_categories_id = (SELECT categories_id FROM h1_health_doctor_categories_description WHERE categories_name = '" + data.category + "'), city_id = " + data.city_id + ", major = '" + data.major + "', achievement = '" + data.achiev + "' WHERE id = '" + data.doctorId + "';"):
                ("UPDATE h1_health_doctors SET user_id= (SELECT id FROM h1_users WHERE username= '" +  data.user_name + "' ), name = '" + data.real_name + "', title = '" + data.title + "', education = '" + data.edu + "', qualification = '" + data.quali + "', doctor_categories_id = (SELECT categories_id FROM h1_health_doctor_categories_description WHERE categories_name = '" + data.category + "'), city_id = " + data.city_id + ", major = '" + data.major + "', achievement = '" + data.achiev + "' WHERE id = '" + data.doctorId + "';");
            pool.query(sql1, (err)=>{
                if(err)
                    reject(err, "\n   at FUNC: updateDoctor - sql1" + " (" + __filename + ")");
                const sql2 = "UPDATE h1_quiz_categories_description SET language_id = (SELECT id FROM h1_languages WHERE languages_name = '" + data.language + "') WHERE categories_id = " + data.quizCategoryId + ";";
                pool.query(sql2, (err)=>{
                    if(err)
                        reject(err, "\n   at FUNC: updateDoctor - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                if(data.image !== ''){
                    const sql3 = "UPDATE h1_quiz_categories SET categories_image = '" + data.image + "', last_modified = CURRENT_TIMESTAMP  WHERE categories_id = " + data.quizCategoryId + ";";
                    pool.query(sql3, (err)=>{
                        if(err)
                            reject(err, "\n   at FUNC: updateDoctor - sql3" + " (" + __filename + ")");
                        resolve("Success!");
                    });
                }
                resolve("Success!");
            });
        }),

        //////////////////// Doctors' Categories
        getAllDoctorCategories: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT d.categories_id AS 'id', d.categories_name AS 'name', c.categories_image AS 'image', l.languages_name AS 'language' FROM h1_health_doctor_categories_description d JOIN h1_health_doctor_categories c ON (d.categories_id = c.categories_id) JOIN h1_languages l ON (l.id = d.language_id) WHERE c.active = 1;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllDoctorCategories" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        deleteDoctorCategories:(data)=>new Promise((resolve,reject)=>{
            data.checkedIds.forEach(one=>{
                const sql = "UPDATE h1_health_doctor_categories SET active = '0' WHERE categories_id = '" + one + "';";
                pool.query(sql, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: deleteDoctorCategories" + " (" + __filename + ")");
                    resolve("Success!");
                });
            });
        }),

        insertDoctorCategory: (body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1="INSERT INTO h1_health_doctor_categories (categories_image) VALUES ('" + data.image + "');";          
            pool.query(sql1, (err,result)=>{
                if (err)
                    reject(err, "\n   at FUNC: insertDoctorCategory - sql1" + " (" + __filename + ")");
                const sql2="INSERT INTO h1_health_doctor_categories_description (categories_id, categories_name, language_id) VALUES (" + result.insertId + ", '" + data.name + "'," + "(SELECT id FROM h1_languages WHERE languages_name = '" + data.language + "'));" ;
                pool.query(sql2, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: insertDoctorCategory - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                resolve("Success!");
            });
        }),

        updateDoctorCategory: (body)=>new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1="UPDATE h1_health_doctor_categories SET categories_image = '" + data.image + "', last_modified = CURRENT_TIMESTAMP WHERE categories_id =" + data.id + ";";
            pool.query(sql1, (err)=>{
                if (err)
                    reject(err, "\n   at FUNC: updateDoctorCategory - sql1" + " (" + __filename + ")");
                const sql2="UPDATE h1_health_doctor_categories_description SET language_id = (SELECT id FROM h1_languages WHERE languages_name = '" + data.language + "'), categories_name = '" + data.name + "' WHERE categories_id = '" + data.id + "';";
                pool.query(sql2, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: updateDoctorCategory - sql2" + " (" + __filename + ")");
                    resolve("Success!");
                });
                resolve("Success!");
            });
        }),

        // ******************************************************************************************************************
        // USERS ************************************************************************************************************
        //////////////////// Users
        getAllUsers: ()=> new Promise((resolve,reject) =>{
            const sql="SELECT u.id, u.username, u.portrait, u.email, u.mobile, u.total_points, u.total_coins, u.total_follows, u.total_fans, u.marriage_status_id, u.brief_description, u.birthday, u.constellation_id, u.create_time, u.last_login_time, u.usergroups_id, g.group_name FROM h1_users u JOIN h1_user_groups g ON(u.usergroups_id =g.id) WHERE u.active=1;";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: getAllUsers" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        deleteUser: (data)=> new Promise((resolve,reject)=>{
            data.checkedIds.forEach(one=>{
                const sql = "UPDATE h1_users SET active = '0' WHERE id ='" + one + "';";
                pool.query(sql, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: deleteUser" + " (" + __filename + ")");
                    resolve("Success!");
                });
            });
        }),

        insertUser: (body) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql = "INSERT INTO h1_users (username, user_login, portrait, encrypt_password, email, mobile, usergroups_id, marriage_status_id, brief_description, birthday, constellation_id )" +
                        "VALUES  ('" + data.username + "', '"+ data.username + "', '" + data.image + "', '" + data.password + "', '" + data.email + "', '" + data.mobile + "', " +   
                                "(SELECT id FROM h1_user_groups WHERE group_name = '" +  data.role + "' )," +
                                "(SELECT id FROM h1_user_marriage_status WHERE status_text = '" +  data.marital + "' ), '" + data.desc + "', '" + data.birthday + "', " + data.constellation + ");";
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: insertUser" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        updateUser: (body) => new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql = data.password !== ''?
                ("UPDATE h1_users " + 
                "SET    username = '" +  data.username + "'," +
                        "portrait = '" +  data.image + "'," +
                        "encrypt_password =  '" +  data.password + "'," +
                        "email = '" +  data.email + "'," +
                        "mobile =  '" +  data.mobile + "'," +
                        "usergroups_id = (SELECT id FROM h1_user_groups WHERE group_name = '" +  data.role + "')," +
                        "marriage_status_id =  (SELECT id FROM h1_user_marriage_status WHERE status_text = '" +  data.marital + "')," +
                        "brief_description = '" +  data.desc + "'," +
                        "birthday =  '" +  data.birthday + "'," +
                        "constellation_id =  " + data.constellation + 
                " WHERE id = '" + data.userId +"';"):
            ("UPDATE h1_users " + 
            "SET    username = '" +  data.username + "'," +
                    "portrait = '" +  data.image + "'," +
                    "email = '" +  data.email + "'," +
                    "mobile =  '" +  data.mobile + "'," +
                    "usergroups_id = (SELECT id FROM h1_user_groups WHERE group_name = '" +  data.role + "')," +
                    "marriage_status_id =  (SELECT id FROM h1_user_marriage_status WHERE status_text = '" +  data.marital + "')," +
                    "brief_description = '" +  data.desc + "'," +
                    "birthday =  '" +  data.birthday + "'," +
                    "constellation_id = " + data.constellation + 
            " WHERE id = '" + data.userId +"';");
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updateUser" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        //////////////////// Users - Marriage
        getUsersMarriageStatus: ()=> new Promise((resolve,reject) =>{
            const sql="SELECT id, languages_id, status_text FROM h1_user_marriage_status WHERE active=1;";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: getUsersMarriageStatus" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        //////////////////// Users - Role
        getUsersRoles: ()=> new Promise((resolve,reject) =>{
            const sql="SELECT id, group_name FROM h1_user_groups WHERE active=1;";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: getUsersRoles" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        deleteRole: (data)=> new Promise((resolve,reject)=>{
            data.checkedIds.forEach(one=>{
                const sql = "UPDATE h1_user_groups SET active = '0' WHERE id ='" + one + "';";
                pool.query(sql, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: deleteRole" + " (" + __filename + ")");
                    resolve("Success!");
                });
            });
            // Whether delete the permissions for this role in the table - h1_user_groups_permissions? I think so. Complete it later! 
        }),

        insertRole: (body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1= "INSERT INTO h1_user_groups (group_name) VALUES ('" + data.name + "');";
            pool.query(sql1, (err, result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: insertRole - sql1" + " (" + __filename + ")");
                data.checkedArr.forEach(one=>{
                    if(one.value){
                        const sql2 = "INSERT INTO h1_user_groups_permissions (user_group_id, permissions_id) VALUES (" + result.insertId + ", " + one.id + ");";
                        pool.query(sql2, (err)=>{
                            if (err) 
                                reject(err, "\n   at FUNC: insertRole - sql2" + " (" + __filename + ")");
                            resolve("Success!");
                        });
                    }
                });
                resolve("Success!");
            });
        }),

        updateRole: (body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql1= "UPDATE h1_user_groups SET group_name= '" + data.name + "' WHERE id= " + data.roleId + ";";
            pool.query(sql1, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updateRole - sql1" + " (" + __filename + ")");
                const sql2 = "SELECT id FROM h1_user_groups_permissions WHERE user_group_id = " + data.roleId + ";";
                pool.query(sql2, (err, result)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: updateRole - sql2" + " (" + __filename + ")");
                    result.forEach(one=> {
                        const sql3 = "UPDATE h1_user_groups_permissions SET active = 0 WHERE id =" + one.id + ";";
                        pool.query(sql3, (err)=>{
                            if (err) 
                                reject(err, "\n   at FUNC: updateRole - sql3" + " (" + __filename + ")");
                            resolve("Success!");
                        });
                    });

                    data.checkedArr.forEach(one=>{
                        if(one.value){
                            const sql4 = "INSERT INTO h1_user_groups_permissions (user_group_id, permissions_id) VALUES (" + data.roleId + ", " + one.id + ");";
                            pool.query(sql4, (err)=>{
                                if (err) 
                                    reject(err, "\n   at FUNC: updateRole" + " (" + __filename + ")");
                                resolve("Success!");
                            });
                        }
                    });
                    resolve("Success!");
                });
                resolve("Success!");    
            });
        }),

        //////////////////// Users - Permission
        getAllPermissions: ()=> new Promise((resolve,reject) =>{
            const sql="SELECT id, permission_name, parent_id FROM h1_permissions WHERE active=1;";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: getAllPermissions" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        insertPermission2: (body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql="INSERT INTO h1_permissions (parent_id, permission_name) VALUES ( '" + data.firstLevel + "', '" + data.name + "');";          
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: insertPermission2" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        deletePermission2: (data)=> new Promise((resolve,reject)=>{
            data.checkedIds2.forEach(one=>{
                const sql = "UPDATE h1_permissions SET active = '0' WHERE id ='" + one + "';";
                pool.query(sql, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: deletePermission2" + " (" + __filename + ")");
                    resolve("Success!");
                });
            });
        }),

        updatePermission2: (body)=>new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql="UPDATE h1_permissions SET parent_id = " + data.firstLevel + ", permission_name = '"+ data.name + "' " + "WHERE id =" + data.permission2Id + ";";
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updatePermission2" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        deletePermission1: (data)=> new Promise((resolve,reject)=>{
            data.checkedIds1.forEach(one=>{
                const sql = "UPDATE h1_permissions SET active = '0' WHERE id ='" + one + "';";
                pool.query(sql, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: deletePermission1" + " (" + __filename + ")");
                    resolve("Success!");
                });
            });
        }),

        insertPermission1: (body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql="INSERT INTO h1_permissions (parent_id, permission_name) VALUES ( " + 0 + ", '" + data.name + "');";          
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: insertPermission1" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        updatePermission1: (body)=>new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql="UPDATE h1_permissions SET permission_name = '"+ data.name + "' " + "WHERE id =" + data.permission1Id + ";";
            pool.query(sql, (err)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updatePermission1" + " (" + __filename + ")");
                resolve("Success!");
            });
        }),

        getUsersRolesPermissions: ()=> new Promise((resolve,reject) =>{
            const sql="SELECT id, user_group_id, permissions_id FROM h1_user_groups_permissions WHERE active=1;";
            pool.query(sql, (err, result) => {
                if (err) 
                    reject(err, "\n   at FUNC: getUsersRolesPermissions" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        // ********************************************************************************************************************
        // LOCATION *************************************************************************************************************
        ///////////////////// Country        
        getEnableCountries: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT countries_id AS id, countries_name AS value, countries_name AS label FROM h1_countries WHERE enabled = 1;";
            pool.query(sql, (err, result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getEnableCountries" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        getAllCountries: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT countries_id AS id, countries_name AS name, countries_iso_code_2 AS ISO_2, countries_iso_code_3 AS ISO_3, enabled FROM h1_countries;";
            pool.query(sql, (err, result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllCountries" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        updateCountriesDisnabled: (data)=> new Promise((resolve,reject)=>{
            JSON.parse(data.checkedIds).forEach(one=>{
                const sql1="SELECT enabled FROM h1_countries WHERE countries_id=" + one + ";";
                pool.query(sql1, (err, result)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: updateCountriesDisnabled - sql1" + " (" + __filename + ")");
                    const enabled = JSON.parse(JSON.stringify(result))[0].enabled;
                    if(enabled === 0){
                        const sql2="UPDATE h1_countries SET enabled=1 WHERE countries_id=" + one + ";";
                        pool.query(sql2, (err)=>{
                            if (err) 
                                reject(err, "\n   at FUNC: updateCountriesDisnabled - sql2" + " (" + __filename + ")");
                            resolve("Success!");
                        });
                    }
                    else{
                        const sql3="UPDATE h1_countries SET enabled=0 WHERE countries_id=" + one + ";";
                        pool.query(sql3, (err)=>{
                            if (err) 
                                reject(err, "\n   at FUNC: updateCountriesDisnabled - sql3" + " (" + __filename + ")");
                            resolve("Success!");
                        }); 
                    }
                    resolve('Success!');
                });
            })
        }),

        ///////////////////// Province  
        getAllProvinces: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT zone_id AS id, zone_country_id AS pid, zone_name AS value, zone_code, zone_name AS label FROM h1_zones WHERE active=1;";
            pool.query(sql, (err, result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllProvinces" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        getProvinceById: (id)=> new Promise((resolve,reject)=>{
            const sql="SELECT zone_id AS id, zone_country_id AS pid, zone_name AS value, zone_code FROM h1_zones WHERE zone_id=" + id + " AND active=1;";
            pool.query(sql, (err, result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllProvinces" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        deleteProvinces: (data)=> new Promise((resolve,reject)=>{
            JSON.parse(data.checkedIds).forEach(one=>{
                const sql="UPDATE h1_zones SET active = 0 WHERE zone_id=" + one + ";";
                pool.query(sql, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: deleteProvinces" + " (" + __filename + ")");
                    resolve("Success!");
                });
            })
        }),

        addProvince: (body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql="INSERT INTO h1_zones (zone_country_id, zone_code, zone_name) VALUES (" + data.country_id + ", '" + data.post_code + "', '" + data.name + "');";
            pool.query(sql, (err, result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: addProvince" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        updateProvinceById: (id, body)=> new Promise((resolve,reject)=>{            
            const data = func.handleSpecialChar(body);
            const sql="UPDATE h1_zones SET zone_country_id = " + data.country_id + ", zone_code= '" + data.post_code + "', zone_name = '" + data.name + "' WHERE zone_id= " + id + ";";
            pool.query(sql, (err, result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updateProvinceById" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        ///////////////////// City  
        getAllCities: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT id, province_id AS pid, name AS value, name AS label, code FROM h1_city WHERE active=1;";
            pool.query(sql, (err, result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllCities" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        getCityById: (id)=> new Promise((resolve,reject)=>{
            const sql="SELECT province_id AS pid, name AS value, name AS label, code FROM h1_city WHERE id = " + id + " AND active=1;";
            pool.query(sql, (err, result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getCityById" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        deleteCities: (data)=> new Promise((resolve,reject)=>{
            JSON.parse(data.checkedIds).forEach(one=>{
                const sql="UPDATE h1_city SET active = 0 WHERE id=" + one + ";";
                pool.query(sql, (err)=>{
                    if (err) 
                        reject(err, "\n   at FUNC: deleteCities" + " (" + __filename + ")");
                    resolve('Success!');
                });
            })
        }),

        addCity: (body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql="INSERT INTO h1_city (name, code, province_id) VALUES ('" + data.name + "', '" + data.post_code + "', " + data.province_id + ");";
            pool.query(sql, (err, result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: addCity" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        updateCityById: (id, body)=> new Promise((resolve,reject)=>{
            const data = func.handleSpecialChar(body);
            const sql="UPDATE h1_city SET province_id = " + data.province_id + ", code= '" + data.post_code + "', name = '" + data.name + "' WHERE id= " + id + ";";
            pool.query(sql, (err, result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: updateCityById" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        // ********************************************************************************************************************
        // CURRENCIES *********************************************************************************************************
        //////////////////// Currencies
        getAllCurrencies: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT currencies_id, title AS 'name', code FROM h1_currencies;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllCurrencies" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        // ********************************************************************************************************************
        // LANGUAGES **********************************************************************************************************
        //////////////////// Languages
        getAllLanguages: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT id, languages_name AS 'name' FROM h1_languages;";
            pool.query(sql, (err,result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllLanguages" + " (" + __filename + ")");
                resolve(result);
            });
        }),

        // ********************************************************************************************************************
        // DICTIONARY *********************************************************************************************************
        ///////////////////// Dictionary
        getAllDictionaryItems: ()=> new Promise((resolve,reject)=>{
            const sql="SELECT id, languages_id, dict_key, dict_value FROM h1_dictionary ORDER BY id;";
            pool.query(sql, (err, result)=>{
                if (err) 
                    reject(err, "\n   at FUNC: getAllDictionaryItems" + " (" + __filename + ")");
                resolve(result);
            });
        }),
    }
}