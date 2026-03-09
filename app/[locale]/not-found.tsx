import Link from "next/link";


export default function NotFound() {
    return (
        <div className="main-error bg-[#f9f9f9] h-[600px] relative">
            <div className="container max-w-7xl mx-auto h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1rem] h-full items-center">
                    {/* SVG Section */}
                    <div className="relative flex-1">
                        <div className="svg-error relative  h-full w-full">
                            <svg width="380px" height="500px" viewBox="0 0 837 1045" xmlns="http://www.w3.org/2000/svg">
                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <path id="Polygon-1" d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z" stroke="#e3b75e" strokeWidth="6"/>
                                    <path id="Polygon-2" d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z" stroke="#1E2256" strokeWidth="6"/>
                                    <path id="Polygon-3" d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z" stroke="#333" strokeWidth="6"/>
                                    <path id="Polygon-4" d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z" stroke="#272262" strokeWidth="6"/>
                                    <path id="Polygon-5" d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z" stroke="#666" strokeWidth="6"/>
                                </g>
                            </svg>
                        </div>
                    </div>


                    {/* Message Section */}
                    <div className="relative flex-1">
                        <div className="message-box">
                            <h1 className="text-[#1e2256] text-[100px] leading-[80px] mb-[20px] font-light">
                                404
                            </h1>
                            <p className="text-[#666] text-[16px]"> 
                                Oops, the page you&apos;re looking for doesn&apos;t exist.
                            </p>
                            <div className="buttons-con mt-[20px]">
                                <div className="action-link-wrap">
                                    <button className="btn-effect">
                                        <Link href="/">Go to Home Page</Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
