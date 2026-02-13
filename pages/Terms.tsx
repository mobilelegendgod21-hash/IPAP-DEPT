import React from 'react';

const Terms = ({ setView }: { setView: (view: string) => void }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic tracking-tighter">Terms and Agreements</h1>
          <p className="text-gray-500 mt-2">Important information about using our service</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 space-y-6">
          <div>
            <p className="text-gray-600 text-sm mb-4">Last Updated: [Insert D]</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              To access certain features of our website (such as sa). Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the [Insert Website URL] website (the "Service") operated by IPAP DEPT ("us").
            </p>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            These Terms outline the rules and regulations for the use of IPAP DEPT's Website, located at [Insert Website URL]. By accessing this website we assume you accept these terms and conditions. Do not continue to use IPAP DEPT if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of [Insert your Country]. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <button
            onClick={() => setView('HOME')}
            className="text-xs text-gray-500 hover:text-black transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go back to Home
        </button>
      </div>
    </div>
  );
};

export default Terms;
