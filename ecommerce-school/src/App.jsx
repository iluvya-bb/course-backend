import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Armchair,
  Book,
  School,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
} from "lucide-react";

// NOTE: Make sure you have framer-motion and lucide-react installed:
// npm install framer-motion lucide-react

// Animation Variants for Framer Motion
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Main App Component - E-commerce Homepage
export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#categories", text: "Ангилал" },
    { href: "#featured", text: "Онцлох" },
    { href: "#about", text: "Бидний тухай" },
    { href: "#contact", text: "Холбоо барих" },
  ];

  const categories = [
    {
      id: 1,
      name: "Ширээ, сандал",
      icon: Armchair,
      image:
        "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1974&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Номын сан",
      icon: Book,
      image:
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Анги танхим",
      icon: School,
      image:
        "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Сурагчийн ширээ 'Стандарт'",
      price: "₮180,000",
      image: "https://placehold.co/600x600/FFF7ED/D97706?text=Ширээ",
    },
    {
      id: 2,
      name: "Эргономик сандал 'Комфорт'",
      price: "₮120,000",
      image: "https://placehold.co/600x600/FFF7ED/D97706?text=Сандал",
    },
    {
      id: 3,
      name: "Номын тавиур 'Классик'",
      price: "₮250,000",
      image: "https://placehold.co/600x600/FFF7ED/D97706?text=Тавиур",
    },
    {
      id: 4,
      name: "Багшийн ширээ 'Про'",
      price: "₮350,000",
      image: "https://placehold.co/600x600/FFF7ED/D97706?text=Багшийн+Ширээ",
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800 w-screen overflow-x-hidden">
      {/* Header & Navigation */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <motion.a
              href="#home"
              className="flex items-center space-x-2 text-2xl font-bold text-orange-600"
              whileHover={{ scale: 1.05 }}
            >
              <Armchair size={28} />
              <span>Сургуулийн Тавилга</span>
            </motion.a>

            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-300"
                  whileHover={{ y: -2 }}
                >
                  {link.text}
                </motion.a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-orange-600">
                <Search size={22} />
              </button>
              <button className="text-gray-500 hover:text-orange-600">
                <User size={22} />
              </button>
              <button className="relative text-gray-500 hover:text-orange-600">
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="lg:hidden">
                <motion.button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                  whileTap={{ scale: 0.9 }}
                >
                  <Menu size={24} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <div className="p-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative bg-orange-50">
          <div className="max-w-[1800px] mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="md:w-1/2 text-center md:text-left"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight mb-4"
              >
                Сургалтын орчныг хамтдаа бүтээе
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl max-w-xl mx-auto md:mx-0 mb-8 text-gray-600"
              >
                Орчин үеийн, бат бөх, хүүхдийн биед эвтэйхэн сургуулийн
                тавилгануудыг нэг дороос.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <motion.a
                  href="#featured"
                  className="inline-block bg-orange-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-orange-700 shadow-lg shadow-orange-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  Бүтээгдэхүүн үзэх
                </motion.a>
              </motion.div>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="md:w-1/2"
            >
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1932&auto=format&fit=crop"
                alt="Modern classroom"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-24">
          <div className="max-w-[1800px] mx-auto px-6">
            <motion.h2
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
            >
              Ангиллаар хайх
            </motion.h2>
            <motion.div
              initial="initial"
              whileInView="animate"
              variants={staggerContainer}
              viewport={{ once: true, amount: 0.2 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    variants={fadeInUp}
                    key={category.id}
                    className="relative rounded-2xl overflow-hidden group cursor-pointer h-80 shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-end text-white p-6">
                      <Icon className="w-12 h-12 mb-3" />
                      <h3 className="text-2xl font-bold">{category.name}</h3>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="featured" className="py-24 bg-gray-50">
          <div className="max-w-[1800px] mx-auto px-6">
            <motion.h2
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
            >
              Онцлох бүтээгдэхүүн
            </motion.h2>
            <motion.div
              initial="initial"
              whileInView="animate"
              variants={staggerContainer}
              viewport={{ once: true, amount: 0.2 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {featuredProducts.map((product) => (
                <motion.div
                  variants={fadeInUp}
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden group text-left transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-xl font-extrabold text-orange-600 mb-4">
                      {product.price}
                    </p>
                    <motion.button
                      className="w-full bg-orange-100 text-orange-700 font-semibold p-3 rounded-lg hover:bg-orange-600 hover:text-white transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      Сагсанд нэмэх
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="about" className="py-24">
          <div className="max-w-[1800px] mx-auto px-6">
            <motion.h2
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
            >
              Яагаад биднийг сонгох вэ?
            </motion.h2>
            <motion.div
              initial="initial"
              whileInView="animate"
              variants={staggerContainer}
              viewport={{ once: true, amount: 0.2 }}
              className="grid md:grid-cols-3 gap-12 text-center"
            >
              <motion.div variants={fadeInUp}>
                <div className="inline-block p-5 bg-green-100 text-green-600 rounded-full mb-4">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Бат бөх чанар</h3>
                <p className="text-gray-600">
                  Олон жилийн эдэлгээ даах, өндөр чанарын материалаар хийгдсэн.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <div className="inline-block p-5 bg-blue-100 text-blue-600 rounded-full mb-4">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Орчин үеийн дизайн</h3>
                <p className="text-gray-600">
                  Сургалтын орчинд урам зориг нэмэх, загварлаг шийдлүүд.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <div className="inline-block p-5 bg-orange-100 text-orange-600 rounded-full mb-4">
                  <HeartHandshake className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Эргономик шийдэл</h3>
                <p className="text-gray-600">
                  Хүүхдийн нуруу, биеийн зөв хөгжлийг дэмжсэн загварууд.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-gray-50">
          <div className="max-w-[1800px] mx-auto px-6 text-center">
            <motion.h2
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
            >
              Төслийн санал авах
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.5 }}
              className="max-w-2xl mx-auto text-gray-600 mb-8"
            >
              Сургууль, цэцэрлэгийн тавилгын иж бүрэн шийдэл, үнийн санал авахыг
              хүсвэл бидэнтэй холбогдоорой.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.5 }}
            >
              <motion.a
                href="#"
                className="inline-block bg-orange-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-orange-700 shadow-lg shadow-orange-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                Холбоо барих
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-[1800px] mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Сургуулийн Тавилга</h3>
              <p className="text-gray-400">
                Сургалтын орчныг чанартай, загварлаг тавилгаар тохижуулна.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Нэмэлт холбоос</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Бидний тухай
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Нууцлалын бодлого
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Үйлчилгээний нөхцөл
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Ангилал</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Ширээ, сандал
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Номын сан
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Анги танхим
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Холбоо барих</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Имэйл: contact@surguuli-tavilga.mn</li>
                <li>Утас: 7712-3456</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Сургуулийн Тавилга ХХК. Бүх эрх
              хуулиар хамгаалагдсан.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
