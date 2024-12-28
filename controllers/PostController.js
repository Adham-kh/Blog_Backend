import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
    try{

        const posts = await PostModel.find() .populate({ path: "user", select: ["name", "avatar"] })   

        res.json(posts);

    }catch(err){    

        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        });

    };
};

export const getOne = async (req, res) => {   
    try{

        const postId = req.params.id;
       
        PostModel.findOneAndUpdate(
            {
                _id: postId
            },

            {
                $inc: { viewsCount: 1 },
            },

            {
                returnDocument: 'after'
            },
        )
        .then(doc => res.json(doc))
        .catch(err => res.status(500).json({ message: "Статья не найдена" }));

    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    };
};

export const removePost = async (req, res) => {
    try{

        const postId = req.params.id;
      
        PostModel.findOneAndDelete(
            {
                _id: postId
            },
        )
        .then(doc => res.json({success: true}))
        .catch(err => res.status(500).json({ message: "Статья не найдена" }));

    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить статью'
        })
    };
}

export const create = async (req, res) => {

    try {

        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageURL: req.body.imageURL,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);

    } catch(err){

        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью'
        })

    };

};   


export const update = async (req, res) => {
    try{
        const postId = req.params.id;
        await PostModel.updateOne({
            _id: postId,
        },
        {
            title: req.body.title,
            text: req.body.text,
            imageURL: req.body.imageURL,
            tags: req.body.tags,
            user: req.userId,
        });

        res.json({
            success: true
        });
    }catch(err){
        res.status(500).json({
            message: 'Не удалось обновить статью'
        });
    }
}