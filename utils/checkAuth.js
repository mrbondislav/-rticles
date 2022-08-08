import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        try {
            const decodet = jwt.verify(token, 'secret123');

            req.userId = decodet._id;
            next();
        } catch (error) {
            return res.status(403).json({
                message: 'Нет доступа'
            });
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа'
        });
    }

};