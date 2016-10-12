import './onenotefront.html';
import { NotebooksDB, StudentsDB, SectionsGrpDB, SectionsDB, PagesDB, PagesContentDB } from '../api/mongoRelations.js';

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

Meteor.startup(() => {
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
    return NotebooksDB.find({});;
  },
  studentSet() {
    return StudentsDB.find({});
  },
  sectionGrpSet() {
    return SectionsGrpDB.find({});
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
    var code =   Session.get("accessToken");
    Meteor.call('getNoteBooks', code, function(){
    });
  },
});

Template.getNoteBooks.helpers({
});

Template.notebook_template.events({
  'click .e_notebook'(event, instance) {
    event.stopPropagation();
    var code =   Session.get("accessToken");
    Meteor.call('getNoteBookInformation', code, this._id);
  },
  'click .e_insertSectionGrps'(event, instance){
    event.stopPropagation();
    var code =   Session.get("accessToken");
    Meteor.call('createSectionGrp', code, this._id,'in-class assignment');
  },
  'click .e_sendPages'(event, instance){
    event.stopPropagation();
    var code =   Session.get("accessToken");
    const pageObject = new PageObject("Activity1");
    pageObject.addQuestion("1","What is the time?");
    pageObject.addQuestion("2","question 2?");
    Meteor.call('sendPageToStudents', code, this._id, pageObject);
  },
  'click .e_insertStudentSections'(event, instance){
    event.stopPropagation();
    var code =   Session.get("accessToken");
    Meteor.call('createSectionInStudents', code, this._id, 'in-class assignment');
  }
  ,
  'click .e_addStudent'(event, instance){
    event.stopPropagation();
    var code =   Session.get("accessToken");
    Meteor.call('addStudent', code, this._id, 'a0130720@u.nus.edu');
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
    Meteor.call('getSectionGroupSections', code, this._id);
  }
});

Template.sectionGrp_template.helpers({
  sectionSet : function (parentIdInput) {
    return SectionsDB.find({parentId : parentIdInput});
  }
});

Template.section_template.events({
  'click .e_section'(event, instance) {
    event.stopPropagation();
    var code =   Session.get("accessToken");
    Meteor.call('getNotebookSectionPages', code, this._id);
  }
});

Template.section_template.helpers({
  pageSet : function (parentIdInput) {
    return PagesDB.find({parentId : parentIdInput});
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
  var code = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlliUkFRUlljRV9tb3RXVkpLSHJ3TEJiZF85cyIsImtpZCI6IlliUkFRUlljRV9tb3RXVkpLSHJ3TEJiZF85cyJ9.eyJhdWQiOiJodHRwczovL29uZW5vdGUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzViYTVlZjVlLTMxMDktNGU3Ny04NWJkLWNmZWIwZDM0N2U4Mi8iLCJpYXQiOjE0NzYwMTA3OTEsIm5iZiI6MTQ3NjAxMDc5MSwiZXhwIjoxNDc2MDE0NjkxLCJhY3IiOiIxIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjJhMTljMjc2LTU1OTMtNDRiOS05NTA4LTk5YTY4YmIyYjcxZCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiQ2hhbiIsImdpdmVuX25hbWUiOiJZdWFuIFNoYW4iLCJpcGFkZHIiOiIxMzcuMTMyLjI1NC4yMjYiLCJuYW1lIjoiQ2hhbiBZdWFuIFNoYW4iLCJvaWQiOiJlNjBhMDU2Ny05ODc5LTQwNjMtOGU0Mi1iZGE2OGY0YTUwNmYiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtNzY5MzIzMjMyLTE1NTg3MDE4NzMtMTMxNzA1OTQ5NS04NzY1IiwicHVpZCI6IjEwMDNCRkZEOEIzMzk4RkMiLCJzY3AiOiJOb3Rlcy5DcmVhdGUgTm90ZXMuUmVhZCBOb3Rlcy5SZWFkLkFsbCBOb3Rlcy5SZWFkV3JpdGUgTm90ZXMuUmVhZFdyaXRlLkFsbCBOb3Rlcy5SZWFkV3JpdGUuQ3JlYXRlZEJ5QXBwIiwic3ViIjoiVXhjbTN4N2RrX3A3UlFndGJOMXQ5N3hjU0NRcnEtUlo3VmIybGNBRzFEayIsInRpZCI6IjViYTVlZjVlLTMxMDktNGU3Ny04NWJkLWNmZWIwZDM0N2U4MiIsInVuaXF1ZV9uYW1lIjoiYTAxMjU1MTRAdS5udXMuZWR1IiwidXBuIjoiYTAxMjU1MTRAdS5udXMuZWR1IiwidmVyIjoiMS4wIn0.C-nofc9h4qh3xPZlkVnqxfkfWXWp-j81d4soeO0m6pM3iTIutG0MpRPCBDHkkmtjJvMduYx9fUIDTxBH7MtG-V48O2-VYy0uVARPQrvhW6zuNRx2ZOZuEalqZXCqiRMpP9hP03kbVGKdQyIcOWqfrPf96OFl3HEGEbvjGfGHBG6_bCc0ZeDTjeopwO1cnOl0WGn5q0LZ6PepW4equJfVTz872lWtAbXT7oH8G-Ztx68Q9_i5iGuq-E6_XHuQrgaUUvHQnf3b1kH_OX-9RuIiGEf_xjs3XbYnUpvXb7hxK9qF6ENHpNa5dANaC9A2rmBdnUdisj8N7hyn00zecPR5nQ";
  Session.set("accessToken",code);
  /*
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
  */
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
