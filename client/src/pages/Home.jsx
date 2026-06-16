import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Statistics from "../components/Statistics";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import VolunteerForm from "../components/VolunteerForm";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <div className="page-bg" />
      <Navbar />
      <Hero />
      <Statistics />
      <Features />
      <Testimonials />
      <VolunteerForm />
      <Contact />
      <Footer />
    </>
  );
}

export default Home;
