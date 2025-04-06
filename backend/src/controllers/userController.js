const User=require('../models/User');
const {clerkClient}=require('@clerk/clerk-sdk-node');
const asyncHandler = require('express-async-handler');



const registerUser=async(req,res)=>{
    try{
        // Check if we have authorization or regular request body data
        const userId = req.auth?.userId || req.body.userId;
        
        if(!userId){
            return res.status(400).json({error:'User ID is required'})
        }

        const userData = await clerkClient.users.getUser(userId);

        if(!userData){
            return res.status(404).json({error:'User not found in clerk'})
        }

        const {id,firstName,lastName,emailAddresses}=userData;

        if(!emailAddresses || emailAddresses.length === 0){
            return res.status(400).json({error:'No email found'})
        }

        // Check if user exists by clerkId first
        let user=await User.findOne({clerkId:id});

        if(user){
            return res.status(200).json({message:'User Already Registered', user})
        }
        
        // Check if email already exists
        const emailExists = await User.findOne({email: emailAddresses[0].emailAddress});
        if(emailExists) {
            // Update the existing user with the new clerkId
            emailExists.clerkId = id;
            await emailExists.save();
            return res.status(200).json({message:'User linked to existing account', user: emailExists});
        }

        // Create new user if not found
        user = new User({
            clerkId: id,
            username: `${firstName} ${lastName}`,
            email: emailAddresses[0].emailAddress,
        });
        
        await user.save();
        return res.status(201).json({message:'User Registered', user});
    }
    catch(error){
        console.error('Error in registering',error)
        res.status(500).json({error: error.message || 'Internal Server Error'});
    }
}

/////////////////////////////////////

const getUserProfile=async(req,res)=>{


        try{

            console.log('Auth log',req.auth)

            if(!req.auth||!req.auth.userId){
                return res.status(401).json({error:'Unauthorized- User ID not found'})
            }

            const userDetails=await clerkClient.users.getUser(req.auth.userId);

            if(!userDetails){
                return res.status(404).json({error:'User not found in clerk'})
            }

            const {id}=userDetails;
            console.log(id);
            const user=await User.findOne({clerkId:id});

            if(!user){
                return res.status(404).json({message:'User Not Found'})
            }
            res.status(200).json({message:'User Profile Fetched',user})
        }
        catch(error){
            res.status(500).json({error:'Internal Server Error'})
        }
}

/**
 * @desc    Get user wallet balance
 * @route   GET /api/users/:userId/wallet
 * @access  Public (in a real app, this would be protected)
 */
const getUserWallet = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    try {
        // Find user by clerkId
        const user = await User.findOne({ clerkId: userId });
        
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        
        res.status(200).json({
            balance: user.balance
        });
    } catch (error) {
        res.status(500);
        throw new Error('Server error: ' + error.message);
    }
});

/**
 * @desc    Update user wallet balance
 * @route   PUT /api/users/:userId/wallet
 * @access  Public (in a real app, this would be protected)
 */
const updateUserWallet = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { amount, operation } = req.body;
    
    if (!amount || !operation || !['add', 'subtract', 'set'].includes(operation)) {
        res.status(400);
        throw new Error('Please provide a valid amount and operation (add, subtract, or set)');
    }
    
    try {
        // Find user by clerkId
        const user = await User.findOne({ clerkId: userId });
        
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        
        // Update balance based on operation
        if (operation === 'add') {
            user.balance += Number(amount);
        } else if (operation === 'subtract') {
            user.balance -= Number(amount);
            
            // Prevent negative balance
            if (user.balance < 0) {
                user.balance = 0;
            }
        } else if (operation === 'set') {
            user.balance = Number(amount);
        }
        
        await user.save();
        
        res.status(200).json({
            balance: user.balance
        });
    } catch (error) {
        res.status(500);
        throw new Error('Server error: ' + error.message);
    }
});

module.exports={
    registerUser,
    getUserProfile,
    getUserWallet,
    updateUserWallet
};