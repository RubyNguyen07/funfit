let User = require('../models/User'); 

/** Modify input graph into a new graph based on existing users in database
 * @param { graph } inputGraph 
 */
exports.createGraph = async (inputGraph) => {
    // Create a node according to each user 
    await User.find().cursor().eachAsync(doc => {
        inputGraph.createNode(doc._id, {email: doc.email});
    })

    let run_through = []; 

    // Create edges between friends, if name has been run over then do not do anything else  
    await User.find().cursor().eachAsync((doc) => {
        if (!(doc._id in run_through)) {        
            let friends = doc.friends; 
            let curr = inputGraph.nodes(doc._id).query().first(); 
            run_through.push(doc._id);
            for (let i = 0; i < friends.length; i++) {
                const friend = inputGraph.nodes(friends[i]._id).query().first();
                // If user has been deleted then ignore 
                if (!friend) {
                    continue; 
                }
                run_through.push(friends[i]._id);
                // Create edges between friends
                inputGraph.createEdge('friends').link(curr, inputGraph.nodes(friends[i]._id).query().first()); 
            }
        }   
    })
}

/** Find users that have connection to the user with the given id  
 * @param { graph } inputGraph 
 * @param { id } id 
 * @returns users that have connection to the user with the given id  
 */
exports.findNeighbors = (inputGraph, id) => {

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
