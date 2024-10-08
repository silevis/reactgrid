import Link from "next/link";
import { MdQuestionMark, MdPerson, MdOutlineBugReport } from "react-icons/md";

export default function FeaturesPage() {
  return (
    <section>
      <div className="grid grid-cols-main grid-rows-2 pt-12 md:pt-32 md:pb-12">
        <h1 className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-xl md:text-2xl font-bold text-center text-green-primary px-4">
          Need support?
        </h1>
        <p className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary text-center text-xs md:text-sm px-4">
          If you have any inquiries or need assistance, our team is here to
          help.
        </p>
      </div>
      <div className="grid grid-cols-main mb-[40px] md:mb-[250px] pt-8 md:pt-0">
        <div className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary flex gap-x-16 mb-[128px] justify-center flex-col md:flex-row px-4">
          <div className="flex-1 flex flex-col items-center justify-start">
            <MdQuestionMark size={120} color="#107c41" />
            <h3 className="text-center font-bold">Got questions?</h3>
            <p className="mt-4 text-center">
              Submit a question on our{" "}
              <Link
                className="text-green-primary"
                href="https://github.com/silevis/reactgrid/discussions"
                target="_blank"
              >
                GitHub Discussions
              </Link>{" "}
              page
            </p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-start pt-8 md:pt-0">
            <MdPerson size={120} color="#107c41" />
            <h3 className="text-center font-bold">Need talented developers?</h3>
            <p className="mt-4 text-center">
              Get a cloud native software development team 100% dedicated to
              your product.{" "}
              <Link
                className="text-green-primary"
                href="https://calendly.com/michael-matejko/meeting"
                target="_blank"
              >
                Schedule a meeting with our CTO
              </Link>
            </p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-start pt-8 md:pt-0">
            <MdOutlineBugReport size={120} color="#107c41" />
            <h3 className="text-center font-bold">Technical issues?</h3>
            <p className="mt-4 text-center">
              Please create an issue on our{" "}
              <Link
                className="text-green-primary"
                href="https://github.com/silevis/reactgrid/issues"
                target="_blank"
              >
                GitHub Issues
              </Link>{" "}
              page
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
