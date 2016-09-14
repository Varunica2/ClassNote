
import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http';

Meteor.methods({
  tempFunction:function (uuid,code) {
    var str = "grant_type=authorization_code";
    str = str.concat("&client_id=2a19c276-5593-44b9-9508-99a68bb2b71d");
    str =  str.concat("&client_secret=vqbydRaSO1HERUmB6kbdgqvzmu3CA3kv/Tm4VEJXSyU=");
    str = str.concat("&redirect_uri=http://onenotebuild.azurewebsites.net");
    str = str.concat("&code="+code);
    str = str.concat("&resource=https://onenote.com/");

    console.log("--transmitting http post--");
    var data = {};
    try {
      data = HTTP.call("POST", "https://login.microsoftonline.com/4ae50cbe-be0d-4849-96c8-0ae667032237/oauth2/token",
      {content  : str});
      var resultObj = JSON.parse(data["content"]);
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
    console.log(data);
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
      tokenPack = Meteor.call('tempFunction',uuid,code);
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
      return e;
    }
  },
  API_getStudents:function(a_token, notebookId){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--getNoteBookStudents-- " + notebookId);
    var data = {};
    try {
      var link = "https://www.onenote.com/api/v1.0/me/notes/notebooks/"+notebookId+"/permissions";
      data = HTTP.get( link, {
        headers : {
                   'Authorization': tokenString
        }
      });
      console.log("success");
      return data;
    }catch(e){
      console.log("fail");
      return e;
    }
  },
  API_getNoteBookSection:function(a_token, notebookId){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--getNoteBookSection-- " + notebookId);
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
      return e;
    }
  },
  API_getNoteBookSectionPages:function(a_token, selfLink){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--getNoteBookSectionPages-- " + selfLink);
    var data = {};
    try {
      var link = selfLink+"/pages";
      data = HTTP.get( link, {
        headers : {
                   'Authorization': tokenString
        }
      });
      console.log("success");
      return data;
    }catch(e){
      console.log("fail");
      return e;
    }
  },
  API_getNoteBookSectionPageContent:function(a_token, pageLink){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--getNoteBookSectionPageContent-- " + pageLink);
    var data = {};
    try {
      var link = selfLink+"?preAuthenticated=true";
      data = HTTP.get( link, {
        headers : {
                   'Authorization': tokenString
        }
      });
      console.log("success");
      return data;
    }catch(e){
      console.log("fail");
      return e;
    }
  },
  API_updateScoreAndComments:function(a_token, pageLink, contentUpdate){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--updateScore-- " + pageLink);
    var data = {};
    try {
      //notes/pages/id/content
      var link = pageLink+"/content";
      data = HTTP.call("POST", link, {
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
      return e;
    }
  },
  API_createNotebook:function(a_token, notebookObj){
    var tokenString = "Bearer ".concat(a_token);
    console.log("--createNotebook--");
    var data = {};
    try {
      var link = "https://www.onenote.com/api/v1.0/me/notes/classNotebooks";
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
  }
});
