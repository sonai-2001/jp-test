import Link from 'next/link'
import { Spinner } from 'react-bootstrap'
import loader_img from "../../public/assets/img/loader_img.png";
import Image from 'next/image';

export default function NotFound() {
    return (
        <div>
            <div className="col-12  position-relative  d-flex justify-content-center align-items-center" style={{ height: '160px' }}>
                <Spinner animation="border" role="status" style={{ width: '100px', height: '100px' }}>
                </Spinner>
                <Image
                    src={loader_img}
                    alt="Loading..."
                    className='position-absolute'
                    width={80}
                    height={80}
                    unoptimized
                />
            </div>
            <div className="col-12 text-center not_found_link position-relative" style={{ margin: "9px 0px" }}>
                <h2>Not Found</h2>
                <p>Could not find requested resource</p>
                <Link href="/">
                    Return Home
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M19.1643 12L12.9572 5.79291L11.543 7.20712L16.3359 12L11.543 16.7929L12.9572 18.2071L19.1643 12ZM13.5144 12L7.30728 5.79291L5.89307 7.20712L10.686 12L5.89307 16.7929L7.30728 18.2071L13.5144 12Z"
                            fill="white"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    )
}