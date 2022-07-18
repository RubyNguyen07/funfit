var { TfIdf } = require('natural'); 
var Vector = require('vector-object'); 

/** Format routines from an array of Routine items
 * @param { [Routine] } rawData 
 * @returns array of formatted data 
 */
exports.formatRoutine = (rawData) => {
    var formattedData = []; 

    for (let i = 0; i < rawData.length; i++) {
        let formattedGenre = rawData[i].genre.join(" "); 
        formattedData.push({
            _id: rawData[i]._id, 
            genre: formattedGenre
        })
        
    }

    return formattedData; 
}

/** Format information from an array of User 
 * @param { [User] } rawData 
 * @param { id } userId 
 * @returns Array of formmated users
 */
exports.formatUser = (rawData, userId) => {
    var formattedData = [];

    for (let i = 0; i < rawData.length; i++) {
        if (userId != rawData[i]._id) {
            let curr = rawData[i].workoutInterests;
            if (curr.length > 0) {
                curr.map(genre => {
                    genre.replace(/\s+/g, '').toLowerCase(); 
                })

                let formattedInfo = curr.join(" ") + " " + rawData[i].country.replace(/\s+/g, '').toLowerCase(); 
                formattedData.push({
                    _id: rawData[i]._id, 
                    info: formattedInfo
                })
            }
        }
    }
    return formattedData; 
}

/** Create vectors from list of formatted routine lists based on genre field
 * @param { [formattedRoutine] } items 
 * @returns array of vectors from formattedRoutine
 */
exports.createVectorsFromData = (items) => {
    const tfidf = new TfIdf(); 

    var vectors = []; 

    for (let i = 0; i < items.length; i++) {
        var curr = items[i]; 
        tfidf.addDocument(curr.genre);

        var fields = tfidf.listTerms(i); 
        var coordinates = {};

        for (let j = 0; j < fields.length; j++) {
            var field = fields[j]; 
            coordinates[field.term] = field.tfidf; 
        }

        vectors.push({
            _id: curr._id, 
            vector: new Vector(coordinates)
        })
    }

    return vectors; 
}

/** Create a vector from a User based on workoutInterests and another optional field 
 * @param { User } user 
 * @param { string } moreInfo 
 * @returns a vector from a User
 */
exports.createVectorFromUser = (user, moreInfo) => {
    const tfidf = new TfIdf(); 
    var genres = user.workoutInterests;
    genres.map(genre => {
        genre.replace(/\s+/g, '').toLowerCase(); 
    })

    var formattedInfo = "";
    if (moreInfo == "") {
        formattedInfo = genres.join(" "); 
    } else {
        formattedInfo = genres.join(" ") + " " + moreInfo.replace(/\s+/g, '').toLowerCase(); 
    }     
    tfidf.addDocument(formattedInfo); 

    var coordinates = {}; 
    var fields = tfidf.listTerms(0); 

    for (let i = 0; i < fields.length; i++) {
        var field = fields[i];
        coordinates[field.term] = field.tfidf; 
    }

    return new Vector(coordinates); 
}

// // Create a vector from a user based on workoutInterests and country field 
// exports.createVectorForUserRec = (user) => {
//     const tfidf = new TfIdf(); 
//     var curr = user.workoutInterests;
//     curr.map(genre => {
//         genre.replace(/\s+/g, '').toLowerCase(); 
//     })
//     let formattedInfo = curr.join(" ") + " " + user.country.replace(/\s+/g, '').toLowerCase();     
//     tfidf.addDocument(formattedInfo); 

//     var coordinates = {}; 
//     var fields = tfidf.listTerms(0); 

//     for (let i = 0; i < fields.length; i++) {
//         var field = fields[i];
//         coordinates[field.term] = field.tfidf; 
//     }

//     return new Vector(coordinates); 
// }

/** Create vectors from an array of formatted User 
 * @param { [formattedUser] } users 
 * @returns array of vectors from formatted User 
 */
exports.createVectorFromUsers = (users) => {
    const tfidf = new TfIdf(); 

    var vectors = []; 

    for (let i = 0; i < users.length; i++) {
        var curr = users[i]; 
        tfidf.addDocument(curr.info);

        var fields = tfidf.listTerms(i); 
        var coordinates = {};

        for (let j = 0; j < fields.length; j++) {
            var field = fields[j]; 
            coordinates[field.term] = field.tfidf; 
        }

        vectors.push({
            _id: curr._id, 
            vector: new Vector(coordinates)
        })
    }

    return vectors; 
}

/** Return the most similar items / users to given user 
 * @param { User } user 
 * @param { [Vector] } vectors 
 * @param { string } type 
 * @returns most similar items / users to given user 
 */
exports.returnSimilarItems = (user, vectors, type) => {
    // const usersReturn = 10;
    const itemsReturn = type == "user" ? 10 : 7; 
    const minSimilarity = 0.2; 
    var similar = []; 
    
    for (let i = 0; i < vectors.length; i++) {
        var vid = vectors[i].vector; 

        var idi = vectors[i]._id; 
        var vector = type == "user" 
            ? this.createVectorFromUser(user, user.country) 
            : this.createVectorFromUser(user, "");
        var similarity = vector.getCosineSimilarity(vid); 

        if (similarity > minSimilarity) {
            similar.push({ _id: idi, score: similarity }); 
        }
    }

    similar.sort((x, y) => y.score - x.score); 
    
    if (similar.length > 0) {
        similar = similar.slice(0, itemsReturn);
    }

    return similar; 
}

// exports.returnSimilarItems = (user, vectors) => {
//     const itemsReturn = 7;
//     const minSimilarity = 0.2; 
//     var similar = []; 
    
//     for (let i = 0; i < vectors.length; i++) {
//         var vid = vectors[i].vector; 

//         var idi = vectors[i]._id; 
//         var vector = this.createVectorFromUser(user, "");
//         var similarity = vector.getCosineSimilarity(vid); 

//         if (similarity > minSimilarity) {
//             similar.push({ _id: idi, score: similarity }); 
//         }
//     }

//     similar.sort((x, y) => y.score - x.score); 
//     if (similar.length > 0) {
//         similar = similar.slice(0, itemsReturn);
//     }

//     return similar; 
// }