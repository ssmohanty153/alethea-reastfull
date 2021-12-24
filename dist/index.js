"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const product_1 = __importDefault(require("./product"));
const config_1 = __importDefault(require("./config"));
const router_1 = __importDefault(require("./router"));
const elasticsearch = require("elasticsearch");
const app = express_1.default();
const client = elasticsearch.Client({
    host: "http://127.0.0.1:9200",
});
var path = require('path');
const name = 'Server';
const router = express_1.default();
router.use((req, res, next) => {
    product_1.default.info(name, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        product_1.default.info(name, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });
    next();
});
router.use('/router', router_1.default);
router.use(body_parser_1.default.urlencoded({ extended: true }));
router.use(body_parser_1.default.json());
router.use(express_1.default.static('./'));
router.use(express_1.default.json());
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../', '/index.html'));
});
router.get('/userDetails', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const UserData = yield client.search({
            index: 'userdetailsdb',
            body: {
                "query": {
                    "match_all": {}
                }
            }
        });
        console.log(UserData);
        res.send(UserData);
    }
    catch (e) {
        res.send(e);
    }
}));
router.get('/retiveUserDetails', (req, res) => {
    res.sendFile(path.join(__dirname, '../', '/loginDetails.html'));
});
router.get('/getuserDetails/:MobileNumber', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const UserData = yield client.search({
            index: 'userdetailsdb',
            body: {
                "query": {
                    "match": {
                        "MobileNumber": req.params.MobileNumber
                    }
                }
            }
        });
        res.send(UserData);
    }
    catch (e) {
        res.status(404).send('mobileNum not found');
    }
}));
router.post('/userDetail', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var name = req.body.name;
    var email = req.body.email;
    var age = req.body.age;
    var password = req.body.password;
    var MobileNumber = req.body.MobileNumber;
    yield client.index({
        index: 'userdetailsdb',
        body: {
            "name": name,
            "email": email,
            "age": age,
            "password": password,
            "MobileNumber": MobileNumber
        }
    });
    res.sendFile(path.join(__dirname, '../', '/loginDetails.html'));
}));
router.post('/getuserDetails/:MobileNumber', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var name = req.body.name;
        var email = req.body.email;
        var age = req.body.age;
        var password = req.body.password;
        var MobileNumber = req.body.MobileNumber;
        const UserData = yield client.updateByQuery({
            index: 'userdetailsdb',
            refresh: true,
            body: {
                script: {
                    lang: 'painless',
                    source: 'ctx._source = params.val',
                    "params": {
                        "val": {
                            "name": name,
                            "email": email,
                            "age": age,
                            "password": password,
                            "MobileNumber": MobileNumber
                        }
                    }
                },
                query: {
                    match: {
                        "MobileNumber": req.params.MobileNumber
                    }
                }
            }
        });
        res.redirect("/retiveUserDetails");
    }
    catch (e) {
        console.log(e);
        res.status(404).send();
    }
}));
//     const UserDatas = await client.search({
//         index: 'userdetailsdb',
//         body: {
//             "query": {
//                 "match": {
//                     "MobileNumber": req.params.MobileNumber
//                 }
//             }
//         }
//     })
//     const id = UserDatas.hits.hits[0]._id;
//  await client.update.id({
//         index: 'userdetailsdb',
//         body: {
//             "doc": {
//                 "name": name,
//                 "email": email,
//                 "age": age,
//                 "password": password,
//                 "MobileNumber": MobileNumber
//             }
//         }
//     })
router.post('/userDetail/:MobileNumber', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield client.deleteByQuery({
            index: 'userdetailsdb',
            body: {
                "query": {
                    "match": {
                        "MobileNumber": req.params.MobileNumber
                    }
                }
            }
        });
        console.log(userData);
        res.send("deleted");
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
const httpServer = http_1.default.createServer(router);
httpServer.listen(config_1.default.server.port, () => product_1.default.info(name, `Server is running ${config_1.default.server.hostname}:${config_1.default.server.port}`));
// A response header is an HTTP header that can be used in an HTTP response 
// and that doesn't relate to the content of the message.
//  Response headers, like Age , Location or Server are used to give a 
//  more detailed context of the response.
// router.patch('/getuserDetails/:mobileNum', async (req, res) => {
//     try {
//         const mobileNumb = { mobileNum: req.params.mobileNum };
//         const update = { Userage: 59 };
//         const userData = await personaldetail.findOneAndUpdate(mobileNumb,{$set:update},{new:true});
//        //const userData = await personaldetail.updateOne(id,{$set:update});
//         res.send(userData);
//     } catch (e) {
//         res.status(404).send('mobileNum not found');
//     }
// });
// router.delete('/userDetail/:mobileNum', async (req, res) => {
//     try {
//         const deleteMob = await personaldetails.deleteOne({ mobileNum: req.params.mobileNum });
//         if (!req.params.mobileNum) {
//             return res.status(400).send();
//         }
//         res.send("deleted");
//     } catch (e) {
//         res.status(500).send(e);
//     }
// });
// router.get('/getuserDetails/:mobileNum', async (req, res) => {
//     try {
//         const userData = await personaldetails.findOne({ mobileNum: req.params.mobileNum });
//         res.send(userData);
//     } catch (e) {
//         res.status(404).send('mobileNum not found');
//     }
// });
// router.post('/userDetail', (req, res) => {
//     var name = req.body.name;
//     var email = req.body.email;
//     var age = req.body.age;
//     var password = req.body.password;
//     var MobileNumber = req.body.MobileNumber;
//     const listDetail = new personaldetails({
//         Fullname: name,
//         Userage: age,
//         mobileNum: MobileNumber,
//         email: email,
//         password: password,
//     });
//    // const user = listDetail.save();
//    client.index();
//     res.sendFile(path.join(__dirname, '../', '/loginDetails.html'));
// });
// router.post('/userDetail', (req, res) => {
//     var name = req.body.name;
//     var email = req.body.email;
//     var age = req.body.age;
//     var password = req.body.password;
//     var MobileNumber = req.body.MobileNumber;
//     client.index({
//         index: 'products',
//         body: {
//             "name": name,
//             "email": email,
//             "age":age,
//             "password": password,
//             "MobileNumber":MobileNumber
//         }
//     })
//     .then(response => {
//         return res.json({"message": "Indexing successful"})
//     })
//     .catch(err => {
//          return res.status(500).json({"message": "Error"})
//     })
//     res.sendFile(path.join(__dirname, '../', '/loginDetails.html'));
// });
// router.post('/getuserDetails/:mobileNum', async (req, res) => {
//     try {
//         const id = { mobileNum: req.params.mobileNum };
//         var name = req.body.name;
//         var email = req.body.email;
//         var age = req.body.age;
//         var password = req.body.password;
//         var MobileNumber = req.body.MobileNumber;
//         const userData=await personaldetails.updateOne(id, { $set: {Fullname:name,
//             Userage: age,
//             mobileNum: MobileNumber,
//             email: email,
//             password: password,}});
//         //const userData = await personaldetails.updateOne(id,{$set:update});
//       // res.sendFile(path.join(__dirname, '../', '/loginDetails.html'));
//       res.redirect("/retiveUserDetails");
//     } catch (e) {
//         res.status(404).send('mobileNum not found');
//     }
// });
// async function getTitle() {
//     const { body } = await client.get({
//         index: 'titles',
//         id: 11
//     });
//     console.log(body);
// }
// getTitle().catch(console.log);
// const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/userDetailsDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex:true
// })
//     .then(() => console.log("connection successful"))
//     .catch((err) => console.log(err));
// const detailObj = new mongoose.Schema({
//     Fullname: String,
//     Userage: Number,
//     mobileNum: Number,
//     email: String,
//     password: String
// });
//# sourceMappingURL=index.js.map