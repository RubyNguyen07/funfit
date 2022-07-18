const chai = require('chai'); 
const chaiHttp = require('chai-http');
const { beforeEach, afterEach, after } = require('mocha');
chai.use(chaiHttp); 
const app = require('../app').app;
const expect = chai.expect; 
const MyRoutine = require('../models/MyRoutine');
const User = require('../models/User');

describe("/user", () => {
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

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('token');
    }).timeout(10000)

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

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message').eql('User already existed');
    })

    it("POST /login success", async () => {
        let res = await chai
            .request(app)
            .post('/user/login')
            .send({
                email:  "rubynguyen2003@gmail.com",
                password: "1234567890"
            })

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

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message').eql("Incorrect password");
    })

    it("GET /getUserProfile success", async () => {
        let res = await chai
            .request(app)
            .get('/user/getUserProfile')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
            .query({
                otherId: "628b584b988dca06a2db3282"
            })

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('sex');
        expect(res.body).to.have.property('country');
        expect(res.body).to.have.property('name');
    })

    it("GET /getUserProfile error", async () => {
        let res = await chai
            .request(app)
            .get('/user/getUserProfile')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
            .query({
                otherId: "628b584b988dca06a2db3283"
            })
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message').eql('This user does not exist');
    })

    it("GET /level success", async () => {
        let res = await chai
            .request(app)
            .get('/user/level')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('level');
        expect(res.body).to.have.property('points');
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
    
        expect(res.status).to.equal(200);
        res.body.forEach(routine => {
            expect(routine).to.have.property('name');
            expect(routine).to.have.property('userId');
        }); 
    })

    it("GET /getRecRoutines", async () => {
        let res = await chai
            .request(app)
            .get('/routine/getRecRoutines')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
    
        expect(res.status).to.equal(200);
        res.body.forEach(routine => {
            expect(routine).to.have.property('name');
            expect(routine).to.have.property('youtubeVideo');
        }); 
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
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("id");
    })

    it("POST /newRoutine empty steps", async () => {
        let res = await chai
            .request(app)
            .post('/routine/newRoutine')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
            .send({
                name: "Yoga practice for Beginner",
                duration: ["1", "1", "1"], 
                steps: [],  
                timings: [["1", "1", "1"], ["1", "1", "1"]],
                genre: "yoga",
                reminder: "" 
            })

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message').eql("Invalid steps or timings");
    })

    it("POST /newRoutine num of steps !== num of timings", async () => {
        let res = await chai
            .request(app)
            .post('/routine/newRoutine')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
            .send({
                name: "Yoga practice for Beginner",
                duration: ["1", "1", "1"], 
                steps: ["Step one"],  
                timings: [["1", "1", "1"], ["1", "1", "1"]],
                genre: "yoga",
                reminder: "" 
            })

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message').eql("Invalid steps or timings");
    })
    
    it("POST /addToLibrary success", async () => {
        let res = await chai
            .request(app)
            .post('/routine/addToLibrary')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
            .send({
                id: "62a2c2e1b42e60873533b960"
            })

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("message").eql("Added to library");
    })

    it("POST /addToLibrary routine already added error", async () => {
        let res = await chai
            .request(app)
            .post('/routine/addToLibrary')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
            .send({
                id: "62a2c0a0b42e60873533b95c"
            })

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message').eql("Rec routine has already been added to your library");
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
        await MyRoutine.findOneAndDelete({ userId: process.env.USERID, name: "RecRoutine: 5 Minute Yoga for Sleep (Bedtime Yoga for Insomnia)" }); 
    })
})

describe("/chat", () => {
    it("GET /getAllConvos", async () => {
        let res = await chai
            .request(app)
            .get('/chat/getAllConvos')
            .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
        
        expect(res.status).to.equal(200);
        let firstConvo = res.body[0];
        expect(firstConvo).to.have.property('friend');
        expect(firstConvo).to.have.property('convoId');
        expect(firstConvo).to.have.property('latestMessage');
        expect(firstConvo).to.have.property('updatedAt');
    })
})


describe("Story", () => {
    it("GET /story/recommendedFriends", async () => {
        let res = await chai
        .request(app)
        .get('/story/recommendedFriends')
        .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
        
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    }).timeout(10000);

    it ("GET /story/getStoriesInfo", async () => {
        let res = await chai
        .request(app)
        .get('/story/getStoriesInfo')
        .auth(process.env.ACCESS_TOKEN, { type: 'bearer' })
        .query({
            id: process.env.USERID
        })

        expect(res.status).to.be.oneOf([200, 400]);
    }).timeout(10000);
})