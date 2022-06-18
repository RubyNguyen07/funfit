var { TfIdf } = require('natural'); 
var Vector = require('vector-object'); 

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

exports.formatUser = (rawData) => {
    var formattedData = []; 

    for (let i = 0; i < rawData.length; i++) {
        let curr = rawData[i].workoutInterests;
        if (curr) {
            let newWI = curr.forEach(genre => {
                genre.replace(/\s+/g, '').toLowerCase(); 
            })
            let formattedInfo = newWI.join(" ") + " " + rawData[i].country.replace(/\s+/g, '').toLowerCase(); 
            formattedData.push({
                _id: rawData[i]._id, 
                info: formattedInfo
            })
        }
    }

    return formattedData; 
}

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

exports.createVectorFromUser = (user) => {
    const tfidf = new TfIdf(); 
    var genres = user.workoutInterests.join(" "); 
    tfidf.addDocument(genres); 

    var coordinates = {}; 
    var fields = tfidf.listTerms(0); 

    for (let i = 0; i < fields.length; i++) {
        var field = fields[i];
        coordinates[field.term] = field.tfidf; 
    }

    return new Vector(coordinates); 
}

exports.createVectorForUserRec = (user) => {
    const tfidf = new TfIdf(); 
    let newWI = user.workoutInterests.forEach(genre => {
        genre.replace(/\s+/g, '').toLowerCase(); 
    })
    let formattedInfo = newWI.join(" ") + " " + user.country.replace(/\s+/g, '').toLowerCase();     
    tfidf.addDocument(formattedInfo); 

    var coordinates = {}; 
    var fields = tfidf.listTerms(0); 

    for (let i = 0; i < fields.length; i++) {
        var field = fields[i];
        coordinates[field.term] = field.tfidf; 
    }

    return new Vector(coordinates); 
}

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

exports.returnSimilarUsers = (user, vectors) => {
    const usersReturn = 10;
    const minSimilarity = 0.2; 
    var similar = []; 
    
    for (let i = 0; i < vectors.length; i++) {
        var vid = vectors[i].vector; 

        var idi = vectors[i]._id; 
        var vector = this.createVectorForUserRec(user);
        var similarity = vector.getCosineSimilarity(vid); 

        if (similarity > minSimilarity) {
            similar.push({ _id: idi, score: similarity }); 
        }
    }

    similar.sort((x, y) => y.score - x.score); 
    
    if (similar.length > 0) {
        similar = similar.slice(0, usersReturn);
    }

    return similar; 
}

exports.returnSimilarItems = (user, vectors) => {
    const itemsReturn = 7;
    const minSimilarity = 0.2; 
    var similar = []; 
    
    for (let i = 0; i < vectors.length; i++) {
        var vid = vectors[i].vector; 

        var idi = vectors[i]._id; 
        var vector = this.createVectorFromUser(user);
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