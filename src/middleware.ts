import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
    // req.locals is a Map
    let verify = req.cookies.get("loggedin");
    let url = req.url

    if (!verify && url.includes('/settings') || url.includes('/chatter') || url.includes('/tags') || url.includes('/bookmarks') || url.includes('/explore') || url.includes('/post')) {
        return NextResponse.redirect("https://ibimina-chatter-git-feat-single-article-ibimina.vercel.app/");
    }

    if (verify && url === "https://ibimina-chatter-git-feat-single-article-ibimina.vercel.app/") {
        return NextResponse.redirect("https://ibimina-chatter-git-feat-single-article-ibimina.vercel.app/chatter");
    }
    }
   