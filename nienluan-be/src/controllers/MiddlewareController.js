const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');

dotenv.config()

// nguời dùng đã đăng nhập
const userAccuracy = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader.split(' ')[1];
    // console.log("dfghjkl;",req.user)
    
    if (!authorizationHeader) {
        return res.status(401).json({ 
            message: 'Thiếu Headers' 
        });
    }
    if (!token) {
        return res.status(401).json({ 
            message: 'Thiếu token' 
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user ) => {
        if (err) {
            console.error(err);
            return res.status(403).json({ 
                message: 'Token không hợp lệ' 
            });
        }
        req.user = user;
        console.log("ghjk", req.user)
        next();
    });
};

// người dùng đã đăng nhập và đúng tài khoản
const UserIdAccuracy = (req, res, next) => {
    const authorizationHeader = req.headers['authorization']
    const token = authorizationHeader.split(' ')[1]
    const id = req.params.id

    if (!authorizationHeader) {
        return res.status(401).json({
            message: 'Thiếu Headers'
        })
    }
    if (!token) {
        return res.status(401).json({
            message: 'Thiếu token'
        })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(403).json({ 
                message: 'Token không hợp lệ' 
            });
        }
        if (data.id === id) {
            next()
        } else {
            res.status(403).json({ 
                message: 'Không có quyền truy cập' 
            });
        }
    })
}

// người dùng admin
const userAdminAccuracy = (req, res, next) => {
    const authorizationHeader = req.headers['authorization']
    const token = authorizationHeader.split(' ')[1]

    if (!authorizationHeader) {
        return res.status(401).json({
            message: 'Thiếu Headers'
        })
    }
    if (!token) {
        return res.status(401).json({
            message: 'Thiếu token'
        })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(403).json({ 
                message: 'Token không hợp lệ' 
            });
        }
        if (data.isAdmin === true) {
            next()
        } else {
            res.status(403).json({ 
                message: 'Không có quyền truy cập' 
            });
        }
    })
}

// người dùng là admin hoạc đúng tài khoản
const userOrAdminAccuracy = (req, res, next) => {
    const authorizationHeader = req.headers['authorization']
    const token = authorizationHeader.split(' ')[1]
    const id = req.params.id

    if (!authorizationHeader) {
        return res.status(401).json({
            message: 'Thiếu Headers'
        })
    }
    if (!token) {
        return res.status(401).json({
            message: 'Thiếu token'
        })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(403).json({ 
                message: 'Token không hợp lệ' 
            });
        }
        if (data.isAdmin === true || data.id === id) {
            next()
        } else {
            res.status(403).json({ 
                message: 'Không có quyền truy cập' 
            });
        }
    })
}

module.exports = { 
    userAccuracy, 
    userAdminAccuracy, 
    UserIdAccuracy, 
    userOrAdminAccuracy 
}