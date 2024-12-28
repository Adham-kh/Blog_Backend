import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {
        //error checking
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json(errors.array());
        }
        
        //Зашивровать хеш
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        
        //Создание документа
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,

        });

        //Сохраняемд документ
        const user = await doc.save();

        //Зашифруем id записи 
        const token = jwt.sign(
        {
            _id: user._id,
        },'tokenkey',{expiresIn: '30d'},
    );
    const {passwordHash, ...userData} = user._doc;


        res.json(
        {
            ...userData, 
            token,
        });

    }catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }

}

export const login = async (req, res) => {

    try{

        const user = await UserModel.findOne({ email: req.body.email });

       

        if(user == null || !user){
            return res.status(404).json({message: 'Пользователь не найден'});
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if(!isValidPass){
            return res.status(400).json({
                message: 'Неверный логин и пароль',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },'tokenkey',{expiresIn: '30d'},
        );

        const {passwordHash, ...userData} = user._doc;


        res.json(
        {
            ...userData, 
            token,
        });

    }
    catch(err){
        console.log(err);
        res.status(404).json({
            message: 'Не удалось авторизоваться'
        });
    }
    
}

export const getMe = async (req, res) => {
    try{

        const user = await UserModel.findById(req.userId);

        if(!user){
            res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        const {passwordHash, ...userData} = user._doc;


        res.json(userData);


    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа',
        });
    }
};
