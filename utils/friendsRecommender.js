let ug = require('ug'); 
let User = require('../models/User'); 
// const graph =  new ug.Graph(); 
// const graph = require('../app');

exports.createGraph = async (inputGraph) => {
    await User.find().cursor().eachAsync(doc => {
        inputGraph.createNode(doc._id, {email: doc.email});
    })

    let run_through = []; 

    await User.find().cursor().eachAsync((doc) => {
        if (!(doc._id in run_through)) {        
            let friends = doc.friends; 
            let curr = inputGraph.nodes(doc._id).query().first(); 
            run_through.push(doc._id);
            for (let i = 0; i < friends.length; i++) {
                run_through.push(friends[i]._id);
                inputGraph.createEdge('friends').link(curr, inputGraph.nodes(friends[i]._id).query().first()); 
            }
        }   
    })

    // return inputGraph; 
}

exports.findNeighbors = (inputGraph, id) => {
    // console.log(inputGraph.nodes(id).query().first());

    const paths = inputGraph.closest(
        inputGraph.nodes(id).query().first(), {
            direction: 0, 
            minDepth: 2, 
            count: 20
        }
    );

    var toReturn = []; 

    for (let i = 0; i < paths.length; i++) {
        toReturn.push(paths[i].end().entity); 
    }

    return toReturn; 
}