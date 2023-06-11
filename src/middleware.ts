import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
    let verify = req.cookies.get("loggedin");
    let url = req.url

    if (!verify && url.includes('/settings') || url.includes('/chatter') || url.includes('/tags') || url.includes('/bookmarks') || url.includes('/explore') || url.includes('/post')) {
        return NextResponse.redirect("/");
    }

    if (verify && url === "/" || url.includes("/signup" || url.includes("/forgotpassword"))) {
        return NextResponse.redirect("/chatter");
    }
    }
   