import jwt from 'jsonwebtoken';


export const check = async (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
   //console.log(token);

    if(token){

        try{
            
            const decoded = jwt.verify(token, 'tokenkey');
            req.userId = decoded._id;

            next();
            
        }catch(err){

            return res.status(403).json({
                message: 'Нет доступа',
            })

        }

    } else {

        res.status(403).json({
            message: 'Нет доступа',
        })

    }
}