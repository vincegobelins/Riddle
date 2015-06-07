angular.module('RiddleApp').factory('riddleFactory', function($location, $firebase, $firebaseArray, $firebaseObject, $firebaseAuth, $firebaseUtils, config) {
  return {

    /**
     * Get all exams
     * @return {Array}
     */

    getExams: function() {

      var query = config.BDD + 'exams';
      var result = new Firebase(query);
      return $firebaseArray(result);

    },

    /**
     * Get an exam by id
     * @param {number} id Id of exam
     * @return {Array}
     */

    getExam: function(id) {

      var query = config.BDD + 'exams/' + id;
      var result = new Firebase(query);
      return $firebaseObject(result);

    },

    /**
     * Get questions of exam
     * @param {number} id Id of exam
     * @return {Array}
     */

    getQuestions: function(id) {

      var query = config.BDD + 'exams/' + id + '/questions';
      var result = new Firebase(query);
      return $firebaseArray(result);

    },

    /**
     * Get different part of exam
     * @param {number} id Id of exam
     * @return {Array}
     */

    getChapters: function(id) {

      var query = config.BDD + 'exams/' + id + '/parties';
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

      var query = config.BDD + 'exams/' + id + '/questions';
      var result = new Firebase(query);

      result.push({
          'titre': title, 'autheur': author, 'question': question, 'chapter': chapter, 'reponses': answers, 'reponseok': answerok, 'solution': solution
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
        console.log('User created with uid: ' + userData.uid);
        console.log(userData);

        var query = config.BDD;
        var result = new Firebase(query);
        var result_array = $firebaseArray(result);
        var uid = userData.uid;

        var user = {exam: name,
          'prenom': surname,
          'photo': photo,
          'exams': ''}

        result.child('users/'+userData.uid).set(user);


        /*
        result_array.$add({
          uid: {
            'nom': name,
            'prenom': surname,
            'photo': photo,
            'exams': ''
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
     * Get user account
     * @param {String} idUser Unique user id
     * @return {Array}
     */

    getAccount : function(idUser, callback){
      var query = config.BDD + 'users/' + idUser;
      var result = new Firebase(query);

      result.on('value', function(snapshot) {
        if(callback){
          callback(snapshot.val());
        }
      }, function(errorObject) {
          callback($firebaseObject(result));
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
        console.log('Logged in as:', authData.uid);
      }).catch(function(error) {
        console.error('Authentication failed:', error);
      });
    },

    /**
     * Log out
     * @return {void}
     */

    logout : function(){

      var ref = new Firebase(config.BDD);
      ref.unauth();

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

      if(authData){
        return authData.uid;
      }
    },

    /**
     * Get users result and personalisation (responses and favorites)
     * @param {number} id Id of exam
     * @return {Array}
     */

    getUserQuestion: function(idUser, idExam) {

      var query = config.BDD + 'users/' + idUser + '/exams/' + idExam;
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
      result.child('users/'+idUser+'/exams/'+idExam+'/'+idQuestion).update(exam);
    },

    /**
     * Set user favorite questions
     * @param {String} idUser Unique id of user
     * @param {String} idExam Unique id of exam
     * @param {String} idQuestion Unique id of question
     */

    setUserFavorite : function(idUser, idExam, idQuestion){
      var query = config.BDD;
      var result = new Firebase(query);
      var favorite = ({favorite : 'true'});
      result.child('users/'+idUser+'/exams/'+idExam+'/'+idQuestion).update(favorite);
    },

    /**
     * Send comment about a question
     * @param {String} idUser Unique id of user
     * @param {String} idExam Unique id of exam
     * @param {String} idQuestion Unique id of question
     * @param {String} comment Unique id of question
     */

    setComment : function(idUser, idExam, idQuestion, comment){
      var query = config.BDD;
      var result = new Firebase(query);
      var timestamp = new Date().getTime();
      var comment = ({comment : comment, user : idUser, date : timestamp});
      //result.child('users/'+idUser+'/exams/'+idExam+'/'+idQuestion+'/commentaires').push(comment);
      result.child('exams/' + idExam + '/questions/' + idQuestion + '/commentaires').push(comment);
    },

    /**
     * Get all comments by question
     * @param {String} idUser Unique id of user
     * @param {String} idExam Unique id of exam
     * @param {String} idQuestion Unique id of question
     * @param {String} comment Unique id of question
     */

    getComments : function(idExam, idQuestion, callback){
      var query = config.BDD + 'exams/' + idExam + '/questions/' + idQuestion + '/commentaires';
      var result = new Firebase(query);
      var resultArray = $firebaseArray(result);

      var _self = this;

      // Declaration du tableau de commentaires
      var comments = [];

      result.on('value', function(snapshot) {
        if(callback){
          //console.log('callback :'+$firebaseArray(result));
          snapshot.forEach(function(data) {

            // Pour chacun des résultats, on garde en mémoire l'id de l'utilisateur et l'id du commentaire
            var authorId =  data.val().user;
            var commentKey = data.key();

            // Requête pour récupérer l'utilisateur associé à l'id utilisateur
            _self.getAccount(authorId, function(result2){

              // On test si le commentaire n'est pas déjà présent dans le tableau avec l'id commentaire
              var isInArray = false;

              for (var i=0; i<comments.length; i++){
                if(comments[i].key == commentKey) {
                  isInArray = true;
                }
              }

              console.log(isInArray);

              // S'il n'existe pas, on le pousse dans le tableau
              if(isInArray == false) {
                comments.push({'author' : result2, 'content' : data.val(), 'key':data.key()});
              }
            });
          });

          console.log(comments.length);
          callback(comments);
        }
      }, function(errorObject) {
        callback($firebaseObject(result));
      });

      //return resultArray;


    }


  };
});
