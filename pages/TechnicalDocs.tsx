import React from 'react';
import { SQL_SCHEMA_DOC, API_ROUTES_DOC } from '../constants';

export const TechnicalDocs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-16">
      <header className="mb-16 border-b border-black pb-8">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
          Tech<br/>Spec
        </h1>
        <p className="font-mono text-sm text-gray-500 uppercase tracking-widest">
          IPAP DEPT // Internal Documentation
        </p>
      </header>

      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
             <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono font-bold">1</div>
             <h2 className="text-2xl font-bold uppercase tracking-tight">Database Schema (SQL)</h2>
        </div>
        <div className="bg-gray-50 p-6 rounded border border-gray-200 overflow-x-auto">
            <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">{SQL_SCHEMA_DOC}</pre>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
             <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono font-bold">2</div>
             <h2 className="text-2xl font-bold uppercase tracking-tight">API Architecture</h2>
        </div>
        <div className="bg-gray-50 p-6 rounded border border-gray-200 overflow-x-auto">
            <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">{API_ROUTES_DOC}</pre>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
             <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono font-bold">3</div>
             <h2 className="text-2xl font-bold uppercase tracking-tight">Component Hierarchy</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-sm">
            <div className="border p-6">
                <h3 className="font-bold mb-4 uppercase">/app</h3>
                <ul className="space-y-2 text-gray-600">
                    <li>layout.tsx (Providers: Redux/Zustand)</li>
                    <li>page.tsx (Home/Hero)</li>
                    <li>/shop/page.tsx (PLP)</li>
                    <li>/shop/[slug]/page.tsx (PDP)</li>
                    <li>/checkout/page.tsx</li>
                </ul>
            </div>
            <div className="border p-6">
                <h3 className="font-bold mb-4 uppercase">/components</h3>
                <ul className="space-y-2 text-gray-600">
                    <li><span className="text-black font-bold">ProductVariantSelector.tsx</span> (Critical)</li>
                    <li>CapCard.tsx (WebGL Hover effect)</li>
                    <li>CartDrawer.tsx</li>
                    <li>FilterBar.tsx</li>
                    <li>DropCountdown.tsx</li>
                </ul>
            </div>
        </div>
      </section>
    </div>
  );
};