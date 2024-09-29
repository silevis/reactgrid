import React from "react";

const cookiesContent = [
  { id: "what-are-cookies", text: "What Are Cookies" },
  { id: "how-we-use-cookies", text: "How We Use Cookies" },
  { id: "disabling-cookies", text: "Disabling Cookies" },
  { id: "cookies-we-set", text: "Cookies We Set" },
  { id: "third-party-cookies", text: "Third Party Cookies" },
  { id: "more-information", text: "More Information" },
];

export default function CookiesPage() {
  return (
    <section>
      <div className="grid grid-cols-main pt-12 md:pt-32 pb-4 md:pb-12">
        <h1 className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-xl md:text-2xl font-bold text-center text-green-primary px-4">
          Cookie Policy for ReactGrid
        </h1>
        <p className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary text-center text-xs md:text-sm px-4">
          Effective date: 16 December 2019
        </p>
      </div>
      <div className="grid grid-cols-main mb-[40px] md:mb-[250px]">
        <div className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary flex flex-col gap-y-8 px-4">
          <div className="boxes-wrapper flex flex-wrap justify-center gap-4 mb-8">
            {cookiesContent.map((box) => (
              <a
                key={box.id}
                href={`#${box.id}`}
                className="box border border-green-primary text-green-primary rounded-md p-2 md:p-4 text-center flex items-center justify-center hover:transform hover:translate-y-[-2px] transition-transform"
              >
                {box.text}
              </a>
            ))}
          </div>

          <div id="what-are-cookies">
            <h2 className="text-xl font-semibold text-green-primary md:mt-6 mb-2">
              What Are Cookies
            </h2>
            <p className="mb-4">
              As is common practice with almost all professional websites this
              site uses cookies, which are tiny files that are downloaded to
              your computer, to improve your experience. This page describes
              what information they gather, how we use it and why we sometimes
              need to store these cookies. We will also share how you can
              prevent these cookies from being stored however this may downgrade
              or &rsquo;break&rsquo; certain elements of the sites
              functionality.
            </p>
            <p className="mb-4">
              For more general information on cookies see the Wikipedia article
              on HTTP Cookies.
            </p>
            <hr className="border-green-primary text-green-primary rounded-md border-t-4 rounded-full w-1/4 mx-auto mt-12 mb-4" />
          </div>

          <div id="how-we-use-cookies">
            <h2 className="text-xl font-semibold text-green-primary mt-6 mb-2">
              How We Use Cookies
            </h2>
            <p className="mb-4">
              We use cookies for a variety of reasons detailed below.
              Unfortunately in most cases there are no industry standard options
              for disabling cookies without completely disabling the
              functionality and features they add to this site. It is
              recommended that you leave on all cookies if you are not sure
              whether you need them or not in case they are used to provide a
              service that you use.
            </p>
            <hr className="border-green-primary text-green-primary rounded-md border-t-4 rounded-full w-1/4 mx-auto mt-12 mb-4" />
          </div>

          <div id="disabling-cookies">
            <h2 className="text-xl font-semibold text-green-primary mt-6 mb-2">
              Disabling Cookies
            </h2>
            <p className="mb-4">
              You can prevent the setting of cookies by adjusting the settings
              on your browser (see your browser Help for how to do this). Be
              aware that disabling cookies will affect the functionality of this
              and many other websites that you visit. Disabling cookies will
              usually result in also disabling certain functionality and
              features of the this site. Therefore it is recommended that you do
              not disable cookies.
            </p>
            <hr className="border-green-primary text-green-primary rounded-md border-t-4 rounded-full w-1/4 mx-auto mt-12 mb-4" />
          </div>

          <div id="cookies-we-set">
            <h2 className="text-xl font-semibold text-green-primary mt-6 mb-2">
              The Cookies We Set
            </h2>
            <p className="mb-4">
              <strong>Orders processing related cookies</strong>
              <br />
              This site offers e-commerce or payment facilities and some cookies
              are essential to ensure that your order is remembered between
              pages so that we can process it properly.
            </p>
            <p className="mb-4">
              <strong>Surveys related cookies</strong>
              <br />
              From time to time we offer user surveys and questionnaires to
              provide you with interesting insights, helpful tools, or to
              understand our user base more accurately. These surveys may use
              cookies to remember who has already taken part in a survey or to
              provide you with accurate results after you change pages.
            </p>
            <p className="mb-4">
              <strong>Forms related cookies</strong>
              <br />
              When you submit data to through a form such as those found on
              contact pages or comment forms cookies may be set to remember your
              user details for future correspondence.
            </p>
            <p className="mb-4">
              <strong>Site preferences cookies</strong>
              <br />
              In order to provide you with a great experience on this site we
              provide the functionality to set your preferences for how this
              site runs when you use it. In order to remember your preferences
              we need to set cookies so that this information can be called
              whenever you interact with a page is affected by your preferences.
            </p>
            <hr className="border-green-primary text-green-primary rounded-md border-t-4 rounded-full w-1/4 mx-auto mt-12 mb-4" />
          </div>

          <div id="third-party-cookies">
            <h2 className="text-xl font-semibold text-green-primary mt-6 mb-2">
              Third Party Cookies
            </h2>
            <p className="mb-4">
              In some special cases we also use cookies provided by trusted
              third parties. The following section details which third party
              cookies you might encounter through this site.
            </p>
            <p className="mb-4">
              This site uses Google Analytics which is one of the most
              widespread and trusted analytics solution on the web for helping
              us to understand how you use the site and ways that we can improve
              your experience. These cookies may track things such as how long
              you spend on the site and the pages that you visit so we can
              continue to produce engaging content.
            </p>
            <p className="mb-4">
              For more information on Google Analytics cookies, see the official
              Google Analytics page.
            </p>
            <p className="mb-4">
              Third party analytics are used to track and measure usage of this
              site so that we can continue to produce engaging content. These
              cookies may track things such as how long you spend on the site or
              pages you visit which helps us to understand how we can improve
              the site for you.
            </p>
            <p className="mb-4">
              From time to time we test new features and make subtle changes to
              the way that the site is delivered. When we are still testing new
              features these cookies may be used to ensure that you receive a
              consistent experience whilst on the site whilst ensuring we
              understand which optimisations our users appreciate the most.
            </p>
            <p className="mb-4">
              We also use social media buttons and/or plugins on this site that
              allow you to connect with your social network in various ways. For
              these to work the following social media sites including;
              https://github.com/, https://www.facebook.com/,
              https://www.npmjs.com/, https://www.gitter.im/ will set cookies
              through our site which may be used to enhance your profile on
              their site or contribute to the data they hold for various
              purposes outlined in their respective privacy policies.
            </p>
            <hr className="border-green-primary text-green-primary rounded-md border-t-4 rounded-full w-1/4 mx-auto mt-12 mb-4" />
          </div>

          <div id="more-information">
            <h2 className="text-xl font-semibold text-green-primary mt-6 mb-2">
              More Information
            </h2>
            <p className="mb-4">
              Hopefully that has clarified things for you and as was previously
              mentioned if there is something that you aren&rsquo;t sure whether
              you need or not it&rsquo;s usually safer to leave cookies enabled
              in case it does interact with one of the features you use on our
              site.
            </p>
            <p className="mb-4">
              However if you are still looking for more information then you can
              contact us through one of our preferred contact methods:
            </p>
            <p className="mb-4">
              <a
                href="mailto:reactgrid@silevis.com"
                className="text-green-primary"
              >
                reactgrid@silevis.com
              </a>
            </p>
            <hr className="border-green-primary text-green-primary rounded-md border-t-4 rounded-full w-1/4 mx-auto mt-12 mb-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
