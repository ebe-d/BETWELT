import { useEffect, useState } from "react"

const AdminPage=()=>{
    const [isAdmin,setisAdmin]=useState(false);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const checkAdmin=async()=>{
            try{
                const response=await fetch('http://localhost:5000/api/users/checkadmin',{
                    method:'GET',
                    credentials:'include'
                }  
                );

                const data=await response.json();

                if(response.ok){
                    setisAdmin(true);
                }
            }
            catch(error){
                console.error('Error Cheking Admin',error)
            }
            finally{
                setLoading(false);
            }
        };

        checkAdmin();
    },[]);

    if(loading) return <p>loading</p>
    if(!isAdmin) return <p>Acess denied</p>

    return <h1>Welcome to admin</h1>
};

export default AdminPage;