const os = require('os');

module.exports.getOSInformation = async (req,res) => {

    try {
        const getOSInformation = {
            hostname : os.hostname(),
            type : os.type(),
            platform : os.platform(),
        }
        res.status(200).json({});
    } catch (error) {
        res.status(500).json({message: error.message});
    
    }
}