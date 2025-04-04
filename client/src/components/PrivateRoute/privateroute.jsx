import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../Loading/loading";
import NavBar from "../NavBar/navbar";

const PrivateRoute = () => {
    const { isSignedIn, isLoaded } = useUser();

    if (!isLoaded) return <Loading />

    if (!isSignedIn) {
        return <Navigate to='/SignUp' />
    }

    return (
        <>
            <NavBar />
            <Outlet />
        </>
    )
}

export default PrivateRoute;