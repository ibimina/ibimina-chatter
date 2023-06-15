import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
    // req.locals is a Map
    let verify = req.cookies.get("loggedin");
    let url = req.url

    if (!verify && url.includes('/settings') || !verify && url.includes('/chatter') || !verify && url.includes('/topics') || !verify && url.includes('/bookmarks') || !verify && url.includes('/explore') || !verify && url.includes('/post')) {
        let url = req.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url);
    }

    if (verify && url === process.env.NEXT_PUBLIC_HOST) {
        let url = req.nextUrl.clone()
        url.pathname = '/chatter'
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

export const config = {
    matcher: [ '/bookmarks', '/chatter', '/explore', '/post', '/settings',"/signup", '/topics'],
}