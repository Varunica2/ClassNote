import './onenotefront.html';
import { NotebooksDB, StudentsDB, SectionsGrpDB, SectionsDB, PagesDB, PagesContentDB } from '../api/mongoRelations.js';

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

Meteor.startup(() => {
  var userID = Session.get('userID');
  Session.set("cUser",userID);
});

Template.notebook_main.onCreated(function bodyOnCreated() {
  var fullUrl = window.location.href;
  var uid = guidGenerator();
  renderCode();
  Meteor.call('generateUID',uid,fullUrl, function(err, result){
    if(result['status'] == "success"){
      Session.set("tokenPack",result);
    }else{
      if(result["status"] == "invalid_grant"){
        alert("key invaild or expired");
      }
    }
  });
});

Template.notebook_main.helpers({
  notebookSet() {
    return NotebooksDB.find({owner : Session.set("cUser")});;
  },
  studentSet() {
    return StudentsDB.find({owner : Session.set("cUser")});
  },
  sectionGrpSet() {
    return SectionsGrpDB.find({owner : Session.set("cUser")});
  }
});

Template.createNoteBook.events({
  'click button'(event, instance) {
    var code =   Session.get("accessToken");
    var modcode = "TEST1";
    var modname = "Test Module";
    var nb_name = modcode + modname;
    var teacherID = Session.get("userID");
    var studentsList = ["a0117057j", "a0105903n"];
    Meteor.call('createNewNoteBook', code, nb_name, teacherID, studentsList, function(){
    });
  },
});

Template.getNoteBooks.events({
  'click button'(event, instance) {
    var cUser = Session.get("cUser");
    var code =   Session.get("accessToken");
    Meteor.call('getNoteBooks', code, cUser, function(err, result){
        console.log(result);
    });
  },
});

Template.getNoteBooks.helpers({
});

Template.notebook_template.events({
  'click .e_notebook'(event, instance) {
    event.stopPropagation();
    var code =   Session.get("accessToken");
    var cUser = Session.get("cUser");
    Meteor.call('getNoteBookInformation', code, this._id, cUser, function(err, result){
        console.log(result);
    });
  },
  'click .e_insertSectionGrps'(event, instance){
    event.stopPropagation();
    var code =   Session.get("accessToken");
    Meteor.call('createSectionGrp', code, this._id,'Temp section');
  },
  'click .e_sendPages'(event, instance){
    event.stopPropagation();
    var code =   Session.get("accessToken");
    const pageObject = new PageObject("Testing Activity 17");
    pageObject.addQuestion("1","What is the time?");
    pageObject.addQuestion("2","question 2?");
    pageObject.addQuestion("3","This is question 3?");
    Meteor.call('sendPageToStudents', code, this._id, pageObject, 'in-class assignment');
  },
  'click .e_insertStudentSections'(event, instance){
    event.stopPropagation();
    var code =   Session.get("accessToken");
    Meteor.call('createSectionInStudents', code, this._id, 'in-class assignment');
  },
  'click .e_addStudent'(event, instance){
    event.stopPropagation();
    var code =   Session.get("accessToken");
    var cUser = Session.get("cUser");
    Meteor.call('addStudent', code, this._id, 'a0125415@u.nus.edu', cUser);
  },
  'click .e_getStudentQuestions'(event, instance) {
    event.stopPropagation();
    var code =   Session.get("accessToken");
    var cUser = Session.get("cUser");
    Meteor.call('getStudentsQuestions', code, this._id, 'in-class assignment','Testing Activity 16', cUser, function(err, result){
      console.log(result);
    });
  },
  'click .e_insertNewSectionInCollabSpace'(event, instance) {
    event.stopPropagation();
    var code =   Session.get("accessToken");
    var activityName = "week4InClass";

    Meteor.call('addNewCollaborativeActivity', code, this._id, activityName, function(err, result){
      console.log(result);
    });
  }
});

Template.notebook_template.helpers({

});

Template.student_template.helpers({});

Template.student_template.events({
  'click .e_deleteStudet'(event, instance){
    event.stopPropagation();
    var code =   Session.get("accessToken");
    Meteor.call('deleteStudent', code, this._id);
  }
});


Template.sectionGrp_template.events({
  'click .e_sectionGrp'(event, instance) {
    event.stopPropagation();
    var code =   Session.get("accessToken");
    var cUser = Session.get("cUser");
    Meteor.call('getSectionGroupSections', code, this._id, cUser);
  }
});

Template.sectionGrp_template.helpers({
  sectionSet : function (parentIdInput) {
    return SectionsDB.find({sectionGrp_id : parentIdInput});
  }
});

Template.section_template.events({
  'click .e_section'(event, instance) {
    event.stopPropagation();
    var code =   Session.get("accessToken");
    var cUser = Session.get("cUser");
    Meteor.call('getNotebookSectionPages', code, this._id, cUser);
  },
  'click .e_initGroupActivity'(event, instance) {
    event.stopPropagation();
    var code =   Session.get("accessToken");
    var cUser = Session.get("cUser");
    Meteor.call('initGroupActivity', code, this._id, cUser, function(err, result){
      console.log(result);
    });
  },
  'click .e_pushQuestion'(event, instance) {
    event.stopPropagation();
    var code =   Session.get("accessToken");
    var questionObjet = new QuestionObject("1","What is next?");
    Meteor.call('pushQuestionToCollab', code, this._id, questionObjet, function(err, result){
      console.log(result);
    });
  }
});

Template.section_template.helpers({
  pageSet : function (parentIdInput) {
    return PagesDB.find({section_id : parentIdInput});
  }
});


Template.pages_template.events({
  'click p'(event, instance) {
      event.stopPropagation();
      var code =   Session.get("accessToken");
      Meteor.call('getPageContent', code, this._id);
  }
});

Template.pageContent_template.helpers({
  page : function(){
    return PagesContentDB.find({});
  }
});

Template.pageContent_template.events({
  'click button'(event, instance) {
    var code =   Session.get("accessToken");
    var content = [{
      'target': '#commentArea',
      'action': 'append',
      'content': '<p>A new paragraph at the bottom of the container #commentArea</p>'
    }];
    Meteor.call('patchPageContent', code, this._id, JSON.stringify(content));
  }
});



function renderCode(){

  //currently hardcoded for one-way authentication.
  // Required to be changed to automated retrieval of token in 2-way authentication
  var code = "";
  Session.set("accessToken",code);

  var fullUrl = window.location.href;
  var n = fullUrl.indexOf("#");
  var arr = fullUrl.substring(n).split("&");
  var code = arr[0].substring(arr[0].indexOf("=") + 1);

  if(n >0){
    n = n+1;
    var arr = fullUrl.substring(n).split("&");
    var code = //arr[0].substring(arr[0].indexOf("=") + 1);
    Session.set("accessToken",code);
    return true;
  }else{
    return false;
  }

}

function isTokenExpired(){
  if(Session.get("accessToken") == null){
      return true;
  }
  //add code to check
  return false;
}

function isTokenExpired_temp(){
  if(Session.get("tokenPack") == null){
      return true;
  }
  var d = new Date();
  var n = d.getTime();
  var timeLeft = (Session.get("tokenPack")["expire_on"]*1000) - n;
  if(timeLeft < 0){
    return true;
  }else{
    return false;
  }
}

function QuestionObject(questionIndex, questionText) {
    this.index = questionIndex;
    this.text = questionText;
}

class PageObject {
  constructor(pageName) {
    this.name = pageName;
    this.questions = [];
  }

  addQuestion(questionIndex, questionText) {
    this.questions.push(new QuestionObject(questionIndex,questionText));
  }

  getQuestions(){
     return this.questions;
  }
}
