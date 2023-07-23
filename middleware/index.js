
const reqHeader = ['user-token', 'access-device'];

const checkHeaderConfig = (req, res, next) => {
    for(let i = 0; i <reqHeader.length; i++) {
        if(!req.header(reqHeader[i])) {
            return false; 
        }
    }
    next();
}



module.exports = {
    checkHeaderConfig
};
