import { clerkMiddleware,createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const isPublicRoute = createRouteMatcher(
    [
        "/singin",
        "/singup",
        "/",
        "/home"

    ]
)

const isPublicApiRoute = createRouteMatcher(
    [
        "/api/videos",

    ]
) 
export default clerkMiddleware((auth,req) => {
    const {userId} = auth();
    const currentUrl = new URL(req.url);
    const isAccessingDashboard = currentUrl.pathname === "/home";
    const isApiRequest = currentUrl.pathname === "/api";

    // jar to logged in ahe tart
    if(userId && isPublicApiRoute(req) && !isAccessingDashboard ){
        return NextResponse.redirect(new URL("/home",req.url))
    }
    // not logged ing
    if(!userId){
        if(!isPublicRoute(req) && !isPublicApiRoute(req)){
        return NextResponse.redirect(new URL("/singin",req.url))
        }

        if(isApiRequest && isPublicApiRoute(req)){
        return NextResponse.redirect(new URL("/home",req.url));
        }
    }

    return NextResponse.next();


});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};