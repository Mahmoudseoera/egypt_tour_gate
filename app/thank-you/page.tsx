export default function ThankYouPage() {
  const styles =`
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slide-in-left {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slide-in-right {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes bounce-in {
    from {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      transform: scale(1.1);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes draw-check {
    0% {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
    }
    100% {
      stroke-dasharray: 100;
      stroke-dashoffset: 0;
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out;
    animation-fill-mode: both;
  }

  .animate-slide-in-left {
    animation: slide-in-left 0.8s ease-out;
    animation-fill-mode: both;
  }

  .animate-slide-in-right {
    animation: slide-in-right 0.8s ease-out;
    animation-fill-mode: both;
  }

  .animate-scale-in {
    animation: scale-in 0.6s ease-out;
    animation-fill-mode: both;
  }

  .animate-bounce-in {
    animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    animation-fill-mode: both;
  }

  .animate-draw-check {
    animation: draw-check 0.8s ease-out 0.4s;
    animation-fill-mode: both;
  }

`;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 overflow-hidden relative">
      {/* Decorative Background Elements with Animations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Airplane */}
        <div className="absolute top-20 left-12 animate-bounce" style={{ animationDuration: '3s' }} >
          <svg width="60" height="60" viewBox="0 0 100 100" className="text-teal-500 opacity-60">
            <path d="M50 40 L30 50 L20 48 L50 40 Z M50 40 L30 30 L20 32 L50 40 Z M50 40 L80 40 L90 45 L85 50 L80 40 Z M85 50 L88 55 L82 53 Z" fill="currentColor"/>
          </svg>
        </div>

        {/* Animated Dotted Paths */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-40">
          <path 
            d="M 100 100 Q 400 200, 700 100" 
            stroke="#5eabc7" 
            strokeWidth="2" 
            strokeDasharray="6,10" 
            fill="none"
            className="animate-pulse"
          />
          <path 
            d="M 1000 150 Q 700 250, 400 350" 
            stroke="#5eabc7" 
            strokeWidth="2" 
            strokeDasharray="6,10" 
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '0.5s' }}
          />
        </svg>

        {/* Animated Decorative Circles */}
        <div className="absolute top-16 right-20 w-6 h-6 bg-teal-400 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-24 left-16 w-8 h-8 bg-teal-300 rounded-full opacity-40 animate-bounce" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-5 h-5 bg-blue-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Animated Plus Signs */}
        <div className="absolute bottom-32 right-32 text-teal-400 text-3xl opacity-40 animate-pulse">+</div>
        <div className="absolute top-1/4 left-1/4 text-teal-400 text-3xl opacity-40 animate-pulse" style={{ animationDelay: '0.7s' }}>+</div>
      </div>

      {/* Main Content Card with Animations */}
      <div className="relative z-10 bg-white p-12 rounded-3xl shadow-2xl text-center max-w-lg mx-4 animate-fade-in-up">
        {/* Top Decorative Bar */}
        <div className="w-20 h-1.5 mx-auto mb-8 bg-[#e3b75e] animate-slide-in-left"></div>
        
        {/* Icon Circle with Animation */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg bg-[#272262] animate-scale-in"
             style={{ animationDelay: '0.2s' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-check">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#272262] animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          Thank You!
        </h1>

        {/* Subheading */}
        <p className="text-xl mb-6 text-[#e3b75e] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Your Journey Begins Here
        </p>

        {/* Message */}
        <p className="text-gray-600 text-lg leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          Your message has been sent successfully. Our travel experts will contact you soon to craft your perfect Egyptian adventure.
        </p>

        {/* Additional Info */}
        <div className="pt-6 border-t border-gray-200 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-gray-500">
            Expected response time: <span className="font-semibold text-[#e3b75e]">24 hours</span>
          </p>
        </div>

        {/* Bottom Decorative Bar */}
        <div className="w-16 h-1 mx-auto mt-8 bg-[#e3b75e] animate-slide-in-right" style={{ animationDelay: '0.7s' }}></div>
      </div>

      {/* WhatsApp Button with Animation */}
      <div className="fixed bottom-8 left-8 z-20 animate-bounce-in" style={{ animationDelay: '0.8s' }}>
        <button className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
      </div>
    </section>
    </>
  );
}
