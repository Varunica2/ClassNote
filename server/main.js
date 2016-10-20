import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import '../imports/api/activityList.js';

import './api/onenote_api.js';
import {
	NotebooksDB,
	StudentsDB,
	SectionsGrpDB,
	SectionsDB,
	PagesDB,
	PagesContentDB
} from '../imports/api/mongoRelations.js';
import {EJSON} from 'meteor/ejson'

Meteor.startup(() => {});

Meteor.methods({
	getNoteBookInformation(code, notebookDB_id, cUser) {
		var notebook = NotebooksDB.find({_id: notebookDB_id}).fetch();
		if (notebook.length == 1) {

			StudentsDB.remove({owner: cUser});
			SectionsGrpDB.remove({owner: cUser});
			SectionsDB.remove({owner: cUser});
			PagesDB.remove({owner: cUser});
			PagesContentDB.remove({owner: cUser});

			Meteor.call('getStudents', code, notebook[0]["rawId"], notebookDB_id, cUser);
			Meteor.call('getNotebookSectionGroups', code, notebook[0]["rawId"], notebookDB_id, cUser);
		}
	},
	getNoteBooks: function(code, cUser) {

		NotebooksDB.remove({owner: cUser});
		StudentsDB.remove({owner: cUser});
		SectionsGrpDB.remove({owner: cUser});
		SectionsDB.remove({owner: cUser});
		PagesDB.remove({owner: cUser});
		PagesContentDB.remove({owner: cUser});

		Meteor.call('API_getNoteBooks', code, function(err, result) {
			if (result["statusCode"] == 200) {
				var values = EJSON.parse(result["content"])["value"];
				for (i = 0; i < values.length; i++) {
					var id = values[i]["id"];
					var name = values[i]["name"];
					var self = values[i]["self"];
					NotebooksDB.insert({rawId: id, name: name, self: self, owner: cUser});
				}
			}
		});
	},
	getStudents: function(code, notebookId, notebookDB_id, cUser) {
		Meteor.call('API_getStudents', code, notebookId, function(err, result) {
			if (result["statusCode"] == 200) {
				var values = EJSON.parse(result["content"])["value"];
				for (i = 0; i < values.length; i++) {
					var id = values[i]["id"];
					var name = values[i]["name"];
					var userId = values[i]["userId"];
					var self = values[i]["self"];
					StudentsDB.insert({
						rawId: id,
						name: name,
						userId: userId,
						self: self,
						notebook_id: notebookDB_id,
						owner: cUser
					});
				}
			}
		});
	},
	getNotebookSectionGroups: function(code, notebookId, notebookDB_id, cUser) {
		Meteor.call('API_getNoteBookSectionGroups', code, notebookId, function(err, result) {
			if (result["statusCode"] == 200) {
				var values = EJSON.parse(result["content"])["value"];
				var arr = [];
				for (i = 0; i < values.length; i++) {
					var id = values[i]["id"];
					var name = values[i]["name"];
					var self = values[i]["self"];
					var sectionDB_id = SectionsGrpDB.insert({rawId: id, name: name, self: self, notebook_id: notebookDB_id, owner: cUser});
					arr.push(sectionDB_id);
				}
				for (i = 0; i < values.length; i++) {
					Meteor.call('getSectionGroupSections', code, arr[i], cUser);
				}
				console.log("==== done ===");

			}
		});
	},
	getSectionGroupSections: function(code, SectionsGrpDB_id, cUser) {
		var sectionsGrp = SectionsGrpDB.find({_id: SectionsGrpDB_id}).fetch();
		if (sectionsGrp.length == 1) {
			//remove all existing sections for sectionGrp in mongo
			SectionsDB.remove({sectionGrp_id: SectionsGrpDB_id});

			var result = Meteor.call('API_getSectionGroupSections', code, sectionsGrp[0]["self"]);
			if (result["statusCode"] == 200) {
				var values = EJSON.parse(result["content"])["value"];
				for (ii = 0; ii < values.length; ii++) {
					var id = values[ii]["id"];
					var name = values[ii]["name"];
					var self = values[ii]["self"];
					SectionsDB.insert({
						rawId: id,
						name: name,
						self: self,
						notebook_id: sectionsGrp[0]["notebook_id"],
						sectionGrp_id: sectionsGrp[0]["_id"],
						owner: cUser
					});
				}
			}
		}
	},
	getNotebookSectionPages: function(code, sectionDB_id, cUser) {
		console.log(sectionDB_id);
		console.log("get section page");
		var sections = SectionsDB.find({_id: sectionDB_id}).fetch();
		if (sections.length == 1) {
			PagesDB.remove({section_id: sectionDB_id});
			Meteor.call('API_getNoteBookSectionPages', code, sections[0]["self"], "", function(err, result) {
				if (result["statusCode"] == 200) {
					var values = EJSON.parse(result["content"])["value"];
					for (i = 0; i < values.length; i++) {
						var id = values[i]["id"];
						var title = values[i]["title"];
						var self = values[i]["self"];
						PagesDB.insert({
							rawId: id,
							title: title,
							self: self,
							notebook_id: sections[0]["notebook_id"],
							sectionGrp_id: sections[0]["sectionGrp_id"],
							section_id: sectionDB_id
						});
					}
				}
			});
		}
	},
	getPageContent: function(code, pageDB_id) {
		var page = PagesDB.find({_id: pageDB_id}).fetch();
		if (page.length == 1) {
			Meteor.call('API_getNoteBookSectionPageContent', code, page[0]["self"], function(err, result) {
				if (result["statusCode"] == 200) {
					PagesContentDB.remove({});
					var contentIn = result["content"];
					PagesContentDB.insert({content: contentIn, parentId: pageDB_id, pageId: page[0]["rawId"]
					})
				}
			});
		}
	},
	patchPageContent: function(code, pageDB_id, contentIn) {
		var pageContent = PagesContentDB.find({_id: pageDB_id}).fetch();
		if (pageContent.length == 1) {
			Meteor.call('API_updateScoreAndComments', code, pageContent[0]["pageId"], contentIn, function(err, result) {
				if (result["statusCode"] == 200) {}
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
	createNewNoteBook: function(code, nb_name, teacherID, studentsList, sectionList, cUser) {
		console.log(studentsList + " list");
		var notebook = new Object();
		notebook.name = nb_name;

		var teachers = [];
		var teacher = {};
		teacher.id = teacherID;
		teacher.principalType = "Person";
		teachers.push(teacher);
		notebook.teachers = teachers;

		var students = [];

		for (var i = 0; i < studentsList.length; i++) {
			var stud = {};
			stud.id = studentsList[i];
			stud.principalType = "Person";
			students.push(stud);
		}

		notebook.students = students;
		notebook.studentSections = sectionList;
		notebook.hasTeacherOnlySectionGroup = true;

		console.log(JSON.stringify(notebook));
		var notebookInfo = JSON.stringify(notebook);
		var toSendMail = false;

		var data = Meteor.call('API_createNotebook', code, notebookInfo, toSendMail);

		var result = {};
		result.status = false;
		if (data["statusCode"] == 201) {
			var notbookSet = Meteor.call('API_getNoteBooks', code);
			if (notbookSet["statusCode"] == 200) {
				result.status = true;
				var values = EJSON.parse(notbookSet["content"])["value"];
				for (i = 0; i < values.length; i++) {
					var id = values[i]["id"];
					var name = values[i]["name"];
					var self = values[i]["self"];
					var idInsert = NotebooksDB.insert({rawId: id, name: name, self: self, owner: cUser});
          if(name === nb_name){
            result.id = idInsert;
          }
				}
			}
		}
		return result;
	},
	createSectionGrp: function(code, notebook_id, sectionName) {
		var notebook = NotebooksDB.find({_id: notebook_id}).fetch();
		if (notebook.length == 1) {
			var contentIn = {
				'name': sectionName
			};
			Meteor.call('API_createNewSectionGrp', code, JSON.stringify(contentIn), notebook[0]["self"], function(err, result) {
				if (result["statusCode"] == 200) {}
			});
		}
	},
	sendPageToStudents: function(code, notebook_id, pageObject, sectionName) {
		var notebook = NotebooksDB.find({_id: notebook_id}).fetch();
		if (notebook.length == 1) {
			var pageContent = "<html> \
        <head> \
          <title>" + pageObject.name + "</title> \
        </head> \
        <body>";
			for (i = 0; i < pageObject.questions.length; i++) {
				pageContent += addQuestion(pageObject.questions[i].index, pageObject.questions[i].text);
				pageContent += "<br/>";
			}
			pageContent += "\
      </body> \
      </html>";
			var sectionsToSend = SectionsGrpDB.find({notebook_id: notebook_id});
			sectionsToSend.forEach(function(sectionGrp) {
				var studentSection = SectionsDB.find({sectionGrp_id: sectionGrp._id});
				studentSection.forEach(function(section) {
					if (section.name == sectionName) {
						Meteor.call('API_sendPageToSection', code, section.self, pageContent, function(err, result) {
							if (result["statusCode"] == 200) {}
						});
					}
				});
			});
		}
	},
	createSectionInStudents: function(code, notebook_id, sectionName) {
		var notebook = NotebooksDB.find({_id: notebook_id}).fetch();
		if (notebook.length == 1) {
			var contentIn = {
				'name': sectionName
			};
			var sectionsToSend = SectionsGrpDB.find({notebook_id: notebook_id});
			sectionsToSend.forEach(function(sectionGrp) {
				Meteor.call('API_createSectionInStudent', code, sectionGrp.self, JSON.stringify(contentIn), function(err, result) {
					if (result["statusCode"] == 200) {}
				});
			});
		}
	},
	addStudent: function(code, notebook_id, studentId, cUser) {
		var notebook = NotebooksDB.find({_id: notebook_id}).fetch();
		if (notebook.length == 1) {
			var student = {
				"id": studentId,
				"principalType": "Person"
			};
			Meteor.call('API_addStudentToNotebook', code, notebook[0].self, notebook[0].rawId, student, function(err, result) {
				if (result["pData"]["statusCode"] == 201) {
					var id = result["pData"]["data"]["id"];
					var name = result["pData"]["data"]["name"];
					var userId = result["pData"]["data"]["userId"];
					var self = result["pData"]["data"]["self"];
					StudentsDB.insert({
						rawId: id,
						name: name,
						userId: userId,
						self: self,
						notebook_id: notebook_id,
						owner: cUser
					});
				} else {}
			});
		}
	},
	deleteStudent: function(code, studentId) {
		var student = StudentsDB.find({_id: studentId}).fetch();
		if (student.length == 1) {
			var notebook = NotebooksDB.find({_id: student[0].notebook_id}).fetch();
			if (notebook.length == 1) {
				var studentUserId = student[0].userId.substring(student[0].userId.lastIndexOf("|") + 1);
				Meteor.call('API_deleteStudentFromNotebook', code, notebook[0].rawId, studentUserId, function(err, result) {
					if (result["statusCode"] == 204) {
						StudentsDB.remove({_id: studentId});
					} else {
						console.log(result);
					}
				});
			}
		}
	},
	getStudentsQuestions: function(code, notebook_id, sectionName, pageName, cUser) {
		console.log(notebook_id + " " + sectionName);
		var sections = SectionsDB.find({notebook_id: notebook_id, name: sectionName}).fetch();
		var tempStud = [];
		sections.forEach(function(section) {
			Meteor.call('API_getNoteBookSectionPages', code, section.self, pageName, function(err, result) {
				if (result["statusCode"] == 200) {
					var values = EJSON.parse(result["content"])["value"];
					for (i = 0; i < values.length; i++) {
						var id = values[i]["id"];
						var title = values[i]["title"];
						var self = values[i]["self"];
						var page = PagesDB.find({rawId: id}).fetch();

						var stud = {};

						if (page.length == 0) {
							stud.pageId = PagesDB.insert({
								rawId: id,
								title: title,
								self: self,
								notebook_id: section.notebook_id,
								sectionGrp_id: section.sectionGrp_id,
								section_id: section.rawId
							});
						} else {
							stud.pageId = page[0]._id;
						}
						stud.parentId = section.sectionGrp_id;
						tempStud.push(stud);
					}
				}
			});

		});

		//process the links returned
		for (i = 0; i < tempStud.length; i++) {
			console.log(tempStud[i].pageId);
			var page = PagesDB.find({_id: tempStud[i].pageId}).fetch();
			if (page.length > 0) {
				Meteor.call('API_getNoteBookSectionPageContent', code, page[0]["self"], function(err, result) {
					if (result["statusCode"] == 200) {
						var contentIn = result["content"];
						var questions = parseContent(contentIn);
						tempStud[i].questions = questions;
					}
				});
			}
		}

		//process the tempStud
		var masterQuestion = {};
		var studList = [];
		var numOfQuestions = 0;
		var questionSet = [];

		if (tempStud.length > 0) {
			numOfQuestions = tempStud[0].questions.length - 1;
		}

		for (i = 0; i < tempStud.length; i++) {
			var s = SectionsGrpDB.find({_id: tempStud[i].parentId}).fetch();
			if (s.length > 0) {
				studList.push(s[0].name);
			}
		}

		for (q = 1; q < numOfQuestions + 1; q++) {
			var questionHolder = [];
			for (i = 0; i < tempStud.length; i++) {
				questionHolder.push(tempStud[i].questions[q]);
			}
			questionSet.push(questionHolder);
		}

		masterQuestion.numberOfQuestions = numOfQuestions;
		masterQuestion.studentList = studList;
		masterQuestion.questionSet = questionSet;

		console.log(masterQuestion);
		return masterQuestion;
	},
	initGroupActivity: function(code, sectionDB_id, cUser) {
		console.log("init grp");
		var sections = SectionsDB.find({_id: sectionDB_id}).fetch();
		if (sections.length == 1) {

			PagesDB.remove({section_id: sectionDB_id});
			Meteor.call('getNotebookSectionPages', code, sectionDB_id, cUser);
			var pages = PagesDB.find({section_id: sectionDB_id}).fetch();

			for (pCount = 0; pCount < pages.length; pCount++) {
				var content = [
					{
						'target': 'body',
						'action': 'prepend',
						'position': 'before',
						'content': '<p>Content area zone</p>'
					}
				];
				Meteor.call('API_updateScoreAndComments', code, pages[pCount]['rawId'], JSON.stringify(content), function(err, result) {
					if (result["statusCode"] == 200) {}
				});
			}
		}
	},
	pushQuestionToCollab: function(code, sectionDB_id, questionObject) {
		var sections = SectionsDB.find({_id: sectionDB_id}).fetch();
		if (sections.length == 1) {
			var pages = PagesDB.find({section_id: sectionDB_id}).fetch();
			for (pCount = 0; pCount < pages.length; pCount++) {
				console.log(pages[pCount]);
				var contentIn = addQuestion(questionObject.index, questionObject.text);
				var content = [
					{
						'target': 'body',
						'action': 'append',
						'position': 'after',
						'content': contentIn
					}
				];
				Meteor.call('API_updateScoreAndComments', code, pages[pCount]['rawId'], JSON.stringify(content), function(err, result) {
					if (result["statusCode"] == 200) {}
				});
			}
		}
	},
	addNewCollaborativeActivity: function(code, notebook_id, activityName) {
		var collabName = "_Collaboration Space";
		var sectionGrp = SectionsGrpDB.find({notebook_id: notebook_id, name: collabName}).fetch();
		if (sectionGrp.length > 0) {
			var contentIn = {
				'name': activityName
			};
			Meteor.call('API_createSectionInStudent', code, sectionGrp[0]["self"], JSON.stringify(contentIn), function(err, result) {
				if (result["statusCode"] == 201) {
					var id = result["data"]["id"];
					var name = result["data"]["name"];
					var self = result["data"]["self"];
					SectionsDB.insert({rawId: id, name: name, self: self, notebook_id: notebook_id, sectionGrp_id: sectionGrp[0]["_id"]
					});
				} else {
					if (result["response"]["statusCode"] == 409) {
						console.log("already exist");
					} else {
						console.log("unable to determine error");
						console.log(result);
					}
				}
			});
		}
	}
});

function addQuestion(index, questionContent) {
	var val = "";
	val += "\
  <table style=\"width:750px\">\
    <tr> \
      <td><h3>Question " + index + "</h3></td> \
    </tr> \
    <tr> \
      <td>" + questionContent + "</td> \
    </tr> \
    <tr>\
      <td style=\"text-align:left\">\
        <table border=\"2\" style=\"width:750px\">\
          <tr>\
            <td style=\"background-color:#baffc9\">Please answer in the box below: </td>\
          </tr>\
          <tr>\
            <td><div style=\"background-color:#FFFFFF\" data-id=\"p_q" + index + "\"><pre>  </pre><br/><br/><br/></div></td>\
          </tr>\
        </table>\
      </td> \
    </tr> \
  </table>";
	return val;
}

function parseContent(contentIn) {
	console.log(contentIn);
	var counter = 1;
	var threshold = 5;
	var isProcessing = true;
	var front = contentIn;
	var back = "";
	var middle = "";
	var question = [];

	while (isProcessing) {
		var stringToFind = "<div data-id=\"p_q" + counter + "\"";
		var index = front.indexOf(stringToFind);
		if (index != -1) {
			back = front.substring(index);
			var endIndex = back.indexOf("</div>");
			if (endIndex != -1) {
				middle = back.substring(0, endIndex + 6);
				var str = getStringInHtml(middle);
				question[counter] = str;
			} else {
				threshold = threshold - 1;
			}
		} else {
			threshold = threshold - 1;
		}

		counter = counter + 1;
		// kill loop if missing more then threshold number of question
		if (threshold <= 0) {
			isProcessing = false;
		}

	}
	return question;
}

function getStringInHtml(questionHtml) {
	var isProcessing = true;
	var fullString = "";
	var curr = questionHtml;
	while (isProcessing) {
		var openAnchor = curr.indexOf("<");
		var closeAnchor = curr.indexOf(">");
		if (openAnchor != -1 && closeAnchor != -1) {
			var front = curr.substring(0, openAnchor);
			curr = curr.substring(closeAnchor + 1);
			fullString = fullString + " " + front;
		} else if (openAnchor == -1 && closeAnchor == -1) {
			if (curr.length > 0) {
				fullString = fullString + curr;
			}
			isProcessing = false;
		} else {
			isProcessing = false;
		}
	}
	return fullString.trim();
}
