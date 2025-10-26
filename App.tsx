
import React, { useState, useEffect } from 'react';
import { StarIcon } from './components/icons/StarIcon';

// This URL should be replaced with the actual Google Business review link.
// Example for Googleplex: https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4
const GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJi0vnrExx14ARCFbYG3xvPqo'; 

type View = 'RATING' | 'PRIVATE_FEEDBACK' | 'PUBLIC_REDIRECT';

const App: React.FC = () => {
  const [view, setView] = useState<View>('RATING');
  const [rating, setRating] = useState<number>(0);

  const handleRating = (rate: number) => {
    setRating(rate);
    if (rate >= 4) {
      setView('PUBLIC_REDIRECT');
    } else {
      setView('PRIVATE_FEEDBACK');
    }
  };

  const resetToRating = () => {
    setRating(0);
    setView('RATING');
  };

  const renderContent = () => {
    switch (view) {
      case 'RATING':
        return <RatingScreen onRate={handleRating} />;
      case 'PRIVATE_FEEDBACK':
        return <PrivateFeedbackScreen rating={rating} onBack={resetToRating} />;
      case 'PUBLIC_REDIRECT':
        return <PublicRedirectScreen rating={rating} />;
      default:
        return <RatingScreen onRate={handleRating} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center transition-all duration-300">
        {renderContent()}
      </div>
    </div>
  );
};

// --- View Components ---

interface RatingScreenProps {
  onRate: (rating: number) => void;
}

const RatingScreen: React.FC<RatingScreenProps> = ({ onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Fatboy Restaurant</h1>
      <p className="text-gray-600 mt-2 mb-6">Gracias por calificarnos</p>
      <div className="flex justify-center space-x-2 text-yellow-400 mb-6">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button
              key={ratingValue}
              type="button"
              className="transform transition-transform duration-150 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
              onClick={() => onRate(ratingValue)}
              onMouseEnter={() => setHoverRating(ratingValue)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`Rate ${ratingValue} out of 5 stars`}
            >
              <StarIcon className="w-10 h-10" isFilled={ratingValue <= hoverRating} />
            </button>
          );
        })}
      </div>
       <p className="text-sm text-gray-400">Selecciona de 1 a 5 estrellas</p>
    </>
  );
};

interface PrivateFeedbackScreenProps {
  rating: number;
  onBack: () => void;
}

const PrivateFeedbackScreen: React.FC<PrivateFeedbackScreenProps> = ({ rating, onBack }) => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Private feedback submitted:', { rating, feedback });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
         </svg>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">¡Gracias!</h2>
        <p className="text-gray-600">Agradecemos tus comentarios. Nos ayudarán a mejorar.</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Lamentamos tu experiencia</h2>
      <p className="text-gray-600 mb-4">
        Tu opinión es muy importante. Por favor, cuéntanos cómo podemos mejorar.
      </p>
      <div className="flex justify-center my-4 text-yellow-400">
        {[...Array(5)].map((_, index) => (
          <StarIcon key={index} className="w-6 h-6 mx-1" isFilled={index < rating} />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          placeholder="Escribe tu reseña aquí..."
          required
        />
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:underline"
          >
            Atrás
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Enviar Comentario
          </button>
        </div>
      </form>
    </>
  );
};

interface PublicRedirectScreenProps {
    rating: number;
}

const PublicRedirectScreen: React.FC<PublicRedirectScreenProps> = ({ rating }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = GOOGLE_REVIEW_URL;
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">¡Gracias por tu calificación!</h2>
            <div className="flex justify-center my-4 text-yellow-400">
                {[...Array(5)].map((_, index) => (
                    <StarIcon key={index} className="w-8 h-8 mx-1" isFilled={index < rating} />
                ))}
            </div>
            <p className="text-gray-600 mb-6">
                Nos alegra que hayas tenido una buena experiencia. Te estamos redirigiendo a Google para que dejes tu reseña pública.
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-500">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Redirigiendo...</span>
            </div>
        </div>
    );
};

export default App;
