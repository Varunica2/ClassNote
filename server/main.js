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
      Meteor.call('getStudents', code, notebook[0]["rawId"], notebookDB_id);
      Meteor.call('getNotebookSectionGroups', code, notebook[0]["rawId"], notebookDB_id);
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
  getStudents:function (code, notebookId, notebookDB_id) {
    Meteor.call('API_getStudents', code, notebookId, function(err, result){
      StudentsDB.remove({});
      if(result["statusCode"] == 200){
        var values = EJSON.parse(result["content"])["value"];
        for(i = 0; i < values.length; i++){
          var id = values[i]["id"];
          var name = values[i]["name"];
          var userId = values[i]["userId"];
          var self = values[i]["self"];
          StudentsDB.insert({rawId: id, name: name, userId: userId, self: self, notebook_id : notebookDB_id});
        }
      }
    });
  },
  getNotebookSectionGroups:function (code, notebookId, notebookDB_id) {
    Meteor.call('API_getNoteBookSectionGroups', code, notebookId, function(err, result){
      SectionsGrpDB.remove({});
      if(result["statusCode"] == 200){
        var values = EJSON.parse(result["content"])["value"];
        var arr = [];
        for(i = 0; i < values.length; i++){
          var id = values[i]["id"];
          var name = values[i]["name"];
          var self = values[i]["self"];
          var sectionDB_id = SectionsGrpDB.insert({rawId: id, name: name, self: self, notebook_id : notebookDB_id});
          arr.push(sectionDB_id);
        }
        for(i = 0; i < values.length; i++){
            Meteor.call('getSectionGroupSections', code, arr[i]);
        }

      }
    });
  },
  getSectionGroupSections:function(code, SectionsGrpDB_id){
    var sectionsGrp = SectionsGrpDB.find({_id:SectionsGrpDB_id}).fetch();
    if(sectionsGrp.length == 1){
      var result = Meteor.call('API_getSectionGroupSections', code, sectionsGrp[0]["self"]);
      if(result["statusCode"] == 200){
        var values = EJSON.parse(result["content"])["value"];
        for(ii = 0; ii < values.length; ii++){
          var id = values[ii]["id"];
          var name = values[ii]["name"];
          var self = values[ii]["self"];
          SectionsDB.insert({rawId: id, name: name, self: self, parentId : SectionsGrpDB_id, notebook_id : sectionsGrp[0]["notebook_id"]});
        }
      }
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
  /*createNewNoteBook:function(code){
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

  }, */
  createNewNoteBook:function(code, nb_name, teacherID, studentsList){
    var notebook = new Object();
    notebook.name = nb_name;

    var teachers =[];
    var teacher = {};
    teacher.id = teacherID;
    teacher.principalType ="Person";
    teachers.push(teacher);
    notebook.teachers = teachers;

    var students =[];
    var stud = {};
    for (i=0 ; i<studentsList.size -1; i++){
      stud.id = studentsList.get(i);
      stud.principalType ="Person";
      students.push(stud);
      notebook.students = students;

    }

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
  createSectionGrp:function(code, notebook_id, sectionName){
    var notebook = NotebooksDB.find({_id : notebook_id}).fetch();
    if(notebook.length == 1){
      var contentIn = {
        'name': sectionName
      };
      Meteor.call('API_createNewSectionGrp', code, JSON.stringify(contentIn), notebook[0]["self"], function(err, result){
        if(result["statusCode"] == 200){
        }
      });
    }
  },
  sendPageToStudents:function(code, notebook_id, questions){
    console.log(questions.length);
    var notebook = NotebooksDB.find({_id : notebook_id}).fetch();
    if(notebook.length == 1){
      var pageContent = "<html> \
        <head> \
          <title>Test</title> \
        </head> \
        <body>";
        for (i = 0; i < questions.length; i++) {
          pageContent += addQuestion(questions[i].index, questions[i].question);
          pageContent +="<br/>";
        }
      pageContent +="\
      </body> \
      </html>";
      var sectionsToSend = SectionsGrpDB.find({notebook_id : notebook_id});
      sectionsToSend.forEach(function (sectionGrp) {
        var studentSection = SectionsDB.find({parentId : sectionGrp._id});
        studentSection.forEach(function (section) {
          if(section.name == 'Homework'){
            Meteor.call('API_sendPageToSection', code, section.self, pageContent, function(err, result){
              if(result["statusCode"] == 200){
              }
            });
          }
        });
      });
    }
  },
  createSectionInStudents:function(code,notebook_id,sectionName){
    var notebook = NotebooksDB.find({_id : notebook_id}).fetch();
    if(notebook.length == 1){
      var contentIn = {
        'name': sectionName
      };
      var sectionsToSend = SectionsGrpDB.find({notebook_id : notebook_id});
      sectionsToSend.forEach(function (sectionGrp) {
        Meteor.call('API_createSectionInStudent', code, sectionGrp.self, JSON.stringify(contentIn), function(err, result){
          if(result["statusCode"] == 200){
          }
        });
      });
    }
  }
});

function addQuestion(index, questionContent){
  var val = "";
  val+="\
  <table style=\"width:750px\">\
    <tr> \
      <td><h3>Question "+index+"</h3></td> \
    </tr> \
    <tr> \
      <td>Question "+questionContent+"</td> \
    </tr> \
    <tr>\
      <td style=\"text-align:left\">\
        <table border=\"2\" style=\"width:750px\">\
          <tr>\
            <td style=\"background-color:#baffc9\">Please answer in the box below: </td>\
          </tr>\
          <tr>\
            <td><div><br/><br/><br/></div></td>\
          </tr>\
        </table>\
      </td> \
    </tr> \
  </table>";
  return val;
}
