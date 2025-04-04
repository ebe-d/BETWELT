const {clerkClient} = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

const isAdmin = async(req, res) => {
    try {
        const userData = await clerkClient.users.getUser(req.auth.userId);

        if(!userData) {
            return res.status(404).json({message: 'User Not Found in Clerk'});
        }

        const user = await User.findOne({clerkId: userData.id});

        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }

        if(user.role !== 'admin') {
            return res.status(403).json({message: 'Access Denied'});
        }

        res.status(200).json({isAdmin: true});
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

module.exports = isAdmin;