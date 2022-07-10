const chai = require('chai'); 
const chaiHttp = require('chai-http');
const { beforeEach, afterEach, after } = require('mocha');
chai.use(chaiHttp); 
const app = require('../app').app;
const should = chai.should(); 
const expect = chai.expect; 
const MyRoutine = require('../models/MyRoutine');
const RecRoutine = require('../models/Routine');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
var convoId = "";
var deleteFriendId = "";
const InitiateMongo = require('../config/db');


describe("/user", () => {
    before(async ()  => {
        await InitiateMongo(); 
    })

    it("POST /signup success", async () => {
        let res = await chai
            .request(app)
            .post('/user/signup')
            .send({
                name: "Test",
                email: "testMocha@gmail.com",
                password: "12345678",
                country: "Singapore",
                sex: "Female"
            })
            // .end((err, res) => {
            //     if (err) {
            //         console.log(err); 
            //     }
            //     expect(res.status).to.equal(201);
            //     expect(res.body).to.have.property('token');
            //     done(); 
            // })

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('token');
    })

    it("POST /signup error blank", async () => {
        let res = await chai
            .request(app)
            .post('/user/signup')
            .send({
                name: "",
                email: "",
                password: "",
                country: "",
                sex: ""
            })
            // .end((err, res) => {
            //     if (err) {
            //         console.log(err); 
            //     }
            //     expect(res.status).to.equal(500);
            //     done(); 
            // })
            
        expect(res.status).to.equal(500);

    })

    it("POST /signup error already existed", async () => {
        let res = await chai
            .request(app)
            .post('/user/signup')
            .send({
                name: "Shel",
                email: "shel@gmail.com",
                password: "12345",
                country: "Vietnam",
                sex: "Male"
            })
            // .end((err, res) => {
            //     if (err) {
            //         console.log(err); 
            //     }
            //     expect(res.status).to.equal(400);
            //     expect(res.body).to.have.property('message');
            //     done(); 
            // })

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message');
    })

    it("POST /login success", async () => {
        let res = await chai
            .request(app)
            .post('/user/login')
            .send({
                email:  "rubynguyen2003@gmail.com",
                password: "1234567890"
            })
            // .end((err, res) => {
            //     if (err) {
            //         console.log(err);
            //     }
            //     expect(res.status).to.equal(200);
            //     expect(res.body).to.have.property('token');
            //     expect(res.body).to.have.property('refreshToken');
            //     done();
            // })

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('refreshToken');
    })

    it("POST /login error", async () => {
        let res = await chai
            .request(app)
            .post('/user/login')
            .send({
                email: "rubynguyen2003@gmail.com",
                password: "12345678"
            })
            // .end((err, res) => {
            //     if (err) {
            //         console.log(err);
            //     }
            //     expect(res.status).to.equal(400);
            //     done();
            // })
            
        expect(res.status).to.equal(400);

    })

    it("GET /getUserProfile success", async () => {
        let res = await chai
            .request(app)
            .get('/user/getUserProfile')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
            .query({
                otherId: "628b584b988dca06a2db3282"
            })
            // .end((err, res) => {
            //     if (err) {
            //         console.log(err);
            //     }
            //     expect(res.status).to.equal(200);
            //     // res.body.should.have.property('name', 'country', 'sex', 'level', 'points', 'workoutInterests'); 
            //     done();
            // })

        expect(res.status).to.equal(200);

    })

    it("GET /getUserProfile error", async () => {
        let res = await chai
            .request(app)
            .get('/user/getUserProfile')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
            .query({
                otherId: "628b584b988dca06a2db3283"
            })
            // .end((err, res) => {
            //     if (err) {
            //         console.log(err);
            //     }
            //     expect(res.status).to.equal(400);
            //     // res.body.should.have.property('name', 'country', 'sex', 'level', 'points', 'workoutInterests'); 
            //     // done();
            // })

        expect(res.status).to.equal(400);

    })

    after(async () => {
        await User.findOneAndDelete({email: "testmocha@gmail.com"});
    })
})

describe("/routine", () => {
    it("GET /getMyRoutines", async () => {
        let res = await chai
            .request(app)
            .get('/routine/getMyRoutines')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
            // .end((err, res) => {
            //     if (err) {
            //         console.log(err);
            //     }
            //     expect(res.status).to.equal(200);
            //     expect(res.body).to.have.length.greaterThan(0);
            //     // done();
            // })
        expect(res.status).to.equal(200);
    })

    it("GET /getRecRoutines", async () => {
        let res = await chai
            .request(app)
            .get('/routine/getRecRoutines')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
            // .end((err, res) => {
            //     if (err) {
            //         console.log(err);
            //     }
            //     expect(res.status).to.equal(200);
            //     expect(res.body).to.have.length.greaterThan(0);
            //     // done(); 
            // })
        expect(res.status).to.equal(200);
    })

    it("POST /newRoutine", async () => {
        let res = await chai
            .request(app)
            .post('/routine/newRoutine')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
            .send({
                name: "Yoga practice for Beginner",
                duration: ["1", "1", "1"], 
                steps: ["1", "1"],  
                timings: [["1", "1", "1"], ["1", "1", "1"]],
                genre: "yoga",
                reminder: "" 
            })
            // .end((err, res) => {
            //     if (err) {
            //         console.log(err);
            //     }
            //     expect(res.status).to.equal(201);
            //     // done(); 
            // })

        expect(res.status).to.equal(201);
    })

    it("DELETE /deleteRoutine", async () => {
        var newRoutine = await MyRoutine({
            name: "Routine to be deleted",
            duration: ["1", "1", "1"], 
            steps: ["1", "1"],  
            timings: [["1", "1", "1"], ["1", "1", "1"]],
            genre: "yoga",
            reminder: "", 
            userId: process.env.USERID
        });
        await newRoutine.save(); 

        let res = await chai
            .request(app)
            .delete('/routine/deleteRoutine')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
            .send({
                id: newRoutine._id
            })

        expect(res.status).to.equal(204);
    })

    after(async () => {
        await MyRoutine.findOneAndDelete({ userId: process.env.USERID, name: "Yoga practice for Beginner"}); 
    })
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

    it("GET /getAllConvos", done => {
        chai
            .request(app)
            .get('/chat/getAllConvos')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
            .end((err, res) => {
                if (err) {
                    console.log(err);
                } 
                expect(res.status).to.equal(200);
                done()
            })
    })

    it("GET /getAConvo", async () => {
        var friend = new User({
            name: "Test2",
            email: "testMocha2@gmail.com",
            password: "12345678",
            country: "Singapore",
            sex: "Female"
        })
        await friend.save(); 

        var newConvo = new Conversation({
            users: [process.env.USERID, friend._id]
        })
        await newConvo.save(); 
        convoId = newConvo._id; 

        const res = await chai
            .request(app)
            .get('/chat/getAConvo')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
            .query({
                convoId: convoId
            })

        expect(res.status).to.equal(200);
    })

    it("DELETE /deleteConvo", async () => {
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
    })    

    after(async () =>  {
        await MyRoutine.findOneAndDelete({ userId: process.env.USERID, name: "Yoga practice for Beginner"}); 
        await User.findOneAndDelete({ email: "testMocha2@gmail.com" || "testmocha@gmail.com"});
        await User.findByIdAndDelete(deleteFriendId);
    })

})