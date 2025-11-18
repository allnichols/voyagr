import Image from "next/image";
export default function CallToAction() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 mt-15 mb-15">
      <div className="container-custom">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="mb-8 lg:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Ready to start your journey?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of travelers who have discovered amazing
              destinations with our platform. Start planning your next adventure
              today.
            </p>
            <div className="mt-8">
              <button className="btn btn-primary rounded-2xl">
                Sign Up Now
              </button>
            </div>
          </div>
          <div className="lg:ml-8 rounded-2xl">
            <Image
              src={"/plane-travel.jpg"}
              width={500}
              height={500}
              alt="traveling with landmarks"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
