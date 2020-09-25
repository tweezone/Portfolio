/** 
 * @desc MySQL configuration file
 **/
const config={    
         host: "localhost",
         user: "root",
         password: "Wrh-197411",
         //database: "happiify_20190121",
         database: "happiify_20180129",
         //database: "happiify_db",
         charset: "utf8mb4"
     }

// When create a new lesson, create a chat group for the app by using the API below.
const config_chat_group='http://imapi.happiify.me/api_test.php?action=CreateLessonChatGroup';

module.exports={ config, config_chat_group }

