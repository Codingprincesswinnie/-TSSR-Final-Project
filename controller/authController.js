import { pool } from "../database/db.js";

// security imports//
import bcryt from "bcryptjs";
import JWT, { decode } from "jsonwebtoken";

const conn = pool;

function signJWTToken(user) {
  return JWT.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
}

async function userExists(email) {
  let sqlQuery = `SELECT * FROM users WHERE email = ?`;
  const [user] = await pool.query(sqlQuery, [email]);
  if (user.length > 0) {
    return true;
  } else {
    return false;
  }
}

export const createAdminUser = async (req, res, next) => {
  const { first_nam, last_nam, email, password, role } = req.body;

  const pwd = bcryt.hashSync(password, 12);
  let sqlQuery = `INSERT INTO users (first_nam, last_nam, email, password, role)
    VALUES (?,?,?,?,?)  
    `;
  const [result] = await pool.query(sqlQuery, [
    first_nam,
    last_nam,
    email,
    pwd,
    role,
  ]
);
  if (result.affectedRows > 0) {
    res.status(200).json({
      status: "success",
      insertId: result.insertId,
    });
  } else {
    res.status(404).json({
      status: "error",
      message: "Error Creating user",
    });
  }
}

export const registerUser = async (req, res) => {
  const { first_nam, last_nam, email, password } = req.body;
  if (await userExists(email)) {
    res.status(400).json({
      status: "error",
      message: "User already exists",
    });
    return;
  }
  const pwd = bcryt.hashSync(password, 12);
  let sqlQuery = `INSERT INTO users (first_nam, last_nam, email, password)
  VALUES (?,?,?,?)  
  `;

  const [result] = await pool.query(sqlQuery, [
    first_nam,
    last_nam,
    email,
    pwd,
  ]);

  if (result.affectedRows > 0) {
    const token = signJWTToken({
      id: result.insertId,
      email: email,
      role: "USER",
    });
    const data = req.body;

    data.password = undefined;

    res.status(200).json({
      status: "success",
      data: {
        token: token,
        user: data,
      }
    });
  } else {
    res.status(404).json({
      status: "error",
      message: "Error Creating user",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  let sqlQuery = `SELECT * FROM users WHERE email = ?`;

  const [result] = await pool.query(sqlQuery, [email]);

  if (!result.length) {
    return res.status(404).json({
      status: "error",
      message: "User does not exist",
    });
  }
    
  if (!(await bcryt.compare(password, result[0].password))) {
    return res.status(401).json({
      status: "error",
      message: "Invalid login credentials",
    });
  }

  const token = signJWTToken({
    id: result[0].id,
    email: email,
    role: result[0].role
  });
  
  result[0].password = undefined;
  res.status(200).json({
    status: "success",
    data: {
      token: token,
      user: result[0]
    }
  });
};


export const protect = async (req, res, next) => {  
  const authorization = req.get("Authorization");
  // console.log("Authorization header:",!authorization);

  if (!authorization?.startsWith('Bearer'))
    return res.status(401).json({
      status: "error",
      message: "Not Authorized",
    });
      // console.log("Authorization header:", authorization);

  const token = authorization.split(' ')[1];
  try {
 const decoded = JWT.verify(token, process.env.JWT_SECRET);

 console.log(`INSIDE PROTECT: ${JSON.stringify(decoded)}`);

   let strQuery = `SELECT * FROM users WHERE id = ?`;
    const [user] = await pool.query(strQuery, [decoded.id]);
    if (!user.length) {
      return res.status(401).json({
        status: "error",
        message: "Token no longer valid",
      });
    }
    console.log(`USER ${JSON.stringify(user[0])}`);

    user[0].password = undefined;
    req.user = user[0];
    next();

  }catch (e) {
    console.log( `PROTECT => Catch ERROR >> ${e.message}`);
if (e.message == 'jwt expired') {
      return res.status(401).json({
        status: "error",
        message: "Token expired",
      });
    }
    next();
  }
}
   

export const getThisUser = async (req, res, next) => {
  const data = req.user;

  console.log(`INSIDE getThisUser: ${JSON.stringify(data)}`);

  if (!data) return next();

  data.password = undefined;

  let strQuery = `SELECT * FROM users WHERE id = ?`;

  const [user] = await pool.query(strQuery, [data.id]);

  if (!user.length) {
    return res.status(401).json({
      status: "error",
      message: "Invalid request",
    });
  }
  // next();

  user[0].password = undefined;
  return res.status(200).json({
    status: "success",
    data: { user: user[0] },
  });
};
 