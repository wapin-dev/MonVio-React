import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, LineChartIcon, ShieldCheckIcon, CreditCardIcon, ChevronRightIcon, CheckCircleIcon, TrendingUpIcon, BarChartIcon, PieChartIcon } from 'lucide-react';
const GetStarted = () => {
  const [scrolled, setScrolled] = useState(false);
  const [animateHero, setAnimateHero] = useState(false);
  const [animateFeatures, setAnimateFeatures] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setAnimateHero(window.scrollY < 100);
      setAnimateFeatures(window.scrollY > window.innerHeight / 3);
    };
    // Set initial animation states
    setAnimateHero(true);
    setTimeout(() => {
      setAnimateFeatures(true);
    }, 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 flex flex-col">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated circles */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '2s',
        animationDuration: '8s'
      }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '1s',
        animationDuration: '10s'
      }}></div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNDIxMzkiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48cGF0aCBkPSJNMCAzMGgzMHYzMEgweiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDQpIi8+PHBhdGggZD0iTTMwIDBIMHYzMGgzMHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA0KSIvPjxwYXRoIGQ9Ik0zMCAwaDMwdjMwSDMweiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDQpIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      </div>

      {/* Header */}
      <header className={`w-full py-5 px-4 sm:px-6 lg:px-8 backdrop-blur-lg fixed top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/40 shadow-lg shadow-blue-900/20' : 'bg-transparent'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg shadow-blue-500/30 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-white font-bold text-lg relative z-10">
                M
              </span>
            </div>
            <span className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              monviso
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors px-4 py-2 text-sm relative group">
              Connexion
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-4 py-2 text-sm font-medium shadow-lg shadow-blue-700/20 transition-all hover:shadow-xl hover:shadow-blue-700/40 hover:-translate-y-0.5">
              S'inscrire
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-24 lg:py-32 mt-16">
        <div className="container mx-auto text-center max-w-4xl relative">
          {/* Animated highlight elements */}
          <div className={`absolute -top-20 right-0 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl transition-opacity duration-1000 ${animateHero ? 'opacity-60' : 'opacity-0'}`}></div>
          <div className={`absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl transition-opacity duration-1000 ${animateHero ? 'opacity-60' : 'opacity-0'}`}></div>
          <div className={`transition-all duration-1000 ${animateHero ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-6 inline-block">
              <div className="px-4 py-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-md rounded-full border border-blue-700/30 text-sm text-blue-300 shadow-lg shadow-blue-900/20">
                <span className="mr-2">✨</span> Prenez le contrôle de vos
                finances
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 animate-gradient-x">
                Gérez votre argent avec intelligence
              </span>
              <div className="absolute -right-8 top-0 text-blue-300 animate-bounce hidden md:block">
                <BarChartIcon size={28} className="rotate-12" />
              </div>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto relative z-10">
              Monviso transforme la façon dont vous suivez vos dépenses, gérez
              votre budget et
              <span className="text-blue-300 font-semibold">
                {' '}
                atteignez vos objectifs financiers
              </span>{' '}
              avec une interface moderne et intuitive.
            </p>
          </div>
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 transition-all duration-1000 delay-300 ${animateHero ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
            <Link to="/signup" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl px-8 py-4 text-lg font-medium shadow-xl shadow-blue-700/20 flex items-center justify-center transition-all hover:shadow-2xl hover:shadow-blue-700/40 hover:-translate-y-1 group">
              <span>Commencer gratuitement</span>
              <ArrowRightIcon size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto bg-white/5 backdrop-blur-md hover:bg-white/10 text-white rounded-xl px-8 py-4 text-lg font-medium border border-white/10 shadow-lg flex items-center justify-center transition-all hover:-translate-y-1 hover:border-white/20">
              Se connecter
            </Link>
          </div>
          {/* Stats */}
          <div className={`mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto transition-all duration-1000 delay-500 ${animateHero ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-blue-300 mb-1">+30%</div>
              <div className="text-sm text-gray-400">
                d'économies en moyenne
              </div>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-purple-300 mb-1">
                +10k
              </div>
              <div className="text-sm text-gray-400">utilisateurs actifs</div>
            </div>
            <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-cyan-300 mb-1">4.9/5</div>
              <div className="text-sm text-gray-400">note moyenne</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 backdrop-blur-md bg-black/20 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <div className={`max-w-xl mx-auto text-center mb-16 transition-all duration-1000 ${animateFeatures ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-md rounded-full text-xs text-blue-300 font-medium mb-4 border border-blue-700/30">
              <span className="flex items-center">
                <CheckCircleIcon size={14} className="mr-1" />
                Fonctionnalités avancées
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-6">
              Une expérience financière complète
            </h2>
            <p className="text-gray-300 text-lg">
              Découvrez pourquoi des milliers d'utilisateurs font confiance à
              monviso pour gérer leurs finances au quotidien.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className={`bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-xl group hover:border-blue-700/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-1000 delay-100 ${animateFeatures ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-5 shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 transition-all">
                <LineChartIcon size={28} className="text-blue-100" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                Suivi des dépenses
                <ChevronRightIcon size={18} className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-gray-300">
                Visualisez où va votre argent avec des graphiques interactifs et
                des catégories personnalisables pour mieux comprendre vos
                habitudes de dépenses.
              </p>
              <div className="mt-5 pt-5 border-t border-gray-700/50">
                <div className="flex items-center text-sm text-gray-400">
                  <TrendingUpIcon size={16} className="mr-2 text-blue-400" />
                  Analyses détaillées et tendances
                </div>
              </div>
            </div>
            {/* Feature 2 */}
            <div className={`bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-xl group hover:border-purple-700/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/20 transition-all duration-1000 delay-300 ${animateFeatures ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-5 shadow-lg shadow-purple-600/20 group-hover:shadow-purple-600/40 transition-all">
                <ShieldCheckIcon size={28} className="text-purple-100" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                Sécurité avancée
                <ChevronRightIcon size={18} className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-gray-300">
                Vos données financières sont protégées par un chiffrement de
                niveau bancaire. Nous ne stockons jamais vos identifiants
                bancaires.
              </p>
              <div className="mt-5 pt-5 border-t border-gray-700/50">
                <div className="flex items-center text-sm text-gray-400">
                  <CheckCircleIcon size={16} className="mr-2 text-purple-400" />
                  Conformité RGPD et sauvegardes automatiques
                </div>
              </div>
            </div>
            {/* Feature 3 */}
            <div className={`bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-xl group hover:border-green-700/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-900/20 transition-all duration-1000 delay-500 ${animateFeatures ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mb-5 shadow-lg shadow-green-600/20 group-hover:shadow-green-600/40 transition-all">
                <PieChartIcon size={28} className="text-green-100" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                Gestion budgétaire
                <ChevronRightIcon size={18} className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-gray-300">
                Créez des budgets personnalisés et recevez des alertes
                intelligentes pour rester sur la bonne voie et atteindre vos
                objectifs financiers.
              </p>
              <div className="mt-5 pt-5 border-t border-gray-700/50">
                <div className="flex items-center text-sm text-gray-400">
                  <CreditCardIcon size={16} className="mr-2 text-green-400" />
                  Prévisions et objectifs d'épargne
                </div>
              </div>
            </div>
          </div>
          {/* Testimonial */}
          <div className={`mt-16 bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-lg rounded-2xl p-8 border border-blue-700/30 shadow-2xl max-w-4xl mx-auto transition-all duration-1000 delay-700 ${animateFeatures ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0 flex items-center justify-center text-2xl font-bold text-white">
                SD
              </div>
              <div className="flex-1">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>)}
                </div>
                <p className="text-lg text-white italic mb-4">
                  "Monviso a complètement changé ma façon de gérer mon budget.
                  L'interface est intuitive et les analyses m'ont permis
                  d'économiser plus de 200€ par mois sans effort."
                </p>
                <div className="font-medium">
                  <span className="text-white">Sophie Dubois</span>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-gray-300">Designer, Paris</span>
                </div>
              </div>
            </div>
          </div>
          {/* CTA */}
          <div className={`mt-16 text-center transition-all duration-1000 delay-900 ${animateFeatures ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
            <Link to="/signup" className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl px-8 py-4 text-lg font-medium shadow-xl shadow-blue-700/20 transition-all hover:shadow-2xl hover:shadow-blue-700/40 hover:-translate-y-1 group">
              <span>Découvrir toutes les fonctionnalités</span>
              <ArrowRightIcon size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 backdrop-blur-md bg-black/30 border-t border-white/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg shadow-blue-500/30 flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                monviso
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-6 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                À propos
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                Fonctionnalités
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                Tarifs
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                FAQ
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                Contact
              </a>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-white/20 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-white/20 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-white/20 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2023 monviso. Tous droits réservés.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default GetStarted;