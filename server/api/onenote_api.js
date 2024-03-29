import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http';

Meteor.methods({
  getAccessTokenByCode:function (uuid,code) {
    var str = "grant_type=authorization_code";
    str = str.concat("&client_id=2a19c276-5593-44b9-9508-99a68bb2b71d");
    str =  str.concat("&client_secret=vqbydRaSO1HERUmB6kbdgqvzmu3CA3kv/Tm4VEJXSyU=");
    str = str.concat("&redirect_uri=http://classnote.meteorapp.com");
    str = str.concat("&code="+code);
    str = str.concat("&resource=https://onenote.com/");

    console.log(str);
    console.log("--transmitting http post--");
    var data = {};
    try {
      data = HTTP.call("POST", "https://login.microsoftonline.com/common/oauth2/token",
      {
        headers : {'Content-Type': 'application/x-www-form-urlencoded'},
        content : str
      });
      var resultObj = JSON.parse(data["content"]);
      console.log(resultObj);
      var accessToken = resultObj["access_token"];
      var id_token = resultObj["id_token"];
      var refreashToken = resultObj["refresh_token"];
      var epiresOn = resultObj["expires_on"];
      data = { uuid: uuid, status: "success", idtoken : id_token, token : accessToken, refresh_token : refreashToken, expire_on : epiresOn, createdAt : new Date() };
    }catch(e){
      var errorCode = JSON.parse(e.response["content"])["error"];
      console.log(errorCode);
      data = { uuid: uuid, status: errorCode, idtoken : "null", token : "null", refresh_token : "null", expire_on : 0, createdAt : new Date() };
    }
    console.log("---end of http post---");
    return data;
  },
  generateUID:function(uuid,fullurl){
    console.log("Generate UID");
    currUUID = uuid;
    var n = fullurl.indexOf("?");
    var tokenPack = {};
    if(n >0){
      n = n+1;
      var arr = fullurl.substring(n).split("&");
      var code = arr[0].substring(arr[0].indexOf("=") + 1);
      tokenPack = Meteor.call('getAccessTokenByCode',uuid,code);
    }else{

    }
    return tokenPack;
  },
  API_getNoteBooks:function(a_token){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--getNoteBooks--");
    var data = {};
    try {
      data = HTTP.get( 'https://www.onenote.com/api/v1.0/me/notes/classNotebooks', {
        headers : {
                   'Authorization': tokenString
        }
      });
      console.log("success");
      return data;
    }catch(e){
      console.log("fail");
      console.log(e);
      return e;
    }
  },
  API_getStudents:function(a_token, notebookId){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--getNoteBookStudents-- " + notebookId);
    var data = {};
    try {
      var link = "https://www.onenote.com/api/v1.0/me/notes/classNotebooks/"+notebookId+"/permissions";
      data = HTTP.get( link, {
        headers : {
                   'Authorization': tokenString
        }
      });
      console.log("success");
      return data;
    }catch(e){
      console.log("fail");
      console.log(e);
      return e;
    }
  },
  API_getNoteBookSectionGroups:function(a_token, notebookId){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--getNoteBookSectionGroups-- " + notebookId);
    var data = {};
    try {
      var link = "https://www.onenote.com/api/v1.0/me/notes/notebooks/"+notebookId+"/sectionGroups?expand=sections";
      data = HTTP.get( link, {
        headers : {
                   'Authorization': tokenString
        }
      });
      console.log("success");
      return data;
    }catch(e){
      console.log("fail");
      console.log(e);
      return e;
    }
  },
  API_getSectionGroupSections:function(a_token, selfLink){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--getSectionGroupSections-- " + selfLink);
    var data = {};
    try {
      var link = selfLink+"/sections";
      data =  HTTP.get( link, {
        headers : {
                   'Authorization': tokenString
        }
      });
      console.log("success");
      return data;
    }catch(e){
      console.log("fail");
      console.log(e);
      return e;
    }
  },
  API_getNoteBookSectionPages:function(a_token, selfLink, specificPage){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--getNoteBookSectionPages-- " + selfLink);
    var data = {};
    try {

      var link = selfLink+"/pages";
      if(specificPage != ""){
        link= link+"?filter=title eq '"+specificPage+"'";
      }
      data = HTTP.get( link, {
        headers : {
                   'Authorization': tokenString
        }
      });
      console.log("success");
      return data;
    }catch(e){
      console.log("fail");
      console.log(e);
      return e;
    }
  },
  API_getNoteBookSectionPageContent:function(a_token, pageLink){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--getNoteBookSectionPageContent-- " + pageLink);
    var data = {};
    try {
      var link = pageLink+"/content?preAuthenticated=true&includeIDs=true";
      data = HTTP.get( link, {
        headers : {
                   'Authorization': tokenString
        }
      });
      console.log("success");
      return data;
    }catch(e){
      console.log("fail");
      console.log(e);
      return e;
    }
  },
  API_updateScoreAndComments:function(a_token, pageId, contentUpdate){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--updateScore-- " + pageId);
    var data = {};
    try {
      //notes/pages/id/content
      var link = "https://www.onenote.com/api/v1.0/me/notes/pages/"+pageId+"/content";
      data = HTTP.call("PATCH", link, {
        headers : {
                   'Authorization': tokenString,
                   'Content-Type':'application/json'
        },
        content : contentUpdate
      });
      console.log("success");
      return data;
    }catch(e){
      console.log("fail");
      console.log(e);
      return e;
    }
  },
  API_createNotebook:function(a_token, notebookObj, toSendMail){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--createNotebook--");
    var data = {};
    try {

      var link = "https://www.onenote.com/api/v1.0/me/notes/classNotebooks";
      if(toSendMail) {
        link = link.concat("?sendemail=true");
      }else{
        link = link.concat("?sendemail=false");
      }

      data = HTTP.call("POST", link, {
        headers : {
                   'Authorization': tokenString,
                   'Content-Type':'application/json'
        },
        content : notebookObj
      });
      console.log("success");
      return data;
    }catch(e){
      console.log("fail");
      console.log(e);
      return e;
    }
  },
  API_createNewSectionGrp:function(a_token, contentIn, link){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--createSectionGrp in notebook --" + link);
    var data = {};
    try {
      link = link.concat("/sectionGroups")
      data = HTTP.call("POST", link, {
      headers : {
                 'Authorization': tokenString,
                 'Content-Type':'application/json'
               },
               content : contentIn
      });
      console.log("success");
      return data;
    }catch(e){
      console.log("fail");
      console.log(e);
      return e;
    }
  },
  API_addPermissionToSectionGrp:function(a_token, sectionGrpLink, user){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--addingPermission--");
    var data = {};
    try {
      var link = sectionGrpLink + "/permissions";
      data = HTTP.call("POST", link, {
        headers : {
                   'Authorization': tokenString,
                   'Content-Type':'application/json'
        },
        content : user
      });
      console.log("success");
      return data;
    }catch(e){
      console.log("fail");
      return e;
    }
  },
  API_sendPageToSection : function(a_token, sectionGrp_link, pageContent){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--sending page to--" + sectionGrp_link);
    var data = {};
    try {
      var link = sectionGrp_link + "/pages";
      console.log(link);
      data = HTTP.call("POST", link, {
        headers : {
                   'Authorization': tokenString,
                   'Content-Type':'application/xhtml+xml'
        },
        content : pageContent
      });
      console.log("success");
      return data;
    }catch(e){
      console.log(e);
      console.log("fail");
      return e;
    }
  },
  API_createSectionInStudent : function (a_token, sectionGrp_link, sectionContent) {
    var tokenString = "Bearer ".concat(a_token);
    console.log("--creating section in--" + sectionGrp_link);
    var data = {};
    try {
      var link = sectionGrp_link + "/sections";
      data = HTTP.call("POST", link, {
        headers : {
                   'Authorization': tokenString,
                   'Content-Type':'application/json'
        },
        content : sectionContent
      });
      console.log("success");
      return data;
    }catch(e){
      console.log("fail");
      return e;
    }
  },
  API_addStudentToNotebook : function(a_token, notebook_link, notebook_rawId, student){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--Adding student to --" + notebook_link);

    var data = {};
    var studentString = JSON.stringify(student);
    try {

      var link = notebook_link + "/students";
      console.log(link);
      data = HTTP.call("POST", link, {
        headers : {
                   'Authorization' : tokenString,
                   'Content-Type': 'application/json'
        },
        content : studentString
      });

      var pLink = "https://www.onenote.com/api/v1.0/me/notes/notebooks/" + notebook_rawId + "/permissions";
      var pTemp ={
        "userRole" : "Contributor",
        "userId" : student.id
      };
      var pTempS = JSON.stringify(pTemp);
      var temp = HTTP.call("POST", pLink, {
        headers : {
                   'Authorization' : tokenString,
                   'Content-Type': 'application/json'
        },
        content : pTempS
      });
      console.log("success");
      var rType = {};
      rType.data = data;
      rType.pData = temp;

      return rType;
    }catch(e){
      console.log(e);
      console.log("fail");
      return e;
    }
  },
  API_deleteStudentFromNotebook : function(a_token, notebook_id, student_id){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--Deleting student --" + student_id);
    var data = {};
    try {
      var link = "https://www.onenote.com/api/v1.0/me/notes/classNotebooks/" + notebook_id + "/students/" + student_id;
      console.log(link);
      data = HTTP.call("DELETE", link, {
        headers : {
                   'Authorization' : tokenString,
                   'Content-Type': 'application/json'
        }
      });
      console.log("success");
      return data;
    }catch(e){
      console.log(e);
      console.log("fail");
      return e;
    }
  }
});
