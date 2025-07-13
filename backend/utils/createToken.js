import jwt from 'jsonwebtoken';

const generateToken = (res,userID) =>{

const token = jwt.sign({userID} , process.env.JWT_SECRET ,{expiresIn:'30d'});
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
res.cookie('jwt' ,token , {
    httpOnly:true,
    secure:process.env.NODE_ENV !=="development",
    sameSite:'None',
    maxAge:30*24*60*60*1000
} );


return token;
}

export default generateToken;
