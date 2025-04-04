const User=require('../models/User');
const {clerkClient}=require('@clerk/clerk-sdk-node');



const registerUser=async(req,res)=>{
    try{
        console.log('Auth Log',req.auth);

        if(!req.auth || !req.auth.userId){
            return res.status(401).json({error:'Unauthorized- User ID not found'})
        }


        const userData=await clerkClient.users.getUser(req.auth.userId)

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

module.exports={registerUser,getUserProfile};