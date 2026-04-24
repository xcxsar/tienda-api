import jwt from 'jsonwebtoken';
const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const authRequired = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) return res.status(401).json({ message: "No autorizado, falta token" });

    const token = authHeader.split(" ")[1]; 

    if (!token) return res.status(401).json({ message: "Token no proporcionado" });

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token inválido" });
        
        req.user = user; 
        next();
    });
};