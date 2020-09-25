/* 1. Add a column for an deleted record. The default value is "1". If the record was deleted, the value was reset to "0":*/
ALTER TABLE `happiify_db`.`h1_posts` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT 1 AFTER `modify_time`;


/* 2. Assiagn columns-like-count/dislike-count/comment-count to a default value "0":*/
ALTER TABLE `happiify_db`.`h1_posts` 
CHANGE COLUMN `like_count` `like_count` INT(11) NOT NULL DEFAULT '0' ,
CHANGE COLUMN `dislike_count` `dislike_count` INT(11) NOT NULL DEFAULT '0' ,
CHANGE COLUMN `comment_count` `comment_count` INT(11) NOT NULL DEFAULT '0' ;

/* 3. Set the field-portrait in hi_users to default NULL*/
ALTER TABLE `happiify_db`.`h1_users` 
CHANGE COLUMN `portrait` `portrait` VARCHAR(200) NULL DEFAULT NULL ;


/* 4. Set the field-rcUserId in hi_users to default NULL*/
ALTER TABLE `happiify_db`.`h1_users` 
CHANGE COLUMN `rcUserId` `rcUserId` VARCHAR(200) NULL DEFAULT NULL ;

/* 5. Add a column to mark delete or not, delete is 0, default value is '1':*/
ALTER TABLE `happiify_db`.`h1_post_comments` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `create_time`;


/* 6. 2018-10-09 Change fields-date_added/last_modified with "CURRENT_TIMESTAMP"*/
ALTER TABLE `happiify_db`.`h1_post_categories` 
CHANGE COLUMN `date_added` `date_added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
CHANGE COLUMN `last_modified` `last_modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ;


/* 7. 2018-10-10 Add a column for an deleted record in h1_post_categories. The default value is "1". If the record was deleted, the value was reset to "0":*/
ALTER TABLE `happiify_db`.`h1_post_categories` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `last_modified`;


/* 8. 2018-10-11 Modify table-h1_videos*/
ALTER TABLE `happiify_db`.`h1_videos` 
ADD COLUMN `modify_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `create_time`,
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `dislike_count`;


/* 9. 2018-10-11 Modify table-h1_video_category*/
ALTER TABLE `happiify_db`.`h1_video_category` 
ADD COLUMN `parent_id` INT(11) NOT NULL DEFAULT '0' AFTER `sort_order`,
ADD COLUMN `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `parent_id`,
ADD COLUMN `modify_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `create_time`;
ALTER TABLE `happiify_db`.`h1_video_category` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `modify_time`;

/* 10. 2018-10-12 Modify table-h1_videos, add a field-"update_by"*/
ALTER TABLE `happiify_db`.`h1_videos` 
ADD COLUMN `update_by` INT(11) NULL AFTER `dislike_count`;


/* 11. 2018-10-12 Modify table-h1_posts, add a field-"update_by"*/
ALTER TABLE `happiify_db`.`h1_posts` 
ADD COLUMN `update_by` INT(11) NULL AFTER `modify_time`;


/* 12. 2018-10-15 Add a field-active into the table-h1_video_comments*/
ALTER TABLE `happiify_db`.`h1_video_comments` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `create_time`;


/* 13. 2018-10-15 Modify the fields in the table-h1_video_category*/
ALTER TABLE `happiify_db`.`h1_video_category` 
CHANGE COLUMN `languages_id` `languages_id` INT(11) NOT NULL DEFAULT '1' ,
CHANGE COLUMN `sort_order` `sort_order` SMALLINT(3) NULL DEFAULT NULL ;


/* 14. 2018-10-15 Add a field-active into the table-h1_video_category_mapping*/
ALTER TABLE `happiify_db`.`h1_video_category_mapping` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `video_id`;


/* 15. 2018-10-17 Add a field-active into the table-h1_events*/
ALTER TABLE `happiify_db`.`h1_events` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `city_id`;


/* 16. 2018-10-19 Modify the field-active in the table-h1_events_comments*/
ALTER TABLE `happiify_db`.`h1_events_comments` 
CHANGE COLUMN `active` `active` SMALLINT(1) NOT NULL DEFAULT '1' ;


/* 17. 2018-10-19 Modify the table-h1_events to add a field-update_by*/
ALTER TABLE `happiify_db`.`h1_events` 
ADD COLUMN `update_by` INT(11) NULL DEFAULT NULL AFTER `city_id`;


/* 18. 2018-10-19 Modify the table-h1_events_type to add a field-parent_id and modify the field-status to active*/
ALTER TABLE `happiify_db`.`h1_events_type` 
ADD COLUMN `parent_id` INT(11) NOT NULL DEFAULT '0' AFTER `active`,
CHANGE COLUMN `status` `active` SMALLINT(1) NOT NULL DEFAULT '1' ;


/* 19. 2018-10-19 Modify the table-h1_events_type to add create_time & modify_time fields and move the field parent_id above active field*/
ALTER TABLE `happiify_db`.`h1_events_type` 
ADD COLUMN `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `parent_id`,
ADD COLUMN `modify_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `create_time`,
CHANGE COLUMN `parent_id` `parent_id` INT(11) NOT NULL DEFAULT '0' AFTER `events_type_name`;


/* 20. 2018-10-19 Modify the table-h1_events_type to move the field create_time & modify_time above active field*/
ALTER TABLE `happiify_db`.`h1_events_type` 
CHANGE COLUMN `active` `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `modify_time`;


/* 21. 2018-10-19 Modify the table-h1_events_comments on PK, AI(id)...*/
ALTER TABLE `happiify_db`.`h1_events_comments` 
CHANGE COLUMN `create_time` `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `comments`,
CHANGE COLUMN `id` `id` BIGINT(64) NOT NULL AUTO_INCREMENT ,
ADD PRIMARY KEY (`id`);

/*???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????*/
/* 22. 2018-10-22 Modify the table-h1_lessons, add a field-categories_id, and change the field name-status into active*/
ALTER TABLE `happiify_db`.`h1_lessons` 
ADD COLUMN `categories_id` INT(11) NOT NULL AFTER `user_id`,
CHANGE COLUMN `status` `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `modify_time`; /*The last line Was not used, WHY??????????????*/
/*???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????*/

/* 23. 2018-10-22 Add a field-active into the table-h1_lesson_categories; Modify the field-date_added & last_modified with CURRENT_TIMESTAMP*/
ALTER TABLE `happiify_db`.`h1_lesson_categories` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `last_modified`;

ALTER TABLE `happiify_db`.`h1_lesson_categories` 
CHANGE COLUMN `date_added` `date_added` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ,
CHANGE COLUMN `last_modified` `last_modified` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ;

ALTER TABLE `happiify_db`.`h1_lesson_categories` 
CHANGE COLUMN `categories_id` `categories_id` INT(11) NOT NULL AUTO_INCREMENT ,
CHANGE COLUMN `date_added` `date_added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
CHANGE COLUMN `last_modified` `last_modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
ADD PRIMARY KEY (`categories_id`);
;

/* 23. 2018-10-22 Modify the table-h1_lesson_categories_description*/
ALTER TABLE `happiify_db`.`h1_lesson_categories_description` 
ADD PRIMARY KEY (`categories_id`, `language_id`);
;


/* 24. 2018-10-22 Modify the table-h1_lessons, set the fields-rating & rating_tatle with defaule '0'*/
ALTER TABLE `happiify_db`.`h1_lessons` 
CHANGE COLUMN `rating` `rating` TINYINT(3) NOT NULL DEFAULT '0' ,
CHANGE COLUMN `rating_total` `rating_total` INT(11) NOT NULL DEFAULT '0' ;


/* 25. 2018-10-23 Add a field-update_by into the table-h1_lessons*/
ALTER TABLE `happiify_db`.`h1_lessons` 
ADD COLUMN `update_by` INT(11) NULL DEFAULT NULL AFTER `modify_time`;

/*???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????*/
/* 26. 2018-10-24 Add a field-active into the table-h1_lesson_comments*/
ALTER TABLE `happiify_db`.`h1_lesson_comments` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `create_time`; /**************The last line statement was not executed! WHY?????????*/
/*???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????*/

/* 27. 2018-10-29 Modify the table-h1_quizs */
ALTER TABLE `happiify_db`.`h1_quizs` 
ADD COLUMN `modify_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `create_time`,
ADD COLUMN `update_by` INT(11) NULL DEFAULT NULL AFTER `modify_time`,
CHANGE COLUMN `create_time` `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `total_answers`,
CHANGE COLUMN `status` `active` SMALLINT(1) NOT NULL DEFAULT '1' ;


/* 28. 2018-10-29 Modify the table-h1_quizs */
ALTER TABLE `happiify_db`.`h1_quizs` 
CHANGE COLUMN `active` `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `update_by`,
CHANGE COLUMN `payable` `payable` DOUBLE(18,4) NOT NULL DEFAULT 0 ;


/* 29. 2018-10-30 Modify the table-h1_quizs_tags  */
ALTER TABLE `happiify_db`.`h1_quiz_tags` 
ADD COLUMN `active` SMALLINT(1) NULL DEFAULT '1' AFTER `tags_count`,
CHANGE COLUMN `tags_count` `tags_count` INT(11) NULL DEFAULT NULL ;


/* 30. 2018-10-31 Modify the table-h1_quiz_tags_mapping, add a field-active */
ALTER TABLE `happiify_db`.`h1_quiz_tags_mapping` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `tags_id`;


/* 31. 2018-10-31 Modify the table-h1_quiz_answers */
ALTER TABLE `happiify_db`.`h1_quiz_answers` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `create_time`;


/* 32. 2018-11-01 */
ALTER TABLE `happiify_db`.`h1_quiz_media_mapping` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `create_time`;


/* 33. 2018-11-02 **********************Set fields-title/sub_title/media_info to default ' ' , that is to say the three fields cannot be field in the front-end form.???????????????????????????????*/
ALTER TABLE `happiify_db`.`h1_lesson_lists` 
CHANGE COLUMN `title` `title` VARCHAR(200) NOT NULL DEFAULT ' ' ,
CHANGE COLUMN `sub_title` `sub_title` VARCHAR(200) NOT NULL DEFAULT ' ' ,
CHANGE COLUMN `media_info` `media_info` VARCHAR(20) NOT NULL DEFAULT ' ' ,
CHANGE COLUMN `status` `active` SMALLINT(1) NOT NULL DEFAULT '1' ;

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/* 34. 2018-11-06 */
ALTER TABLE `happiify_db`.`h1_shop_products_description` 
CHANGE COLUMN `products_id` `products_id` INT(11) NOT NULL ;


/* 35. 2018-11-06 Add "active" field into the table-h1_shop_categories */
ALTER TABLE `happiify_db`.`h1_shop_categories` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `last_modified`;


/* 36. 2018-11-07 */
ALTER TABLE `happiify_db`.`h1_shop_products_options` 
CHANGE COLUMN `products_options_id` `products_options_id` INT(11) NOT NULL AUTO_INCREMENT ;


/* 37. 2018-11-07 */
ALTER TABLE `happiify_db`.`h1_shop_products_options_values` 
CHANGE COLUMN `products_options_values_id` `products_options_values_id` INT(11) NOT NULL AUTO_INCREMENT ;


/* 38. 2018-11-07 */
ALTER TABLE `happiify_db`.`h1_shop_products_options_values` 
DROP PRIMARY KEY,
ADD PRIMARY KEY (`products_options_values_id`);
;

/* 39. 2018-11-08  Add the field-"active" into the table-h1_shop_products_options_values_to_products_options*/
ALTER TABLE `happiify_db`.`h1_shop_products_options_values_to_products_options` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `products_options_values_id`;

/*******Fix the parts which were updated in previous DDL***************************************************************************/
/* 40. 2018-11-09 h1_lessons */
ALTER TABLE `happiify_db`.`h1_lessons` 
ADD COLUMN `categories_id` INT(11) NOT NULL AFTER `user_id`,
CHANGE COLUMN `status` `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `modify_time`;

/* 41. 2018-11-09 h1_lesson_comments*/
ALTER TABLE `happiify-cloud`.`h1_lesson_comments` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `create_time`;

/* Repeat 35, because of not correct comment*/
ALTER TABLE `happiify_db`.`h1_shop_categories` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `last_modified`;

/*********************************************************************************************************************************/

/* 42. 2018-11-12 Add a field-active into the table-h1_products_options*/
ALTER TABLE `happiify_db`.`h1_shop_products_options` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `products_options_name`;


/* 43. 2018-11-15 Add a field-active into the table-h1_shop_products_options_values*/
ALTER TABLE `happiify_db`.`h1_shop_products_options_values` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `products_options_values_name`;


/* 44. 2018-11-15 Drop a field-active in the table-h1_shop_products_options_values_to_products_options --------------------------------------------------------Corresponding to item 39.*/
ALTER TABLE `happiify_db`.`h1_shop_products_options_values_to_products_options` 
DROP COLUMN `active`;


/****Fix DataBase in the cloud****************************************************************************************************/
/* 45. 2018-11-17 fix the table-h1_lessons*/
ALTER TABLE `h1_lessons` 
ADD COLUMN `update_by` INT(11) NULL DEFAULT NULL AFTER `modify_time`,
CHANGE COLUMN `rating` `rating` TINYINT(3) NOT NULL DEFAULT '0' ,
CHANGE COLUMN `rating_total` `rating_total` INT(11) NOT NULL DEFAULT '0' ;


/*********************************************************************************************************************************/

/* 46. 2018-11-17 According to the requirement from OLIVER, change the time-length*/
ALTER TABLE `happiify_db`.`h1_videos` 
CHANGE COLUMN `time_length` `time_length` VARCHAR(20) NULL DEFAULT NULL ;

/* 47. 2018-11-26 */
ALTER TABLE `h1_health_doctors` 
CHANGE COLUMN `create_time` `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `city_id`,
CHANGE COLUMN `descriptions` `descriptions` TEXT NULL DEFAULT NULL ,
CHANGE COLUMN `active` `active` SMALLINT(1) NOT NULL DEFAULT '1' ;

/* 48. 2018-11-26 
ALTER TABLE `h1_health_doctors` 
CHANGE COLUMN `quiz_categories_id` `quiz_categories_id` INT(11) NULL DEFAULT NULL ;*/

/* 49. 2018-11-30*/
ALTER TABLE `h1_quiz_answers_media_mapping` 
CHANGE COLUMN `media_url` `media_url` VARCHAR(200) NULL DEFAULT NULL ,
CHANGE COLUMN `media_type` `media_type` VARCHAR(20) NULL DEFAULT NULL ;

/* 50.2018-11-30*/
ALTER TABLE `happiify_db`.`h1_quiz_answers_media_mapping` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `create_time`;

/* 51. 2018-12-04*/
ALTER TABLE `h1_users` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `last_login_time`;


/* 52. 2018-12-05*/
INSERT INTO h1_dictionary (dict_key, dict_value) 
	VALUES 	('Constellation', 'Aquarius'),
		('Constellation', 'Pisces'),        
		('Constellation', 'Aries'),        
		('Constellation', 'Taurus'),        
		('Constellation', 'Gemini'),        
		('Constellation', 'Cancer'),        
		('Constellation', 'Leo'),        
		('Constellation', 'Virgo'),        
		('Constellation', 'Libra'),        
		('Constellation', 'Scorpio'),        
		('Constellation', 'Sagittarius'),        
		('Constellation', 'Capricorn');

/* 53. 2018-12-05*/
ALTER TABLE `h1_users` 
CHANGE COLUMN `email` `email` VARCHAR(100) NOT NULL ,
CHANGE COLUMN `mobile` `mobile` VARCHAR(200) NOT NULL ;

/* 54. 2018-12-05*/
ALTER TABLE `h1_users` 
CHANGE COLUMN `constellation_id` `constellation_id` SMALLINT(3) NULL DEFAULT NULL ;

/* 55. 2018-12-06*/
ALTER TABLE `h1_user_groups` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `group_name`;


/* 56. 2018-12-09*/
ALTER TABLE `h1_user_groups_permissions` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `permissions_id`;


/* 57. 2018-12-12*/
INSERT INTO h1_permissions (parent_id, permission_name)

VALUES 	(0, 'Dashboard'),
	(0, 'Doc Management'),  				/* id = 2*/
	(2, 'Doc List'),
	(2, 'Doc Add'),
	(2, 'Doc Update'),
	(2, 'Doc Delete'),
	(2, 'Doc Comment'),
	(2, 'Doc Category'),

	(0, 'Video Management'),				/* id = 9*/
	(9, 'Video List'),
	(9, 'Video Add'),
	(9, 'Video Update'),
	(9, 'Video Delete'),
	(9, 'Video Comment'),
	(9, 'Video Category'),
        
	(0, 'Event Management'),				/* id = 16*/
	(16, 'Event List'),
	(16, 'Event Add'),
	(16, 'Event Update'),
	(16, 'Event Delete'),
	(16, 'Event Comment'),
	(16, 'Event Category'),
		
	(0, 'Lesson Management'),				/* id = 23*/
	(23, 'Lesson List'),
	(23, 'Lesson Add'),
	(23, 'Lesson Update'),
	(23, 'Lesson Delete'),
	(23, 'Lesson Comment'),
	(23, 'Lesson Category'),
        
	(0, 'Question Mangement'),				/* id = 30*/
	(30, 'Question List'),
	(30, 'Edit Answers'),
	(30, 'Question Add'),
	(30, 'Question Update'),
	(30, 'Question Delete'),
	(30, 'Question Category'),
		
	(0, 'Health Management'),				/* id = 37*/
	(37, 'Doctor List'),
	(37, 'Doctor Add'),
	(37, 'Doctor Update'),
	(37, 'Doctor Delete'),
	(37, 'Doctor Category'),
        
	(0, 'User Management'),					/* id = 43*/
	(43, 'User List'),
	(43, 'User Add'),
	(43, 'User Update'),
	(43, 'User Delete'),
	(43, 'User View'),
	(43, 'User groups'),
	(43, 'User Permissions'),
	(43, 'User Log'),
		
	(0, 'Product Management'),				/* id = 52*/
	(52, 'Product List'),
	(52, 'Product Add'),
	(52, 'Product Update'),
	(52, 'Product Delete'),
	(52, 'Product Category'),
	(52, 'Product Attribute'),
	(52, 'Product Attribute Group');

/* 58. 2018-12-12*/
INSERT INTO `h1_user_groups` VALUES (1,'Admin',1),(2,'User',1),(3,'Editor',1),(4,'Tester',1);

/* 59. 2018-12-12*/
INSERT INTO `h1_user_groups_permissions` VALUES (1,4,1,1),(2,4,2,1),(3,4,9,1),(4,4,16,1),(5,4,23,1),(6,4,30,1),(7,4,37,1),(8,4,52,1),(9,4,3,1),(10,4,4,1),(11,4,5,1),(12,4,6,1),(13,4,7,1),(14,4,8,1),(15,4,10,1),(16,4,11,1),(17,4,12,1),(18,4,13,1),(19,4,14,1),(20,4,15,1),(21,4,17,1),(22,4,18,1),(23,4,19,1),(24,4,20,1),(25,4,21,1),(26,4,22,1),(27,4,24,1),(28,4,25,1),(29,4,26,1),(30,4,27,1),(31,4,28,1),(32,4,29,1),(33,4,31,1),(34,4,32,1),(35,4,33,1),(36,4,34,1),(37,4,35,1),(38,4,36,1),(39,4,38,1),(40,4,39,1),(41,4,40,1),(42,4,41,1),(43,4,42,1),(44,4,53,1),(45,4,54,1),(46,4,55,1),(47,4,56,1),(48,4,57,1),(49,4,58,1),(50,4,59,1),(51,3,1,1),(52,3,2,1),(53,3,9,1),(54,3,16,1),(55,3,23,1),(56,3,30,1),(57,3,37,1),(58,3,52,1),(59,3,3,1),(60,3,4,1),(61,3,5,1),(62,3,6,1),(63,3,7,1),(64,3,8,1),(65,3,10,1),(66,3,11,1),(67,3,12,1),(68,3,13,1),(69,3,14,1),(70,3,15,1),(71,3,17,1),(72,3,18,1),(73,3,19,1),(74,3,20,1),(75,3,21,1),(76,3,22,1),(77,3,24,1),(78,3,25,1),(79,3,26,1),(80,3,27,1),(81,3,28,1),(82,3,29,1),(83,3,31,1),(84,3,32,1),(85,3,33,1),(86,3,34,1),(87,3,35,1),(88,3,36,1),(89,3,38,1),(90,3,39,1),(91,3,40,1),(92,3,41,1),(93,3,42,1),(94,3,53,1),(95,3,54,1),(96,3,55,1),(97,3,56,1),(98,3,57,1),(99,3,58,1),(100,3,59,1),(101,2,1,1),(102,2,2,1),(103,2,9,1),(104,2,16,1),(105,2,23,1),(106,2,30,1),(107,2,3,1),(108,2,4,1),(109,2,10,1),(110,2,11,1),(111,2,17,1),(112,2,18,1),(113,2,24,1),(114,2,25,1),(115,2,31,1),(116,2,33,1),(117,1,1,1),(118,1,2,1),(119,1,9,1),(120,1,16,1),(121,1,23,1),(122,1,30,1),(123,1,37,1),(124,1,43,1),(125,1,52,1),(126,1,3,1),(127,1,4,1),(128,1,5,1),(129,1,6,1),(130,1,7,1),(131,1,8,1),(132,1,10,1),(133,1,11,1),(134,1,12,1),(135,1,13,1),(136,1,14,1),(137,1,15,1),(138,1,17,1),(139,1,18,1),(140,1,19,1),(141,1,20,1),(142,1,21,1),(143,1,22,1),(144,1,24,1),(145,1,25,1),(146,1,26,1),(147,1,27,1),(148,1,28,1),(149,1,29,1),(150,1,31,1),(151,1,32,1),(152,1,33,1),(153,1,34,1),(154,1,35,1),(155,1,36,1),(156,1,38,1),(157,1,39,1),(158,1,40,1),(159,1,41,1),(160,1,42,1),(161,1,44,1),(162,1,45,1),(163,1,46,1),(164,1,47,1),(165,1,48,1),(166,1,49,1),(167,1,50,1),(168,1,51,1),(169,1,53,1),(170,1,54,1),(171,1,55,1),(172,1,56,1),(173,1,57,1),(174,1,58,1),(175,1,59,1);

/* 60. 2019-01-02*/
ALTER TABLE `h1_quiz_categories` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `last_modified`;

/* 61. 2019-01-03*/
ALTER TABLE `h1_health_doctors` 
CHANGE COLUMN `active` `active` TINYINT(3) NOT NULL DEFAULT '1' ;

/* 62. 2019-01-16*/
ALTER TABLE `h1_shop_tax_class` 
CHANGE COLUMN `tax_class_description` `tax_class_description` VARCHAR(255) NULL DEFAULT NULL ,
CHANGE COLUMN `last_modified` `last_modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
CHANGE COLUMN `date_added` `date_added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ;

/* 63. 2019-01-16*/
ALTER TABLE `h1_shop_products` 
CHANGE COLUMN `products_date_added` `products_date_added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
CHANGE COLUMN `products_last_modified` `products_last_modified` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ;
ALTER TABLE `h1_shop_products` 
CHANGE COLUMN `products_last_modified` `products_last_modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ;

/* 64. 2019-01-16*/
ALTER TABLE `h1_shop_brands` 
CHANGE COLUMN `brands_logo` `brands_logo` VARCHAR(200) NULL DEFAULT NULL ;

/* 65. 2019-01-16*/
ALTER TABLE `h1_shop_products` 
CHANGE COLUMN `products_tax_class_id` `products_tax_class_id` INT(11) NULL DEFAULT NULL ;

/* 66. 2019-01-18*/
ALTER TABLE `h1_shop_products_images` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `sort_order`;

/* 67. 2019-01-18*/
ALTER TABLE `h1_shop_products_attributes` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `price_prefix`;
ALTER TABLE `h1_shop_products_to_categories` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `categories_id`;

/* 68. 2019-01-22*/
ALTER TABLE `h1_zones` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `zone_name`;

/* 69. 2019-01-23*/
ALTER TABLE `h1_city` 
ADD COLUMN `active` SMALLINT(1) NOT NULL DEFAULT '1' AFTER `province_id`;

/* 70. 2019-01-25*/
INSERT INTO h1_permissions (parent_id, permission_name) 
VALUES 	(0, 'Location Mnangement'),					/* id = 60*/
		(60, 'Country List'),				
		(60, 'Country Update'),
		(60, 'Province List'),
		(60, 'Province Add'),
		(60, 'Province Update'),
		(60, 'Province Delete'),
		(60, 'City List'),
		(60, 'City Add'),
		(60, 'City Update'),
		(60, 'City Delete');

/* 71. 2019-01-28*/
ALTER TABLE `h1_health_doctors` 
DROP COLUMN `descriptions`,
ADD COLUMN `image` VARCHAR(200) NULL DEFAULT '' AFTER `name`,
ADD COLUMN `education` VARCHAR(200) NULL DEFAULT '' AFTER `title`,
ADD COLUMN `qualification` TEXT NULL AFTER `education`,
ADD COLUMN `major` TEXT NULL AFTER `quiz_categories_id`,
ADD COLUMN `achievement` TEXT NULL AFTER `major`,
CHANGE COLUMN `city_id` `city_id` INT(11) NOT NULL AFTER `image`,
CHANGE COLUMN `create_time` `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `achievement`;

/* 72. 2019-01-29*/
ALTER TABLE `h1_shop_products` 
CHANGE COLUMN `products_model` `products_model` VARCHAR(100) NULL DEFAULT NULL ;

