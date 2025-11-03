import Link from "next/link";
import { Button, Container } from "react-bootstrap";

export async function generateMetadata() {
  return {
    title: "Enquiry Thank You",
    description:
      "We appreciate your interest and our representative will get back to you shortly.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/contact-thankyou`,
    },
    robots: "noindex, nofollow",
    openGraph: {
      title: "Enquiry Thank You",
      description:
        "We appreciate your interest and our representative will get back to you shortly.",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact-thankyou`,
      images: [],
    },
    twitter: {
      title: "Enquiry Thank You",
      description:
        "We appreciate your interest and our representative will get back to you shortly.",
      images: [],
    },
  };
}

export default function ThankYouPage() {
  return (
    <section className="py-5 bg-white">
      <Container className="text-center my-5">
        <h1 className="mb-5">Thank you for reaching out to us!</h1>
        <h2 className="mb-5">
          We appreciate your interest and our representative will get back to
          you shortly.
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
