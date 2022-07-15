const chai = require('chai'); 
const chaiHttp = require('chai-http');
const { beforeEach, afterEach, after } = require('mocha');
chai.use(chaiHttp); 
const app = require('../app').app;
const expect = chai.expect; 
const MyRoutine = require('../models/MyRoutine');
// const RecRoutine = require('../models/Routine');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
var convoId = "";
var deleteFriendId = "";

describe("/user", () => {
    it("Create new user + Get user profile", async () => {
        let firstRes = await chai 
            .request(app)
            .post('/user/signup')
            .send({
                name: "TestUser",
                email: "testuser@gmail.com",
                password: "12345678",
                country: "Vietnam",
                sex: "Female"
            })

        expect(firstRes.status).to.equal(201);
        expect(firstRes.body).to.have.property('token');

        let secondRes = await chai 
            .request(app)
            .put('/user/updateProfile')
            .auth(firstRes.body.token, { type: 'bearer' })
            .send({
                name: "UpdatedUser",
                email: "testuser@gmail.com",
                password: "1234567890",
                country: "Vietnam",
                sex: "Female"
            })

        expect(secondRes.status).to.equal(200);

        let res = await chai 
            .request(app)
            .get('/user/me')
            .auth(firstRes.body.token, { type: 'bearer' })
        
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('name').eql("UpdatedUser");
        expect(res.body).to.have.property('country');
        expect(res.body).to.have.property('sex');
    }).timeout(10000)

    after(async () => {
        await User.findOneAndDelete({ email: "testuser@gmail.com" });
    })
})

describe("/routine", () => {
    it("Log in + Create + Edit + Get + Delete routine", async () => {
        var routineAccessToken = "";

        let logRes = await chai
            .request(app)
            .post('/user/login')
            .send({
                email:  "rubynguyen2003@gmail.com",
                password: "1234567890"
            })

        expect(logRes.status).to.equal(200);
        expect(logRes.body).to.have.property('token');
        expect(logRes.body).to.have.property('refreshToken');
        routineAccessToken = logRes.body.token;
            
        let createRes = await chai
            .request(app)
            .post('/routine/newRoutine')
            .auth(routineAccessToken, { type: 'bearer' })
            .send({
                name: "Routine to be deleted",
                duration: ["1", "1", "1"], 
                steps: ["1", "1"],  
                timings: [["1", "1", "1"], ["1", "1", "1"]],
                genre: ["yoga"],
                reminder: "", 
                userId: process.env.USERID
            })
        expect(createRes.status).to.equal(201);
        expect(createRes.body).to.have.property('id');

        let editRes = await chai
            .request(app)
            .put('/routine/editRoutine')
            .auth(routineAccessToken, { type: 'bearer' })
            .send({
                id: createRes.body.id,
                genre: ["gym"]
            })

        expect(editRes.status).to.equal(200);
        expect(editRes.body).to.have.property('message').eql("Update successfully");

        let getRes = await chai
            .request(app)
            .get('/routine/myRoutine')
            .auth(routineAccessToken, { type: 'bearer' })
            .query({
                id: createRes.body.id
            })

        expect(getRes.status).to.equal(200);
        expect(getRes.body).to.have.property('genre').eql(["gym"]);

        let res = await chai
            .request(app)
            .delete('/routine/deleteRoutine')
            .auth(routineAccessToken, { type: 'bearer' })
            .send({
                id: createRes.body.id
            })

        expect(res.status).to.equal(204);
    }).timeout(10000)
})

describe("/chat", () => {
    before(async () => {
        var friend = new User({
            name: "Test4",
            email: "newFriend@gmail.com",
            password: "12345678",
            country: "Singapore",
            sex: "Female"
        })
        await friend.save(); 
        deleteFriendId = friend._id;
    })

    it("Initiate + Delete convo", async () => {
        let res = await chai
        .request(app)
        .post('/chat/initiateConvo')
        .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
        .send({
            anotherUserId: deleteFriendId
        })

        expect(res.status).to.equal(201);

        let response = await chai
            .request(app)
            .delete('/chat/deleteConvo')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
            .send({
                convoId: res.body,
                anotherUserId: deleteFriendId
            })
        expect(response.status).to.equal(204);

    }).timeout(10000)    

    after(async () =>  {
        await User.findByIdAndDelete(deleteFriendId);
    })

})


