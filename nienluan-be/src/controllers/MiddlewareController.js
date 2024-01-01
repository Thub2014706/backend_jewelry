const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');

dotenv.config()

const userAccuracy = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader.split(' ')[1];
    
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

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) {
            console.error(err);
            return res.status(403).json({ 
                message: 'Token không hợp lệ' 
            });
        }
        next();
    });
};

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