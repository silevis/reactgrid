"use client";

import Link from "next/link";
import { Shape1, Shape2 } from "@/components/bg-shapes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function FeaturesPage() {
  return (
    <div className="z-1 flex-1">
      <>
        <div
          className={`absolute z-0 w-[1300px] top-[-5%] left-[-25%] hidden xl:block`}
        >
          <Shape1 />
        </div>
        <div
          className={`absolute z-0 w-[1350px] top-[10%] right-[-20%] hidden xl:block`}
        >
          <Shape2 />
        </div>
      </>

      <section className="relative z-2 grid grid-cols-main max-w-screen-3xl px-4 pt-12 md:pt-32 mx-auto mb-[128px]">
        <div className="col-start-1 col-end-13 xl:col-start-2 xl:col-end-5 flex flex-col md:items-center xl:items-start xl:mt-24">
          <h2 className="text-md sm:text-center xl:text-left md:text-xl pt-4 font-bold text-green-primary">
            Need help with ReactGrid?
          </h2>
          <p className="mb-16 sm:text-center xl:text-left max-w-screen-md">
            If you have questions about integration, features, or have
            encountered a problem – contact us! We’re here to assist you and
            provide the support you need.
          </p>
          <h2 className="text-md md:text-xl sm:text-center xl:text-left font-bold text-green-primary">
            Dedicated Support
          </h2>
          <p className="mb-16 sm:text-center xl:text-left max-w-screen-md">
            If you need more customization of ReactGrid, advanced consulting or
            targeted assistance, our hourly rate is <strong>$59</strong>. Reach
            out to discuss how we can help streamline your project with expert
            support.
          </p>
          <Separator className="my-2 xl:hidden mb-16 xl:mb-0" />
        </div>
        <div className="col-start-1 col-end-13 xl:col-start-6 xl:col-end-12 flex flex-col md:mt-0">
          <h2 className="font-bold text-black-primary sm:text-center text-md md:text-xl mb-8">
            Let us hear from you!
          </h2>
          <form className="self-center flex flex-col gap-4 max-w-[600px] w-full bg-[white] bg-opacity-60 p-4 md:p-12 border border-[#1c1c1c4d]">
            <label className="flex flex-col text-2xs">
              Email address*
              <Input
                type="email"
                className="border border-[#1c1c1c4d] p-2 text-xs rounded-none"
                required
              />
            </label>
            <label className="flex flex-col text-2xs">
              Company name
              <Input
                type="text"
                className="border border-[#1c1c1c4d] p-2 text-xs rounded-none"
              />
            </label>
            <label className="flex flex-col text-2xs">
              Your message*
              <Textarea
                minLength={15}
                className="border border-[#1c1c1c4d] p-2 text-xs rounded-none"
                rows={8}
                required
              />
            </label>
            <Button
              type="submit"
              className="bg-green-primary text-[white] text-xs p-2 rounded-none"
            >
              Send
            </Button>
            <Separator className="my-2" />
            <p className="text-2xs text-gray-600">
              The controller of your personal data is Silevis Software Sp. z
              o.o., with a registered office at Sienkiewicza Street 17/3, 25-007
              Kielce. Your personal data will be processed in order to contact
              you when you use our contact form. Please see more information{" "}
              <Link
                href="/privacy-policy"
                className="text-green-primary underline"
              >
                here
              </Link>
              .
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
