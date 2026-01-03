import { SpotlightCard } from "./spotlight-card"
import { SectionHeader } from "@/components/global-ui/section-header"
import { SectionBadge } from "@/components/global-ui/section-badge"
import { CategoryHeader } from "@/components/global-ui/category-header"

export function MenuSection() {
  return (
    <SpotlightCard className="mx-4 sm:mx-6 lg:mt-4 xl:ml-auto xl:mr-auto max-w-7xl z-10 rounded-[40px]">
      <div className="rounded-[40px] relative overflow-hidden flex flex-col">
        {/* Floating Nav (Sticky) */}
        <div className="sticky top-0 z-40 w-full backdrop-blur-xl bg-card/80 border-b border-black/5 dark:border-white/5 pt-4 pb-4 px-6 sm:px-12">
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar snap-x">
            <a
              href="#cat-viet"
              className="snap-start shrink-0 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all font-geist"
            >
              Vietnamese Specials
            </a>
            <a
              href="#cat-bmc"
              className="snap-start shrink-0 px-4 py-2 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-500/30 transition-all font-geist"
            >
              Bánh Mì Chảo
            </a>
            <a
              href="#cat-sushi"
              className="snap-start shrink-0 px-4 py-2 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-500/30 transition-all font-geist"
            >
              Sushi &amp; Rolls
            </a>
            <a
              href="#cat-wok"
              className="snap-start shrink-0 px-4 py-2 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-500/30 transition-all font-geist"
            >
              Wok &amp; Curry
            </a>
            <a
              href="#cat-start"
              className="snap-start shrink-0 px-4 py-2 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-gray-900 dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 transition-all font-geist"
            >
              Starters
            </a>
          </div>
        </div>

        {/* Header Banner */}
        <div className="relative px-6 py-16 sm:px-12 sm:py-24 text-center border-b border-black/5 dark:border-white/5">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          <SectionHeader
className="mb-0"
            badge={
              <SectionBadge variant="orange" className="shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.243-2.143.5-3.5a6 6 0 1 0 6 6Z" />
            </svg>
            Chef's Hand-Picked Favorites This Week
          </SectionBadge>
            }
            title={
              <>
                The Menu — <span className="text-gray-500 font-geist">Crafted Fresh.</span>
              </>
            }
            description="A fusion of Vietnamese classics, vibrant wok creations, and hand-rolled sushi made with precision and heart."
          />
        </div>

        <div className="p-6 sm:p-12 space-y-24">
          {/* Category 1: Vietnamese Specials */}
          <div id="cat-viet" className="scroll-mt-32">
          <CategoryHeader
            title="Vietnamese Specials"
            subtitle="Traditional & Fresh"
            titleClassName="text-emerald-600 dark:text-emerald-400"
            gradientClassName="from-emerald-100/30 dark:from-emerald-900/10"
            iconClassName="text-emerald-500/50"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            }
          />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "Bún Nem Special",
                  price: "€14.50",
                  description: "Rice noodles, fried spring rolls, fresh herbs, roasted peanuts, lime-fish dressing.",
                  badge: "Signature",
                  badgeColor: "emerald",
                },
                {
                  name: "Bún Hải Sản",
                  price: "€15.90",
                  description: "Vermicelli with mixed seafood, fresh herbs, sweet & sour chili-lime sauce.",
                  badge: "Seafood",
                  badgeColor: "blue",
                },
                {
                  name: "Bún Gà Nướng",
                  price: "€13.90",
                  description: "Grilled lemongrass chicken, crisp vegetables, roasted peanuts.",
                  badge: "Chicken",
                  badgeColor: "gray",
                },
                {
                  name: "Chả Giò Giòn",
                  price: "€6.90",
                  description: "Crispy spring rolls filled with minced pork, mushrooms, and glass noodles.",
                  badge: "Starter",
                  badgeColor: "gray",
                },
              ].map((dish, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-2xl hover:border-emerald-500/30 hover:bg-emerald-500/[0.05] dark:hover:bg-emerald-500/[0.02] transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors font-geist">
                      {dish.name}
                    </h4>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-medium">{dish.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-4">{dish.description}</p>
                  <div className="flex gap-2">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                        dish.badgeColor === "emerald"
                          ? "border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                          : dish.badgeColor === "blue"
                            ? "border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/5"
                            : "border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400"
                      } flex items-center gap-1`}
                    >
                      {dish.badgeColor === "emerald" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      )}
                      {dish.badgeColor === "blue" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6.5 12c.94-2.08 2.55-3 5-3 3.72 0 5.68 1.76 9 2.69 2.57-1.95 3.03-5.04 1.5-7.69-3.25 1.5-5.96 4.45-8 4.45-1.95 0-3.35-1-4.5-2.5C8.03 3.86 6.3 3 4.5 3 2.15 3 1 5 1 8c0 3 1.95 5.5 4 8 1.35 1.65 3.5 2.5 5.5 2.5 3.72 0 6.6-2.5 9-6.5-1.17 3.32-3.13 6.64-5.5 8.16-2.52 1.62-5.71 1.34-8-1.5C3.3 16.5 2.5 13.5 3 10.5" />
                        </svg>
                      )}
                      {dish.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category 2: Bánh Mì Chảo (Gold Feature) */}
          <div id="cat-bmc" className="scroll-mt-32">
            <div className="w-full relative rounded-3xl overflow-hidden group border border-amber-500/20">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200&auto=format&fit=crop)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 dark:from-black via-black/60 dark:via-[#0a0f0c]/90 to-transparent" />

              {/* Steam Animation Overlay */}
              <div className="absolute bottom-10 left-1/4 opacity-30 pointer-events-none">
                <div
                  className="steam-particle w-8 h-8 bg-white blur-xl rounded-full absolute -ml-4"
                  style={{ animation: "steam 3s infinite ease-out" }}
                />
                <div
                  className="steam-particle w-12 h-12 bg-white blur-xl rounded-full absolute ml-4"
                  style={{ animation: "steam 3s infinite ease-out 1s" }}
                />
              </div>

              <div className="relative z-10 p-8 sm:p-12 flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-widest font-geist border border-amber-500/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.243-2.143.5-3.5a6 6 0 1 0 6 6Z" />
                    </svg>
                    House Specialty
                  </div>
                  <h3 className="text-3xl sm:text-5xl text-white font-geist tracking-tighter mb-4">Bánh Mì Chảo</h3>
                  <p className="text-gray-300 text-lg font-light mb-8 max-w-md">
                    Our famous sizzling skillet served with warm baguette. A savory harmony of pate, eggs, and meat
                    bathed in rich sauce.
                  </p>

                  <div className="space-y-4">
                    {[
                      { name: "Original (Beef, Herbs, Eggs)", price: "€14.90" },
                      { name: "Chảo Nem (w/ Spring Rolls)", price: "€15.90" },
                      { name: "Chảo Hải Sản (Seafood)", price: "€17.90" },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-white font-medium font-geist">{item.name}</span>
                        <span className="text-amber-400 font-mono text-lg">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Element */}
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-48 h-48 rounded-full border-4 border-amber-500/20 flex items-center justify-center bg-black/50 backdrop-blur-sm relative group-hover:border-amber-500/50 transition-colors">
                    <span className="text-center">
                      <span className="block text-4xl mb-1">🥘</span>
                      <span className="text-xs text-amber-500 uppercase tracking-widest font-bold">Sizzling Hot</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category 3: Sushi & Rolls (Blue) */}
          <div id="cat-sushi" className="scroll-mt-32">
            <CategoryHeader
                title="Sushi & Rolls"
                subtitle="Hand-rolled & Fresh"
                titleClassName="text-blue-600 dark:text-blue-400"
                gradientClassName="from-blue-100/30 dark:from-blue-900/10"
                iconClassName="text-blue-500/50"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "Rainbow Roll",
                  price: "€12.50",
                  description: "Salmon, tuna, avocado, mango inside out.",
                  badge: "Fresh",
                  badgeColor: "blue",
                },
                {
                  name: "Crispy Ebi Roll",
                  price: "€11.90",
                  description: "Fried shrimp roll topped with spicy mayo.",
                  badge: "Spicy",
                  badgeColor: "red",
                },
                {
                  name: "Dragon Roll",
                  price: "€13.90",
                  description: "Avocado, eel glaze, sesame seeds.",
                  badge: "Cooked",
                  badgeColor: "gray",
                },
                {
                  name: "Sake Sashimi",
                  price: "€10.50",
                  description: "Fresh, thick slices of premium salmon.",
                  badge: "Raw",
                  badgeColor: "blue",
                },
              ].map((dish, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-2xl hover:border-blue-500/30 hover:bg-blue-500/[0.05] dark:hover:bg-blue-500/[0.02] transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors font-geist">
                      {dish.name}
                    </h4>
                    <span className="text-blue-600 dark:text-blue-400 font-mono font-medium">{dish.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-4">{dish.description}</p>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                      dish.badgeColor === "blue"
                        ? "border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/5"
                        : dish.badgeColor === "red"
                          ? "border-red-500/20 text-red-600 dark:text-red-400 bg-red-500/5"
                          : "border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {dish.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category 4: Wok & Curry (Orange) */}
          <div id="cat-wok" className="scroll-mt-32">
            <CategoryHeader
                title="Wok & Curry"
                subtitle="Fire & Spice"
                titleClassName="text-orange-600 dark:text-orange-400"
                gradientClassName="from-orange-100/30 dark:from-orange-900/10"
                iconClassName="text-orange-500/50"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.243-2.143.5-3.5a6 6 0 1 0 6 6Z" />
                  </svg>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: "Xào Sả Ớt",
                  price: "€12.90",
                  description: "Lemongrass chili stir-fried vegetables.",
                  badge: "Spicy",
                  badgeColor: "red",
                },
                {
                  name: "Red Thai Curry",
                  price: "€13.50",
                  description: "Coconut milk, vegetables, chicken or tofu.",
                  badge: "Veg Option",
                  badgeColor: "green",
                },
                {
                  name: "Kung Pao Chicken",
                  price: "€14.50",
                  description: "Spicy wok chicken with crunchy peanuts.",
                  badge: "Classic",
                  badgeColor: "gray",
                },
              ].map((dish, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-2xl hover:border-orange-500/30 hover:bg-orange-500/[0.05] dark:hover:bg-orange-500/[0.02] transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors font-geist">
                      {dish.name}
                    </h4>
                    <span className="text-orange-600 dark:text-orange-400 font-mono font-medium">{dish.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-4">{dish.description}</p>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                      dish.badgeColor === "red"
                        ? "border-red-500/20 text-red-600 dark:text-red-400 bg-red-500/5"
                        : dish.badgeColor === "green"
                          ? "border-green-500/20 text-green-600 dark:text-green-400 bg-green-500/5"
                          : "border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {dish.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category 5: Starters (Gray/Neutral) */}
          <div id="cat-start" className="scroll-mt-32">
            <CategoryHeader
                title="Starters"
                subtitle="Small Bites"
                titleClassName="text-gray-900 dark:text-gray-200"
            />

            <div className="flex flex-col gap-3">
              {[
                {
                  name: "Gỏi Cuốn (Summer Rolls)",
                  description: "Rice paper rolls with shrimp, herbs.",
                  price: "€6.90",
                },
                {
                  name: "Tom Yam Gung",
                  description: "Spicy Thai soup with prawns.",
                  price: "€7.50",
                },
                {
                  name: "Chicken Wings Giòn Rụm",
                  description: "Crispy wings with house glaze.",
                  price: "€8.50",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group border border-transparent hover:border-black/10 dark:hover:border-white/10"
                >
                  <div>
                    <h4 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 font-geist">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 font-mono">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  )
}
