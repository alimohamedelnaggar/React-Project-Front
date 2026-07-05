import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShoppingCart, Clock, Star, UtensilsCrossed, ChefHat, Heart, UserPlus } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Fresh Ingredients',
    desc: 'We source only the freshest ingredients daily for every dish we serve.',
    color: 'from-orange-400 to-amber-500',
  },
  {
    icon: Clock,
    title: 'Fast Delivery',
    desc: 'Hot meals delivered to your doorstep in under 30 minutes or it\'s free.',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    icon: Star,
    title: 'Top Rated',
    desc: 'Rated 4.9/5 by our community of over 10,000 happy food lovers.',
    color: 'from-purple-400 to-pink-500',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    desc: 'Every meal is prepared with passion and care by our expert chefs.',
    color: 'from-red-400 to-rose-500',
  },
];

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '150+', label: 'Menu Items' },
  { value: '30min', label: 'Avg. Delivery' },
  { value: '4.9', label: 'User Rating' },
];

const categories = [
  { name: 'Pizza', emoji: '🍕', desc: 'Wood-fired perfection' },
  { name: 'Burgers', emoji: '🍔', desc: 'Juicy and fresh' },
  { name: 'Sushi', emoji: '🍣', desc: 'Authentic flavors' },
  { name: 'Desserts', emoji: '🍰', desc: 'Sweet indulgence' },
  { name: 'Salads', emoji: '🥗', desc: 'Fresh and healthy' },
  { name: 'Drinks', emoji: '🥤', desc: 'Refreshing beverages' },
];

export default function Landing() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-stone-900 dark:via-stone-950 dark:to-stone-900">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-200/30 dark:bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-200/30 dark:bg-amber-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-orange-100/20 to-amber-100/20 dark:from-orange-500/3 dark:to-amber-500/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 py-20 sm:py-28 lg:py-36">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                Delicious food, delivered fast
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mb-6 animate-fade-in-up">
                Taste the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400">
                  Difference
                </span>
                <br />
                <span className="text-4xl sm:text-5xl lg:text-6xl text-stone-700 dark:text-stone-300">
                  Every Bite Matters
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in">
                Explore our carefully crafted menu of mouth-watering dishes made with
                the freshest ingredients. From appetizers to desserts, every bite is a delight.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up">
                <Link
                  to="/menu"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl text-lg transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                >
                  Explore Menu
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-semibold rounded-xl text-lg border-2 border-stone-200 dark:border-stone-700 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md transition-all duration-300"
                >
                  <UserPlus className="w-5 h-5" />
                  Get Started
                </Link>
              </div>
            </div>

            <div className="flex-1 relative animate-fade-in">
              <div className="relative w-full max-w-lg mx-auto">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-stone-800 dark:to-stone-700 flex items-center justify-center overflow-hidden shadow-2xl">
                  <div className="text-center p-8">
                    <div className="text-8xl sm:text-9xl mb-4">🍽️</div>
                    <h3 className="text-2xl font-bold text-stone-700 dark:text-stone-300 mb-2">
                      Premium Dining
                    </h3>
                    <p className="text-stone-500 dark:text-stone-400">
                      Experience the best of international cuisine
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-orange-500 rounded-2xl -rotate-12 flex items-center justify-center shadow-lg animate-pulse-glow">
                  <UtensilsCrossed className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-amber-400 rounded-2xl rotate-12 flex items-center justify-center shadow-lg">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-stone-900 border-y border-stone-100 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-orange-600 dark:text-orange-400">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Why Choose Foodie?
          </h2>
          <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
            We're committed to providing you with the best food experience
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 card-hover hover:border-transparent"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/5 to-amber-500/5 dark:from-orange-500/10 dark:to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={`relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="relative text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                {feature.title}
              </h3>
              <p className="relative text-stone-500 dark:text-stone-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-stone-50 dark:bg-stone-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Explore Our Categories
            </h2>
            <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
              From classic favorites to exotic delights, we have something for everyone
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to="/menu"
                className="group bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 text-center card-hover"
              >
                <span className="text-4xl block mb-3 group-hover:scale-125 transition-transform duration-300">
                  {cat.emoji}
                </span>
                <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {cat.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Satisfy Your Cravings?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of happy customers and get your favorite meals delivered in minutes
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-orange-600 font-semibold rounded-xl text-lg hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <UserPlus className="w-5 h-5" />
              Create Free Account
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5" />
              View Menu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
