/** @format */

const User = require("../model/user");
const express = require("express");
const router = express.Router();
const { checkHeaderConfig } = require("../middleware");
const {
  getRegexPatternSearch,
  Response,
  convertId,
  convertManyId,
} = require("../util");

let CachedMemoized = {};
let debounce;
const keyRequires = [
  "password",
  "fullName",
  "age",
  "address",
  "phoneNumber",
  "username",
  "email",
];

///register
router.post("/register", checkHeaderConfig, async (req, res) => {
  const body = req.body;
  const detechDevice = req.header("access-device");
  let time = CachedMemoized[detechDevice] ? 300 : 0;

  time && clearTimeout(debounce);
  debounce = setTimeout(async () => {
    try {
      console.log(Object.keys(body));
      for (let i = 0; i < keyRequires.length; i++) {
        if (!Object.keys(body).includes(keyRequires[i])) {
          res.send(Response(400, "Some key require"));
          return;
        }
      }

      const checkExits = await User.aggregate([
        {
          $match: {
            $or: [
              { username: { $eq: body.username } },
              { email: { $eq: body.email } },
            ],
          },
        },
      ]);

      if (checkExits.length > 0) {
        res.send(Response(400, "Account was exits !"));
        return;
      }

      const newUser = await User.create({ ...body });
      if (newUser) {
        CachedMemoized[detechDevice] = true;
        res.send(Response(200, "Create user success"));
      } else {
        res.send(Response(500, "Internal Server !"));
      }
    } catch (e) {
      throw e;
    }
  }, time);
});

/// login
router.post("/login", checkHeaderConfig, async (req, res) => {
  const { username, password } = req.body;

  try {
    const checkUser = await User.aggregate([
      {
        $match: {
          $and: [
            { username: { $eq: username } },
            { password: { $eq: password } },
          ],
        },
      },
    ]);

    if (checkUser.length > 0) {
      res.send(Response(200, "Login success", checkUser[0]));
    } else {
      res.send(Response(404, "Username or password incorrect"));
    }
  } catch (e) {
    throw e;
  }
});

// /// get list and search
router.post("/full/s", checkHeaderConfig, async (req, res) => {
  const search = req.body?.search || req.query?.search || "";

  console.log("running");

  const isSelectMode = req.body?.isSelectMode;
  const project = isSelectMode
    ? {
        fullName: 1,
      }
    : {
        fullName: 1,
        age: 1,
        address: 1,
        phoneNumber: 1,
        email: 1,
      };

  const regexPattern = getRegexPatternSearch(search) || "";
  try {
    console.log("running");
    const response = await User.aggregate([
      {
        $match: {
          $or: [
            { fullName: { $regex: regexPattern, $options: "i" } },
            { email: { $regex: regexPattern, $options: "i" } },
            // {name : {$regex: regexPattern}},
          ],
        },
      },
      {
        $project: project,
      },
    ]);
    console.log("running");
    if (response?.length > 0) {
      res.send(Response(200, "Get user success", response));
    } else {
      res.send(Response(400, "No user found"));
    }
  } catch (e) {}
});

/// remove user
router.delete("/:id", async (req, res) => {
  const Ids = req.body.id;
  let deleteUser;

  if (typeof Ids == "string") {
    deleteUser = await User.deleteOne({
      status: { $eq: "Inactive" },
      _id: { $eq: convertId(Ids) },
    });
  }

  if (Array.isArray(Ids)) {
    const InactiveIds = await User.aggregate([
      {
        $match: {
          $and: [{ _id: { $in: convertManyId(Ids) } }, { status: "Inactive" }],
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);

    deleteUser = await User.deleteMany({
      _id: { $in: InactiveIds },
    });
  }
  console.log(">>>>>>> deleteUser", deleteUser);

  if (deleteUser?.deletedCount > 0) {
    res.send(Response(200, "delete user success"));
  } else {
    res.send(Response(400, "delete user unsuccess"));
  }
});

// /// update user
// router.put("/:id", async (req, res) => {

// });

module.exports = router;
