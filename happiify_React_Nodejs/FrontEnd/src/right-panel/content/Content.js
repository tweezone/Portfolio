import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import Redirect from 'react-router-dom/Redirect';
//import PropTypes from 'prop-types';

//import Home from './home/Home';
import LogIn from './log-in/LogIn';

import DocManagement from './doc-management/DocManagement';
import AddDoc from './doc-management/AddDoc';
import UpdateDoc from './doc-management/UpdateDoc';
import DocComments from './doc-management/DocComments';
import DocCategories from './doc-management/DocCategories';

import VideoManagement from './video-management/VideoManagement';
import AddVideo from './video-management/AddVideo';
import UpdateVideo from './video-management/UpdateVideo';
import VideoComments from './video-management/VideoComments';
import VideoCategories from './video-management/VideoCategories';

import EventManagement from './event-management/EventManagement';
import AddEvent from './event-management/AddEvent';
import UpdateEvent from './event-management/UpdateEvent';
import EventComments from './event-management/EventComments';
import EventCategories from './event-management/EventCategories';

import LessonManagement from './lesson-management/LessonManagement';
import AddLesson from './lesson-management/AddLesson';
import UpdateLesson from './lesson-management/UpdateLesson';
import LessonComments from './lesson-management/LessonComments';
import LessonCategories from './lesson-management/LessonCategories';

import QuestionManagement from './question-management/QuestionManagement';
import AddQuestion from './question-management/AddQuestion';
import UpdateQuestion from './question-management/UpdateQuestion';
import QuestionCategories from './question-management/QuestionCategories';
import AnswersManagement from './question-management/AnswersManagement';
import AddAnswer from './question-management/AddAnswer';
import UpdateAnswer from './question-management/UpdateAnswer';
import AnswerImagesManagement from './question-management/AnswerImagesManagement';

import ProductManagement from './product-management/ProductManagement';
import ProductCategories from './product-management/ProductCategories';
import ProductAttributes from './product-management/ProductAttributes';
import AddAttribute from './product-management/AddAttribute';
import UpdateAttribute from './product-management/UpdateAttribute';
import ProductAttributeGroups from './product-management/ProductAttributeGroups';
import AddAttributeGroup from './product-management/AddAttributeGroup';
import UpdateAttributeGroup from './product-management/UpdateAttributeGroup';
import AddProduct from './product-management/AddProduct';
import UpdateProduct from './product-management/UpdateProduct';

import DoctorManagement from './health-management/DoctorManagement';
import AddDoctor from './health-management/AddDoctor';
import UpdateDoctor from './health-management/UpdateDoctor';
import DoctorCategories from './health-management/DoctorCategories';
import AddDoctorCategory from './health-management/AddDoctorCategory';
import UpdateDoctorCategory from './health-management/UpdateDoctorCategory';

import Countries from './location-management/Countries';
import Provinces from './location-management/Provinces';
import AddProvince from './location-management/AddProvince';
import UpdateProvince from './location-management/UpdateProvince';
import Cities from './location-management/Cities';
import AddCity from './location-management/AddCity';
import UpdateCity from './location-management/UpdateCity';

import UserManagement from './user-management/UserManagement';
import AddUser from './user-management/AddUser';
import UpdateUser from './user-management/UpdateUser'; 
import ViewUser from './user-management/ViewUser';
import RoleManagement from './user-management/RoleManagement';
import AddRole from './user-management/AddRole';
import UpdateRole from './user-management/UpdateRole';
import PermissionManagement from './user-management/PermissionManagement';
import AddPermission2 from './user-management/AddPermission2';
import UpdatePermission2 from './user-management/UpdatePermission2';
import AddPermission1 from './user-management/AddPermission1';
import UpdatePermission1 from './user-management/UpdatePermission1';

import NotFound from './NotFound';


class Content extends Component{

    handleLogInChange=(e)=>{
        this.props.logInChange(e);
    }

    handleLogInSubmit=(e)=>{
        this.props.logInSubmite(e);
    }

    handleClickUpdateDoc=(id)=>{
        sessionStorage.setItem('docId', id);
    }
    
    handleClickUpdateVideo=(id)=>{
        sessionStorage.setItem('videoId', id);
    }
    
    handleClickUpdateEvent=(id)=>{
        sessionStorage.setItem('eventId', id);
    }

    handleClickUpdateLesson=(id)=>{
        sessionStorage.setItem('lessonId', id);
    }

    handleClickUpdateQuestion=(id, total_answers)=>{
        sessionStorage.setItem('questionId', id);
        sessionStorage.setItem('total_answers', total_answers);
    }

    handleClickUpdateAnswerImages=(id)=>{
        sessionStorage.setItem('answerId', id);
    }

    handleClickUpdateProduct=(id)=>{
        sessionStorage.setItem('productId', id);
    }

    handleClickUpdateAttribute=(id)=>{
        sessionStorage.setItem('attributeId', id);
    }

    handleClickUpdateAttributeGroup=(id)=>{
        sessionStorage.setItem('attributeGroupId', id);
    }

    handleClickUpdateDoctor=(id)=>{
        sessionStorage.setItem('doctorId', id);
    }

    handleClickUpdateDoctorCategory=(id)=>{
        sessionStorage.setItem('doctorCategoryId', id);
    }

    handleClickUpdateProvince=(id)=>{
        sessionStorage.setItem('provinceId', id);
    }

    handleClickUpdateCity=(id)=>{
        sessionStorage.setItem('cityId', id);
    }

    handleClickUpdateUser=(id)=>{
        sessionStorage.setItem('userId', id);
    }

    handleClickUpdateRole=(id)=>{
        sessionStorage.setItem('roleId', id)
    }

    handleClickUpdatePermission2=(id)=>{
        sessionStorage.setItem('permission2Id', id)
    }

    handleClickUpdatePermission1=(id)=>{
        sessionStorage.setItem('permission1Id', id)
    }

    handleJump=(id)=>{
        sessionStorage.setItem('jumpToPermission1', id)
    }
     
    render(){
        const { permissions, logInName } = this.props;        
        return(
            <div className="content mt-3">
                {(sessionStorage.getItem("authorization") !== "true")?
                    (<Switch>
                        <Route path='/login' render={() => (
                            <LogIn
                                langState={this.props.langState}
                                logInChange={this.handleLogInChange}
                                logInSubmit={this.handleLogInSubmit}
                            />                  
                        )}/>
                        <Redirect  to='/login'/>
                    </Switch> ) 
                        : 
                    (<Switch>
                        {/*<Route exact path='/home' render={() => (
                            permissions[0][0].value?
                            <Home
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />                     
                        )}/>*/}
                        {/*// DOCUMENT MANAGEMENT ////////////////////////////////////////////////////////////////////////////////////////////////*/}
                       <Route exact path='/documents' render={() => (
                            permissions[1][0].value?
                            <DocManagement
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                                clickUpdate={this.handleClickUpdateDoc}
                                permissions={this.props.permissions}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/documents/add' render={() => (
                            permissions[1][2].value?
                            <AddDoc 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/documents/update' render={() => (
                            permissions[1][3].value?
                            <UpdateDoc 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                                docId={+sessionStorage.getItem("docId")}                                
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/documents/comments' render={() => (
                            permissions[1][5].value?
                            <DocComments
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/documents/categories' render={() => (
                            permissions[1][6].value?
                            <DocCategories
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>
                        {/*// VIDEO MANAGEMENT ////////////////////////////////////////////////////////////////////////////////////////////////////*/}
                        <Route exact path='/videos' render={() => (
                            permissions[2][0].value?
                            <VideoManagement
                                langState={this.props.langState}
                                clickUpdate={this.handleClickUpdateVideo}
                                permissions={this.props.permissions}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>
                        
                        <Route exact path='/videos/add' render={() => (
                            permissions[2][2].value?
                            <AddVideo 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/videos/update' render={() => (
                            permissions[2][3].value?
                            <UpdateVideo 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                                videoId={+sessionStorage.getItem("videoId")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/videos/comments' render={() => (
                            permissions[2][5].value?
                            <VideoComments
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/videos/categories' render={() => (
                            permissions[2][6].value?
                            <VideoCategories
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>
                        {/*// EVENT MANAGEMENT ////////////////////////////////////////////////////////////////////////////////////////////////////*/}
                        <Route exact path='/events' render={() => (
                            permissions[3][0].value?
                            <EventManagement
                                langState={this.props.langState}
                                clickUpdate={this.handleClickUpdateEvent}
                                permissions={this.props.permissions}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>
                        
                        <Route exact path='/events/add' render={() => (
                            permissions[3][2].value?
                            <AddEvent 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/events/update' render={() => (
                            permissions[3][3].value?
                            <UpdateEvent 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                                eventId={+sessionStorage.getItem("eventId")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>
                        <Route exact path='/events/comments' render={() => (
                            permissions[3][5].value?
                            <EventComments
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/events/categories' render={() => (
                            permissions[3][6].value?
                            <EventCategories
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>
                        {/*// LESSON MANAGEMENT ////////////////////////////////////////////////////////////////////////////////////////////////////*/}
                        <Route exact path='/lessons' render={() => (
                            permissions[4][0].value?
                            <LessonManagement
                                langState={this.props.langState}
                                clickUpdate={this.handleClickUpdateLesson}
                                permissions={this.props.permissions}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>
                        
                        <Route exact path='/lessons/add' render={() => (
                            permissions[4][2].value?
                            <AddLesson 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/lessons/update' render={() => (
                            permissions[4][3].value?
                            <UpdateLesson 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                                lessonId={+sessionStorage.getItem("lessonId")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>
                        <Route exact path='/lessons/comments' render={() => (
                            permissions[4][5].value?
                            <LessonComments
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/lessons/categories' render={() => (
                            permissions[4][6].value?
                            <LessonCategories
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>
                        {/*// QUESTION MANAGEMENT /////////////////////////////////////////////////////////////////////////////////////////////////*/}
                        <Route exact path='/questions' render={() => (
                            permissions[5][0].value?
                            <QuestionManagement
                                langState={this.props.langState}
                                clickUpdate={this.handleClickUpdateQuestion}
                                permissions={this.props.permissions}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>
                        
                        <Route exact path='/questions/add' render={() => (
                            permissions[5][3].value?
                            <AddQuestion 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/questions/update' render={() => (
                            permissions[5][4].value?
                            <UpdateQuestion 
                                langState={this.props.langState}
                                questionId={+sessionStorage.getItem("questionId")}
                                logInName={this.props.logInName}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/questions/categories' render={() => (
                            permissions[5][6].value?
                            <QuestionCategories
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/questions/answers' render={() => (
                            permissions[5][2].value?
                            <AnswersManagement
                                langState={this.props.langState}
                                questionId={+sessionStorage.getItem("questionId")}
                                total_answers = {+sessionStorage.getItem("total_answers")}
                                clickUpdate={this.handleClickUpdateAnswerImages}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/questions/answers/add' render={() => (
                            permissions[5][2].value?
                            <AddAnswer
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                                questionId={+sessionStorage.getItem("questionId")}
                                total_answers = {+sessionStorage.getItem("total_answers")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/questions/answers/update' render={() => (
                            permissions[5][2].value?
                            <UpdateAnswer
                                langState={this.props.langState}
                                questionId={+sessionStorage.getItem("questionId")}
                                answerId={+sessionStorage.getItem("answerId")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/questions/answers/images' render={() => (
                            permissions[5][2].value?
                            <AnswerImagesManagement
                                langState={this.props.langState}
                                questionId={+sessionStorage.getItem("questionId")}
                                answerId={+sessionStorage.getItem("answerId")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        {/*// PRODUCT MANAGEMENT /////////////////////////////////////////////////////////////////////////////////////////////////*/}
                        <Route exact path='/products' render={() => (
                            permissions[8][0].value?
                            <ProductManagement
                                langState={this.props.langState}
                                clickUpdate={this.handleClickUpdateProduct}
                                permissions={this.props.permissions}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/products/add' render={() => (
                            permissions[8][2].value?
                            <AddProduct 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>
                        
                        <Route exact path='/products/update' render={() => (
                            permissions[8][3].value?
                            <UpdateProduct 
                                langState={this.props.langState}
                                productId={+sessionStorage.getItem("productId")}
                                logInName={this.props.logInName}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/products/categories' render={() => (
                            permissions[8][5].value?
                            <ProductCategories 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>
                        
                        <Route exact path='/products/attributes' render={() => (
                            permissions[8][6].value?
                            <ProductAttributes 
                                langState={this.props.langState}
                                clickUpdate={this.handleClickUpdateAttribute}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/products/attributes/add' render={() => (
                            permissions[8][6].value?
                            <AddAttribute 
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/products/attributes/update' render={() => (
                            permissions[8][6].value?
                            <UpdateAttribute 
                                langState={this.props.langState}
                                attributeId={+sessionStorage.getItem("attributeId")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/products/attribute_groups' render={() => (
                            permissions[8][7].value?
                            <ProductAttributeGroups 
                                langState={this.props.langState}
                                clickUpdate={this.handleClickUpdateAttributeGroup}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/products/attribute_groups/add' render={() => (
                            permissions[8][7].value?
                            <AddAttributeGroup
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/products/attribute_groups/update' render={() => (
                            permissions[8][7].value?
                            <UpdateAttributeGroup 
                                langState={this.props.langState}
                                attributeGroupId={+sessionStorage.getItem("attributeGroupId")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        {/*// HEALTH MANAGEMENT /////////////////////////////////////////////////////////////////////////////////////////////////*/}
                        <Route exact path='/health/doctors' render={() => (
                            permissions[6][0].value?
                            <DoctorManagement
                                langState={this.props.langState}
                                clickUpdate={this.handleClickUpdateDoctor}
                                permissions={this.props.permissions}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/health/doctors/add' render={() => (
                            permissions[6][2].value?
                            <AddDoctor 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/health/doctors/update' render={() => (
                            permissions[6][3].value?
                            <UpdateDoctor 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                                doctorId={+sessionStorage.getItem("doctorId")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/health/doctors/categories' render={() => (
                            permissions[6][5].value?
                            <DoctorCategories 
                                langState={this.props.langState}
                                clickUpdate={this.handleClickUpdateDoctorCategory}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/health/doctors/categories/add' render={() => (
                            permissions[6][5].value?
                            <AddDoctorCategory 
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/health/doctors/categories/update' render={() => (
                            permissions[6][5].value?
                            <UpdateDoctorCategory 
                                langState={this.props.langState}
                                doctorCategoryId={+sessionStorage.getItem("doctorCategoryId")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        {/*// LOCATION MANAGEMENT /////////////////////////////////////////////////////////////////////////////////////////////////////*/}
                        <Route exact path='/location/countries' render={() => (
                            permissions[9][1].value?
                            <Countries
                                langState={this.props.langState}
                                permissions={this.props.permissions}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/location/provinces' render={() => (
                            permissions[9][3].value?
                            <Provinces
                                langState={this.props.langState}
                                clickUpdate={this.handleClickUpdateProvince}
                                permissions={this.props.permissions}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/location/provinces/add' render={() => (
                            permissions[9][4].value?
                            <AddProvince 
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/location/provinces/update' render={() => (
                            permissions[9][5].value?
                            <UpdateProvince 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                                provinceId={+sessionStorage.getItem("provinceId")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/location/cities' render={() => (
                            permissions[9][7].value?
                            <Cities
                                langState={this.props.langState}
                                clickUpdate={this.handleClickUpdateCity}
                                permissions={this.props.permissions}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/location/cities/add' render={() => (
                            permissions[9][8].value?
                            <AddCity 
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/location/cities/update' render={() => (
                            permissions[9][9].value?
                            <UpdateCity 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                                cityId={+sessionStorage.getItem("cityId")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        {/*// USER MANAGEMENT /////////////////////////////////////////////////////////////////////////////////////////////////////*/}
                        <Route exact path='/users' render={() => (
                            permissions[7][0].value?
                            <UserManagement
                                langState={this.props.langState}
                                clickUpdate={this.handleClickUpdateUser}
                                permissions={this.props.permissions}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/users/add' render={() => (
                            permissions[7][2].value?
                            <AddUser 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/users/update' render={() => (
                            permissions[7][3].value?
                            <UpdateUser
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                                userId={+sessionStorage.getItem("userId")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                         <Route exact path='/users/view' render={() => (
                            permissions[7][5].value?
                            <ViewUser
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                                userId={+sessionStorage.getItem("userId")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/users/roles' render={() => (
                            permissions[7][6].value?
                            <RoleManagement 
                                langState={this.props.langState}
                                clickUpdate={this.handleClickUpdateRole}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/users/roles/add' render={() => (
                            permissions[7][6].value?
                            <AddRole
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/users/roles/update' render={() => (
                            permissions[7][6].value?
                            <UpdateRole 
                                langState={this.props.langState}
                                roleId={+sessionStorage.getItem("roleId")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/users/permissions' render={() => (
                            permissions[7][7].value?
                            <PermissionManagement 
                                langState={this.props.langState}
                                logInName={this.props.logInName}
                                clickUpdate2={this.handleClickUpdatePermission2}
                                clickUpdate1={this.handleClickUpdatePermission1}
                                jumpToPermission1 = {sessionStorage.getItem("jumpToPermission1")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/users/permissions/add2' render={() => (
                            permissions[7][7].value && logInName==='Steven'?
                            <AddPermission2
                                langState={this.props.langState}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/users/permissions/update2' render={() => (
                            permissions[7][7].value && logInName==='Steven'?
                            <UpdatePermission2 
                                langState={this.props.langState}
                                permission2Id={+sessionStorage.getItem("permission2Id")}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/users/permissions/add1' render={() => (
                            permissions[7][7].value && logInName==='Steven'?
                            <AddPermission1
                                langState={this.props.langState}
                                jump={this.handleJump}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>

                        <Route exact path='/users/permissions/update1' render={() => (
                            permissions[7][7].value && logInName==='Steven'?
                            <UpdatePermission1 
                                langState={this.props.langState}
                                permission1Id={+sessionStorage.getItem("permission1Id")}
                                jump={this.handleJump}
                            />:<NotFound 
                                    langState={this.props.langState}
                                />
                        )}/>
                        
                        
                        <Redirect from='/login'  to={
                            (()=>{
                                if(permissions[1][0].value) return '/documents';
                                else if(permissions[2][0].value) return '/videos';
                                else if(permissions[3][0].value) return '/events';
                                else if(permissions[4][0].value) return '/lessons';
                                else if(permissions[5][0].value) return '/questions';
                                else if(permissions[8][0].value) return '/products';
                                else if(permissions[6][0].value) return '/health/doctors';
                                else if(permissions[9][0].value) return '/location/countries';
                                else if(permissions[7][0].value) return '/users';
                                //else if(permissions[0][0].value) return '/home';
                                else return '/login';
                            })()
                        }/>
                        
                        {/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
                        <Route render={() => (
                            <NotFound 
                                langState={this.props.langState}
                            />
                        )}/>
                    </Switch>) 
                } 
            </div>
        );
    }
}              

export default Content;