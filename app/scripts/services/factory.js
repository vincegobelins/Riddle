angular.module('RiddleApp').factory('riddleFactory', function($location, $firebase, $firebaseArray, $firebaseObject, $firebaseAuth, $firebaseUtils, config) {
  return {

    /**
     * Get all exams
     * @return {Array}
     */

    getExams: function() {

      var query = config.BDD + "exams";
      var result = new Firebase(query);
      return $firebaseArray(result);

    },

    /**
     * Get an exam by id
     * @param {number} id Id of exam
     * @return {Array}
     */

    getExam: function(id) {

      var query = config.BDD + "exams/" + id;
      var result = new Firebase(query);
      return $firebaseObject(result);

    },

    /**
     * Get questions of exam
     * @param {number} id Id of exam
     * @return {Array}
     */

    getQuestions: function(id) {

      var query = config.BDD + "exams/" + id + "/questions";
      var result = new Firebase(query);
      return $firebaseArray(result);

    },

    /**
     * Get different part of exam
     * @param {number} id Id of exam
     * @return {Array}
     */

    getChapters: function(id) {

      var query = config.BDD + "exams/" + id + "/parties";
      var result = new Firebase(query);
      return $firebaseArray(result);

    },

    /**
     * Add question to one quizz
     * @param {number} id Id of exam
     * @param {title} title Title of question
     * @param {author} author Author of question
     * @param {question} question Question
     * @param {answers} answers Answers
     * @param {answerok} answerok The good answer
     * @param {solution} solution Some explanations
     * @return {Boolean}
     */

    setQuestion: function(id, title, author, question, chapter, answers, answerok, solution) {

      var query = config.BDD + "exams/" + id + "/questions";
      var result = new Firebase(query);

      result.push({
          "titre": title, "autheur": author, "question": question, "chapter": chapter, "reponses": answers, "reponseok": answerok, "solution": solution
        }).then(function(result) {
        return result.data;
      });

    },

    /**
     * Register a new account
     * @param {String} email User e-mail
     * @param {String} password User password
     * @return {Boolean}
     */

    setAccount : function(email, password, name, surname, photo){

      var ref = new Firebase(config.BDD);
      var auth = $firebaseAuth(ref);
      auth.$createUser({
        email: email,
        password: password
      }).then(function(userData) {
        console.log("User created with uid: " + userData.uid);
        console.log(userData);

        var query = config.BDD;
        var result = new Firebase(query);
        var result_array = $firebaseArray(result);
        var uid = userData.uid;

        var user = {exam: name,
          "prenom": surname,
          "photo": photo,
          "exams": ""}

        result.child('users/'+userData.uid).set(user);


        /*
        result_array.$add({
          uid: {
            "nom": name,
            "prenom": surname,
            "photo": photo,
            "exams": ""
          }
        }).then(function(result) {
          return result.data;
        });*/

      }).catch(function(error) {
        console.log(error);
        return 'coucou';
      });
    },

    /**
     * Login
     * @param {String} email User e-mail
     * @param {String} password User password
     * @return {Boolean}
     */

    login : function(email, password){

      var ref = new Firebase(config.BDD);
      var auth = $firebaseAuth(ref);
      auth.$authWithPassword({
        email: email,
        password: password
      }).then(function(authData) {
        $location.path('/hello');
        console.log("Logged in as:", authData.uid);
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    },

    /**
     * Return Authentication reference
     * @return {Object} Firebase Authentication Reference
     */

    auth : function(){
      var ref = new Firebase(config.BDD);
      return $firebaseAuth(ref);
    },

    /**
     * Return Authentication reference
     * @return {Object} Firebase Authentication Reference
     */

    getAuth : function(){
      var ref = new Firebase(config.BDD);
      var authData = ref.getAuth();

      return authData.uid;
    },

    /**
     * Get users result and personalisation (responses and favorites)
     * @param {number} id Id of exam
     * @return {Array}
     */

    getUserQuestion: function(idUser, idExam) {

      var query = config.BDD + "users/" + idUser + "/exams/" + idExam;
      var result = new Firebase(query);
      return $firebaseArray(result);

    },

    /**
     * Set an empty result array for each user for specific exam
     * @param {String} idUser Unique id of user
     * @param {String} idExam Unique id of exam
     */

    setUserQuestion : function(idUser, idExam, idQuestion, answer){
      var query = config.BDD;
      var result = new Firebase(query);
      var exam = ({question : answer});
      result.child('users/'+idUser+'/exams/'+idExam+'/'+idQuestion).set(exam);
    }


  };
});
