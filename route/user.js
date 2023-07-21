const User = require("../model/user");
const express = require('express');
const router = express.Router();
const { checkHeaderConfig } = require('../middleware');
const { getRegexPatternSearch } = require('../util');

let CachedMemoized = {};
let debounce;
const keyRequires = [
    "password", "fullName", "age", "address", "phoneNumber", "username", "email"
];


///register
router.put("/register", checkHeaderConfig, async (req, res) => {
    const body = req.body;
    const detechDevice = req.header("access-device");
    let time = CachedMemoized[detechDevice] ? 300 : 0;

    time && clearTimeout(debounce);
    debounce = setTimeout( async () => {
        try {
            for(let i = 0; i < keyRequires.length; i++) {
                if(!Object.keys(body).includes(keyRequires[i])) {
                    res.send("Some key requires");
                    return;
                }
            }
    
            const checkExits = await User.aggregate([
                { $match: {
                    $or: [
                        { username: {$eq: body.username}},
                        { email: {$eq: body.email}},
                    ]
                }}
            ]);
    
            if(checkExits.length > 0) {
                res.send("Account was exits !");
                return;
            }
    
            const newUser = await User.create({...body});
            if(newUser) {
                CachedMemoized[detechDevice] = true;
                res.send('Create Successfully !');
            } else {
                res.send('Internal Server !');
            }
        } catch(e){
            throw e;
        }
    }, time)
});


// /// login
router.post("/login", async (req, res) => {
   
});

// /// get list and search
router.post("/full/s", checkHeaderConfig, async (req, res) => {
    const search = req.body?.search || req.query?.search || "";

    const isSelectMode = req.body?.isSelectMode;
    const project = isSelectMode ? {
        fullName: 1,
    } : {
        fullName: 1,
        age: 1,
        address: 1,
        phoneNumber: 1,
        email: 1,
    }

    const regexPattern = getRegexPatternSearch(search)  || "";
    try {
        const response = await User.aggregate([
            { $match: {
                $or: [
                    {fullName : {$regex: regexPattern, $options:'i'}},
                    {email : {$regex: regexPattern, $options:'i'}},
                    // {name : {$regex: regexPattern}},
                ]
            }},
            {
                $project: project
            }
        ])
        if(response?.length > 0) {
            res.send(response);
        } else {
            res.send("No user found!");
        }
    } catch(e) {}

});


// /// remove user
// router.delete("/:id", async (req, res) => {
   
// });


// /// update user
// router.put("/:id", async (req, res) => {
   
// });

module.exports = router;