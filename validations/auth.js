import { body } from "express-validator";


export const registerValidation = [
    body('email', 'Неверный адрес Эл-почти').isEmail(),
    body('password', 'Пароль дольжен состоять из более пяти символов').isLength({ min: 5}),
    body('fullName','Имя дольжен состоять из более трех символов').isLength({ min: 3}),
    body('avatarUrl', 'Не верная ссылка на аватарку').optional().isURL(),
    
]

export const LoginValidation = [
    body('email', 'Неверный адрес Эл-почти').isEmail(),
    body('password', 'Пароль дольжен состоять из более пяти символов').isLength({ min: 5}),
 
]

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
    body('tags','не верный формат тегов (Укажите массив)').optional().isString(),
    body('imgUrl', 'Не верная ссылка на изображения').optional().isString(),
    
]