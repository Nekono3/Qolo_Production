document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Nav hide/show on scroll
    let lastScrollY = window.scrollY;
    const nav = document.querySelector('nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 80) {
            // Scrolling down
            nav.classList.add('nav-hidden');
        } else {
            // Scrolling up
            nav.classList.remove('nav-hidden');
        }
        lastScrollY = window.scrollY;
    });

    // Project Modal Logic
    const modal = document.getElementById('project-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalLink = document.getElementById('modal-link');
    const closeModal = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');

    document.querySelectorAll('.marquee-item').forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('p').innerText;
            const img = item.querySelector('img');
            
            // Get original src and handle inline filters
            modalImg.src = img.src;
            modalImg.style.filter = img.style.filter; // Preserve inline filters like hue-rotate

            const desc = item.getAttribute('data-desc') || "Подробное описание проекта...";
            const link = item.getAttribute('data-link') || "#";
            
            modalTitle.innerText = title;
            modalDesc.innerText = desc;
            modalLink.href = link;
            
            modal.classList.add('active');
            // Pause marquee on open
            document.querySelectorAll('.marquee-track').forEach(track => {
                track.style.animationPlayState = 'paused';
            });
        });
    });

    const closeFn = () => {
        modal.classList.remove('active');
        // Resume marquee on close
        document.querySelectorAll('.marquee-track').forEach(track => {
            track.style.animationPlayState = 'running';
        });
    };

    closeModal.addEventListener('click', closeFn);
    modalOverlay.addEventListener('click', closeFn);
});

// Global WhatsApp Order Function
function sendOrder(btn, category) {
    const card = btn.closest('.price-card');
    const checked = card.querySelectorAll('.order-item:checked');
    
    if (checked.length === 0) {
        alert('Выберите хотя бы одну услугу!');
        return;
    }

    let message = `Здравствуйте, я бы хотел заказать из категории "${category}":\n\n`;
    let total = 0;
    
    checked.forEach(item => {
        const name = item.getAttribute('data-name');
        const price = parseInt(item.value);
        const priceText = item.closest('li').querySelector('.feat-price').innerText;
        
        message += `- ${name} (${priceText})\n`;
        total += price;
    });

    message += `\nПримерная стоимость: ${total} сом`;
    
    // Redirect to WhatsApp with the prefilled message
    const whatsappUrl = `https://wa.me/996990033044?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
