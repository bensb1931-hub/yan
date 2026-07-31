import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const PHOTOS = {
  hero: asset('photos/IMG_0153.jpg'),
  tools: asset('photos/IMG_0202.jpg'),
  bathHappy: asset('photos/IMG_0098.jpg'),
  bathAussie: asset('photos/IMG_0273.jpg'),
  wetDog: asset('photos/IMG_0256.jpg'),
  cat: asset('photos/IMG_0384.jpg'),
  wetCat: asset('photos/IMG_0365.jpg'),
  fur: asset('photos/IMG_0229.jpg'),
  fluff: asset('photos/IMG_0139.jpg'),
  close: asset('photos/IMG_0347.jpg'),
  table: asset('photos/IMG_0180.jpg'),
  result: asset('photos/IMG_0280.jpg'),
  punch: asset('photos/IMG_0277.jpg'),
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

const SECTIONS = [
  { id: 'top', label: 'Старт', num: '01' },
  { id: 'manifesto', label: 'Манифест', num: '02' },
  { id: 'process', label: 'Процесс', num: '03' },
  { id: 'gallery', label: 'Работы', num: '04' },
  { id: 'services', label: 'Услуги', num: '05' },
  { id: 'book', label: 'Запись', num: '06' },
] as const

function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      let rafId = 0
      let lenis: Lenis | null = null

      if (!reduced) {
        lenis = new Lenis({
          duration: 1.2,
          smoothWheel: true,
          touchMultiplier: 1.05,
        })
        lenisRef.current = lenis
        lenis.on('scroll', ScrollTrigger.update)
        const raf = (time: number) => {
          lenis?.raf(time)
          rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)
      }

      const scrollToId = (id: string) => {
        const el = document.getElementById(id)
        if (!el) return
        if (lenis) {
          lenis.scrollTo(el, { offset: 0, duration: 1.35 })
        } else {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }

      // Smooth in-page links
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
        if (!a) return
        const id = a.getAttribute('href')?.slice(1)
        if (!id) return
        e.preventDefault()
        scrollToId(id)
      }
      root.addEventListener('click', onClick)

      // ——— Cursor + 3D gold spotlight ———
      const cursor = root.querySelector<HTMLElement>('.cursor')
      const spotlight = root.querySelector<HTMLElement>('.spotlight')
      const progressFill = root.querySelector<HTMLElement>('.progress__fill')
      const sideLinks = gsap.utils.toArray<HTMLElement>('.side-nav__link')

      let mx = window.innerWidth / 2
      let my = window.innerHeight / 2
      let cx = mx
      let cy = my

      const onMove = (e: PointerEvent) => {
        mx = e.clientX
        my = e.clientY
        root.style.setProperty('--mx', `${mx}px`)
        root.style.setProperty('--my', `${my}px`)

        const nx = (mx / window.innerWidth - 0.5) * 2
        const ny = (my / window.innerHeight - 0.5) * 2
        root.style.setProperty('--tilt-x', `${(-ny * 3.5).toFixed(2)}deg`)
        root.style.setProperty('--tilt-y', `${(nx * 4.5).toFixed(2)}deg`)
      }

      let cursorRaf = 0
      if (finePointer && !reduced) {
        document.documentElement.classList.add('has-cursor')
        window.addEventListener('pointermove', onMove, { passive: true })

        const tickCursor = () => {
          cx += (mx - cx) * 0.22
          cy += (my - cy) * 0.22
          if (cursor) {
            cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
          }
          if (spotlight) {
            spotlight.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
          }
          cursorRaf = requestAnimationFrame(tickCursor)
        }
        cursorRaf = requestAnimationFrame(tickCursor)

        root.querySelectorAll('a, button, .gallery__item, .services__item').forEach((el) => {
          el.addEventListener('pointerenter', () => cursor?.classList.add('is-hot'))
          el.addEventListener('pointerleave', () => cursor?.classList.remove('is-hot'))
        })
      }

      // ——— Scroll progress + active section ———
      const setActive = (id: string) => {
        sideLinks.forEach((link) => {
          link.classList.toggle('is-active', link.dataset.section === id)
        })
      }

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          if (progressFill) {
            progressFill.style.transform = `scaleX(${self.progress})`
          }
        },
      })

      SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id)
        if (!el) return
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActive(s.id),
          onEnterBack: () => setActive(s.id),
        })
      })
      setActive('top')

      // ——— Hero enter + luxury shimmer ———
      const heroIntro = gsap.timeline({ defaults: { ease: 'power3.out', overwrite: 'auto' } })
      heroIntro
        .fromTo('.nav', { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0)
        .fromTo('.side-nav', { x: 28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9 }, 0.2)
        .to('.hero__brand', { opacity: 1, y: 0, duration: 1.05 }, 0.15)
        .to('.hero__headline', { opacity: 1, y: 0, duration: 0.85 }, 0.4)
        .to('.hero__sub', { opacity: 1, y: 0, duration: 0.75 }, 0.55)
        .to('.hero__actions', { opacity: 1, y: 0, duration: 0.7 }, 0.7)
        .to('.hero__scroll', { opacity: 1, duration: 0.6 }, 0.95)
        .fromTo('.hero__scroll-line', { scaleX: 0 }, { scaleX: 1, duration: 0.85 }, 0.95)

      if (!reduced) {
        gsap.to('.hero__media img', {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      if (!reduced) {
        gsap.to('.marquee__track', {
          xPercent: -50,
          ease: 'none',
          duration: 26,
          repeat: -1,
        })
      }

      gsap.to('.manifesto__line span', {
        y: 0,
        duration: reduced ? 0.2 : 1,
        ease: 'power3.out',
        stagger: reduced ? 0 : 0.14,
        scrollTrigger: {
          trigger: '.manifesto',
          start: 'top 72%',
        },
      })

      // Sticky story
      const slides = gsap.utils.toArray<HTMLElement>('.story__slide')
      const dots = gsap.utils.toArray<HTMLElement>('.story__dot')

      if (slides.length) {
        slides[0].classList.add('is-active')
        dots[0]?.classList.add('is-active')

        const storyTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.story',
            start: 'top top',
            end: () => `+=${slides.length * 110}%`,
            pin: '.story__pin',
            scrub: reduced ? false : 0.7,
            anticipatePin: 1,
            onUpdate: (self) => {
              const idx = Math.min(
                slides.length - 1,
                Math.floor(self.progress * slides.length),
              )
              slides.forEach((el, i) => el.classList.toggle('is-active', i === idx))
              dots.forEach((el, i) => el.classList.toggle('is-active', i === idx))
            },
          },
        })

        slides.forEach((slide, i) => {
          const img = slide.querySelector('img')
          const copy = slide.querySelector('.story__copy')
          if (img && !reduced) {
            storyTl.fromTo(
              img,
              { yPercent: -5, scale: 1.1, filter: 'brightness(0.7)' },
              { yPercent: 7, scale: 1, filter: 'brightness(1)', ease: 'none', duration: 1 },
              i,
            )
          } else {
            storyTl.to({}, { duration: 1 }, i)
          }
          if (copy && !reduced) {
            storyTl.fromTo(
              copy,
              { y: 40, opacity: 0.2 },
              { y: 0, opacity: 1, ease: 'none', duration: 0.8 },
              i,
            )
          }
        })
      }

      if (!reduced) {
        gsap.fromTo(
          '.punch__text',
          { scale: 0.78, opacity: 0.25, filter: 'blur(8px)' },
          {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: '.punch',
              start: 'top 85%',
              end: 'center center',
              scrub: true,
            },
          },
        )
        gsap.to('.punch__bg img', {
          yPercent: 12,
          scale: 1.15,
          ease: 'none',
          scrollTrigger: {
            trigger: '.punch',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      const rail = document.querySelector<HTMLElement>('.gallery__rail')
      if (rail) {
        const getScroll = () => Math.max(0, rail.scrollWidth - window.innerWidth + 48)
        gsap.to(rail, {
          x: () => -getScroll(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.gallery',
            start: 'top top',
            end: () => `+=${getScroll()}`,
            pin: true,
            scrub: reduced ? false : 0.85,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
        if (!reduced) {
          gsap.utils.toArray<HTMLElement>('.gallery__item img').forEach((img) => {
            gsap.fromTo(
              img,
              { yPercent: -8, scale: 1.08 },
              {
                yPercent: 8,
                scale: 1,
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

      gsap.from('.services__item', {
        opacity: 0,
        y: reduced ? 0 : 42,
        duration: reduced ? 0.2 : 0.75,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.services__list',
          start: 'top 78%',
        },
      })

      gsap.from('.cta__title', {
        scale: reduced ? 1 : 0.9,
        opacity: 0,
        y: reduced ? 0 : 30,
        duration: reduced ? 0.2 : 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cta',
          start: 'top 75%',
        },
      })
      gsap.from('.cta__sub, .cta__actions', {
        opacity: 0,
        y: reduced ? 0 : 24,
        duration: reduced ? 0.2 : 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.cta',
          start: 'top 70%',
        },
      })

      return () => {
        cancelAnimationFrame(rafId)
        cancelAnimationFrame(cursorRaf)
        lenis?.destroy()
        lenisRef.current = null
        root.removeEventListener('click', onClick)
        window.removeEventListener('pointermove', onMove)
        document.documentElement.classList.remove('has-cursor')
      }
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      className="site"
      ref={rootRef}
      style={
        {
          ['--mx' as string]: '50vw',
          ['--my' as string]: '50vh',
          ['--tilt-x' as string]: '0deg',
          ['--tilt-y' as string]: '0deg',
        }
      }
    >
      <div className="spotlight" aria-hidden />
      <div className="cursor" aria-hidden>
        <span className="cursor__dot" />
      </div>
      <div className="grain" aria-hidden />
      <div className="progress" aria-hidden>
        <div className="progress__fill" />
      </div>

      <nav className="side-nav" aria-label="Разделы сайта">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            className="side-nav__link"
            href={`#${s.id}`}
            data-section={s.id}
          >
            <span className="side-nav__num">{s.num}</span>
            <span className="side-nav__label">{s.label}</span>
          </a>
        ))}
      </nav>

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
            <p className="hero__eyebrow">Home luxury grooming</p>
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
          <a className="hero__scroll" href="#manifesto">
            <span className="hero__scroll-line" />
            Дальше
          </a>
        </section>

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

        <section className="manifesto" id="manifesto" aria-label="Манифест">
          <p className="manifesto__label">02 — Манифест</p>
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

        <section className="punch" aria-label="Лозунг">
          <div className="punch__bg">
            <img src={PHOTOS.punch} alt="" />
          </div>
          <div className="punch__veil" aria-hidden />
          <h2 className="punch__text">
            Шерсть как в <em>журнале</em>. Дома.
          </h2>
        </section>

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
              Скролль вбок — реальные кадры с выездов. Без стоков.
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

        <section className="services" id="services" aria-label="Услуги">
          <p className="services__label">05 — Услуги</p>
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

        <section className="cta" id="book" aria-label="Запись">
          <div className="cta__glow" aria-hidden />
          <div className="cta__inner">
            <p className="cta__label">06 — Запись</p>
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
        <p>© {new Date().getFullYear()} · Private mobile atelier</p>
      </footer>
    </div>
  )
}

export default App
