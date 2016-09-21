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
  getNoteBookInformation(code, notebookDB_id){
    var notebook = NotebooksDB.find({_id : notebookDB_id}).fetch();
    if(notebook.length == 1){
      Meteor.call('getStudents', code, notebook[0]["rawId"]);
      Meteor.call('getNotebookSectionGroups', code, notebook[0]["rawId"]);
    }
  },
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
  getSectionGroupSections:function(code, SectionsGrpDB_id){
    var sectionsGrp = SectionsGrpDB.find({_id:SectionsGrpDB_id}).fetch();
    if(sectionsGrp.length == 1){
      Meteor.call('API_getSectionGroupSections', code, sectionsGrp[0]["self"], function(err, result){
        if(result["statusCode"] == 200){
          var values = EJSON.parse(result["content"])["value"];
          for(i = 0; i < values.length; i++){
            var id = values[i]["id"];
            var name = values[i]["name"];
            var self = values[i]["self"];
            SectionsDB.insert({rawId: id, name: name, self: self, parentId : SectionsGrpDB_id});
          }
        }
      });
    }
  },
  getNotebookSectionPages:function(code, sectionDB_id){
    var sections = SectionsDB.find({_id:sectionDB_id}).fetch();
    if(sections.length == 1){
       Meteor.call('API_getNoteBookSectionPages', code, sections[0]["self"], function(err, result){
         if(result["statusCode"] == 200){
           var values = EJSON.parse(result["content"])["value"];
           for(i = 0; i < values.length; i++){
             var id = values[i]["id"];
             var title = values[i]["title"];
             var self = values[i]["self"];
             PagesDB.insert({rawId: id, title: title, self: self, parentId : sectionDB_id});
           }
         }
       });
    }
  },
  getPageContent:function(code, pageDB_id){
    var page = PagesDB.find({_id:pageDB_id}).fetch();
    if(page.length == 1){
      Meteor.call('API_getNoteBookSectionPageContent', code, page[0]["self"], function(err, result){
        if(result["statusCode"] == 200){
          PagesContentDB.remove({});
          var contentIn = result["content"];
          PagesContentDB.insert({content : contentIn, parentId : pageDB_id, pageId : page[0]["rawId"]})
        }
      });
    }
  },
  patchPageContent:function(code, pageDB_id, contentIn){
    var pageContent = PagesContentDB.find({_id:pageDB_id}).fetch();
    if(pageContent.length == 1){
      Meteor.call('API_updateScoreAndComments', code, pageContent[0]["pageId"], contentIn, function(err, result){
        if(result["statusCode"] == 200){
        }
      });
    }
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
