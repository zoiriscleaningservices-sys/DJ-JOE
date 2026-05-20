// ---------- NAVBAR SCROLL EFFECT ----------
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ---------- ACTIVE NAV LINK UPDATE ----------
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// ---------- SCROLL REVEAL ANIMATIONS ----------
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Trigger counter animation if the element has counters inside
            const counters = entry.target.querySelectorAll('.counter');
            if (counters.length > 0) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // ms
                    const increment = target / (duration / 16); // 60fps
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
                // Remove data-target to prevent re-animation if desired
                // Or let it stay to re-animate (currently setup to re-animate on every scroll up/down if we remove 'active' class, but we don't)
            }
            
            observer.unobserve(entry.target);
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// ---------- FORM SUBMISSION (PREVENT DEFAULT) ----------
const bookingForm = document.querySelector('.booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = bookingForm.querySelector('.submit-btn');
        const originalText = btn.innerText;
        
        btn.innerText = 'SENDING...';
        btn.style.opacity = '0.7';
        btn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            btn.innerText = 'REQUEST SENT!';
            btn.style.background = '#4CAF50';
            btn.style.color = 'white';
            
            setTimeout(() => {
                bookingForm.reset();
                btn.innerText = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.opacity = '1';
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// ---------- LIVE VIDEO PLAYER ----------
const liveVideo = document.getElementById('live-video');
const playVideoBtn = document.getElementById('play-video-btn');

if (liveVideo && playVideoBtn) {
    playVideoBtn.addEventListener('click', () => {
        liveVideo.play();
        liveVideo.controls = true;
        playVideoBtn.style.display = 'none';
        liveVideo.style.filter = 'brightness(1)';
        liveVideo.parentElement.classList.add('playing');
    });
    
    // If video is paused, show button again
    liveVideo.addEventListener('pause', () => {
        playVideoBtn.style.display = 'block';
        liveVideo.controls = false;
        liveVideo.style.filter = 'brightness(0.5)';
        liveVideo.parentElement.classList.remove('playing');
    });
}

// ---------- VIDEO REEL PLAY LOGIC ----------
const hoverVideos = document.querySelectorAll('.hover-video');

if (window.innerWidth > 768) {
    // DESKTOP: Play on hover
    hoverVideos.forEach(video => {
        video.addEventListener('mouseenter', () => {
            video.play();
        });
        
        video.addEventListener('mouseleave', () => {
            video.pause();
        });
    });
} else {
    // MOBILE: Play on scroll when visible
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Play if 50% visible, catch any autoplay block errors
                let playPromise = entry.target.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Autoplay prevented on mobile", error);
                    });
                }
            } else {
                entry.target.pause();
            }
        });
    }, {
        threshold: 0.5
    });

    hoverVideos.forEach(video => {
        videoObserver.observe(video);
    });
}

// ---------- MOBILE MENU TOGGLE ----------
const mobileBtn = document.getElementById('mobile-btn');
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

if (mobileBtn && mobileOverlay) {
    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ---------- FLOATING UI BUTTONS ----------
const bookNowFloat = document.getElementById('book-now-float');
const backToTopBtn = document.getElementById('back-to-top');
let bookNowDismissed = false;

window.addEventListener('scroll', () => {
    // Show buttons after scrolling past the Hero section (100vh)
    if (window.scrollY > window.innerHeight * 0.8) {
        if (!bookNowDismissed && bookNowFloat) {
            bookNowFloat.classList.add('visible');
        }
        if (backToTopBtn) {
            backToTopBtn.classList.add('visible');
        }
    } else {
        if (bookNowFloat) {
            bookNowFloat.classList.remove('visible');
        }
        if (backToTopBtn) {
            backToTopBtn.classList.remove('visible');
        }
    }
});

if (bookNowFloat) {
    bookNowFloat.addEventListener('click', () => {
        // Dismiss the button permanently when clicked
        bookNowDismissed = true;
        bookNowFloat.classList.remove('visible');
    });
}

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ---------- INTERACTIVE FAQ ACCORDION TOGGLE ----------
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const answer = question.nextElementSibling;
        const isCurrentlyActive = item.classList.contains('active');
        
        // Close all other FAQ items first for a single-open accordion feel
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            otherItem.querySelector('.faq-answer').style.maxHeight = null;
        });
        
        // Toggle the current FAQ item
        if (!isCurrentlyActive) {
            item.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
            // Dynamically calculate scroll height for smooth animated transition
            answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
            item.classList.remove('active');
            question.setAttribute('aria-expanded', 'false');
            answer.style.maxHeight = null;
        }
    });
});
