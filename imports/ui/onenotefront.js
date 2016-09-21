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
    Meteor.call('getNoteBookInformation', code, this._id);
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
