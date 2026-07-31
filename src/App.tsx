import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const PHOTOS = {
  hero: '/photos/IMG_0153.jpg',
  tools: '/photos/IMG_0202.jpg',
  bathHappy: '/photos/IMG_0098.jpg',
  bathAussie: '/photos/IMG_0273.jpg',
  wetDog: '/photos/IMG_0256.jpg',
  cat: '/photos/IMG_0384.jpg',
  wetCat: '/photos/IMG_0365.jpg',
  fur: '/photos/IMG_0229.jpg',
  fluff: '/photos/IMG_0139.jpg',
  close: '/photos/IMG_0347.jpg',
  table: '/photos/IMG_0180.jpg',
  result: '/photos/IMG_0280.jpg',
  punch: '/photos/IMG_0277.jpg',
} as const

const GALLERY = [
  { src: PHOTOS.bathAussie, wide: true },
  { src: PHOTOS.cat, wide: false },
  { src: PHOTOS.wetDog, wide: false },
  { src: PHOTOS.tools, wide: true },
  { src: PHOTOS.bathHappy, wide: false },
  { src: PHOTOS.fluff, wide: false },
  { src: PHOTOS.close, wide: true },
  { src: PHOTOS.wetCat, wide: false },
  { src: PHOTOS.table, wide: false },
  { src: PHOTOS.result, wide: true },
  { src: PHOTOS.fur, wide: false },
]

const STORY = [
  {
    src: PHOTOS.bathHappy,
    kicker: '01 — Приезд',
    title: 'Студия\nу вашего порога',
    text: 'Оборудование, инструменты, профессиональный стол. Всё приезжает к вам — питомец остаётся дома.',
  },
  {
    src: PHOTOS.tools,
    kicker: '02 — Инструмент',
    title: 'Японская\nсталь. Точка.',
    text: 'VG10, 440C, филировочные и прямые. Работаем только профессиональным инструментом — без компромиссов.',
  },
  {
    src: PHOTOS.wetDog,
    kicker: '03 — Уход',
    title: 'Ванна,\nкоторая\nне пугает',
    text: 'Мягко. Чисто. Без суеты. Собаки и кошки чувствуют ритм — и расслабляются.',
  },
  {
    src: PHOTOS.cat,
    kicker: '04 — Результат',
    title: 'Взгляд,\nкоторый\nостанавливает',
    text: 'Шерсть, силуэт, характер. После сессии питомец выглядит так, будто сошёл с обложки.',
  },
]

const SERVICES = [
  {
    name: 'Комплексный груминг',
    desc: 'Мытьё, сушка, стрижка, вычёсывание, гигиена. Полный цикл у вас дома.',
    tag: 'Хит',
  },
  {
    name: 'Гигиенический',
    desc: 'Лапы, глаза, уши, когти, санация. Быстро и аккуратно.',
    tag: 'От 40 мин',
  },
  {
    name: 'Стрижка под породу',
    desc: 'От тедди до шоу-груминга. Форма, которая держит характер.',
    tag: 'Собаки',
  },
  {
    name: 'Кошачий груминг',
    desc: 'Вычёсывание, гигиена, стрижка когтей. Без стресса для кота и для вас.',
    tag: 'Кошки',
  },
]

function App() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      let lenis: Lenis | null = null
      let rafId = 0

      if (!reduced) {
        lenis = new Lenis({
          duration: 1.15,
          smoothWheel: true,
          touchMultiplier: 1.1,
        })
        lenis.on('scroll', ScrollTrigger.update)
        const raf = (time: number) => {
          lenis?.raf(time)
          rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)
      }

      // ——— Hero enter ———
      const heroIntro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      heroIntro
        .to('.hero__brand', { clipPath: 'inset(0 0 0% 0)', duration: 1.1 }, 0.15)
        .to('.hero__headline', { opacity: 1, y: 0, duration: 0.85 }, 0.45)
        .to('.hero__sub', { opacity: 1, y: 0, duration: 0.75 }, 0.6)
        .to('.hero__actions', { opacity: 1, y: 0, duration: 0.7 }, 0.75)
        .to('.hero__scroll', { opacity: 1, duration: 0.6 }, 1)
        .fromTo('.hero__scroll-line', { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, 1)

      if (!reduced) {
        gsap.to('.hero__media img', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // ——— Marquee ———
      if (!reduced) {
        gsap.to('.marquee__track', {
          xPercent: -50,
          ease: 'none',
          duration: 28,
          repeat: -1,
        })
      }

      // ——— Manifesto ———
      gsap.to('.manifesto__line span', {
        y: 0,
        duration: reduced ? 0.2 : 0.95,
        ease: 'power3.out',
        stagger: reduced ? 0 : 0.12,
        scrollTrigger: {
          trigger: '.manifesto',
          start: 'top 70%',
        },
      })

      // ——— Sticky story ———
      const slides = gsap.utils.toArray<HTMLElement>('.story__slide')
      const dots = gsap.utils.toArray<HTMLElement>('.story__dot')

      if (slides.length) {
        slides[0].classList.add('is-active')
        dots[0]?.classList.add('is-active')

        const storyTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.story',
            start: 'top top',
            end: () => `+=${slides.length * 100}%`,
            pin: '.story__pin',
            scrub: reduced ? false : 0.65,
            anticipatePin: 1,
            onUpdate: (self) => {
              const idx = Math.min(
                slides.length - 1,
                Math.floor(self.progress * slides.length),
              )
              slides.forEach((el, i) => {
                el.classList.toggle('is-active', i === idx)
              })
              dots.forEach((el, i) => {
                el.classList.toggle('is-active', i === idx)
              })
            },
          },
        })

        slides.forEach((slide, i) => {
          const img = slide.querySelector('img')
          if (img && !reduced) {
            storyTl.fromTo(
              img,
              { yPercent: -4, scale: 1.08 },
              { yPercent: 6, scale: 1, ease: 'none', duration: 1 },
              i,
            )
          } else {
            storyTl.to({}, { duration: 1 }, i)
          }
        })
      }

      // ——— Punch ———
      if (!reduced) {
        gsap.fromTo(
          '.punch__text',
          { scale: 0.82, opacity: 0.35 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.punch',
              start: 'top 80%',
              end: 'center center',
              scrub: true,
            },
          },
        )
        gsap.to('.punch__bg img', {
          yPercent: 10,
          scale: 1.12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.punch',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // ——— Gallery horizontal ———
      const rail = document.querySelector<HTMLElement>('.gallery__rail')
      if (rail) {
        const getScroll = () =>
          Math.max(0, rail.scrollWidth - window.innerWidth + 48)

        gsap.to(rail, {
          x: () => -getScroll(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.gallery',
            start: 'top top',
            end: () => `+=${getScroll()}`,
            pin: true,
            scrub: reduced ? false : 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })

        if (!reduced) {
          gsap.utils.toArray<HTMLElement>('.gallery__item img').forEach((img) => {
            gsap.fromTo(
              img,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: 'none',
                scrollTrigger: {
                  trigger: '.gallery',
                  start: 'top top',
                  end: () => `+=${getScroll()}`,
                  scrub: true,
                },
              },
            )
          })
        }
      }

      // ——— Services reveal ———
      gsap.from('.services__item', {
        opacity: 0,
        y: reduced ? 0 : 36,
        duration: reduced ? 0.2 : 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.services__list',
          start: 'top 80%',
        },
      })

      // ——— CTA punctuate ———
      gsap.from('.cta__title', {
        scale: reduced ? 1 : 0.92,
        opacity: 0,
        duration: reduced ? 0.2 : 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cta',
          start: 'top 75%',
        },
      })

      return () => {
        cancelAnimationFrame(rafId)
        lenis?.destroy()
      }
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="site" ref={rootRef}>
      <div className="grain" aria-hidden />

      <header className="nav">
        <a className="nav__brand" href="#top">
          Zaikovski
        </a>
        <nav className="nav__links" aria-label="Навигация">
          <a href="#process">Процесс</a>
          <a href="#gallery">Работы</a>
          <a href="#services">Услуги</a>
          <a className="nav__cta" href="#book">
            Записаться
          </a>
        </nav>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero" aria-label="Zaikovski — груминг на дому">
          <div className="hero__media">
            <img
              src={PHOTOS.hero}
              alt="Пушистый шпиц после профессионального груминга"
              fetchPriority="high"
            />
          </div>
          <div className="hero__veil" aria-hidden />
          <div className="hero__content">
            <h1 className="hero__brand">
              Zaikovski
              <span>Studio</span>
            </h1>
            <p className="hero__headline">Груминг, который приезжает к вам</p>
            <p className="hero__sub">
              Профессиональная студия на дому. Собаки и кошки. Без очередей и
              без стресса.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#book">
                Записаться сейчас
              </a>
              <a className="btn btn--ghost" href="#process">
                Смотреть процесс
              </a>
            </div>
          </div>
          <div className="hero__scroll" aria-hidden>
            <span className="hero__scroll-line" />
            Scroll
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee" aria-hidden>
          <div className="marquee__track">
            {Array.from({ length: 2 }).flatMap((_, copy) =>
              [
                'Не везите — мы приедем',
                'Студия в вашей квартире',
                'Шерсть уровня рекламы',
                'Только профи',
                'Собаки · Кошки',
                'Дома. Чисто. Точно.',
              ].map((t) => (
                <span className="marquee__item" key={`${copy}-${t}`}>
                  {t.includes('рекламы') ? (
                    <>
                      Шерсть уровня <em>рекламы</em>
                    </>
                  ) : (
                    t
                  )}
                  {'  ·'}
                </span>
              )),
            )}
          </div>
        </div>

        {/* MANIFESTO */}
        <section className="manifesto" aria-label="Манифест">
          <p className="manifesto__label">Манифест</p>
          <p className="manifesto__line">
            <span>Не везите.</span>
          </p>
          <p className="manifesto__line manifesto__line--accent">
            <span>Мы приедем.</span>
          </p>
          <p className="manifesto__line">
            <span>Студия —</span>
          </p>
          <p className="manifesto__line">
            <span>в вашей квартире.</span>
          </p>
        </section>

        {/* STORY */}
        <section className="story" id="process" aria-label="Процесс">
          <div className="story__pin">
            <div className="story__slides">
              {STORY.map((slide) => (
                <article className="story__slide" key={slide.kicker}>
                  <img src={slide.src} alt="" />
                  <div className="story__overlay" aria-hidden />
                  <div className="story__copy">
                    <p className="story__kicker">{slide.kicker}</p>
                    <h2 className="story__title">
                      {slide.title.split('\n').map((line) => (
                        <span key={line}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </h2>
                    <p className="story__text">{slide.text}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="story__progress" aria-hidden>
              {STORY.map((s) => (
                <span className="story__dot" key={s.kicker} />
              ))}
            </div>
          </div>
        </section>

        {/* PUNCH */}
        <section className="punch" aria-label="Лозунг">
          <div className="punch__bg">
            <img src={PHOTOS.punch} alt="" />
          </div>
          <div className="punch__veil" aria-hidden />
          <h2 className="punch__text">
            Шерсть как в <em>журнале</em>. Дома.
          </h2>
        </section>

        {/* GALLERY */}
        <section className="gallery" id="gallery" aria-label="Работы">
          <div className="gallery__head">
            <h2 className="gallery__title">
              Работы,
              <br />
              от которых
              <br />
              мурашки
            </h2>
            <p className="gallery__note">
              Реальные кадры с выездов. Без стоков. Без фильтров «идеальной
              жизни».
            </p>
          </div>
          <div className="gallery__rail">
            {GALLERY.map((item) => (
              <figure
                className={`gallery__item${item.wide ? ' gallery__item--wide' : ''}`}
                key={item.src}
              >
                <img src={item.src} alt="Работа студии Zaikovski" loading="lazy" />
              </figure>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section className="services" id="services" aria-label="Услуги">
          <p className="services__label">Услуги</p>
          <h2 className="services__title">Что делаем на выезде</h2>
          <ul className="services__list">
            {SERVICES.map((s, i) => (
              <li className="services__item" key={s.name}>
                <span className="services__num">0{i + 1}</span>
                <div>
                  <p className="services__name">{s.name}</p>
                  <p className="services__desc">{s.desc}</p>
                </div>
                <span className="services__tag">{s.tag}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="cta" id="book" aria-label="Запись">
          <div className="cta__glow" aria-hidden />
          <div className="cta__inner">
            <h2 className="cta__title">
              Хватит возить.
              <br />
              <em>Вызовите студию.</em>
            </h2>
            <p className="cta__sub">
              Напишите породу, район и удобное время — ответим быстро и
              подтвердим выезд.
            </p>
            <div className="cta__actions">
              <a
                className="btn btn--primary"
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
              >
                Написать в Telegram
              </a>
              <a className="btn btn--ghost" href="tel:+70000000000">
                Позвонить
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          <strong>Zaikovski</strong> — груминг на дому
        </p>
        <p>© {new Date().getFullYear()} · Сделано с характером</p>
      </footer>
    </div>
  )
}

export default App
