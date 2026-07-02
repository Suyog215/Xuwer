document.addEventListener("DOMContentLoaded", () => {
    
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 0. DYNAMIC NAV HEIGHT CALCULATION
    // ==========================================
    const updateNavHeight = () => {
        const navbar = document.querySelector(".navbar");
        if (navbar) {
            document.documentElement.style.setProperty("--nav-height", `${navbar.offsetHeight}px`);
        }
    };
    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);

    // ==========================================
    // 1. HERO ANIMATION
    // ==========================================
    gsap.fromTo(
        ".hero-content > *",
        { y: 40, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            stagger: 0.15, 
            ease: "power3.out",
            delay: 0.2
        }
    );

    // Abstract Hero Background Parallax
    gsap.to(".hero-abstract", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // ==========================================
    // 2. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll(".gs-reveal");
    
    revealElements.forEach((el) => {
        gsap.fromTo(el, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%", // trigger when top of element is 85% down the viewport
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // ==========================================
    // 3. NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(9, 9, 11, 0.85)";
            navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.5)";
        } else {
            navbar.style.background = "rgba(9, 9, 11, 0.7)";
            navbar.style.boxShadow = "none";
        }
    });

    // ==========================================
    // 4. STATS COUNTER ANIMATION
    // ==========================================
    const statNumbers = document.querySelectorAll(".stat-num");
    
    statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute("data-target"));
        
        ScrollTrigger.create({
            trigger: stat,
            start: "top 90%",
            onEnter: () => {
                gsap.to(stat, {
                    innerHTML: target,
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerHTML: 1 },
                    onUpdate: function() {
                        stat.innerHTML = Math.round(this.targets()[0].innerHTML) + (target > 90 ? (target > 100 ? "K+" : "%") : "+");
                    }
                });
            },
            once: true
        });
    });

    // ==========================================
    // 5. FAQ ACCORDION
    // ==========================================
    const faqItems = document.querySelectorAll(".faq-item");
    
    faqItems.forEach(item => {
        const btn = item.querySelector(".faq-q");
        const answer = item.querySelector(".faq-a");
        const icon = item.querySelector("svg");
        
        btn.addEventListener("click", () => {
            const isExpanded = btn.getAttribute("aria-expanded") === "true";
            
            // Close all others
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector(".faq-q").setAttribute("aria-expanded", "false");
                    otherItem.querySelector(".faq-a").style.maxHeight = null;
                    gsap.to(otherItem.querySelector("svg"), { rotation: 0, duration: 0.3 });
                }
            });
            
            // Toggle current
            btn.setAttribute("aria-expanded", !isExpanded);
            
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + "px";
                gsap.to(icon, { rotation: 180, duration: 0.3 });
            } else {
                answer.style.maxHeight = null;
                gsap.to(icon, { rotation: 0, duration: 0.3 });
            }
        });
    });

    // ==========================================
    // 6. NAV SCROLL SPY
    // ==========================================
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");
    
    window.addEventListener("scroll", () => {
        let current = "";
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });

    // ==========================================
    // 7. MOBILE MENU LOGIC
    // ==========================================
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileNav = document.getElementById("mobile-nav");
    const mobileNavOverlay = document.getElementById("mobile-nav-overlay");
    const closeMenuBtn = document.getElementById("close-menu-btn");
    const mobileNavLinks = mobileNav ? mobileNav.querySelectorAll("a") : [];

    if (mobileMenuBtn && mobileNav && mobileNavOverlay && closeMenuBtn) {
        const toggleMenu = () => {
            const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
            mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);
            
            if (!isExpanded) {
                mobileNav.classList.add("active");
                mobileNavOverlay.classList.add("active");
                document.body.classList.add("menu-open");
                document.body.style.overflow = "hidden";
            } else {
                mobileNav.classList.remove("active");
                mobileNavOverlay.classList.remove("active");
                document.body.classList.remove("menu-open");
                document.body.style.overflow = "";
            }
        };

        mobileMenuBtn.addEventListener("click", toggleMenu);
        closeMenuBtn.addEventListener("click", toggleMenu);
        mobileNavOverlay.addEventListener("click", toggleMenu);

        mobileNavLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (mobileNav.classList.contains("active")) {
                    toggleMenu();
                }
            });
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && mobileNav.classList.contains("active")) {
                toggleMenu();
                mobileMenuBtn.focus();
            }
        });
    }

});
