export default function CallToAction() {
  return (
    <div className="container-custom">
      <section
        className="relative bg-cover bg-center bg-no-repeat py-24 px-4 mt-10"
        style={{ backgroundImage: "url('/path-to-your-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-4xl"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Join thousands of travelers who have discovered their perfect
            adventure with us
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
}
