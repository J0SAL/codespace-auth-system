const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    // grab the cookies, UI depends how he sends the data
    console.log(req.cookies); 

    const {token} = req.cookies
    if(!token)
        res.status(403).send("login first")
    
    try{
        const decode = jwt.verify(token, "secret")
        console.log(decode)
        req.user = decode // something good
    }catch(error){
        console.log(error);
        res.status(401).send("Invalid token2")
    }

    return next()
}

module.exports = auth