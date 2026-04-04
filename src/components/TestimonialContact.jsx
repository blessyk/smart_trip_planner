import Testimonial from "./Testimonial";
import Contact from "./Contact";

export default function TestimonialContact() {
  return (
    <section className="mt-6 ml-6 py-16 px-6 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <Testimonial/>
        <Contact />
      </div>
    </section>
  );
}