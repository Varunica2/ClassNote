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
    Meteor.call('createNewNoteBook', code, function(){
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
    var notebook = NotebooksDB.find({_id : this._id}).fetch();
    if(notebook.length == 1){
      Meteor.call('getStudents', code, notebook[0]["rawId"]);
      Meteor.call('getNotebookSectionGroups', code, notebook[0]["rawId"]);
    }
  },
  'click .e_insertSectionGrps'(event, instance){
    event.stopPropagation();
    var code =   Session.get("accessToken");
    Meteor.call('createSectionGrp', code, this._id);
  }
});

Template.notebook_template.helpers({

});

Template.sectionGrp_template.events({
  'click p'(event, instance) {
    event.stopPropagation();
    var paragraph = event.currentTarget;
    var id = paragraph.id;
    var sectionsGrp = SectionsGrpDB.find({_id:id}).fetch();
    if(sectionsGrp.length == 1){
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
    event.stopPropagation();
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


Template.pages_template.events({
  'click p'(event, instance) {
      event.stopPropagation();
      var paragraph = event.currentTarget;
      var id = paragraph.id;
      var sections = PagesDB.find({_id:id}).fetch();
      if(sections.length == 1){
        var code =   Session.get("accessToken");
        Meteor.call('getPageContent', code, sections[0]["rawId"], sections[0]["self"], sections[0]["_id"]);
      }else{
        alert("problem detected");
      }
  }
});

Template.pageContent_template.helpers({
  page : function(){
    return PagesContentDB.find({});
  }
});

Template.pageContent_template.events({
  'click button'(event, instance) {
    var button = event.currentTarget;
    var id = button.id;
    var pageContent = PagesContentDB.find({_id:id}).fetch();
    if(pageContent.length == 1){
      var code =   Session.get("accessToken");
      var content = [{
        'target': '#commentArea',
        'action': 'append',
        'content': '<p>A new paragraph at the bottom of the container #commentArea</p>'
      }];
      Meteor.call('patchPageContent', code, pageContent[0]["pageId"], JSON.stringify(content));
    }else{
      alert("problem detected");
    }
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
