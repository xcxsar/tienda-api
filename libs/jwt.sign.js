import jwt from 'jsonwebtoken';

function createAccessToken(payload) {
    return new Promise((resolve, reject) => {

        const secret = process.env.TOKEN_SECRET;

        if (!secret) {
            return reject(new Error("TOKEN_SECRET no está definido en las variables de entorno"));
        }

        jwt.sign(
            payload,
            secret,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) {
                    console.log("Error de JWT:", err);
                    reject(err);
                }
                    
                    resolve(token);
            }
        );
    });
}
export { createAccessToken };