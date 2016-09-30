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
    Meteor.call('createSectionGrp', code, this._id);
  },
  'click .e_sendPages'(event, instance){
    event.stopPropagation();
    var code =   Session.get("accessToken");
    Meteor.call('sendPageToStudents', code, this._id);
  }
});

Template.notebook_template.helpers({

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
  var code = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlliUkFRUlljRV9tb3RXVkpLSHJ3TEJiZF85cyIsImtpZCI6IlliUkFRUlljRV9tb3RXVkpLSHJ3TEJiZF85cyJ9.eyJhdWQiOiJodHRwczovL29uZW5vdGUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzViYTVlZjVlLTMxMDktNGU3Ny04NWJkLWNmZWIwZDM0N2U4Mi8iLCJpYXQiOjE0NzUyMTkzNzAsIm5iZiI6MTQ3NTIxOTM3MCwiZXhwIjoxNDc1MjIzMjcwLCJhY3IiOiIxIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjJhMTljMjc2LTU1OTMtNDRiOS05NTA4LTk5YTY4YmIyYjcxZCIsImFwcGlkYWNyIjoiMCIsImdpdmVuX25hbWUiOiJWYXJ1bmljYSIsImlwYWRkciI6IjEzNy4xMzIuMjI4LjM3IiwibmFtZSI6IlZhcnVuaWNhIiwib2lkIjoiYmUzZGI2M2ItMTVhOC00ZjI4LTk5YjAtNGNiYWYyMWNkMzc0Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTc2OTMyMzIzMi0xNTU4NzAxODczLTEzMTcwNTk0OTUtNTIyMjgiLCJwdWlkIjoiMTAwM0JGRkQ4RUI0MTA2NiIsInNjcCI6Ik5vdGVzLkNyZWF0ZSBOb3Rlcy5SZWFkIE5vdGVzLlJlYWQuQWxsIE5vdGVzLlJlYWRXcml0ZSBOb3Rlcy5SZWFkV3JpdGUuQWxsIE5vdGVzLlJlYWRXcml0ZS5DcmVhdGVkQnlBcHAiLCJzdWIiOiJFbFlZMThtNGVUcUNpZjBoZ2hOT2g1el9sbUhWWWtRVG5ieHhBWjVFR2FVIiwidGlkIjoiNWJhNWVmNWUtMzEwOS00ZTc3LTg1YmQtY2ZlYjBkMzQ3ZTgyIiwidW5pcXVlX25hbWUiOiJhMDExNzA1N0B1Lm51cy5lZHUiLCJ1cG4iOiJhMDExNzA1N0B1Lm51cy5lZHUiLCJ2ZXIiOiIxLjAifQ.iounNDSTwXKHzE9raGrk8-LvVzUomjxfdM19b9Y1DEgDi-3iczVR4qO-_gWlTPVGU2j70s57RYvKbbmSKAaGUiCzp60vC2apaEYaoDAI9r6497t2eQPdsPZoTap2McHndNU8PVlHqAJcc85h4l1VblM7yP_uBFQuLuL6XK6IwqjKC5gVZoGlSDiKTp4rUnjQyRjrcfZDKaDuL_qVBq8oRBw5VuhLYsifvD2dKYq8N0sCmwkupOAJZNaVJkyttj-nzDJfjCJd9ZQnqIASGNJp4AgaFF_g-Aad-hSzjwfLAFcjAgxU5xdnjebQjUv87mrAulajY6s7C_sahe8OjQxI8g";
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
  }*/

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
