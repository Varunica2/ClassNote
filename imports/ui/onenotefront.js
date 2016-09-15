import './onenotefront.html';
import { NotebooksDB, StudentsDB, SectionsGrpDB, SectionsDB, PagesDB } from '../api/mongoRelations.js';

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

Meteor.startup(() => {
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

Template.body.onCreated(function bodyOnCreated() {

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
  'click p'(event, instance) {
    var paragraph = event.currentTarget;
    var id = paragraph.id;
    //add events
    var code =   Session.get("accessToken");
    Meteor.call('getStudents', code, id);
    Meteor.call('getNotebookSectionGroups', code, id);
  },
});

Template.notebook_template.helpers({

});

Template.sectionGrp_template.events({
  'click p'(event, instance) {
    var paragraph = event.currentTarget;
    var id = paragraph.id;
    var sectionsGrp = SectionsGrpDB.find({_id:id}).fetch();
    if(sections.length == 1){
      var code =   Session.get("accessToken");
      Meteor.call('getSectionGroupSections', code, sectionsGrp[0]["self"], sectionsGrp[0]["_id"]);
    }else{
      alert("problem detected");
    }
  }
});

Template.sectionGrp_template.helpers({
  sectionSet : function (parentIdInput) {
    return SectionsDB.find({parentId : parentIdInput});
  }
});

Template.section_template.events({
  'click p'(event, instance) {
    var paragraph = event.currentTarget;
    var id = paragraph.id;
    var sections = SectionsDB.find({_id:id}).fetch();
    if(sections.length == 1){
      var code =   Session.get("accessToken");
      Meteor.call('getNotebookSectionPages', code, sections[0]["self"], sections[0]["_id"]);
    }else{
      alert("problem detected");
    }
  }
});

Template.section_template.helpers({
  pageSet : function (parentIdInput) {
    return PagesDB.find({parentId : parentIdInput});
  }
});


function renderCode(){
  var fullUrl = window.location.href;
  var n = fullUrl.indexOf("#");
  if(n >0){
    n = n+1;
    var arr = fullUrl.substring(n).split("&");
    var code = arr[0].substring(arr[0].indexOf("=") + 1);
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
