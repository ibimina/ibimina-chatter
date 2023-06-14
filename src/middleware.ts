import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
    // req.locals is a Map
    let verify = req.cookies.get("loggedin");
    let url = req.url

    if (verify === undefined && url.includes('/settings') || url.includes('/chatter') || url.includes('/topics') || url.includes('/bookmarks') || url.includes('/explore') || url.includes('/post')) {
        let url = req.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url);
    }

    if (verify && url === "http://localhost:3000/") {
        let url = req.nextUrl.clone()
        url.pathname = '/chatter'
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/bookmarks', '/chatter', '/explore', '/post', '/settings', '/topics',],
}