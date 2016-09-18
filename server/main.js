import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import '../imports/api/activityList.js';

import './api/onenote_api.js';
import { Session } from 'meteor/session';
import { NotebooksDB, StudentsDB, SectionsGrpDB, SectionsDB, PagesDB, PagesContentDB } from '../imports/api/mongoRelations.js';
import { EJSON } from 'meteor/ejson'

Meteor.startup(() => {

});

Meteor.methods({
  getNoteBooks:function (code) {
    Meteor.call('API_getNoteBooks', code, function(err, result){
      NotebooksDB.remove({});
      if(result["statusCode"] == 200){
        var values = EJSON.parse(result["content"])["value"];
        for(i = 0; i < values.length; i++){
          var id = values[i]["id"];
          var name = values[i]["name"];
          var self = values[i]["self"];
          NotebooksDB.insert({rawId: id, name: name, self : self});
        }
      }
    });
  },
  getStudents:function (code, notebookId) {
    Meteor.call('API_getStudents', code, notebookId, function(err, result){
      StudentsDB.remove({});
      if(result["statusCode"] == 200){
        var values = EJSON.parse(result["content"])["value"];
        for(i = 0; i < values.length; i++){
          var id = values[i]["id"];
          var name = values[i]["name"];
          var userId = values[i]["userId"];
          var self = values[i]["self"];
          StudentsDB.insert({rawId: id, name: name, userId: userId, self: self});
        }
      }
    });
  },
  getNotebookSectionGroups:function (code, notebookId) {
    Meteor.call('API_getNoteBookSectionGroups', code, notebookId, function(err, result){
      SectionsGrpDB.remove({});
      if(result["statusCode"] == 200){
        var values = EJSON.parse(result["content"])["value"];
        for(i = 0; i < values.length; i++){
          var id = values[i]["id"];
          var name = values[i]["name"];
          var self = values[i]["self"];
          SectionsGrpDB.insert({rawId: id, name: name, self: self});
        }
      }
    });
  },
  getSectionGroupSections:function(code, selfLink, parent_id){
    Meteor.call('API_getSectionGroupSections', code, selfLink, function(err, result){
      if(result["statusCode"] == 200){
        var values = EJSON.parse(result["content"])["value"];
        for(i = 0; i < values.length; i++){
          var id = values[i]["id"];
          var name = values[i]["name"];
          var self = values[i]["self"];
          SectionsDB.insert({rawId: id, name: name, self: self, parentId : parent_id});
        }
      }
    });
  },
  getNotebookSectionPages:function(code, selfLink, parent_id){
    Meteor.call('API_getNoteBookSectionPages', code, selfLink, function(err, result){
      if(result["statusCode"] == 200){
        var values = EJSON.parse(result["content"])["value"];
        for(i = 0; i < values.length; i++){
          var id = values[i]["id"];
          var title = values[i]["title"];
          var self = values[i]["self"];
          PagesDB.insert({rawId: id, title: title, self: self, parentId : parent_id});
        }
      }
    });
  },
  getPageContent:function(code, pageId, selfLink, parent_id){
    Meteor.call('API_getNoteBookSectionPageContent', code, selfLink, function(err, result){
      if(result["statusCode"] == 200){
        PagesContentDB.remove({});
        var contentIn = result["content"];
        PagesContentDB.insert({content : contentIn, parentId : parent_id, pageId : pageId})
      }
    });
  },
  patchPageContent:function(code, pageId, contentIn){
    Meteor.call('API_updateScoreAndComments', code, pageId, contentIn, function(err, result){
      if(result["statusCode"] == 200){
      }
    });
  },
  createNewNoteBook:function(code){
    var notebook = new Object();
    notebook.name = "NewNoteBookCreated_01";

    var teachers =[];
    var teacher = {};
    teacher.id = "a0125514@u.nus.edu";
    teacher.principalType ="Person";
    teachers.push(teacher);
    notebook.teachers = teachers;

    var students =[];
    var stud = {};
    stud.id = "a0127275@u.nus.edu";
    stud.principalType ="Person";
    students.push(stud);
    notebook.students = students;

    var sectionGrp = [];
    sectionGrp.push("Homework");
    sectionGrp.push("Assignment");
    notebook.studentSections = sectionGrp;

    notebook.hasTeacherOnlySectionGroup = true;

    console.log(JSON.stringify(notebook));
    var notebookInfo = JSON.stringify(notebook);
    var toSendMail = false;

    Meteor.call('API_createNotebook', code, notebookInfo, toSendMail, function(err, result){
      if(result["statusCode"] == 200){
      }
    });

  },
  createSectionGrp:function(code, notebook_id){
    var notebook = NotebooksDB.find({_id : notebook_id}).fetch();
    if(notebook.length == 1){
      var contentIn = {
        'name': 'My Section Group Name'
      };
      Meteor.call('API_createNewSectionGrp', code, JSON.stringify(contentIn), notebook[0]["self"], function(err, result){
        if(result["statusCode"] == 200){
        }
      });
    }
  }
});
