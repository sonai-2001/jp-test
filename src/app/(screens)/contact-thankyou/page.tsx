
import Link from "next/link";
import { Button, Container } from "react-bootstrap";

export async function generateMetadata() {

  return {
    title: 'Contact-us Thank You',
    description: 'Thank you for contacting us. We will get back to you soon.',
    alternates: {
      canonical:
      `${process.env.NEXT_PUBLIC_BASE_URL}/contact-thankyou`,
    },
    robots:  "noindex, nofollow",
    openGraph: {
      title: 'Contact-us Thank You',
      description: 'Thank you for contacting us. We will get back to you soon.',
      url:
       
        `${process.env.NEXT_PUBLIC_BASE_URL}/contact-thankyou`,
      images:[],
    },
    twitter: {
      title: 'Contact-us Thank You',
      description: 'Thank you for contacting us. We will get back to you soon.',
      images:  [],
    },
  };
}


export default function ThankYouPage() {
  return (
    <section className="py-5 bg-white">
      <Container className="text-center my-5">
        <h1 className="mb-5">Thank you for contacting us!</h1>
        <h2 className="mb-5">
         We got your message and we will be in touch with you soon.
        </h2>
        <Link className="mb-5" href="/" passHref>
          <Button variant="dark" className="px-4 py-2 rounded-pill">
            Back to Home
          </Button>
        </Link>
      </Container>
    </section>
  );
}