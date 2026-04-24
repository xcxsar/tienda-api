import { prismaClient } from '../utils/db.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.sign.js';
import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // 1. Find user (Prisma uses findUnique for @unique fields)
        const userFound = await prismaClient.user.findUnique({
            where: { email }
        });
        
        if (userFound) return res.status(400).json(["El correo ya esta en uso."]);

        const passwordHash = await bcrypt.hash(password, 10);

        // 2. Create user
        const userSaved = await prismaClient.user.create({
            data: {
                name,
                email,
                password: passwordHash
            }
        });

       const token = await createAccessToken({ id: userSaved.id });
        
       res.cookie('token', token, {
            httpOnly: true, 
            secure: false,  
            sameSite: 'lax', 
            path: '/',
            maxAge: 24 * 60 * 60 * 1000     
        });
            
        res.json({
            id: userSaved.id,
            name: userSaved.name,
            email: userSaved.email
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userFound = await prismaClient.user.findUnique({
            where: { email }
        });

        if (!userFound) return res.status(400).json({ message: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = await createAccessToken({ id: userFound.id });


    res.json({
        id: userFound.id,
        name: userFound.name,
        email: userFound.email,
        token: token, 
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt
    });
    
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const profile = async (req, res) => {
    try {
        const userFound = await prismaClient.user.findUnique({
            where: { id: Number(req.user.id) } 
        });

        if (!userFound) return res.status(400).json({ message: 'Usuario no encontrado' });

        return res.json({
            id: userFound.id,
            name: userFound.name,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Sesión cerrada' });
};

export const verifyToken = async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: 'No autorizado' });
    
    jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ message: 'No autorizado' });
        
        const userFound = await prismaClient.user.findUnique({
            where: { id: Number(decoded.id) }
        });

        if (!userFound) return res.status(401).json({ message: 'Usuario no encontrado' });

        return res.json({
            id: userFound.id,
            name: userFound.name,
            email: userFound.email,
        });
    });
};