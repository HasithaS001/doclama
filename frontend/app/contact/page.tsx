import Contact from '../components/Contact';
import Header from '../components/Header';
import ContactFooter from '../components/ContactFooter';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#6265fa]">
            Contact DOCLAMA Support
          </h1>
          <p className="mt-6 text-lg text-[#6265fa]">
            Have questions? We're here to help you get the most out of DOCLAMA.
          </p>
        </div>
        <Contact />
      </main>
      <ContactFooter />
    </div>
  );
}
