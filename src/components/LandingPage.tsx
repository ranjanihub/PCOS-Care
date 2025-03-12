import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, AlertCircle, Heart, Activity } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    navigate('/consultation');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Understanding PCOS Together
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Polycystic Ovary Syndrome (PCOS) affects millions of women worldwide. Get informed, get diagnosed, and get support.
        </p>
      </div>

      {/* What is PCOS Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
        <div className="flex items-center mb-6">
          <Info className="h-8 w-8 text-purple-600 mr-3" />
          <h2 className="text-2xl font-semibold">What is PCOS?</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          PCOS is a hormonal disorder common among women of reproductive age. Women with PCOS may have infrequent or prolonged menstrual periods or excess male hormone (androgen) levels.
        </p>
      </div>

      {/* Common Symptoms */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <AlertCircle className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-3">Common Symptoms</h3>
          <ul className="text-gray-700 space-y-2">
            <li>• Irregular periods</li>
            <li>• Excess androgen</li>
            <li>• Polycystic ovaries</li>
            <li>• Weight gain</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Heart className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-3">Health Impacts</h3>
          <ul className="text-gray-700 space-y-2">
            <li>• Infertility</li>
            <li>• Diabetes</li>
            <li>• Depression</li>
            <li>• Anxiety</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Activity className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-3">Management</h3>
          <ul className="text-gray-700 space-y-2">
            <li>• Healthy diet</li>
            <li>• Regular exercise</li>
            <li>• Medication</li>
            <li>• Regular check-ups</li>
          </ul>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative h-96 rounded-xl overflow-hidden mb-12">
        <img 
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
          alt="Medical Consultation" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-purple-900 bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Take Control?</h2>
            <p className="text-xl mb-6">Get personalized consultation and support</p>
            <button 
              onClick={handleStartAssessment}
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-100 transition-colors"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;