import React from "react";

export default function PrivacyPolicy() {
  return (
    <section>
      <div className="grid grid-cols-main grid-rows-2 pt-12 md:pt-32 md:pb-12">
        <h1 className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-xl md:text-2xl font-bold text-center text-green-primary px-4">
          Privacy Policy
        </h1>
        <p className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary text-center text-xs md:text-sm px-4">
          Effective date: 16 December 2019
        </p>
      </div>
      <div className="grid grid-cols-main mb-[40px] md:mb-[250px]">
        <div className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary flex flex-col gap-y-8 px-4">
          <div>
            <p className="mb-4">
              Your privacy is important to us. It is Silevis Software Sp. z.
              o.o.&rsquo;s policy to respect your privacy regarding any
              information we may collect from you across our website,
              reactgrid.com, and other sites we own and operate.
            </p>
          </div>
          <div>
            <p className="mb-4">
              We only ask for personal information when we truly need it to
              provide a service to you. We collect it by fair and lawful means,
              with your knowledge and consent. We also let you know why we’re
              collecting it and how it will be used.
            </p>
          </div>
          <div>
            <p className="mb-4">
              We only retain collected information for as long as necessary to
              provide you with your requested service. What data we store, we’ll
              protect within commercially acceptable means to prevent loss and
              theft, as well as unauthorized access, disclosure, copying, use or
              modification.
            </p>
          </div>
          <div>
            <p className="mb-4">
              We don’t share any personally identifying information publicly or
              with third-parties, except when required to by law.
            </p>
          </div>
          <div>
            <p className="mb-4">
              Our website may link to external sites that are not operated by
              us. Please be aware that we have no control over the content and
              practices of these sites, and cannot accept responsibility or
              liability for their respective privacy policies.
            </p>
          </div>
          <div>
            <p className="mb-4">
              You are free to refuse our request for your personal information,
              with the understanding that we may be unable to provide you with
              some of your desired services.
            </p>
          </div>
          <div>
            <p className="mb-4">
              Your continued use of our website will be regarded as acceptance
              of our practices around privacy and personal information. If you
              have any questions about how we handle user data and personal
              information, feel free to contact us.
            </p>
          </div>
          <div>
            <p className="mb-4">
              This policy is effective as of 16 December 2019.
            </p>
            <hr className="border-green-primary border-t-4 rounded-full w-1/4 mx-auto mt-12" />
          </div>
        </div>
      </div>
    </section>
  );
}
