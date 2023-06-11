import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
    // req.locals is a Map
    let verify = req.cookies.get("loggedin");
    let url = req.url

    if (!verify && url.includes('/settings') || url.includes('/chatter') || url.includes('/tags') || url.includes('/bookmarks') || url.includes('/explore') || url.includes('/post')) {
      let url = req.nextUrl.clone()
      url.pathname = '/'
        NextResponse.redirect(url);
        return NextResponse.next();
    }

    if (verify && url === "http://localhost:3000/") {
        let url = req.nextUrl.clone()
        url.pathname = '/chatter'
        NextResponse.redirect(url);
        return NextResponse.next();
    }
}
