import jwt from 'jsonwebtoken';

export const authRequired = (req,res,next) => {
    const {token} = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'No autorizado' });
    }
    const secret = process.env.TOKEN_SECRET;

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token invalido' });

        req.user = { id: user.id };
        next();
    });
};