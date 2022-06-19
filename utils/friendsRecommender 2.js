let ug = require('ug'); 
let User = require('../models/User'); 
const graph =  new ug.Graph(); 

exports.createGraph = async () => {
    let graph =  new ug.Graph();
    await User.find().cursor().eachAsync(doc => {
        graph.createNode(doc._id, {email: doc.email});
    })

    let run_through = []; 

    await User.find().cursor().eachAsync((doc) => {
        if (!(doc._id in run_through)) {        
            let friends = doc.friends; 
            let curr = graph.nodes(doc._id).query().first(); 
            run_through.push(doc._id);
            for (let i = 0; i < friends.length; i++) {
                run_through.push(friends[i]._id);
                graph.createEdge('friends').link(curr, graph.nodes(friends[i]._id).query().first()); 
            }
        }   
    })
    return graph; 
}

// console.log(graph.nodes().query().first()); 

exports.findNeighbors = async (graph, id) => {
    const paths = graph.closest(
        graph.nodes(id).query().first(), {
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
